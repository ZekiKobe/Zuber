import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../models/ride.dart';
import '../services/api_service.dart';
import '../utils/constants.dart';
import 'ride_details_screen.dart';

class TripHistoryScreen extends StatefulWidget {
  const TripHistoryScreen({Key? key}) : super(key: key);

  @override
  State<TripHistoryScreen> createState() => _TripHistoryScreenState();
}

class _TripHistoryScreenState extends State<TripHistoryScreen> {
  List<Ride> _trips = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadTripHistory();
  }

  Future<void> _loadTripHistory() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = authProvider.token;
      
      if (token == null) {
        setState(() {
          _trips = [];
          _isLoading = false;
        });
        return;
      }

      final trips = await ApiService.getRideHistory(token);
      setState(() {
        _trips = trips;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading trip history: $e');
      setState(() {
        _trips = [];
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to load trip history: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Trip History'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _trips.isEmpty
              ? const Center(
                  child: Text(
                    'No trip history yet',
                    style: TextStyle(fontSize: 16, color: AppColors.textSecondary),
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(AppDimensions.paddingMedium),
                  itemCount: _trips.length,
                  itemBuilder: (context, index) {
                    final trip = _trips[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: AppDimensions.paddingMedium),
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(AppDimensions.paddingMedium),
                        title: Text(
                          '${trip.pickupAddress.split(',')[0]} to ${trip.destinationAddress.split(',')[0]}',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 8),
                            Text(
                              'Date: ${trip.startTime?.toString().split(' ')[0] ?? 'N/A'}',
                              style: const TextStyle(fontSize: 14),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Earnings: \$${trip.fare?.toStringAsFixed(2) ?? '0.00'}',
                              style: const TextStyle(fontSize: 14),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Status: ${trip.status}',
                              style: TextStyle(
                                fontSize: 14,
                                color: trip.status == 'completed' 
                                    ? Colors.green 
                                    : trip.status == 'cancelled' 
                                        ? Colors.red 
                                        : AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                        trailing: Text(
                          '${trip.distance?.toStringAsFixed(1) ?? '0.0'} mi',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => RideDetailsScreen(
                                ride: trip,
                                isDriver: false,
                              ),
                            ),
                          );
                        },
                      ),
                    );
                  },
                ),
    );
  }
}