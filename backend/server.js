const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const rideRoutes = require('./routes/ride.routes');
const rideTypeRoutes = require('./routes/rideType.routes');
const ratingRoutes = require('./routes/rating.routes');
const promoCodeRoutes = require('./routes/promoCode.routes');
const savedPlaceRoutes = require('./routes/savedPlace.routes');
const paymentMethodRoutes = require('./routes/paymentMethod.routes');
const notificationRoutes = require('./routes/notification.routes');

// Import database connection
const sequelize = require('./config/database');

// Import Socket.IO handlers
const socketHandler = require('./sockets/socket.handler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
const path = require('path');
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socketHandler(socket, io);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use('/api/rides', rideRoutes);
app.use('/api/ride-types', rideTypeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/promo-codes', promoCodeRoutes);
app.use('/api/saved-places', savedPlaceRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/notifications', notificationRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Uber-like platform backend is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Sync database and start server
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server is accessible at:`);
    console.log(`  - http://localhost:${PORT}`);
    console.log(`  - http://0.0.0.0:${PORT}`);
    console.log(`  - For Android emulator: http://10.0.2.2:${PORT}`);
    console.log(`Socket.IO is listening`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});