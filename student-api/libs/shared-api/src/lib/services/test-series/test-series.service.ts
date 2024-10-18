import { TestInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTestDTO } from '../../dto';
import { Course, Test, TSCategories,Question } from '../../schema';

@Injectable()
export class TestSeriesService {

  constructor(
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Test') private testModel: Model<Test>,
    @InjectModel('TSCategories') private TSCategoriesModel: Model<TSCategories>,
    @InjectModel('Question') private questionModel: Model<Question>
  ) {}


  async getTestSeriesQuestions(request:any){
    var data = request.subjectIds;
    console.log(data)
      return this.questionModel.find({ syllabus:
        { $in :data},
        'flags.active' : true,
        "flags.testSeries": true,
     },
      ).exec();
    }
}
