import {
  FlagsInterface, TestCategoryInterface, TestSeriesCategoryInterface, UserKeyInterface,
} from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Course } from './course.schema';

@Schema()
export class TSCategories extends mongoose.Document {

  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;

  // @Prop({ required: true })
  // title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Course.name })
  courses: string;

  // @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Course.name }])
  // @ApiProperty({ example: [Course], description: 'Courses' })
  // courses: string[];

  // @Prop({ required: true })
  // order: number;

  // @Prop({ required: false })
  // tests: string[];

  // @Prop({ required: false })
  // count: number;

  // @Prop({ required: false })
  // userCompletedCount: number;

  // @Prop({ required: true })
  // schedulePdf: string;

  // @Prop({ required: true})
  // categories: TestCategoryInterface;

  
  @Prop({ required: true,type: Object })
  categories: TestSeriesCategoryInterface;

  @Prop({
    required: false,
  })
  scheduledDate: Date;

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

  @Prop({ required: true, type: Object })
  flags: FlagsInterface;
}
// export class TSCategories extends mongoose.Document {

  // @Prop({ required: true })
  // uuid: string;

  // @Prop()
  // id: string;

  // @Prop({ required: true })
  // title: string;

  // @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Course.name }])
  // @ApiProperty({ example: [Course], description: 'Courses' })
  // courses: string[];

  // @Prop({ required: true })
  // order: number;

  // @Prop({ required: false })
  // tests: string[];

  // @Prop({ required: false })
  // count: number;

  // @Prop({ required: false })
  // userCompletedCount: number;

  // @Prop({ required: true })
  // schedulePdf: string;

  // @Prop({
  //   required: false,
  //   type: String,
  // })
  // createdOn?: Date;

  // @Prop({
  //   required: false,
  //   type: String,
  // })
  // modifiedOn?: Date;

  // @Prop({ required: true, type: Object })
  // createdBy: UserKeyInterface;

  // @Prop({ type: Object })
  // modifiedBy: UserKeyInterface;

  // @Prop({ required: true, type: Object })
  // flags: FlagsInterface;
// }

export const TSCategoriesSchema = SchemaFactory.createForClass(TSCategories);
TSCategoriesSchema.set('validateBeforeSave', true);
