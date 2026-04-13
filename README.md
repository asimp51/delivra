# Delivra

Multi-category delivery platform — like Talabat/Foodpanda but for everything. Food, grocery, pharmacy, flowers, pets, packages, shopping, home services, and more.

## Architecture

| Component | Tech | Platform |
|---|---|---|
| Customer App | Flutter | iOS + Android |
| Rider App | Flutter | iOS + Android |
| Vendor App | Flutter | iOS + Android |
| Vendor Portal | Next.js 14 | Web (port 3002) |
| Admin Dashboard | Next.js 14 | Web (port 3001) |
| Backend API | NestJS + TypeORM | Server (port 3000) |
| Database | PostgreSQL + PostGIS | Docker |
| Cache | Redis | Docker |
| Real-time | Socket.IO | WebSocket |

## Features

**Customer App** — Browse categories, search vendors, view menus, add to cart, checkout with card/cash/wallet, real-time order tracking with animated status icons, order history, ratings, promo codes, saved addresses, favorites

**Rider App** — Online/offline toggle, delivery offers with accept/decline, step-by-step navigation (arrived > picked up > delivered), earnings dashboard, delivery history, order stacking (2 orders from same vendor)

**Vendor App** — Orders kanban (incoming/preparing/ready), menu management with availability toggle, analytics dashboard, customer reviews with reply, store settings with 7-day operating hours

**Admin Dashboard** — KPI overview, dynamic category management (add/remove/reorder with tree view), vendor verification, rider monitoring, order management, payment tracking, analytics with heatmaps, promo code CRUD, delivery zone management, platform settings with rider assignment strategy (nearest/round-robin/hybrid)

**Backend** — JWT authentication with OTP verification, role-based access (customer/vendor/rider/admin), dynamic categories with JSONB metadata, order lifecycle with WebSocket events, auto-cancel timers (5 min vendor, 60s rider), Stripe payment integration, FCM push notifications, rate limiting, full SQL migrations

**Innovative Features** — Group ordering (share link, friends add items, split payment), Mystery deals (surprise bags at 50-70% off), Price lock guarantee (freeze prices for 30 min), Carbon footprint tracker (eco badges), Live kitchen cam (watch food being prepared), AI smart reorder (predicts your Friday dinner)

## Quick Start

```bash
# 1. Start database
docker-compose up -d

# 2. Start backend
cd backend && cp .env.example .env && npm install && npm run start:dev

# 3. Start admin dashboard
cd apps/admin-dashboard && npm install && npm run dev

# 4. Start vendor portal
cd apps/vendor-portal && npm install && npm run dev

# 5. Start customer app
cd apps/customer && flutter pub get && flutter run

# 6. Start rider app
cd apps/rider && flutter pub get && flutter run

# 7. Start vendor app
cd apps/vendor-app && flutter pub get && flutter run
```

## Project Structure

```
delivra/
├── backend/                 # NestJS API (65+ files)
├── apps/
│   ├── customer/            # Flutter customer app (35+ files)
│   ├── rider/               # Flutter rider app (18+ files)
│   ├── vendor-app/          # Flutter vendor app (16+ files)
│   ├── vendor-portal/       # Next.js vendor web portal
│   └── admin-dashboard/     # Next.js admin panel
├── docs/html-mockups/       # Static HTML mockups with SVG animations
├── .github/workflows/       # CI/CD for all 5 apps
├── docker-compose.yml       # PostgreSQL + Redis + pgAdmin
└── WIRING_GUIDE.md          # Complete setup and deployment guide
```

## Stats

- 230 files, 14,597 lines of code
- 25+ database entities
- 50+ API endpoints
- 5 CI/CD pipelines
- 14 HTML screen mockups with SVG animations

## Third-Party Setup

See [WIRING_GUIDE.md](WIRING_GUIDE.md) for:
- Google Maps API setup
- Stripe payment integration
- Firebase push notifications
- Email/SMS OTP configuration
- Production deployment (Docker, Vercel, App Store)

## License

Private — All rights reserved.
