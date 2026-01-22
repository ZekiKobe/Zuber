import 'package:flutter/material.dart';
import '../models/ride_type.dart';
import '../theme/app_theme.dart';

class RideTypeSelectionScreen extends StatelessWidget {
  final List<RideType> rideTypes;
  final RideType? selectedRideType;
  final Function(RideType) onSelect;

  const RideTypeSelectionScreen({
    Key? key,
    required this.rideTypes,
    this.selectedRideType,
    required this.onSelect,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.6,
        minHeight: 400,
      ),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: const BorderRadius.vertical(
          top: Radius.circular(AppTheme.radiusXL),
        ),
        boxShadow: AppTheme.elevatedShadow,
      ),
      child: Column(
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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Choose a ride',
                  style: AppTheme.heading2,
                ),
                const SizedBox(height: AppTheme.spacingL),
                Expanded(
                  child: ListView.builder(
                    itemCount: rideTypes.length,
                    itemBuilder: (context, index) {
                      final rideType = rideTypes[index];
                      final isSelected = selectedRideType?.id == rideType.id;
                      
                      return Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: () {
                            onSelect(rideType);
                            Navigator.pop(context);
                          },
                          borderRadius: BorderRadius.circular(AppTheme.radiusM),
                          child: Container(
                            margin: const EdgeInsets.only(bottom: AppTheme.spacingM),
                            padding: const EdgeInsets.all(AppTheme.spacingM),
                            decoration: BoxDecoration(
                              color: isSelected 
                                  ? AppTheme.primaryColor.withOpacity(0.1) 
                                  : AppTheme.backgroundColor,
                              borderRadius: BorderRadius.circular(AppTheme.radiusM),
                              border: Border.all(
                                color: isSelected 
                                    ? AppTheme.primaryColor 
                                    : Colors.transparent,
                                width: 2,
                              ),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 50,
                                  height: 50,
                                  decoration: BoxDecoration(
                                    gradient: isSelected 
                                        ? AppTheme.primaryGradient 
                                        : null,
                                    color: isSelected 
                                        ? null 
                                        : AppTheme.primaryColor.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(AppTheme.radiusS),
                                  ),
                                  child: Icon(
                                    Icons.directions_car,
                                    color: isSelected ? Colors.white : AppTheme.primaryColor,
                                  ),
                                ),
                                const SizedBox(width: AppTheme.spacingM),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        rideType.displayName,
                                        style: AppTheme.heading3.copyWith(
                                          color: isSelected 
                                              ? AppTheme.primaryColor 
                                              : AppTheme.textPrimary,
                                        ),
                                      ),
                                      const SizedBox(height: AppTheme.spacingXS),
                                      Text(
                                        '${rideType.capacity} seats • ${rideType.baseFare.toStringAsFixed(0)} ETB base',
                                        style: AppTheme.bodySmall,
                                      ),
                                    ],
                                  ),
                                ),
                                Text(
                                  '${rideType.minimumFare.toStringAsFixed(0)} ETB',
                                  style: AppTheme.heading3.copyWith(
                                    color: isSelected 
                                        ? AppTheme.primaryColor 
                                        : AppTheme.textPrimary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
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
