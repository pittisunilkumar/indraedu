import { BannerInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBannerDTO } from '../dto';
import { Banner } from '../schema/banner.schema';

@Injectable()
export class BannersService {
  constructor(@InjectModel('Banner') private bannersModel: Model<Banner>) { }

  async create(createBannersDTO: CreateBannerDTO): Promise<Banner> {
    const createdBanner = new this.bannersModel(createBannersDTO);
    const result = createdBanner.save();
    console.log('added banner', result);
    return result;
  }

  async findAll(): Promise<Banner[]> {
    return this.bannersModel.find().populate('courses').exec();
  }

  async findByUuid(uuid: string): Promise<Banner> {
    return this.bannersModel.findOne({ uuid })
      .populate({
        path: 'courses',

        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,
        }
      })
      .populate({
        path: 'subscriptions',

        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,
        }
      }).exec();
    //  .populate('courses').exec();
  }

  async deleteByUuid(uuid: string) {
    return this.bannersModel.findOneAndDelete({ uuid }).exec();
  }

  // async deleteBannersByUuid(uuid: string, bannerUuid: string): Promise<Banner> {
  //   return this.bannersModel
  //     .update({}, { $pull: { courses: { uuid: bannerUuid } } })
  //     .exec();
  // }

  async editBannerByUuid(
    uuid: string,
    request: BannerInterface
  ): Promise<Banner> {
    return this.bannersModel.findOneAndUpdate({ uuid }, request).exec();
  }
}
