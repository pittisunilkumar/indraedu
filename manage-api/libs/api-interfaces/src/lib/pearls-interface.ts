import { FlagsInterface, UserKeyInterface } from '@application/api-interfaces';
import { ObjectId } from 'mongodb';

export interface PeralInputSubjectInterface{
  qUuid ? : string;
  subjectId ?: string;
  chapterId ?: string;
  pearlIds  : PeralInputSubjectInterfaceIds;
 
 }

 export interface PeralInputSubjectInterfaceIds{
  qUuid ? : string;
  subjectId ?: string;
  chapterId ?: string;
  pearlIds  : ObjectId;
 
 }
export interface PeralSubjectInterface{

  chapterUuid ?: string;
  pearlUuids : []
 
 }

 export interface pearlIdInterface{
   pearlId ? : []
 }
 export interface PearlChapterInterface{
  pearlId ?: pearlIdInterface[];
}

 export interface PearlSubjectInputInterface{
  subjectId ?: string;
  chapterId ?: string;
  pearlId ? : string;
}

 export interface PearlsQueIdsInterface{
  queUuids?: string;
}



  
  export interface PearlsInputInterface{
    uuid: string;
    title: string;
    explaination: string;
    queIds: PearlsQueIdsInterface[];
    createdOn: Date;
    modifiedOn?: Date;
    createdBy: UserKeyInterface;
    modifiedBy?: UserKeyInterface;
    flags: FlagsInterface;

  }