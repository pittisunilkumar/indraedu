import { Department, CreateDepartmentDto, Employee, Ticket, User } from '@application/shared-api';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { firebase } from 'config/firebase-configuration';
import { FirebaseService } from './firebase-service';

@Injectable()
export class DepartmentService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectModel('Department') private departmentModel: Model<Department>,
    @InjectModel('Ticket') private ticketModel: Model<Ticket>,
    @InjectModel('Employee') private employeeModel: Model<Employee>,
    @InjectModel('User') private userModel: Model<User>
    
  ) { }

  async assignDepartment(empId: string, departmentId: string) {
    return this.employeeModel.findOneAndUpdate(
      { _id: empId },
      { $push: { "department": departmentId } }
    ).exec();
  }
  async deleteDepartment(empId: string, departmentId: string) {
    return this.employeeModel.findOneAndUpdate(
      { _id: empId },
      { $pull: { "department": departmentId } }
    ).exec();
  }

  async create(createDepartmentDto: CreateDepartmentDto) {
    const createdDepartment = new this.departmentModel(createDepartmentDto);
    const result = createdDepartment.save();
    console.log('resultresultresultresult', await result);

    let Department
    Department = await result
    await Department.hod.map(per => {
      this.assignDepartment(per, Department._id)
    })
    return result;
  }

  async findAll() {
    let event = this.departmentModel.find().populate({
      path: 'employee',
      select: {
        "_id": 1,
        "uuid": 1,
        "name": 1,
      }
    })
      .populate({
        path: 'hod',
        select: {
          "_id": 1,
          "uuid": 1,
          "name": 1,
        }
      }).exec()
    return event
  }

  async findByUuid(uuid: string) {
    return await this.departmentModel.findOne({ uuid })
      .populate({
        path: 'employee',
        select: {
          "_id": 1,
          "uuid": 1,
          "name": 1,
        }
      })
      .populate({
        path: 'hod',
        select: {
          "_id": 1,
          "uuid": 1,
          "name": 1,
        }
      }).exec()

  }

  async deleteByUuid(id: string) {
    return await this.departmentModel.findOneAndDelete({ _id: id }).exec();
  }

  async editDepartmentByUuid(
    uuid: string,
    request: any
  ) {
    console.log('request', request);
    request?.insertDepartmentArray.map(per => {
      this.assignDepartment(per, request._id)
    })
    request?.deleteDepartmentArray.map(per => {
      this.deleteDepartment(per, request._id)
    })
    return this.departmentModel.findOneAndUpdate({ uuid }, request).exec();
    // return this.departmentModel.findOne({ uuid }, {}).exec();
  }

  async getActiveDepartments() {
    return this.departmentModel.find({ flags: { active: true } }).populate({
      path: 'employee',
      select: {
        "_id": 1,
        "uuid": 1,
        "name": 1,
      }
    })
      .populate({
        path: 'hod',
        select: {
          "_id": 1,
          "uuid": 1,
          "name": 1,
        }
      }).exec()
  }

  async getAllTickets(request) {
    return await this.ticketModel.find({ department: request.departmentId }).populate({
      path: 'user',
      select: {
        "_id": 1,
        "uuid": 1,
        "name": 1,
        "mobile": 1,
      }
    })
      .populate({
        path: 'department',
        select: {
          "_id": 1,
          "uuid": 1,
          "title": 1,
        }
      })
      .populate({
        path: 'courses',
        Model:'Course',
        select: {
          "_id": 1,
          "uuid": 1,
          "title": 1,
        }
      })
      .sort({ createdOn: 'DESC' })
      .exec()

  }

  async getTicketByUUid(uuid: string) {
    return await this.ticketModel.findOne({ uuid }).populate({
      path: 'user',
      select: {
        "_id": 1,
        "uuid": 1,
        "name": 1,
        "mobile": 1,
      }
    })
      .populate({
        path: 'department',
        select: {
          "_id": 1,
          "uuid": 1,
          "title": 1,
        }
      })
      .sort({ createdOn: 'DESC' })
      .exec()
  }

  async sendReply(
    request: any
  ) {
   return this.ticketModel.findOneAndUpdate({ uuid:request.uuid }, {
    $push: {
      "reply": request.reply
    }
    }).exec();
  }

  async updateTicket(
    request: any
  ) {
    let TicketStatus=[
      'NEW','TO DO','IN PROGRESS','CLOSED','REJECTED',
    ]
    var title = '';
    var body = '';
    var ticket = null
    var ticketDetails =await this.ticketModel.findOne({ uuid:request.uuid });
    if(request.status == 4){
      ticket = await this.ticketModel.findOneAndUpdate({ uuid:request.uuid }, {
        status:request.status,
        // reply_image:request.reply_image,
        // reply_message:request.reply_message,
        modifiedOn:request.modifiedOn,
        modifiedBy:request.modifiedBy,
        closedDateTime:new Date()
      }).exec();
      title = `Ticket Has Been ${TicketStatus[request.status-1]}`;
      body = "Dear user, We have Closed your complaint with Ticket Id "+ ticketDetails.ticketId+"  Thank you";
    }
    else{
       ticket = await this.ticketModel.findOneAndUpdate({ uuid:request.uuid }, {
        status:request.status,
        modifiedOn:request.modifiedOn,
        modifiedBy:request.modifiedBy
      }).exec();


      title = `Ticket Has Been ${TicketStatus[request.status-1]}`;
      body = "Dear user, We have updated your complaint with Ticket Id "+ ticketDetails.ticketId+" and we will be working on it, we will update the status of your complaint soon. Thank you";
 
    }
    var icon ='';
    const message =   {
      notification: {
        title: title,
        body: body,
        imageUrl : icon,
        notificationType : 'general'
      },
      data: {
        creatorName: 'Plato',
        title :  title,
        body: body,
        imageUrl : icon,
        notificationType : 'general'
      }
    }
    const  registrationToken   = [];
    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };
    var user = await this.userModel.findOne({_id : ticketDetails.user});
    user.devices.forEach(element => {
      if(element.isLoggedIn == true && element.device_type != 'web'){
        registrationToken.push(element.id)
      }
    });

    firebase.messaging().sendToDevice(registrationToken, message, options).then( response => {
      console.log(response);
    }).catch( error => {
        console.log(error);
    });

    return ticket
   
  }

}
