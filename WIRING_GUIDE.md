# Delivra — Wiring Guide

Complete guide to connect all components and go live.

## Phase 1: Local Development Setup

### 1. Start Database & Redis
```bash
cd delivra
docker-compose up -d
# PostgreSQL: localhost:5432 (user: delivra, pass: delivra_secret, db: delivra_db)
# Redis: localhost:6379
# pgAdmin: http://localhost:5050 (admin@delivra.com / admin123)
```

### 2. Start Backend
```bash
cd backend
cp .env.example .env    # Edit with your values
npm install
npm run start:dev       # http://localhost:3000
# Swagger docs: http://localhost:3000/api/docs
```

### 3. Seed Categories
```bash
cd backend
npm run seed            # Seeds 10 categories + 140 subcategories
```

### 4. Start Admin Dashboard
```bash
cd apps/admin-dashboard
npm install
npm run dev             # http://localhost:3001
```

### 5. Start Vendor Portal
```bash
cd apps/vendor-portal
npm install
npm run dev             # http://localhost:3002
```

### 6. Start Customer App
```bash
cd apps/customer
flutter pub get
flutter run             # Select device
```

### 7. Start Rider App
```bash
cd apps/rider
flutter pub get
flutter run             # Select device
```

---

## Phase 2: Connect Flutter Apps to Backend

### Customer App
1. Edit `apps/customer/lib/core/api/api_config.dart`
2. Set `baseUrl` to your backend URL
3. Each service file (`auth_service.dart`, `order_service.dart`, etc.) has exact API calls
4. Replace mock data in screens with service calls

### Rider App
1. Edit `apps/rider/lib/services/rider_api_service.dart`
2. Set `_baseUrl` to your backend URL
3. Replace mock data in screens with API service calls

---

## Phase 3: Third-Party Integrations

### Google Maps
1. Get API key: https://console.cloud.google.com/apis/credentials
2. Enable: Maps SDK Android, Maps SDK iOS, Directions API, Places API
3. Android: Add key to `android/app/src/main/AndroidManifest.xml`
   ```xml
   <meta-data android:name="com.google.android.geo.API_KEY" android:value="YOUR_KEY"/>
   ```
4. iOS: Add key to `ios/Runner/AppDelegate.swift`
   ```swift
   GMSServices.provideAPIKey("YOUR_KEY")
   ```
5. Update `ApiConfig.googleMapsApiKey`

### Stripe Payments
1. Create account: https://dashboard.stripe.com
2. Get publishable key → `ApiConfig.stripePublishableKey`
3. Get secret key → backend `.env` `STRIPE_SECRET_KEY`
4. Add `flutter_stripe` to customer app pubspec.yaml
5. See `payment_service.dart` for full flow

### Firebase (Push Notifications)
1. Create project: https://console.firebase.google.com
2. See `notification_service.dart` for step-by-step setup
3. See `fcm.provider.ts` for backend setup

### Email (OTP + Notifications)
1. Configure SMTP in backend `.env`
2. See `email.provider.ts` for templates

---

## Phase 4: Production Deployment

### Backend
```bash
# Option A: Docker
docker build -t delivra-backend .
docker push your-registry/delivra-backend

# Option B: Direct deploy (DigitalOcean, Railway, Render)
# Connect GitHub repo, set env vars, deploy
```

### Web Apps (Admin + Vendor Portal)
```bash
# Deploy to Vercel (recommended for Next.js)
cd apps/admin-dashboard
npx vercel deploy --prod

cd apps/vendor-portal
npx vercel deploy --prod
```

### Mobile Apps
```bash
# Android
cd apps/customer && flutter build apk --release
cd apps/rider && flutter build apk --release

# iOS
cd apps/customer && flutter build ipa --release
cd apps/rider && flutter build ipa --release
```

### Database
- Use managed PostgreSQL: AWS RDS, DigitalOcean, Supabase, Neon
- Set `synchronize: false` in production
- Run TypeORM migrations instead

---

## File Reference

| What | Where |
|------|-------|
| API endpoints | `backend/src/modules/*/controllers` |
| Database schema | `backend/src/modules/*/entities` |
| API client (customer) | `apps/customer/lib/core/api/api_client.dart` |
| API client (rider) | `apps/rider/lib/services/rider_api_service.dart` |
| Auth flow | `apps/customer/lib/services/auth_service.dart` |
| Payment flow | `apps/customer/lib/services/payment_service.dart` |
| WebSocket tracking | `apps/customer/lib/services/socket_service.dart` |
| Push notifications | `apps/customer/lib/services/notification_service.dart` |
| Stripe backend | `backend/src/modules/payments/providers/stripe.provider.ts` |
| FCM backend | `backend/src/modules/notifications/providers/fcm.provider.ts` |
| Email backend | `backend/src/modules/notifications/providers/email.provider.ts` |
| Category seed data | `backend/src/database/seeds/initial-categories.seed.ts` |
| Docker setup | `docker-compose.yml` |
| CI/CD | `.github/workflows/*.yml` |
