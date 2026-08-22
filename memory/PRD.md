# Basketly — Product Requirements (PRD)

## Original problem statement
"Revamp the full frontend based on the attached design document (basketly-home.html, purple brand)."
Evolved into: a smallcase-style investing platform ("Basketly") with a unified purple brand across all pages,
functional AIF/Advisory lead forms, real JWT auth, and a role-based Admin/Analyst console where analysts
publish model portfolios that admins approve to go live.

## Stack / Architecture
- Frontend: React + TailwindCSS + React Router + shadcn/ui. `/app/frontend/src/pages/*`, `/app/frontend/src/components/*`.
- Backend: FastAPI (routers built per module) + Motor (MongoDB async). `/app/backend/server.py` includes routers.
- Auth: email/password JWT (PyJWT + bcrypt), RBAC roles: `admin`, `investor`, `analyst`. Users seeded idempotently on startup.
- Broker: Zerodha Kite Connect (`broker_kite.py`) — requires user API key/secret (KITE_API_SECRET missing in env → real order placement not fully live).

## Backend routers
- `auth.py`: POST /api/auth/signup, /api/auth/login, GET /api/auth/me
- `content.py`: GET/PUT /api/content (editable home content)
- `leads.py`: POST /api/leads/aif, /api/leads/advisory, GET /api/leads
- `analyst.py`: analyst profile + portfolios CRUD, submit; admin review (approve/reject); public /api/portfolios
- `broker_kite.py`: Zerodha Kite integration

## Key DB collections
- users {id, name, email, hashed_password, role, analyst_profile?, created_at}
- leads {id, type, email, plan?, created_at}
- content {type, data}
- analyst_portfolios {id, owner_id, owner_name, name, subtitle, strategy, risk, minAmount, subscription, constituents[], returns{}, factsheet{}, status(draft/pending/approved/rejected), review_note, created_at, updated_at}

## Credentials (see /app/memory/test_credentials.md)
- Admin: admin@basketly.in / Admin@123
- Investor demo: demo@basketly.in / Password123

## Implemented (as of Jun 2026)
- Unified purple "Basketly" brand across all pages; exact basketly-home.html home layout (marquee phone mockup).
- Real JWT auth (signup/login/me) with seeded admin + demo users.
- AIF & Advisory lead-capture forms saving to backend; Leads visible in admin console.
- Admin console at /admin: edit home content (hero/stats/trust/testimonials) + Publish to live; Leads tab; Listings approval tab.
- Analyst console (role=analyst) at /admin: manage profile + portfolios, submit for review.
- Admin approval workflow VERIFIED end-to-end: analyst submit → admin approve → appears live on public /model-portfolios.
- ScrollToTop router fix; clickable model-portfolio feature rows.

## Known / notes
- The "Approve button not firing" bug from the prior fork was a FALSE ALARM (previous test selector matched sidebar
  "Listings (approve)" nav item, not the real Approve button). Approve/Reject work correctly end-to-end.
- Factsheet currently structured fields + pdfName metadata only; actual PDF file upload not implemented (backlog).
- KITE_API_SECRET missing → real broker order placement not fully live.

## Backlog
- P1: Factsheet PDF file upload (object storage) alongside structured fields.
- P1: Provide/restore KITE_API_SECRET for real broker order placement.
- P2: Full functional AIF/Advisory flows beyond lead capture.
