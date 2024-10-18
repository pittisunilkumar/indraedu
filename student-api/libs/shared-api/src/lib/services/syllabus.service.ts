import { SyllabusInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSyllabusDto } from '../dto';
import { Syllabus } from '../schema/syllabus.schema';

@Injectable()
export class SyllabusService {
  constructor(
    @InjectModel('Syllabus') private syllabusModel: Model<Syllabus>
  ) {}

  async findAll(): Promise<Syllabus[]> {
    return this.syllabusModel
      .find()
      .populate('parents')
      .populate('children')
      .populate('courses')
      .exec();
  }

  async findByUuid(uuid: string): Promise<Syllabus> {
    return this.syllabusModel
      .findOne({ uuid })
      .populate('parents')
      .populate('children')
      .populate('courses')
      .exec();
  }

  async deleteByUuid(uuid: string) {
    this.findByUuid(uuid).then(result => {
      result.children.forEach(child => {
        if(child){
          this.syllabusModel.findByIdAndUpdate(
            {_id: child},
            { $pull: { parents: result._id } }
          ).exec();
        }
      });
      result.parents.forEach(parent => {
        if(parent){
          this.syllabusModel.findByIdAndUpdate(
            {_id: parent},
            { $pull: { children: result._id } }
          ).exec();
        }
      });

    });

    return this.syllabusModel.findOneAndDelete({ uuid }).exec();
  }

  async create(createSyllabusDto: CreateSyllabusDto): Promise<Syllabus> {
    const createdSyllabus = new this.syllabusModel(createSyllabusDto);
    console.log(createdSyllabus.get('type'));
    const result = createdSyllabus.save();
    result.then(syllabus => {
      this.updateAssignments(syllabus);
    })

    return result;
  }

  async editSyllabusByUuid(
    uuid: string,
    request: SyllabusInterface
  ): Promise<Syllabus> {
    const result = this.syllabusModel.findOneAndUpdate(
      { uuid },
      request
    ).exec();
    // result.then(syllabus => {
    //   this.updateAssignments(syllabus);
    // })

    return result;
  }

  async updateAssignments(result: Syllabus) {
    result?.parents?.forEach(par => {
      if(par){
        this.syllabusModel.findByIdAndUpdate(
          {_id: par},
          { $push: { children: result._id } }
        ).exec();
      }
    });
    result?.children?.forEach(chi => {
      if(chi){
        this.syllabusModel.findByIdAndUpdate(
          {_id: chi},
          { $push: { parents: result._id } }
        ).exec();
      }
    });
  }
  async fetChapters(request:any) {
    return this.syllabusModel
      .find({
        _id :request.syllabusId,
        'flags.active' : true,
        'flags.questionBank' : true
      },{
          "uuid":1,
          // "title":1,
          // "type":1,
          // "order":1,
          // "shortcut":1,
          // "imgUrlVideos":1,
          // "suggestedBanner":1,
          // "createdBy":1
      })
    //   .populate({
    //     path: 'parents',
    //     match: {
    //       "type": "SUBJECT" ,
    //       "flags.questionBank": true ,
    //       'flags.active' : true
    //     },
    //     select:{
    //       "uuid":1,
    //       "title":1,
    //       "type":1,
    //       "order":1,
    //       "shortcut":1,
    //       "imgUrlVideos":1,
    //       "suggestedBanner":1,
    //       "createdBy":1
    //     }
    // })
      .populate(
        {
          path: 'children',
        match: {
          "type": "CHAPTER" ,
          "flags.questionBank": true ,
          'flags.active' : true
        },
        select:{
          "uuid":1,
          "title":1,
          "_id":1,
          // "type":1,
          // "order":1,
          // "shortcut":1,
          // "imgUrlVideos":1,
          // "suggestedBanner":1,
          // "createdBy":1
        }
      })
      .then(res => {
        return res[0].children
      });
  }
}
