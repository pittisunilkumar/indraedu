import { MobileHomeService } from './home.service';
import { MobileQbankSubjectService } from './qbank/qbank-subject.service';
import { MobileQbankService } from './qbank/qbank.service';
import { SubmitTopicResultsService } from './qbank/submit-topic-results/submit-topic-results.service';
import { SubmitQbankTopicService } from './qbank/submit-topic/submit-topic.service';
import { MobileSubscriptionService } from './subscription.service';
import { SubmitTestService } from './test-series/submit-test/submit-test.service';
import { MobileTestCategoryService } from './test-series/test-category.service';
import { TestResultsService } from './test-series/test-results/test-results.service';
import { MobileTestsService } from './test-series/tests.service';
import { MobileUsersService } from './users.service';
import { MobileVideoSubjectService } from './video-subject.service';
import { MobileVideosService } from './videos.service';

export const mobileServices = [
  MobileHomeService,
  MobileQbankService,
  MobileQbankSubjectService,
  SubmitQbankTopicService,
  SubmitTopicResultsService,
  MobileVideosService,
  MobileVideoSubjectService,
  MobileSubscriptionService,
  MobileTestCategoryService,
  MobileTestsService,
  MobileUsersService,
  SubmitTestService,
  TestResultsService,
];

export * from './home.service';
export * from './qbank/qbank-subject.service';
export * from './qbank/qbank.service';
export * from './qbank/submit-topic/submit-topic.service';
export * from './qbank/submit-topic-results/submit-topic-results.service';
export * from './subscription.service';
export * from './test-series/submit-test/submit-test.service';
export * from './test-series/test-category.service';
export * from './test-series/test-results/test-results.service';
export * from './test-series/tests.service';
export * from './users.service';
export * from './video-subject.service';
export * from './videos.service';
