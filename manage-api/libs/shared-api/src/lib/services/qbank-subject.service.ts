import { Question } from '@application/shared-api';
import { async } from '@angular/core/testing';
import { map } from 'rxjs/operators';
import { SyllabusService } from './syllabus.service';
import { SyllabusSchema } from './../schema/syllabus.schema';
import { Subject } from 'rxjs';
import { QBankInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQBankDTO, CreateQBankSubjectDto, CreateSyllabusDto } from '../dto';
import { Course, QBank, QBankSubject, Syllabus } from '../schema';

@Injectable()
export class QbankSubjectService {

  constructor(
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('QBankSubject') private qbankSubjectModel: Model<QBankSubject>,
    @InjectModel('Syllabus') private syllabusModel: Model<Syllabus>,
    @InjectModel('Question') private questionModel: Model<Question>,
    @InjectModel('QBank') private qbankModel: Model<QBank>,
  ) { }


  async findByID(employee) {
    return this.findAll(employee).then(result => {
      // result.children.forEach(child => {
      //   if(child){
      //     this.syllabusModel.findById(
      //       {_id: child}
      //     ).exec();
      //   }
      // });
      result.forEach(subjects => {
        subjects.chapters.forEach(chapter => {
          if (chapter) {
            const chaptersss = this.syllabusModel.findById(
              { _id: chapter._id }
            ).exec();

            chapter['chptr'] = chaptersss;
          }
        });
      });
    });
  }
  // async findAll(): Promise<QBankSubject[]> {

  //   // return this.qbankSubjectModel
  //   //   .aggregate([
  //   //           // Then join
  //   //           { "$lookup": {
  //   //             "from": "courses",
  //   //             "localField": "courses",
  //   //             "foreignField": "_id",
  //   //             "as": "course"
  //   //         }},
  //   //         { "$lookup": {
  //   //           "from": "syllabuses",
  //   //           "localField": "syllabus",
  //   //           "foreignField": "_id",
  //   //           "as": "syllabuss"
  //   //       }}
  //   //   ]).exec().then((data) => {
  //   //     data.forEach(subjects => {
  //   //       subjects.chapters.forEach(chapter => {
  //   //       if(chapter){
  //   //        const  chaptersss= this.syllabusModel.findById(
  //   //           {_id: chapter._id}
  //   //         ).exec();
  //   //           console.log(chaptersss)
  //   //         chapter['chptr'] = chaptersss;
  //   //       }
  //   //       });
  //   //     });
  //   //     return data
  //   //   }).catch((err) => {
  //   //     console.error(err);
  //   //   });
  //   const result = await this.qbankSubjectModel
  //     .find(
  //       {
  //         // 'flags.active': true,
  //       }, {
  //       "uuid": 1,
  //       //  "title":1,
  //       // "imgUrl": 1,
  //       "order": 1,
  //       //"chapters":1,
  //       "count": 1,
  //       'chapters': 1,
  //       "createdOn": 1,
  //       // "modifiedOn": 1,
  //       // "createdBy": 1,
  //       "flags": 1
  //     }).
  //     populate({
  //       path: 'courses',
  //       match: {
  //         // "flags.qBank": true,
  //         // 'flags.active': true
  //       },
  //       select: {
  //         "uuid": 1,
  //         "title": 1,
  //         // "order": 1,
  //         // "imgUrl": 1,
  //         // "flags":1,
  //         // "shortcut": 1,
  //       }
  //     })
  //     .sort({ order: 'ASC' })
  //     .populate({
  //       path: 'syllabus',
  //       match: {
  //         "type": "SUBJECT",
  //         // "flags.questionBank": true,
  //         // 'flags.active': true
  //       },
  //       select: {
  //         "uuid": 1,
  //         "title": 1,
  //         // "type": 1,
  //         // "order": 1,
  //         // "shortcut": 1,
  //         // "imgUrlVideos": 1,
  //         // "suggestedBanner": 1,
  //       }
  //     })
  //     .exec()
  //     .then(async res => {
  //       if (res != undefined) {
  //         for (var i = 0; i < res.length; i++) {
  //           var array = res[i].chapters;

  //           for (var j = 0; j < array.length; j++) {
  //             let name = '';
  //             var obj = await this.syllabusModel.findOne({ "_id": res[i].chapters[j]._id }, { title: 1 }).exec();

  //             if (obj) {
  //               name = obj.title;
  //             }
  //             res[i].chapters[j]['title'] = name;
  //           }
  //         }
  //       }
  //       return res;
  //     })
  //     .catch(err => err);
  //   return result;

  // }

  async findAll(employee): Promise<QBankSubject[]> {
    const courseListIds = [];
    const empCourses = await this.courseModel.find({organizations:{$in:employee.organizations}},{_id:true})
    empCourses.forEach(element => {
      courseListIds.push(element._id)
    });
    return this.qbankSubjectModel.find({courses:{$in:courseListIds}},{uuid:1,syllabus:1,flags:1,courses:1,count:1,order:1,createdOn:1})
    .populate({
      path: 'syllabus',
      select: {
        "_id": 1,
        "uuid": 1,
        "title": 1,
      }
    })
    .populate({
      path: 'courses',
      select: {
        "_id": 1,
        "uuid": 1,
        "title": 1,
      }
    })
    .sort({order:'ASC'})
    .exec()
  }

  async getQbankSubjects(): Promise<QBankSubject[]> {
    return this.qbankSubjectModel.find({},{uuid:1,syllabus:1,courses:1,order:1,'chapters.title':1,'chapters.uuid':1,'chapters._id':1})
    .populate({
      path: 'syllabus',
      select: {
        "_id": 1,
        "uuid": 1,
        "title": 1,
      }
    })
    .populate({
      path: 'courses',
      select: {
        "_id": 1,
        "uuid": 1,
        "title": 1,
      }
    })
    .sort({order:'ASC'})
    .exec()
  }

  // async findAll(): Promise<QBankSubject[]> {

  //   return this.qbankSubjectModel.aggregate([
  //     {
  //       $lookup: // Equality Match
  //       {
  //         from: "syllabuses",
  //         localField: "syllabus",
  //         foreignField: "_id",
  //         as: "syllabus",
  //       },
  //     },
  
  //       { $unwind: "$syllabus"},
  
  //       {
  //         $lookup: // Equality Match
  //         {
  //           from: "courses",
  //           localField: "courses",
  //           foreignField: "_id",
  //           as: "courses",
  //         },
  //       },
    
  //      { $unwind: "$courses"},
  
  //      //{ $unwind: "$chapters"},
  //     //  {
  //     //   '$project': {
  //     //     'z': '$chapters',
          
  //     //      },
  //     //  },
  //     //  {
  //     //   $lookup: // Equality Match
  //     //   {
  //     //     from: "syllabuses",
  //     //     localField: "chapters.uuid",
  //     //     foreignField: "uuid",
  //     //     as: "chapter",
  //     //   },
  //     //  },
  
  //      /*{
  //       $project: {
          
  //         likes: {
  //           $map: {
  //             input: "$chapters.uuid",
  //             as: "title",
  //             in: {
  //               $toObjectId: "$chapter.uuid"
  //             }
  //           }
  //         },
  //       }
  //     },*/
  //      //{ $unwind: "$chapter"},
  
  //      //{
  //        // $addFields: {
  //           //'chapters.title': '$chapter.title',
  //                  /* "chapters.title": {
  //                     "$map": {
  //                       "input": {
  //                         "$filter": {
  //                           "input": "$chapter",
  //                           "as": "chap",
  //                           "cond": "$$chap.uuid"
  //                         }
  //                       },
  //                       "as": "chaps",
  //                       "in": {
  //                         "name": "$$chaps.title",
  //                         //"type": "$$hobbym.type"
  //                       }
  //                     }
  //                   } */
  
  //                  /* "chapters.title": { 
  //                     $map: { 
  //                         input: "$chapters", as: "chap", 
  //                         in: {
  //                             $let: {
  //                                  vars: { 
  //                                      varin: { 
  //                                          $arrayElemAt: [ { $filter: {
  //                                                               input: "$chapter", as: "per", 
  //                                                               cond: { $eq: [ "$per.uuid", "$chap.uuid" ] }
  //                                           } }, 0 ] 
  //                                       } 
  //                                  },
  //                                  in: { 
  //                                   $cond: [ { $eq: [ "$chap.uuid", "$per.uuid" ] }, 
  //                                   [ { $push: [ "$chap", { title: "$chapter.title" } ] } ],
  //                                   "$$chap"
  //                                   ] 
                                      
  //                                  }
  //                             }
  //                         }
  //                     }
  //                 }*/
  
  //                  /* "chapters.title": {
  //                     $map: {
  //                       input: "$chapters.title",
  //                       as: "i",
  //                       in: {
  //                         $mergeObjects: [
  //                           "$$i",
  //                           {
  //                             $first: {
  //                               $filter: {
  //                                 input: "$chapter.title",
  //                                 cond: { $eq: ["$$this.uuid", "$$i.uuid"] }
  //                               }
  //                             }
  //                           }
  //                         ]
  //                       }
  //                     }
  //                   }*/
  
  //                   /*"chapters.title": {
  //                     "$map": { 
  //                       "input": "$chapters",
  //                       "as": "rel",
  //                       "in": {
  //                         "$mergeObjects": [
  //                           "$$rel",
  //                           { "name": { "$arrayElemAt": ["$chapter.title", { "$indexOfArray": ["$chapter.uuid", "$$rel.uuid"] }] }}
  //                         ]
  //                       }
  //                     }
  //                   }*/
  //       //    } 
  //       //  },
  //     //  {
  //     //   $push: { "chapters.$[chelem]": { $each: '$chapter.title' } },
  //     //  },
  
  //     // {
  //     //   arrayFilters: [{ "chelem.uuid": { $eq: '$chapters.uuid' } }
         
  //     //   ]
  //     // },
  
  //       {
  //         $group: {
  //           _id: {
  //             _id: "$_id",
  //             uuid: "$uuid",
  //             imgUrl:"$imgUrl",
  //             count:"$count",
  //             order:"$order",
  //             createdOn:"$createdOn",
  //             modifiedOn:"$modifiedOn",
  //             createdBy:"$createdBy",
  //             flags:"$flags",
  //             chapters: "$chapters",
  //             syllabus:"$syllabus",
  //             courses:"$courses",
  //             //likes: 1,
  //             },
  //       //chapters: {
  //         //$push: '$members',
  //       //}
  
  //         /*syllabuss: {
  //               $addToSet: { 
  //                 "_id" :"$syllabus._id",
  //                 "uuid": "$syllabus.uuid",
  //                 "title": "$syllabus.title",
  //                 "type": "$syllabus.type",
  //                 "shortcut": "$syllabus.shortcut",
  //                 "order": "$syllabus.order",
  //                 "imgUrlVideos": "$syllabus.imgUrlVideos",
  //                 "suggestedBanner": "$syllabus.suggestedBanner",
  //                        } 
  //                   }*/
  //             },
            
  //       },
  //       {
  //         $project:{
  //          "_id": "$_id._id",
  //          "uuid":"$_id.uuid",
  //          "imgUrl":"$_id.imgUrl",
  //          "count":"$_id.count",
  //          "order":"$_id.order",
  //          "createdOn":"$_id.createdOn",
  //          "modifiedOn":"$_id.modifiedOn",
  //          "createdBy":"$_id.createdBy",
  //          "flags":"$_id.flags",
  //          "chapters":"$_id.chapters",
  //          "syllabus":"$_id.syllabus",
  //          "courses":"$_id.courses",
           
           
  //          }
  //       }
      
  
  //   ])
  //   .sort({order:'ASC'})
  //   .exec();
  //  }

  async findByUuid(uuid: string): Promise<QBankSubject> {

    var result = await this.qbankSubjectModel.findOne({ uuid }, { courses: 1, syllabus: 1, chapters: 1, _id: 1, uuid: 1, title: 1, imgUrl: 1, order: 1, flags: 1, count: 1,createdBy:1,createdOn:1 })
      .exec().then(async res => {

    // var result = await this.qbankSubjectModel.findOne({ uuid }, { courses: 1, syllabus: 1, chapters: 1, _id: 1, uuid: 1, title: 1, imgUrl: 1, order: 1, flags: 1, count: 1 })
     
    // .exec().then(async res => {
      

        //let cuuid='';
        var qbcourse;
        var qbsyllabus;
        if (res != undefined) {
          qbcourse = await this.courseModel.findOne({ '_id': res.courses }, { _id: 1, uuid: 1, title: 1 })
            .populate({
              path: 'syllabus',

              select: {
                "uuid": 1,
                "title": 1,
                "_id": 1,


              }
            }).exec();
          qbsyllabus = await this.syllabusModel.findOne({ '_id': res.syllabus }, { _id: 1, uuid: 1, title: 1 })
            .populate({
              path: 'children',
              math: {
                "type": "CHAPTER",
                //"flags.active":true,
              },

              select: {
                "uuid": 1,
                "title": 1,
                "_id": 1,


              }
            }).exec();
          //return await this.syllabusModel.findOne({ '_id': res.syllabus },{ _id:1,uuid:1,title: 1}).exec().then( async ssres => {
          //})
          /*.populate({
            path: 'syllabus',
        
            select:{
              "uuid":1,
              "title":1,
              "_id":1,
              popolate:{
                path: 'children',
        
                select:{
                  "uuid":1,
                  "title":1,
                  "_id":1,
                }
              }*/


          // }
          //}).exec();
          //  qbcourse =await this.courseModel.findOne({ '_id': res.courses }, {  _id:1,uuid:1,title: 1 }) .exec();
          //  qbsyllabus =await this.syllabusModel.findOne({ '_id': res.syllabus }, {  _id:1,uuid:1,title: 1,children:1 }) .exec();
          // cuuid=course.uuid;
          //console.log(cuuid);
          res.courses = qbcourse;
          res.syllabus = qbsyllabus;

          var array = res.chapters;

          res.chapters.sort((a, b) => (a.order > b.order) ? 1 : -1);

          for (var j = 0; j < array.length; j++) {
            let name = '';
            var obj = await this.syllabusModel.findOne({ "_id": res.chapters[j]._id }, { title: 1 }).sort({order:1}).exec();

            if (obj) {
              name = obj.title;
            }
            let topics= [];
            topics=res.chapters[j].topics;
            res.chapters[j]['title'] = name;
            res.chapters[j]['count'] = res.chapters[j].topics.length;
            res.chapters[j]['topics'] = topics.sort((a, b) => (a.order > b.order) ? 1 : -1);
            /* for(var k =0;k< res.chapters[j].topics.length;k++){
               for(var l =0;l< res.chapters[j].topics[k].que.length;l++){

                 var  questionsData= await this.questionModel.findOne({"_id": res.chapters[j].topics[k].que[l]._id,
                 'flags.qBank':true
               },{
                   options:1,
                   title:1,
                 }
                 ).exec();
                   if(questionsData){
                     res.chapters[j].topics[k].que[l]['options'] = questionsData.options;
                     res.chapters[j].topics[k].que[l]['title'] = questionsData.title;
                   }
               }
               res.chapters[j].topics[k]['count'] = res.chapters[j].topics[k].que.length
             }*/
          }
          
        }
        
        return res;
      })
      .catch(err => err);;
    return result;

  }

  async findByCourse(courseId: string): Promise<any> {
    let sub = [];
    return this.qbankSubjectModel
    .find({courses:courseId},{_id:1,uuid:1})
    .populate({
      path: 'syllabus',
      select: {
        "uuid": 1,
        "title": 1,
        "_id": 1,

      }
    }).exec()
    .then(result => {
        result.forEach(syl => {
          let new_syl: any = syl.syllabus;
         sub.push(
          {
            "_id":syl._id,
            "uuid":syl.uuid,
            "title":new_syl.title,
          }
        )
        })
        return sub;
      })

  }

  async findSubjectsByCoueseIds(coursesarr:any): Promise<any> {
    let sub = [];
    return this.qbankSubjectModel
    .find({courses: { $in:coursesarr}},{_id:1,uuid:1})
    .populate({
      path: 'courses',
      select: {      
        "title": 1
      }
    })
    .populate({
      path: 'syllabus',
      select: {
        "uuid": 1,
        "title": 1,
        "_id": 1,

      }
    }).exec()
    .then(result => {
        result.forEach(syl => {
          let new_syl: any = syl.syllabus;
          let new_courses: any = syl.courses;
         sub.push(
          {
            "_id":syl._id,
            "uuid":syl.uuid,
            "title":new_syl.title,
            "course_name":new_courses.title,
            "course_id":new_courses._id
          }
        )
        })
        return sub;
      })

  }

  
  async findQbQuestions(qbUuid: string, cUuid: string, tUuid: string) {

    return this.qbankSubjectModel
      .aggregate([
        { $match: { "uuid": qbUuid } },
        { $unwind: "$chapters" },

        {
          '$project': {
            'z': {
              '$filter': {
                'input': '$chapters.topics',
                'cond': {
                  '$eq': [
                    '$$this.uuid', tUuid
                  ]
                }
              }
            }
          }
        }, {
          '$unwind': '$z'

        },
        {
          $unwind: "$z.que"
        },
        
        {$sort: {'z.que.order': 1}},
        {
          $lookup: // Equality Match
          {
            from: "questions",
            localField: "z.que.uuid",
            foreignField: "uuid",
            as: "question",
          }
        },

        {
          $unwind: "$question"
        },



        {
          $project: {
            "order": '$z.que.order',
            "_id": "$question._id",
            "uuid": "$question.uuid",
            "title": "$question.title",
            "imgUrl": "$question.imgUrl",
            "options": "$question.options",
            "type": "$question.type",
            "answer": "$question.answer",
            "description": "$question.description",
            "flags": "$question.flags",
            "mathType": "$question.mathType",
            "questionId": "$question.questionId",
            "descriptionImgUrl": "$question.descriptionImgUrl",
            "matchLeftSideOptions": "$question.matchLeftSideOptions",
            "matchRightSideOptions": "$question.matchRightSideOptions",

            "perals":"$question.perals",
            "syllabus":"$question.syllabus",
            "difficulty":"$question.difficulty",
            "previousAppearances":"$question.previousAppearances",
            "tags":"$question.tags",
            "createdBy":"$question.createdBy",
            // "matchRightSideOptions":"$question.matchRightSideOptions",
            // "matchLeftSideOptions":"$question.matchLeftSideOptions",
            // "createdOn":"$question.createdOn",
            // "shortTitle":"$question.shortTitle",
          }
        },

      ])
      .exec();
  }

  async deleteByTestUuid(subjectUuid: string, topicUuid: string) {

    return this.qbankSubjectModel
      .findOneAndUpdate(
        { uuid: subjectUuid },
        // filter and push to the object
        {
          $pull: { "chapters.$[].topics": { uuid: topicUuid } },
          $inc: { 'count': -1 }
        },
      )
      .exec();
  }

  async deleteByUuid(uuid: string) {

    // this.findCategoryByUuid(uuid).then(result => {
    // result.children.forEach(child => {
    //   if(child){
    //     this.qbankSubjectModel.findByIdAndUpdate(
    //       {_id: child},
    //       { $pull: { parents: result._id } }
    //     ).exec();
    //   }
    // });
    // result.parents.forEach(parent => {
    //   if(parent){
    //     this.qbankSubjectModel.findByIdAndUpdate(
    //       {_id: parent},
    //       { $pull: { children: result._id } }
    //     ).exec();
    //   }
    // });

    // });


    return this.qbankSubjectModel.findOneAndDelete({ uuid }).exec();

  }

  async create(createQBankSubjectDTO: CreateQBankSubjectDto): Promise<QBankSubject> {


    const createdQBankSubject = new this.qbankSubjectModel(createQBankSubjectDTO);

    // const createSyllabusDto: CreateSyllabusDto = {
    //   uuid: createdQBankSubject.uuid,
    //   title: createdQBankSubject.title,
    //   order: createdQBankSubject.order,
    //   imgUrlVideos: 'url',
    //   suggestedBanner: '',
    //   imgUrlQBank: '',
    //   parents: null,
    //   children: null,
    //   createdOn: new Date(),
    //   flags: {
    //     active: true,
    //     editable: true,
    //     testSeries: false,
    //     videos: false,
    //     materials: false,
    //     flashCards: false,
    //     questionBank: true,
    //     mcq: false,
    //     suggested: false,
    //   },
    //   createdBy: createdQBankSubject.createdBy,
    //   type: 'SUBJECT',
    //   shortcut: 'test'
    // };
    // const createdSyllabus = new this.syllabusModel(createSyllabusDto);
    // await createdSyllabus.save();
    const result = createdQBankSubject.save();
    return result;

  }

  async addSubjectTopic(createQBankDTO: CreateQBankDTO): Promise<QBankSubject> {

    return this.qbankSubjectModel
      .findOneAndUpdate(
        {
          courses: createQBankDTO.courses,
          syllabus: createQBankDTO.subject,
          // _id: createQBankDTO.subject._id,
        },
        // filter and push to the object
        {
          $push: { "chapters.$[elem].topics": createQBankDTO.topics },
          // $push: { "chapters.$[elem].topics": createQBankDTO },
          $inc: { 'count': 1 }
        },
        { arrayFilters: [{ "elem._id": { $eq: createQBankDTO.chapter } }] },
        // { arrayFilters: [ { "elem.title": { $eq: createQBankDTO.chapter.title } } ] },
      )
      .exec();
  }

  async createBulkTopics(response: any) {
    console.log('responseresponseresponseresponse',response);
    
    response.map(res=>{
      return this.qbankSubjectModel
      .findOneAndUpdate(
        {
          courses: res.courses,
          syllabus: res.subject,
          // _id: createQBankDTO.subject._id,
        },
        // filter and push to the object
        {
          $push: { "chapters.$[elem].topics": res.topics },
          // $push: { "chapters.$[elem].topics": createQBankDTO },
          $inc: { 'count': 1 }
        },
        { arrayFilters: [{ "elem._id": { $eq: res.chapter } }] },
        // { arrayFilters: [ { "elem.title": { $eq: createQBankDTO.chapter.title } } ] },
      )
      .exec();
    })
    
  }

  async editByUuid(request: QBankInterface): Promise<QBankSubject> {
    const result = this.qbankSubjectModel.findOneAndUpdate(
      { uuid: request.uuid },
      request
    ).exec();
    // result.then(QBankSeries => {
    //   this.updateAssignments(QBankSeries);
    // })

    return result;
  }
  async deleteQueByUuid(subjectUuid: string, cUuid: string, topicUuid: string, queUuid: string) {
    return this.qbankSubjectModel
      .findOneAndUpdate(
        { uuid: subjectUuid },
        {
          $pull: { "chapters.$[outer].topics.$[inner].que": { uuid: queUuid } }
        },
        {
          arrayFilters: [
            { "outer.uuid": cUuid },
            { 'inner.uuid': topicUuid }
          ]
        }

      )
      .exec();
  }

  async copyQBQuestions(request: QBankInterface): Promise<QBankSubject> {

    return this.qbankSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.to_subject

        },
        // filter and push to the object
        {
          $push: { "chapters.$[chelem].topics.$[telem].que": { $each: request.que } },

        },
        {
          arrayFilters: [{ "chelem.uuid": { $eq: request.to_chapter } },
          { "telem.uuid": { $eq: request.to_topic } }
          ]
        },

      )
      .exec();
  }

  async copyQBTopics(request: QBankInterface): Promise<QBankSubject> {
    return this.qbankSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.to_subject

        },
        // filter and push to the object
        {
          $push: { "chapters.$[chelem].topics": { $each: request.topics } },
          $inc : { 'count' : request.count }
        },
        {
          arrayFilters: [{ "chelem.uuid": { $eq: request.to_chapter } }
            //  { "telem.uuid": { $eq: request.to_topic } } 
          ]
        },

      )
      .exec();
  }

  async copyQBChapter(request: QBankInterface): Promise<QBankSubject> {
    return this.qbankSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.to_subject

        },
        // filter and push to the object
        {
          $push: { "chapters": { $each: request.chapters } },
          $inc : { 'count' : request.count }
        },
        //   { arrayFilters: [ { "chelem.uuid": { $eq: request.to_chapter } }
        //                       //  { "telem.uuid": { $eq: request.to_topic } } 
        // ] },

      )
      .exec();
  }

  async moveqbquestions(request: QBankInterface): Promise<QBankSubject> {

    this.qbankSubjectModel
      .findOneAndUpdate(
        { uuid: request.from_subject },

        {
          $pull: { "chapters.$[chelem].topics.$[telem].que": { "uuid": { $in: request.from_que } } }
        },
        {
          arrayFilters: [{ "chelem.uuid": { $eq: request.from_chapter } },
          { "telem.uuid": { $eq: request.from_topic } }
          ]
        },

      )
      .exec();
    return this.qbankSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.to_subject

        },
        // filter and push to the object
        {
          $push: { "chapters.$[tochelem].topics.$[totelem].que": { $each: request.que } },

        },
        {
          arrayFilters: [{ "tochelem.uuid": { $eq: request.to_chapter } },
          { "totelem.uuid": { $eq: request.to_topic } }
          ]
        },

      )
      .exec();


  }

  async dragAndDropQBQuestions(request: QBankInterface): Promise<QBankSubject> {
    //console.log('QBankSubject',QBankSubject);
    return this.qbankSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.from_subject
        },
        {
          $set: {
            "chapters.$[elem].topics.$[elem1].que": request.que,
          }
          // $inc : { 'count' : 1 }
        },
        {
          arrayFilters: [
            { "elem.uuid": { $eq: request.from_chapter } },
            { "elem1.uuid": { $eq: request.from_topic } }
          ]
        },
      ).exec();
  }

  async dragAndDropQBTopics(request: any): Promise<QBankSubject> {
    //console.log('QBankSubject',QBankSubject);
    return this.qbankSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.from_subject
        },
        {
          $set: {
            "chapters.$[elem].topics": request.topics,
          }
          // $inc : { 'count' : 1 }
        },
        {
          arrayFilters: [
            { "elem.uuid": { $eq: request.from_chapter } },
            // { "elem1.uuid": { $eq: request.from_topic } }
          ]
        },
      ).exec();
  }
  async dragAndDropQBChapters(request: any): Promise<QBankSubject> {
    //console.log('QBankSubject',QBankSubject);
    return this.qbankSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.from_subject
        },
        {
          $set: {
            "chapters": request.chapters,
          }
          // $inc : { 'count' : 1 }
        }
        // {
        //   arrayFilters: [
        //     { "elem.uuid": { $eq: request.from_chapter } },
        //     // { "elem1.uuid": { $eq: request.from_topic } }
        //   ]
        // },
      ).exec();
  }
  async dragAndDropQBSubjects(request: any): Promise<QBankSubject> {
    return request.map(res=>{
       this.qbankSubjectModel.findOneAndUpdate({uuid:res.uuid},{order:res.order}).exec();
    })
  }
  async moveqbtopics(request: QBankInterface): Promise<QBankSubject> {

    this.qbankSubjectModel
      .findOneAndUpdate(
        { uuid: request.from_subject },

        {
          $pull: { "chapters.$[chelem].topics": { "uuid": { $in: request.from_topic } } },
          $inc : { 'count' : -(request.count) }
        },
        {
          arrayFilters: [{ "chelem.uuid": { $eq: request.from_chapter } },
            // { "telem.uuid": { $eq: request.from_topic } } 
          ]
        },

      )
      .exec();

    return this.qbankSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.to_subject

        },
        // filter and push to the object
        {
          $push: { "chapters.$[tochelem].topics": { $each: request.topics } },
          $inc : { 'count' : request.count }
        },
        {
          arrayFilters: [{ "tochelem.uuid": { $eq: request.to_chapter } },
            //  { "totelem.uuid": { $eq: request.to_topic } } 
          ]
        },

      )
      .exec();


  }
  async moveqbchaptrers(request: QBankInterface): Promise<QBankSubject> {

    this.qbankSubjectModel
      .findOneAndUpdate(
        { uuid: request.from_subject },

        {
          $pull: { "chapters": { "uuid": { $in: request.from_chapter } } },
          $inc : { 'count' : -(request.count) }
        },
        //   { arrayFilters: [ { "chelem.uuid": { $eq: request.from_chapter } },
        //  // { "telem.uuid": { $eq: request.from_topic } } 
        //   ]},

      )
      .exec();

    return this.qbankSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.to_subject

        },
        // filter and push to the object
        {
          $push: { "chapters": { $each: request.chapters } },
          $inc : { 'count' : request.count }

        },
        //   { arrayFilters: [ { "tochelem.uuid": { $eq: request.to_chapter } },
        //                   //  { "totelem.uuid": { $eq: request.to_topic } } 
        // ] },

      )
      .exec();


  }

  async deleteQBChapters(request: QBankInterface): Promise<QBankSubject> {

    return this.qbankSubjectModel
      .findOneAndUpdate(
        { uuid: request.to_subject },

        {
          $pull: { "chapters": { "uuid": { $in: request.from_chapter } } },
          $inc : { 'count' : -(request.count) }
        },
        //   { arrayFilters: [ { "chelem.uuid": { $eq: request.from_chapter } },
        //  // { "telem.uuid": { $eq: request.from_topic } } 
        //   ]},

      )
      .exec();

  }

  async deleteQBQuestions(request: QBankInterface): Promise<QBankSubject> {
    return this.qbankSubjectModel
      .findOneAndUpdate(
        { uuid: request.from_subject },

        {
          $pull: { "chapters.$[chelem].topics.$[telem].que": { "uuid": { $in: request.from_que } } },
        },
        {
          arrayFilters: [{ "chelem.uuid": { $eq: request.from_chapter } },
          { "telem.uuid": { $eq: request.from_topic } }
          ]
        },
      )
      .exec();

  }

  async deleteMultipleTopics(request: QBankInterface) {

    this.qbankSubjectModel
      .findOneAndUpdate(
        { uuid: request.from_subject },

        {
          $pull: { "chapters.$[chelem].topics": { "uuid": { $in: request.from_topic } } },
          $inc : { 'count' : -(request.count) }
        },
        {
          arrayFilters: [{ "chelem.uuid": { $eq: request.from_chapter } },
            // { "telem.uuid": { $eq: request.from_topic } } 
          ]
        },

      )
      .exec();
  }


}
