import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';
import 'promo_codes_screen.dart';

class PaymentScreen extends StatefulWidget {
  const PaymentScreen({Key? key}) : super(key: key);

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  List<Map<String, dynamic>> _paymentMethods = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPaymentMethods();
  }

  Future<void> _loadPaymentMethods() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = authProvider.token;
      
      if (token == null) {
        setState(() {
          _paymentMethods = [];
          _isLoading = false;
        });
        return;
      }

      final methods = await ApiService.getPaymentMethods(token);
      setState(() {
        _paymentMethods = methods;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading payment methods: $e');
      setState(() {
        _paymentMethods = [];
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.darkSurfaceColor,
        elevation: 0,
        title: const Text('Payment Methods'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : CustomScrollView(
              slivers: [
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(AppTheme.spacingL),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Payment Methods',
                          style: AppTheme.heading2.copyWith(
                            color: AppTheme.darkTextPrimary,
                          ),
                        ),
                        const SizedBox(height: AppTheme.spacingS),
                        Text(
                          'Manage your payment methods',
                          style: AppTheme.bodyMedium.copyWith(
                            color: AppTheme.darkTextSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                if (_paymentMethods.isEmpty)
                  SliverFillRemaining(
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.payment,
                            size: 64,
                            color: AppTheme.darkTextTertiary,
                          ),
                          const SizedBox(height: AppTheme.spacingM),
                          Text(
                            'No payment methods',
                            style: AppTheme.bodyLarge.copyWith(
                              color: AppTheme.darkTextSecondary,
                            ),
                          ),
                          const SizedBox(height: AppTheme.spacingS),
                          Text(
                            'Add a payment method to get started',
                            style: AppTheme.bodySmall.copyWith(
                              color: AppTheme.darkTextTertiary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                else
                  SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final paymentMethod = _paymentMethods[index];
                        return Container(
                          margin: const EdgeInsets.symmetric(
                            horizontal: AppTheme.spacingL,
                            vertical: AppTheme.spacingS,
                          ),
                          padding: const EdgeInsets.all(AppTheme.spacingL),
                          decoration: BoxDecoration(
                            color: AppTheme.darkCardColor,
                            borderRadius: BorderRadius.circular(AppTheme.radiusM),
                            border: Border.all(
                              color: AppTheme.darkDividerColor,
                              width: 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 50,
                                height: 50,
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryColor.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(AppTheme.radiusS),
                                ),
                                child: Icon(
                                  _getPaymentIcon(paymentMethod['type'] ?? 'card'),
                                  color: AppTheme.primaryColor,
                                  size: 24,
                                ),
                              ),
                              const SizedBox(width: AppTheme.spacingM),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      paymentMethod['type'] ?? 'Card',
                                      style: AppTheme.bodyLarge.copyWith(
                                        color: AppTheme.darkTextPrimary,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    const SizedBox(height: AppTheme.spacingXS),
                                    Text(
                                      paymentMethod['last4'] != null
                                          ? '**** **** **** ${paymentMethod['last4']}'
                                          : paymentMethod['email'] ?? '',
                                      style: AppTheme.bodyMedium.copyWith(
                                        color: AppTheme.darkTextSecondary,
                                      ),
                                    ),
                                    if (paymentMethod['expiryMonth'] != null && paymentMethod['expiryYear'] != null)
                                      Text(
                                        'Expires ${paymentMethod['expiryMonth']}/${paymentMethod['expiryYear']}',
                                        style: AppTheme.bodySmall.copyWith(
                                          color: AppTheme.darkTextTertiary,
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                              if (paymentMethod['isDefault'] == true)
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: AppTheme.spacingS,
                                    vertical: AppTheme.spacingXS,
                                  ),
                                  decoration: BoxDecoration(
                                    color: AppTheme.primaryColor.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(AppTheme.radiusS),
                                  ),
                                  child: Text(
                                    'Default',
                                    style: AppTheme.bodySmall.copyWith(
                                      color: AppTheme.primaryColor,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        );
                      },
                      childCount: _paymentMethods.length,
                    ),
                  ),
                const SliverToBoxAdapter(
                  child: SizedBox(height: AppTheme.spacingL),
                ),
              ],
            ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            heroTag: 'promo',
            backgroundColor: AppTheme.darkCardColor,
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const PromoCodesScreen(),
                ),
              );
            },
            child: const Icon(Icons.local_offer),
          ),
          const SizedBox(height: AppTheme.spacingS),
          FloatingActionButton(
            heroTag: 'add',
            backgroundColor: AppTheme.primaryColor,
            onPressed: () {
              _showAddPaymentMethodDialog();
            },
            child: const Icon(Icons.add),
          ),
        ],
      ),
    );
  }

  IconData _getPaymentIcon(String type) {
    switch (type.toLowerCase()) {
      case 'visa':
      case 'mastercard':
      case 'card':
        return Icons.credit_card;
      case 'wallet':
        return Icons.account_balance_wallet;
      case 'cash':
        return Icons.money;
      default:
        return Icons.payment;
    }
  }

  void _showAddPaymentMethodDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.darkSurfaceColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppTheme.radiusXL)),
      ),
      builder: (BuildContext context) {
        return Container(
          padding: const EdgeInsets.all(AppTheme.spacingL),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Add Payment Method',
                style: AppTheme.heading3.copyWith(
                  color: AppTheme.darkTextPrimary,
                ),
              ),
              const SizedBox(height: AppTheme.spacingL),
              ListTile(
                leading: Icon(Icons.credit_card, color: AppTheme.primaryColor),
                title: Text(
                  'Credit/Debit Card',
                  style: AppTheme.bodyLarge.copyWith(
                    color: AppTheme.darkTextPrimary,
                  ),
                ),
                onTap: () {
                  Navigator.pop(context);
                  _showCardForm();
                },
              ),
              ListTile(
                leading: Icon(Icons.account_balance_wallet, color: AppTheme.primaryColor),
                title: Text(
                  'Wallet',
                  style: AppTheme.bodyLarge.copyWith(
                    color: AppTheme.darkTextPrimary,
                  ),
                ),
                onTap: () {
                  Navigator.pop(context);
                  // Handle wallet addition
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Wallet feature coming soon')),
                  );
                },
              ),
              ListTile(
                leading: Icon(Icons.money, color: AppTheme.primaryColor),
                title: Text(
                  'Cash',
                  style: AppTheme.bodyLarge.copyWith(
                    color: AppTheme.darkTextPrimary,
                  ),
                ),
                onTap: () {
                  Navigator.pop(context);
                  _addCashPayment();
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _addCashPayment() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final token = authProvider.token;
    
    if (token == null) return;

    final success = await ApiService.addPaymentMethod(token, {
      'type': 'cash',
      'isDefault': _paymentMethods.isEmpty,
    });

    if (success) {
      _loadPaymentMethods();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Cash payment method added'),
            backgroundColor: AppTheme.successColor,
          ),
        );
      }
    }
  }

  void _showCardForm() {
    final cardNumberController = TextEditingController();
    final expiryController = TextEditingController();
    final cvvController = TextEditingController();
    final nameController = TextEditingController();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: AppTheme.darkSurfaceColor,
          title: Text(
            'Add Card',
            style: AppTheme.heading3.copyWith(
              color: AppTheme.darkTextPrimary,
            ),
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: cardNumberController,
                  style: TextStyle(color: AppTheme.darkTextPrimary),
                  decoration: InputDecoration(
                    labelText: 'Card Number',
                    labelStyle: TextStyle(color: AppTheme.darkTextSecondary),
                    hintText: '1234 5678 9012 3456',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppTheme.radiusM),
                    ),
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: AppTheme.spacingM),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: expiryController,
                        style: TextStyle(color: AppTheme.darkTextPrimary),
                        decoration: InputDecoration(
                          labelText: 'Expiry Date',
                          labelStyle: TextStyle(color: AppTheme.darkTextSecondary),
                          hintText: 'MM/YY',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(AppTheme.radiusM),
                          ),
                        ),
                        keyboardType: TextInputType.datetime,
                      ),
                    ),
                    const SizedBox(width: AppTheme.spacingM),
                    Expanded(
                      child: TextField(
                        controller: cvvController,
                        style: TextStyle(color: AppTheme.darkTextPrimary),
                        decoration: InputDecoration(
                          labelText: 'CVV',
                          labelStyle: TextStyle(color: AppTheme.darkTextSecondary),
                          hintText: '123',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(AppTheme.radiusM),
                          ),
                        ),
                        keyboardType: TextInputType.number,
                        obscureText: true,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppTheme.spacingM),
                TextField(
                  controller: nameController,
                  style: TextStyle(color: AppTheme.darkTextPrimary),
                  decoration: InputDecoration(
                    labelText: 'Cardholder Name',
                    labelStyle: TextStyle(color: AppTheme.darkTextSecondary),
                    hintText: 'John Doe',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppTheme.radiusM),
                    ),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(
                'Cancel',
                style: TextStyle(color: AppTheme.darkTextSecondary),
              ),
            ),
            TextButton(
              onPressed: () async {
                // In production, use Stripe or similar service
                // For now, just add to payment methods
                final authProvider = Provider.of<AuthProvider>(context, listen: false);
                final token = authProvider.token;
                
                if (token == null) return;

                final cardNumber = cardNumberController.text.replaceAll(' ', '');
                final last4 = cardNumber.length >= 4 
                    ? cardNumber.substring(cardNumber.length - 4)
                    : '';

                final success = await ApiService.addPaymentMethod(token, {
                  'type': 'card',
                  'last4': last4,
                  'expiryMonth': expiryController.text.split('/')[0],
                  'expiryYear': expiryController.text.split('/').length > 1 
                      ? expiryController.text.split('/')[1]
                      : '',
                  'isDefault': _paymentMethods.isEmpty,
                });

                if (success) {
                  Navigator.pop(context);
                  _loadPaymentMethods();
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Card added successfully'),
                        backgroundColor: AppTheme.successColor,
                      ),
                    );
                  }
                }
              },
              child: Text(
                'Add Card',
                style: TextStyle(color: AppTheme.primaryColor),
              ),
            ),
          ],
        );
      },
    );
  }
}
