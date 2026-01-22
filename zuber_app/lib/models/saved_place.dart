class SavedPlace {
  final String id;
  final String userId;
  final String name;
  final String address;
  final double latitude;
  final double longitude;
  final String placeType;
  final String? icon;

  SavedPlace({
    required this.id,
    required this.userId,
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.placeType,
    this.icon,
  });

  factory SavedPlace.fromJson(Map<String, dynamic> json) {
    return SavedPlace(
      id: json['id']?.toString() ?? '',
      userId: json['userId']?.toString() ?? '',
      name: json['name'] ?? '',
      address: json['address'] ?? '',
      latitude: (json['latitude'] ?? 0.0).toDouble(),
      longitude: (json['longitude'] ?? 0.0).toDouble(),
      placeType: json['placeType'] ?? 'favorite',
      icon: json['icon'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'name': name,
      'address': address,
      'latitude': latitude,
      'longitude': longitude,
      'placeType': placeType,
      'icon': icon,
    };
  }
}

