import { CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { SharedApiModule, TransformInterceptor } from '@application/shared-api';
import { environment } from '../environments/environment';
import * as fromModules from './modules';

@Module({
  imports: [
    CacheModule.register(),
    // MongooseModule.forRoot(environment.db), //Plato
    MongooseModule.forRoot('URL'), //whiteboard
    ...fromModules.modules,
    SharedApiModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
