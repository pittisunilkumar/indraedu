import { AuthModule } from '@application/auth';
import { BannerSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeController } from './home.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Banner',
        schema: BannerSchema,
      },
    ]),
    SharedApiModule,
    AuthModule
  ],
  controllers: [HomeController],
})
export class HomeModule {}
