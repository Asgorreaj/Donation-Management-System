# AssistPro — Donation & Student Sponsorship Management System

A full-stack platform for managing student sponsorships, tracking donations, and reporting across multiple branches. Originally built for a microfinance/education NGO, then re-engineered into a standalone, self-hosted system with its own authentication, and deployed live on free-tier cloud infrastructure.

**🔗 Live Demo:** https://donation-management-system-psi.vercel.app/disa/login

**Demo login credentials:**
| Field | Value |
|---|---|
| Username | `owner` |
| Password | `Asgor@123` |

> This is a demo account with seeded sample data (500+ students, 200+ donations, 10 branches) so you can explore every feature immediately without setting anything up.

---

## What this project demonstrates

- Full-stack development across two different tech stacks (PHP backend, TypeScript/React frontend)
- Debugging and re-architecting an existing multi-tenant system into a standalone, self-contained app
- Containerizing a multi-service stack (app server, web server, database, cache) with Docker Compose
- Deploying a real, working application entirely on free-tier cloud services
- Building a data-driven admin dashboard (live stats, charts, CSV bulk import, CRUD screens)

---

## Tech Stack

**Backend**
- PHP 8.3, CodeIgniter 4
- MySQL 8 (database)
- Redis (session/token store)
- REST API with token-based authentication

**Frontend**
- Next.js 14 (App Router), TypeScript
- Tailwind CSS, NextUI components
- Recharts (dashboard analytics/charts)
- Formik (forms/validation)

**Infrastructure (all free-tier)**
| Service | Used for | Provider |
|---|---|---|
| Frontend hosting | Next.js app | [Vercel](https://vercel.com) |
| Backend hosting | PHP API (Dockerized) | [Render](https://render.com) |
| Database | MySQL | [Aiven](https://aiven.io) |
| Cache / sessions | Redis | [Upstash](https://upstash.com) |

**Local development**
- Docker & Docker Compose (Nginx + PHP-FPM + MySQL + Redis, one command to run everything)

---

## Features

- 🔐 **Authentication** — register/login with token-based sessions (Redis-backed)
- 🏢 **Multi-branch support** — organize students and donations by branch
- 🎓 **Student management** — full CRUD, search, filter by branch/status, CSV bulk import
- 💰 **Donation tracking** — record donations (cash/bank), linked to students, exportable reports
- 📊 **Live dashboard** — real-time stats (total students, total raised, monthly totals, recent entries), interactive charts
- 📁 **Reports** — donation reports with export
- ⚙️ **Account settings** — change password, view profile
- 📱 **Responsive UI** — works on desktop and mobile

---

## Project Structure

```
Donation_Full_Project/
├── assistpro-backend/
│   ├── codes/                  # CodeIgniter 4 application
│   │   ├── app/
│   │   │   ├── Controllers/Api/    # API endpoints
│   │   │   ├── Config/             # Routes, Database, CORS, Filters
│   │   │   ├── Filters/            # Auth middleware
│   │   │   └── Services/           # Business logic
│   │   ├── docker-compose.yml      # Local dev stack
│   │   └── app.Dockerfile / web.Dockerfile
│   ├── Dockerfile.render       # Production build for Render.com
│   └── docker/render/          # Nginx + supervisord config for production
│
└── assistpro-frontend/
    └── codes/
        ├── src/app/[mfi]/       # Multi-tenant routed pages (login, dashboard, students, donations)
        ├── src/components/      # UI components (Menu, Navbar, charts, tables)
        └── src/helpers/         # API client, auth helpers
```

---

## Running Locally

### Prerequisites
- Docker Desktop
- Node.js 18+ and npm

### Backend
```bash
cd assistpro-backend/codes
docker compose up -d --build
```
This starts MySQL, Redis, PHP-FPM, and Nginx together. The API will be available at `http://localhost:8081`.

### Frontend
```bash
cd assistpro-frontend/codes
npm install
npm run dev
```
Visit `http://localhost:3000/disa/login`.

> Note: the `[mfi]` segment in the URL (`disa` above) is a routing artifact from the project's original multi-tenant design — any value works here, it isn't validated against a specific list.

---

## Deployment Notes

The production deployment splits the stack across four free-tier providers:

1. **Aiven (MySQL)** — free managed database; note that free-tier instances power off after prolonged inactivity and need to be manually resumed from the Aiven console.
2. **Upstash (Redis)** — free serverless Redis, TLS-only connection.
3. **Render (Backend)** — Dockerized PHP + Nginx via a single `Dockerfile.render`, with `supervisord` running both processes. Free instances spin down after ~15 minutes of inactivity (cold start ~30–50s on first request).
4. **Vercel (Frontend)** — standard Next.js deployment, auto-deploys on every push to `main`.

Environment variables used in production (set in each platform's dashboard, never committed to git):
```
DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, DB_SSL
REDIS_HOST, REDIS_PORT, REDIS_TLS, REDIS_PASSWORD
NEXT_PUBLIC_AUTH_SERVICE_URL, NEXT_PUBLIC_CORE_SERVICE_URL,
NEXT_PUBLIC_ASSIST_PRO_SERVICE_URL, NEXT_PUBLIC_API_URL
```

---

## Roadmap

- [ ] Payment gateway integration (mobile money)
- [ ] Migrate backend to ASP.NET Core (in progress, separate branch/repo)
- [ ] Branch management UI (currently managed via direct DB seeding)
- [ ] Automated tests

---

## Author

Built and maintained by **Asgor Reaj** ([@Asgorreaj](https://github.com/Asgorreaj))
