import 'package:flutter/material.dart';

class AppColors {
  static const primary = Color(0xFF000000); // Black
  static const secondary = Color(0xFFFFFFFF); // White
  static const accent = Color(0xFF1DB954); // Green (similar to Uber's green)
  static const background = Color(0xFFF8F8F8);
  static const textPrimary = Color(0xFF333333);
  static const textSecondary = Color(0xFF888888);
  static const divider = Color(0xFFEEEEEE);
}

class AppDimensions {
  static const double paddingSmall = 8.0;
  static const double paddingMedium = 16.0;
  static const double paddingLarge = 24.0;
  
  static const double borderRadiusSmall = 8.0;
  static const double borderRadiusMedium = 12.0;
  static const double borderRadiusLarge = 16.0;
  
  static const double buttonHeight = 50.0;
  static const double inputHeight = 50.0;
}

class AppStrings {
  // Authentication
  static const String loginTitle = "Welcome Back";
  static const String loginSubtitle = "Sign in to continue";
  static const String registerTitle = "Create Account";
  static const String registerSubtitle = "Sign up to get started";
  
  // User roles
  static const String user = "User";
  static const String driver = "Driver";
  
  // Form fields
  static const String firstName = "First Name";
  static const String lastName = "Last Name";
  static const String email = "Email";
  static const String password = "Password";
  static const String confirmPassword = "Confirm Password";
  static const String phoneNumber = "Phone Number";
  static const String licenseNumber = "License Number";
  
  // Buttons
  static const String login = "Login";
  static const String register = "Register";
  static const String logout = "Logout";
  static const String continueText = "Continue";
  static const String cancel = "Cancel";
  
  // Ride
  static const String requestRide = "Request Ride";
  static const String whereTo = "Where to?";
  static const String pickupLocation = "Pickup Location";
  static const String destination = "Destination";
  
  // Errors
  static const String invalidEmail = "Please enter a valid email";
  static const String passwordTooShort = "Password must be at least 6 characters";
  static const String fieldRequired = "This field is required";
}