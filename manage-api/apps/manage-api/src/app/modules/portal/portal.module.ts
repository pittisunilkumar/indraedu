import { AuthModule } from '@application/auth';
import { AboutUsSchema, SharedApiModule } from '@application/shared-api';
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
    ]),
    SharedApiModule,
    AuthModule
  ],
  controllers: [AboutUsController, CareersController, ContactUsController],
})
export class PortalModule {}
