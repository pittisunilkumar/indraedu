import { TestInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTestDTO } from '../../dto';
import { Course, Test, TSCategories } from '../../schema';

@Injectable()
export class TestsService {

  constructor(
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Test') private testModel: Model<Test>,
    @InjectModel('TSCategories') private TSCategoriesModel: Model<TSCategories>
  ) {}

  async findAll(): Promise<Test[]> {
    return this.testModel
      .find()
      .populate('courses')
      .populate('categories')
      .populate('syllabus')
      .exec();
  }

  async findByUuid(uuid: string): Promise<Test> {
    return this.testModel.findOne({ uuid })
    .populate('courses')
    .populate('categories')
    .populate('syllabus')
    .exec();
  }

  async findByCourse(courseId: string): Promise<any> {

    return this.testModel
    .find({ courses: courseId }, { id: 1, uuid: 1, title: 1, catregories: 1 })
    .populate({
      path: 'categories',
      select: '_id uuid title'
    })
    .exec();
    

  }

  async deleteByUuid(uuid: string) {

    const test = await this.testModel.findOne({ uuid });

    return this.testModel.findOneAndDelete({ uuid }).exec().then(
      (res) => {
        console.log({ test });

        return test.categories.map(it => {
          return this.TSCategoriesModel
          .findOneAndUpdate(
            { _id: it },
            {
              $pull: { "tests": uuid },
              $inc : { 'count' : -1 },
            },
          )
          .exec().then(
            (result) => {
              return res;
            }
          )
        })
      }
    )

  }

  async create(createTestDTO: CreateTestDTO): Promise<any> {
    const createdTest = new this.testModel(createTestDTO);
    return createdTest.save().then(
      (res) => {
        return createdTest.categories.map(it => {
          return this.TSCategoriesModel
          .findOneAndUpdate(
            { _id: it },
            {
              $push: { "tests": res._id },
              $inc : { 'count' : 1, 'userCompletedCount': 0 },
            },
          )
          .exec().then(
            (result) => {
              return res;
            }
          )
        })
      }
    )
  }

  async editByUuid(request: TestInterface): Promise<Test> {
    const result = this.testModel.findOneAndUpdate(
      { uuid: request.uuid },
      request
    ).exec();
    // result.then(TestSeries => {
    //   this.updateAssignments(TestSeries);
    // })

    return result;
  }

}
