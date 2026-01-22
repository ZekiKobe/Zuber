import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;

  String? _token;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;

  String? get token => _token;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _token != null;
  bool get isUser => _user != null;


  AuthProvider() {
    _loadAuthData();
  }

  Future<void> _loadAuthData() async {
    try {
      // Check if running on web platform
      try {
        final prefs = await SharedPreferences.getInstance();
        _token = prefs.getString('auth_token');
        final userJson = prefs.getString('user_data');
        final driverJson = prefs.getString('driver_data');
        
        if (_token != null && _token!.isNotEmpty) {
          if (userJson != null && userJson.isNotEmpty) {
            try {
              _user = User.fromJson(jsonDecode(userJson));
            } catch (e) {
              print('Error parsing user data: $e');
            }
          }

          notifyListeners();
        }
      } catch (e) {
        // SharedPreferences not available (e.g., web platform)
        print('SharedPreferences not available: $e');
        // Continue without loading saved data
      }
    } catch (e) {
      print('Error loading auth data: $e');
    }
  }

  Future<bool> registerUser({
    required String phoneNumber,
    required String password,
    required String firstName,
    required String lastName,
    String? email,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService.registerUser({
        'phoneNumber': phoneNumber,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
        if (email != null) 'email': email,
      });

      if (response != null) {
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Registration failed';
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

  Future<bool> verifyPhone(String userId, String code) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService.verifyPhone(userId, code);

      if (response != null && response['token'] != null) {
        _token = response['token'];
        if (response['user'] != null) {
          _user = User.fromJson(response['user']);
        }
        
        try {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('auth_token', _token!);
          if (_user != null) {
            await prefs.setString('user_data', jsonEncode(_user!.toJson()));
          }
        } catch (e) {
          print('Error saving auth data: $e');
        }
        
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Verification failed';
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

  Future<bool> requestVerificationCode({
    required String phoneNumber,
    String? email,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('${ApiService.baseUrl}/auth/send-verification-code'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'phoneNumber': phoneNumber,
          if (email != null) 'email': email,
        }),
      );

      _isLoading = false;
      if (response.statusCode >= 200 && response.statusCode < 300) {
        notifyListeners();
        return true;
      } else {
        final error = jsonDecode(response.body);
        _error = error['message'] ?? 'Failed to send verification code';
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

  Future<bool> verifyCode({
    required String phoneNumber,
    String? email,
    required String code,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('${ApiService.baseUrl}/auth/verify-code'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'phoneNumber': phoneNumber,
          'code': code,
        }),
      );

      _isLoading = false;
      if (response.statusCode == 200) {
        // Code is valid, store info for profile creation
        _tempPhoneNumber = phoneNumber;
        _tempEmail = email;
        _tempCode = code;
        
        notifyListeners();
        return true;
      } else {
        final error = jsonDecode(response.body);
        _error = error['message'] ?? 'Invalid verification code';
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

  Future<bool> createProfile({
    required String phoneNumber,
    String? email,
    required String firstName,
    String? lastName,
    File? profilePicture,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      Map<String, String> body = {
        'phoneNumber': phoneNumber,
        'firstName': firstName,
        'lastName': lastName ?? '',
      };
      if (email != null) body['email'] = email;
      
      if (profilePicture != null) {
        // For multipart request with file
        var request = http.MultipartRequest(
          'POST',
          Uri.parse('${ApiService.baseUrl}/auth/create-profile'),
        );
        
        request.fields.addAll(body);
        request.files.add(await http.MultipartFile.fromPath('profilePicture', profilePicture.path));
        
        final response = await request.send();
        final responseString = await response.stream.bytesToString();
        
        _isLoading = false;
        
        if (response.statusCode >= 200 && response.statusCode < 300) {
          final data = jsonDecode(responseString);
          _token = data['token'];
          if (data['user'] != null) {
            _user = User.fromJson(data['user']);
          }
          
          try {
            final prefs = await SharedPreferences.getInstance();
            await prefs.setString('auth_token', _token!);
            if (_user != null) {
              await prefs.setString('user_data', jsonEncode(_user!.toJson()));
            }
          } catch (e) {
            print('Error saving auth data: $e');
          }
          
          // Clear temporary data
          _clearTempData();
          
          notifyListeners();
          return true;
        } else {
          final error = jsonDecode(responseString);
          _error = error['message'] ?? 'Failed to create profile';
          notifyListeners();
          return false;
        }
      } else {
        // For request without file, use regular POST
        final response = await http.post(
          Uri.parse('${ApiService.baseUrl}/auth/create-profile'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(body),
        );
        
        _isLoading = false;
        
        if (response.statusCode >= 200 && response.statusCode < 300) {
          final data = jsonDecode(response.body);
          _token = data['token'];
          if (data['user'] != null) {
            _user = User.fromJson(data['user']);
          }
          
          try {
            final prefs = await SharedPreferences.getInstance();
            await prefs.setString('auth_token', _token!);
            if (_user != null) {
              await prefs.setString('user_data', jsonEncode(_user!.toJson()));
            }
          } catch (e) {
            print('Error saving auth data: $e');
          }
          
          // Clear temporary data
          _clearTempData();
          
          notifyListeners();
          return true;
        } else {
          final error = jsonDecode(response.body);
          _error = error['message'] ?? 'Failed to create profile';
          notifyListeners();
          return false;
        }
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Temporary storage for verification data
  String? _tempPhoneNumber;
  String? _tempEmail;
  String? _tempCode;

  void _clearTempData() {
    _tempPhoneNumber = null;
    _tempEmail = null;
    _tempCode = null;
  }

  Future<bool> loginUser(String phoneNumber, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService.loginUser(phoneNumber, password);

      if (response != null && response['token'] != null) {
        _token = response['token'];
        if (response['user'] != null) {
          _user = User.fromJson(response['user']);
        }
        
        try {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('auth_token', _token!);
          if (_user != null) {
            await prefs.setString('user_data', jsonEncode(_user!.toJson()));
          }
        } catch (e) {
          print('Error saving auth data: $e');
        }
        
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Invalid credentials';
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


  Future<void> logout() async {
    _user = null;

    _token = null;
    _error = null;
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('user_data');


    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}