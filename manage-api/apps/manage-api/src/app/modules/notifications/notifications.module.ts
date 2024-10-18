import { AuthModule } from '@application/auth';
import { SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   {
    //     name: 'Notifications',
    //     schema: NotificationsSchema,
    //   },
    // ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
