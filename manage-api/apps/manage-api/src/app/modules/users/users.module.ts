import { AuthModule } from '@application/auth';
import { SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';

@Module({
  imports: [SharedApiModule, AuthModule],
  controllers: [UsersController],
  providers: [],
})
export class ManageUsersModule {}
