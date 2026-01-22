import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Driver } from '../../database/entities/driver.entity';
import { Ride } from '../../database/entities/ride.entity';
import { DriverLocation } from '../../database/entities/driver-location.entity';
import { DriverAvailability } from '../../database/entities/driver.entity';
import { RideStatus } from '../../database/entities/ride.entity';
import { calculateDistance, getDistanceSQL } from '../../common/utils/distance.util';

@Injectable()
export class DispatchService {
  private readonly logger = new Logger(DispatchService.name);
  private readonly dispatchRadius: number;
  private readonly dispatchTimeout: number;
  private readonly maxRetries: number;
  private readonly maxRadius: number;

  constructor(
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
    @InjectRepository(Ride)
    private rideRepository: Repository<Ride>,
    @InjectRepository(DriverLocation)
    private driverLocationRepository: Repository<DriverLocation>,
    private configService: ConfigService,
  ) {
    this.dispatchRadius = parseFloat(
      this.configService.get('DISPATCH_RADIUS_KM', '3'),
    );
    this.dispatchTimeout = parseInt(
      this.configService.get('DISPATCH_TIMEOUT_SECONDS', '30'),
    );
    this.maxRetries = parseInt(
      this.configService.get('DISPATCH_MAX_RETRIES', '3'),
    );
    this.maxRadius = this.dispatchRadius * 3; // Max search radius
  }

  /**
   * Find nearest available driver for a ride request
   * Uses PostGIS spatial queries for efficient distance calculation
   */
  async findNearestDriver(
    rideId: string,
    pickupLat: number,
    pickupLon: number,
    rideTypeId: string,
    radiusKm: number = this.dispatchRadius,
  ): Promise<Driver | null> {
    try {
      // Find available drivers within radius using Haversine formula
      const distanceSQL = getDistanceSQL('driver.latitude', 'driver.longitude', pickupLat, pickupLon);
      
      const drivers = await this.driverRepository
        .createQueryBuilder('driver')
        .leftJoinAndSelect('driver.vehicles', 'vehicle')
        .where('driver.availability = :availability', {
          availability: DriverAvailability.ONLINE,
        })
        .andWhere('driver.status = :status', {
          status: 'approved',
        })
        .andWhere('driver.latitude IS NOT NULL')
        .andWhere('driver.longitude IS NOT NULL')
        .andWhere('vehicle.rideTypeId = :rideTypeId', { rideTypeId })
        .andWhere('vehicle.status = :vehicleStatus', {
          vehicleStatus: 'approved',
        })
        .andWhere(`${distanceSQL} <= :radius`, {
          radius: radiusKm,
        })
        .orderBy(distanceSQL, 'ASC')
        .limit(10)
        .getMany();

      if (drivers.length === 0) {
        this.logger.warn(
          `No drivers found within ${radiusKm}km for ride ${rideId}`,
        );
        return null;
      }

      // Select best driver based on:
      // 1. Distance (already sorted)
      // 2. Rating (higher is better)
      // 3. Total rides (more experience)
      let bestDriver = drivers[0];
      let bestScore = this.calculateDriverScore(
        bestDriver,
        pickupLat,
        pickupLon,
      );

      for (const driver of drivers.slice(1)) {
        const score = this.calculateDriverScore(
          driver,
          pickupLat,
          pickupLon,
        );
        if (score > bestScore) {
          bestDriver = driver;
          bestScore = score;
        }
      }

      this.logger.log(
        `Found driver ${bestDriver.id} for ride ${rideId} at ${radiusKm}km radius`,
      );

      return bestDriver;
    } catch (error) {
      this.logger.error(`Error finding nearest driver: ${error.message}`, error.stack);
      return null;
    }
  }

  /**
   * Calculate driver score for selection
   */
  private calculateDriverScore(
    driver: Driver,
    pickupLat: number,
    pickupLon: number,
  ): number {
    // Base score from rating (0-5 scale, weighted 40%)
    const ratingScore = (driver.rating || 0) * 0.4;

    // Experience score from total rides (weighted 20%)
    const experienceScore = Math.min(driver.totalRides / 100, 1) * 0.2;

      // Distance score (closer is better, weighted 40%)
      const distance = calculateDistance(
        pickupLat,
        pickupLon,
        driver.latitude || 0,
        driver.longitude || 0,
      );
      // Normalize distance (closer = higher score, max 10km = 0, 0km = 1)
      const normalizedDistance = Math.max(0, 1 - distance / 10);
      const distanceScore = normalizedDistance * 0.4;

    return ratingScore + experienceScore + distanceScore;
  }

  /**
   * Dispatch ride to driver with retry mechanism
   */
  async dispatchRide(
    rideId: string,
    retryCount: number = 0,
  ): Promise<{ success: boolean; driverId?: string; error?: string }> {
    try {
      const ride = await this.rideRepository.findOne({
        where: { id: rideId },
        relations: ['rideType'],
      });

      if (!ride) {
        return { success: false, error: 'Ride not found' };
      }

      if (ride.status !== RideStatus.REQUESTED) {
        return { success: false, error: 'Ride is not in requested status' };
      }

      // Calculate search radius (increases with retries)
      const radiusKm =
        this.dispatchRadius + retryCount * (this.dispatchRadius / 2);

      if (radiusKm > this.maxRadius) {
        return {
          success: false,
          error: 'No drivers available within maximum radius',
        };
      }

      // Find nearest driver
      const driver = await this.findNearestDriver(
        rideId,
        ride.pickupLatitude,
        ride.pickupLongitude,
        ride.rideTypeId,
        radiusKm,
      );

      if (!driver) {
        // Retry with larger radius
        if (retryCount < this.maxRetries) {
          this.logger.log(
            `Retrying dispatch for ride ${rideId}, attempt ${retryCount + 1}`,
          );
          return this.dispatchRide(rideId, retryCount + 1);
        }
        return { success: false, error: 'No available drivers found' };
      }

      // Assign driver to ride
      ride.driverId = driver.id;
      ride.status = RideStatus.DRIVER_ASSIGNED;
      ride.assignedAt = new Date();
      await this.rideRepository.save(ride);

      // Update driver availability
      driver.availability = DriverAvailability.ON_TRIP;
      await this.driverRepository.save(driver);

      this.logger.log(
        `Ride ${rideId} dispatched to driver ${driver.id} on attempt ${retryCount + 1}`,
      );

      return { success: true, driverId: driver.id };
    } catch (error) {
      this.logger.error(
        `Error dispatching ride ${rideId}: ${error.message}`,
        error.stack,
      );
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle driver rejection - reassign ride
   */
  async handleDriverRejection(
    rideId: string,
    driverId: string,
  ): Promise<{ success: boolean; driverId?: string }> {
    try {
      const ride = await this.rideRepository.findOne({
        where: { id: rideId },
      });

      if (!ride || ride.driverId !== driverId) {
        return { success: false };
      }

      // Reset ride status
      ride.driverId = null;
      ride.status = RideStatus.REQUESTED;
      ride.assignedAt = null;
      await this.rideRepository.save(ride);

      // Make driver available again
      const driver = await this.driverRepository.findOne({
        where: { id: driverId },
      });
      if (driver) {
        driver.availability = DriverAvailability.ONLINE;
        await this.driverRepository.save(driver);
      }

      // Re-dispatch
      return this.dispatchRide(rideId, 1); // Start with retry count 1
    } catch (error) {
      this.logger.error(
        `Error handling driver rejection: ${error.message}`,
        error.stack,
      );
      return { success: false };
    }
  }

  /**
   * Handle dispatch timeout - reassign if driver doesn't accept
   */
  async handleDispatchTimeout(rideId: string): Promise<void> {
    try {
      const ride = await this.rideRepository.findOne({
        where: { id: rideId },
      });

      if (
        !ride ||
        ride.status !== RideStatus.DRIVER_ASSIGNED ||
        !ride.assignedAt
      ) {
        return;
      }

      // Check if timeout exceeded
      const timeSinceAssignment =
        Date.now() - ride.assignedAt.getTime();
      if (timeSinceAssignment < this.dispatchTimeout * 1000) {
        return; // Not yet timed out
      }

      this.logger.warn(`Dispatch timeout for ride ${rideId}, reassigning...`);

      // Reset and reassign
      const driverId = ride.driverId;
      await this.handleDriverRejection(rideId, driverId);
    } catch (error) {
      this.logger.error(
        `Error handling dispatch timeout: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Get nearby drivers for a location (for map display)
   */
  async getNearbyDrivers(
    lat: number,
    lon: number,
    radiusKm: number = 5,
    limit: number = 20,
  ): Promise<Driver[]> {
    try {
      const distanceSQL = getDistanceSQL('driver.latitude', 'driver.longitude', lat, lon);
      
      return await this.driverRepository
        .createQueryBuilder('driver')
        .leftJoinAndSelect('driver.vehicles', 'vehicle')
        .where('driver.availability = :availability', {
          availability: DriverAvailability.ONLINE,
        })
        .andWhere('driver.status = :status', { status: 'approved' })
        .andWhere('driver.latitude IS NOT NULL')
        .andWhere('driver.longitude IS NOT NULL')
        .andWhere(`${distanceSQL} <= :radius`, {
          radius: radiusKm,
        })
        .orderBy(distanceSQL, 'ASC')
        .limit(limit)
        .getMany();
    } catch (error) {
      this.logger.error(
        `Error getting nearby drivers: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }
}

