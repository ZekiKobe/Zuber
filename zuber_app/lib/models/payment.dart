class Payment {
  final int id;
  final int userId;
  final int rideId;
  final double amount;
  final String currency;
  final String? paymentMethod;
  final String paymentStatus;
  final String? transactionId;

  Payment({
    required this.id,
    required this.userId,
    required this.rideId,
    required this.amount,
    required this.currency,
    this.paymentMethod,
    required this.paymentStatus,
    this.transactionId,
  });

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['id'] ?? 0,
      userId: json['userId'] ?? 0,
      rideId: json['rideId'] ?? 0,
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] ?? 'USD',
      paymentMethod: json['paymentMethod'],
      paymentStatus: json['paymentStatus'] ?? 'pending',
      transactionId: json['transactionId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'rideId': rideId,
      'amount': amount,
      'currency': currency,
      'paymentMethod': paymentMethod,
      'paymentStatus': paymentStatus,
      'transactionId': transactionId,
    };
  }
}