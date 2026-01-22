import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../database/entities/user.entity';
import { Driver } from '../../database/entities/driver.entity';
import { Ride } from '../../database/entities/ride.entity';
import { RideStatus } from '../../database/entities/ride.entity';
import { RidesService } from './rides.service';

@Controller('rides')
@UseGuards(JwtAuthGuard)
export class RidesController {
  private readonly logger = new Logger(RidesController.name);

  constructor(private readonly ridesService: RidesService) {}

  @Post('request')
  async requestRide(
    @CurrentUser() user: User,
    @Body() requestBody: any,
  ) {
    try {
      const ride = await this.ridesService.requestRide(user.id, requestBody);
      return { success: true, data: ride };
    } catch (error) {
      this.logger.error(`Error requesting ride: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to request ride',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async getRideById(
    @CurrentUser() user: User,
    @Param('id') rideId: string,
  ) {
    try {
      const ride = await this.ridesService.getRideById(rideId, user.id);
      if (!ride) {
        throw new HttpException('Ride not found', HttpStatus.NOT_FOUND);
      }
      return { success: true, data: ride };
    } catch (error) {
      this.logger.error(`Error getting ride: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to get ride',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/cancel')
  async cancelRide(
    @CurrentUser() user: User,
    @Param('id') rideId: string,
    @Body('reason') reason?: string,
  ) {
    try {
      const result = await this.ridesService.cancelRide(
        rideId,
        user.id,
        'user',
        reason,
      );
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(`Error cancelling ride: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to cancel ride',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('active/user')
  async getActiveRidesForUser(@CurrentUser() user: User) {
    try {
      const rides = await this.ridesService.getActiveRidesForUser(user.id);
      return { success: true, data: rides };
    } catch (error) {
      this.logger.error(`Error getting active rides: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to get active rides',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('history/user')
  async getRideHistoryForUser(@CurrentUser() user: User) {
    try {
      const rides = await this.ridesService.getRideHistoryForUser(user.id);
      return { success: true, data: rides };
    } catch (error) {
      this.logger.error(`Error getting ride history: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to get ride history',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('nearby-drivers')
  async getNearbyDrivers(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('radius') radius: number = 5,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const drivers = await this.ridesService.getNearbyDrivers({
        lat,
        lon,
        radius: radius || 5,
        limit: limit || 10,
      });
      return { success: true, data: drivers };
    } catch (error) {
      this.logger.error(`Error getting nearby drivers: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to get nearby drivers',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Driver-specific endpoints
  @Put(':id/accept')
  async acceptRide(
    @CurrentUser() driver: Driver,
    @Param('id') rideId: string,
  ) {
    try {
      const result = await this.ridesService.acceptRide(rideId, driver.id);
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(`Error accepting ride: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to accept ride',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/arriving')
  async markRideArriving(
    @CurrentUser() driver: Driver,
    @Param('id') rideId: string,
  ) {
    try {
      const result = await this.ridesService.markRideStatus(
        rideId,
        driver.id,
        RideStatus.DRIVER_ARRIVED,
      );
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(`Error marking ride as arriving: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to mark ride as arriving',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/start')
  async startRide(
    @CurrentUser() driver: Driver,
    @Param('id') rideId: string,
  ) {
    try {
      const result = await this.ridesService.startRide(rideId, driver.id);
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(`Error starting ride: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to start ride',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/complete')
  async completeRide(
    @CurrentUser() driver: Driver,
    @Param('id') rideId: string,
    @Body() body: { distance?: number; duration?: number },
  ) {
    try {
      const result = await this.ridesService.completeRide(
        rideId,
        driver.id,
        body,
      );
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(`Error completing ride: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to complete ride',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/cancel-driver')
  async cancelRideByDriver(
    @CurrentUser() driver: Driver,
    @Param('id') rideId: string,
    @Body('reason') reason?: string,
  ) {
    try {
      const result = await this.ridesService.cancelRide(
        rideId,
        driver.id,
        'driver',
        reason,
      );
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(`Error cancelling ride by driver: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to cancel ride',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('active/driver')
  async getActiveRidesForDriver(@CurrentUser() driver: Driver) {
    try {
      const rides = await this.ridesService.getActiveRidesForDriver(driver.id);
      return { success: true, data: rides };
    } catch (error) {
      this.logger.error(`Error getting active rides for driver: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to get active rides',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}