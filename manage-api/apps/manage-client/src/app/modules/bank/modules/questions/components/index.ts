import { CreateBlankQuestionsComponent } from './create-blank-questions/create-blank-questions.component';
import { CreateMatchQuestionsComponent } from './create-match-questions/create-match-questions.component';
import { CreateQuestionsComponent } from './create-questions/create-questions.component';
import { CreateTrueFalseQuestionsComponent } from './create-true-false-questions/create-true-false-questions.component';
import { McqQuestionsListComponent } from './mcq-questions-list/mcq-questions-list.component';
import { McqQuestionsComponent } from './mcq-questions/mcq-questions.component';
import { QuestionPreviewComponent } from './question-preview/question-preview.component';
import { QuestionsListComponent } from './questions-list/questions-list.component';

export const components = [
  QuestionsListComponent,
  CreateQuestionsComponent,
  QuestionPreviewComponent,
  CreateBlankQuestionsComponent,
  CreateTrueFalseQuestionsComponent,
  CreateMatchQuestionsComponent,
  McqQuestionsComponent,
  McqQuestionsListComponent
];

export * from './create-questions/create-questions.component';
export * from './questions-list/questions-list.component';
export * from './question-preview/question-preview.component';
export * from './create-blank-questions/create-blank-questions.component';
export * from './create-true-false-questions/create-true-false-questions.component';
export * from './create-match-questions/create-match-questions.component';
export * from './mcq-questions/mcq-questions.component';
export * from './mcq-questions-list/mcq-questions-list.component';



