import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
// import { ThrottlerModule } from '@nestjs/throttler'; // Optional - install with: npm install @nestjs/throttler

// Config
import { databaseConfig } from './config/database.config';
import { redisConfig } from './config/redis.config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { RidesModule } from './modules/rides/rides.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { WebSocketModule } from './modules/websocket/websocket.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),

    // Redis & Bull Queue
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: redisConfig,
      inject: [ConfigService],
    }),

    // Rate Limiting
    // ThrottlerModule.forRoot([
    //   {
    //     ttl: 60000,
    //     limit: 100,
    //   },
    // ]),

    // Scheduler
    ScheduleModule.forRoot(),

    // Feature Modules
    AuthModule,
    UsersModule,
    DriversModule,
    RidesModule,
    PaymentsModule,
    WalletModule,
    NotificationsModule,
    AdminModule,
    DispatchModule,
    PricingModule,
    WebSocketModule,
  ],
})
export class AppModule {}

