import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleValuesDTO } from '../dto/create-role-values.dto';
import { RoleModules } from '../schema/role-values.schema';
import { RoleValueInterface } from '@application/api-interfaces';

@Injectable()
export class RoleValuesService {
  constructor(@InjectModel('RoleModules') private roleValuesModel: Model<RoleModules>) { }

  async create(createRoleValuesDTO: CreateRoleValuesDTO): Promise<RoleModules> {
    const createdRoleVales = new this.roleValuesModel(createRoleValuesDTO);
    const result = createdRoleVales.save();
    console.log('added Role Values', result);
    return result;
  }

  async findAll(): Promise<RoleModules[]> {
    // return this.roleValuesModel.find().exec();
    return this.roleValuesModel
      .aggregate([
        {
          $lookup: {
            "from": "rolesubmodules",
            "let": { "subModules": "$subModules" },
            "pipeline": [
              { "$match": { "$expr": { "$in": ["$_id", "$$subModules"] } } }
            ],
            "as": "subModules"
          }
        },
        {
          $unwind: { path: "$subModules", preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: {
              _id: "$_id", title: "$title", uuid: "$uuid",
              createdOn: "$createdOn", flags: "$flags"
            },
            subModules: {
              $addToSet: {
                "_id": "$subModules._id",
                "title": "$subModules.title",
              }
            },
          }
        },
        {
          $project: {
            "_id": '$_id._id',
            "title": '$_id.title',
            "uuid": '$_id.uuid',
            "flags": '$_id.flags',
            "createdOn": '$_id.createdOn',
            "subModules": "$subModules",
          }
        }
      ]).sort({ title: 'ASC' }).exec()
  }

  async findByUuid(uuid: string): Promise<RoleModules> {
    // return this.roleValuesModel.findOne({ uuid }).exec();
    return this.roleValuesModel
    .aggregate([
      {
        $match: { "uuid": uuid }
      },
      {
        $lookup: {
          "from": "rolesubmodules",
          "let": { "subModules": "$subModules" },
          "pipeline": [
            { "$match": { "$expr": { "$in": ["$_id", "$$subModules"] } } }
          ],
          "as": "subModules"
        }
      },
      {
        $unwind: { path: "$subModules", preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: {
            _id: "$_id", title: "$title", uuid: "$uuid",
            createdOn: "$createdOn", flags: "$flags",createdBy:"$createdBy"
          },
          subModules: {
            $addToSet: {
              "_id": "$subModules._id",
              "uuid": "$subModules.uuid",
              // "title": "$subModules.title",
            }
          },
        }
      },
      {
        $project: {
          "_id": '$_id._id',
          "title": '$_id.title',
          "uuid": '$_id.uuid',
          "flags": '$_id.flags',
          "createdOn": '$_id.createdOn',
          "createdBy":"$_id.createdBy",
          "subModules": "$subModules",
        }
      }
    ]).exec()

  }

  async deleteByUuid(uuid: string) {
    return this.roleValuesModel.findOneAndDelete({ uuid }).exec();
  }

  async editRoleValuesByUuid(
    uuid: string,
    request: RoleValueInterface
  ): Promise<RoleModules> {
    this.roleValuesModel.findOneAndUpdate({ uuid }, request).exec();
    return this.roleValuesModel.findOne({ uuid }, {}).exec();
  }

  async getActiveRoleValues() {
    // return this.roleValuesModel.find({ flags: { active: true } }).sort({ title: 'ASC' }).exec();
    return this.roleValuesModel
    .aggregate([
      {
        $match: { "flags": { active: true }}
      },
      {
        $lookup: {
          "from": "rolesubmodules",
          "let": { "subModules": "$subModules" },
          "pipeline": [
            { "$match": { "$expr": { "$in": ["$_id", "$$subModules"] } } }
          ],
          "as": "subModules"
        }
      },
      {
        $unwind: { path: "$subModules", preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: {
            _id: "$_id", title: "$title", uuid: "$uuid",
            createdOn: "$createdOn", flags: "$flags"
          },
          subModules: {
            $addToSet: {
              "_id": "$subModules._id",
              "title": "$subModules.title",
            }
          },
        }
      },
      {
        $project: {
          "_id": '$_id._id',
          "title": '$_id.title',
          "uuid": '$_id.uuid',
          "flags": '$_id.flags',
          "createdOn": '$_id.createdOn',
          "subModules": "$subModules",
        }
      }
    ]).sort({ title: 'ASC' }).exec()
  }

}