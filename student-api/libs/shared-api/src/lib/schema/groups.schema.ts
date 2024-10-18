import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UserKeyInterface } from '@application/api-interfaces';
import { Course, Organization } from '@application/shared-api'; // Ensure this import is correct

@Schema()
export class Groups extends mongoose.Document {
  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;

  @Prop({ required: true })
  group_name: string;


  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]) // Use string 'Course'
  courses: [{ type: mongoose.Schema.Types.ObjectId; ref: 'Course' }]; // Array of ObjectIds

  @Prop({
    required: false,
    type: Date, // Correct type for Date
  })
  createdOn?: Date;

  @Prop({
    required: false,
    type: Date, // Correct type for Date
  })
  modifiedOn?: Date;

  @Prop({ required: true, type: Object })
  createdBy: UserKeyInterface;

  @Prop({ type: Object })
  modifiedBy: UserKeyInterface;

  @Prop({ required: true })
  active: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(Groups);
GroupSchema.set('validateBeforeSave', true);
