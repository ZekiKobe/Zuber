import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'admin_users_screen.dart';
import 'admin_drivers_screen.dart';
import 'admin_trips_screen.dart';
import 'admin_analytics_screen.dart';
import 'admin_settings_screen.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({Key? key}) : super(key: key);

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const AdminAnalyticsScreen(),
    const AdminUsersScreen(),
    const AdminDriversScreen(),
    const AdminTripsScreen(),
    const AdminSettingsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.darkSurfaceColor,
        elevation: 0,
        title: const Text('Admin Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: _screens[_selectedIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppTheme.darkSurfaceColor,
          border: Border(
            top: BorderSide(
              color: AppTheme.darkDividerColor,
              width: 1,
            ),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) {
            setState(() {
              _selectedIndex = index;
            });
          },
          type: BottomNavigationBarType.fixed,
          backgroundColor: AppTheme.darkSurfaceColor,
          selectedItemColor: AppTheme.primaryColor,
          unselectedItemColor: AppTheme.darkTextSecondary,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard),
              label: 'Analytics',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.people),
              label: 'Users',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.local_taxi),
              label: 'Drivers',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.history),
              label: 'Trips',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.settings),
              label: 'Settings',
            ),
          ],
        ),
      ),
    );
  }
}

