import { Injectable } from '@nestjs/common';
import {TagsInterface } from '@application/api-interfaces'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagsDTO } from '../dto/create-tags.dto';
import { Tags } from '../schema/tags.schema';

@Injectable()
export class TagsService {
  constructor(@InjectModel('Tags') private tagsModel: Model<Tags>) { }

  async create(createTagsDTO: CreateTagsDTO): Promise<Tags> {
    const createdBanner = new this.tagsModel(createTagsDTO);
    const result = createdBanner.save();
    console.log('added tag', result);
    return result;
  }

  async findAll(): Promise<Tags[]> {
    return this.tagsModel.find().exec();
  }

  async findByUuid(uuid: string): Promise<Tags> {
    return this.tagsModel.findOne({ uuid }, {
      _id: 1, uuid: 1, title: 1, flags: 1
    }).exec();
    
  }

  async deleteByUuid(uuid: string) {
    return this.tagsModel.findOneAndDelete({ uuid }).exec();
  }

  async editTagByUuid(
    uuid: string,
    request: TagsInterface
  ): Promise<Tags> {
     this.tagsModel.findOneAndUpdate({ uuid }, request).exec();
     return this.tagsModel.findOne({ uuid }, {}).exec();
  }

  async getActiveTags() {

    return this.tagsModel.find(  { flags: { active: true } },{_id: 1, uuid: 1, title: 1} ).exec();

     
  }

}