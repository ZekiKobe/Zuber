import { BullModuleOptions } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

export const redisConfig = (configService: ConfigService): BullModuleOptions => ({
  redis: {
    host: configService.get('REDIS_HOST', 'localhost'),
    port: configService.get('REDIS_PORT', 6379),
    password: configService.get('REDIS_PASSWORD'),
  },
});

