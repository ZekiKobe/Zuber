import 'package:flutter/material.dart';
import '../utils/constants.dart';

class PromoCodesScreen extends StatefulWidget {
  const PromoCodesScreen({Key? key}) : super(key: key);

  @override
  State<PromoCodesScreen> createState() => _PromoCodesScreenState();
}

class _PromoCodesScreenState extends State<PromoCodesScreen> {
  final List<Map<String, dynamic>> _promoCodes = [
    {
      'code': 'SAVE20',
      'discount': '20% off',
      'description': 'Get 20% off your next 3 rides',
      'expiry': 'Dec 31, 2023',
      'isActive': true,
    },
    {
      'code': 'FREERIDE',
      'discount': '\$10 off',
      'description': '\$10 off your next ride (min. \$20)',
      'expiry': 'Nov 30, 2023',
      'isActive': true,
    },
    {
      'code': 'WELCOME15',
      'discount': '15% off',
      'description': '15% off your first 5 rides',
      'expiry': 'Expired',
      'isActive': false,
    },
  ];

  final TextEditingController _promoCodeController = TextEditingController();

  @override
  void dispose() {
    _promoCodeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Promo Codes'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppDimensions.paddingMedium),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Add Promo Code
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppDimensions.paddingMedium),
                child: Column(
                  children: [
                    const Text(
                      'Enter Promo Code',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: _promoCodeController,
                      decoration: InputDecoration(
                        hintText: 'Enter promo code',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(AppDimensions.borderRadiusMedium),
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: AppDimensions.paddingMedium,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () {
                        _applyPromoCode();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.accent,
                        foregroundColor: AppColors.secondary,
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppDimensions.paddingLarge,
                          vertical: AppDimensions.paddingMedium,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(AppDimensions.borderRadiusMedium),
                        ),
                      ),
                      child: const Text(
                        'Apply Code',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 30),
            
            // Active Promo Codes
            const Text(
              'Your Promo Codes',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            
            _promoCodes.isEmpty
                ? const Center(
                    child: Text(
                      'No promo codes available',
                      style: TextStyle(
                        fontSize: 16,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  )
                : ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _promoCodes.length,
                    itemBuilder: (context, index) {
                      final promo = _promoCodes[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: AppDimensions.paddingMedium),
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(AppDimensions.paddingMedium),
                          title: Text(
                            promo['code'],
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: promo['isActive'] 
                                  ? AppColors.textPrimary 
                                  : AppColors.textSecondary,
                            ),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 5),
                              Text(
                                promo['discount'],
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: promo['isActive'] 
                                      ? AppColors.accent 
                                      : AppColors.textSecondary,
                                ),
                              ),
                              const SizedBox(height: 5),
                              Text(
                                promo['description'],
                                style: const TextStyle(
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(height: 5),
                              Text(
                                'Expires: ${promo['expiry']}',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: promo['isActive'] 
                                      ? AppColors.textSecondary 
                                      : Colors.red,
                                ),
                              ),
                            ],
                          ),
                          trailing: promo['isActive']
                              ? ElevatedButton(
                                  onPressed: () {
                                    _copyPromoCode(promo['code']);
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppColors.accent,
                                    foregroundColor: AppColors.secondary,
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: AppDimensions.paddingMedium,
                                      vertical: AppDimensions.paddingSmall,
                                    ),
                                  ),
                                  child: const Text('Copy'),
                                )
                              : null,
                        ),
                      );
                    },
                  ),
          ],
        ),
      ),
    );
  }

  void _applyPromoCode() {
    final code = _promoCodeController.text.trim();
    if (code.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a promo code'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }
    
    // In a real app, you would validate the promo code with an API
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Promo code "$code" applied successfully'),
        backgroundColor: AppColors.accent,
      ),
    );
    
    _promoCodeController.clear();
  }

  void _copyPromoCode(String code) {
    // In a real app, you would use a package like clipboard to copy to clipboard
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Promo code "$code" copied to clipboard'),
        backgroundColor: AppColors.accent,
      ),
    );
  }
}