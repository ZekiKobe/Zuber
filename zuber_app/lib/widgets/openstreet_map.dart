import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart' as latlng;
import '../theme/app_theme.dart';

class OpenStreetMapWidget extends StatefulWidget {
  final latlng.LatLng initialLocation;
  final List<latlng.LatLng>? markerPoints;
  final List<latlng.LatLng>? polylinePoints;
  final Function(MapController)? onMapCreated;
  final Function(latlng.LatLng)? onTap;
  final double zoom;
  final bool showMyLocation;
  final Color? myLocationColor;
  final Color? pickupMarkerColor;
  final Color? dropoffMarkerColor;

  const OpenStreetMapWidget({
    Key? key,
    required this.initialLocation,
    this.markerPoints,
    this.polylinePoints,
    this.onMapCreated,
    this.onTap,
    this.zoom = 14.0,
    this.showMyLocation = true,
    this.myLocationColor,
    this.pickupMarkerColor,
    this.dropoffMarkerColor,
  }) : super(key: key);

  @override
  State<OpenStreetMapWidget> createState() => _OpenStreetMapWidgetState();
}

class _OpenStreetMapWidgetState extends State<OpenStreetMapWidget> {
  late MapController _mapController;

  @override
  void initState() {
    super.initState();
    _mapController = MapController();
    if (widget.onMapCreated != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        widget.onMapCreated!(_mapController);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // Ensure the map has proper constraints
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth <= 0 || constraints.maxHeight <= 0) {
          return const SizedBox.shrink();
        }

        return _buildMap();
      },
    );
  }

  Widget _buildMap() {
    final List<Marker> markers = [];

    // Add pickup marker (first point)
    if (widget.markerPoints != null && widget.markerPoints!.isNotEmpty) {
      markers.add(
        Marker(
          point: widget.markerPoints!.first,
          width: 40,
          height: 40,
          child: Container(
            decoration: BoxDecoration(
              color: widget.pickupMarkerColor ?? AppTheme.primaryColor,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 3),
            ),
            child: const Icon(Icons.location_on, color: Colors.white, size: 20),
          ),
        ),
      );
    }

    // Add dropoff marker (second point if exists)
    if (widget.markerPoints != null && widget.markerPoints!.length > 1) {
      markers.add(
        Marker(
          point: widget.markerPoints![1],
          width: 40,
          height: 40,
          child: Container(
            decoration: BoxDecoration(
              color: widget.dropoffMarkerColor ?? Colors.red,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 3),
            ),
            child: const Icon(Icons.flag, color: Colors.white, size: 20),
          ),
        ),
      );
    }

    // Add my location marker
    if (widget.showMyLocation) {
      markers.add(
        Marker(
          point: widget.initialLocation,
          width: 40,
          height: 40,
          child: Container(
            decoration: BoxDecoration(
              color: widget.myLocationColor ?? Colors.blue,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 3),
            ),
            child: const Icon(Icons.my_location, color: Colors.white, size: 20),
          ),
        ),
      );
    }

    return FlutterMap(
      mapController: _mapController,
      options: MapOptions(
        initialCenter: widget.initialLocation,
        initialZoom: widget.zoom,
        minZoom: 3.0,
        maxZoom: 18.0,
        onTap: widget.onTap != null
            ? (tapPosition, point) {
                widget.onTap!(point);
              }
            : null,
      ),
      children: [
        // OpenStreetMap Tile Layer
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.zuber.app',
          maxZoom: 19,
        ),
        // Polylines (routes)
        if (widget.polylinePoints != null && widget.polylinePoints!.isNotEmpty)
          PolylineLayer(
            polylines: [
              Polyline(
                points: widget.polylinePoints!,
                strokeWidth: 4.0,
                color: Colors.blue,
              ),
            ],
          ),
        // Markers
        if (markers.isNotEmpty) MarkerLayer(markers: markers),
      ],
    );
  }

  @override
  void dispose() {
    _mapController.dispose();
    super.dispose();
  }
}
