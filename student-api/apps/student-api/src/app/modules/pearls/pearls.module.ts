import { AuthModule } from '@application/auth';
import { SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { PearlsController } from './pearls.controller';

@Module({
  imports: [SharedApiModule, AuthModule],
  providers: [],
  controllers: [PearlsController]
})
export class PearlsModule {}
