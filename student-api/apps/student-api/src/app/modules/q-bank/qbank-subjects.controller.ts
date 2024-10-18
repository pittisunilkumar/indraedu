import type { QBankInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import { ApiResponseInterface, CreateQBankSubjectDto, MobileQbankSubjectService, OwnPaper, QBankSubject } from '@application/shared-api';
import { Request, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('qbank')
export class QBankSubjectController {

  constructor(private qbankService: MobileQbankSubjectService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createQBank(@Body() createQBankSubjectDTO: CreateQBankSubjectDto) {
    return this.qbankService.create(createQBankSubjectDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<QBankSubject[]> {
    return this.qbankService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch QBanks by Course Id' })
  @ApiResponse({
    status: 200,
    description: 'QBanks Fetched Successfully',
    type: [QBankSubject],
  })

  @UseGuards(JwtAuthGuard)
  @Get('subjects/byCourseId/:id')
  async findByCourse(@Request() req, @Param('id') courseId: string): Promise<any> {
    return this.qbankService.findByCourse(req, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('subjects/byCourseId')
  async findByCourseId(@Request() req, @Body() request): Promise<ApiResponseInterface> {
    try {
      if (request.courseId) {
        var data = await this.qbankService.findByCourse(req, request.courseId);
        // return { "status": true, "code": 2000, 'message': 'Subjects Fetched', 'data': data }
        return {
          "status": data.status,
          "code": data.code,
          "message": data.message,
          'data': data.data
        }

      } else {
        return { "status": false, "code": 2001, 'message': 'Course Id Required', 'data': [] }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-subject-by-uuid')
  async getsubjectByuuid(@Request() req, @Body() request): Promise<ApiResponseInterface> {
    try {
      if (request.qbank_subject_id) {
        var data = await this.qbankService.findByUuid(request.qbank_subject_id, request.qbank_subject_uuid, req.user);
        return { "status": true, "code": 2000, 'message': 'Subject Details Fetched', 'data': data }

      } else {
        return { "status": false, "code": 2001, 'message': 'Subject Id Required', 'data': {} }

      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('subjects/:uuid/chapters')
  findChaptersBySubjectUuid(
    @Param('uuid')
    uuid: string,
    @Query() query
  ) {
    return this.qbankService.findSubjectChaptersByUuid(uuid, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('topics')
  async findOne(
    @Request() req, @Body() body
  ) {
    try {
      if (body.topicUuid) {
        var data = await this.qbankService.findTopicsByUuid(req, body);
        return { "status": true, "code": 2000, 'message': 'Topic Fetched', 'data': data }
      } else {
        return { "status": false, "code": 2001, 'message': 'Topic Id Required', 'data': {} }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-questions-by-topic')
  async getQuestions(
    @Request() req, @Body() body
  ) {
    try {
      if (body.topicUuid) {
        if (body.qbankUuid) {
          var data = await this.qbankService.findQbQuestions(req, body);
          return { "status": true, "code": 2000, 'message': 'Questions  Fetched', 'data': data }
        } else {
          return { "status": false, "code": 2001, 'message': 'Topic Id Required', 'data': {} }
        }
      } else {
        return { "status": false, "code": 2001, 'message': 'Topic Id Required', 'data': {} }

      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  // to get questions for re attempt
  @UseGuards(JwtAuthGuard)
  @Post('get-questions-re-attempt')
  async findQbQuestionsReAttempt(
    @Request() req, @Body() body
  ) {
    try {
      if (body.topicUuid) {
        if (body.qbankUuid) {
          var data = await this.qbankService.findQbQuestionsReAttempt(req, body);
          return { "status": true, "code": 2000, 'message': 'Questions  Fetched', 'data': data }
        } else {
          return { "status": false, "code": 2001, 'message': 'Topic Id Required', 'data': {} }
        }
      } else {
        return { "status": false, "code": 2001, 'message': 'Topic Id Required', 'data': {} }

      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-question-by-id')
  async getSingleQuestions(
    @Request() req, @Body() body
  ) {
    try {
      if (body.questionId) {
        var data = await this.qbankService.findQuestionByUuid(req, body);
        return { "status": true, "code": 2000, 'message': 'Question Fetched', 'data': data }
      } else {
        return { "status": false, "code": 2001, 'message': 'Question Id Required', 'data': {} }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('subjects/:uuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string
  ) {
    return this.qbankService.deleteByUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Put('subjects/:uuid')
  editByUuid(
    @Param('uuid')
    uuid: string,
    @Body() test: QBankInterface
  ) {
    return this.qbankService.editByUuid(test);
  }


  

  @UseGuards(JwtAuthGuard)
  @Post('subjects/courseSubjectsAndChaptersList')
  async getsubjectByCouseuuid(@Request() req, @Body() body) {
    try {
      if (body.courseId) {
        var data = await this.qbankService.getsubjectByCouseuuid(body, req);
        return { "status": true, "code": 2000, 'message': 'Subject Details Fetched', 'data': data }

      } else {
        return { "status": false, "code": 2001, 'message': 'Subject Id Required', 'data': [] }

      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-ebooks')
  async getEbooksCouseId(@Request() req, @Body() body) {
    try {
      if (body.courseId) {
        var data = await this.qbankService.getEbooksCouseId(req, body.courseId);;
        return { "status": true, "code": 2000, 'message': 'Subject Details Fetched', 'data': data }

      } else {
        return { "status": false, "code": 2001, 'message': 'CourseId Id Required', 'data': [] }

      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }


  @UseGuards(JwtAuthGuard)
  @Post('tagsListByChapters')
  async tagsListByChapters(@Body() body: any) {
    try {
      if (body.subjectUuids.length && body.chapterUuids.length) {
        var data = await this.qbankService.topicsByChapters(body.subjectUuids, body.chapterUuids);
        return { "status": true, "code": 2000, 'message': 'Tags Details Fetched', 'data': data }
      } else {
        return { "status": false, "code": 2001, 'message': 'Subject and Chapter uuid Required', 'data': {} }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('customModuleQuestions')
  async customModuleQuestions(@Request() req, @Body() body: any) {
    try {
      if (body.subjectUuids.length && body.chapterUuids.length) {
        var data = await this.qbankService.customModuleQuestions(req, body);
        return { "status": data.status, "code": data.code, 'message': data.message, 'data': data.data }
      }
      else {
        return { "status": false, "code": 2001, 'message': 'Subject and Chapter uuid Required', 'data': {} }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @Post('customModuleQuestionsSubmit')
  async customModuleQuestionsSubmit(@Request() req, @Body() body: any) {
    try {
      if (body) {
        var data = await this.qbankService.customModuleQuestionsSubmit(req, body);
        return { "status": true, "code": 2000, 'message': 'Custom module submited succesfully', 'data': data }
      }
      else {
        return { "status": false, "code": 2001, 'message': 'Exam Id Required', 'data': {} }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }


}
