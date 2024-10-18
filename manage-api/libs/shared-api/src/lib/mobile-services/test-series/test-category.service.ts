import { TestCategoryInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TSCategories, User } from '../../schema';

@Injectable()
export class MobileTestCategoryService {
  constructor(
    @InjectModel('TSCategories') private TSCategoriesModel: Model<TSCategories>,
    @InjectModel('User') private userModel: Model<User>
  ) {}

  async findAll(): Promise<TSCategories[]> {
    return this.TSCategoriesModel
      .find()
      .populate('courses')
      .exec();
  }

  async findAllByCourseId(courseId: string, query): Promise<TSCategories[]> {

    return this.userModel.findOne(
      { uuid: query.user },
    ).exec().then(
      (res: User) => {
        return this.TSCategoriesModel
        .find({ courses: courseId  }, { _id: 1, uuid: 1, title: 1, order: 1, schedulePdf: 1, userCompletedCount: 1, count: 1 })
        .exec().then(
          (result) => {
            result.map(it => {

              // res?.submissions.tests.map(test => {
              //   console.log(it.uuid, test.category.uuid, it.uuid === test.category.uuid);
              //   if(it.uuid === test.category.uuid) {
              //     ++it.userCompletedCount;
              //   }
              // })
            })

            return result;
          }
        )
      }
    )

  }

  async findByUuid(uuid: string): Promise<TSCategories> {
    return this.TSCategoriesModel
      .findOne({ uuid })
      .populate('courses')
      .exec();
  }

  async deleteByUuid(uuid: string) {

    // this.findCategoryByUuid(uuid).then(result => {
      // result.children.forEach(child => {
      //   if(child){
      //     this.TSCategoriesModel.findByIdAndUpdate(
      //       {_id: child},
      //       { $pull: { parents: result._id } }
      //     ).exec();
      //   }
      // });
      // result.parents.forEach(parent => {
      //   if(parent){
      //     this.TSCategoriesModel.findByIdAndUpdate(
      //       {_id: parent},
      //       { $pull: { children: result._id } }
      //     ).exec();
      //   }
      // });

    // });

    return this.TSCategoriesModel.findOneAndDelete({ uuid }).exec();

  }

  // async create(createTSCategoriesDTO: CreateTSCategoriesDTO): Promise<TSCategories> {
  //   const createdTSCategories = new this.TSCategoriesModel(createTSCategoriesDTO);
  //   const result = createdTSCategories.save();
  //   return result;
  // }

  // async editByUuid(request: TestCategoryInterface): Promise<TSCategories> {

  //   return this.TSCategoriesModel.findOneAndUpdate({ uuid: request.uuid }, request).exec();

  // }

}
