import {
    UserKeyInterface,
  } from '@application/api-interfaces';
  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import * as mongoose from 'mongoose';
  
  
  @Schema()
  export class Disableuserfortestsubmits extends mongoose.Document {
  
    @Prop({ required: true })
    uuid: string;
  
    @Prop()
    id: string;
  
    @Prop({ required: true })
    mobile: string;

    @Prop({ required: true })
    subscription: boolean;

    @Prop({ required: true })
    submission: boolean;

    @Prop({ required: true })
    showInActiveCourses: boolean;
  
    @Prop({ required: true })
    status: boolean;
  
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
    createdBy: UserKeyInterface;
  
    @Prop({ type: Object })
    modifiedBy: UserKeyInterface;
  
  }
  
  export const DisableuserfortestsubmitSchema = SchemaFactory.createForClass(Disableuserfortestsubmits);
  DisableuserfortestsubmitSchema.set('validateBeforeSave', true);
  