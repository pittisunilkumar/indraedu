import { CourseInterface } from '@application/api-interfaces';
import { Organization } from '@application/shared-api';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Organization } from '../organization.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel('Organization') private organizationModel: Model<Organization>
  ) {}

  async addCourseByOrgUuid(
    uuid: string,
    request: CourseInterface
  ): Promise<Organization> {
    return this.organizationModel
      .findOneAndUpdate({ uuid }, { $push: { courses: request } })
      .exec();
  }

  async deleteCourseByUuid(
    uuid: string,
    courseUuid: string
  ): Promise<Organization> {
    return;
    // return this.organizationModel
    //   .update({}, { $pull: { courses: { uuid: courseUuid } } })
    //   .exec();
  }

  async editCourseByUuid(
    uuid: string,
    courseUuid: string,
    request: CourseInterface
  ): Promise<Organization> {
    return
    // return this.organizationModel
    //   .update({ uuid }, (err, cou) => {
    //     console.log({ cou });
    //   })
    //   .exec();
  }
}
