import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Ride } from './ride.entity';
import { PaymentMethod, TransactionStatus } from './wallet-transaction.entity';

@Entity('trip_payments')
export class TripPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @OneToOne(() => Ride, (ride) => ride.payment)
  @JoinColumn({ name: 'ride_id' })
  rideId: string;

  @OneToOne(() => Ride)
  @JoinColumn({ name: 'ride_id' })
  ride: Ride;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ nullable: true })
  transactionId: string; // TeleBirr transaction ID

  @Column({ nullable: true })
  reference: string;

  @Column({ nullable: true })
  failureReason: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

