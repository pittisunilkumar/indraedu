import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Syllabus, Video } from '../schema';

export interface VideoSubjectsInterface {
  id: string;
  uuid: string;
  order: number;
  imgUrlVideos: string;
  title: string;
  totalVideos: number;
}

@Injectable()
export class MobileVideosService {

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

  async getSubjectVideos(subjectId) {

    const chapters = await this.videoModel
    .find(
      { subjects: subjectId },
      {
        chapter: 1,
      },
    ).populate({
      path: 'chapters',
      select: '_id uuid title'
    })

    const videos = await this.videoModel
      .find(
        { subjects: subjectId },
        {
          chapter: 1,
          title: 1,
          totalTime: 1,
          videoId: 1,
          'faculty.name': 1,
          notes: 1,
          'flags.paid': 1,
          publishOn: 1
        })
      .populate({
        path: 'chapters',
        select: '_id uuid title'
      })
      .exec();

    // const chapters = videos.map(vid => vid.chapters);
    // // chapters.videos = videos;
    console.log({ chapters });

    return videos;

    // subject.children.map((chapter) => {
    //   console.log({ chapter });

    //   videos = this.videoModel
    //     .find({ syllabus: chapter.id }).exec().then(res => res);
    //     sub.totalVideos = videos.length;
    // });



      // .find({ courses: courseId, type: { $eq: 'SUBJECT' } }
    // [
    //   {
    //     chapterid, chapteruuid, title, order,
    //     videos [
    //       { videoId, videoUuid, title, facultyImage, faculty_name, totalTime, materialPdf, flags,  }
    //     ]
    //   }
    // ]
  }

  // needs video cipher
  // getVideoByUuid(uuid: string) {
  //   videoUuid, videoid, title, facultyImage, faculty_name, totalTime, notespdf, plaubackOtp, playbackInfo, topics: [
  //     { title, time }
  //   ]
  // }
  // needs video cipher
  // downloadVideo(videoId, userId) {
  //   offlineplaubackOtp,
  //   offlineplaybackInfo
  // }



  // async findAllCourses(): Promise<HomePageCourseInterface[]> {
  //   return this.courseModel
  //   .find({ "flags.active": true },{ title: 1, uuid: 1, id: 1, imgUrl: 1 })
  //   .exec();
  // }



}
