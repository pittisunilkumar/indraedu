import { AboutInterface, QBankInterface, VideoInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, Course, QBank, QBankSubject, Test, Video, VideoSubject } from '../schema';
import { QuestionsService } from '../services/questions.service';

export interface HomePageDataInterface {
  banners: {imgUrl: string; link: string }[];
  suggested: {
    qbanks: QBankInterface[];
    videos: VideoInterface[];
    tests: Test[];
  }
}

export interface HomePageCourseInterface {
  uuid: string;
  id: string;
  title: string;
  imgUrl: string;
}

@Injectable()
export class MobileHomeService {

  constructor(
    @InjectModel('Banner') private bannersModel: Model<Banner>,
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Test') private testModel: Model<Test>,
    @InjectModel('VideoSubject') private videoSubjectModel: Model<VideoSubject>,
    @InjectModel('QBankSubject') private qbankSubjectModel: Model<QBankSubject>
  ) {}

  async getData(courseId: string): Promise<HomePageDataInterface> {

    const banners = await this.bannersModel
      .find({ courses: courseId }, { imgUrl: 1, link: 1, order: 1})
      .exec();

    const qbanks = await this.qbankSubjectModel
      .find(
        { courses: courseId, 'flags.suggested': true },
      ).exec()
      .then(res => {
        console.log({ res });
        const topics = [];
        res.map(subject => {
          subject.chapters.forEach(chp => {
            chp.topics.forEach(it => {
              topics.push(
                {
                  uuid: it.uuid,
                  _id: it._id,
                  title: it.title,
                  imgUrl: it.imgUrl,
                  subject: {
                    uuid: it.subject.uuid,
                    _id: it.subject._id,
                    title: it.subject.title,
                  },
                  chapter: {
                    title: it.chapter.title,
                  },
                  // chapter: it.chapter,
                  description: it.description,
                  count: it.count,
                  order: it.order,
                  flags: it.flags
                }
              );
            })
          })
        });
        return topics;
      })
      .catch(err => err);

    const videos = await this.videoSubjectModel
      .find(
        { courses: courseId, 'flags.suggested': true },
      ).exec()
      .then(res => {
        console.log({ res });
        const videosList = [];
        res.map(subject => {
          subject.chapters.forEach(chp => {
            chp.videos.forEach(it => {
              videosList.push(
                {
                  uuid: it.uuid,
                  title: it.title,
                  totalTime: it.totalTime,
                  faculty: {
                    uuid: it.faculty.uuid,
                    name: it.faculty.name
                  },
                  subject: {
                    uuid: it.videoSubjectUuid,
                    // uuid: it.subject.uuid,
                    // _id: it.subject._id,
                    // title: it.subject.title,
                  },
                  chapter: it.chapter,
                  order: it.order,
                  flags: it.flags
                }
              );
            })
          })
        });
        return videosList;
      })
      .catch(err => err);

    /**
     * test_name
        questions_count
        user_test_attempt_status
        test_image
        test_id
        test_category_id
        user_subscription_status
        test_content_type
        test_time
        test_description
     */

    const tests = await this.testModel
      .find(
        { courses: courseId, 'flags.suggested': true },
        { title: 1, count: 1, imgUrl: 1, uuid: 1, description: 1, categories: 1, time: 1  })
      .exec();

    return {
      banners,
      suggested: { qbanks, videos, tests }
    };

  }

  async findAllCourses(): Promise<HomePageCourseInterface[]> {
    return this.courseModel
    .find({ 'flags.active': true },{ title: 1, uuid: 1, id: 1, imgUrl: 1 })
    .exec();
  }



}
