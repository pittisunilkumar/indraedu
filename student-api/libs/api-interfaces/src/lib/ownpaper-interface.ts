import { SyllabusInterface, UserKeyInterface,QuestionInterface } from '@application/api-interfaces';

export interface OwnPaperInterface{

  examId: string;
  testName:string;
  examMode:string;
  createdOn: Date;
  questions: QuestionInterface[];
}

