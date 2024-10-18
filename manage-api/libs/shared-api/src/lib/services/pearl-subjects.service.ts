import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { CreatePearlSubjectsDto } from '../dto/create-pearl-subjects.dto';
import { PearlSubjects } from '../schema';
import { PearlSubjectInputInterface, PeralSubjectInterface } from '@application/api-interfaces';
import { ObjectId } from 'mongodb';

@Injectable()
export class PearlSubjectsService {
  constructor(
    @InjectModel('PearlSubjects') private PearlSubjectsModel: Model<PearlSubjects>
  ) { }


  // async  checkSubjectPearl(subjectId){
  //     let subjectData=[];
  //     return subjectData=await this.PearlSubjectsModel.find({ "subjectId" : subjectId }).exec();

  //   }


  // async addPearlSubjects(pearlSubjects : PearlSubjectInputInterface){
  //  // console.log('ssssubjectId',pearlSubjects.subjectId);
  //   let subjectId=pearlSubjects.subjectId;
  //   let chapterId=pearlSubjects.chapterId;
  //   let pearlId=pearlSubjects.pearlId;

  //  // console.log('subjectId',subjectId);

  //   let subjectData=await this.PearlSubjectsModel.find({ "subjectId": subjectId }).exec();

  //   console.log('subjectData.length',subjectData.length);
  //   if(subjectData.length > 0){

  //     let db_chapter=await this.PearlSubjectsModel.aggregate([
  //       {$match:{ "subjectId" : mongoose.Types.ObjectId(subjectId) } },
  //       {$unwind: "$chapter"},
  //       {$match: {'chapter.chapterId': mongoose.Types.ObjectId(chapterId)}}
  //       ]).exec();


  //     if(db_chapter.length > 0 ){
  //       console.log('chapter_exists')
  //       return this.PearlSubjectsModel.findOneAndUpdate(
  //         { subjectId: subjectId },
  //         { $push: { "chapter.$[elem].pearlIds": pearlId  } },
  //         {
  //           arrayFilters: [{ "elem.chapterId": { $eq: chapterId } } ]
  //         },
  //       ).exec();
  //     }else{
  //       console.log('chapter_noT_exists')
  //       let chapter={ "chapterId": chapterId, "pearlIds": [ pearlId ] }
  //       return this.PearlSubjectsModel.findOneAndUpdate(
  //         { subjectId: subjectId },
  //         { $push: { "chapter": chapter  } }
  //       ).exec();

  //     }
  //   }else{
  //     let new_subject={
  //       "subjectId":subjectId,
  //       "chapter":[{
  //         "chapterId":chapterId,
  //         "pearlIds": [pearlId],
  //       }]
  //     }
  //     //console.log('new_subject',new_subject)
  //   const createdPearlSubjects = new this.PearlSubjectsModel(new_subject);
  //   const result =await createdPearlSubjects.save();
  //   return result;
  //   }
  // }


  async addPearlSubjects(request: any) {
    console.log('request', request);
    let uuid = request.uuid;
    let createdOn = request.createdOn;
    let createdBy = request.createdBy;

    let requestSubject = request.subject;
    for (var j = 0; j < requestSubject.length; j++) {

      let subjectId = requestSubject[j].subjectId;
      let chapterId = requestSubject[j].chapterId;
      let pearlId = requestSubject[j].pearlId;
      let qUuid = requestSubject[j].qUuid;
      let subjectData: any;
      // console.log('subjectId',subjectId);

      subjectData = await this.PearlSubjectsModel.find({ "subjectId": subjectId }).exec();

      console.log('subjectData.length', subjectData.length);
      if (subjectData.length > 0) {

        let db_chapter = await this.PearlSubjectsModel.aggregate([
          { $match: { "subjectId": mongoose.Types.ObjectId(subjectId) } },
          { $unwind: "$chapter" },
          { $match: { 'chapter.chapterId': mongoose.Types.ObjectId(chapterId) } }
        ]).exec();


        if (db_chapter.length > 0) {
          console.log('chapter_exists')
          this.PearlSubjectsModel.findOneAndUpdate(
            { subjectId: subjectId },
            { $push: { "chapter.$[elem].pearlIds": { "pearlId": mongoose.Types.ObjectId(pearlId) } } },
            {
              arrayFilters: [{ "elem.chapterId": { $eq: chapterId } }]
            },
          ).exec();
        } else {
          console.log('chapter_noT_exists')
          let chapter = { "chapterId": chapterId, "pearlIds": [{ "pearlId": mongoose.Types.ObjectId(pearlId) }] }
          this.PearlSubjectsModel.findOneAndUpdate(
            { subjectId: subjectId },
            { $push: { "chapter": chapter } }
          ).exec();

        }
      } else {
        console.log('pearlId', pearlId);

        let new_subject = {
          "uuid": uuid,
          "qUuid": qUuid,
          "subjectId": subjectId,
          "chapter": [{
            "chapterId": chapterId,
            "pearlIds": [{ "pearlId": mongoose.Types.ObjectId(pearlId) }],
          }],
          "createdOn": createdOn,
          "createdBy": createdBy
        }
        console.log('new_subject', new_subject)
        const createdPearlSubjects = new this.PearlSubjectsModel(new_subject);
        const result = await createdPearlSubjects.save();
        //return result;
      }
    }

  }

  async getSubjectsAndChapters(pearlId: string) {

    console.log('pearlId', pearlId);
    return this.PearlSubjectsModel.aggregate([
      { $unwind: "$chapter" },

      {
        '$project': {
          'cu': '$chapter',
          's': '$subjectId',
          'qUuids': '$qUuid'
        }
      },

      {
        '$project': {
          'z': '$cu.pearlIds',
          'zc': '$cu.chapterId',
          'ss': '$s',
          'qqUuuid': '$qUuids',
        },

      },


      {
        $lookup: // Equality Match
        {
          from: "syllabuses",
          localField: "ss",
          foreignField: "_id",
          as: "subjectName",
        }
      },

      {
        $lookup: // Equality Match
        {
          from: "syllabuses",
          localField: "zc",
          foreignField: "_id",
          as: "chapterName",
        }
      },



      {
        "$match": {

          "z": { "pearlId": mongoose.Types.ObjectId(pearlId) },
        }
      },


      {
        $unwind: "$subjectName"
      },

      {
        $unwind: "$chapterName"
      },


      {
        $group: {
          _id: {
            chapterId: "$chapterName._id",
            chapterUuid: "$chapterName.uuid",
            chapterName: "$chapterName.title",
          },


          // $addFields: {
          //    "subjectId": "$subjectName._id"
          // },


          //subject: {$addToSet: "$subjectName._id" },

          //subject: { $push:  { subjectId: "$subjectName._id",subjectUuid: "$subjectName.uuid", subjectName: "$subjectName.title" } }

          subject: {
            $push: {
              syllabus: {
                _id: "$subjectName._id",
              },
              uuid: "$qqUuuid",
              title: "$subjectName.title",
              chapters: [{
                _id: "$chapterName._id",
                uuid: "$chapterName.uuid",
                title: "$chapterName.title",
              }],
            }
          }

        },

      },




      {
        $project: {
          "_id": 0,
          //"chapter":"$_id",
          "subject": "$subject",

        }
      },




    ]).exec();


  }


  async editPearlSubjectByUuid(
    subjectId: string,
    request: PearlSubjectInputInterface
  ): Promise<PearlSubjects> {
    return this.PearlSubjectsModel.findOneAndUpdate({ subjectId }, request).exec();

  }

  async updatePearlSubjects(request: any) {

    //let deleteSubject:any;
    let deleteArray = request.deleteArray;
    //let objectIdArray = deleteSubject.map(s => mongoose.Types.ObjectId(s));
    //console.log(objectIdArray);
    for (var j = 0; j < deleteArray.length; j++) {

      this.PearlSubjectsModel.findOneAndUpdate(
        { subjectId: deleteArray[j].subjectId },
        {
          //$pull: { "chapter.$.chapterId": { chapterId: mongoose.Types.ObjectId(deleteSubject[j].chapterId) } },
          $pull: { "chapter.$[outer].pearlIds": { "pearlId": mongoose.Types.ObjectId(deleteArray[j].pearlId) } },
        },
        {
          arrayFilters: [
            { "outer.chapterId": mongoose.Types.ObjectId(deleteArray[j].chapterId) },
          ]
        }
      ).exec();

    }
    // this.PearlSubjectsModel.remove({ subjectId: { $in: objectIdArray } }).exec();

    let uuid = request.uuid;
    let modifiedOn = request.modifiedOn;
    let modifiedBy = request.modifiedBy;

    let requestSubject = request.subject;

    for (var j = 0; j < requestSubject.length; j++) {

      let subjectId = requestSubject[j].subjectId;
      let chapterId = requestSubject[j].chapterId;
      let pearlId = requestSubject[j].pearlId;
      let qUuid = requestSubject[j].qUuid;
      let subjectData: any;
      // console.log('subjectId',subjectId);

      subjectData = await this.PearlSubjectsModel.find({ "subjectId": subjectId }).exec();

      console.log('subjectData.length', subjectData.length);
      if (subjectData.length > 0) {

        let db_chapter = await this.PearlSubjectsModel.aggregate([
          { $match: { "subjectId": mongoose.Types.ObjectId(subjectId) } },
          { $unwind: "$chapter" },
          { $match: { 'chapter.chapterId': mongoose.Types.ObjectId(chapterId) } }
        ]).exec();


        if (db_chapter.length > 0) {
          console.log('chapter_exists')
          this.PearlSubjectsModel.findOneAndUpdate(
            { subjectId: subjectId },
            { $addToSet: { "chapter.$[elem].pearlIds": { "pearlId": mongoose.Types.ObjectId(pearlId) } } },
            {
              arrayFilters: [{ "elem.chapterId": { $eq: chapterId } }]
            },
          ).exec();
        } else {
          console.log('chapter_noT_exists')
          let chapter = { "chapterId": chapterId, "pearlIds": [{ "pearlId": mongoose.Types.ObjectId(pearlId) }] }
          this.PearlSubjectsModel.findOneAndUpdate(
            { subjectId: subjectId },
            { $push: { "chapter": chapter } }
          ).exec();

        }
      } else {
        let new_subject = {
          "uuid":uuid,
          "qUuid": qUuid,
          "subjectId": subjectId,
          "chapter": [{
            "chapterId": chapterId,
            "pearlIds": [{ "pearlId": mongoose.Types.ObjectId(pearlId) }],
          }],
          "modifiedOn": modifiedOn,
          "modifiedBy": modifiedBy
        }
        console.log('new_subject', new_subject)
        const createdPearlSubjects = new this.PearlSubjectsModel(new_subject);
        const result = await createdPearlSubjects.save();
        return result;
      }
    }

  }
}