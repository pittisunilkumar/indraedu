import { JwtAuthGuard } from '@application/auth';
import { UserMessagesService } from '@application/shared-api';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('portal/messages')
export class ContactUsController {

  constructor(
    private userMsg: UserMessagesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllMessages() {

    return this.userMsg.findAll();

  }

}
