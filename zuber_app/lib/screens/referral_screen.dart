import 'package:flutter/material.dart';
import '../utils/constants.dart';

class ReferralScreen extends StatefulWidget {
  const ReferralScreen({Key? key}) : super(key: key);

  @override
  State<ReferralScreen> createState() => _ReferralScreenState();
}

class _ReferralScreenState extends State<ReferralScreen> {
  final String _referralCode = 'ZUBER123';
  int _referrals = 5;
  double _earnings = 25.00;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Referral Program'),
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
            // Referral Banner
            Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.accent, Color(0xFF10A37F)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(AppDimensions.borderRadiusLarge),
              ),
              padding: const EdgeInsets.all(AppDimensions.paddingLarge),
              child: Column(
                children: [
                  const Icon(
                    Icons.card_giftcard,
                    size: 60,
                    color: AppColors.secondary,
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Invite Friends, Earn Rewards',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppColors.secondary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Share your referral code and earn \$5 for every friend who signs up and completes their first ride.',
                    style: TextStyle(
                      fontSize: 16,
                      color: AppColors.secondary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),
            
            // Referral Stats
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppDimensions.paddingMedium),
                child: Column(
                  children: [
                    const Text(
                      'Your Referral Stats',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatItem('Friends Referred', _referrals.toString()),
                        _buildStatItem('Earned', '\$${_earnings.toStringAsFixed(2)}'),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 30),
            
            // Referral Code
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppDimensions.paddingMedium),
                child: Column(
                  children: [
                    const Text(
                      'Your Referral Code',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.all(AppDimensions.paddingMedium),
                      decoration: BoxDecoration(
                        color: AppColors.background,
                        borderRadius: BorderRadius.circular(AppDimensions.borderRadiusMedium),
                        border: Border.all(color: AppColors.divider),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            _referralCode,
                            style: const TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 2,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.copy),
                            onPressed: () {
                              _copyToClipboard(_referralCode);
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () {
                        _shareReferralCode();
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
                        'Share Referral Code',
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
            
            // How It Works
            const Text(
              'How It Works',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            
            _buildHowItWorksItem(
              1,
              'Share Your Code',
              'Send your referral code to friends and family',
            ),
            const SizedBox(height: 20),
            _buildHowItWorksItem(
              2,
              'Friend Signs Up',
              'Your friend uses your code when registering',
            ),
            const SizedBox(height: 20),
            _buildHowItWorksItem(
              3,
              'Friend Takes First Ride',
              'Your friend completes their first ride',
            ),
            const SizedBox(height: 20),
            _buildHowItWorksItem(
              4,
              'You Earn Rewards',
              'You get \$5 credited to your account',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: AppColors.accent,
          ),
        ),
        const SizedBox(height: 5),
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildHowItWorksItem(int step, String title, String description) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 30,
          height: 30,
          decoration: const BoxDecoration(
            color: AppColors.accent,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              step.toString(),
              style: const TextStyle(
                color: AppColors.secondary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(width: 15),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 5),
              Text(
                description,
                style: const TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _copyToClipboard(String text) {
    // In a real app, you would use a package like clipboard to copy to clipboard
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Referral code copied to clipboard'),
        backgroundColor: AppColors.accent,
      ),
    );
  }

  void _shareReferralCode() {
    // In a real app, you would use a package like share_plus to share
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Sharing options opened'),
        backgroundColor: AppColors.accent,
      ),
    );
  }
}