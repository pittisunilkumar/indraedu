import { QuestionInterface, QbankQuestionInterface, TestSeriesQuestionInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionDto } from '../dto';
import { Question, QBankSubject, TSCategories } from '../schema';
//import { Question,QuestionDocument } from '../schema/questions.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel('Question') private questionModel: Model<Question>,
    @InjectModel('QBankSubject') private qbankSubjectModel: Model<QBankSubject>,
    @InjectModel('TSCategories') private TSCategoriesModel: Model<TSCategories>
  ) { }

  //   find(options) {
  //     return this.questionModel.find(options);
  // }
  // count(options) {
  //   return this.questionModel.countDocuments(options)
  // }

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {

    const createdQuestion = new this.questionModel(createQuestionDto);
    const result = createdQuestion.save();
    console.log('create question', result);

    return result;
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find()
      .populate({
        path: 'syllabus',
        match: {
          "type": "SUBJECT",
          // "flags.questionBank": true ,
          'flags.active': true
        },
        select: {
          "_id": 1,
          "uuid": 1,
          "title": 1,
          "type": 1,

        }
      }).exec();
    //.populate('syllabus').exec();
  }

  async findAllBySyllabusId(syllabusId: string): Promise<Question[]> {
    return this.questionModel.find({ syllabus: syllabusId }).
      populate({
        path: 'syllabus',
        match: {
          "type": "SUBJECT",
          "flags.questionBank": true,
          'flags.active': true
        },
        select: {
          "title": 1,
        }
      }).
      exec();
  }

  async findByUuid(uuid: string): Promise<Question> {
    return this.questionModel.findOne({ uuid })
      .populate({
        path: 'syllabus',
        match: {
          "type": "SUBJECT",
          // "flags.questionBank": true ,
          'flags.active': true
        },
        select: {
          "title": 1,
          "_id": 1,
          "uuid": 1
        }
      }).
      exec();
    // .populate('syllabus').exec();
  }

  async deleteByUuid(uuid: string) {
    return this.questionModel.findOneAndDelete({ uuid }).exec();
  }

  async editByUuid(request: QuestionInterface): Promise<Question> {
    return this.questionModel.findOneAndUpdate({ uuid: request.uuid }, request).exec();
  }

  async qbankAddQuestions(request: QbankQuestionInterface): Promise<any> {
    console.log('requestData', request);

    this.questionModel.insertMany(request.que);
    return this.qbankSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.qbank_subject

        },
        // filter and push to the object
        {
          $push: { "chapters.$[chelem].topics.$[telem].que": { $each: request.qbank_que } },

        },
        {
          arrayFilters: [{ "chelem.uuid": { $eq: request.qbank_chapter } },
          { "telem.uuid": { $eq: request.qbank_topic } }
          ]
        },

      )
      .exec();
    // return this.questionModel.findOneAndUpdate({ uuid: request.uuid }, request).exec();
  }

  async testSeriesAddQuestions(request: TestSeriesQuestionInterface): Promise<any> {
    this.questionModel.insertMany(request.que);
    return this.TSCategoriesModel
      .findOneAndUpdate(
        {
          uuid: request.ts_uuid
        },
        // filter and push to the object
        {
          $push: { "categories.tests.$[telem].que": { $each: request.test_que } },

        },
        {
          arrayFilters: [
            { "telem.uuid": { $eq: request.test } }
          ]
        },

      )
      .exec();
    // return this.questionModel.findOneAndUpdate({ uuid: request.uuid }, request).exec();
  }

  async checkQuestionBeforeAdd(request: any) {
    var que_obj = await this.questionModel.findOne({ "title": request.title }, { title: 1 }).exec();
    //console.log(que_obj);
    //return que_obj;
    if (que_obj)
      return true;
    else
      return false;
  }

}
