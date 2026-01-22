import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:latlong2/latlong.dart' as latlng;
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../providers/auth_provider.dart';
import '../providers/ride_provider.dart';
import '../theme/app_theme.dart';
import '../models/ride_type.dart';
import '../widgets/openstreet_map.dart';
import '../widgets/modern_ride_card.dart';
import '../widgets/modern_driver_card.dart';
import '../widgets/modern_ride_progress.dart';
import 'notifications_screen.dart';
import 'ride_type_selection_screen.dart';

class ModernHomeScreen extends StatefulWidget {
  const ModernHomeScreen({Key? key}) : super(key: key);

  @override
  State<ModernHomeScreen> createState() => _ModernHomeScreenState();
}

class _ModernHomeScreenState extends State<ModernHomeScreen> {
  MapController? mapController;
  latlng.LatLng? _currentLocation;
  latlng.LatLng? _pickupLocation;
  latlng.LatLng? _dropoffLocation;
  
  List<latlng.LatLng> _markerPoints = [];
  List<latlng.LatLng> _polylinePoints = [];
  
  final TextEditingController _pickupController = TextEditingController();
  final TextEditingController _destinationController = TextEditingController();
  
  bool _isRequestingRide = false;
  RideType? _selectedRideType;
  List<RideType> _rideTypes = [];
  bool _isLoadingLocation = true;
  bool _isLoadingRideTypes = true;

  StreamSubscription<Position>? _positionStreamSubscription;

  @override
  void initState() {
    super.initState();
    _initializeLocation();
    _loadRideTypes();
    _loadActiveRide();
    _startLocationUpdates();
  }

  Future<void> _initializeLocation() async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        if (mounted) {
          setState(() => _isLoadingLocation = false);
        }
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          if (mounted) {
            setState(() => _isLoadingLocation = false);
          }
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        if (mounted) {
          setState(() => _isLoadingLocation = false);
        }
        return;
      }

      Position position = await Geolocator.getCurrentPosition();
      if (mounted) {
        setState(() {
          _currentLocation = latlng.LatLng(position.latitude, position.longitude);
          _pickupLocation = _currentLocation;
          _isLoadingLocation = false;
        });

        // Get address for current location
        try {
          List<Placemark> placemarks = await placemarkFromCoordinates(
            position.latitude,
            position.longitude,
          );
          if (mounted && placemarks.isNotEmpty) {
            _pickupController.text = _formatAddress(placemarks[0]);
          }
        } catch (e) {
          print('Error getting address: $e');
        }

        _updateMarkers();
      }
    } catch (e) {
      print('Error getting location: $e');
      if (mounted) {
        setState(() => _isLoadingLocation = false);
      }
    }
  }

  void _startLocationUpdates() {
    _positionStreamSubscription?.cancel(); // Cancel existing subscription if any
    
    _positionStreamSubscription = Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 10, // Update every 10 meters
      ),
    ).listen(
      (Position position) {
        if (mounted) {
          setState(() {
            _currentLocation = latlng.LatLng(position.latitude, position.longitude);
          });
          // Update map center if needed
          if (mounted && mapController != null) {
            mapController!.move(
              latlng.LatLng(position.latitude, position.longitude),
              mapController!.camera.zoom,
            );
          }
        }
      },
      onError: (error) {
        print('Location stream error: $error');
        // Don't call setState on error to avoid dispose issues
      },
      cancelOnError: false,
    );
  }

  String _formatAddress(Placemark placemark) {
    List<String> parts = [];
    if (placemark.street != null && placemark.street != '' && placemark.street!.isNotEmpty) {
      parts.add(placemark.street!);
    }
    if (placemark.subLocality != null && placemark.subLocality != '' && placemark.subLocality!.isNotEmpty) {
      parts.add(placemark.subLocality!);
    }
    if (placemark.locality != null && placemark.locality != '' && placemark.locality!.isNotEmpty) {
      parts.add(placemark.locality!);
    }
    return parts.join(', ');
  }

  Future<void> _loadRideTypes() async {
    if (!mounted) return;
    
    setState(() {
      _isLoadingRideTypes = true;
    });

    try {
      final rideProvider = Provider.of<RideProvider>(context, listen: false);
      await rideProvider.loadRideTypes();
      
      if (mounted) {
        setState(() {
          _isLoadingRideTypes = false;
          if (rideProvider.rideTypes.isNotEmpty) {
            _rideTypes = rideProvider.rideTypes;
            _selectedRideType = _rideTypes.first;
          } else {
            _rideTypes = [];
            _selectedRideType = null;
          }
        });
      }
    } catch (e) {
      print('Error loading ride types: $e');
      if (mounted) {
        setState(() {
          _isLoadingRideTypes = false;
          _rideTypes = [];
          _selectedRideType = null;
        });
      }
    }
  }

  Future<void> _loadActiveRide() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final rideProvider = Provider.of<RideProvider>(context, listen: false);
    
    if (authProvider.token != null) {
      await rideProvider.loadActiveRide(authProvider.token!, isDriver: false);
      if (rideProvider.currentRide != null) {
        // Show active ride UI
      }
    }
  }

  void _onMapCreated(MapController controller) {
    if (mounted) {
      setState(() {
        mapController = controller;
      });
    }
  }

  void _updateMarkers() {
    if (!mounted) return;
    
    _markerPoints.clear();
    
    if (_pickupLocation != null) {
      _markerPoints.add(_pickupLocation!);
    }
    
    if (_dropoffLocation != null) {
      _markerPoints.add(_dropoffLocation!);
    }
    
    setState(() {});
  }

  bool _isSelectingPickup = false;
  bool _isSelectingDestination = false;

  Future<void> _selectLocation(bool isPickup) async {
    // Set which field is being edited
    if (mounted) {
      setState(() {
        _isSelectingPickup = isPickup;
        _isSelectingDestination = !isPickup;
      });
    }

    // Show message to user
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(isPickup 
            ? 'Tap on the map to select pickup location' 
            : 'Tap on the map to select destination'),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  Future<void> _handleMapTap(latlng.LatLng point) async {
    if (!_isSelectingPickup && !_isSelectingDestination) {
      return; // Not in selection mode
    }

    try {
      // Get address from coordinates
      List<Placemark> placemarks = await placemarkFromCoordinates(
        point.latitude,
        point.longitude,
      );

      String address = 'Unknown location';
      if (placemarks.isNotEmpty) {
        address = _formatAddress(placemarks[0]);
      }

      if (!mounted) return;
      
      if (_isSelectingPickup) {
        setState(() {
          _pickupLocation = point;
          _pickupController.text = address;
          _isSelectingPickup = false;
        });
      } else if (_isSelectingDestination) {
        setState(() {
          _dropoffLocation = point;
          _destinationController.text = address;
          _isSelectingDestination = false;
        });
      }

      _updateMarkers();
      
      // Calculate route if both locations are set
      if (mounted && _pickupLocation != null && _dropoffLocation != null) {
        _calculateRoute();
      }
    } catch (e) {
      print('Error getting address: $e');
      if (!mounted) return;
      
      // Still set the location even if geocoding fails
      if (_isSelectingPickup) {
        setState(() {
          _pickupLocation = point;
          _pickupController.text = '${point.latitude.toStringAsFixed(6)}, ${point.longitude.toStringAsFixed(6)}';
          _isSelectingPickup = false;
        });
      } else if (_isSelectingDestination) {
        setState(() {
          _dropoffLocation = point;
          _destinationController.text = '${point.latitude.toStringAsFixed(6)}, ${point.longitude.toStringAsFixed(6)}';
          _isSelectingDestination = false;
        });
      }
      _updateMarkers();
      // Calculate route if both locations are set
      if (mounted && _pickupLocation != null && _dropoffLocation != null) {
        _calculateRoute();
      }
    }
  }

  Future<void> _calculateRoute() async {
    if (_pickupLocation == null || _dropoffLocation == null) {
      return;
    }

    try {
      // Use OSRM (Open Source Routing Machine) - completely free, no API key needed
      final pickupLon = _pickupLocation!.longitude;
      final pickupLat = _pickupLocation!.latitude;
      final dropoffLon = _dropoffLocation!.longitude;
      final dropoffLat = _dropoffLocation!.latitude;

      // OSRM route service URL
      final url = Uri.parse(
        'https://router.project-osrm.org/route/v1/driving/$pickupLon,$pickupLat;$dropoffLon,$dropoffLat?overview=full&geometries=geojson',
      );

      final response = await http.get(url);
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        
        if (data['code'] == 'Ok' && data['routes'] != null && data['routes'].isNotEmpty) {
          final route = data['routes'][0];
          final geometry = route['geometry'];
          
          if (geometry != null && geometry['coordinates'] != null) {
            final coordinates = geometry['coordinates'] as List;
            final routePoints = coordinates.map((coord) {
              // GeoJSON format is [longitude, latitude]
              return latlng.LatLng(coord[1].toDouble(), coord[0].toDouble());
            }).toList();

            if (mounted) {
              setState(() {
                _polylinePoints = routePoints;
              });

              // Fit map to show entire route
              if (mapController != null && routePoints.isNotEmpty) {
                _fitRouteToMap(routePoints);
              }
            }
          }
        }
      } else {
        print('Error calculating route: ${response.statusCode}');
      }
    } catch (e) {
      print('Error calculating route: $e');
      // Fallback: draw straight line if routing fails
      if (mounted && _pickupLocation != null && _dropoffLocation != null) {
        setState(() {
          _polylinePoints = [_pickupLocation!, _dropoffLocation!];
        });
      }
    }
  }

  void _fitRouteToMap(List<latlng.LatLng> routePoints) {
    if (routePoints.isEmpty || mapController == null) return;

    double minLat = routePoints.first.latitude;
    double maxLat = routePoints.first.latitude;
    double minLon = routePoints.first.longitude;
    double maxLon = routePoints.first.longitude;

    for (var point in routePoints) {
      if (point.latitude < minLat) minLat = point.latitude;
      if (point.latitude > maxLat) maxLat = point.latitude;
      if (point.longitude < minLon) minLon = point.longitude;
      if (point.longitude > maxLon) maxLon = point.longitude;
    }

    // Add padding
    final latPadding = (maxLat - minLat) * 0.2;
    final lonPadding = (maxLon - minLon) * 0.2;

    final center = latlng.LatLng(
      (minLat + maxLat) / 2,
      (minLon + maxLon) / 2,
    );

    // Calculate zoom level based on bounding box
    final latDiff = maxLat - minLat + latPadding * 2;
    final lonDiff = maxLon - minLon + lonPadding * 2;
    final maxDiff = latDiff > lonDiff ? latDiff : lonDiff;
    
    double zoom = 14.0;
    if (maxDiff > 0.1) zoom = 12.0;
    if (maxDiff > 0.2) zoom = 11.0;
    if (maxDiff > 0.5) zoom = 10.0;
    if (maxDiff > 1.0) zoom = 9.0;

    mapController!.move(center, zoom);
  }

  Future<void> _requestRide() async {
    if (_pickupLocation == null || _dropoffLocation == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select pickup and destination locations'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
      return;
    }

    if (_selectedRideType == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a ride type'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
      return;
    }

    if (mounted) {
      setState(() => _isRequestingRide = true);
    }

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final rideProvider = Provider.of<RideProvider>(context, listen: false);

    final success = await rideProvider.requestRide(
      token: authProvider.token!,
      pickupLat: _pickupLocation!.latitude,
      pickupLon: _pickupLocation!.longitude,
      dropoffLat: _dropoffLocation!.latitude,
      dropoffLon: _dropoffLocation!.longitude,
      pickupAddress: _pickupController.text,
      dropoffAddress: _destinationController.text,
      rideTypeId: _selectedRideType!.id,
    );

    if (mounted) {
      setState(() => _isRequestingRide = false);
    }

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Ride requested successfully!'),
          backgroundColor: AppTheme.primaryColor,
        ),
      );
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(rideProvider.error ?? 'Failed to request ride'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
    }
  }

  @override
  void dispose() {
    _positionStreamSubscription?.cancel();
    _pickupController.dispose();
    _destinationController.dispose();
    mapController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Zuber'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: AppTheme.textPrimary,
        actions: [
          IconButton(
            icon: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.notifications_outlined, color: AppTheme.primaryColor),
            ),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const NotificationsScreen()),
              );
            },
          ),
          const SizedBox(width: AppTheme.spacingM),
        ],
      ),
      body: Stack(
        children: [
          // Map View
          _isLoadingLocation
              ? const Center(child: CircularProgressIndicator())
              : _currentLocation == null
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.location_off, size: 64, color: AppTheme.textSecondary),
                          SizedBox(height: AppTheme.spacingM),
                          Text('Location permission required'),
                        ],
                      ),
                    )
                  : SizedBox.expand(
                      child: OpenStreetMapWidget(
                        key: ValueKey('map_${_currentLocation!.latitude}_${_currentLocation!.longitude}'),
                        initialLocation: _currentLocation!,
                        markerPoints: _markerPoints,
                        polylinePoints: _polylinePoints.isNotEmpty ? _polylinePoints : null,
                        onMapCreated: _onMapCreated,
                        onTap: _handleMapTap,
                        zoom: 14.0,
                        showMyLocation: true,
                        pickupMarkerColor: AppTheme.primaryColor,
                        dropoffMarkerColor: AppTheme.errorColor,
                      ),
                    ),

          // Ride Request Panel - Modern Design
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(AppTheme.radiusXL),
                ),
                boxShadow: AppTheme.elevatedShadow,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Drag handle
                  Container(
                    margin: const EdgeInsets.only(top: AppTheme.spacingS),
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: AppTheme.textTertiary,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  
                  Padding(
                    padding: const EdgeInsets.all(AppTheme.spacingL),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Where to?
                        Text(
                          'Where to?',
                          style: AppTheme.heading2,
                        ),
                        const SizedBox(height: AppTheme.spacingL),

                        // Pickup location
                        _buildLocationField(
                          controller: _pickupController,
                          label: 'Pickup',
                          icon: Icons.location_on,
                          color: AppTheme.primaryColor,
                          onTap: () => _selectLocation(true),
                        ),
                        const SizedBox(height: AppTheme.spacingM),

                        // Destination
                        _buildLocationField(
                          controller: _destinationController,
                          label: 'Destination',
                          icon: Icons.flag,
                          color: AppTheme.primaryColor,
                          onTap: () => _selectLocation(false),
                        ),
                        const SizedBox(height: AppTheme.spacingL),

                        // Ride Type Selection - Modern Carousel
                        Text(
                          'Choose Ride Type',
                          style: AppTheme.bodyLarge.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                        const SizedBox(height: AppTheme.spacingM),

                        Container(
                          height: 140,
                          margin: const EdgeInsets.symmetric(vertical: AppTheme.spacingM),
                          child: _isLoadingRideTypes
                              ? const Center(
                                  child: CircularProgressIndicator(),
                                )
                              : _rideTypes.isEmpty
                                  ? const Center(
                                      child: Text('No ride types available'),
                                    )
                                  : ListView.builder(
                                      scrollDirection: Axis.horizontal,
                                      itemCount: _rideTypes.length,
                                      itemBuilder: (context, index) {
                                        final rideType = _rideTypes[index];
                                        final isSelected = _selectedRideType?.id == rideType.id;
                                        return ModernRideCard(
                                          vehicleType: rideType.displayName.toLowerCase(),
                                          vehicleName: rideType.displayName,
                                          price: rideType.baseFare != null
                                              ? '\$${rideType.baseFare!.toStringAsFixed(2)}+'
                                              : 'Price varies',
                                          eta: '10', // Default ETA
                                          rating: '4.8', // Default rating
                                          isSelected: isSelected,
                                          onTap: () {
                                            setState(() {
                                              _selectedRideType = rideType;
                                            });
                                          },
                                        );
                                      },
                                    ),
                        ),

                        const SizedBox(height: AppTheme.spacingM),

                        // Request Ride Button
                        Container(
                          height: 56,
                          decoration: BoxDecoration(
                            gradient: AppTheme.primaryGradient,
                            borderRadius: BorderRadius.circular(AppTheme.radiusM),
                            boxShadow: AppTheme.elevatedShadow,
                          ),
                          child: ElevatedButton(
                            onPressed: _isRequestingRide ? null : _requestRide,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(AppTheme.radiusM),
                              ),
                            ),
                            child: _isRequestingRide
                                ? const SizedBox(
                                    height: 24,
                                    width: 24,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                    ),
                                  )
                                : Text(
                                    'Request Ride',
                                    style: AppTheme.buttonText,
                                  ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLocationField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Container(
      padding: const EdgeInsets.all(AppTheme.spacingM),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(AppTheme.radiusM),
        border: Border.all(
          color: AppTheme.textTertiary.withOpacity(0.3),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(AppTheme.spacingS),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: AppTheme.spacingM),
          Expanded(
            child: TextField(
              controller: controller,
              enabled: true,
              decoration: InputDecoration(
                hintText: label,
                hintStyle: AppTheme.bodyMedium.copyWith(
                  color: AppTheme.textSecondary,
                ),
                border: InputBorder.none,
                isDense: true,
                contentPadding: EdgeInsets.zero,
              ),
              style: AppTheme.bodyMedium.copyWith(
                color: AppTheme.textPrimary,
              ),
              onTap: () {
                // Optional: Still allow map selection
                onTap();
              },
            ),
          ),
          IconButton(
            icon: Icon(Icons.map_outlined, color: color, size: 20),
            onPressed: onTap,
            tooltip: 'Select on map',
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
          ),
        ],
      ),
    );
  }
}