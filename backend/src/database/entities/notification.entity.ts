import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum NotificationType {
  RIDE_REQUEST = 'ride_request',
  RIDE_ACCEPTED = 'ride_accepted',
  DRIVER_ARRIVING = 'driver_arriving',
  RIDE_STARTED = 'ride_started',
  RIDE_COMPLETED = 'ride_completed',
  RIDE_CANCELLED = 'ride_cancelled',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_FAILED = 'payment_failed',
  WALLET_DEPOSIT = 'wallet_deposit',
  WALLET_WITHDRAWAL = 'wallet_withdrawal',
  DRIVER_APPROVED = 'driver_approved',
  DRIVER_REJECTED = 'driver_rejected',
  PROMO_CODE = 'promo_code',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
}

@Entity('notifications')
@Index(['userId', 'isRead', 'createdAt'])
@Index(['driverId', 'isRead', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'json', nullable: true })
  data: Record<string, any>; // Additional data

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ default: false })
  isSent: boolean; // Push notification sent

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

