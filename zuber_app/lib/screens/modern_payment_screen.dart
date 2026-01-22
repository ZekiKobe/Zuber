import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';

class ModernPaymentScreen extends StatefulWidget {
  final double amount;
  final String rideId;
  final String? paymentMethodId;

  const ModernPaymentScreen({
    Key? key,
    required this.amount,
    required this.rideId,
    this.paymentMethodId,
  }) : super(key: key);

  @override
  State<ModernPaymentScreen> createState() => _ModernPaymentScreenState();
}

class _ModernPaymentScreenState extends State<ModernPaymentScreen> {
  int _selectedPaymentMethod = 0;
  bool _isProcessing = false;

  final List<Map<String, dynamic>> _paymentMethods = [
    {
      'type': 'card',
      'name': 'Visa',
      'lastFour': '4238',
      'expiry': '12/25',
      'icon': Icons.credit_card,
      'color': AppTheme.primaryColor,
    },
    {
      'type': 'cash',
      'name': 'Cash',
      'lastFour': '',
      'expiry': '',
      'icon': Icons.money,
      'color': AppTheme.successColor,
    },
    {
      'type': 'mobile',
      'name': 'TeleBirr',
      'lastFour': '',
      'expiry': '',
      'icon': Icons.phone_iphone,
      'color': AppTheme.accentColor,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: AppTheme.textPrimary,
      ),
      body: Padding(
        padding: const EdgeInsets.all(AppTheme.spacingM),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Amount to pay
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppTheme.spacingL),
              decoration: BoxDecoration(
                gradient: AppTheme.primaryGradient,
                borderRadius: BorderRadius.circular(AppTheme.radiusL),
                boxShadow: AppTheme.elevatedShadow,
              ),
              child: Column(
                children: [
                  Text(
                    'Total Amount',
                    style: AppTheme.bodyMedium.copyWith(
                      color: Colors.white.withOpacity(0.8),
                    ),
                  ),
                  const SizedBox(height: AppTheme.spacingXS),
                  Text(
                    '\$${widget.amount.toStringAsFixed(2)}',
                    style: AppTheme.heading2.copyWith(
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: AppTheme.spacingM),
            
            Text(
              'Payment Method',
              style: AppTheme.bodyLarge.copyWith(
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: AppTheme.spacingS),
            
            // Payment Methods
            Expanded(
              child: ListView.separated(
                itemCount: _paymentMethods.length,
                separatorBuilder: (context, index) => const SizedBox(height: AppTheme.spacingS),
                itemBuilder: (context, index) {
                  final method = _paymentMethods[index];
                  final isSelected = _selectedPaymentMethod == index;
                  
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedPaymentMethod = index;
                      });
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.all(AppTheme.spacingM),
                      decoration: BoxDecoration(
                        color: isSelected 
                            ? AppTheme.primaryColor.withOpacity(0.1) 
                            : AppTheme.surfaceColor,
                        borderRadius: BorderRadius.circular(AppTheme.radiusM),
                        border: Border.all(
                          color: isSelected ? AppTheme.primaryColor : AppTheme.textTertiary.withOpacity(0.3),
                          width: isSelected ? 2 : 1,
                        ),
                        boxShadow: isSelected ? AppTheme.cardShadow : [],
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: method['color'].withOpacity(0.1),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              method['icon'],
                              color: method['color'],
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: AppTheme.spacingM),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  method['name'],
                                  style: AppTheme.bodyLarge.copyWith(
                                    fontWeight: FontWeight.w600,
                                    color: AppTheme.textPrimary,
                                  ),
                                ),
                                if (method['lastFour'].isNotEmpty)
                                  Text(
                                    '•••• ${method['lastFour']} • ${method['expiry']}',
                                    style: AppTheme.bodySmall.copyWith(
                                      color: AppTheme.textSecondary,
                                    ),
                                  ),
                              ],
                            ),
                          ),
                          if (isSelected)
                            Icon(
                              Icons.check_circle,
                              color: AppTheme.primaryColor,
                              size: 24,
                            ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            
            const SizedBox(height: AppTheme.spacingM),
            
            // Pay Button
            SizedBox(
              height: 56,
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isProcessing ? null : _processPayment,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppTheme.radiusM),
                  ),
                  shadowColor: AppTheme.primaryColor.withOpacity(0.3),
                  elevation: 5,
                ),
                child: _isProcessing
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : Text(
                        'Pay Now',
                        style: AppTheme.buttonText,
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _processPayment() async {
    setState(() {
      _isProcessing = true;
    });

    // Simulate payment processing
    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      setState(() {
        _isProcessing = false;
      });

      // Show success dialog
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Payment Successful'),
            content: const Text('Your payment has been processed successfully.'),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  Navigator.of(context).pop(); // Close payment screen
                },
                child: const Text('OK'),
              ),
            ],
          );
        },
      );
    }
  }
}