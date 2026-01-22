import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { RideType } from '../../database/entities/ride-type.entity';
import { PricingRule } from '../../database/entities/pricing-rule.entity';
import { Ride } from '../../database/entities/ride.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RideType, PricingRule, Ride])],
  providers: [PricingService],
  controllers: [PricingController],
  exports: [PricingService],
})
export class PricingModule {}

