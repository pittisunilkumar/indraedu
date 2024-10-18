import { AuthModule } from '@application/auth';
import { RoleSubModulesSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSubModulesController } from './role-submodules.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'RoleSubModules',
        schema: RoleSubModulesSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [RoleSubModulesController],
})
export class RoleSubModulesModule {}
