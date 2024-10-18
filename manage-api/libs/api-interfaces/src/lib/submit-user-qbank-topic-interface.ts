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
  flags: {
    correct?: boolean;
    wrong?: boolean;
  }
}

export interface UserQBankTopicStatsInterface {
  total: number;
  correct: number;
  wrong: number;
  percentages: {
    correct: number;
    wrong: number;
  }
}

export interface SubmitUserQBankTopicInterface {
  uuid: string;
  user: UserKeyInterface; // { _id: '123', uuid: '1234', name: 'kvkb', mobile: 1234 }
  subject: EntityInterface; //  { _id: '123', uuid: '1234', title: 'cat 1' }
  course: EntityInterface; //  { _id: '123', uuid: '1234', title: 'course 1' }
  topic: EntityInterface; //  { _id: '123', uuid: '1234', title: 'test 1' }
  answers: QBankTopicAnswerInterface[];
  submittedOn: Date;
  count?: number;
  rank: number;
  totalUsers: number;
  stats?: UserQBankTopicStatsInterface;
}
