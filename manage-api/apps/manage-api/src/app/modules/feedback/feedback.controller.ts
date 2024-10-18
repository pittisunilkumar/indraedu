import { FeedbackService } from '@application/shared-api';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';

@Controller('feedback')
export class FeedbackController {
    constructor(
        private feedbackService: FeedbackService,
    ) { }


    @Post()
    async createFeedback(@Body() request) {
        return this.feedbackService.createFeedback(request);
    }

    @Get()
    async getFeedbacks() {
        return this.feedbackService.getFeedbacks();
    }

    @Get('active')
    async getActiveFeedbacks() {
        return this.feedbackService.getActiveFeedbacks();
    }

    @Get(':uuid')
    findFeedback(
        @Param('uuid')
        uuid: string
    ) {
        return this.feedbackService.findFeedback(uuid);
    }

    @Delete(':id')
    deleteFeedback(
        @Param('id')
        id: string
    ) {
        return this.feedbackService.deleteFeedback(id);
    }

    @Put()
    updateFeedback(
        @Body() reqest
    ) {
        return this.feedbackService.updateFeedback(reqest);
    }


}
