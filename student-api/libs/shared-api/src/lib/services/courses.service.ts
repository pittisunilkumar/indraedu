import {
  CourseInterface,
  SyllabusInterface,
} from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDTO } from '../dto/create-course.dto';
import { Course } from '../schema/course.schema';

@Injectable()
export class CoursesService {
  constructor(@InjectModel('Course') private courseModel: Model<Course>) { }

  async create(createCourseDTO: CreateCourseDTO): Promise<Course> {
    const createdCourse = new this.courseModel(createCourseDTO);
    const result = createdCourse.save();

    return result;
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel
      .find()
      .populate('users')
      .populate({
        path: 'syllabus',

        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,
          "type": 1,
          "shortcut":1
        }
      }).exec()
    // .populate('syllabus')
    // .exec();
  }
  async getActiveCourses(): Promise<Course[]> {
    return this.courseModel.find({  }, { uuid: 1, title: 1, order: 1, flags: 1 }).exec()
    // let qbanks = [];
    // let videos = [];
    // let tests = []
    // return this.courseModel.find({  }, { uuid: 1, title: 1, order: 1, flags: 1,qbanks,videos,tests }).exec()
  }

  async findAllQBankCourses(): Promise<Course[]> {
    return this.courseModel
      .find({ 'flags.qBank': true }, { _id: 1, uuid: 1, title: 1 })
      .exec();
  }

  async findAllVideoCourses(): Promise<Course[]> {
    return this.courseModel
      .find({ 'flags.videos': true }, { _id: 1, uuid: 1, title: 1, syllabus: 1 })
      .populate({
        path: 'syllabus',
        populate: 'children'
      })
      .exec();
  }

  async findByUuid(uuid: string): Promise<Course> {
    return this.courseModel
      .findOne({ uuid })
      .populate('users')
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

  async editCourseByUuid(request: CourseInterface): Promise<Course> {
    return this.courseModel.findOneAndUpdate({ uuid: request.uuid }, request).exec();
  }

  async findTestSeriesSubjectsByCourse(request: any) {
    return this.courseModel
      .find({
        _id: request.courseId,
        'flags.active': true,
        'flags.testSeries': true
      })
      .populate(
        {
          path: 'syllabus',
          match: { "flags.testSeries": true, 'flags.active': true, }
        })
      .exec();
  }

  async getqbanksubjects(request: any) {
    return this.courseModel
      .find({
        _id: request.courseId,
        'flags.active': true,
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
        'flags.active': true,
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
        'flags.active': true,
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
}
