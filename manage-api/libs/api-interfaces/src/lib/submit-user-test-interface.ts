import { EntityInterface } from './api-interfaces';
import { QuestionOptionsInterface } from './question-interface';
import { UserKeyInterface } from './user-interface';

export interface TestAnswerInterface {
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
    markForReview: boolean;
    markAsGuessed: boolean;
    attempted: boolean;
    skipped: boolean;
    correct: boolean;
    wrong: boolean;
    guessedCorrect: boolean;
    guesssedWrong: boolean;
  }
}

export interface UserTestStatsInterface {
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  guessed: {
    total: number;
    correct: number;
    wrong: number;
  };
  percentages: {
    correct: number;
    wrong: number;
    skipped: number;
    guessedTotal: number;
  }
}

export interface SubmitUserTestInterface {
  uuid: string;
  user: UserKeyInterface; // { _id: '123', uuid: '1234', name: 'kvkb', mobile: 1234 }
  category: EntityInterface; //  { _id: '123', uuid: '1234', title: 'cat 1' }
  course: EntityInterface; //  { _id: '123', uuid: '1234', title: 'course 1' }
  test: EntityInterface; //  { _id: '123', uuid: '1234', title: 'test 1' }
  answers: TestAnswerInterface[];
  submittedOn: Date;
  count?: number;
  rank: number;
  totalUsers: number;
  stats?: UserTestStatsInterface;
}
