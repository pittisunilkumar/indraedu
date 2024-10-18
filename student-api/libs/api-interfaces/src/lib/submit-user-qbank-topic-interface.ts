import { EntityInterface } from './api-interfaces';
import { QuestionOptionsInterface } from './question-interface';
import { UserKeyInterface } from './user-interface';

export interface QBankTopicAnswerInterface {
  question: {
    uuid: string;
    title: string;
    options?: QuestionOptionsInterface[];
    imgUrl?: string;
    _id: string;
    order: number;
    answer: number; // Original answer
    positive?: number;
    negative?: number;
  }
  answer?: number; // USer's Answer
  attemptedInSeconds?: number; // USer's question time
  flags: {
    correct?: boolean;
    attempted? :boolean;
    isBookMarked?: boolean;
    wrong?: boolean;
  }
}

export interface UserQBankTopicStatsInterface {
  total: number;
  correct: number;
  wrong: number;
  totalAttempted : number
  percentages: {
    correct: number;
    wrong: number;
  }
}

export interface SubmitUserQBankTopicInterface {
  uuid: string;
  userId: any; // { _id: '123', uuid: '1234', name: 'kvkb', mobile: 1234 }
  subjectId: any; //  { _id: '123', uuid: '1234', title: 'cat 1' }
  courseId: any; //  { _id: '123', uuid: '1234', title: 'course 1' }
  qbankTopicUuid: any; //  { _id: '123', uuid: '1234', title: 'test 1' }
  answers: QBankTopicAnswerInterface[];
  status: number;
  startedAt?: Date;
  stoppedAt?: Date;
  count?: number;
  lastAttemptedQuestion? :number;
  rank: number;
  totalUsers: number;
  stats?: UserQBankTopicStatsInterface;
}
