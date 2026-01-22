import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletAccount } from '../../database/entities/wallet-account.entity';
import { WalletTransaction } from '../../database/entities/wallet-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletAccount, WalletTransaction])],
  controllers: [],
  providers: [],
  exports: [],
})
export class WalletModule {}

