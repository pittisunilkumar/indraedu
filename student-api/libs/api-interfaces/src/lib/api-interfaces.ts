export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  // OTHER = 'OTHER',
}

export interface KeyInterface {
  uuid: string;
  title: string;
}

export interface EntityInterface {
  _id?: string;
  uuid: string;
  title: string;
  course_id:string
}

export interface FlagsInterface {
  active: boolean;
  paid?: boolean;
}

export interface ResponseInterface<T> {
  statusCode: number;
  message: string;
  response?: T;
  errors?: string[];
  ok: boolean;
}

export interface NewResponseInterface<T> {
  statusCode: number;
  message: string;
  data?: T;
  errors?: string[];
  status: boolean;
}

export enum EntityStatusEnum {
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  SUBMITTED = 'SUBMITTED',
  YET_TO_START = 'YET_TO_START',
}

export enum EntityStatusEnumForTestSeries {
  IN_PROGRESS = 1,
  PAUSED = 3,
  SUBMITTED = 2,
  YET_TO_START = 0
}

export interface objectInterface{
  Name: string;
  Amount: string;
  Items: any;
  Email: string;
  Mobile: string;
  payload: any;
  
}