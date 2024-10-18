import { JwtAuthGuard } from '@application/auth';
import { CreateUserMessageDto, UserMessagesService } from '@application/shared-api';
import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';

@Controller('portal/messages')
export class ContactUsController {

  constructor(
    private userMsg: UserMessagesService,
  ) {}

  @Post()
  async userMessage(@Body() payload: CreateUserMessageDto) {

    return this.userMsg.createUserMessage(payload);

  }

}
