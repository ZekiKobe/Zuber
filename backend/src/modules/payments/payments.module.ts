import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripPayment } from '../../database/entities/trip-payment.entity';
import { Ride } from '../../database/entities/ride.entity';
import { User } from '../../database/entities/user.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TripPayment, Ride, User]),
    NotificationsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}