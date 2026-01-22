import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class AdminTripsScreen extends StatelessWidget {
  const AdminTripsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBackgroundColor,
      body: Center(
        child: Text(
          'Trips Management',
          style: AppTheme.heading2.copyWith(
            color: AppTheme.darkTextPrimary,
          ),
        ),
      ),
    );
  }
}

