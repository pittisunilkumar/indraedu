export interface StuSubjectInterface {
  id: string;
  subject_name: string;
  icon: string;
  exam_id: string;
  image?: string;
  video_path?: string;
  total_time: string;
  delete_status: string;
  created_on: string;
  modified_on: string;
  total_videos_count: string;
  video_ids: string;
  seenVedioCount: number;
}

export interface StuCourseInterface {
  created_on: string;
  delete_status: string;
  exam_id: string;
  exam_name: string;
  id: string;
  image: string;
  status: string;
  user_id: string;
  users_exams: string;
  subjects: StuSubjectInterface[]
}
