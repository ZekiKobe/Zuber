# Zuber

> A ride-hailing platform combining a Node/Nest backend and a Flutter mobile app.

---

## Overview

Zuber is a full-stack ride-sharing application. The repository contains a Node.js/Nest backend (server + REST APIs, sockets) under `backend/` and a Flutter mobile app under `zuber_app/`.

## Key Features (high level)
- User authentication and profiles
- Ride requesting and driver matching
- Real-time updates via websockets
- Payments, promo codes, ratings

## Repository Structure

- `backend/` — Node/Nest backend, Express compatibility helpers, models, routes, sockets and seeders.
- `zuber_app/` — Flutter application (mobile client) with platform folders and Flutter source in `lib/`.
- `uploads/` — uploaded media and assets used by backend.
- `build/` — generated build artifacts for platforms.
- `utils/` — shared backend utility scripts.

## Quick Start

Prerequisites:
- Node.js (>=16 recommended) and npm/yarn
- PostgreSQL (or the DB configured in `backend/config/database.js`) or your preferred DB
- Redis (if using websocket/session features)
- Flutter SDK for the mobile app

1) Backend setup

```bash
cd backend
npm install
# copy .env.example to .env and set DB/Redis credentials
npm run start:dev
```

Main backend entrypoints and config:
- [backend/server.js](backend/server.js)
- [backend/src/main.ts](backend/src/main.ts)
- [backend/config/database.js](backend/config/database.js)

Seeding ride types:

```bash
cd backend/seeders
node seedRideTypes.js
```

2) Running with Docker (optional)

If you prefer containerized execution, build and run the backend image defined by `backend/Dockerfile`.

```bash
cd backend
docker build -t zuber-backend .
docker run --env-file .env -p 3000:3000 zuber-backend
```

3) Flutter app (client)

```bash
cd zuber_app
flutter pub get
# run on connected device or emulator
flutter run
```

Main client entrypoint:
- [zuber_app/lib/main.dart](zuber_app/lib/main.dart)

Building an APK:

```bash
cd zuber_app
flutter build apk --release
```

## Environment Variables

Create a `.env` in `backend/` (or use your system envs). Typical variables:

- `PORT` — server port
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` — database connection
- `REDIS_URL` — Redis connection
- `JWT_SECRET` — auth secret

Check `backend/config/database.js` and `backend/src/config` for additional config keys.

## Tests

If tests exist, run them from the respective package folders. Example:

```bash
cd backend
npm test

cd zuber_app
flutter test
```

## Contributing

1. Fork the repo and create a feature branch
2. Write tests for new features where appropriate
3. Open a pull request describing your changes

## Helpful Files

- `backend/README.md` — backend-specific notes (if present)
- `backend/START_SERVER.md` — backend start instructions
- `zuber_app/README.md` — Flutter-specific notes (if present)

## Troubleshooting

- If migrations/seeders fail, verify DB credentials and that the DB is reachable.
- For Flutter build issues, run `flutter doctor` and resolve platform SDK warnings.

## License & Contact

Add your preferred license here.

For questions or help, open an issue in this repository.
