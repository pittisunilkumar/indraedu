import { AuthModule } from '@application/auth';
import { SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { SupportTicketController } from './support-ticket.controller';

@Module({
  imports: [SharedApiModule, AuthModule],
  providers: [],
  controllers: [SupportTicketController]
})
export class SupportTicketModule {}
