import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../../database/entities/notification.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  /**
   * Create and save a notification
   */
  async createNotification(data: {
    userId?: string;
    driverId?: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
  }): Promise<Notification> {
    const notification = new Notification();
    notification.userId = data.userId;
    notification.driverId = data.driverId;
    notification.type = data.type;
    notification.title = data.title;
    notification.message = data.message;
    notification.data = data.data || {};

    return await this.notificationRepository.save(notification);
  }

  /**
   * Send ride-related notification
   */
  async sendRideNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: Record<string, any>,
  ): Promise<Notification> {
    const notificationType = this.mapRideNotificationType(type as any);
    return await this.createNotification({
      userId,
      type: notificationType,
      title,
      message,
      data,
    });
  }

  /**
   * Get notifications for user
   */
  async getUserNotifications(
    userId: string,
    limit: number = 50,
    offset: number = 0,
    unreadOnly: boolean = false,
  ): Promise<Notification[]> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);

    if (unreadOnly) {
      queryBuilder.andWhere('notification.isRead = false');
    }

    return await queryBuilder.getMany();
  }

  /**
   * Get notifications for driver
   */
  async getDriverNotifications(
    driverId: string,
    limit: number = 50,
    offset: number = 0,
    unreadOnly: boolean = false,
  ): Promise<Notification[]> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.driverId = :driverId', { driverId })
      .orderBy('notification.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);

    if (unreadOnly) {
      queryBuilder.andWhere('notification.isRead = false');
    }

    return await queryBuilder.getMany();
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId?: string, driverId?: string): Promise<boolean> {
    const whereClause: any = { id: notificationId };
    if (userId) {
      whereClause.userId = userId;
    } else if (driverId) {
      whereClause.driverId = driverId;
    }

    const result = await this.notificationRepository.update(whereClause, {
      isRead: true,
      readAt: new Date(),
    });

    return result.affected > 0;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId?: string, driverId?: string): Promise<boolean> {
    const whereClause: any = {};
    if (userId) {
      whereClause.userId = userId;
    } else if (driverId) {
      whereClause.driverId = driverId;
    }

    const result = await this.notificationRepository.update(
      { ...whereClause, isRead: false },
      { isRead: true, readAt: new Date() },
    );

    return result.affected > 0;
  }

  /**
   * Count unread notifications
   */
  async countUnread(userId?: string, driverId?: string): Promise<number> {
    const whereClause: any = { isRead: false };
    if (userId) {
      whereClause.userId = userId;
    } else if (driverId) {
      whereClause.driverId = driverId;
    }

    return await this.notificationRepository.count({
      where: whereClause,
    });
  }

  /**
   * Map ride notification types
   */
  private mapRideNotificationType(type: NotificationType): NotificationType {
    const mapping: Record<string, NotificationType> = {
      'ride_requested': NotificationType.RIDE_REQUEST,
      'ride_accepted': NotificationType.RIDE_ACCEPTED,
      'driver_arrived': NotificationType.DRIVER_ARRIVING,
      'ride_started': NotificationType.RIDE_STARTED,
      'ride_completed': NotificationType.RIDE_COMPLETED,
      'ride_cancelled': NotificationType.RIDE_CANCELLED,
      'payment_received': NotificationType.PAYMENT_RECEIVED,
      'payment_failed': NotificationType.PAYMENT_FAILED,
      'driver_approved': NotificationType.DRIVER_APPROVED,
      'driver_rejected': NotificationType.DRIVER_REJECTED,
      'promo_code': NotificationType.PROMO_CODE,
      'system_announcement': NotificationType.SYSTEM_ANNOUNCEMENT,
    };

    return mapping[type] || type as NotificationType;
  }
}