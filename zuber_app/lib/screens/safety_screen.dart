import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'trusted_contacts_screen.dart';
import 'report_screen.dart';

class SafetyScreen extends StatefulWidget {
  const SafetyScreen({Key? key}) : super(key: key);

  @override
  State<SafetyScreen> createState() => _SafetyScreenState();
}

class _SafetyScreenState extends State<SafetyScreen> {
  bool _isSosActive = false;

  Future<void> _triggerSOS() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.darkSurfaceColor,
        title: Text(
          'Trigger Emergency SOS?',
          style: AppTheme.heading3.copyWith(
            color: AppTheme.darkTextPrimary,
          ),
        ),
        content: Text(
          'This will send your location to emergency contacts and authorities.',
          style: AppTheme.bodyMedium.copyWith(
            color: AppTheme.darkTextSecondary,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text(
              'Cancel',
              style: TextStyle(color: AppTheme.darkTextSecondary),
            ),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text(
              'Confirm',
              style: TextStyle(color: AppTheme.errorColor),
            ),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      setState(() {
        _isSosActive = true;
      });

      // TODO: Implement SOS API call
      // await ApiService.triggerSOS(token, location);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('SOS alert sent to emergency contacts'),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.darkSurfaceColor,
        elevation: 0,
        title: const Text('Safety & Security'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppTheme.spacingL),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // SOS Button
            Container(
              padding: const EdgeInsets.all(AppTheme.spacingXL),
              decoration: BoxDecoration(
                color: _isSosActive 
                    ? AppTheme.errorColor.withOpacity(0.2)
                    : AppTheme.darkCardColor,
                borderRadius: BorderRadius.circular(AppTheme.radiusL),
                border: Border.all(
                  color: _isSosActive 
                      ? AppTheme.errorColor
                      : AppTheme.darkDividerColor,
                  width: _isSosActive ? 3 : 1,
                ),
              ),
              child: Column(
                children: [
                  Icon(
                    Icons.warning,
                    size: 64,
                    color: AppTheme.errorColor,
                  ),
                  const SizedBox(height: AppTheme.spacingM),
                  Text(
                    'Emergency SOS',
                    style: AppTheme.heading2.copyWith(
                      color: AppTheme.darkTextPrimary,
                    ),
                  ),
                  const SizedBox(height: AppTheme.spacingS),
                  Text(
                    'Tap to send emergency alert',
                    style: AppTheme.bodyMedium.copyWith(
                      color: AppTheme.darkTextSecondary,
                    ),
                  ),
                  const SizedBox(height: AppTheme.spacingL),
                  ElevatedButton(
                    onPressed: _triggerSOS,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.errorColor,
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppTheme.spacingXL,
                        vertical: AppTheme.spacingM,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppTheme.radiusM),
                      ),
                    ),
                    child: Text(
                      _isSosActive ? 'SOS Active' : 'Trigger SOS',
                      style: AppTheme.buttonText,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppTheme.spacingL),

            // Safety Features
            Text(
              'Safety Features',
              style: AppTheme.heading3.copyWith(
                color: AppTheme.darkTextPrimary,
              ),
            ),
            const SizedBox(height: AppTheme.spacingM),

            _buildSafetyOption(
              icon: Icons.contacts,
              title: 'Trusted Contacts',
              subtitle: 'Add emergency contacts',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const TrustedContactsScreen(),
                  ),
                );
              },
            ),
            const SizedBox(height: AppTheme.spacingM),

            _buildSafetyOption(
              icon: Icons.report_problem,
              title: 'Report Issue',
              subtitle: 'Report driver or rider',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const ReportScreen(),
                  ),
                );
              },
            ),
            const SizedBox(height: AppTheme.spacingM),

            _buildSafetyOption(
              icon: Icons.share_location,
              title: 'Share Trip',
              subtitle: 'Share live trip with contacts',
              onTap: () {
                // TODO: Implement share trip
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Share trip feature coming soon'),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSafetyOption({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppTheme.radiusM),
      child: Container(
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
              padding: const EdgeInsets.all(AppTheme.spacingM),
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppTheme.radiusS),
              ),
              child: Icon(
                icon,
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
                    title,
                    style: AppTheme.bodyLarge.copyWith(
                      color: AppTheme.darkTextPrimary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: AppTheme.spacingXS),
                  Text(
                    subtitle,
                    style: AppTheme.bodySmall.copyWith(
                      color: AppTheme.darkTextSecondary,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios,
              size: 16,
              color: AppTheme.darkTextSecondary,
            ),
          ],
        ),
      ),
    );
  }
}

