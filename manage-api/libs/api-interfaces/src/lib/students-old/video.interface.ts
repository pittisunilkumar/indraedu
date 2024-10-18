export interface StuVideoInterface {
  sno: number;
  courseName: string;
  subject: string;
  name: string;
  chapterName: string;
  video: {
    id: string;
    totalTime: Date;
    authorName: string;
    authorImage: string;
  }
  chapterNotes: string;
  accessType: VideoAccessType;
  suggestedVideos: boolean;
  createdDate: Date;
  modifiedDate: Date;

}

export enum VideoAccessType {
  free = 'free',
  paid = 'paid'
}