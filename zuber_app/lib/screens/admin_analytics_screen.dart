import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class AdminAnalyticsScreen extends StatefulWidget {
  const AdminAnalyticsScreen({Key? key}) : super(key: key);

  @override
  State<AdminAnalyticsScreen> createState() => _AdminAnalyticsScreenState();
}

class _AdminAnalyticsScreenState extends State<AdminAnalyticsScreen> {
  Map<String, dynamic> _analytics = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAnalytics();
  }

  Future<void> _loadAnalytics() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // TODO: Implement admin analytics API endpoint
      await Future.delayed(const Duration(seconds: 1));
      
      setState(() {
        _analytics = {
          'totalUsers': 1250,
          'totalDrivers': 350,
          'totalRides': 5420,
          'totalRevenue': 125000,
          'activeRides': 45,
          'pendingDrivers': 12,
        };
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading analytics: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBackgroundColor,
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
                          'Analytics Dashboard',
                          style: AppTheme.heading1.copyWith(
                            color: AppTheme.darkTextPrimary,
                          ),
                        ),
                        const SizedBox(height: AppTheme.spacingL),
                      ],
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingL),
                  sliver: SliverGrid(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 1.2,
                      crossAxisSpacing: AppTheme.spacingM,
                      mainAxisSpacing: AppTheme.spacingM,
                    ),
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final stats = [
                          {
                            'label': 'Total Users',
                            'value': _analytics['totalUsers']?.toString() ?? '0',
                            'icon': Icons.people,
                            'color': AppTheme.primaryColor,
                          },
                          {
                            'label': 'Total Drivers',
                            'value': _analytics['totalDrivers']?.toString() ?? '0',
                            'icon': Icons.local_taxi,
                            'color': AppTheme.infoColor,
                          },
                          {
                            'label': 'Total Rides',
                            'value': _analytics['totalRides']?.toString() ?? '0',
                            'icon': Icons.directions_car,
                            'color': AppTheme.successColor,
                          },
                          {
                            'label': 'Total Revenue',
                            'value': '\$${_analytics['totalRevenue']?.toString() ?? '0'}',
                            'icon': Icons.attach_money,
                            'color': AppTheme.warningColor,
                          },
                        ];
                        
                        if (index >= stats.length) return null;
                        final stat = stats[index];
                        
                        return Container(
                          padding: const EdgeInsets.all(AppTheme.spacingL),
                          decoration: BoxDecoration(
                            color: AppTheme.darkCardColor,
                            borderRadius: BorderRadius.circular(AppTheme.radiusM),
                            border: Border.all(
                              color: AppTheme.darkDividerColor,
                              width: 1,
                            ),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                stat['icon'] as IconData,
                                color: stat['color'] as Color,
                                size: 40,
                              ),
                              const SizedBox(height: AppTheme.spacingM),
                              Text(
                                stat['value'] as String,
                                style: AppTheme.heading2.copyWith(
                                  color: AppTheme.darkTextPrimary,
                                ),
                              ),
                              const SizedBox(height: AppTheme.spacingXS),
                              Text(
                                stat['label'] as String,
                                style: AppTheme.bodyMedium.copyWith(
                                  color: AppTheme.darkTextSecondary,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        );
                      },
                      childCount: 4,
                    ),
                  ),
                ),
                const SliverToBoxAdapter(
                  child: SizedBox(height: AppTheme.spacingL),
                ),
              ],
            ),
    );
  }
}

