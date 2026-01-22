import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';
import 'login_screen.dart';
import 'phone_verification_screen.dart';
import 'help_support_screen.dart';
import 'referral_screen.dart';
import 'safety_screen.dart';
import 'payment_screen.dart';

import 'trip_history_screen.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notificationsEnabled = true;
  bool _locationEnabled = true;

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final isDriver = false; // Always false for customer-only app

    return Scaffold(
      backgroundColor: AppTheme.darkBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.darkSurfaceColor,
        elevation: 0,
        title: const Text('Settings'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppTheme.spacingL),
        children: [
          // Profile Section
          Text(
            'Profile',
            style: AppTheme.heading3.copyWith(
              color: AppTheme.darkTextPrimary,
            ),
          ),
          const SizedBox(height: AppTheme.spacingM),
          Container(
            padding: const EdgeInsets.all(AppTheme.spacingL),
            decoration: BoxDecoration(
              color: AppTheme.darkCardColor,
              borderRadius: BorderRadius.circular(AppTheme.radiusM),
              border: Border.all(
                color: AppTheme.darkDividerColor,
                width: 1,
              ),
            ),
            child: ListTile(
              contentPadding: EdgeInsets.zero,
              leading: CircleAvatar(
                backgroundColor: AppTheme.primaryColor,
                child: Text(
                  (authProvider.user?.firstName ?? 'U')[0].toUpperCase(),
                  style: const TextStyle(color: Colors.white),
                ),
              ),
              title: Text(
                authProvider.user?.fullName ?? 'User',
                style: AppTheme.bodyLarge.copyWith(
                  color: AppTheme.darkTextPrimary,
                ),
              ),
              subtitle: Text(
                authProvider.user?.email ?? '',
                style: AppTheme.bodySmall.copyWith(
                  color: AppTheme.darkTextSecondary,
                ),
              ),
            ),
          ),
          const SizedBox(height: AppTheme.spacingXL),

          // Settings Options
          _buildSettingsSection(
            'General',
            [
              // Payment Methods - only for users
              if (!isDriver)
                _buildSettingsTile(
                  icon: Icons.payment,
                  title: 'Payment Methods',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const PaymentScreen(),
                      ),
                    );
                  },
                ),
              _buildSettingsTile(
                icon: Icons.security,
                title: 'Safety & Security',
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const SafetyScreen(),
                    ),
                  );
                },
              ),

            ],
          ),
          const SizedBox(height: AppTheme.spacingL),

          _buildSettingsSection(
            'Preferences',
            [
              _buildSwitchTile(
                icon: Icons.notifications,
                title: 'Notifications',
                subtitle: 'Receive ride updates and promotions',
                value: _notificationsEnabled,
                onChanged: (value) {
                  setState(() {
                    _notificationsEnabled = value;
                  });
                },
              ),
              _buildSwitchTile(
                icon: Icons.location_on,
                title: 'Location Access',
                subtitle: 'Allow app to access your location',
                value: _locationEnabled,
                onChanged: (value) {
                  setState(() {
                    _locationEnabled = value;
                  });
                },
              ),
            ],
          ),
          const SizedBox(height: AppTheme.spacingL),

          _buildSettingsSection(
            'Support',
            [
              _buildSettingsTile(
                icon: Icons.help_outline,
                title: 'Help & Support',
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const HelpSupportScreen(),
                    ),
                  );
                },
              ),
              _buildSettingsTile(
                icon: Icons.card_giftcard,
                title: 'Referral Program',
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const ReferralScreen(),
                    ),
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: AppTheme.spacingXL),

          // Logout Button
          ElevatedButton(
            onPressed: () {
              _showLogoutConfirmation();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.errorColor,
              padding: const EdgeInsets.symmetric(
                vertical: AppTheme.spacingM,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppTheme.radiusM),
              ),
            ),
            child: Text(
              'Logout',
              style: AppTheme.buttonText,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsSection(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: AppTheme.heading3.copyWith(
            color: AppTheme.darkTextPrimary,
          ),
        ),
        const SizedBox(height: AppTheme.spacingM),
        Container(
          decoration: BoxDecoration(
            color: AppTheme.darkCardColor,
            borderRadius: BorderRadius.circular(AppTheme.radiusM),
            border: Border.all(
              color: AppTheme.darkDividerColor,
              width: 1,
            ),
          ),
          child: Column(
            children: children,
          ),
        ),
      ],
    );
  }

  Widget _buildSettingsTile({
    required IconData icon,
    required String title,
    String? subtitle,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: AppTheme.primaryColor),
      title: Text(
        title,
        style: AppTheme.bodyLarge.copyWith(
          color: AppTheme.darkTextPrimary,
        ),
      ),
      subtitle: subtitle != null
          ? Text(
              subtitle,
              style: AppTheme.bodySmall.copyWith(
                color: AppTheme.darkTextSecondary,
              ),
            )
          : null,
      trailing: Icon(
        Icons.arrow_forward_ios,
        size: 16,
        color: AppTheme.darkTextSecondary,
      ),
      onTap: onTap,
    );
  }

  Widget _buildSwitchTile({
    required IconData icon,
    required String title,
    String? subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return ListTile(
      leading: Icon(icon, color: AppTheme.primaryColor),
      title: Text(
        title,
        style: AppTheme.bodyLarge.copyWith(
          color: AppTheme.darkTextPrimary,
        ),
      ),
      subtitle: subtitle != null
          ? Text(
              subtitle,
              style: AppTheme.bodySmall.copyWith(
                color: AppTheme.darkTextSecondary,
              ),
            )
          : null,
      trailing: Switch(
        value: value,
        onChanged: onChanged,
        activeColor: AppTheme.primaryColor,
      ),
    );
  }

  void _showLogoutConfirmation() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: AppTheme.darkSurfaceColor,
          title: Text(
            'Logout',
            style: AppTheme.heading3.copyWith(
              color: AppTheme.darkTextPrimary,
            ),
          ),
          content: Text(
            'Are you sure you want to logout?',
            style: AppTheme.bodyMedium.copyWith(
              color: AppTheme.darkTextSecondary,
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
              onPressed: () {
                Provider.of<AuthProvider>(context, listen: false).logout();
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (context) => PhoneVerificationScreen()),
                  (route) => false,
                );
              },
              child: Text(
                'Logout',
                style: TextStyle(color: AppTheme.errorColor),
              ),
            ),
          ],
        );
      },
    );
  }
}
