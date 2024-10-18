import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePearlsDto } from '../dto/create-pearls.dto';
import { Pearls } from '../schema';
import {PearlsInputInterface } from '@application/api-interfaces'; 

@Injectable()
export class PearlsService {
  constructor(@InjectModel('Pearls') private pearlsModel: Model<Pearls>) {}

  async create(createPearlsDTO: CreatePearlsDto): Promise<Pearls> {
    const createdPearls = new this.pearlsModel(createPearlsDTO);
    const result = createdPearls.save();
    console.log('added pearl', result);
    
    return result;
  }

  async findAll(): Promise<Pearls[]> {
    return this.pearlsModel.find().exec();
  }

  async findByUuid(uuid: string): Promise<Pearls> {
    return this.pearlsModel.findOne({ uuid }, {
      _id: 1, uuid: 1, subjectUuid :1, topicUuid : 1,  title: 1, queUuids: 1, imgUrl:1, explaination:1, flags: 1
    }).exec();
    
  }

  async editPearlsByUuid(
    uuid: string,
    request: any
  ): Promise<Pearls> {
     this.pearlsModel.findOneAndUpdate({ uuid }, request).exec();
     return this.pearlsModel.findOne({ uuid }, {}).exec();
  }

  async deleteByUuid(uuid: string) {
    return this.pearlsModel.findOneAndDelete({ uuid }).exec();
  }

}