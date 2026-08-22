"""Admin-only, read-only database viewer.

Lists collections with counts and returns paginated documents with sensitive
fields redacted. Admin-authenticated; safe for use on the live site.
"""
from __future__ import annotations

import re
import csv
import io
import json
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
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

    @router.get("/{collection}/export")
    async def export_csv(collection: str, _: dict = Depends(require_admin)):
        if collection not in ALLOWED:
            raise HTTPException(status_code=404, detail="Collection not available")
        docs = await db[collection].find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
        docs = [_redact(d) for d in docs]
        # union of keys, stable order (first-seen)
        headers: list[str] = []
        for d in docs:
            for k in d.keys():
                if k not in headers:
                    headers.append(k)
        buf = io.StringIO()
        writer = csv.writer(buf)
        writer.writerow(headers or ["(empty)"])
        for d in docs:
            row = []
            for k in headers:
                v = d.get(k, "")
                row.append(json.dumps(v, ensure_ascii=False) if isinstance(v, (dict, list)) else v)
            writer.writerow(row)
        return Response(
            content=buf.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{collection}.csv"'},
        )

    @router.delete("/{collection}/{doc_id}")
    async def delete_document(collection: str, doc_id: str, _: dict = Depends(require_admin)):
        if collection not in ALLOWED:
            raise HTTPException(status_code=404, detail="Collection not available")
        doc = await db[collection].find_one({"id": doc_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Record not found")
        if collection == "users" and doc.get("role") == "admin":
            raise HTTPException(status_code=403, detail="Admin accounts are protected and cannot be deleted here.")
        await db[collection].delete_one({"id": doc_id})
        return {"ok": True}

    @router.post("/{collection}/clear")
    async def clear_collection(collection: str, _: dict = Depends(require_admin)):
        if collection not in ALLOWED:
            raise HTTPException(status_code=404, detail="Collection not available")
        if collection == "users":
            # never wipe admin accounts
            res = await db.users.delete_many({"role": {"$ne": "admin"}})
        else:
            res = await db[collection].delete_many({})
        return {"ok": True, "deleted": res.deleted_count}

    return router
