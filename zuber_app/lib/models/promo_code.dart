class PromoCode {
  final int id;
  final String code;
  final String? description;
  final String discountType;
  final double discountValue;
  final double? maxDiscount;
  final double? minRideAmount;
  final DateTime validFrom;
  final DateTime validUntil;
  final int? maxUses;
  final int currentUses;
  final bool isActive;

  PromoCode({
    required this.id,
    required this.code,
    this.description,
    required this.discountType,
    required this.discountValue,
    this.maxDiscount,
    this.minRideAmount,
    required this.validFrom,
    required this.validUntil,
    this.maxUses,
    required this.currentUses,
    required this.isActive,
  });

  factory PromoCode.fromJson(Map<String, dynamic> json) {
    return PromoCode(
      id: json['id'] ?? 0,
      code: json['code'] ?? '',
      description: json['description'],
      discountType: json['discountType'] ?? 'percentage',
      discountValue: (json['discountValue'] ?? 0.0).toDouble(),
      maxDiscount: json['maxDiscount']?.toDouble(),
      minRideAmount: json['minRideAmount']?.toDouble(),
      validFrom: DateTime.parse(json['validFrom']),
      validUntil: DateTime.parse(json['validUntil']),
      maxUses: json['maxUses'],
      currentUses: json['currentUses'] ?? 0,
      isActive: json['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'code': code,
      'description': description,
      'discountType': discountType,
      'discountValue': discountValue,
      'maxDiscount': maxDiscount,
      'minRideAmount': minRideAmount,
      'validFrom': validFrom.toIso8601String(),
      'validUntil': validUntil.toIso8601String(),
      'maxUses': maxUses,
      'currentUses': currentUses,
      'isActive': isActive,
    };
  }
}

