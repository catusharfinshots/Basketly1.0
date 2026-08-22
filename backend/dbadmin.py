"""Admin-only, read-only database viewer.

Lists collections with counts and returns paginated documents with sensitive
fields redacted. Admin-authenticated; safe for use on the live site.
"""
from __future__ import annotations

import re
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from auth import build_current_user_dep

# Collections that are safe to browse from the admin console.
ALLOWED = ["users", "leads", "analyst_portfolios", "analyst_invites", "content", "status_checks"]

# Field names (case-insensitive substring match) whose values are redacted.
SENSITIVE = ("password", "hash", "secret", "token", "code_hash")


def _redact(value):
    if isinstance(value, dict):
        return {k: ("••• redacted •••" if any(s in k.lower() for s in SENSITIVE) else _redact(v)) for k, v in value.items()}
    if isinstance(value, list):
        return [_redact(v) for v in value]
    return value


def build_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/admin/db", tags=["db-admin"])
    require_admin = build_current_user_dep(db, ["admin"])

    @router.get("/collections")
    async def collections(_: dict = Depends(require_admin)):
        existing = await db.list_collection_names()
        out = []
        for name in ALLOWED:
            if name in existing:
                out.append({"name": name, "count": await db[name].count_documents({})})
        return {"collections": out}

    @router.get("/{collection}")
    async def documents(
        collection: str,
        skip: int = Query(0, ge=0),
        limit: int = Query(25, ge=1, le=100),
        q: Optional[str] = Query(None),
        _: dict = Depends(require_admin),
    ):
        if collection not in ALLOWED:
            raise HTTPException(status_code=404, detail="Collection not available")
        query = {}
        if q:
            rx = {"$regex": re.escape(q), "$options": "i"}
            query = {"$or": [{f: rx} for f in ("email", "name", "type", "status", "id", "owner_name")]}
        total = await db[collection].count_documents(query)
        cursor = db[collection].find(query, {"_id": 0})
        try:
            cursor = cursor.sort("created_at", -1)
        except Exception:  # noqa: BLE001
            pass
        docs = await cursor.skip(skip).limit(limit).to_list(limit)
        return {"collection": collection, "total": total, "skip": skip, "limit": limit, "documents": [_redact(d) for d in docs]}

    return router
