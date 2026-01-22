import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';

class ModernProfileScreen extends StatefulWidget {
  final bool isDriver;

  const ModernProfileScreen({
    Key? key,
    this.isDriver = false,
  }) : super(key: key);

  @override
  State<ModernProfileScreen> createState() => _ModernProfileScreenState();
}

class _ModernProfileScreenState extends State<ModernProfileScreen> {
  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.currentUser;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: AppTheme.primaryColor,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: AppTheme.primaryGradient,
                ),
                child: Stack(
                  children: [
                    // Profile picture
                    Align(
                      alignment: Alignment.bottomCenter,
                      child: Container(
                        width: 100,
                        height: 100,
                        margin: const EdgeInsets.only(bottom: AppTheme.spacingM),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.white,
                            width: 3,
                          ),
                          color: Colors.white,
                        ),
                        child: ClipOval(
                          child: user?.profilePicture != null
                              ? Image.network(
                                  user!.profilePicture!,
                                  fit: BoxFit.cover,
                                  width: 100,
                                  height: 100,
                                )
                              : Icon(
                                  widget.isDriver ? Icons.person : Icons.person_outline,
                                  size: 50,
                                  color: AppTheme.primaryColor,
                                ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            title: Text(
              widget.isDriver ? 'Driver Profile' : 'My Profile',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w600,
              ),
            ),
            foregroundColor: Colors.white,
          ),
          
          SliverList(
            delegate: SliverChildListDelegate([
              const SizedBox(height: AppTheme.spacingM),
              
              // User Info Cards
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingM),
                child: Column(
                  children: [
                    _buildInfoCard(
                      icon: Icons.person,
                      title: 'Name',
                      value: user?.fullName ?? 'N/A',
                    ),
                    
                    const SizedBox(height: AppTheme.spacingS),
                    
                    _buildInfoCard(
                      icon: Icons.phone,
                      title: 'Phone',
                      value: user?.phoneNumber ?? 'N/A',
                    ),
                    
                    const SizedBox(height: AppTheme.spacingS),
                    
                    _buildInfoCard(
                      icon: Icons.email,
                      title: 'Email',
                      value: user?.email ?? 'N/A',
                    ),
                    
                    const SizedBox(height: AppTheme.spacingS),
                    
                    if (widget.isDriver)
                      _buildInfoCard(
                        icon: Icons.rate_review,
                        title: 'Rating',
                        value: user?.rating != null ? '${user!.rating.toStringAsFixed(1)} ★' : 'N/A',
                      ),
                    
                    const SizedBox(height: AppTheme.spacingM),
                    
                    // Quick Stats
                    if (widget.isDriver)
                      Container(
                        padding: const EdgeInsets.all(AppTheme.spacingM),
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceColor,
                          borderRadius: BorderRadius.circular(AppTheme.radiusL),
                          boxShadow: AppTheme.cardShadow,
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            _buildStatCard(
                              title: 'Trips',
                              value: user?.totalRides?.toString() ?? '0',
                              color: AppTheme.primaryColor,
                            ),
                            _buildStatCard(
                              title: 'Earnings',
                              value: r'$1,234',
                              color: AppTheme.successColor,
                            ),
                            _buildStatCard(
                              title: 'Rating',
                              value: user?.rating != null ? user!.rating.toStringAsFixed(1) : '0',
                              color: AppTheme.accentColor,
                            ),
                          ],
                        ),
                      ),
                    
                    const SizedBox(height: AppTheme.spacingM),
                    
                    // Settings Options
                    _buildSettingItem(
                      icon: Icons.account_circle,
                      title: 'Edit Profile',
                      onTap: () {
                        // Navigate to edit profile
                      },
                    ),
                    
                    const Divider(height: 1),
                    
                    _buildSettingItem(
                      icon: Icons.payment,
                      title: 'Payment Methods',
                      onTap: () {
                        // Navigate to payment methods
                      },
                    ),
                    
                    const Divider(height: 1),
                    
                    _buildSettingItem(
                      icon: Icons.notifications,
                      title: 'Notifications',
                      onTap: () {
                        // Navigate to notifications settings
                      },
                    ),
                    
                    const Divider(height: 1),
                    
                    _buildSettingItem(
                      icon: Icons.security,
                      title: 'Privacy & Security',
                      onTap: () {
                        // Navigate to privacy settings
                      },
                    ),
                    
                    const Divider(height: 1),
                    
                    _buildSettingItem(
                      icon: Icons.help,
                      title: 'Help & Support',
                      onTap: () {
                        // Navigate to help
                      },
                    ),
                    
                    const Divider(height: 1),
                    
                    _buildSettingItem(
                      icon: Icons.logout,
                      title: 'Logout',
                      textColor: AppTheme.errorColor,
                      onTap: () {
                        // Logout
                        authProvider.logout();
                      },
                    ),
                    
                    const SizedBox(height: AppTheme.spacingM),
                  ],
                ),
              ),
            ]),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard({
    required IconData icon,
    required String title,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.all(AppTheme.spacingM),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(AppTheme.radiusL),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Row(
        children: [
          Icon(
            icon,
            color: AppTheme.primaryColor,
            size: 20,
          ),
          const SizedBox(width: AppTheme.spacingM),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: AppTheme.bodySmall.copyWith(
                    color: AppTheme.textSecondary,
                  ),
                ),
                const SizedBox(height: AppTheme.spacingXS),
                Text(
                  value,
                  style: AppTheme.bodyLarge.copyWith(
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required Color color,
  }) {
    return Column(
      children: [
        Text(
          value,
          style: AppTheme.heading3.copyWith(
            color: color,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: AppTheme.spacingXS),
        Text(
          title,
          style: AppTheme.bodySmall.copyWith(
            color: AppTheme.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildSettingItem({
    required IconData icon,
    required String title,
    Color? textColor,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: AppTheme.primaryColor.withOpacity(0.1),
          shape: BoxShape.circle,
        ),
        child: Icon(
          icon,
          color: AppTheme.primaryColor,
          size: 20,
        ),
      ),
      title: Text(
        title,
        style: TextStyle(
          color: textColor ?? AppTheme.textPrimary,
          fontWeight: FontWeight.w500,
        ),
      ),
      trailing: Icon(
        Icons.arrow_forward_ios,
        size: 16,
        color: AppTheme.textTertiary,
      ),
      onTap: onTap,
    );
  }
}