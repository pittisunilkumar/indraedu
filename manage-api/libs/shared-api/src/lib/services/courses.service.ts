import {
  CourseInterface,
  SyllabusInterface,
} from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDTO } from '../dto/create-course.dto';
import { TestResultsService } from '../mobile-services';
import { QBankSubject, TSCategories, VideoSubject } from '../schema';
import { Course } from '../schema/course.schema';
import { Logs } from '../schema/logs.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Logs') private logsModel: Model<Logs>,
    @InjectModel('QBankSubject') private qbankSubjectModel: Model<QBankSubject>,
    @InjectModel('VideoSubject') private videoSubjectModel: Model<VideoSubject>,
    @InjectModel('TSCategories') private TSCategoriesModel: Model<TSCategories>,
  ) { }

  async create(createCourseDTO: CreateCourseDTO): Promise<Course> {
    const createdCourse = new this.courseModel(createCourseDTO);
    const result = createdCourse.save();
    let logs_request = {
      'moduleName': 'Course',
      'collectionName': 'courses',
      'request': createCourseDTO,
      'documentId': (await result)._id,
      'createdOn': createCourseDTO.createdOn,
      'createdBy': createCourseDTO.createdBy,
    };
    console.log('logs_request', logs_request);
    const logs = new this.logsModel(logs_request);
    const logs_result = logs.save();

    return result;
  }

  async findAll(employee): Promise<Course[]> {
    return this.courseModel
      .find({organizations:{$in:employee.organizations}})
      .populate({
        path:'organizations',
        model: "Organization",
        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,
        }
      })
      .populate({
        path: 'syllabus',

        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,
          "type": 1,
          "shortcut": 1
        }
      })
      .sort({ order: 'ASC' })
      .exec()
    // .populate('syllabus')
    // .exec();
  }
  async getActiveCourses(employee:any): Promise<Course[]> {
    return this.courseModel.find({organizations:{$in:employee.organizations}}, { uuid: 1, title: 1, order: 1, flags: 1 }).exec()
    // let qbanks = [];
    // let videos = [];
    // let tests = []
    // return this.courseModel.find({  }, { uuid: 1, title: 1, order: 1, flags: 1,qbanks,videos,tests }).exec()
  }

  async getTestSeriesActiveCourses(): Promise<Course[]> {
    return this.courseModel
      .find({ 'flags.testSeries': true }, { _id: 1, uuid: 1, title: 1 })
      .exec();
  }

  async findAllQBankCourses(): Promise<Course[]> {
    return this.courseModel
      .find({ 'flags.qBank': true }, { _id: 1, uuid: 1, title: 1 })
      .exec();
  }

  async findAllVideoCourses(): Promise<Course[]> {
    return this.courseModel
      .find({ 'flags.videos': true }, { _id: 1, uuid: 1, title: 1 })
      .exec();
  }

  async findByUuid(uuid: string) {
    return this.courseModel
      .findOne({ uuid })
      .populate({
        path:'organizations',
        model: "Organization",
        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,
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
    // .populate('syllabus')
    // .exec();
  }

  async deleteByUuid(uuid: string) {
    return this.courseModel.findOneAndDelete({ uuid }).exec();
  }

  async editCourseByUuid(request) {
    let result = this.courseModel.findOneAndUpdate({ uuid: request.uuid }, request).exec();
    let logs_request = {
      'moduleName': 'Course',
      'collectionName': 'courses',
      'request': request,
      'documentId': (await result)._id,
      'modifiedOn': request.modifiedOn,
      'modifiedBy': request.modifiedBy,
    };
    console.log('logs_request', logs_request);
    const logs = new this.logsModel(logs_request);
    const logs_result = logs.save();
    return result;
  }

  async findTestSeriesSubjectsByCourse(request: any) {
    return this.courseModel
      .find({
        _id: request.courseId,
        // 'flags.active': true,
        'flags.testSeries': true
      }, { 'uuid': 1, 'title': 1 })
      .populate(
        {
          path: 'syllabus',
          match: { "flags.testSeries": true, 'flags.active': true, },
          select: {
            "uuid": 1,
            "title": 1,
            "type": 1,
            "order": 1,
            "shortcut": 1
          }
        })
      .exec();
  }

  async getqbanksubjects(request: any) {
    return this.courseModel
      .find({
        _id: request.courseId,
        // 'flags.active': true,
        'flags.qBank': true
      },
        { "uuid": "$uuid", "title": "$title" },
      ).populate(
        {
          path: 'syllabus',
          match: {
            "type": "SUBJECT",
            "flags.questionBank": true,
            'flags.active': true
          },
          // select:{
          //   "uuid":1,
          //   "title":1,
          //   "type":1,
          //   "order":1,
          //   "shortcut":1
          // }
        })
      .exec();
  }
  async getVideosubjects(request: any) {
    return this.courseModel
      .find({
        _id: request.courseId,
        // 'flags.active': true,
        'flags.videos': true
      },
        { "uuid": "$uuid", "title": "$title" },
      ).populate(
        {
          path: 'syllabus',
          match: {
            "type": "SUBJECT",
            "flags.videos": true,
            'flags.active': true
          },
          // select:{
          //   "uuid":1,
          //   "title":1,
          //   "type":1,
          //   "order":1,
          //   "shortcut":1
          // }
        })
      .exec();
  }
  async getspqbanksubjects(request: any) {
    return this.courseModel
      .find({
        _id: request.courseId,
        // 'flags.active': true,
        'flags.qBank': true
      },
        // {"uuid":"$uuid","title":"$title"},
        { "title": "$title" },
      ).populate(
        {
          path: 'syllabus',
          match: {
            "type": "SUBJECT",
            "flags.questionBank": true,
            'flags.active': true
          },
          select: {
            //   "uuid":1,
            "title": 1,
            "type": 1,
            "order": 1,
            //   "shortcut":1
          }
        })
      .exec();
  }


  async getCouseSubjects(request: any) {
    let qbankSubjects = await this.qbankSubjectModel.find({ courses: request.courseId }, { uuid: 1, syllabus: 1, flags: 1, courses: 1, count: 1, order: 1, createdOn: 1 })
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
      .sort({ order: 'ASC' })
      .exec()

    let videoSubjects = await this.videoSubjectModel.find({ courses: request.courseId },{uuid:1,syllabus:1,flags:1,courses:1,count:1,order:1,createdOn:1})
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

    let testCategories = await this.TSCategoriesModel
    .find({ courses: request.courseId }, { 'courses': 1, '_id': 1, 'uuid': 1, 'categories.order': 1, 'categories.title': 1, 'categories.tests.length': 1, 'createdOn': 1, 'flags': 1 })
    .populate({
      path: 'courses',
      match: {
        // "flags.testSeries": true ,
        // 'flags.active': true
      },
      select: {
        "uuid": 1,
        "title": 1,
      }
    })
    .sort({ 'categories.order': 1 })
    .exec()


    return {"qbankSubjects":qbankSubjects,"videoSubjects":videoSubjects,"testCategories":testCategories}
  }
}
