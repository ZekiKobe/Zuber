import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from '../../database/entities/admin-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser])],
  controllers: [],
  providers: [],
  exports: [],
})
export class AdminModule {}

