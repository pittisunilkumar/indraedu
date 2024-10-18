import { AuthModule } from '@application/auth';
import { PearlsSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PearlsController } from './pearls.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Pearls',
        schema: PearlsSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [PearlsController],
})
export class PearlsModule {}
