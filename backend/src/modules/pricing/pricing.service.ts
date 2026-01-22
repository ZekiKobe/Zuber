import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { RideType } from '../../database/entities/ride-type.entity';
import { PricingRule } from '../../database/entities/pricing-rule.entity';
import { Ride, RideStatus } from '../../database/entities/ride.entity';

export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeMultiplier: number;
  surgeAmount: number;
  discountAmount: number;
  subtotal: number;
  totalFare: number;
  currency: string;
}

@Injectable()
export class PricingService {
  private readonly logger = new Logger(PricingService.name);
  private readonly platformCommission: number;

  constructor(
    @InjectRepository(RideType)
    private rideTypeRepository: Repository<RideType>,
    @InjectRepository(PricingRule)
    private pricingRuleRepository: Repository<PricingRule>,
    @InjectRepository(Ride)
    private rideRepository: Repository<Ride>,
    private configService: ConfigService,
  ) {
    this.platformCommission = parseFloat(
      this.configService.get('PLATFORM_COMMISSION_PERCENTAGE', '20'),
    );
  }

  /**
   * Calculate estimated fare for a ride
   */
  async calculateEstimatedFare(
    rideTypeId: string,
    distanceKm: number,
    durationMinutes: number,
    pickupLat: number,
    pickupLon: number,
    dropoffLat: number,
    dropoffLon: number,
  ): Promise<FareBreakdown> {
    const rideType = await this.rideTypeRepository.findOne({
      where: { id: rideTypeId },
    });

    if (!rideType) {
      throw new Error('Ride type not found');
    }

    // Calculate base components
    const baseFare = parseFloat(rideType.baseFare.toString());
    const distanceFare = distanceKm * parseFloat(rideType.perKmRate.toString());
    const timeFare =
      durationMinutes * parseFloat(rideType.perMinuteRate.toString());

    // Calculate surge multiplier
    const surgeMultiplier = await this.calculateSurgeMultiplier(
      pickupLat,
      pickupLon,
      rideTypeId,
    );

    // Calculate subtotal
    const subtotal = baseFare + distanceFare + timeFare;
    const surgeAmount = subtotal * (surgeMultiplier - 1);
    const totalFare = Math.max(
      subtotal * surgeMultiplier,
      parseFloat(rideType.minimumFare.toString()),
    );

    return {
      baseFare,
      distanceFare,
      timeFare,
      surgeMultiplier,
      surgeAmount,
      discountAmount: 0,
      subtotal,
      totalFare: Math.round(totalFare * 100) / 100, // Round to 2 decimals
      currency: 'ETB',
    };
  }

  /**
   * Calculate actual fare after trip completion
   */
  async calculateActualFare(
    rideId: string,
    actualDistanceKm: number,
    actualDurationMinutes: number,
  ): Promise<FareBreakdown> {
    const ride = await this.rideRepository.findOne({
      where: { id: rideId },
      relations: ['rideType'],
    });

    if (!ride) {
      throw new Error('Ride not found');
    }

    const rideType = ride.rideType;

    // Calculate base components
    const baseFare = parseFloat(rideType.baseFare.toString());
    const distanceFare =
      actualDistanceKm * parseFloat(rideType.perKmRate.toString());
    const timeFare =
      actualDurationMinutes * parseFloat(rideType.perMinuteRate.toString());

    // Use surge multiplier from ride
    const surgeMultiplier = parseFloat(ride.surgeMultiplier?.toString() || '1');

    // Calculate subtotal
    const subtotal = baseFare + distanceFare + timeFare;
    const surgeAmount = subtotal * (surgeMultiplier - 1);
    const totalFare = Math.max(
      subtotal * surgeMultiplier,
      parseFloat(rideType.minimumFare.toString()),
    );

    // Apply discount if promo code was used
    const discountAmount = parseFloat(ride.discountAmount?.toString() || '0');
    const finalFare = Math.max(0, totalFare - discountAmount);

    return {
      baseFare,
      distanceFare,
      timeFare,
      surgeMultiplier,
      surgeAmount,
      discountAmount,
      subtotal,
      totalFare: Math.round(finalFare * 100) / 100,
      currency: 'ETB',
    };
  }

  /**
   * Calculate surge multiplier based on demand
   */
  async calculateSurgeMultiplier(
    lat: number,
    lon: number,
    rideTypeId: string,
  ): Promise<number> {
    try {
      // Get active ride requests in the area
      const activeRequests = await this.rideRepository.count({
        where: {
          rideTypeId,
          status: RideStatus.REQUESTED,
          // Within 2km radius (simplified - should use PostGIS)
        },
      });

      // Get available drivers for this ride type
      // This would require joining with drivers and vehicles
      // For now, use a simplified calculation

      // Base surge calculation
      // If many requests and few drivers, increase surge
      const baseSurge = 1.0;
      let surgeMultiplier = baseSurge;

      // Check for time-based surge rules
      const now = new Date();
      const hour = now.getHours();
      const dayOfWeek = now.getDay();

      const timeBasedRules = await this.pricingRuleRepository.find({
        where: {
          type: PricingRuleType.SURGE,
          isActive: true,
          rideTypeId: rideTypeId,
        },
      });

      for (const rule of timeBasedRules) {
        if (this.isRuleActive(rule, hour, dayOfWeek)) {
          surgeMultiplier = Math.max(
            surgeMultiplier,
            parseFloat(rule.multiplier.toString()),
          );
        }
      }

      // Demand-based surge (simplified)
      // In production, this would analyze real-time demand patterns
      if (activeRequests > 10) {
        surgeMultiplier = Math.min(surgeMultiplier * 1.5, 3.0); // Max 3x surge
      } else if (activeRequests > 5) {
        surgeMultiplier = Math.min(surgeMultiplier * 1.25, 2.0);
      }

      return Math.round(surgeMultiplier * 100) / 100; // Round to 2 decimals
    } catch (error) {
      this.logger.error(
        `Error calculating surge: ${error.message}`,
        error.stack,
      );
      return 1.0; // Default to no surge
    }
  }

  /**
   * Check if pricing rule is active for current time
   */
  private isRuleActive(
    rule: PricingRule,
    currentHour: number,
    currentDay: number,
  ): boolean {
    // Check day of week
    if (rule.daysOfWeek && !rule.daysOfWeek.includes(currentDay)) {
      return false;
    }

    // Check time range
    if (rule.startTime && rule.endTime) {
      const [startHour, startMin] = rule.startTime.split(':').map(Number);
      const [endHour, endMin] = rule.endTime.split(':').map(Number);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      const currentMinutes = currentHour * 60;

      if (startMinutes <= endMinutes) {
        // Same day range
        if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
          return false;
        }
      } else {
        // Overnight range
        if (currentMinutes < startMinutes && currentMinutes > endMinutes) {
          return false;
        }
      }
    }

    // Check validity dates
    if (rule.validFrom && new Date() < rule.validFrom) {
      return false;
    }
    if (rule.validUntil && new Date() > rule.validUntil) {
      return false;
    }

    return true;
  }

  /**
   * Calculate driver earnings (after commission)
   */
  calculateDriverEarnings(totalFare: number): number {
    const commission = (totalFare * this.platformCommission) / 100;
    return Math.round((totalFare - commission) * 100) / 100;
  }

  /**
   * Calculate platform commission
   */
  calculatePlatformCommission(totalFare: number): number {
    return Math.round(
      (totalFare * this.platformCommission) / 100 * 100,
    ) / 100;
  }
}

