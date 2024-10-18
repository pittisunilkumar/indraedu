import { UserMessageInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserMessageDto } from '../dto';
import { UserMessage } from '../schema';

@Injectable()
export class UserMessagesService {

  constructor(@InjectModel('UserMessage') private userMsgModel: Model<UserMessage>) {}

  async createUserMessage(createUserMsgDto: CreateUserMessageDto): Promise<UserMessage> {

    const createdMsg = new this.userMsgModel(createUserMsgDto);

    return createdMsg.save();

  }

  async findAll(): Promise<UserMessage[]> {
    return this.userMsgModel
    .find()
    .exec();
  }

  async findByUuid(uuid: string): Promise<UserMessage> {
    return this.userMsgModel.findOne({ uuid }).exec();
  }

  async deleteByUuid(uuid: string) {
    return this.userMsgModel.findOneAndDelete({ uuid }).exec();
  }

  async editByUuid(
    uuid: string,
    request: UserMessageInterface
  ): Promise<UserMessage> {
    return this.userMsgModel.findOneAndUpdate({ uuid }, request).exec();
  }
}
