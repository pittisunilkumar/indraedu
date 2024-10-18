import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { Organization } from '../organization.schema';
import { Model } from 'mongoose';
// import { CreateOrganizationDto } from '../create-organization.dto';
import { UserInterface, KeyInterface } from '@application/api-interfaces';
import { Organization } from '@application/shared-api';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel('Organization') private organizationModel: Model<Organization>
  ) {}

  async create(createOrgDto) {
    const createdOrg = new this.organizationModel(createOrgDto);
    const result = createdOrg.save();
    return result;
  }

  async findAll() {
    return this.organizationModel.find().exec();
  }

  async findActiveOrg() {
    return this.organizationModel.find({'flags.active':true},{_id:1,uuid:1,title:1}).exec();
  }

  async findByUuid(uuid: string) {
    return this.organizationModel.findOne({ uuid }).exec();
  }

  async deleteByUuid(uuid: string) {
    return this.organizationModel.findOneAndDelete({ uuid }).exec();
  }

  async updateByUuid(request) {
    return this.organizationModel
      .findOneAndUpdate({ uuid: request.uuid }, request)
      .exec();
  }

  // Operations on users assigned to organization

  async addBulkUsersByOrgUuid(
    uuid: string,
    request: KeyInterface[]
  ) {
    return this.organizationModel
      .findOneAndUpdate({ uuid }, { $push: { users: { $each: request } } })
      .exec();
  }

  async deleteUserFromOrgByUuid(
    uuid: string,
    userUuid: string
  ) {
    return;
    // return this.organizationModel
    //   .update({}, { $pull: { users: { uuid: userUuid } } })
    //   .exec();
  }

  async editUserFromOrgByUuid(
    uuid: string,
    userUuid: string,
    request: UserInterface
  ) {
    return;
    // return this.organizationModel
    //   .update({ uuid }, (err, org) => {
    //     console.log({ org });
    //   })
    //   .exec();
  }
}
