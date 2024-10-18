import { FacultyInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFacultyDTO } from '../dto/create-faculty.dto';
import { Faculty } from '../schema';
import bcrypt from 'bcrypt';


@Injectable()
export class FacultyService {
  constructor(@InjectModel('Faculty') private facultyModel: Model<Faculty>) { }

  async create(createFacultyDTO: CreateFacultyDTO): Promise<Faculty| Error> {
    const createdFaculty = new this.facultyModel(createFacultyDTO);
    createdFaculty.password = await bcrypt.hash(createdFaculty.password, 10);
    const result = createdFaculty.save();
    return result;
  }

  async findAll(): Promise<Faculty[]> {
    return this.facultyModel
      .find()
      .populate({
        path: 'courses',
        match: {
          'flags.active': true
        },
        select: {
          "uuid": 1,
          "title": 1,
          "order": 1,
        }
      })
      .populate({
        path: 'syllabus',
        match: {
          'flags.active': true
        },
        select: {
          "uuid": 1,
          "title": 1,
          "order": 1,
        }
      })
      // .populate('courses')
      //.populate('syllabus')
      .exec();
  }

  async getFaculties(): Promise<Faculty[]> {
    return this.facultyModel
      .find({specialization:'Faculty'})
      .populate({
        path: 'courses',
        match: {
          'flags.active': true
        },
        select: {
          "uuid": 1,
          "title": 1,
          "order": 1,
        }
      })
      .populate({
        path: 'syllabus',
        match: {
          'flags.active': true
        },
        select: {
          "uuid": 1,
          "title": 1,
          "order": 1,
        }
      })
      // .populate('courses')
      //.populate('syllabus')
      .exec();
  }

  async findByUuid(uuid: string): Promise<Faculty> {
    return this.facultyModel
      .findOne({ uuid })
      .populate({
        path: 'courses',
        populate: {
          path: 'syllabus',
          select: {
            "title": 1,
            "uuid": 1
          }
        },
        match: {

          'flags.active': true
        },
        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,


        }
      })
      //.populate('courses')
      .populate({
        path: 'syllabus',
        match: {

          'flags.active': true
        },
        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1

        }
      })
      .exec();
  }

  async deleteByUuid(uuid: string) {
    return this.facultyModel.findOneAndDelete({ uuid }).exec();
  }

  async editFacultyByUuid(
    uuid: string,
    request: any
  ): Promise<Faculty> {
    return this.facultyModel.findOneAndUpdate({ uuid }, request).exec();
  }
}
