import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './create-question.dto';
import { Question } from './questions.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel('Question') private questionModel: Model<Question>
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const createdQuestion = new this.questionModel(createQuestionDto);
    const result = createdQuestion.save();
    console.log('create question', result);
    return result;
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }

  async findByUuid(uuid: string): Promise<Question> {
    return this.questionModel.findById(uuid).exec();
  }

  async deleteByUuid(uuid: string) {
    return this.questionModel.findOneAndDelete({ uuid }).exec();
  }
}
