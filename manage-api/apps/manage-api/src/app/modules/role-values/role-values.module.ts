import { AuthModule } from '@application/auth';
import { RoleModuleSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleValuesController } from './role-values.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'RoleModules',
        schema: RoleModuleSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [RoleValuesController],
})
export class RoleValuesModule {}
