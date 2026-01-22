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
import { RideType } from './ride-type.entity';

export enum VehicleStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  INACTIVE = 'inactive',
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ManyToOne(() => Driver, (driver) => driver.vehicles)
  @JoinColumn({ name: 'driver_id' })
  driverId: string;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column()
  make: string; // e.g., Toyota, Bajaj

  @Column()
  model: string; // e.g., Corolla, Boxer

  @Column()
  year: number;

  @Column({ unique: true })
  licensePlate: string;

  @Column()
  color: string;

  @Column()
  @ManyToOne(() => RideType)
  @JoinColumn({ name: 'ride_type_id' })
  rideTypeId: string;

  @ManyToOne(() => RideType)
  @JoinColumn({ name: 'ride_type_id' })
  rideType: RideType;

  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.PENDING,
  })
  status: VehicleStatus;

  @Column({ nullable: true })
  registrationDocument: string;

  @Column({ nullable: true })
  insuranceDocument: string;

  @Column({ type: 'date', nullable: true })
  insuranceExpiryDate: Date;

  @Column({ default: 4 })
  capacity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

