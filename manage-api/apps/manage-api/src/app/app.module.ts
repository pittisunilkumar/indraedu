import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { TransformInterceptor } from '@application/shared-api';
import { environment } from '../../src/app/environments/environment';
import * as fromModules from './modules';

@Module({
  imports: [
    MongooseModule.forRoot(environment.db),
    ...fromModules.modules,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
