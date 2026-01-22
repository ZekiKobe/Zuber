class Ride {
  final String id;
  final String userId;
  final String? driverId;
  final double pickupLatitude;
  final double pickupLongitude;
  final double destinationLatitude;
  final double destinationLongitude;
  final String pickupAddress;
  final String destinationAddress;
  final double? distance;
  final int? duration;
  final double? fare;
  final int? rideTypeId;
  final double? surgeMultiplier;
  final double? estimatedFare;
  final int? estimatedDuration;
  final double? estimatedDistance;
  final DateTime? scheduledTime;
  final bool isScheduled;
  final String status;
  final DateTime? startTime;
  final DateTime? endTime;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Ride({
    required this.id,
    required this.userId,
    this.driverId,
    required this.pickupLatitude,
    required this.pickupLongitude,
    required this.destinationLatitude,
    required this.destinationLongitude,
    required this.pickupAddress,
    required this.destinationAddress,
    this.distance,
    this.duration,
    this.fare,
    this.rideTypeId,
    this.surgeMultiplier,
    this.estimatedFare,
    this.estimatedDuration,
    this.estimatedDistance,
    this.scheduledTime,
    this.isScheduled = false,
    required this.status,
    this.startTime,
    this.endTime,
    this.createdAt,
    this.updatedAt,
  });

  factory Ride.fromJson(Map<String, dynamic> json) {
    return Ride(
      id: json['id']?.toString() ?? '',
      userId: json['userId']?.toString() ?? '',
      driverId: json['driverId']?.toString(),
      pickupLatitude: (json['pickupLatitude'] as num?)?.toDouble() ?? 0.0,
      pickupLongitude: (json['pickupLongitude'] as num?)?.toDouble() ?? 0.0,
      destinationLatitude: (json['destinationLatitude'] as num?)?.toDouble() ?? 0.0,
      destinationLongitude: (json['destinationLongitude'] as num?)?.toDouble() ?? 0.0,
      pickupAddress: json['pickupAddress'] ?? '',
      destinationAddress: json['destinationAddress'] ?? '',
      distance: (json['distance'] as num?)?.toDouble(),
      duration: json['duration'],
      fare: (json['fare'] as num?)?.toDouble(),
      rideTypeId: json['rideTypeId'],
      surgeMultiplier: (json['surgeMultiplier'] as num?)?.toDouble(),
      estimatedFare: (json['estimatedFare'] as num?)?.toDouble(),
      estimatedDuration: json['estimatedDuration'],
      estimatedDistance: (json['estimatedDistance'] as num?)?.toDouble(),
      scheduledTime: json['scheduledTime'] != null ? DateTime.parse(json['scheduledTime']) : null,
      isScheduled: json['isScheduled'] == true || json['isScheduled'] == 1,
      status: json['status'] ?? 'requested',
      startTime: json['startTime'] != null ? DateTime.parse(json['startTime']) : null,
      endTime: json['endTime'] != null ? DateTime.parse(json['endTime']) : null,
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'driverId': driverId,
      'pickupLatitude': pickupLatitude,
      'pickupLongitude': pickupLongitude,
      'destinationLatitude': destinationLatitude,
      'destinationLongitude': destinationLongitude,
      'pickupAddress': pickupAddress,
      'destinationAddress': destinationAddress,
      'distance': distance,
      'duration': duration,
      'fare': fare,
      'rideTypeId': rideTypeId,
      'surgeMultiplier': surgeMultiplier,
      'estimatedFare': estimatedFare,
      'estimatedDuration': estimatedDuration,
      'estimatedDistance': estimatedDistance,
      'scheduledTime': scheduledTime?.toIso8601String(),
      'isScheduled': isScheduled,
      'status': status,
      'startTime': startTime?.toIso8601String(),
      'endTime': endTime?.toIso8601String(),
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }
}