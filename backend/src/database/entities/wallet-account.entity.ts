import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Driver } from './driver.entity';
import { WalletTransaction } from './wallet-transaction.entity';

@Entity('wallet_accounts')
export class WalletAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true })
  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true, unique: true })
  @OneToOne(() => Driver, (driver) => driver.wallet)
  @JoinColumn({ name: 'driver_id' })
  driverId: string;

  @OneToOne(() => Driver, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pendingBalance: number; // For driver withdrawals

  @Column({ default: 'ETB' })
  currency: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => WalletTransaction, (transaction) => transaction.wallet)
  transactions: WalletTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

