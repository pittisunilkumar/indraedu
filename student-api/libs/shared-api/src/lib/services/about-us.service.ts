import { AboutInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AboutUs } from '../schema/about-us.schema';

@Injectable()
export class AboutUsService {

  constructor(
    @InjectModel('AboutUs') private aboutUsModel: Model<AboutUs>
  ) {}

  async createAboutUsPage(payload: AboutInterface): Promise<AboutUs> {
    const result = new this.aboutUsModel(payload);
    console.log({ result });

    return result.save();
  }

  async updateAboutUsPage(
    request: AboutInterface
  ): Promise<AboutUs> {
    return this.aboutUsModel.findOneAndUpdate({ uuid: request.uuid }, request).exec();
  }

  async getAboutUs(): Promise<AboutUs[]> {
    return this.aboutUsModel.find().exec();
  }



}
