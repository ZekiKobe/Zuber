import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Driver } from './driver.entity';

export enum DocumentType {
  NATIONAL_ID = 'national_id',
  DRIVING_LICENSE = 'driving_license',
  VEHICLE_REGISTRATION = 'vehicle_registration',
  INSURANCE = 'insurance',
  PROFILE_PHOTO = 'profile_photo',
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('driver_documents')
export class DriverDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ManyToOne(() => Driver, (driver) => driver.documents)
  @JoinColumn({ name: 'driver_id' })
  driverId: string;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  documentType: DocumentType;

  @Column()
  documentUrl: string;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ nullable: true })
  reviewedBy: string; // Admin user ID

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

