import { JwtAuthGuard } from '@application/auth';
import {
  SubmitTestServiceV1,
  SubmitUserTestDTO,
} from '@application/shared-api';
import {
  Request,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Test Series')
@Controller('ts/tests/v1')
export class TestsControllerV1 {
  constructor(
    private submitTestService: SubmitTestServiceV1  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('submit')
  async submitUserTestV1(
    @Request() req,
    @Body() submitTestDTO: SubmitUserTestDTO
  ) {
    try{
      var data = await this.submitTestService.SubmittedTestV1(submitTestDTO, req);
      return { status: true, code: 2000, message: 'Test Submitted', data: data };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }
}
