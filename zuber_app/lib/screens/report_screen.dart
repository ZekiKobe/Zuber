import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class ReportScreen extends StatelessWidget {
  const ReportScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.darkSurfaceColor,
        elevation: 0,
        title: const Text('Report Issue'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: Text(
          'Report Screen',
          style: AppTheme.heading2.copyWith(
            color: AppTheme.darkTextPrimary,
          ),
        ),
      ),
    );
  }
}

