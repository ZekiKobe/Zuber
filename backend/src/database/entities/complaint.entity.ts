import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ComplaintType {
  RIDE_ISSUE = 'ride_issue',
  PAYMENT_ISSUE = 'payment_issue',
  DRIVER_BEHAVIOR = 'driver_behavior',
  USER_BEHAVIOR = 'user_behavior',
  TECHNICAL_ISSUE = 'technical_issue',
  OTHER = 'other',
}

export enum ComplaintStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({ nullable: true })
  rideId: string;

  @Column({
    type: 'enum',
    enum: ComplaintType,
  })
  type: ComplaintType;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ComplaintStatus,
    default: ComplaintStatus.PENDING,
  })
  status: ComplaintStatus;

  @Column({ nullable: true })
  assignedTo: string; // Admin user ID

  @Column({ type: 'text', nullable: true })
  resolution: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

