import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from '../../database/entities/driver.entity';
import { DriverLocation } from '../../database/entities/driver-location.entity';
import { Ride, RideStatus } from '../../database/entities/ride.entity';

@WSGateway({
  cors: {
    origin: '*',
  },
  namespace: '/ws',
})
export class WebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebSocketGateway.name);
  private connectedDrivers = new Map<string, string>(); // socketId -> driverId
  private connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
    @InjectRepository(DriverLocation)
    private driverLocationRepository: Repository<DriverLocation>,
    @InjectRepository(Ride)
    private rideRepository: Repository<Ride>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
      
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const { sub: id, type } = payload;

      if (type === 'driver') {
        this.connectedDrivers.set(client.id, id);
        await this.driverRepository.update(id, { lastOnlineAt: new Date() });
        this.logger.log(`Driver ${id} connected (socket: ${client.id})`);
      } else if (type === 'user') {
        this.connectedUsers.set(client.id, id);
        this.logger.log(`User ${id} connected (socket: ${client.id})`);
      }

      client.join(`user:${id}`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const driverId = this.connectedDrivers.get(client.id);
    const userId = this.connectedUsers.get(client.id);

    if (driverId) {
      this.connectedDrivers.delete(client.id);
      this.logger.log(`Driver ${driverId} disconnected`);
    }

    if (userId) {
      this.connectedUsers.delete(client.id);
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  /**
   * Driver sends location update
   */
  @SubscribeMessage('driver:location')
  async handleDriverLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { lat: number; lon: number; heading?: number; speed?: number; accuracy?: number },
  ) {
    const driverId = this.connectedDrivers.get(client.id);
    if (!driverId) {
      return { error: 'Not authenticated as driver' };
    }

    try {
      // Update driver location
      await this.driverRepository.update(driverId, {
        latitude: data.lat,
        longitude: data.lon,
        heading: data.heading || null,
        // Location stored in latitude/longitude columns (MySQL compatible)
      });

      // Save location history (MySQL compatible - no PostGIS geo field)
      const location = this.driverLocationRepository.create({
        driverId: driverId,
        latitude: data.lat,
        longitude: data.lon,
        heading: data.heading || null,
        speed: data.speed || null,
        accuracy: data.accuracy || null,
      });
      await this.driverLocationRepository.save(location);

      // Broadcast to users tracking this driver (if on active ride)
      const activeRide = await this.rideRepository.findOne({
        where: {
          driverId,
          status: RideStatus.IN_PROGRESS,
        },
      });

      if (activeRide) {
        this.server.to(`user:${activeRide.userId}`).emit('driver:location', {
          driverId,
          lat: data.lat,
          lon: data.lon,
          heading: data.heading,
        });
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Error updating driver location: ${error.message}`);
      return { error: error.message };
    }
  }

  /**
   * User requests driver location
   */
  @SubscribeMessage('user:track-driver')
  async handleTrackDriver(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { rideId: string },
  ) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) {
      return { error: 'Not authenticated as user' };
    }

    const ride = await this.rideRepository.findOne({
      where: { id: data.rideId, userId },
      relations: ['driver'],
    });

    if (!ride || !ride.driverId) {
      return { error: 'Ride not found or no driver assigned' };
    }

    // Join room for this ride
    client.join(`ride:${data.rideId}`);

    // Send current driver location if available
    if (ride.driver.latitude && ride.driver.longitude) {
      client.emit('driver:location', {
        driverId: ride.driverId,
        lat: ride.driver.latitude,
        lon: ride.driver.longitude,
        heading: ride.driver.heading,
      });
    }

    return { success: true };
  }

  /**
   * Broadcast ride status update
   */
  broadcastRideUpdate(rideId: string, status: string, data?: any) {
    this.server.to(`ride:${rideId}`).emit('ride:update', {
      rideId,
      status,
      ...data,
    });
  }

  /**
   * Notify driver of new ride request
   */
  notifyDriver(driverId: string, rideData: any) {
    this.server.to(`user:${driverId}`).emit('ride:request', rideData);
  }
}

