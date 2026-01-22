import 'package:socket_io_client/socket_io_client.dart' as io;

class SocketService {
  static io.Socket? _socket;
  
  static void connect() {
    _socket = io.io('http://localhost:5000', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': true,
    });
    
    _socket!.connect();
    
    _socket!.onConnect((data) {
      print('Socket connected: $data');
    });
    
    _socket!.onDisconnect((data) {
      print('Socket disconnected: $data');
    });
    
    _socket!.onError((error) {
      print('Socket error: $error');
    });
  }
  
  static void disconnect() {
    _socket?.disconnect();
    _socket?.close();
  }
  
  static void emit(String event, dynamic data) {
    _socket?.emit(event, data);
  }
  
  static void on(String event, Function(dynamic) callback) {
    _socket?.on(event, callback);
  }
  
  static void off(String event) {
    _socket?.off(event);
  }
  
  // User specific events
  static void userConnect(int userId) {
    _socket?.emit('user-connect', userId);
  }
  
  static void userDisconnect(int userId) {
    _socket?.emit('user-disconnect', userId);
  }
  
  static void requestRide(Map<String, dynamic> rideData) {
    _socket?.emit('request-ride', rideData);
  }
  
  static void sendLocationUpdate(Map<String, dynamic> locationData) {
    _socket?.emit('location-update', locationData);
  }
  
  // Driver specific events
  static void driverConnect(int driverId) {
    _socket?.emit('driver-connect', driverId);
  }
  
  static void driverDisconnect(int driverId) {
    _socket?.emit('driver-disconnect', driverId);
  }
  
  static void acceptRide(Map<String, dynamic> rideData) {
    _socket?.emit('accept-ride', rideData);
  }
}