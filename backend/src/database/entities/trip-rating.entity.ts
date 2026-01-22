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

@Entity('trip_ratings')
export class TripRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @OneToOne(() => Ride, (ride) => ride.rating)
  @JoinColumn({ name: 'ride_id' })
  rideId: string;

  @OneToOne(() => Ride)
  @JoinColumn({ name: 'ride_id' })
  ride: Ride;

  @Column({ type: 'int' })
  driverRating: number; // 1-5

  @Column({ type: 'text', nullable: true })
  driverReview: string;

  @Column({ type: 'int', nullable: true })
  userRating: number; // 1-5 (driver rates user)

  @Column({ type: 'text', nullable: true })
  userReview: string;

  @Column({ default: false })
  isRatedByUser: boolean;

  @Column({ default: false })
  isRatedByDriver: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

