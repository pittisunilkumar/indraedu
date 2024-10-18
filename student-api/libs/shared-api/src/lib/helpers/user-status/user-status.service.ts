import { QBankInterface, SubmitUserQBankTopicInterface, SubmitUserTestInterface, EntityStatusEnum } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { QBank, Test, User } from '../../schema';

@Injectable()
export class UserStatusService {

  getUserTestStatus(
    user: User,
    test?: Test,
  ) {

    let testStatus: string,
      submittedTests: SubmitUserTestInterface[] | SubmitUserQBankTopicInterface[],
      inProgressTests;

      submittedTests = user?.submissions?.tests?.filter(it => {
        // console.log('submittedTest', { it });
        return it.testSeriesUuid === test.uuid &&
          test?.categories?.filter(cat => cat.uuid === it.categoryUuid)?.length;
      });

      inProgressTests = user?.tests?.filter(it => {
        console.log('inProgressTest', { it });

        return it.test.uuid === test.uuid &&
        test?.categories?.filter(cat => cat.uuid === it.category.uuid)?.length;

      });

    // console.log({ submittedTests, inProgressTests });

    testStatus = submittedTests?.length ? EntityStatusEnum.SUBMITTED :
      inProgressTests?.length ? inProgressTests[0].status :
      EntityStatusEnum.YET_TO_START;

    // console.log({ submittedTest, inProgressTest, testStatus });

    return {
      testStatus,
      startedAt: inProgressTests?.length ? inProgressTests[0]?.startedAt : null,
      stoppedAt: inProgressTests?.length ? inProgressTests[0]?.stoppedAt : null
    }

  }

  getUserTopicStatus(
    user: User,
    qbTopic?: QBankInterface,
  ) {

    let testStatus: string,
      submittedTests: SubmitUserTestInterface[] | SubmitUserQBankTopicInterface[],
      inProgressTests;

      submittedTests = user?.submissions?.qbanks?.filter(it => {
        // console.log('submittedTest', { it });
        return it.qbankTopicUuid === qbTopic.uuid &&
        qbTopic?.subject?._id === it.subjectId;
      });

      inProgressTests = user?.qbanks?.filter(it => {
        console.log('inProgressTest', { it });

        return it.qbankTopicUuid === qbTopic.uuid &&
        qbTopic?.subject?._id === it.subjectId;

      });

    // console.log({ submittedTests, inProgressTests });

    testStatus = submittedTests?.length ? EntityStatusEnum.SUBMITTED :
      inProgressTests.length ? inProgressTests[0].status :
      EntityStatusEnum.YET_TO_START;

    // console.log({ submittedTest, inProgressTest, testStatus });

    return {
      testStatus,
      startedAt: inProgressTests[0] ? inProgressTests[0].startedAt : null,
      stoppedAt: inProgressTests[0] ? inProgressTests[0].stoppedAt : null
    }

  }

}
