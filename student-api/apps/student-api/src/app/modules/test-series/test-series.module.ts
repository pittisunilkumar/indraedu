import { AuthModule } from '@application/auth';
import { ReportErrorSchema, SharedApiModule, TestSchema, TSCategoriesSchema } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestCategoryController } from './test-category.controller';
import { TestsController } from './tests.controller';
import { TestsControllerV1 } from './tests-v1.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'ReportError',
        schema: ReportErrorSchema,
      },
      {
        name: 'TSCategories',
        schema: TSCategoriesSchema,
      },
      {
        name: 'Test',
        schema: TestSchema,
      },
    ]),
    SharedApiModule,
    AuthModule
  ],
  controllers: [TestCategoryController, TestsController, TestsControllerV1],
  providers: [],
})
export class TestSeriesModule {}
