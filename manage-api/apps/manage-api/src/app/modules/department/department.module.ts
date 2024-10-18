import { AuthModule } from '@application/auth';
import { SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';

@Module({
  imports: [SharedApiModule, AuthModule],
  controllers: [DepartmentController],
  providers: [],
})
export class ManageDepartmentModule {}
