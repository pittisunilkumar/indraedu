import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TestCategoryInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, TestCategoriesRepositoryService, TestsRepositoryService } from '@application/ui';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'application-test-category-list-container',
  templateUrl: './test-category-list-container.component.html',
  styleUrls: ['./test-category-list-container.component.less']
})
export class TestCategoryListContainerComponent implements OnInit, OnDestroy {

  tsCategories: TestCategoryInterface[];
  sub = new Subscription();
  length: number;
  errors: string[];

  constructor(
    private testCategoriesRepo: TestCategoriesRepositoryService,
    private testsRepo: TestsRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }
  createEnable: string
  ngOnInit(): void {
    this.createEnable = localStorage.getItem('isAccess');
    window.sessionStorage.clear();

    window.localStorage.removeItem('cUuid')
    window.localStorage.removeItem('categoryId')
    window.localStorage.removeItem('courseId')
    window.localStorage.removeItem('courseName')
    window.localStorage.removeItem('categoryName')
    window.localStorage.removeItem('testSubjects');
    window.localStorage.removeItem('testUuid');
    window.localStorage.removeItem('testName');
    window.localStorage.removeItem('questionType')
    window.localStorage.removeItem('lastOrder')
    window.localStorage.removeItem('path')

    this.sub.add(this.loadData());
  }

  loadData() {
    this.testCategoriesRepo.getAllTSCategories().subscribe(
      (res) => {
        this.tsCategories = res?.response;
        this.length = res.response.length
      },
      (err) => {
        console.error(err);
      }
    )
  }
  deleteTests() {
    console.log(this.tsCategories);

    this.tsCategories.map(res => {
      console.log(res.categories.tests);
      res.categories.tests.map(e => {
        this.testsRepo.deleteTestsByUuid(res.uuid,e.uuid).subscribe(
          (res) => {
          }
        );
      })


    })

  }

  delete(tsCategories: TestCategoryInterface) {
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: tsCategories.categories },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.testCategoriesRepo.deleteTSCategoriesByUuid(tsCategories.uuid).subscribe(
          (res) => {
            console.log({ res });
            this.loadData();
          },
          (err) => {
            console.log({ err });
            this.errors = err.error.error;
          }
        );
      }
    })
    // return this.testCategoriesRepo
    //   .deleteTSCategoriesByUuid(tsCategories.uuid)
    //   .pipe(take(1))
    //   .subscribe(
    //     (res) => {
    //       console.log({ res });
    //       this.loadData();
    //     },
    //     (err) => {
    //       console.error({ err });
    //     }
    //   );
  }

  edit(obj: TestCategoryInterface) {
    return this.router.navigate(['../', obj.uuid, 'edit'], { relativeTo: this.route });
  }

  ngOnDestroy() {

    this.sub.unsubscribe();

  }

}
