import { RoleInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRolesDTO } from '../dto/create-roles.dto';
import { Roles } from '../schema/roles.schema';


@Injectable()
export class RolesService {
  constructor(@InjectModel('Roles') private rolesModel: Model<Roles>) { }

  async create(createRolesDTO: CreateRolesDTO): Promise<Roles> {
    const createdRoles = new this.rolesModel(createRolesDTO);
    const result = createdRoles.save();
    console.log('added Roles', result);
    return result;
  }

  async findAll(): Promise<Roles[]> {

    return this.rolesModel
    .aggregate([
      {
        $unwind: { path: "$rolePermissions", preserveNullAndEmptyArrays: true }
      },
      {
        $lookup:
        {
          from: "rolemodules",
          let: {
            module: "$rolePermissions.module"
          },
          pipeline: [{
              $match: {
                $expr: { $eq: [ "$_id", "$$module" ] }
              }
            },
            { $project: { _id: 1 ,title:1,uuid:1} }
          ],
          as: "rolePermissions.module",
        }
      },
      {
        $lookup:
        {
          from: "rolesubmodules",
          let: {
            subModules: "$rolePermissions.subModules"
          },
          pipeline: [
            { $match  : { "$expr": { "$in": ["$_id", "$$subModules"] } } },
            { $project: { _id: 1 ,title:1,uuid:1} }
          ],
          as: "rolePermissions.subModules",
        }
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            uuid: "$uuid",
            title : "$title",
            flags:"$flags",
            createdOn:"$createdOn"
          },
          rolePermissions: {
            $addToSet: "$rolePermissions"
          }
        }
      },
      {
        $project: {
          "_id":"$_id._id",
          "uuid": '$_id.uuid',
          "title": '$_id.title',
          "flags": '$_id.flags',
          "createdOn": '$_id.createdOn',
          "rolePermissions": '$rolePermissions',
        }
      }
    ]).sort({ title: 'ASC' }).exec()
  }



  async findByUuid(uuid: string): Promise<Roles> {
    // return this.rolesModel.findOne({ uuid }).exec();
    return this.rolesModel
    .aggregate([
      {
        $match: { "uuid": uuid }
      },
      {
        $unwind: { path: "$rolePermissions", preserveNullAndEmptyArrays: true }
      },
      {
        $lookup:
        {
          from: "rolemodules",
          let: {
            module: "$rolePermissions.module"
          },
          pipeline: [{
              $match: {
                $expr: { $eq: [ "$_id", "$$module" ] }
              }
            },
            { $project: { _id: 1 ,title:1,uuid:1} }
          ],
          as: "rolePermissions.module",
        }
      },
      {
        $lookup:
        {
          from: "rolesubmodules",
          let: {
            subModules: "$rolePermissions.subModules"
          },
          pipeline: [
            { $match  : { "$expr": { "$in": ["$_id", "$$subModules"] } } },
            { $project: { _id: 1 ,title:1,uuid:1} }
          ],
          as: "rolePermissions.subModules",
        }
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            uuid: "$uuid",
            title : "$title",
            flags:"$flags",
            createdOn:"$createdOn",
            createdBy:"$createdBy"
          },
          rolePermissions: {
            $addToSet: "$rolePermissions"
          }
        }
      },
      {
        $project: {
          "_id":0,
          "uuid": '$_id.uuid',
          "title": '$_id.title',
          "flags":"$_id.flags",
          "createdOn": '$_id.createdOn',
          "createdBy":"$_id.createdBy",
          "rolePermissions": '$rolePermissions',
        }
      }
    ]).exec()
  }


  async findById(id: any) {
    let data= this.rolesModel.findOne({ _id:id }).exec();
    return this.rolesModel
    .aggregate([
      {
        $match: { "uuid": (await data).uuid }
      },
      {
        $unwind: { path: "$rolePermissions", preserveNullAndEmptyArrays: true }
      },
      {
        $lookup:
        {
          from: "rolemodules",
          let: {
            module: "$rolePermissions.module"
          },
          pipeline: [{
              $match: {
                $expr: { $eq: [ "$_id", "$$module" ] }
              }
            },
            { $project: { _id: 1 ,title:1,uuid:1} }
          ],
          as: "rolePermissions.module",
        }
      },
      {
        $lookup:
        {
          from: "rolesubmodules",
          let: {
            subModules: "$rolePermissions.subModules"
          },
          pipeline: [
            { $match  : { "$expr": { "$in": ["$_id", "$$subModules"] } } },
            { $project: { _id: 1 ,title:1,uuid:1} }
          ],
          as: "rolePermissions.subModules",
        }
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            uuid: "$uuid",
            title : "$title",
            // flags:"$flags",
            // createdOn:"$createdOn",
            // createdBy:"$createdBy"
          },
          rolePermissions: {
            $addToSet: "$rolePermissions"
          }
        }
      },
      {
        $project: {
          "_id":0,
          "uuid": '$_id.uuid',
          "title": '$_id.title',
          // "flags":"$_id.flags",
          // "createdOn": '$_id.createdOn',
          // "createdBy":"$_id.createdBy",
          "rolePermissions": '$rolePermissions',
        }
      }
    ]).exec()
  }


  async deleteByUuid(uuid: string) {
    return this.rolesModel.findOneAndDelete({ uuid }).exec();
  }
  async editRolesByUuid(
    uuid: string,
    request: RoleInterface
  ): Promise<Roles> {
    this.rolesModel.findOneAndUpdate({ uuid }, request).exec();
    return this.rolesModel.findOne({ uuid }, {}).exec();
  }

  async getActiveRole() {
    return this.rolesModel.find(  { flags: { active: true } } ).exec();

     
  }
}