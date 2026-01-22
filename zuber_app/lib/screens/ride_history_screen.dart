import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../models/ride.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';
import 'ride_details_screen.dart';

class RideHistoryScreen extends StatefulWidget {
  const RideHistoryScreen({Key? key}) : super(key: key);

  @override
  State<RideHistoryScreen> createState() => _RideHistoryScreenState();
}

class _RideHistoryScreenState extends State<RideHistoryScreen> {
  List<Ride> _rides = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadRideHistory();
  }

  Future<void> _loadRideHistory() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = authProvider.token;
      
      if (token == null) {
        setState(() {
          _rides = [];
          _isLoading = false;
        });
        return;
      }

      final rides = await ApiService.getAllUserRides(token);
      setState(() {
        _rides = rides;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading ride history: $e');
      setState(() {
        _rides = [];
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to load ride history: $e'),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    }
  }

  List<Ride> get _activeRides => _rides.where((r) => 
    r.status == 'pending' || r.status == 'accepted' || r.status == 'in_progress'
  ).toList();

  List<Ride> get _pastRides => _rides.where((r) => 
    r.status == 'completed' || r.status == 'cancelled'
  ).toList();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.darkSurfaceColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined),
                onPressed: () {},
              ),
              Positioned(
                right: 8,
                top: 8,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: AppTheme.errorColor,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
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
                          'Order History',
                          style: AppTheme.heading1.copyWith(
                            color: AppTheme.darkTextPrimary,
                          ),
                        ),
                        const SizedBox(height: AppTheme.spacingXS),
                        Text(
                          'Showing all your order history',
                          style: AppTheme.bodyMedium.copyWith(
                            color: AppTheme.darkTextSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                if (_activeRides.isNotEmpty)
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(
                        AppTheme.spacingL,
                        AppTheme.spacingL,
                        AppTheme.spacingL,
                        AppTheme.spacingM,
                      ),
                      child: Text(
                        'Active orders',
                        style: AppTheme.heading3.copyWith(
                          color: AppTheme.darkTextPrimary,
                        ),
                      ),
                    ),
                  ),
                if (_activeRides.isNotEmpty)
                  SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final ride = _activeRides[index];
                        return _buildRideCard(ride, isActive: true);
                      },
                      childCount: _activeRides.length,
                    ),
                  ),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(
                      AppTheme.spacingL,
                      AppTheme.spacingXL,
                      AppTheme.spacingL,
                      AppTheme.spacingM,
                    ),
                    child: Text(
                      'Past orders',
                      style: AppTheme.heading3.copyWith(
                        color: AppTheme.darkTextPrimary,
                      ),
                    ),
                  ),
                ),
                if (_pastRides.isEmpty && _activeRides.isEmpty)
                  SliverFillRemaining(
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.history,
                            size: 64,
                            color: AppTheme.darkTextTertiary,
                          ),
                          const SizedBox(height: AppTheme.spacingM),
                          Text(
                            'No ride history yet',
                            style: AppTheme.bodyLarge.copyWith(
                              color: AppTheme.darkTextSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                else
                  SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final ride = _pastRides[index];
                        return _buildRideCard(ride, isActive: false);
                      },
                      childCount: _pastRides.length,
                    ),
                  ),
                const SliverToBoxAdapter(
                  child: SizedBox(height: AppTheme.spacingL),
                ),
              ],
            ),
    );
  }

  Widget _buildRideCard(Ride ride, {required bool isActive}) {
    return Container(
      margin: const EdgeInsets.symmetric(
        horizontal: AppTheme.spacingL,
        vertical: AppTheme.spacingS,
      ),
      padding: const EdgeInsets.all(AppTheme.spacingL),
      decoration: BoxDecoration(
        color: AppTheme.darkCardColor,
        borderRadius: BorderRadius.circular(AppTheme.radiusM),
        border: Border.all(
          color: AppTheme.darkDividerColor,
          width: 1,
        ),
      ),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => RideDetailsScreen(
                ride: ride,
                isDriver: false,
              ),
            ),
          );
        },
        borderRadius: BorderRadius.circular(AppTheme.radiusM),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Route visualization
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
            // Addresses
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
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: AppTheme.spacingM),
                  Text(
                    ride.destinationAddress.split(',').first,
                    style: AppTheme.bodyMedium.copyWith(
                      color: AppTheme.darkTextPrimary,
                      fontWeight: FontWeight.w500,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            // Payment and distance
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  'Payment \$${ride.fare?.toStringAsFixed(0) ?? '0'}',
                  style: AppTheme.bodyMedium.copyWith(
                    color: AppTheme.darkTextPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (!isActive && ride.distance != null) ...[
                  const SizedBox(height: AppTheme.spacingXS),
                  Text(
                    'Distance ${ride.distance!.toStringAsFixed(0)}Km',
                    style: AppTheme.bodySmall.copyWith(
                      color: AppTheme.darkTextSecondary,
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
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
