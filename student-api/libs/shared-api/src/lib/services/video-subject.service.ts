import { VideoInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQBankDTO, CreateQBankSubjectDto, CreateSyllabusDto, CreateVideoDTO, CreateVideoSubjectDto } from '../dto';
import { Course, Syllabus, Video, VideoSubject } from '../schema';

@Injectable()
export class VideoSubjectService {

  constructor(
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('VideoSubject') private videoSubjectModel: Model<VideoSubject>,
    @InjectModel('Syllabus') private syllabusModel: Model<Syllabus>,
  ) { }

  async findAll(): Promise<VideoSubject[]> {
    // return this.videoSubjectModel
    //   .find()
    //   .populate('courses')
    //   .exec();
    const result = await this.videoSubjectModel
      // return await this.videoSubjectModel
      .find(
        {
          'flags.active': true,
        }, {
        "uuid": 1,
        //  "title":1,
        "imgUrl": 1,
        "order": 1,
        //"chapters":1,
        "count": 1,
        "chapters": 1,
        "createdOn": 1,
        "modifiedOn": 1,
        //"createdBy":1,
        "flags": 1
      }).
      populate({
        path: 'courses',
        match: {
          // "flags.qBank": true ,
          'flags.active': true
        },
        select: {
          "uuid": 1,
          "title": 1,
          "order": 1,
          // "imgUrl":1,
          // "flags":1,
          "shortcut": 1,
        }
      }).
      sort({ order: 'ASC' })
      .populate({
        path: 'syllabus',
        match: {
          "type": "SUBJECT",
          //"flags.questionBank": true ,
          'flags.active': true
        },
        select: {
          "uuid": 1,
          "title": 1,
          "type": 1,
          "order": 1,
          //"shortcut":1,
          "imgUrlVideos": 1,
          "suggestedBanner": 1,
        }
      }).exec()
      .then(async res => {
        if (res != undefined) {
          for (var i = 0; i < res.length; i++) {
            var array = res[i].chapters;

            for (var j = 0; j < array.length; j++) {
              let name = '';
              var obj = await this.syllabusModel.findOne({ "_id": res[i].chapters[j]._id }, { title: 1 }).sort({ order: 'ASC' }).exec();

              if (obj) {
                name = obj.title;
              }
              res[i].chapters[j]['title'] = name;
            }
          }
        }
        return res;
      })
      .catch(err => err);
    return result;
  }

  async findByUuid(uuid: string): Promise<VideoSubject> {
    // return this.videoSubjectModel.findOne({ uuid })
    // .populate('courses')
    // .exec();
    var result = await this.videoSubjectModel.findOne({ uuid }, { courses: 1, syllabus: 1, chapters: 1, _id: 1, uuid: 1, title: 1, imgUrl: 1, order: 1, flags: 1, count: 1, createdOn: 1, createdBy: 1 })
      .exec().then(async res => {
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
            var obj = await this.syllabusModel.findOne({ "_id": res.chapters[j]._id }, { title: 1 }).exec();

            if (obj) {
              name = obj.title;
            }
            res.chapters[j]['title'] = name;
            res.chapters[j]['count'] = res.chapters[j].videos.length
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
    return this.videoSubjectModel
    .find({courses:courseId},{_id:1,uuid:1})
    .populate({
      path: 'syllabus',
      select: {
        "title": 1,
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
    return this.videoSubjectModel
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


  async deleteByUuid(uuid: string) {

    // this.findCategoryByUuid(uuid).then(result => {
    // result.children.forEach(child => {
    //   if(child){
    //     this.videoSubjectModel.findByIdAndUpdate(
    //       {_id: child},
    //       { $pull: { parents: result._id } }
    //     ).exec();
    //   }
    // });
    // result.parents.forEach(parent => {
    //   if(parent){
    //     this.videoSubjectModel.findByIdAndUpdate(
    //       {_id: parent},
    //       { $pull: { children: result._id } }
    //     ).exec();
    //   }
    // });

    // });

    return this.videoSubjectModel.findOneAndDelete({ uuid }).exec();

  }

  async create(createQBankSubjectDTO: CreateVideoSubjectDto): Promise<VideoSubject> {
    const createdQBankSubject = new this.videoSubjectModel(createQBankSubjectDTO);

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
    //     videos: true,
    //     materials: false,
    //     flashCards: false,
    //     questionBank: false,
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

  async editByUuid(request: VideoInterface): Promise<VideoSubject> {
    const result = this.videoSubjectModel.findOneAndUpdate(
      { uuid: request.uuid },
      request
    ).exec();

    return result;
  }

  async copyVideos(request: VideoInterface): Promise<VideoSubject> {
    return this.videoSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.to_subject

        },
        // filter and push to the object
        {
          $push: { "chapters.$[chelem].videos": { $each: request.videos } },
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
  async copyVideosChapters(request: VideoInterface): Promise<VideoSubject> {
    return this.videoSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.to_subject

        },
        // filter and push to the object
        {
          $push: { "chapters": { $each: request.chapter } },
          $inc : { 'count' : request.count }

        },
        //   { arrayFilters: [ { "chelem.uuid": { $eq: request.to_chapter } }
        //                       //  { "telem.uuid": { $eq: request.to_topic } } 
        // ] },

      )
      .exec();
  }

  async moveVideos(request: VideoInterface): Promise<VideoSubject> {

    this.videoSubjectModel
      .findOneAndUpdate(
        { uuid: request.from_subject },

        {
          $pull: { "chapters.$[chelem].videos": { "uuid": { $in: request.from_video } } },
          $inc : { 'count' : -(request.count) }
        },
        {
          arrayFilters: [{ "chelem.uuid": { $eq: request.from_chapter } },
            // { "telem.uuid": { $eq: request.from_topic } } 
          ]
        },

      )
      .exec();

    return this.videoSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.to_subject

        },
        // filter and push to the object
        {
          $push: { "chapters.$[tochelem].videos": { $each: request.videos } },
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

  async moveVideoChapters(request: VideoInterface): Promise<VideoSubject> {

    this.videoSubjectModel
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

    return this.videoSubjectModel
      .findOneAndUpdate(
        {
          uuid: request.to_subject

        },
        // filter and push to the object
        {
          $push: { "chapters": { $each: request.chapter } },
          $inc : { 'count' : request.count }
        },
        //   { arrayFilters: [ { "tochelem.uuid": { $eq: request.to_chapter } },
        //                   //  { "totelem.uuid": { $eq: request.to_topic } } 
        // ] },

      )
      .exec();


  }

  async deleteVideoChapters(request: VideoInterface): Promise<VideoSubject> {

    return this.videoSubjectModel
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

  async deleteMultipleVideos(request: VideoInterface) {

    this.videoSubjectModel
      .findOneAndUpdate(
        { uuid: request.from_subject },

        {
          $pull: { "chapters.$[chelem].videos": { "uuid": { $in: request.from_video } } },
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
