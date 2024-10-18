import { AuthModule } from '@application/auth';
import { RolesSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesController } from './roles.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Roles',
        schema: RolesSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [RolesController],
})
export class RolesModule {}

