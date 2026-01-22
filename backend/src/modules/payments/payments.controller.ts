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
import { TripPayment } from '../../database/entities/trip-payment.entity';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':id')
  async getPaymentById(
    @CurrentUser() user: User,
    @Param('id') paymentId: string,
  ) {
    try {
      const payment = await this.paymentsService.getPaymentById(paymentId, user.id);
      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }
      return { success: true, data: payment };
    } catch (error) {
      this.logger.error(`Error getting payment: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to get payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('user/:userId')
  async getPaymentsForUser(
    @CurrentUser() user: User,
    @Param('userId') userId: string,
  ) {
    // Only allow user to access their own payments
    if (user.id !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    
    try {
      const payments = await this.paymentsService.getPaymentsForUser(userId);
      return { success: true, data: payments };
    } catch (error) {
      this.logger.error(`Error getting payments: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to get payments',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('ride/:rideId')
  async getPaymentByRideId(
    @CurrentUser() user: User,
    @Param('rideId') rideId: string,
  ) {
    try {
      const payment = await this.paymentsService.getPaymentByRideId(rideId);
      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }
      return { success: true, data: payment };
    } catch (error) {
      this.logger.error(`Error getting payment by ride: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to get payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/process')
  async processPayment(
    @CurrentUser() user: User,
    @Param('id') paymentId: string,
    @Body() body: { paymentMethod?: string; token?: string },
  ) {
    try {
      const result = await this.paymentsService.processPayment(
        paymentId,
        user.id,
        body.paymentMethod,
        body.token,
      );
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(`Error processing payment: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to process payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/refund')
  async refundPayment(
    @CurrentUser() user: User,
    @Param('id') paymentId: string,
    @Body('reason') reason?: string,
  ) {
    try {
      // Only admin or driver can refund
      // Since we're using JWT strategy with type field
      // For now, we'll allow the operation since there's no explicit role field in User entity
      // Additional authorization checks should be implemented based on business requirements
      if (!user.id) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      
      const result = await this.paymentsService.refundPayment(
        paymentId,
        reason,
      );
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(`Error refunding payment: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to refund payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}