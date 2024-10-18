import { CreateSubjectsContainerComponent } from './create-subjects-container/create-subjects-container.component';
import { CreateTopicsContainerComponent } from './create-topics-container/create-topics-container.component';
import { QuestionsListContainerComponent } from './questions-list-container/questions-list-container.component';
import { SubjectListContainerComponent } from './subject-list-container/subject-list-container.component';
import { TopicsListContainerComponent } from './topics-list-container/topics-list-container.component';

export const containers = [
  CreateTopicsContainerComponent,
  TopicsListContainerComponent,
  CreateSubjectsContainerComponent,
  SubjectListContainerComponent,
  QuestionsListContainerComponent,
];

export * from './create-subjects-container/create-subjects-container.component';
export * from './create-topics-container/create-topics-container.component';
export * from './subject-list-container/subject-list-container.component';
export * from './topics-list-container/topics-list-container.component';
export * from './questions-list-container/questions-list-container.component';