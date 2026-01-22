import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { Driver } from './driver.entity';

/**
 * Real-time driver location tracking table
 * Stores location updates for active drivers
 */
@Entity('driver_locations')
@Index(['driverId', 'createdAt'])
@Index(['latitude', 'longitude'])
export class DriverLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driver_id' })
  driverId: string;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  @Index()
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  heading: number; // Direction in degrees

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  speed: number; // Speed in km/h

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  accuracy: number; // GPS accuracy in meters

  @Index()
  @CreateDateColumn()
  createdAt: Date;
}

