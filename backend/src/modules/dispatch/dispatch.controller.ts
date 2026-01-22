import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DispatchService } from './dispatch.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('dispatch')
@Controller('dispatch')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Post('assign')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually trigger ride dispatch' })
  async dispatchRide(@Body('rideId') rideId: string) {
    return this.dispatchService.dispatchRide(rideId);
  }

  @Get('nearby-drivers')
  @ApiOperation({ summary: 'Get nearby drivers for a location' })
  async getNearbyDrivers(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('radius') radius: number = 5,
    @Query('limit') limit: number = 20,
  ) {
    return this.dispatchService.getNearbyDrivers(
      parseFloat(lat.toString()),
      parseFloat(lon.toString()),
      radius,
      limit,
    );
  }
}

