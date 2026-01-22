import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Driver } from './driver.entity';
import { RideType } from './ride-type.entity';
import { TripPayment } from './trip-payment.entity';
import { TripRating } from './trip-rating.entity';

export enum RideStatus {
  REQUESTED = 'requested',
  DRIVER_ASSIGNED = 'driver_assigned',
  DRIVER_ARRIVED = 'driver_arrived',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum CancellationReason {
  USER_CANCELLED = 'user_cancelled',
  DRIVER_CANCELLED = 'driver_cancelled',
  DRIVER_NO_SHOW = 'driver_no_show',
  USER_NO_SHOW = 'user_no_show',
  SYSTEM_TIMEOUT = 'system_timeout',
  OTHER = 'other',
}

@Entity('rides')
export class Ride {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ManyToOne(() => User, (user) => user.rides)
  @JoinColumn({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  @ManyToOne(() => Driver, (driver) => driver.rides)
  @JoinColumn({ name: 'driver_id' })
  driverId: string;

  @ManyToOne(() => Driver, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column()
  @ManyToOne(() => RideType)
  @JoinColumn({ name: 'ride_type_id' })
  rideTypeId: string;

  @ManyToOne(() => RideType)
  @JoinColumn({ name: 'ride_type_id' })
  rideType: RideType;

  // Pickup Location
  @Column({ type: 'decimal', precision: 10, scale: 8 })
  @Index()
  pickupLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  @Index()
  pickupLongitude: number;

  @Column()
  pickupAddress: string;

  // Dropoff Location

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  dropoffLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  dropoffLongitude: number;

  @Column()
  dropoffAddress: string;

  // Trip Details
  @Column({
    type: 'enum',
    enum: RideStatus,
    default: RideStatus.REQUESTED,
  })
  status: RideStatus;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  distance: number; // in kilometers

  @Column({ type: 'int', nullable: true })
  duration: number; // in seconds

  @Column({ type: 'int', nullable: true })
  estimatedDuration: number; // in seconds

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  estimatedDistance: number; // in kilometers

  // Pricing
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  baseFare: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distanceFare: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  timeFare: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  surgeMultiplier: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalFare: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalFare: number;

  @Column({ nullable: true })
  promoCodeId: string;

  // Timestamps
  @Column({ type: 'timestamp', nullable: true })
  requestedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  assignedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  arrivedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({
    type: 'enum',
    enum: CancellationReason,
    nullable: true,
  })
  cancellationReason: CancellationReason;

  @Column({ nullable: true })
  cancellationNote: string;

  @Column({ nullable: true })
  cancelledBy: string; // 'user' or 'driver'

  // Scheduled Rides
  @Column({ default: false })
  isScheduled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  scheduledTime: Date;

  @OneToOne(() => TripPayment, (payment) => payment.ride)
  payment: TripPayment;

  @OneToOne(() => TripRating, (rating) => rating.ride)
  rating: TripRating;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

