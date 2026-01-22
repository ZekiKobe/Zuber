import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Ride } from './ride.entity';
import { Vehicle } from './vehicle.entity';
import { DriverDocument } from './driver-document.entity';
import { WalletAccount } from './wallet-account.entity';

export enum DriverStatus {
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  BLOCKED = 'blocked',
  SUSPENDED = 'suspended',
}

export enum DriverAvailability {
  OFFLINE = 'offline',
  ONLINE = 'online',
  ON_TRIP = 'on_trip',
  BREAK = 'break',
}

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({
    type: 'enum',
    enum: DriverStatus,
    default: DriverStatus.PENDING_APPROVAL,
  })
  status: DriverStatus;

  @Column({
    type: 'enum',
    enum: DriverAvailability,
    default: DriverAvailability.OFFLINE,
  })
  availability: DriverAvailability;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ nullable: true })
  phoneVerificationCode: string;

  @Column({ type: 'timestamp', nullable: true })
  phoneVerificationExpires: Date;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  @Index()
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  heading: number; // Direction in degrees (0-360)

  @Column({ default: 0 })
  totalRides: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalEarnings: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pendingEarnings: number;

  @Column({ default: 'ETB' })
  currency: string;

  @Column({ default: 'am' })
  language: string;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ type: 'date', nullable: true })
  licenseExpiryDate: Date;

  @Column({ nullable: true })
  nationalId: string;

  @OneToMany(() => Ride, (ride) => ride.driver)
  rides: Ride[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.driver)
  vehicles: Vehicle[];

  @OneToMany(() => DriverDocument, (doc) => doc.driver)
  documents: DriverDocument[];

  @OneToOne(() => WalletAccount, (wallet) => wallet.driver)
  wallet: WalletAccount;

  @Column({ type: 'timestamp', nullable: true })
  lastOnlineAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

