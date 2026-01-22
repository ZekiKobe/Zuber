import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum PlaceType {
  HOME = 'home',
  WORK = 'work',
  FAVORITE = 'favorite',
  RECENT = 'recent',
}

@Entity('saved_places')
export class SavedPlace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ManyToOne(() => User, (user) => user.savedPlaces)
  @JoinColumn({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({
    type: 'enum',
    enum: PlaceType,
    default: PlaceType.FAVORITE,
  })
  placeType: PlaceType;

  @Column({ nullable: true })
  icon: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

