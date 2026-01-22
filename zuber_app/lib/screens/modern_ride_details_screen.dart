import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/modern_ride_progress.dart';

class ModernRideDetailsScreen extends StatefulWidget {
  final String rideId;
  
  const ModernRideDetailsScreen({
    Key? key,
    required this.rideId,
  }) : super(key: key);

  @override
  State<ModernRideDetailsScreen> createState() => _ModernRideDetailsScreenState();
}

class _ModernRideDetailsScreenState extends State<ModernRideDetailsScreen> {
  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final isDriver = !authProvider.isUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Ride Details'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: AppTheme.textPrimary,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(AppTheme.spacingM),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Ride Progress Section
              ModernRideProgress(
                status: 'accepted', // Will be dynamic
                driverName: 'John Smith',
                carModel: 'Toyota Camry',
                carPlate: 'ABC-1234',
                estimatedTime: '5 mins',
                driverImageUrl: null,
                onCancelRide: () {
                  // Handle cancel ride
                },
              ),
              
              const SizedBox(height: AppTheme.spacingM),
              
              // Ride Info Cards
              _buildInfoCard(
                title: 'Pickup Location',
                subtitle: '123 Main St, Downtown',
                icon: Icons.location_on,
                color: AppTheme.primaryColor,
              ),
              
              const SizedBox(height: AppTheme.spacingM),
              
              _buildInfoCard(
                title: 'Destination',
                subtitle: '456 Oak Ave, Uptown',
                icon: Icons.flag,
                color: AppTheme.errorColor,
              ),
              
              const SizedBox(height: AppTheme.spacingM),
              
              _buildInfoCard(
                title: 'Ride Type',
                subtitle: 'Standard Car',
                icon: Icons.directions_car,
                color: AppTheme.infoColor,
              ),
              
              const SizedBox(height: AppTheme.spacingM),
              
              _buildInfoCard(
                title: 'Estimated Fare',
                subtitle: r'$12.50',
                icon: Icons.attach_money,
                color: AppTheme.successColor,
              ),
              
              const SizedBox(height: AppTheme.spacingM),
              
              // Driver Contact
              Container(
                padding: const EdgeInsets.all(AppTheme.spacingM),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceColor,
                  borderRadius: BorderRadius.circular(AppTheme.radiusL),
                  boxShadow: AppTheme.cardShadow,
                ),
                child: Row(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppTheme.primaryColor.withOpacity(0.1),
                      ),
                      child: const Icon(
                        Icons.person,
                        color: AppTheme.primaryColor,
                        size: 25,
                      ),
                    ),
                    const SizedBox(width: AppTheme.spacingM),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'John Smith',
                            style: AppTheme.bodyLarge.copyWith(
                              fontWeight: FontWeight.w600,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          const SizedBox(height: AppTheme.spacingXS),
                          Row(
                            children: [
                              Icon(
                                Icons.star,
                                size: 16,
                                color: AppTheme.accentColor,
                              ),
                              const SizedBox(width: AppTheme.spacingS),
                              Text(
                                '4.8',
                                style: AppTheme.bodySmall.copyWith(
                                  color: AppTheme.textSecondary,
                                ),
                              ),
                              const SizedBox(width: AppTheme.spacingM),
                              Text(
                                'Toyota Camry • ABC-1234',
                                style: AppTheme.bodySmall.copyWith(
                                  color: AppTheme.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Row(
                      children: [
                        IconButton(
                          onPressed: () {
                            // Call driver
                          },
                          icon: Icon(
                            Icons.phone,
                            color: AppTheme.primaryColor,
                          ),
                        ),
                        IconButton(
                          onPressed: () {
                            // Message driver
                          },
                          icon: Icon(
                            Icons.chat,
                            color: AppTheme.primaryColor,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: AppTheme.spacingM),
              
              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        // Cancel ride
                      },
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                          vertical: AppTheme.spacingM,
                        ),
                        side: BorderSide(color: AppTheme.errorColor),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(AppTheme.radiusM),
                        ),
                      ),
                      child: Text(
                        'Cancel Ride',
                        style: TextStyle(
                          color: AppTheme.errorColor,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: AppTheme.spacingM),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        // Track ride
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                          vertical: AppTheme.spacingM,
                        ),
                        backgroundColor: AppTheme.primaryColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(AppTheme.radiusM),
                        ),
                      ),
                      child: Text(
                        'Track Ride',
                        style: AppTheme.buttonText,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
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
          Container(
            padding: const EdgeInsets.all(AppTheme.spacingS),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              color: color,
              size: 20,
            ),
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
                  subtitle,
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
}