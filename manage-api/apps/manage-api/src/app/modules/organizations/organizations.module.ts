import { AuthModule } from '@application/auth';
import { OrganizationSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as fromControllers from './controllers';
import * as fromServices from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Organization',
        schema: OrganizationSchema,
      },
    ]),
    SharedApiModule,
    AuthModule
  ],
  controllers: [...fromControllers.controllers],
  providers: [...fromServices.services],
})
export class OrganizationsModule {}
