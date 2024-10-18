import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { CreatelogsDto } from '../dto/create-logs.dto';
import { Logs } from '../schema';
import { PearlSubjectInputInterface, PeralSubjectInterface } from '@application/api-interfaces';
import { ObjectId } from 'mongodb';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel('Logs') private LogsModel: Model<Logs>
  ) { }

  async addlogs(request: any) {
    const createdPearlSubjects = new this.LogsModel(request);
    const result = await createdPearlSubjects.save();
    return result;
  }
  
}