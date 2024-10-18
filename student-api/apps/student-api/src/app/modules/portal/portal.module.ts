import { AuthModule } from '@application/auth';
import { AboutUsSchema, CareersSchema, SharedApiModule, UserMessageSchema } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AboutUsController } from './about-us.controller';
import { CareersController } from './careers.controller';
import { ContactUsController } from './contact-us.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'AboutUs',
        schema: AboutUsSchema,
      },
      {
        name: 'UserMessage',
        schema: UserMessageSchema,
      },
      {
        name: 'Career',
        schema: CareersSchema,
      },
    ]),
    SharedApiModule,
    AuthModule
  ],
  controllers: [AboutUsController, ContactUsController, CareersController],
})
export class PortalModule {}
