import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { WebSocketGateway } from './websocket.gateway';
import { Driver } from '../../database/entities/driver.entity';
import { DriverLocation } from '../../database/entities/driver-location.entity';
import { Ride } from '../../database/entities/ride.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Driver, DriverLocation, Ride]),
    JwtModule,
    ConfigModule,
  ],
  providers: [WebSocketGateway],
  exports: [WebSocketGateway],
})
export class WebSocketModule {}

