import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '../../database/entities/user.entity';

import { WalletAccount } from '../../database/entities/wallet-account.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  
    @InjectRepository(WalletAccount)
    private walletAccountRepository: Repository<WalletAccount>,
    private jwtService: JwtService,
  ) {}

  /**
   * Register new user (rider)
   */
  async registerUser(
    phoneNumber: string,
    password: string,
    firstName: string,
    lastName: string,
    email?: string,
  ) {
    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { phoneNumber },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user
    const user = this.userRepository.create({
      phoneNumber,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      phoneVerificationCode: verificationCode,
      phoneVerificationExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      status: UserStatus.PENDING_VERIFICATION,
    });

    await this.userRepository.save(user);

    // Create wallet account
    const wallet = this.walletAccountRepository.create({
      userId: user.id,
      balance: 0,
      currency: 'ETB',
    });
    await this.walletAccountRepository.save(wallet);

    // TODO: Send SMS with verification code

    return {
      userId: user.id,
      phoneNumber: user.phoneNumber,
      message: 'Verification code sent to your phone',
    };
  }

  /**
   * Verify phone number
   */
  async verifyPhone(userId: string, code: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.phoneVerificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    if (new Date() > user.phoneVerificationExpires) {
      throw new BadRequestException('Verification code expired');
    }

    user.isPhoneVerified = true;
    user.status = UserStatus.ACTIVE;
    user.phoneVerificationCode = null;
    user.phoneVerificationExpires = null;

    await this.userRepository.save(user);

    // Generate JWT token
    const token = this.generateToken(user.id, 'user');

    return {
      token,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  /**
   * Login user
   */
  async loginUser(phoneNumber: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isPhoneVerified) {
      throw new UnauthorizedException('Phone number not verified');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, 'user');

    return {
      token,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }





  /**
   * Generate JWT token
   */
  private generateToken(id: string, type: 'user'): string {
    return this.jwtService.sign({ sub: id, type });
  }

  /**
   * Validate user by ID
   */
  async validateUser(userId: string): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }


}

