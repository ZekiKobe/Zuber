const { Ride, User } = require('../models');

// Store connected users and drivers
const connectedUsers = new Map();

const socketHandler = (socket, io) => {
  console.log('New socket connection:', socket.id);
  
  // User connects
  socket.on('user-connect', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log('User connected:', userId);
  });
  

  
  // User disconnects
  socket.on('user-disconnect', (userId) => {
    connectedUsers.delete(userId);
    console.log('User disconnected:', userId);
  });
  

  
  // User requests a ride
  socket.on('request-ride', async (rideData) => {
    try {
      // Emit to all connected drivers
      socket.broadcast.emit('new-ride-request', rideData);
    } catch (error) {
      console.error('Error handling ride request:', error);
    }
  });
  

  
  // Send location updates
  socket.on('location-update', (data) => {
    const { userId, driverId, latitude, longitude, role } = data;
    
    if (role === 'user' && connectedUsers.has(userId)) {
      // Send user location to appropriate listeners
      const userSocketId = connectedUsers.get(userId);
      // Emit to relevant parties (could be expanded as needed)
      io.to(userSocketId).emit('user-location', { latitude, longitude });
    }
  });
  
  // Ride status updates
  socket.on('ride-status-update', (data) => {
    const { rideId, status, userId, driverId } = data;
    
    // Notify user of status update
    if (connectedUsers.has(userId)) {
      const userSocketId = connectedUsers.get(userId);
      io.to(userSocketId).emit('ride-status', { rideId, status });
    }
    

  });
};

module.exports = socketHandler;