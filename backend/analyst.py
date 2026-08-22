"""Research-analyst listings: analysts manage their own profile & model
portfolios; admins approve them; approved ones are exposed publicly.

Collections:
  - users (analyst_profile stored on the user doc)
  - analyst_portfolios
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorDatabase

from auth import build_current_user_dep


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class Constituent(BaseModel):
    symbol: str = ""
    name: str = ""
    type: str = "Stock"
    weight: float = 0


class Returns(BaseModel):
    cagr: float = 0
    y1: float = 0
    y3: float = 0
    y5: float = 0


class Factsheet(BaseModel):
    objective: str = ""
    whoShouldInvest: str = ""
    riskFactors: str = ""
    pdfName: str = ""      # metadata only for now (file upload = next phase)


class PortfolioIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    subtitle: str = ""
    strategy: str = "thematic"
    risk: str = "Medium"
    minAmount: int = 5000
    subscription: str = "Free"
    feeAmount: int = 0
    feeCycle: str = "monthly"
    methodology: str = ""
    rebalanceFreq: str = "Quarterly"
    constituents: List[Constituent] = []
    returns: Returns = Returns()
    factsheet: Factsheet = Factsheet()


def _public_view(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


def build_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(tags=["analyst"])
    require_analyst = build_current_user_dep(db, ["analyst"])
    require_admin = build_current_user_dep(db, ["admin"])

    col = db.analyst_portfolios

    # ---------- Analyst: profile ----------
    @router.get("/analyst/profile")
    async def get_profile(user: dict = Depends(require_analyst)):
        prof = user.get("analyst_profile") or {
            "displayName": user.get("name", ""),
            "sebiReg": "",
            "philosophy": "",
            "description": "",
            "logo": (user.get("name", "AN")[:2]).upper(),
        }
        return {"profile": prof}

    @router.put("/analyst/profile")
    async def update_profile(payload: dict = Body(...), user: dict = Depends(require_analyst)):
        allowed = {k: payload.get(k, "") for k in ("displayName", "sebiReg", "philosophy", "description", "logo")}
        await db.users.update_one({"id": user["id"]}, {"$set": {"analyst_profile": allowed}})
        return {"profile": allowed}

    # ---------- Analyst: portfolios ----------
    @router.get("/analyst/portfolios")
    async def my_portfolios(user: dict = Depends(require_analyst)):
        docs = await col.find({"owner_id": user["id"]}, {"_id": 0}).sort("updated_at", -1).to_list(500)
        return {"portfolios": docs}

    @router.post("/analyst/portfolios")
    async def create_portfolio(payload: PortfolioIn, user: dict = Depends(require_analyst)):
        prof = user.get("analyst_profile") or {}
        doc = payload.dict()
        doc.update({
            "id": str(uuid.uuid4()),
            "owner_id": user["id"],
            "owner_name": prof.get("displayName") or user.get("name", ""),
            "status": "draft",
            "review_note": "",
            "created_at": _now(),
            "updated_at": _now(),
        })
        await col.insert_one(dict(doc))
        return {"portfolio": _public_view(doc)}

    @router.put("/analyst/portfolios/{pid}")
    async def update_portfolio(pid: str, payload: PortfolioIn, user: dict = Depends(require_analyst)):
        existing = await col.find_one({"id": pid, "owner_id": user["id"]})
        if not existing:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        doc = payload.dict()
        # editing an approved/pending item sends it back to draft (needs re-submit)
        doc["status"] = "draft"
        doc["updated_at"] = _now()
        await col.update_one({"id": pid}, {"$set": doc})
        merged = await col.find_one({"id": pid}, {"_id": 0})
        return {"portfolio": merged}

    @router.post("/analyst/portfolios/{pid}/submit")
    async def submit_portfolio(pid: str, user: dict = Depends(require_analyst)):
        existing = await col.find_one({"id": pid, "owner_id": user["id"]})
        if not existing:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        await col.update_one({"id": pid}, {"$set": {"status": "pending", "review_note": "", "updated_at": _now()}})
        return {"ok": True, "status": "pending"}

    @router.delete("/analyst/portfolios/{pid}")
    async def delete_portfolio(pid: str, user: dict = Depends(require_analyst)):
        res = await col.delete_one({"id": pid, "owner_id": user["id"]})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        return {"ok": True}

    # ---------- Admin: review ----------
    @router.get("/admin/portfolios")
    async def all_portfolios(status: Optional[str] = Query(default=None), user: dict = Depends(require_admin)):
        q = {}
        if status:
            q["status"] = status
        docs = await col.find(q, {"_id": 0}).sort("updated_at", -1).to_list(1000)
        return {"portfolios": docs}

    @router.post("/admin/portfolios/{pid}/review")
    async def review_portfolio(pid: str, payload: dict = Body(...), user: dict = Depends(require_admin)):
        action = (payload.get("action") or "").lower()
        if action not in ("approve", "reject"):
            raise HTTPException(status_code=422, detail="action must be 'approve' or 'reject'")
        new_status = "approved" if action == "approve" else "rejected"
        res = await col.update_one({"id": pid}, {"$set": {
            "status": new_status,
            "review_note": payload.get("note", ""),
            "reviewed_at": _now(),
            "updated_at": _now(),
        }})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        return {"ok": True, "status": new_status}

    # ---------- Public ----------
    @router.get("/portfolios")
    async def public_portfolios():
        docs = await col.find({"status": "approved"}, {"_id": 0, "owner_id": 0, "review_note": 0}).sort("updated_at", -1).to_list(1000)
        return {"portfolios": docs}

    @router.get("/portfolios/{pid}")
    async def public_portfolio(pid: str):
        doc = await col.find_one({"id": pid, "status": "approved"}, {"_id": 0, "owner_id": 0, "review_note": 0})
        if not doc:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        return {"portfolio": doc}

    return router
