import { QuestionInterface ,QbankQuestionInterface, TestSeriesQuestionInterface} from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import { CreateQuestionDto, Question, QuestionsService } from '@application/shared-api';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('questions')
export class QuestionsController {
  constructor(private questionService: QuestionsService) {}

  // @Get('paginate')
  // async backend(
  //     @Query('page') page,
  //     @Query('limit') limit,
  //     @Query('search') search,
  //     @Query('sort') sort
  //   ) {

  //     let options = {};
  //     if(!page){
  //       page = 1
  //     }
  //     if(!limit){
  //       limit = 10
  //     }
  //     if (search) {
  //         options = {
  //             $or: [
  //                 { title: new RegExp(search.toString(), 'i') },
  //                 { description: new RegExp(search.toString(), 'i') },
  //             ]
  //         }
  //     }
  //     const query = this.questionService.find(options);
  //     if (sort) {
  //         query.sort({
  //           createdOn: sort
  //         })
  //     }

  //     const pagee  : number = parseInt(page);
  //     const limitt : number = parseInt(limit);
  //     const total = await this.questionService.count(options);
  //     const data  = await query.skip((pagee - 1) * limitt).limit(limitt).exec();

  //     return {
  //         data,
  //         totalRecords : total,
  //         currentPage : pagee,
  //         last_page: Math.ceil(total / limit),
  //         search:search,
  //         sort:sort,
  //     };
  // }

  // @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createQuestionDto: any) {

    return this.questionService.create(createQuestionDto);

  }
  @Post('insertMany/questions')
  async createMultiQuestions(@Body() questiondata:any) {
    return this.questionService.createMultiQuestions(questiondata);
  }
  // @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Question[]> {
    return this.questionService.findAll();
  }

  @Post('updateShortTitle')
  async updateShortTitle(@Body() question:any) {
    return this.questionService.updateShortTitle(question);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('bySyllabusId/:syllabusId')
  findAllBySyllabusId(
    @Param('syllabusId')
    syllabusId: string
  ) {
    console.log(syllabusId)
    return this.questionService.findAllBySyllabusId(syllabusId);
  }
//   async findAllBySyllabusId(syllabusId): Promise<Question[]> {
// console.log(syllabusId)
//     return this.questionService.findAllBySyllabusId(syllabusId);
//   }

  //@UseGuards(JwtAuthGuard)
  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    return this.questionService.findByUuid(uuid);
  }

  // @UseGuards(JwtAuthGuard)
  // @Put('assignPeral/:id')
  // assignPeral(
  //   @Body() response: any
  // ) {
  //   return this.questionService.assignPeral(response);
  // }


  @UseGuards(JwtAuthGuard)
  @Put(':uuid')
  editByUuid(
    @Body() question: QuestionInterface
  ) {
    return this.questionService.editByUuid(question);
  }

  @UseGuards(JwtAuthGuard)
  @Put('bulk/:uuid')
  editQuestionByJsonFile(
    @Body() question: QuestionInterface
  ) {
    return this.questionService.editQuestionByJsonFile(question);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string
  ) {
    return this.questionService.deleteByUuid(uuid);
  }

  @Post('qbankAddQuestions')
  qbankAddQuestions(
    // @Param('uuid')
    // uuid: string,
    @Body() qbankaddquestions: QbankQuestionInterface
  ) {
    return this.questionService.qbankAddQuestions(qbankaddquestions);
  }

  @Post('bulk/qbankQuestions')
  qbankBulkAddQuestions(
    // @Param('uuid')
    // uuid: string,
    @Body() qbankaddquestions: any
  ) {
    return this.questionService.qbankBulkAddQuestions(qbankaddquestions);
  }

  
  @Post('bulk/testQuestions')
  testBulkAddQuestions(
    // @Param('uuid')
    // uuid: string,
    @Body() tsaddquestions: any
  ) {
    return this.questionService.testBulkAddQuestions(tsaddquestions);
  }

  @Post('testSeriesAddQuestions')
  testSeriesAddQuestions(
    @Body() tsaddquestions: TestSeriesQuestionInterface
  ) {
    return this.questionService.testSeriesAddQuestions(tsaddquestions);
  }
  
  @Post('checkQuestionBeforeAdd')
  async checkQuestionBeforeAdd(@Body() request: any) {
   // console.log("adfgvvhgv",request);
    return this.questionService.checkQuestionBeforeAdd(request);
  }

  @Post('questionSearch')
  async search(@Body() request: any) {
    return this.questionService.questionSearch(request);
  }
  


  
  

  
}
