import { EntityInterface } from './api-interfaces';
import { QuestionOptionsInterface } from './question-interface';
import { UserKeyInterface } from './user-interface';

export interface QBankSubmissionTopicInterface {
  chapter_uuid: string;
  topic_uuid: string;
  topic_status?: string[];
  total_que_attempt : string;
  subcription_status: string;
  rating: number;
  correct_answer_count: number; // Original answer
  worng_answer_count : number;
  skipped_count : number;
  correct_marks : number;
  worng_marks : number;
  correct_percentage : number;
  worng_percentage : number;
  skipped_percentage : number;
  total_marks : number;
  guessed_count : number;
  guessed_correct_count : number;
  guessed_worng_count : number;
  guessed_correct_percentage : number;
  guessed_wornge_percentage : number;
  reviews : number;
  bookmark_count : number;
  book_mark_ids : [];
  report_ids : [];
  questions_arr : QBankTopicAnswerInterfacee[];
}


export interface QBankTopicAnswerInterfacee {
    uuid: string;
    user_response: number; // Original answer
    positive?: number;
    negative?: number;
    correct_answer ?: number; // USer's Answer
    answer_status ?: string; // USer's Answer
    bookmark_status ?: boolean; // USer's Answer
    report ?: boolean; // USer's Answer
    flags: {
      correct?: boolean;
      wrong?: boolean;
    }
}
