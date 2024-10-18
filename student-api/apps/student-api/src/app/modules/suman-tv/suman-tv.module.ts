import { AuthModule } from '@application/auth';
import { SharedApiModule } from '@application/shared-api';
import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SumanTvController } from './suman-tv.controller';

@Module({
  imports: [
    CacheModule.register(),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [SumanTvController]
})
export class SumanTvModule {}
