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
import { MobilePearlsService } from './pearls.service';
import { MobilePearlsSubjectsService } from './pearls-subjects.service';
import { PaymentGatewayService } from './payment-gateway.service';
import { SupportTicketService } from './support-tickets/support-ticket.service';
import { MobileFeedbackService } from './feedback/feedback.service';
import { PaymentGatewayServiceV1 } from './v1/payment-gateway.service';


//Suman Tv
import { MobileSumanTvHomeService } from './suman-tv/home.service'
import { AWSS3Service } from 'libs/ui/src/lib/finders/aws-s3.service';
import { SubmitTestServiceV1 } from './test-series/submit-test/submit-test-v1-service';
import { FirebaseService } from './firebase-service';

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
  SubmitTestServiceV1,
  TestResultsService,
  PaymentGatewayService,
  MobilePearlsService,
  MobilePearlsSubjectsService,
  MobileSumanTvHomeService,
  SupportTicketService,
  MobileFeedbackService,
  AWSS3Service,
  PaymentGatewayServiceV1,
  FirebaseService
];

export * from './home.service';
export * from './qbank/qbank-subject.service';
export * from './qbank/qbank.service';
export * from './qbank/submit-topic/submit-topic.service';
export * from './qbank/submit-topic-results/submit-topic-results.service';
export * from './subscription.service';
export * from './test-series/submit-test/submit-test.service';
export * from './test-series/submit-test/submit-test-v1-service';
export * from './test-series/test-category.service';
export * from './test-series/test-results/test-results.service';
export * from './test-series/tests.service';
export * from './users.service';
export * from './video-subject.service';
export * from './videos.service';
export * from './payment-gateway.service';
export * from './pearls.service';
export * from './pearls-subjects.service';
export * from './suman-tv/home.service';
export * from './support-tickets/support-ticket.service';
export * from './feedback/feedback.service';
export * from 'libs/ui/src/lib/finders/aws-s3.service';
export * from './v1/payment-gateway.service';
export * from './firebase-service';
