import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../models/ride.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

class RideDetailsScreen extends StatefulWidget {
  final Ride ride;
  final bool isDriver;
  
  const RideDetailsScreen({
    Key? key,
    required this.ride,
    required this.isDriver,
  }) : super(key: key);

  @override
  State<RideDetailsScreen> createState() => _RideDetailsScreenState();
}

class _RideDetailsScreenState extends State<RideDetailsScreen> {
  bool _isLoading = true;
  Ride? _rideDetails;

  @override
  void initState() {
    super.initState();
    _loadRideDetails();
  }

  Future<void> _loadRideDetails() async {
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

      final rideDetails = await ApiService.getRideDetails(token, widget.ride.id);
      
      if (rideDetails != null) {
        setState(() {
          _rideDetails = rideDetails;
          _isLoading = false;
        });
      } else {
        setState(() {
          _rideDetails = widget.ride;
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error loading ride details: $e');
      setState(() {
        _rideDetails = widget.ride;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        backgroundColor: AppTheme.darkBackgroundColor,
        appBar: AppBar(
          backgroundColor: AppTheme.darkSurfaceColor,
          title: Text('Ride Details #${widget.ride.id}'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final ride = _rideDetails ?? widget.ride;
    
    return Scaffold(
      backgroundColor: AppTheme.darkBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.darkSurfaceColor,
        elevation: 0,
        title: Text('Ride Details #${ride.id}'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Route visualization at top
            Container(
              margin: const EdgeInsets.all(AppTheme.spacingL),
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
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Column(
                    children: [
                      Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.arrow_downward,
                          color: Colors.white,
                          size: 16,
                        ),
                      ),
                      Container(
                        width: 2,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppTheme.darkTextTertiary,
                          borderRadius: BorderRadius.circular(1),
                        ),
                        child: CustomPaint(
                          painter: DashedLinePainter(),
                        ),
                      ),
                      Container(
                        width: 24,
                        height: 24,
                        decoration: const BoxDecoration(
                          color: AppTheme.darkTextPrimary,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.location_on,
                          color: Colors.white,
                          size: 16,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: AppTheme.spacingM),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          ride.pickupAddress.split(',').first,
                          style: AppTheme.bodyMedium.copyWith(
                            color: AppTheme.darkTextPrimary,
                            fontWeight: FontWeight.w500,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: AppTheme.spacingM),
                        Text(
                          ride.destinationAddress.split(',').first,
                          style: AppTheme.bodyMedium.copyWith(
                            color: AppTheme.darkTextPrimary,
                            fontWeight: FontWeight.w500,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        'Distance ${ride.distance?.toStringAsFixed(0) ?? '0'}Km',
                        style: AppTheme.bodyMedium.copyWith(
                          color: AppTheme.darkTextPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: AppTheme.spacingXS),
                      Text(
                        'Payment \$${ride.fare?.toStringAsFixed(0) ?? '0'}',
                        style: AppTheme.bodyMedium.copyWith(
                          color: AppTheme.darkTextPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // DETAILS Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingL),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'DETAILS',
                    style: AppTheme.heading2.copyWith(
                      color: AppTheme.darkTextPrimary,
                    ),
                  ),
                  const SizedBox(height: AppTheme.spacingL),

                  // Driver Information
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
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 30,
                          backgroundColor: AppTheme.primaryColor,
                          child: Text(
                            ride.driverId != null 
                                ? ride.driverId!.substring(0, 1).toUpperCase()
                                : 'D',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(width: AppTheme.spacingM),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                ride.driverId != null ? 'Driver ${ride.driverId}' : 'Driver',
                                style: AppTheme.bodyLarge.copyWith(
                                  color: AppTheme.darkTextPrimary,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: AppTheme.spacingXS),
                              Text(
                                'Toyota Avanza, Black',
                                style: AppTheme.bodySmall.copyWith(
                                  color: AppTheme.darkTextSecondary,
                                ),
                              ),
                              const SizedBox(height: AppTheme.spacingXS),
                              Text(
                                'B 1233 YH',
                                style: AppTheme.bodySmall.copyWith(
                                  color: AppTheme.darkTextSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppTheme.spacingM),

                  // Rating
                  Row(
                    children: List.generate(5, (index) {
                      return Icon(
                        Icons.star,
                        color: AppTheme.accentColor,
                        size: 24,
                      );
                    }),
                  ),
                  const SizedBox(height: AppTheme.spacingL),

                  // Fare Breakdown
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
                    child: Column(
                      children: [
                        _buildFareRow('Ride Fare:', '\$${ride.fare?.toStringAsFixed(2) ?? '14.00'}'),
                        const SizedBox(height: AppTheme.spacingM),
                        _buildFareRow('Payment Method:', 'e-Wallet'),
                        const SizedBox(height: AppTheme.spacingM),
                        _buildFareRow('Discount:', '--'),
                        const SizedBox(height: AppTheme.spacingM),
                        _buildFareRow('Travel Duration:', '${ride.duration ?? 30} Minutes'),
                        const Divider(color: AppTheme.darkDividerColor),
                        const SizedBox(height: AppTheme.spacingM),
                        _buildFareRow(
                          'Total fare:',
                          '\$${ride.fare?.toStringAsFixed(2) ?? '4.00'}',
                          isTotal: true,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppTheme.spacingL),

                  // Feedback
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
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Feedback',
                          style: AppTheme.bodyMedium.copyWith(
                            color: AppTheme.darkTextSecondary,
                          ),
                        ),
                        const SizedBox(height: AppTheme.spacingS),
                        Text(
                          'Driver was friendly, and the ride was smooth.',
                          style: AppTheme.bodyMedium.copyWith(
                            color: AppTheme.darkTextPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppTheme.spacingXL),

                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            // Re-order ride
                            Navigator.pop(context);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryColor,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(
                              vertical: AppTheme.spacingM,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(AppTheme.radiusM),
                            ),
                          ),
                          child: Text(
                            'Re-order Ride',
                            style: AppTheme.buttonText,
                          ),
                        ),
                      ),
                      const SizedBox(width: AppTheme.spacingM),
                      Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          color: AppTheme.darkCardColor,
                          borderRadius: BorderRadius.circular(AppTheme.radiusM),
                          border: Border.all(
                            color: AppTheme.darkDividerColor,
                            width: 1,
                          ),
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.bookmark_border),
                          color: AppTheme.darkTextPrimary,
                          onPressed: () {
                            // Bookmark action
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppTheme.spacingXL),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFareRow(String label, String value, {bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: AppTheme.bodyMedium.copyWith(
            color: isTotal 
                ? AppTheme.darkTextPrimary 
                : AppTheme.darkTextSecondary,
            fontWeight: isTotal ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
        Text(
          value,
          style: AppTheme.bodyMedium.copyWith(
            color: isTotal 
                ? AppTheme.primaryColor 
                : AppTheme.darkTextPrimary,
            fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ],
    );
  }
}

class DashedLinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppTheme.darkTextTertiary
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    const dashHeight = 4.0;
    const dashSpace = 2.0;
    double startY = 0;

    while (startY < size.height) {
      canvas.drawLine(
        Offset(0, startY),
        Offset(0, startY + dashHeight),
        paint,
      );
      startY += dashHeight + dashSpace;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
