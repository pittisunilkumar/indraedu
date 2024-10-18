import { Injectable } from '@nestjs/common';
import { RoleSubModuleInterface } from '@application/api-interfaces'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleSubModulesDTO } from '../dto/create-role-submodules.dto';
import { RoleSubModules } from '../schema/role-submodules.schema';

@Injectable()
export class RoleSubModulesService {
  constructor(@InjectModel('RoleSubModules') private roleSubModulesModel: Model<RoleSubModules>) { }

  async create(createRoleSubModulesDTO: CreateRoleSubModulesDTO): Promise<RoleSubModules> {
    const createdRecord = new this.roleSubModulesModel(createRoleSubModulesDTO);
    const result = createdRecord.save();
    console.log('added Record', result);
    return result;
  }

  async findAll(): Promise<RoleSubModules[]> {
    return this.roleSubModulesModel.find().sort({ title: 'ASC' }).exec();
  }

  async findByUuid(uuid: string): Promise<RoleSubModules> {
    return this.roleSubModulesModel.findOne({ uuid }, {
      _id: 1, uuid: 1, title: 1, flags: 1
    }).exec();
    
  }

  async deleteByUuid(uuid: string) {
    return this.roleSubModulesModel.findOneAndDelete({ uuid }).exec();
  }

  async editRoleSubModulesByUuid(
    uuid: string,
    request: RoleSubModuleInterface
  ): Promise<RoleSubModules> {
     this.roleSubModulesModel.findOneAndUpdate({ uuid }, request).exec();
     return this.roleSubModulesModel.findOne({ uuid }, {}).exec();
  }

  async getActiveRoleSubModules() {

    return this.roleSubModulesModel.find(  { flags: { active: true } } ).exec();

     
  }

}