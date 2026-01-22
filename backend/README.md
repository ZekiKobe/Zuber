# Zuber Backend API

Enterprise-level ride-hailing platform backend built with NestJS, PostgreSQL, and PostGIS.

## Features

- ✅ TypeScript + NestJS
- ✅ PostgreSQL with PostGIS
- ✅ Redis for caching & queues
- ✅ WebSocket real-time tracking
- ✅ JWT Authentication
- ✅ Swagger API Documentation
- ✅ Docker support

## Setup

### Prerequisites
- Node.js 18+
- MySQL 8.0+ (or MariaDB 10.5+)
- Redis 6+ (optional)

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Create MySQL database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS zuber_db;"

# Run migrations (when ready)
npm run migration:run

# Start development server
npm run start:dev
```

## API Documentation

Once running, visit: `http://localhost:3000/api/docs`

## Project Structure

```
src/
├── modules/          # Feature modules
├── database/         # Entities & migrations
├── config/           # Configuration files
├── common/           # Shared utilities
└── main.ts          # Application entry
```

## Environment Variables

See `.env.example` for all required variables.

## Database Schema

See `DATABASE_SCHEMA.md` for complete schema documentation.
