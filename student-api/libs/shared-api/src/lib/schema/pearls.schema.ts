import type{ SyllabusInterface, UserKeyInterface } from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Question } from './questions.schema';
import * as mongoose from 'mongoose';

import type{
    
    FlagsInterface,
    PearlsQueIdsInterface,
  } from '@application/api-interfaces';
  import { ApiProperty } from '@nestjs/swagger';

  @Schema()
export class Pearls extends mongoose.Document {

  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  number : number;

  @Prop({ required: true })
  explaination: string;
  
  @Prop([{required: false,type: mongoose.Schema.Types.ObjectId, ref: Question.name }])
  queIds: PearlsQueIdsInterface[];

  @Prop({
    required: false,
    type: String,
  })
  createdOn?: Date;

  @Prop({
    required: false,
    type: String,
  })
  modifiedOn?: Date;

  @Prop({ required: true, type: Object })
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Srinivas' },
    description: 'UUID & Name of the user created it'
  })
  createdBy: UserKeyInterface;

  @Prop({ type: Object })
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Srinivas' },
    description: 'UUID & Name of the user modified it'
  })
  modifiedBy: UserKeyInterface;

  @Prop({ required: true, type: Object })
  flags: FlagsInterface;
    response: any;


}

export const PearlsSchema = SchemaFactory.createForClass(Pearls);
PearlsSchema.set('validateBeforeSave', true);