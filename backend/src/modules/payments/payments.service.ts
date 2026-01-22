import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripPayment } from '../../database/entities/trip-payment.entity';
import { Ride } from '../../database/entities/ride.entity';
import { User } from '../../database/entities/user.entity';
import { TransactionStatus } from '../../database/entities/wallet-transaction.entity';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(TripPayment)
    private paymentRepository: Repository<TripPayment>,
    @InjectRepository(Ride)
    private rideRepository: Repository<Ride>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationService: NotificationService,
  ) {}

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string, userId: string): Promise<TripPayment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['ride', 'ride.user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify user has access to this payment
    if (payment.ride?.userId !== userId) {
      throw new Error('Unauthorized access to payment');
    }

    return payment;
  }

  /**
   * Get payments for user
   */
  async getPaymentsForUser(userId: string): Promise<TripPayment[]> {
    return await this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoinAndSelect('payment.ride', 'ride')
      .where('ride.userId = :userId', { userId })
      .orderBy('payment.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Get payment by ride ID
   */
  async getPaymentByRideId(rideId: string): Promise<TripPayment> {
    return await this.paymentRepository.findOne({
      where: { rideId },
      relations: ['ride'],
    });
  }

  /**
   * Process a payment
   */
  async processPayment(
    paymentId: string,
    userId: string,
    paymentMethod?: string,
    token?: string,
  ): Promise<TripPayment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['ride', 'ride.user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify user owns the ride associated with this payment
    if (payment.ride?.userId !== userId) {
      throw new Error('Unauthorized to process this payment');
    }

    if (payment.status !== TransactionStatus.PENDING) {
      throw new Error('Payment is not pending');
    }

    try {
      // Simulate payment processing (would integrate with payment gateway in real app)
      const isPaymentSuccessful = await this.simulatePaymentProcessing(
        payment.amount,
        paymentMethod,
        token,
      );

      if (isPaymentSuccessful) {
        payment.status = TransactionStatus.COMPLETED;
        payment.paidAt = new Date();
        payment.transactionId = this.generateTransactionId();
      } else {
        payment.status = TransactionStatus.FAILED;
        payment.failureReason = 'Payment processing failed';
      }

      return await this.paymentRepository.save(payment);
    } catch (error) {
      this.logger.error(`Error processing payment: ${error.message}`, error.stack);
      
      // Mark payment as failed
      payment.status = TransactionStatus.FAILED;
      payment.failureReason = error.message;
      await this.paymentRepository.save(payment);
      
      throw error;
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(
    paymentId: string,
    reason?: string,
  ): Promise<TripPayment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== TransactionStatus.COMPLETED) {
      throw new Error('Can only refund completed payments');
    }

    // In a real app, this would integrate with the payment gateway to process refunds
    // For now, we'll mark as cancelled and create a separate refund transaction
    payment.status = TransactionStatus.CANCELLED;
    payment.failureReason = `Refunded: ${reason || 'No reason provided'}`;
    
    return await this.paymentRepository.save(payment);
  }

  /**
   * Create payment for a ride
   */
  async createPaymentForRide(rideId: string, amount: number): Promise<TripPayment> {
    // Verify ride exists and is completed
    const ride = await this.rideRepository.findOne({
      where: { id: rideId },
    });

    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    if (ride.status !== 'completed') {
      throw new Error('Can only create payment for completed rides');
    }

    // Create payment record
    const payment = new TripPayment();
    payment.rideId = rideId;
    payment.amount = amount;
    payment.status = TransactionStatus.PENDING;

    return await this.paymentRepository.save(payment);
  }

  /**
   * Simulate payment processing (in real app, integrate with payment gateway)
   */
  private async simulatePaymentProcessing(
    amount: number,
    paymentMethod?: string,
    token?: string,
  ): Promise<boolean> {
    // In a real implementation, this would call external payment gateways like Stripe, PayPal, etc.
    // For now, we'll simulate successful payment processing
    
    this.logger.log(`Processing payment of $${amount} via ${paymentMethod || 'unknown method'}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, always return success
    // In real app, check actual payment gateway response
    return true;
  }

  /**
   * Generate a transaction ID
   */
  private generateTransactionId(): string {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}