import { AuthModule } from '@application/auth';
import { SharedApiModule, TestSchema, TSCategoriesSchema } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestCategoryController } from './test-category.controller';
import { TestsController } from './tests.controller';
import { TestSeriesController } from './test-series.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'TSCategories',
        schema: TSCategoriesSchema,
      },
      {
        name: 'Test',
        schema: TestSchema,
      },
    ]),
    SharedApiModule, AuthModule],
    controllers: [
      TestCategoryController,
      TestsController,
      TestSeriesController
    ],
    providers: [],
})
export class TestSeriesModule {}
