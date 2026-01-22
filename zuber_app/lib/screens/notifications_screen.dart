import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

class NotificationsScreen extends StatefulWidget {
  final bool isDriver;
  
  const NotificationsScreen({Key? key, this.isDriver = false}) : super(key: key);

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<Map<String, dynamic>> _notifications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = authProvider.token;
      
      if (token == null) {
        setState(() {
          _notifications = [];
          _isLoading = false;
        });
        return;
      }

      final notifications = await ApiService.getNotifications(
        token,
        isDriver: widget.isDriver,
      );
      
      setState(() {
        _notifications = notifications;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading notifications: $e');
      setState(() {
        _notifications = [];
        _isLoading = false;
      });
    }
  }

  Future<void> _markAsRead(String notificationId) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final token = authProvider.token;
    
    if (token == null) return;

    final success = await ApiService.markNotificationAsRead(token, notificationId);
    
    if (success) {
      setState(() {
        final index = _notifications.indexWhere((n) => n['id']?.toString() == notificationId);
        if (index != -1) {
          _notifications[index]['isRead'] = true;
        }
      });
    }
  }

  Future<void> _markAllAsRead() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final token = authProvider.token;
    
    if (token == null) return;

    final success = await ApiService.markAllNotificationsAsRead(token);
    
    if (success) {
      setState(() {
        for (var notification in _notifications) {
          notification['isRead'] = true;
        }
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('All notifications marked as read'),
            backgroundColor: AppTheme.successColor,
          ),
        );
      }
    }
  }

  String _formatTime(DateTime? dateTime) {
    if (dateTime == null) return 'Just now';
    
    final now = DateTime.now();
    final difference = now.difference(dateTime);
    
    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes} minutes ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} hours ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return DateFormat('MMM d, y').format(dateTime);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.darkSurfaceColor,
        elevation: 0,
        title: const Text('Notifications'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          if (_notifications.any((n) => n['isRead'] == false))
            IconButton(
              icon: const Icon(Icons.checklist),
              onPressed: _markAllAsRead,
              tooltip: 'Mark all as read',
            ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _notifications.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.notifications_none,
                        size: 64,
                        color: AppTheme.darkTextTertiary,
                      ),
                      const SizedBox(height: AppTheme.spacingM),
                      Text(
                        'No notifications',
                        style: AppTheme.bodyLarge.copyWith(
                          color: AppTheme.darkTextSecondary,
                        ),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(AppTheme.spacingL),
                  itemCount: _notifications.length,
                  itemBuilder: (context, index) {
                    final notification = _notifications[index];
                    final isRead = notification['isRead'] == true;
                    final createdAt = notification['createdAt'] != null
                        ? DateTime.parse(notification['createdAt'])
                        : null;
                    
                    return Container(
                      margin: const EdgeInsets.only(bottom: AppTheme.spacingM),
                      padding: const EdgeInsets.all(AppTheme.spacingM),
                      decoration: BoxDecoration(
                        color: isRead 
                            ? AppTheme.darkCardColor 
                            : AppTheme.darkCardColor.withOpacity(0.8),
                        borderRadius: BorderRadius.circular(AppTheme.radiusM),
                        border: Border.all(
                          color: isRead 
                              ? AppTheme.darkDividerColor 
                              : AppTheme.primaryColor.withOpacity(0.3),
                          width: isRead ? 1 : 2,
                        ),
                      ),
                      child: InkWell(
                        onTap: () {
                          if (!isRead) {
                            _markAsRead(notification['id']?.toString() ?? '');
                          }
                        },
                        borderRadius: BorderRadius.circular(AppTheme.radiusM),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 50,
                              height: 50,
                              decoration: BoxDecoration(
                                color: _getNotificationColor(notification['type'] ?? 'general')
                                    .withOpacity(0.1),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                _getNotificationIcon(notification['type'] ?? 'general'),
                                color: _getNotificationColor(notification['type'] ?? 'general'),
                                size: 24,
                              ),
                            ),
                            const SizedBox(width: AppTheme.spacingM),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    notification['title'] ?? 'Notification',
                                    style: AppTheme.bodyLarge.copyWith(
                                      color: AppTheme.darkTextPrimary,
                                      fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: AppTheme.spacingXS),
                                  Text(
                                    notification['message'] ?? notification['body'] ?? '',
                                    style: AppTheme.bodyMedium.copyWith(
                                      color: isRead 
                                          ? AppTheme.darkTextSecondary 
                                          : AppTheme.darkTextPrimary,
                                    ),
                                    maxLines: 3,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: AppTheme.spacingXS),
                                  Text(
                                    _formatTime(createdAt),
                                    style: AppTheme.bodySmall.copyWith(
                                      color: AppTheme.darkTextTertiary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            if (!isRead)
                              Container(
                                width: 10,
                                height: 10,
                                decoration: const BoxDecoration(
                                  color: AppTheme.primaryColor,
                                  shape: BoxShape.circle,
                                ),
                              ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }

  IconData _getNotificationIcon(String type) {
    switch (type.toLowerCase()) {
      case 'ride':
      case 'trip':
        return Icons.local_taxi;
      case 'promotion':
      case 'promo':
        return Icons.local_offer;
      case 'payment':
        return Icons.payment;
      case 'driver':
        return Icons.person;
      case 'safety':
      case 'sos':
        return Icons.warning;
      default:
        return Icons.notifications;
    }
  }

  Color _getNotificationColor(String type) {
    switch (type.toLowerCase()) {
      case 'ride':
      case 'trip':
        return AppTheme.primaryColor;
      case 'promotion':
      case 'promo':
        return AppTheme.warningColor;
      case 'payment':
        return AppTheme.successColor;
      case 'driver':
        return AppTheme.infoColor;
      case 'safety':
      case 'sos':
        return AppTheme.errorColor;
      default:
        return AppTheme.darkTextSecondary;
    }
  }
}
