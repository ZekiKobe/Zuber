class RideType {
  final String id;
  final String name;
  final String displayName;
  final String? description;
  final double baseFare;
  final double perMileRate;
  final double perMinuteRate;
  final double minimumFare;
  final int capacity;
  final String? icon;
  final bool isActive;

  RideType({
    required this.id,
    required this.name,
    required this.displayName,
    this.description,
    required this.baseFare,
    required this.perMileRate,
    required this.perMinuteRate,
    required this.minimumFare,
    required this.capacity,
    this.icon,
    required this.isActive,
  });

  factory RideType.fromJson(Map<String, dynamic> json) {
    // Helper function to safely convert to double
    double parseDouble(dynamic value) {
      if (value == null) return 0.0;
      if (value is double) return value;
      if (value is int) return value.toDouble();
      if (value is String) {
        return double.tryParse(value) ?? 0.0;
      }
      return 0.0;
    }

    return RideType(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      displayName: json['displayName'] ?? '',
      description: json['description'],
      baseFare: parseDouble(json['baseFare']),
      perMileRate: parseDouble(json['perMileRate']),
      perMinuteRate: parseDouble(json['perMinuteRate']),
      minimumFare: parseDouble(json['minimumFare']),
      capacity: json['capacity'] is int 
          ? json['capacity'] 
          : (json['capacity'] is String 
              ? int.tryParse(json['capacity']) ?? 4 
              : 4),
      icon: json['icon'],
      isActive: json['isActive'] is bool 
          ? json['isActive'] 
          : (json['isActive'] is String 
              ? json['isActive'].toLowerCase() == 'true' 
              : true),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'displayName': displayName,
      'description': description,
      'baseFare': baseFare,
      'perMileRate': perMileRate,
      'perMinuteRate': perMinuteRate,
      'minimumFare': minimumFare,
      'capacity': capacity,
      'icon': icon,
      'isActive': isActive,
    };
  }
}

