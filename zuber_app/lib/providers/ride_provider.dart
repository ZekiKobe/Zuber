import 'package:flutter/material.dart';
import '../models/ride.dart';
import '../models/ride_type.dart';
import '../services/api_service.dart';

class RideProvider with ChangeNotifier {
  Ride? _currentRide;
  List<Ride> _rideHistory = [];
  List<RideType> _rideTypes = [];
  bool _isLoading = false;
  String? _error;

  Ride? get currentRide => _currentRide;
  List<Ride> get rideHistory => _rideHistory;
  List<RideType> get rideTypes => _rideTypes;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Load ride types
  Future<void> loadRideTypes() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _rideTypes = await ApiService.getRideTypes();
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Request a new ride
  Future<bool> requestRide({
    required String token,
    required double pickupLat,
    required double pickupLon,
    required double dropoffLat,
    required double dropoffLon,
    required String pickupAddress,
    required String dropoffAddress,
    required String rideTypeId,
    String? promoCode,
    DateTime? scheduledTime,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService.requestRide(token, {
        'pickupLatitude': pickupLat,
        'pickupLongitude': pickupLon,
        'destinationLatitude': dropoffLat,
        'destinationLongitude': dropoffLon,
        'pickupAddress': pickupAddress,
        'destinationAddress': dropoffAddress,
        'rideTypeId': rideTypeId,
        if (promoCode != null) 'promoCode': promoCode,
        if (scheduledTime != null) 'scheduledTime': scheduledTime.toIso8601String(),
      });

      if (response != null && response['ride'] != null) {
        _currentRide = Ride.fromJson(response['ride']);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = response?['message'] ?? 'Failed to request ride';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Get active ride
  Future<void> loadActiveRide(String token, {bool isDriver = false}) async {
    try {
      _currentRide = await ApiService.getActiveRide(token, isDriver: isDriver);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  // Get all user rides (active + history)
  Future<void> loadRideHistory(String token) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _rideHistory = await ApiService.getAllUserRides(token);
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Get only active rides
  Future<List<Ride>> loadActiveRides(String token) async {
    try {
      return await ApiService.getActiveRides(token);
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return [];
    }
  }

  // Get ride details
  Future<Ride?> getRideDetails(String token, String rideId) async {
    try {
      return await ApiService.getRideDetails(token, rideId);
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return null;
    }
  }

  // Update current ride
  void updateCurrentRide(Ride ride) {
    _currentRide = ride;
    notifyListeners();
  }

  // Clear current ride
  void clearCurrentRide() {
    _currentRide = null;
    notifyListeners();
  }

  // Add ride to history
  void addRideToHistory(Ride ride) {
    _rideHistory.insert(0, ride);
    notifyListeners();
  }

  // Update ride history
  void updateRideHistory(List<Ride> rides) {
    _rideHistory = rides;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
