class User {
  final String id;
  final String phoneNumber;
  final String? email;
  final String firstName;
  final String lastName;
  final String? profilePicture;
  final String status;
  final bool isPhoneVerified;
  final double? latitude;
  final double? longitude;
  final int totalRides;
  final double rating;
  final String currency;

  User({
    required this.id,
    required this.phoneNumber,
    this.email,
    required this.firstName,
    required this.lastName,
    this.profilePicture,
    required this.status,
    required this.isPhoneVerified,
    this.latitude,
    this.longitude,
    required this.totalRides,
    required this.rating,
    required this.currency,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id']?.toString() ?? '',
      phoneNumber: json['phoneNumber'] ?? '',
      email: json['email'],
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
      profilePicture: json['profilePicture'],
      status: json['status'] ?? 'pending_verification',
      isPhoneVerified: json['isPhoneVerified'] == true || json['isPhoneVerified'] == 1,
      latitude: json['latitude']?.toDouble(),
      longitude: json['longitude']?.toDouble(),
      totalRides: json['totalRides'] ?? 0,
      rating: (json['rating'] ?? 0.0).toDouble(),
      currency: json['currency'] ?? 'ETB',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'phoneNumber': phoneNumber,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'profilePicture': profilePicture,
      'status': status,
      'isPhoneVerified': isPhoneVerified,
      'latitude': latitude,
      'longitude': longitude,
      'totalRides': totalRides,
      'rating': rating,
      'currency': currency,
    };
  }

  String get fullName => '$firstName $lastName';
}
