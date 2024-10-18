import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Syllabus, Video,Pearls, PearlSubjects,Question, PearlBookMarks, Subscription} from '../schema';
import * as mongoose from 'mongoose';
import * as itUuid from 'uuid';

@Injectable()
export class MobilePearlsSubjectsService {

  constructor(
    @InjectModel('Syllabus') private syllabusModel: Model<Syllabus>,
    @InjectModel('Video') private videoModel: Model<Video>,
    @InjectModel('PearlBookMarks') private pearlBookMarksModel: Model<PearlBookMarks>,
    @InjectModel('Pearls') private pearlsModel: Model<Pearls>,
    @InjectModel('PearlSubjects') private pearlSubjectsModel: Model<PearlSubjects>,
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,
    @InjectModel('Question') private questionModel: Model<Question>,

  ) {}

  async getSubjects(courseId: string): Promise<any> {

    const subjects = await this.pearlSubjectsModel.aggregate([
      {
        $lookup: // Equality Match
        {
          from: "syllabuses",
          localField: "subjectId",
          foreignField: "_id",
          as: "syllabus",
        }
      },
      {
        $unwind: "$syllabus"
      },
      {
        $project: {
          uuid: 1,
          qUuid: 1,
          chapter: 1,
          "syllabus.title": 1,
        }
      }
    ]).exec();

      var subjectsData = [];
        subjects.forEach(subject => {
          var pearlCount = 0;
          subject.chapter.forEach(chapter => {
            pearlCount = pearlCount + chapter.pearlIds.length;
          });
          var sub = {
            "id": subject._id,
            "uuid": subject.uuid,
            "qUuid": subject.qUuid,
            'subjectName' : subject.syllabus.title,
            "chapterCount" : subject.chapter.length,
            "pearlCount" : pearlCount
          }
          subjectsData.push(sub);
        });

      return subjectsData;

  }

  async getpearlsBySubject(req, body): Promise<any> {

    var subjectsData = [];
    var bookMarkIds = [];
    const subjects = await this.pearlSubjectsModel.aggregate([
      {$match:{_id : mongoose.Types.ObjectId(body.subjectId)}},
      {
        $unwind: "$chapter"
      },
      {
        $lookup: // Equality Match
        {
          from: "syllabuses",
          localField: "chapter.chapterId",
          foreignField: "_id",
          as: "chapters",
        }
      },
      {
        $unwind: "$chapters"
      },
      {
        $group: {
          _id: { a: "$_id",  title: "$chapters.title" },
          "chapters":
          {
            $addToSet: {
              "id":"$chapters._id",
              "createdOn":"$chapters.createdOn",
              "title":"$chapters.title",
              "uuid":"$chapters.uuid",
              "shortcut":"$chapters.shortcut",
              "pearlIds" : "$chapter.pearlIds",
            }
          }
        }
      },
      {
        $project: {
          _id:0,
          chapters: "$chapters",
        }
      }
    ]).exec();
      console.log(subjects)
    const bookmark = await this.pearlBookMarksModel.findOne(
      { userUuid: req.user.uuid, subjectId : body.subjectId },
    ).exec();

    if(bookmark){
      bookMarkIds  = bookmark.pearlIds;
    }

    for (let index = 0; index < subjects.length; index++) {
      var bookmarkStatus = false;
      const element = subjects[index];
      var subject = element.chapters[0];
      // console.log(subject)
        var pearl = subject.pearlIds;
        if(pearl){
          // console.log(pearl);
          var pearls = [];
          for(let indexx = 0; indexx < pearl.length; indexx++){
            var pearlsssss = await this.pearlsModel.findOne({_id:pearl[indexx].pearlId
              ,'flags.active' : true},{uuid : 1, title : 1, explaination : 1,queIds:1}).sort({createdOn:-1}).exec();

            if(bookMarkIds.includes( pearlsssss._id)){
              bookmarkStatus = bookMarkIds.includes( pearlsssss._id)
            }else{
              bookmarkStatus = false;
            }
             var pearlsssssData = {
                '_id' : pearlsssss._id,
                'chapter_id' : subject.id,
                'subject_id' : body.subjectId,
                'uuid' : pearlsssss.uuid,
                'title' : pearlsssss.title,
                'explaination' : pearlsssss.explaination,
                "bookmark" : bookmarkStatus,
                'queIds' : pearlsssss.queIds,
                'mcqCount' : pearlsssss.queIds.length,
                "createdOn" : pearlsssss.createdOn
             }
  
              pearls.push(pearlsssssData);
          }

            var sub = {
              "id": subject.id,
              "uuid": subject.uuid,
              "createdOn": subject.createdOn,
              'chapter' : subject.title,
              "pearlCount" : pearls.length,
              "pearls" :  pearls.sort(function(o){ return o.createdOn })
            }
          subjectsData.push(sub);
      }
    }
    var data = subjectsData.sort(function(o){ return o.createdOn })
    return data;
  }


  async getpearlById(req, body): Promise<any> {
    var pearls = await this.pearlsModel.findOne({_id:body.pearlId}).exec();
    var courseSubscriptions = [];
    var subscriptionsList = await this.subscriptionModel.find({courses:req.user.courses},{courses:1}).exec();
    var mcq    = await this.questionModel.find({ _id: pearls.queIds },{syllabus : 0, perals : 0, previousAppearances : 0, modifiedBy : 0 , createdBy : 0, createdOn: 0, modifiedOn: 0}).exec();
      var subscribeStatus = false;
      var userSubscriptions  = req.user.subscriptions;
      var now = new Date();
      // console.log(subscriptionsList,subscriptionsList.length)
      subscriptionsList.forEach( sub=>{
        courseSubscriptions.push(sub._id.toString())
      })
      // console.log(courseSubscriptions,courseSubscriptions.length)
      userSubscriptions.forEach(element => {
        if(courseSubscriptions.indexOf(element.subscription_id.toString()) >= 0){
          if (subscribeStatus == false) {
            if (now <= element.expiry_date) {
              subscribeStatus = true;
            } else {
              subscribeStatus = false;
            }
          }
        }
      });
    return {id : pearls._id, title : pearls.title, subscribeStatus, mcq};
  }

  async addBookMark(req, body): Promise<any> {

    var bookmarks = null
    var bookmark = await this.pearlBookMarksModel.findOne(
      { userUuid: req.user.uuid, subjectId : body.subjectId},
    ).exec();
    if(bookmark){

      var check = await this.pearlBookMarksModel.findOne(
        { userUuid: req.user.uuid, subjectId : body.subjectId ,pearlIds : body.pearlId},
      ).exec();
      if(check){
        bookmarks  =check;
      }else{
        bookmarks = await this.pearlBookMarksModel.findOneAndUpdate(
          { userUuid: req.user.uuid, subjectId : body.subjectId },
          {
            $push: { "pearlIds": body.pearlId }
          },
          { new: true, useFindAndModify: false }
        ).exec();
      }
     
    }else{
        bookmarks = new this.pearlBookMarksModel();
        bookmarks.userUuid = req.user.uuid;
        bookmarks.subjectId = body.subjectId;
        bookmarks.uuid      = itUuid.v4();
        bookmarks.pearlIds = body.pearlId;
        bookmarks.save();
    }

    return {bookmarks};
  }

  async removeBookMark(req, body): Promise<any> {


    var  bookmarks = await this.pearlBookMarksModel.findOneAndUpdate(
      { userUuid: req.user.uuid, subjectId : body.subjectId },
      {
        $pull: { "pearlIds": body.pearlId }
      },
      { new: true, useFindAndModify: false }
    ).exec();    

    return {bookmarks};
  }
}
