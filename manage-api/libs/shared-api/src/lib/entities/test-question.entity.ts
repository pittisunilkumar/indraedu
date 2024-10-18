import { QuestionOptionsInterface } from '@application/api-interfaces';
import { Exclude } from 'class-transformer';

export class TestQuestionEntity {

  uuid: string;
  title: string;
  options?: QuestionOptionsInterface[];
  imgUrl?: string;
  order?: number;

  constructor(partial: Partial<TestQuestionEntity>) {
    Object.assign(this, partial);
  }
}
