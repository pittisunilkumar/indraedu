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
    isBookMarked?: boolean;
  }
}

export interface UserTestStatsInterface {
  secureMarks: number;
  totalMarks : number;
  correct: number;
  correctMarks: number;
  wrong: number;
  wrongMarks: number;
  skipped: number;
  skippedMarks: number;
  markAsGuessed : number;
  markAsGuessedMarks: number;
  attempted : number;
  review : number;
  bookmarkCount : number,
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
  userId: any; // { _id: '123', uuid: '1234', name: 'kvkb', mobile: 1234 }
  categoryUuid: any; //  { _id: '123', uuid: '1234', title: 'cat 1' }
  courseId: any; //  { _id: '123', uuid: '1234', title: 'course 1' }
  testSeriesUuid: any; //  { _id: '123', uuid: '1234', title: 'test 1' }
  subjectId: any; //  { _id: '123', uuid: '1234', title: 'test 1' }
  totalTime ?:number
  answers: TestAnswerInterface[];
  submittedOn: Date;
  count?: number;
  rank: number;
  totalUsers: number;
  stats?: UserTestStatsInterface;
  status ?: number;
  startedAt?: Date;
  stoppedAt?: Date;
}
