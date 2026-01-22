import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RideTypeCategory {
  STANDARD = 'standard',
  XL = 'xl',
  MOTORCYCLE = 'motorcycle',
  BAJAJ = 'bajaj',
  PREMIUM = 'premium',
}

@Entity('ride_types')
export class RideType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // e.g., 'standard', 'xl', 'motorcycle', 'bajaj'

  @Column()
  displayName: string; // e.g., 'Standard', 'XL', 'Motorcycle', 'Bajaj'

  @Column({
    type: 'enum',
    enum: RideTypeCategory,
  })
  category: RideTypeCategory;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  baseFare: number; // Base fare in ETB

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  perKmRate: number; // Per kilometer rate

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  perMinuteRate: number; // Per minute rate

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  minimumFare: number; // Minimum fare

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  surgeMultiplier: number; // Default surge

  @Column({ default: 4 })
  capacity: number; // Passenger capacity

  @Column({ nullable: true })
  icon: string; // Icon name or URL

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

