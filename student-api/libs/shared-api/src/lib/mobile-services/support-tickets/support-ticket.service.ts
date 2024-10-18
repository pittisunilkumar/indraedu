import { User,Department,Ticket } from '@application/shared-api';
import { InjectModel } from '@nestjs/mongoose';
import {  Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import * as Uuid from 'uuid';
import { firebase } from '../../../../../../config/firebase-configuration';


@Injectable()
export class SupportTicketService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Department') private department: Model<Department>,
    @InjectModel('Ticket') private ticket: Model<Ticket>,

  ) { }

  async findAll(request) {
    let userId = request.user._id
    let courses = request.user.courses
    var date = new Date();

    let department = await this.department.find({'flags.active':true}, {
      uuid : 1,
      title: 1,
    }).lean();
    return department;
  }

  async ticketList(request) {
    let userId = request.user._id
    let courses = request.user.courses
    var date = new Date();

    return await this.ticket.find({ user : userId }).populate({
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
      }).populate({
        path: 'courses',
        select: {
          "_id": 1,
          "uuid": 1,
          "title": 1,
        }
      })
      .exec()
  }


  async createNewTicket(request, body, image_url, audio) {

    // console.log(image_url);
    let user = request.user
    let userId = request.user._id
    let courses = request.user.courses
    var date = new Date();

    if(!body.department){
      return { "status": false, "code": 2001, 'message': 'Department Is Required', 'data': {} }
    }
    var departmentId = body.department;
    if(departmentId == 'null' || departmentId == 'NULL'){
      return { "status": false, "code": 2001, 'message': 'Department Is Required', 'data': {} }
    }
    // var department = await this.department.findOne({_id : departmentId}).exec()

    if(!body.message){
      return { "status": false, "code": 2001, 'message': 'Message Required', 'data': {} }
    }
    if(!body.type){
      return { "status": false, "code": 2001, 'message': 'Type Required', 'data': {} }
    }
    var uuid = Uuid.v4()
    let random= Math.floor(Math.random() * 100000);

    let dateOfPayment=new Date();
    let month = dateOfPayment.getMonth()+1;
    let dt = dateOfPayment.getDate();
    let dt1: any;
    let month1: any;
    let currentYear = new Date().getFullYear();
    let year = currentYear.toString().split('');
    currentYear = parseInt(year[year.length - 2] + year[year.length - 1]);

    if (dt < 10) {
        dt1 = '0'+ dt;
    }else{ dt1= dt}
    if (month < 10) {
      month1 = '0' + month;

    }else{ month1= month;}

    var ticketId ='TC'+random+'D'+currentYear+month1+dt1;

    var reply =       {
        'createdOn' : new Date(),
        'reply_image' : [],
        'reply_message' : "Dear User, We have received your complaint With Ticket Id "+ ticketId+" and we will be working on it, we will update the status of your complaint soon. Thank you"
      }
    var ticket              = new this.ticket();
        ticket.uuid         = uuid
        ticket.ticketId     = ticketId
        ticket.message      = body.message
        ticket.type         = body.type
        ticket.department   = departmentId
        ticket.user         = userId
        ticket.courses      = courses
        ticket.status       = 1
        ticket.image        = image_url
        ticket.audio        = audio
        ticket.priority     = body.priority
        ticket.lastUpdated  = new Date()
        ticket.createdOn    = new Date()
        ticket.reply        = []
        var ticketDetails = await ticket.save();
        
      await this.ticket.findOneAndUpdate(
        { ticketId: ticketId },
        {
          $push: {
            "reply": reply
          }
        }).exec();


        var icon ='';
        const message =   {
          notification: {
            title: "Ticket Raised Successfully",
            body: "Dear "+ user.name +", We have received your complaint With Ticket Id "+ ticketId+" and we will be working on it, we will update the status of your complaint soon. Thank you",
            imageUrl : icon,
            notificationType : 'general'
          },
          data: {
            creatorName: 'Plato',
            title : "Ticket Raised Successfully",
            body: "Dear "+ user.name +", We have received your complaint With Ticket Id "+ ticketId+" and we will be working on it, we will update the status of your complaint soon. Thank you",
            imageUrl : icon,
            notificationType : 'general'
          }
        }
        const  registrationToken   = [];
        const options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };

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

    return {
      "status": true,
      "code": 2000,
      "message": "Ticket Created",
      'data': ticketDetails
    }
  }
}
