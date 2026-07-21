"""Zerodha Kite Connect integration.

Exposes a small router that handles:
- login-url generation
- request_token -> access_token exchange
- connection status per user
- holdings + margins pull
- disconnect

We deliberately keep the frontend agnostic of the api_secret; only the
backend uses it to exchange the request_token.
"""
from __future__ import annotations

import os
import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorDatabase

try:
    from kiteconnect import KiteConnect  # type: ignore
except Exception:  # pragma: no cover
    KiteConnect = None  # type: ignore

logger = logging.getLogger(__name__)

KITE_API_KEY = os.environ.get("KITE_API_KEY", "").strip()
KITE_API_SECRET = os.environ.get("KITE_API_SECRET", "").strip()


class ExchangeRequest(BaseModel):
    user_id: str = Field(..., min_length=6, max_length=64)
    request_token: str


class DisconnectRequest(BaseModel):
    user_id: str


def _kite_client(access_token: Optional[str] = None) -> "KiteConnect":
    if KiteConnect is None:
        raise HTTPException(status_code=500, detail="kiteconnect library not installed")
    if not KITE_API_KEY or not KITE_API_SECRET:
        raise HTTPException(status_code=500, detail="Kite API key/secret not configured on server")
    k = KiteConnect(api_key=KITE_API_KEY)
    if access_token:
        k.set_access_token(access_token)
    return k


def build_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/broker/kite", tags=["broker-kite"])

    async def _get_conn(user_id: str):
        return await db.broker_connections.find_one({"user_id": user_id, "broker": "kite"})

    @router.get("/login-url")
    async def login_url():
        """Return the Kite login URL for the current API key.

        The frontend opens this in a popup. After the user logs in Kite
        redirects to the configured redirect URL with `request_token`.
        """
        k = _kite_client()
        return {"login_url": k.login_url(), "api_key": KITE_API_KEY}

    @router.post("/exchange")
    async def exchange(payload: ExchangeRequest):
        """Exchange request_token for an access_token and persist."""
        try:
            k = _kite_client()
            data = k.generate_session(payload.request_token, api_secret=KITE_API_SECRET)
        except Exception as e:
            logger.exception("Kite exchange failed")
            raise HTTPException(status_code=400, detail=f"Kite token exchange failed: {e}")

        access_token = data.get("access_token")
        profile = {
            "user_id_kite": data.get("user_id"),
            "user_name": data.get("user_name"),
            "user_shortname": data.get("user_shortname"),
            "email": data.get("email"),
            "broker": data.get("broker"),
            "login_time": str(data.get("login_time")),
        }
        doc = {
            "user_id": payload.user_id,
            "broker": "kite",
            "access_token": access_token,
            "public_token": data.get("public_token"),
            "profile": profile,
            "connected_at": datetime.utcnow(),
        }
        await db.broker_connections.update_one(
            {"user_id": payload.user_id, "broker": "kite"},
            {"$set": doc},
            upsert=True,
        )
        return {"ok": True, "profile": profile}

    @router.get("/status")
    async def status(user_id: str = Query(...)):
        conn = await _get_conn(user_id)
        if not conn:
            return {"connected": False}
        return {
            "connected": True,
            "profile": conn.get("profile", {}),
            "connected_at": conn.get("connected_at").isoformat() if conn.get("connected_at") else None,
        }

    @router.post("/disconnect")
    async def disconnect(payload: DisconnectRequest):
        conn = await _get_conn(payload.user_id)
        if conn and conn.get("access_token"):
            try:
                k = _kite_client(conn["access_token"])
                k.invalidate_access_token()
            except Exception as e:  # noqa: BLE001
                logger.warning("Kite token invalidation failed: %s", e)
        await db.broker_connections.delete_one({"user_id": payload.user_id, "broker": "kite"})
        return {"ok": True}

    @router.get("/holdings")
    async def holdings(user_id: str = Query(...)):
        conn = await _get_conn(user_id)
        if not conn:
            raise HTTPException(status_code=401, detail="Not connected")
        try:
            k = _kite_client(conn["access_token"])
            data = k.holdings()
        except Exception as e:
            logger.exception("Kite holdings error")
            raise HTTPException(status_code=400, detail=f"Kite holdings failed: {e}")
        return {"holdings": data}

    @router.get("/margins")
    async def margins(user_id: str = Query(...)):
        conn = await _get_conn(user_id)
        if not conn:
            raise HTTPException(status_code=401, detail="Not connected")
        try:
            k = _kite_client(conn["access_token"])
            data = k.margins()
        except Exception as e:
            logger.exception("Kite margins error")
            raise HTTPException(status_code=400, detail=f"Kite margins failed: {e}")
        return {"margins": data}

    @router.get("/profile")
    async def profile(user_id: str = Query(...)):
        conn = await _get_conn(user_id)
        if not conn:
            raise HTTPException(status_code=401, detail="Not connected")
        try:
            k = _kite_client(conn["access_token"])
            return {"profile": k.profile()}
        except Exception as e:
            logger.exception("Kite profile error")
            raise HTTPException(status_code=400, detail=f"Kite profile failed: {e}")

    return router
