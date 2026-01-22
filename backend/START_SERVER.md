# Starting the Zuber Backend Server

## Prerequisites

1. **PostgreSQL** with PostGIS extension installed
2. **Redis** server running
3. **Node.js** (v18 or higher)
4. **npm** or **yarn**

## Setup Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and update the following:
- Database credentials (DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME)
- JWT_SECRET (use a strong random string)
- Redis configuration if needed
- Google Maps API key
- Payment gateway credentials

### 3. Setup MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE zuber_db;

# Exit MySQL
EXIT;
```

Or using MySQL command line:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS zuber_db;"
```

### 4. Start Redis

```bash
# On Windows (if installed as service)
redis-server

# On Linux/Mac
redis-server
```

### 5. Run Database Migrations (if any)

```bash
npm run migration:run
```

### 6. Start the Development Server

```bash
npm run start:dev
```

The server will start on `http://localhost:3000`

## API Endpoints

- **API Base URL**: `http://localhost:3000/api/v1`
- **Swagger Documentation**: `http://localhost:3000/api/docs`

## For Flutter App Connection

### Android Emulator
- Use `http://10.0.2.2:3000/api/v1` (already configured in Flutter app)

### iOS Simulator
- Use `http://localhost:3000/api/v1`

### Physical Device
- Use your machine's IP address: `http://YOUR_IP:3000/api/v1`
- Find your IP: 
  - Windows: `ipconfig` (look for IPv4 Address)
  - Mac/Linux: `ifconfig` or `ip addr`

## Troubleshooting

### "Failed to fetch" Errors

1. **Check if server is running**:
   ```bash
   # Should see: 🚀 Zuber API is running on: http://localhost:3000
   ```

2. **Check CORS configuration**:
   - Ensure `CORS_ORIGIN=*` in `.env` for development
   - Or set specific origin: `CORS_ORIGIN=http://localhost:3000,http://10.0.2.2:3000`

3. **Check database connection**:
   - Verify MySQL is running
   - Check database credentials in `.env`
   - Test connection: `mysql -h localhost -u root -p zuber_db`

4. **Check Redis connection**:
   - Verify Redis is running: `redis-cli ping` (should return PONG)

5. **Check port availability**:
   - Ensure port 3000 is not in use
   - Change `APP_PORT` in `.env` if needed

### Common Issues

- **Database connection error**: Check PostgreSQL is running and credentials are correct
- **Redis connection error**: Check Redis is running
- **JWT errors**: Ensure JWT_SECRET is set in `.env`
- **TypeORM errors**: Check database schema synchronization is enabled in development

## Production Deployment

For production:
1. Set `APP_ENV=production` in `.env`
2. Set `CORS_ORIGIN` to your frontend domain
3. Use strong `JWT_SECRET`
4. Enable SSL for database if needed
5. Use process manager (PM2) to run the server
6. Set up reverse proxy (Nginx)

