import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PricingRuleType {
  SURGE = 'surge',
  DISCOUNT = 'discount',
  COMMISSION = 'commission',
}

@Entity('pricing_rules')
export class PricingRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PricingRuleType,
  })
  type: PricingRuleType;

  @Column({ nullable: true })
  rideTypeId: string; // If specific to ride type

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  multiplier: number; // For surge pricing

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fixedAmount: number; // For discounts

  @Column({ type: 'int', nullable: true })
  minRides: number; // Minimum rides for discount

  @Column({ type: 'time', nullable: true })
  startTime: string; // Time-based rules

  @Column({ type: 'time', nullable: true })
  endTime: string;

  @Column({ type: 'json', nullable: true })
  daysOfWeek: number[]; // [0-6] Sunday to Saturday

  @Column({ type: 'json', nullable: true })
  zones: string[]; // Geographic zones (polygons)

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: true })
  validUntil: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

