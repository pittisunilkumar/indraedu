import { UserKeyInterface } from './user-interface';

export interface CareerInterface {
  uuid: string;
  title: string;
  code: string;
  designation: string;
  department: DepartmentENum;
  description: string;
  qualifications: string[];
  requirements: string[];
  skills: SkillsInterface;
  flags: CareersFlagsInterface;
  createdOn: Date;
  modifiedOn?: Date;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
}

export interface SkillsInterface { mustHave: string[]; goodToHave: string[]; }

export enum DepartmentENum {
  EDITING = 'EDITING',
  DATAENTRY = 'DATAENTRY',
  TELECALLING = 'TELECALLING',
  DEVELOPERS = 'DEVELOPERS',
  FINANCE = 'FINANCE',
  ACCOUNTS = 'ACCOUNTS',
  OPERATIONS = 'OPERATIONS',
  ADMINISTRATION = 'ADMINISTRATION',
  SALESMARKETING = 'SALESMARKETING',
  RECRUITMENT = 'RECRUITMENT',
  HR = 'HR'
}

export interface CareersFlagsInterface {
  active: boolean;
  editable: boolean;
}
