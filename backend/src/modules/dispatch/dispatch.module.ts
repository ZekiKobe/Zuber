import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatchService } from './dispatch.service';
import { DispatchController } from './dispatch.controller';
import { Driver } from '../../database/entities/driver.entity';
import { Ride } from '../../database/entities/ride.entity';
import { DriverLocation } from '../../database/entities/driver-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Driver, Ride, DriverLocation])],
  providers: [DispatchService],
  controllers: [DispatchController],
  exports: [DispatchService],
})
export class DispatchModule {}

