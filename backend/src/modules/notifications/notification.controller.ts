import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { User } from '../../database/entities/user.entity';
import { Driver } from '../../database/entities/driver.entity';
import { Notification } from '../../database/entities/notification.entity';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly notificationService: NotificationService) {}

  @Get('user')
  async getUserNotifications(
    @Query('userId') userId: string,
    @Query('limit') limit: number = 50,
    @Query('offset') offset: number = 0,
    @Query('unreadonly') unreadOnly: boolean = false,
  ) {
    try {
      const notifications = await this.notificationService.getUserNotifications(
        userId,
        limit,
        offset,
        unreadOnly,
      );
      return { success: true, data: notifications };
    } catch (error) {
      this.logger.error(`Error getting user notifications: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to get notifications',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('driver')
  async getDriverNotifications(
    @Query('driverId') driverId: string,
    @Query('limit') limit: number = 50,
    @Query('offset') offset: number = 0,
    @Query('unreadonly') unreadOnly: boolean = false,
  ) {
    try {
      const notifications = await this.notificationService.getDriverNotifications(
        driverId,
        limit,
        offset,
        unreadOnly,
      );
      return { success: true, data: notifications };
    } catch (error) {
      this.logger.error(`Error getting driver notifications: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to get notifications',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async getNotificationById(
    @Query('userId') userId: string,
    @Param('id') notificationId: string,
  ) {
    try {
      // Verify user has access to this notification
      const notification = await this.notificationService.getUserNotifications(
        userId,
        1,
        0,
        false,
      );
      
      const notificationObj = notification.find(n => n.id === notificationId);
      if (!notificationObj) {
        throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
      }
      
      return { success: true, data: notificationObj };
    } catch (error) {
      this.logger.error(`Error getting notification: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to get notification',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/read')
  async markNotificationAsRead(
    @Query('userId') userId: string,
    @Param('id') notificationId: string,
  ) {
    try {
      const success = await this.notificationService.markAsRead(
        notificationId,
        userId,
      );
      
      if (!success) {
        throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
      }
      
      return { success: true, message: 'Notification marked as read' };
    } catch (error) {
      this.logger.error(`Error marking notification as read: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to mark notification as read',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('read-all')
  async markAllNotificationsAsRead(@Query('userId') userId: string) {
    try {
      const success = await this.notificationService.markAllAsRead(userId);
      return { success: true, message: 'All notifications marked as read' };
    } catch (error) {
      this.logger.error(`Error marking all notifications as read: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to mark all notifications as read',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('count/unread')
  async countUnreadNotifications(@Query('userId') userId: string) {
    try {
      const count = await this.notificationService.countUnread(userId);
      return { success: true, data: { count } };
    } catch (error) {
      this.logger.error(`Error counting unread notifications: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to count unread notifications',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}