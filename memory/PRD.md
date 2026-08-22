# Basketly — Product Requirements (PRD)

## Original problem statement
"Revamp the full frontend based on the attached design document (basketly-home.html, purple brand)."
Evolved into: a smallcase-style investing platform ("Basketly") with a unified purple brand across all pages,
functional AIF/Advisory lead forms, real JWT auth, and a role-based Admin/Analyst console where analysts
publish model portfolios that admins approve to go live.

## Routes
- `/admin` → **AdminPage** (admins only; analysts are redirected to `/analyst`, investors see a no-access card).
- `/analyst` → **AnalystPage** wrapper → AnalystConsole (analysts only; admins redirected to `/admin`, investors see a "go to dashboard" card). Added Jun 2026 to split the two consoles onto separate URLs.
- Login/signup redirect by role: admin→`/admin`, analyst→`/analyst`, investor→`/dashboard`.

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

### Added Jun 2026 (this session)
- **Factsheet PDF Upload**: analysts upload a PDF factsheet (Emergent Object Storage) per portfolio; investors download it from the public detail page. Backend: `storage.py`; endpoints POST/DELETE `/api/analyst/portfolios/{pid}/factsheet`, GET `/api/portfolios/{pid}/factsheet` (public if approved, else owner/admin). Frontend: AnalystConsole upload UI + ModelPortfolioDetail download card. VERIFIED (testing_agent iteration_1, 100%).
- **Analyst Invites**: admin-only invite links gate the `analyst` role. Self-signup as analyst now requires a valid, unused, unexpired invite (else becomes investor). Backend: `invites.py` (HMAC-digest storage, atomic find_one_and_update consume + compensating release), routes `/api/admin/invites` (create/list/revoke); `auth.py` signup accepts `invite_code`. Frontend: AdminPage "Analyst invites" tab + SignupPage invite banner. VERIFIED (100%, incl. reuse=403 gating).
- **UX polish**: admin/analyst login now routes straight to `/admin`; admin console header is tab-specific and hides Publish/Discard on management tabs (leads/listings/invites).
- **Baskets are analyst-only + demo samples hidden (Jun 2026)**: per user decision, admins can no longer create baskets (removed the admin "Baskets" creation tab; the tab now points admins to "Listings (approve)"). Basket creation stays with research analysts; admins review/approve. The public `/model-portfolios` page now shows ONLY real analyst-approved baskets (dropped the hardcoded demo `mock.js` baskets merge) with a proper loading + empty state. Home page decorative portfolio links repointed to `/model-portfolios`. Note: `mock.js` seed baskets still power secondary non-nav pages (Explore/Managers/Collections/Dashboard) which are not in the main navbar.
- **Admin Database viewer (Jun 2026)**: read-only, admin-only "Database" tab in `/admin`. Backend `dbadmin.py` (routes `/api/admin/db/collections`, `/api/admin/db/{collection}` with skip/limit/q, `/api/admin/db/{collection}/export` CSV, DELETE `/api/admin/db/{collection}/{id}`, POST `/api/admin/db/{collection}/clear`); allowlisted collections (users, leads, analyst_portfolios, analyst_invites, content, status_checks); recursively redacts sensitive fields (password/hash/secret/token). Admin user accounts are protected from deletion (single delete 403; clear users keeps role=admin). Frontend: collection pills w/ counts, search, expandable JSON records, pagination, **Export CSV**, per-record delete (two-step confirm), and **Clear collection** (AlertDialog confirm). Non-admins get 403. Works in production after redeploy (preview & prod DBs are separate).

## Known / notes
- The "Approve button not firing" bug from the prior fork was a FALSE ALARM (previous test selector matched sidebar
  "Listings (approve)" nav item, not the real Approve button). Approve/Reject work correctly end-to-end.
- Factsheet currently structured fields + pdfName metadata only; actual PDF file upload not implemented (backlog).
- KITE_API_SECRET missing → real broker order placement not fully live.

## Backlog
- P1: Factsheet PDF file upload (object storage) alongside structured fields.
- P1: Provide/restore KITE_API_SECRET for real broker order placement.
- P2: Full functional AIF/Advisory flows beyond lead capture.
