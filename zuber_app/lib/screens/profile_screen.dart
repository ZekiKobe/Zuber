import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';
import 'help_support_screen.dart';
import 'payment_screen.dart';
import 'safety_screen.dart';
import 'notifications_screen.dart';
import 'settings_screen.dart';
import 'favorites_screen.dart';
import 'login_screen.dart';
import 'phone_verification_screen.dart';

import 'trip_history_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = authProvider.token;

      if (token == null) {
        setState(() {
          _isLoading = false;
        });
        return;
      }

      await ApiService.getUserProfile(token);
    } catch (e) {
      print('Error loading profile: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    if (_isLoading) {
      return Scaffold(
        backgroundColor: AppTheme.darkBackgroundColor,
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final user = authProvider.user;
    final fullName = user?.fullName ?? 'User';
    final rating = user?.rating ?? 0.0;

    return Scaffold(
      backgroundColor: AppTheme.darkBackgroundColor,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // Header with Name and Rating
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(AppTheme.spacingL),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            fullName,
                            style: const TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: AppTheme.spacingXS),
                          Row(
                            children: [
                              const Icon(
                                Icons.star,
                                color: Colors.white,
                                size: 16,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                rating.toStringAsFixed(1),
                                style: const TextStyle(
                                  fontSize: 16,
                                  color: Colors.white,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    // Profile Picture
                    _buildProfileAvatar(user, null),
                  ],
                ),
              ),
            ),

            // Quick Actions Grid
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingL),
                child: GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2,
                  crossAxisSpacing: AppTheme.spacingM,
                  mainAxisSpacing: AppTheme.spacingM,
                  childAspectRatio: 1.2,
                  children: [
                    _buildQuickActionButton(
                      icon: Icons.help_outline,
                      label: 'Help',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const HelpSupportScreen(),
                          ),
                        );
                      },
                    ),
                    _buildQuickActionButton(
                      icon: Icons.account_balance_wallet_outlined,
                      label: 'Wallet',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const PaymentScreen(),
                          ),
                        );
                      },
                    ),
                    _buildQuickActionButton(
                      icon: Icons.shield_outlined,
                      label: 'Safety',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const SafetyScreen(),
                          ),
                        );
                      },
                    ),
                    _buildQuickActionButton(
                      icon: Icons.inbox_outlined,
                      label: 'Inbox',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const NotificationsScreen(),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),

            const SliverToBoxAdapter(
              child: SizedBox(height: AppTheme.spacingL),
            ),

            // Promotional Banners
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingL),
                child: Column(
                  children: [
                    _buildPromoBanner(
                      title: 'Try Zuber One free',
                      subtitle: 'Unlock 10% Zuber One credits on rides and more',
                      icon: Icons.local_taxi,
                      iconColor: Colors.amber,
                      backgroundColor: AppTheme.darkCardColor,
                    ),
                    const SizedBox(height: AppTheme.spacingM),
                    _buildPromoBanner(
                      title: 'Privacy checkup',
                      subtitle: 'Take an interactive tour of your privacy settings',
                      icon: Icons.privacy_tip,
                      iconColor: AppTheme.primaryColor,
                      backgroundColor: AppTheme.darkCardColor,
                    ),
                  ],
                ),
              ),
            ),

            const SliverToBoxAdapter(
              child: SizedBox(height: AppTheme.spacingL),
            ),

            // Menu Items
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingL),
                child: Column(
                  children: [
                    _buildMenuItem(
                      icon: Icons.family_restroom,
                      title: 'Family',
                      subtitle: 'Manage adult and senior accounts',
                      onTap: () {
                        // TODO: Implement family management
                      },
                    ),
                    _buildMenuItem(
                      icon: Icons.settings_outlined,
                      title: 'Settings',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const SettingsScreen(),
                          ),
                        );
                      },
                    ),
                    _buildMenuItem(
                      icon: Icons.phone_android_outlined,
                      title: 'Simple mode',
                      subtitle: 'A simplified app for older adults',
                      badge: 'NEW',
                      onTap: () {
                        // TODO: Implement simple mode
                      },
                    ),


                    _buildMenuItem(
                      icon: Icons.group_outlined,
                      title: 'Saved groups',
                      badge: 'NEW',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const FavoritesScreen(),
                          ),
                        );
                      },
                    ),
                    // Logout
                    _buildMenuItem(
                      icon: Icons.logout,
                      title: 'Logout',
                      onTap: () {
                        _showLogoutConfirmation(context, authProvider);
                      },
                    ),
                  ],
                ),
              ),
            ),

            const SliverToBoxAdapter(
              child: SizedBox(height: AppTheme.spacingXXL),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppTheme.radiusL),
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.darkCardColor,
          borderRadius: BorderRadius.circular(AppTheme.radiusL),
          border: Border.all(
            color: AppTheme.darkDividerColor,
            width: 1,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: Colors.white,
              size: 32,
            ),
            const SizedBox(height: AppTheme.spacingS),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPromoBanner({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required Color backgroundColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(AppTheme.spacingL),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(AppTheme.radiusL),
        border: Border.all(
          color: AppTheme.darkDividerColor,
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: AppTheme.spacingXS),
                Text(
                  subtitle,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.7),
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: AppTheme.spacingM),
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.2),
              borderRadius: BorderRadius.circular(AppTheme.radiusM),
            ),
            child: Icon(
              icon,
              color: iconColor,
              size: 32,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    String? subtitle,
    String? badge,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(
          vertical: AppTheme.spacingM,
        ),
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: AppTheme.darkDividerColor,
              width: 0.5,
            ),
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: Colors.white,
              size: 24,
            ),
            const SizedBox(width: AppTheme.spacingM),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      if (badge != null) ...[
                        const SizedBox(width: AppTheme.spacingS),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryColor,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            badge,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.6),
                        fontSize: 13,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            Icon(
              Icons.chevron_right,
              color: Colors.white.withOpacity(0.5),
              size: 20,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileAvatar(user, driver) {
    final profilePictureUrl = user?.profilePicture;
    
    final hasValidImage = profilePictureUrl != null && 
                          profilePictureUrl.toString().trim().isNotEmpty &&
                          profilePictureUrl.toString().startsWith('http');

    return CircleAvatar(
      radius: 30,
      backgroundColor: Colors.white,
      child: hasValidImage
          ? ClipOval(
              child: Image.network(
                profilePictureUrl.toString(),
                width: 60,
                height: 60,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Icon(
                    Icons.person,
                    color: AppTheme.darkTextSecondary,
                    size: 30,
                  );
                },
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return SizedBox(
                    width: 30,
                    height: 30,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      value: loadingProgress.expectedTotalBytes != null
                          ? loadingProgress.cumulativeBytesLoaded /
                              loadingProgress.expectedTotalBytes!
                          : null,
                    ),
                  );
                },
              ),
            )
          : Icon(
              Icons.person,
              color: AppTheme.darkTextSecondary,
              size: 30,
            ),
    );
  }

  void _showLogoutConfirmation(BuildContext context, AuthProvider authProvider) {
    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          backgroundColor: AppTheme.darkSurfaceColor,
          title: const Text(
            'Logout',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          content: const Text(
            'Are you sure you want to logout?',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 16,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: Text(
                'Cancel',
                style: TextStyle(color: AppTheme.darkTextSecondary),
              ),
            ),
            TextButton(
              onPressed: () async {
                await authProvider.logout();
                if (context.mounted) {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (_) => PhoneVerificationScreen()),
                    (route) => false,
                  );
                }
              },
              child: const Text(
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
