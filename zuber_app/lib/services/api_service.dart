import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:io' show Platform;
import 'package:image_picker/image_picker.dart';
import '../models/user.dart';

import '../models/ride.dart';
import '../models/ride_type.dart';
import '../models/saved_place.dart';

class ApiService {
  // ============================================
  // CONFIGURATION FOR PHYSICAL DEVICES
  // ============================================
  // When testing on a physical device, you need to:
  // 1. Find your computer's IP address:
  //    - Windows: Run `ipconfig` in CMD, look for "IPv4 Address"
  //    - Mac/Linux: Run `ifconfig` or `ip addr`, look for inet address
  // 2. Update _physicalDeviceIp below with your IP (e.g., '192.168.1.100')
  // 3. Set _usePhysicalDevice to true
  // 4. Make sure your phone and computer are on the same WiFi network
  // 5. Make sure your backend server is running and accessible
  // ============================================

  static const String _physicalDeviceIp =
      '172.16.239.109'; // UPDATE THIS with your IP
  static const int _backendPort = 5000;
  static const bool _usePhysicalDevice =
      false; // Set to true for physical device

  // Get base URL based on platform
  static String get baseUrl {
    if (kIsWeb) {
      // Web: use localhost
      return 'http://localhost:$_backendPort/api';
    } else if (Platform.isAndroid) {
      // Android: use 10.0.2.2 for emulator, IP for physical device
      if (_usePhysicalDevice) {
        return 'http://$_physicalDeviceIp:$_backendPort/api';
      }
      return 'http://10.0.2.2:$_backendPort/api'; // Emulator
    } else if (Platform.isIOS) {
      // iOS: use localhost for simulator, IP for physical device
      if (_usePhysicalDevice) {
        return 'http://$_physicalDeviceIp:$_backendPort/api';
      }
      return 'http://localhost:$_backendPort/api'; // Simulator
    } else {
      // Default fallback
      return 'http://localhost:$_backendPort/api';
    }
  }

  // Helper method to get base URL for physical devices
  // Call this method and update _physicalDeviceIp when testing on physical devices
  static String getBaseUrlForPhysicalDevice(String ipAddress) {
    return 'http://$ipAddress:$_backendPort/api';
  }

  // Helper method to get headers with auth token
  static Map<String, String> _getHeaders({String? token}) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  // Helper method to handle API responses
  static Map<String, dynamic>? _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      try {
        if (response.body.isEmpty) {
          return null;
        }
        final data = jsonDecode(response.body);
        // Handle NestJS response format
        if (data is Map && data.containsKey('data')) {
          return data['data'] as Map<String, dynamic>?;
        }
        if (data is Map) {
          return data as Map<String, dynamic>;
        }
        return null;
      } catch (e) {
        print('Error parsing response: $e');
        return {'message': response.body};
      }
    } else {
      try {
        if (response.body.isNotEmpty) {
          final error = jsonDecode(response.body);
          // Handle validation errors array
          if (error['errors'] != null && error['errors'] is List) {
            final errors = error['errors'] as List;
            final errorMessages = errors
                .map((e) => e['msg'] ?? e.toString())
                .join(', ');
            throw Exception(
              errorMessages.isNotEmpty ? errorMessages : 'Validation failed',
            );
          }
          // Handle single error message
          throw Exception(error['message'] ?? 'Request failed');
        }
        throw Exception('Request failed: ${response.statusCode}');
      } catch (e) {
        if (e is Exception) {
          rethrow;
        }
        throw Exception('Request failed: ${response.statusCode}');
      }
    }
  }

  // User Authentication
  static Future<Map<String, dynamic>?> registerUser(
    Map<String, dynamic> userData,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register/user'),
        headers: _getHeaders(),
        body: jsonEncode(userData),
      );
      return _handleResponse(response);
    } catch (e) {
      print('Error registering user: $e');
      rethrow;
    }
  }

  static Future<Map<String, dynamic>?> verifyPhone(
    String userId,
    String code,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/verify/user'),
        headers: _getHeaders(),
        body: jsonEncode({'userId': userId, 'code': code}),
      );
      return _handleResponse(response);
    } catch (e) {
      print('Error verifying phone: $e');
      rethrow;
    }
  }

  static Future<Map<String, dynamic>?> loginUser(
    String phoneNumber,
    String password,
  ) async {
    try {
      final url = Uri.parse('$baseUrl/auth/login/user');
      final body = jsonEncode({
        'phoneNumber': phoneNumber,
        'password': password,
      });
      print('Login request to: $url');
      print(
        'Login body: ${body.replaceAll(password, '***')}',
      ); // Hide password in logs

      final response = await http.post(url, headers: _getHeaders(), body: body);

      print('Login response status: ${response.statusCode}');
      print('Login response body: ${response.body}');

      return _handleResponse(response);
    } catch (e) {
      print('Error logging in user: $e');
      rethrow;
    }
  }


  // User Profile
  static Future<User?> getUserProfile(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/users/profile'),
        headers: _getHeaders(token: token),
      );
      final data = _handleResponse(response);
      return data != null ? User.fromJson(data) : null;
    } catch (e) {
      print('Error getting user profile: $e');
      return null;
    }
  }


  // Ride Types
  static Future<List<RideType>> getRideTypes() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/ride-types'),
        headers: _getHeaders(),
      );

      print('Ride types response status: ${response.statusCode}');
      print('Ride types response body: ${response.body}');

      if (response.statusCode >= 200 && response.statusCode < 300) {
        if (response.body.isEmpty) {
          return [];
        }

        final data = jsonDecode(response.body);

        // Backend returns array directly, not wrapped in an object
        if (data is List) {
          return data
              .map((json) => RideType.fromJson(json as Map<String, dynamic>))
              .toList();
        }

        // Handle case where it might be wrapped
        if (data is Map && data.containsKey('data') && data['data'] is List) {
          return (data['data'] as List)
              .map((json) => RideType.fromJson(json as Map<String, dynamic>))
              .toList();
        }
      }

      return [];
    } catch (e) {
      print('Error getting ride types: $e');
      return [];
    }
  }

  // Ride Services
  static Future<Map<String, dynamic>?> requestRide(
    String token,
    Map<String, dynamic> rideData,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/rides/request'),
        headers: _getHeaders(token: token),
        body: jsonEncode(rideData),
      );
      return _handleResponse(response);
    } catch (e) {
      print('Error requesting ride: $e');
      rethrow;
    }
  }

  static Future<Ride?> getRideDetails(String token, String rideId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/rides/$rideId'),
        headers: _getHeaders(token: token),
      );
      final data = _handleResponse(response);
      return data != null ? Ride.fromJson(data) : null;
    } catch (e) {
      print('Error getting ride details: $e');
      return null;
    }
  }

  static Future<List<Ride>> getRideHistory(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/rides/history/user'),
        headers: _getHeaders(token: token),
      );
      final data = _handleResponse(response);
      if (data is List) {
        return (data as List)
            .map((json) => Ride.fromJson(json as Map<String, dynamic>))
            .toList();
      }
      return [];
    } catch (e) {
      print('Error getting ride history: $e');
      return [];
    }
  }

  static Future<List<Ride>> getActiveRides(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/rides/active/user'),
        headers: _getHeaders(token: token),
      );
      final data = _handleResponse(response);
      if (data is List) {
        return (data as List)
            .map((json) => Ride.fromJson(json as Map<String, dynamic>))
            .toList();
      }
      return [];
    } catch (e) {
      print('Error getting active rides: $e');
      return [];
    }
  }

  static Future<List<Ride>> getAllUserRides(String token) async {
    try {
      // Get both active and history rides
      final activeRides = await getActiveRides(token);
      final historyRides = await getRideHistory(token);
      
      // Combine and sort by creation date (newest first)
      final allRides = [...activeRides, ...historyRides];
      allRides.sort((a, b) {
        // Handle null values - put nulls at the end
        if (a.createdAt == null && b.createdAt == null) return 0;
        if (a.createdAt == null) return 1;
        if (b.createdAt == null) return -1;
        return b.createdAt!.compareTo(a.createdAt!);
      });
      
      return allRides;
    } catch (e) {
      print('Error getting all user rides: $e');
      return [];
    }
  }


  static Future<Ride?> getActiveRide(
    String token, {
    bool isDriver = false,
  }) async {
    try {
      final endpoint = isDriver ? '/rides/active/driver' : '/rides/active/user';
      final response = await http.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: _getHeaders(token: token),
      );
      final data = _handleResponse(response);
      if (data is List && (data as List).isNotEmpty) {
        return Ride.fromJson((data as List)[0] as Map<String, dynamic>);
      }
      return null;
    } catch (e) {
      print('Error getting active ride: $e');
      return null;
    }
  }

  // Pricing
  static Future<Map<String, dynamic>?> estimateFare({
    required String rideTypeId,
    required double distance,
    required double duration,
    required double pickupLat,
    required double pickupLon,
    required double dropoffLat,
    required double dropoffLon,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/pricing/estimate').replace(
          queryParameters: {
            'rideTypeId': rideTypeId,
            'distance': distance.toString(),
            'duration': duration.toString(),
            'pickupLat': pickupLat.toString(),
            'pickupLon': pickupLon.toString(),
            'dropoffLat': dropoffLat.toString(),
            'dropoffLon': dropoffLon.toString(),
          },
        ),
        headers: _getHeaders(),
      );
      return _handleResponse(response);
    } catch (e) {
      print('Error estimating fare: $e');
      return null;
    }
  }

  // Saved Places
  static Future<List<SavedPlace>> getSavedPlaces(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/saved-places'),
        headers: _getHeaders(token: token),
      );
      final data = _handleResponse(response);
      if (data is List) {
        return (data as List)
            .map((json) => SavedPlace.fromJson(json as Map<String, dynamic>))
            .toList();
      }
      return [];
    } catch (e) {
      print('Error getting saved places: $e');
      return [];
    }
  }

  // Nearby Drivers
  static Future<List<Map<String, dynamic>>> getNearbyDrivers({
    required double lat,
    required double lon,
    double radius = 5,
    int limit = 20,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/dispatch/nearby-drivers').replace(
          queryParameters: {
            'lat': lat.toString(),
            'lon': lon.toString(),
            'radius': radius.toString(),
            'limit': limit.toString(),
          },
        ),
        headers: _getHeaders(),
      );
      final data = _handleResponse(response);
      if (data is List) {
        return (data as List)
            .map((item) => item as Map<String, dynamic>)
            .toList();
      }
      return [];
    } catch (e) {
      print('Error getting nearby drivers: $e');
      return [];
    }
  }

  // Submit Rating
  static Future<bool> submitRating(
    String token,
    Map<String, dynamic> ratingData,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/ratings/user'),
        headers: _getHeaders(token: token),
        body: jsonEncode(ratingData),
      );
      final data = _handleResponse(response);
      return data != null;
    } catch (e) {
      print('Error submitting rating: $e');
      return false;
    }
  }

  // Payment Methods
  static Future<List<Map<String, dynamic>>> getPaymentMethods(
    String token,
  ) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/payment-methods'),
        headers: _getHeaders(token: token),
      );
      final data = _handleResponse(response);
      if (data is List) {
        return (data as List)
            .map((item) => item as Map<String, dynamic>)
            .toList();
      }
      return [];
    } catch (e) {
      print('Error getting payment methods: $e');
      return [];
    }
  }

  static Future<bool> addPaymentMethod(
    String token,
    Map<String, dynamic> paymentData,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/payment-methods'),
        headers: _getHeaders(token: token),
        body: jsonEncode(paymentData),
      );
      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (e) {
      print('Error adding payment method: $e');
      return false;
    }
  }

  // Notifications
  static Future<List<Map<String, dynamic>>> getNotifications(
    String token, {
    bool isDriver = false, // Always false for customer-only app
  }) async {
    try {
      final endpoint = '/notifications/user';
      final response = await http.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: _getHeaders(token: token),
      );
      final data = _handleResponse(response);
      if (data is List) {
        return (data as List)
            .map((item) => item as Map<String, dynamic>)
            .toList();
      }
      return [];
    } catch (e) {
      print('Error getting notifications: $e');
      return [];
    }
  }

  static Future<bool> markNotificationAsRead(
    String token,
    String notificationId,
  ) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/notifications/$notificationId/read'),
        headers: _getHeaders(token: token),
      );
      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (e) {
      print('Error marking notification as read: $e');
      return false;
    }
  }

  static Future<bool> markAllNotificationsAsRead(String token) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/notifications/read-all'),
        headers: _getHeaders(token: token),
      );
      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (e) {
      print('Error marking all notifications as read: $e');
      return false;
    }
  }

  // Update Profile
  static Future<bool> updateUserProfile(
    String token,
    Map<String, dynamic> profileData,
  ) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/users/profile'),
        headers: _getHeaders(token: token),
        body: jsonEncode(profileData),
      );
      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (e) {
      print('Error updating user profile: $e');
      return false;
    }
  }


  // Promo Codes
  static Future<Map<String, dynamic>?> validatePromoCode(
    String token,
    String code,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/promo-codes/validate'),
        headers: _getHeaders(token: token),
        body: jsonEncode({'code': code}),
      );
      return _handleResponse(response);
    } catch (e) {
      print('Error validating promo code: $e');
      return null;
    }
  }

  // Ride Actions
  static Future<bool> cancelRide(
    String token,
    String rideId, {
    bool isDriver = false, // Always false for customer-only app
  }) async {
    try {
      final endpoint = '/rides/$rideId/cancel';
      final response = await http.put(
        Uri.parse('$baseUrl$endpoint'),
        headers: _getHeaders(token: token),
      );
      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (e) {
      print('Error cancelling ride: $e');
      return false;
    }
  }

  static Future<bool> acceptRide(String token, String rideId) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/rides/$rideId/accept'),
        headers: _getHeaders(token: token),
      );
      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (e) {
      print('Error accepting ride: $e');
      return false;
    }
  }

  static Future<bool> startRide(String token, String rideId) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/rides/$rideId/start'),
        headers: _getHeaders(token: token),
      );
      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (e) {
      print('Error starting ride: $e');
      return false;
    }
  }

  static Future<bool> completeRide(String token, String rideId) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/rides/$rideId/complete'),
        headers: _getHeaders(token: token),
      );
      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (e) {
      print('Error completing ride: $e');
      return false;
    }
  }




}
