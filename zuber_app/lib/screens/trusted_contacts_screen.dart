import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class TrustedContactsScreen extends StatelessWidget {
  const TrustedContactsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.darkSurfaceColor,
        elevation: 0,
        title: const Text('Trusted Contacts'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: Text(
          'Trusted Contacts',
          style: AppTheme.heading2.copyWith(
            color: AppTheme.darkTextPrimary,
          ),
        ),
      ),
    );
  }
}

