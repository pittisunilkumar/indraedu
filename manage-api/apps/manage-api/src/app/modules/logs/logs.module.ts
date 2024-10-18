import { AuthModule } from '@application/auth';
import { LogsSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsController } from './logs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Logs',
        schema: LogsSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [LogsController],
})
export class LogsModule {}
