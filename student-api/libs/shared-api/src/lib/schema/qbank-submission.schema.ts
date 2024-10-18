import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import type { EntityInterface, QBankSubmissionTopicInterface } from '@application/api-interfaces';

@Schema()
export class QBankSubmission extends mongoose.Document {

  @Prop({ required: true })
  uuid: string;

  @Prop({ required: true })
  user_id: number;

  @Prop({ required: false })
  qbank_completed_count: number;

  @Prop({ required: false })
  qbank_inprogress_count: number;

  @Prop({ required: true, type : mongoose.Schema.Types.ObjectId })
  subject_id: EntityInterface;

  @Prop({ required: true, type: Array })
  qbank_topics: QBankSubmissionTopicInterface[];
}

export const QBankSubmissionSchema = SchemaFactory.createForClass(QBankSubmission);
QBankSubmissionSchema.set('validateBeforeSave', true);
