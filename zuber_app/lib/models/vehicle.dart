class Vehicle {
  final int id;
  final int driverId;
  final String make;
  final String model;
  final int year;
  final String licensePlate;
  final String color;
  final String vehicleType;
  final int capacity;

  Vehicle({
    required this.id,
    required this.driverId,
    required this.make,
    required this.model,
    required this.year,
    required this.licensePlate,
    required this.color,
    required this.vehicleType,
    required this.capacity,
  });

  factory Vehicle.fromJson(Map<String, dynamic> json) {
    return Vehicle(
      id: json['id'] ?? 0,
      driverId: json['driverId'] ?? 0,
      make: json['make'] ?? '',
      model: json['model'] ?? '',
      year: json['year'] ?? 0,
      licensePlate: json['licensePlate'] ?? '',
      color: json['color'] ?? '',
      vehicleType: json['vehicleType'] ?? '',
      capacity: json['capacity'] ?? 4,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'driverId': driverId,
      'make': make,
      'model': model,
      'year': year,
      'licensePlate': licensePlate,
      'color': color,
      'vehicleType': vehicleType,
      'capacity': capacity,
    };
  }
}