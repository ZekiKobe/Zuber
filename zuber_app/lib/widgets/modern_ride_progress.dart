import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class ModernRideProgress extends StatelessWidget {
  final String status;
  final String driverName;
  final String carModel;
  final String carPlate;
  final String estimatedTime;
  final String? driverImageUrl;
  final VoidCallback? onCancelRide;

  const ModernRideProgress({
    Key? key,
    required this.status,
    required this.driverName,
    required this.carModel,
    required this.carPlate,
    required this.estimatedTime,
    this.driverImageUrl,
    this.onCancelRide,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(AppTheme.spacingM),
      padding: const EdgeInsets.all(AppTheme.spacingM),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(AppTheme.radiusL),
        boxShadow: AppTheme.elevatedShadow,
      ),
      child: Column(
        children: [
          // Progress indicator
          _buildProgressIndicator(),
          
          const SizedBox(height: AppTheme.spacingM),
          
          // Driver info
          Row(
            children: [
              // Driver avatar
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppTheme.primaryColor.withOpacity(0.1),
                ),
                child: ClipOval(
                  child: driverImageUrl != null
                      ? Image.network(
                          driverImageUrl!,
                          fit: BoxFit.cover,
                          width: 50,
                          height: 50,
                        )
                      : Icon(
                          Icons.person,
                          color: AppTheme.primaryColor,
                          size: 25,
                        ),
                ),
              ),
              
              const SizedBox(width: AppTheme.spacingM),
              
              // Driver details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      driverName,
                      style: AppTheme.bodyLarge.copyWith(
                        fontWeight: FontWeight.w600,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    
                    const SizedBox(height: AppTheme.spacingXS),
                    
                    Text(
                      '$carModel • $carPlate',
                      style: AppTheme.bodySmall.copyWith(
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              
              // ETA
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppTheme.spacingS,
                  vertical: AppTheme.spacingXS,
                ),
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(AppTheme.radiusS),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.access_time,
                      size: 16,
                      color: AppTheme.primaryColor,
                    ),
                    const SizedBox(width: AppTheme.spacingXS),
                    Text(
                      estimatedTime,
                      style: AppTheme.bodySmall.copyWith(
                        color: AppTheme.primaryColor,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          
          const SizedBox(height: AppTheme.spacingM),
          
          // Action buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: onCancelRide,
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppTheme.spacingM,
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
                    // Call driver
                  },
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppTheme.spacingM,
                      vertical: AppTheme.spacingM,
                    ),
                    backgroundColor: AppTheme.primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppTheme.radiusM),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.phone,
                        size: 18,
                        color: Colors.white,
                      ),
                      const SizedBox(width: AppTheme.spacingS),
                      Text(
                        'Call',
                        style: AppTheme.buttonText,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildProgressIndicator() {
    int currentStep = _getStatusIndex(status);
    List<String> steps = ['Requested', 'Accepted', 'Arrived', 'In Progress', 'Completed'];
    
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: List.generate(steps.length, (index) {
            bool isCompleted = index < currentStep;
            bool isCurrent = index == currentStep;
            
            return Expanded(
              child: Column(
                children: [
                  Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      color: isCompleted 
                          ? AppTheme.successColor 
                          : isCurrent 
                              ? AppTheme.primaryColor 
                              : AppTheme.textTertiary,
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: isCompleted
                          ? Icon(
                              Icons.check,
                              size: 14,
                              color: Colors.white,
                            )
                          : Text(
                              '${index + 1}',
                              style: TextStyle(
                                fontSize: 12,
                                color: isCurrent ? Colors.white : Colors.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                    ),
                  ),
                  
                  const SizedBox(height: AppTheme.spacingS),
                  
                  Text(
                    steps[index],
                    textAlign: TextAlign.center,
                    style: AppTheme.bodySmall.copyWith(
                      color: isCurrent ? AppTheme.primaryColor : AppTheme.textTertiary,
                      fontWeight: isCurrent ? FontWeight.w600 : FontWeight.normal,
                    ),
                  ),
                ],
              ),
            );
          }),
        ),
        
        const SizedBox(height: AppTheme.spacingM),
        
        // Progress line
        LayoutBuilder(
          builder: (context, constraints) {
            return Container(
              height: 4,
              width: constraints.maxWidth,
              decoration: BoxDecoration(
                color: AppTheme.textTertiary.withOpacity(0.3),
                borderRadius: BorderRadius.circular(2),
              ),
              child: Row(
                children: List.generate(steps.length - 1, (index) {
                  bool isCompleted = index < currentStep - 1;
                  return Expanded(
                    child: Container(
                      color: isCompleted ? AppTheme.successColor : Colors.transparent,
                    ),
                  );
                }),
              ),
            );
          },
        ),
      ],
    );
  }

  int _getStatusIndex(String status) {
    switch (status.toLowerCase()) {
      case 'requested':
        return 0;
      case 'accepted':
        return 1;
      case 'arrived':
        return 2;
      case 'in_progress':
      case 'in progress':
        return 3;
      case 'completed':
        return 4;
      default:
        return 0;
    }
  }
}