class Rating {
  final int id;
  final int rideId;
  final int userId;
  final int driverId;
  final int? userRating;
  final int driverRating;
  final String? userReview;
  final String? driverReview;
  final String ratedBy;

  Rating({
    required this.id,
    required this.rideId,
    required this.userId,
    required this.driverId,
    this.userRating,
    required this.driverRating,
    this.userReview,
    this.driverReview,
    required this.ratedBy,
  });

  factory Rating.fromJson(Map<String, dynamic> json) {
    return Rating(
      id: json['id'] ?? 0,
      rideId: json['rideId'] ?? 0,
      userId: json['userId'] ?? 0,
      driverId: json['driverId'] ?? 0,
      userRating: json['userRating'],
      driverRating: json['driverRating'] ?? 0,
      userReview: json['userReview'],
      driverReview: json['driverReview'],
      ratedBy: json['ratedBy'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'rideId': rideId,
      'userId': userId,
      'driverId': driverId,
      'userRating': userRating,
      'driverRating': driverRating,
      'userReview': userReview,
      'driverReview': driverReview,
      'ratedBy': ratedBy,
    };
  }
}

