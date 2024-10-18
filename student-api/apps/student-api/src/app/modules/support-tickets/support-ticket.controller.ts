import { AuthService, JwtAuthGuard } from '@application/auth';
import { SupportTicketService, MobileFeedbackService, FeedbackListDto, DepartmentListDto, OpenNewTicketDto, AWSS3Service} from '@application/shared-api';
import { Request, Body, Controller, Get, Param, Post, Put, UseGuards, Req, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor,AnyFilesInterceptor} from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Support Tickets')
// @ApiBearerAuth('access-token')

@Controller('support-ticket')
export class SupportTicketController {
  constructor(
    private supportTicket: SupportTicketService,
    private feedbackService: MobileFeedbackService,
    private awsS3: AWSS3Service,
  ) { }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['Support Tickets'], summary: 'Department List List' })
  @ApiResponse({ status: 201, type:  DepartmentListDto})
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.....' })
  @Post('department-list')
  async departmentList(@Request() request, @Body() body: any) {
    var events = await this.supportTicket.findAll(request);
        return {
          "status": true,
          "code": 2000,
          "message": "Departments Fetched",
          'data': events
        }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['Support Tickets'], summary: 'Department List List' })
  @ApiResponse({ status: 201, type:  DepartmentListDto})
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.....' })
  @Post('ticket-list')
  async ticketList(@Request() request, @Body() body: any) {
    var events = await this.supportTicket.ticketList(request);
        return {
          "status": true,
          "code": 2000,
          "message": "Tickets Fetched",
          'data': events
        }
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201})
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.....' })
  @ApiBody({ type: OpenNewTicketDto })
  @UseInterceptors( AnyFilesInterceptor())
  @Post('open-new-ticket')
  async openNewTicket(@UploadedFiles() files , @Request() request, @Body() payload : OpenNewTicketDto) {

    // console.log(files)
    var image_url = [];
    var audio = [];
    if(files){
      await this.awsS3.uploadFileTicket(files, request).then((result) => {
        result.forEach(element => {
            var output = element.Key.split(/[. ]+/).pop();
            if(output == "mp3" || output == "m4a" || output == "wav"){
              audio.push(element?.Location);
            }else{
              image_url.push(element?.Location);
            }
        });
        // console.log(result, image_url, audio);
      });
    }
    var data=  await this.supportTicket.createNewTicket(request, payload, image_url, audio);

    return {
      "status": data.status,
      "code": data.code,
      "message": data.message,
      'data': data.data
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['Feedback'], summary: 'Feedback List List' })
  @ApiResponse({ status: 201, type:  FeedbackListDto})
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.....' })
  @Post('feedback-list')
  async feedbackList(@Request() request, @Body() body: any) {
    var events = await this.feedbackService.findAll(request);
        return {
          "status": true,
          "code": 2000,
          "message": "Feedbacks Fetched",
          'data': events
        }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['Feedback'], summary: 'Feedback List List' })
  @ApiResponse({ status: 201, type:  FeedbackListDto})
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.....' })
  @Post('add-feedback')
  async addFeedback(@Request() request, @Body() body: any) {
    var events = await this.feedbackService.addFeedback(request, body);
        return {
          "status": events.status,
          "code": events.code,
          "message": events.message,
          'data': events.data
        }
  }
}