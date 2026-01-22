import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('pricing')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('estimate')
  @ApiOperation({ summary: 'Get estimated fare for a ride' })
  async estimateFare(
    @Query('rideTypeId') rideTypeId: string,
    @Query('distance') distance: number,
    @Query('duration') duration: number,
    @Query('pickupLat') pickupLat: number,
    @Query('pickupLon') pickupLon: number,
    @Query('dropoffLat') dropoffLat: number,
    @Query('dropoffLon') dropoffLon: number,
  ) {
    return this.pricingService.calculateEstimatedFare(
      rideTypeId,
      parseFloat(distance.toString()),
      parseFloat(duration.toString()),
      parseFloat(pickupLat.toString()),
      parseFloat(pickupLon.toString()),
      parseFloat(dropoffLat.toString()),
      parseFloat(dropoffLon.toString()),
    );
  }

  @Post('calculate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Calculate actual fare after trip completion' })
  async calculateFare(
    @Body('rideId') rideId: string,
    @Body('distance') distance: number,
    @Body('duration') duration: number,
  ) {
    return this.pricingService.calculateActualFare(
      rideId,
      parseFloat(distance.toString()),
      parseFloat(duration.toString()),
    );
  }
}

