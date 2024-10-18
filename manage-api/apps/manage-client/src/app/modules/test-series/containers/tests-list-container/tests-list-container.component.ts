import { Location } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TestInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, TestCategoriesRepositoryService ,TestsRepositoryService} from '@application/ui';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'application-tests-list-container',
  templateUrl: './tests-list-container.component.html',
  styleUrls: ['./tests-list-container.component.less']
})
export class TestsListContainerComponent implements OnInit, OnDestroy {
  _sub = new Subscription();
  tests: TestInterface[];
  catUuid:any;
  errors: string[];
  length:number;
  categoryUuid:string;
  uuid:string;
  category:any
  
  constructor(
    private testsCatRepo: TestCategoriesRepositoryService,
    private testsRepo: TestsRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _location: Location,
  ) { }

  ngOnInit(): void {
    this.catUuid = this.route.snapshot.paramMap.get('uuid');
    console.log('this.catUuid',this.catUuid);
    
    this._sub.add(this.loadData());
  }

  loadData() {
    this.testsCatRepo.getTestsByUuid(this.catUuid).subscribe(
      (res) => {
        this.category = res.response[0].categories
        this.tests = res.response[0].categories.tests;
        // this.length = res.response.length
      }
    )
  }

  // openTestRemovedialog(test: TestInterface) {
  // }

  delete(test: TestInterface) {
    // this.uuid = window.sessionStorage.getItem('cUuid');
    this.uuid = window.localStorage.getItem('cUuid');

    const dialogRef =  this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: test },
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result) {
        this.testsRepo.deleteTestsByUuid(this.uuid,test.uuid).subscribe(
          (res) => {
            console.log({ res });
            window.location.reload();
            // this._sub.add(this.loadData());
          },
          (err) => {
            this.errors = err;
            console.error({ err });
          }
        );
      }

    });


  }

  edit(obj: TestInterface) {
    // this.categoryUuid =window.sessionStorage.getItem('cUuid')
    this.categoryUuid =window.localStorage.getItem('cUuid')
    return this.router.navigate(['../',obj.uuid, 'edit'], { relativeTo: this.route });
  }

  viewQuestions(obj: TestInterface) {
    // this.categoryUuid =window.sessionStorage.getItem('cUuid')
    this.categoryUuid =window.localStorage.getItem('cUuid')
    // return this.router.navigate(['../' ,obj.uuid, 'view-questions'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
  backToTests(){
    this._location.back()
  }
}
