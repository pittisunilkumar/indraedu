export interface StuQuestionInterface {
  id: string;
  course_id: string;
  category_id: string;
  quiz_id: string;
  question: string;
  question_image: string;
  answer: string;
  explanation: string;
  explanation_image: string;
  reference: string;
  created_on: string;
  modified_on: string;
  question_id: string;
  topic_title: string;
  reported: string;
  question_order_id: string;
  percentage: string;
  options: StuOptionInterface[]
}

export interface StuOptionInterface {
  id: string;
  course_id: string;
  category_id: string;
  quiz_id: string;
  question_id: string;
  options: string;
  image: string;
  created_on: string;
  modified_on: string;
  clicked: boolean;
  guessed: boolean;
  forReview: boolean;
}