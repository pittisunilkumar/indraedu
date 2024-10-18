import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Syllabus, Video } from '../schema';

@Injectable()
export class MobilePearlsService {

  constructor(
    @InjectModel('Syllabus') private syllabusModel: Model<Syllabus>,
    @InjectModel('Video') private videoModel: Model<Video>,
  ) {}

  async getVideoSubjectsByCourseId(courseId: string): Promise<any> {

    const subjects = await this.videoModel
      .find({ courses: courseId }, { subjects: 1, _id: 0 })
      .populate({
        path: 'subjects',
        select: 'imgUrlVideos totalVideos _id uuid title order ',
      })
      .exec();

      return subjects.filter(sub => !!sub.subject );

  }
}
