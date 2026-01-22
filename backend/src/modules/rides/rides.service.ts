import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, IsNull } from 'typeorm';
import { Ride, RideStatus, CancellationReason } from '../../database/entities/ride.entity';
import { User } from '../../database/entities/user.entity';
import { Driver } from '../../database/entities/driver.entity';
import { RideType } from '../../database/entities/ride-type.entity';
import { TripPayment } from '../../database/entities/trip-payment.entity';
import { TripRating } from '../../database/entities/trip-rating.entity';
import { DriverLocation } from '../../database/entities/driver-location.entity';
import { DriverAvailability } from '../../database/entities/driver.entity';
import { DispatchService } from '../dispatch/dispatch.service';
import { NotificationService } from '../notifications/notification.service';
import { calculateDistance, getDistanceSQL } from '../../common/utils/distance.util';
import { In } from 'typeorm';

@Injectable()
export class RidesService implements OnModuleInit {
  private readonly logger = new Logger(RidesService.name);

  constructor(
    @InjectRepository(Ride)
    private rideRepository: Repository<Ride>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
    @InjectRepository(RideType)
    private rideTypeRepository: Repository<RideType>,
    @InjectRepository(TripPayment)
    private paymentRepository: Repository<TripPayment>,
    @InjectRepository(TripRating)
    private ratingRepository: Repository<TripRating>,
    @InjectRepository(DriverLocation)
    private driverLocationRepository: Repository<DriverLocation>,
    private dispatchService: DispatchService,
    private notificationService: NotificationService,
  ) {}

  async onModuleInit() {
    // Initialize any scheduled tasks or startup procedures
    this.startScheduledTasks();
  }

  private startScheduledTasks() {
    // Set up interval to check for dispatch timeouts
    setInterval(async () => {
      await this.checkDispatchTimeouts();
    }, 30000); // Check every 30 seconds
  }

  private async checkDispatchTimeouts() {
    try {
      // Find rides that are assigned but haven't progressed
      const assignedRides = await this.rideRepository.find({
        where: {
          status: RideStatus.DRIVER_ASSIGNED,
          assignedAt: MoreThanOrEqual(new Date(Date.now() - 60000)), // Within last minute
        },
        relations: ['driver'],
      });

      for (const ride of assignedRides) {
        // Check if enough time has passed since assignment
        if (ride.assignedAt) {
          const timeSinceAssignment = Date.now() - ride.assignedAt.getTime();
          const dispatchTimeout = 120000; // 2 minutes

          if (timeSinceAssignment > dispatchTimeout) {
            // Handle dispatch timeout
            await this.dispatchService.handleDispatchTimeout(ride.id);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error checking dispatch timeouts: ${error.message}`);
    }
  }

  /**
   * Request a new ride
   */
  async requestRide(userId: string, rideData: any): Promise<Ride> {
    try {
      // Validate user exists
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Get ride type
      const rideType = await this.rideTypeRepository.findOne({
        where: { id: rideData.rideTypeId },
      });
      if (!rideType) {
        throw new Error('Invalid ride type');
      }

      // Calculate distance and duration
      const distance = calculateDistance(
        rideData.pickupLatitude,
        rideData.pickupLongitude,
        rideData.dropoffLatitude,
        rideData.dropoffLongitude,
      );

      const estimatedDuration = this.estimateDuration(distance);

      // Calculate fare - using simple calculation for now
      const baseFare = 2.50;
      const distanceRate = 1.50; // per km
      const timeRate = 0.30; // per minute
      
      const distanceFare = distance * distanceRate;
      const timeFare = (estimatedDuration / 60) * timeRate;
      const surgeMultiplier = 1.0;
      const totalFare = (baseFare + distanceFare + timeFare) * surgeMultiplier;

      // Create ride
      const ride = new Ride();
      ride.userId = userId;
      ride.rideTypeId = rideData.rideTypeId;
      
      // Location data
      ride.pickupLatitude = rideData.pickupLatitude;
      ride.pickupLongitude = rideData.pickupLongitude;
      ride.pickupAddress = rideData.pickupAddress;
      ride.dropoffLatitude = rideData.dropoffLatitude;
      ride.dropoffLongitude = rideData.dropoffLongitude;
      ride.dropoffAddress = rideData.dropoffAddress;
      
      // Trip details
      ride.distance = distance;
      ride.duration = estimatedDuration;
      ride.estimatedDistance = distance;
      ride.estimatedDuration = estimatedDuration;
      
      // Pricing
      ride.baseFare = baseFare;
      ride.distanceFare = distanceFare;
      ride.timeFare = timeFare;
      ride.surgeMultiplier = surgeMultiplier;
      ride.totalFare = totalFare;
      ride.finalFare = totalFare;
      
      // Promo code
      if (rideData.promoCodeId) {
        ride.promoCodeId = rideData.promoCodeId;
      }
      
      // Timestamps
      ride.requestedAt = new Date();
      ride.status = RideStatus.REQUESTED;

      // Scheduled ride
      if (rideData.scheduledTime) {
        ride.isScheduled = true;
        ride.scheduledTime = new Date(rideData.scheduledTime);
      }

      const savedRide = await this.rideRepository.save(ride);

      // If not scheduled, dispatch immediately
      if (!ride.isScheduled) {
        // Dispatch the ride to find an available driver
        try {
          await this.dispatchService.dispatchRide(savedRide.id);
        } catch (error) {
          this.logger.error(`Failed to dispatch ride ${savedRide.id}: ${error.message}`);
          // Still return the ride even if dispatch fails
          // The dispatch can be retried or handled by the scheduler
        }
      }

      // Send notification to user
      await this.notificationService.sendRideNotification(
        userId,
        'ride_requested',
        'Ride Requested',
        'Your ride has been requested',
        { rideId: savedRide.id },
      );

      return savedRide;
    } catch (error) {
      this.logger.error(`Error requesting ride: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get ride by ID
   */
  async getRideById(rideId: string, userId: string): Promise<Ride> {
    const ride = await this.rideRepository.findOne({
      where: { id: rideId },
      relations: ['user', 'driver', 'rideType', 'payment', 'rating'],
    });

    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    // Ensure user has access to this ride
    if (ride.userId !== userId && ride.driverId !== userId) {
      throw new Error('Unauthorized access to ride');
    }

    return ride;
  }

  /**
   * Cancel a ride
   */
  async cancelRide(
    rideId: string,
    actorId: string,
    actorType: 'user' | 'driver',
    reason?: string,
  ): Promise<Ride> {
    const ride = await this.rideRepository.findOne({
      where: { id: rideId },
      relations: ['user', 'driver'],
    });

    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    // Validate who can cancel
    if (
      (actorType === 'user' && ride.userId !== actorId) ||
      (actorType === 'driver' && ride.driverId !== actorId)
    ) {
      throw new Error('Unauthorized to cancel this ride');
    }

    // Check if ride can be cancelled
    if (
      ![RideStatus.REQUESTED, RideStatus.DRIVER_ASSIGNED, RideStatus.DRIVER_ARRIVED].includes(ride.status)
    ) {
      throw new Error('Cannot cancel ride in current status');
    }

    // Update ride status
    ride.status = RideStatus.CANCELLED;
    ride.cancelledAt = new Date();
    ride.cancellationReason = reason ? CancellationReason.OTHER : CancellationReason.USER_CANCELLED;
    ride.cancellationNote = reason;
    ride.cancelledBy = actorType;

    const updatedRide = await this.rideRepository.save(ride);

    // If driver was assigned, make them available again
    if (ride.driverId) {
      const driver = await this.driverRepository.findOne({
        where: { id: ride.driverId },
      });
      if (driver) {
        driver.availability = DriverAvailability.ONLINE;
        await this.driverRepository.save(driver);
      }

      // Send notification to driver
      await this.notificationService.sendRideNotification(
        ride.driverId,
        'ride_cancelled',
        'Ride Cancelled',
        `Ride was cancelled by ${actorType}`,
        { rideId: updatedRide.id },
      );
    }

    // Send notification to user
    await this.notificationService.sendRideNotification(
      ride.userId,
      'ride_cancelled',
      'Ride Cancelled',
      `Your ride was cancelled`,
      { rideId: updatedRide.id },
    );

    return updatedRide;
  }

  /**
   * Accept a ride (driver action)
   */
  async acceptRide(rideId: string, driverId: string): Promise<Ride> {
    const ride = await this.rideRepository.findOne({
      where: { id: rideId },
      relations: ['user', 'driver', 'rideType'],
    });

    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    if (ride.status !== RideStatus.REQUESTED) {
      throw new Error('Ride is not available for acceptance');
    }

    // Update ride
    ride.driverId = driverId;
    ride.status = RideStatus.DRIVER_ASSIGNED;
    ride.assignedAt = new Date();

    const updatedRide = await this.rideRepository.save(ride);

    // Update driver availability
    const driver = await this.driverRepository.findOne({
      where: { id: driverId },
    });
    if (driver) {
      driver.availability = DriverAvailability.ON_TRIP;
      await this.driverRepository.save(driver);
    }

    // Send notification to user
    await this.notificationService.sendRideNotification(
      ride.userId,
      'ride_accepted',
      'Driver Assigned',
      'A driver has been assigned to your ride',
      { rideId: updatedRide.id, driverId },
    );

    // Send notification to driver
    await this.notificationService.sendRideNotification(
      driverId,
      'ride_accepted',
      'Ride Accepted',
      'You have accepted a ride',
      { rideId: updatedRide.id },
    );

    return updatedRide;
  }

  /**
   * Mark ride as arriving
   */
  async markRideStatus(rideId: string, driverId: string, status: RideStatus): Promise<Ride> {
    const ride = await this.rideRepository.findOne({
      where: { id: rideId },
      relations: ['user', 'driver'],
    });

    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    if (ride.driverId !== driverId) {
      throw new Error('Unauthorized to update this ride');
    }

    // Validate status transition
    if (status === RideStatus.DRIVER_ARRIVED && ride.status !== RideStatus.DRIVER_ASSIGNED) {
      throw new Error('Ride must be assigned before arriving');
    }

    ride.status = status;
    if (status === RideStatus.DRIVER_ARRIVED) {
      ride.arrivedAt = new Date();
    }

    const updatedRide = await this.rideRepository.save(ride);

    // Send notification to user
    if (status === RideStatus.DRIVER_ARRIVED) {
      await this.notificationService.sendRideNotification(
        ride.userId,
        'driver_arrived',
        'Driver Arrived',
        'Your driver has arrived at the pickup location',
        { rideId: updatedRide.id },
      );
    }

    return updatedRide;
  }

  /**
   * Start a ride
   */
  async startRide(rideId: string, driverId: string): Promise<Ride> {
    const ride = await this.rideRepository.findOne({
      where: { id: rideId },
      relations: ['user', 'driver'],
    });

    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    if (ride.driverId !== driverId) {
      throw new Error('Unauthorized to start this ride');
    }

    if (![RideStatus.DRIVER_ASSIGNED, RideStatus.DRIVER_ARRIVED].includes(ride.status)) {
      throw new Error('Ride must be assigned or arrived before starting');
    }

    ride.status = RideStatus.IN_PROGRESS;
    ride.startedAt = new Date();

    const updatedRide = await this.rideRepository.save(ride);

    // Send notification to user
    await this.notificationService.sendRideNotification(
      ride.userId,
      'ride_started',
      'Ride Started',
      'Your ride has started',
      { rideId: updatedRide.id },
    );

    return updatedRide;
  }

  /**
   * Complete a ride
   */
  async completeRide(rideId: string, driverId: string, data?: { distance?: number; duration?: number }): Promise<Ride> {
    const ride = await this.rideRepository.findOne({
      where: { id: rideId },
      relations: ['user', 'driver', 'rideType'],
    });

    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    if (ride.driverId !== driverId) {
      throw new Error('Unauthorized to complete this ride');
    }

    if (ride.status !== RideStatus.IN_PROGRESS) {
      throw new Error('Ride must be in progress to complete');
    }

    // Update ride with actual distance/duration if provided
    if (data?.distance) {
      ride.distance = data.distance;
    }
    if (data?.duration) {
      ride.duration = data.duration;
    }

    // Update status and timestamp
    ride.status = RideStatus.COMPLETED;
    ride.completedAt = new Date();

    // Update driver stats
    if (ride.driverId) {
      await this.driverRepository.update(
        { id: ride.driverId },
        {
          totalRides: () => 'total_rides + 1',
          rating: () => 'COALESCE(rating, 0)', // Keep existing rating
        },
      );
    }

    const updatedRide = await this.rideRepository.save(ride);

    // Create payment record
    const payment = new TripPayment();
    payment.rideId = updatedRide.id;
    payment.amount = updatedRide.finalFare;
    await this.paymentRepository.save(payment);

    // Send notification to user
    await this.notificationService.sendRideNotification(
      ride.userId,
      'ride_completed',
      'Ride Completed',
      `Your ride has been completed. Fare: $${updatedRide.finalFare?.toFixed(2)}`,
      { rideId: updatedRide.id, fare: updatedRide.finalFare },
    );

    return updatedRide;
  }

  /**
   * Get active rides for user
   */
  async getActiveRidesForUser(userId: string): Promise<Ride[]> {
    return await this.rideRepository.find({
      where: {
        userId,
        status: In([RideStatus.REQUESTED, RideStatus.DRIVER_ASSIGNED, RideStatus.DRIVER_ARRIVED, RideStatus.IN_PROGRESS]),
      },
      relations: ['driver', 'rideType'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get ride history for user
   */
  async getRideHistoryForUser(userId: string): Promise<Ride[]> {
    return await this.rideRepository.find({
      where: {
        userId,
        status: In([RideStatus.COMPLETED, RideStatus.CANCELLED]),
      },
      relations: ['driver', 'rideType', 'payment'],
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  /**
   * Get active rides for driver
   */
  async getActiveRidesForDriver(driverId: string): Promise<Ride[]> {
    return await this.rideRepository.find({
      where: {
        driverId,
        status: In([RideStatus.DRIVER_ASSIGNED, RideStatus.DRIVER_ARRIVED, RideStatus.IN_PROGRESS]),
      },
      relations: ['user', 'rideType'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get nearby drivers
   */
  async getNearbyDrivers(params: {
    lat: number;
    lon: number;
    radius: number;
    limit: number;
  }): Promise<any[]> {
    const distanceSQL = getDistanceSQL('driver.latitude', 'driver.longitude', params.lat, params.lon);
    
    const drivers = await this.driverRepository
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.vehicles', 'vehicle')
      .where('driver.availability = :availability', {
        availability: DriverAvailability.ONLINE,
      })
      .andWhere('driver.status = :status', { status: 'approved' })
      .andWhere('driver.latitude IS NOT NULL')
      .andWhere('driver.longitude IS NOT NULL')
      .andWhere(`${distanceSQL} <= :radius`, {
        radius: params.radius,
      })
      .orderBy(distanceSQL, 'ASC')
      .limit(params.limit)
      .getMany();

    return drivers.map(driver => ({
      id: driver.id,
      firstName: driver.firstName,
      lastName: driver.lastName,
      rating: driver.rating,
      totalRides: driver.totalRides,
      latitude: driver.latitude,
      longitude: driver.longitude,
      distance: calculateDistance(
        params.lat,
        params.lon,
        driver.latitude,
        driver.longitude,
      ),
      vehicle: driver.vehicles?.[0], // Assuming first vehicle
    }));
  }

  /**
   * Estimate duration based on distance (simple implementation)
   */
  private estimateDuration(distanceInKm: number): number {
    // Average speed of 20 km/h
    const averageSpeedKmh = 20;
    const durationHours = distanceInKm / averageSpeedKmh;
    return Math.round(durationHours * 3600); // Convert to seconds
  }
}