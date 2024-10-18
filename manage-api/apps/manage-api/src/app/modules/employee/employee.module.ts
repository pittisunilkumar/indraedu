import { AuthModule } from '@application/auth';
import { SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';

@Module({
  imports: [SharedApiModule, AuthModule],
  controllers: [EmployeeController],
  providers: [],
})
export class ManageEmployeeModule {}
