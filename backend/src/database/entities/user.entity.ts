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
import { WalletAccount } from './wallet-account.entity';
import { SavedPlace } from './saved-place.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  PENDING_VERIFICATION = 'pending_verification',
}

@Entity('users')
export class User {
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
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

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

  @Column({ default: 0 })
  totalRides: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 'ETB' })
  currency: string;

  @Column({ default: 'am' })
  language: string;

  @OneToMany(() => Ride, (ride) => ride.user)
  rides: Ride[];

  @OneToOne(() => WalletAccount, (wallet) => wallet.user)
  wallet: WalletAccount;

  @OneToMany(() => SavedPlace, (place) => place.user)
  savedPlaces: SavedPlace[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

