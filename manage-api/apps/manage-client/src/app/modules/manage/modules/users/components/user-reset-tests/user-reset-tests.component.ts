import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService, NotificationType, QBankRepositoryService, TestCategoriesRepositoryService, UsersRepositoryService } from '@application/ui';

@Component({
  selector: 'application-user-reset-tests',
  templateUrl: './user-reset-tests.component.html',
  styleUrls: ['./user-reset-tests.component.less']
})
export class UserResetTestsComponent implements OnInit {
  userName: string;
  userId: string;
  testType: string;
  qbankDisplayedColumns: string[] = [
    'sno',
    'course',
    'chapter',
    'topic',
    'actions',
  ];
  testDisplayedColumns: string[] = [
    'sno',
    'course',
    'category',
    'test',
    'actions',
  ];
  filteredList: any;
  list: any;
  qbankDataSource: any;
  testDataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private router: Router,
    private userService: UsersRepositoryService,
    private route: ActivatedRoute,
    private qbankService: QBankRepositoryService,
    private notification: NotificationService,
    private testCategoryService: TestCategoriesRepositoryService,
  ) { }

  ngOnInit(): void {
    this.testType = 'test'
    this.userName = window.sessionStorage.getItem('userName');
    this.userId = this.route.snapshot.paramMap.get('id');

    this.userService.userAttemptedTests({ userId: this.userId }).subscribe((result: any) => {
      this.filteredList = this.list = result.response.test_series
      this.testDataSource = new MatTableDataSource(result.response.test_series);
      this.testDataSource.paginator = this.paginator;
    })
  }

  getTestType(mode) {
    this.testType = mode.value;
    if (this.testType == 'qbank') {
      this.userService.userAttemptedQbankTopics({ userId: this.userId }).subscribe((result: any) => {
        this.filteredList = this.list = result.response.qbank_data
        this.qbankDataSource = new MatTableDataSource(this.filteredList);
        this.qbankDataSource.paginator = this.paginator;
      })
    }
    else if (this.testType == 'test') {
      this.testDataSource.paginator = this.paginator;
    }
  }

  resetQbankTopic(topic) {
    let payload = {
      "courseId": topic.courseId,
      "subjectId": topic.subjectId,
      "qbankTopicUuid": topic.qbankTopicUuid
    }
    this.qbankService.resetQbankTopic(this.userId, payload).subscribe(result => {
      if (result) {
        this.notification.showNotification({
          type: NotificationType.SUCCESS,
          payload: {
            message: `${topic.Qbank.title} Reset Successfully`,
            statusCode: 200,
            statusText: 'Successfully',
            status: 201
          },
        });
        window.location.reload();
      }
    })

  }

  resetTest(test) {
    let payload = {
      userId: this.userId,
      courseId: test.courseId,
      subjectId: test.subjectId,
      categoryUuid: test.categoryUuid,
      testSeriesUuid: test.testSeriesUuid,
    }
    this.testCategoryService.resetAttemptedTests(payload).subscribe(result => {
      if (result) {
        this.notification.showNotification({
          type: NotificationType.SUCCESS,
          payload: {
            message: `${test.testSeries.title} Reset Successfully`,
            statusCode: 200,
            statusText: 'Successfully',
            status: 201
          },
        });
        window.location.reload()
      }
    })

  }


  applyFilter(event) {
    console.log('event', event);
    let filterValue = event.trim()
    if (filterValue) {
      if (this.testType == 'qbank') {
        this.filteredList = this.list.filter((test) => {
          return (
            test?.courses[0].title.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
            test?.Qbank.chapter_title.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
            test?.Qbank.title.toLowerCase().includes(filterValue.toLocaleLowerCase()) 
          )
        });
        this.qbankDataSource = new MatTableDataSource(this.filteredList);
      }
      else if (this.testType == 'test') {
        this.filteredList = this.list.filter((test) => {
          return (
            test?.courses[0].title.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
            test?.testSeries.categorie_title.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
            test?.testSeries.title.toLowerCase().includes(filterValue.toLocaleLowerCase()) 
          )
        });
        this.testDataSource = new MatTableDataSource(this.filteredList);
      }
    }
    else {
      if (this.testType == 'qbank') {
        this.qbankDataSource = new MatTableDataSource(this.list);
      }
      else if (this.testType == 'test') {
        this.testDataSource = new MatTableDataSource(this.list);
      }
    }
  }
  backToUsers() {
    this.router.navigate(['/manage/users/list'])
  }
}
