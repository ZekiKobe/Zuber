# Quick Start Guide - Zuber Backend

## Issue: "Failed to fetch" Errors

If you're seeing "Failed to fetch" errors in your Flutter app, the backend server is likely not running or not accessible.

## Quick Fix Steps

### 1. Verify Backend Server is Running

Open a new terminal and run:

```bash
cd backend
npm run start:dev
```

You should see:
```
🚀 Zuber API is running on: http://localhost:3000
📚 API Documentation: http://localhost:3000/api/docs
```

### 2. Test the API Endpoint

Open your browser or use curl:

```bash
# Test if server is responding
curl http://localhost:3000/api/v1/auth/login/driver

# Or open in browser:
# http://localhost:3000/api/docs
```

### 3. Check Database Connection

Make sure MySQL is running and the database exists:

```bash
# Check if MySQL is running (Windows)
# Look for MySQL service in Services

# Create database if it doesn't exist
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS zuber_db;"
```

### 4. Check Redis Connection

Make sure Redis is running:

```bash
# Windows: Check if Redis service is running
# Or start Redis manually if installed

# Test Redis connection
redis-cli ping
# Should return: PONG
```

### 5. Verify Environment Variables

Check your `.env` file in the `backend` folder has:

```env
APP_ENV=development
APP_PORT=3000
CORS_ORIGIN=*

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=zuber_db

JWT_SECRET=your-secret-key-here
```

### 6. Common Issues & Solutions

#### Issue: "Cannot connect to database"
- **Solution**: Check MySQL is running and credentials in `.env` are correct
- **Test**: `mysql -u root -p zuber_db -e "SELECT 1;"`

#### Issue: "Redis connection failed"
- **Solution**: Start Redis server or disable Redis features temporarily
- **Test**: `redis-cli ping`

#### Issue: "Port 3000 already in use"
- **Solution**: Change `APP_PORT=3001` in `.env` and update Flutter app baseUrl

#### Issue: CORS errors
- **Solution**: Ensure `CORS_ORIGIN=*` in `.env` for development
- **Note**: The updated `main.ts` now properly handles CORS

### 7. Start Everything in Order

1. **Start MySQL** (if not running as service)
2. **Start Redis** (if not running as service)
3. **Start Backend Server**:
   ```bash
   cd backend
   npm run start:dev
   ```
4. **Run Flutter App** (in another terminal/IDE)

### 8. Verify Connection from Flutter

The Flutter app is configured to use:
- **Android Emulator**: `http://10.0.2.2:3000/api/v1`
- **Physical Device**: Use your computer's IP address

To find your IP address (Windows):
```powershell
ipconfig
# Look for "IPv4 Address" under your network adapter
```

Then update in Flutter app: `zuber_app/lib/services/api_service.dart`
```dart
static const String baseUrl = 'http://YOUR_IP:3000/api/v1';
```

## Still Having Issues?

1. Check backend terminal for error messages
2. Check Flutter console for detailed error messages
3. Verify all services are running (PostgreSQL, Redis, Backend)
4. Test API directly in browser: `http://localhost:3000/api/docs`

