import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, FacultyRepositoryService } from '@application/ui';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'application-faculty-list-container',
  templateUrl: './faculty-list-container.component.html',
  styleUrls: ['./faculty-list-container.component.less'],
})
export class FacultyListContainerComponent implements OnInit, OnDestroy {

  faculty: FacultyInterface[];
  sub = new Subscription();
  length:number;
  errors: string[];
  createEnable:string
  constructor(
    private facultyRepo: FacultyRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.createEnable = localStorage.getItem('isAccess');
    window.sessionStorage.clear();
    this.sub.add(this.loadData());
  }

  loadData() {
    this.facultyRepo.getAllFaculty().subscribe(
      (res) => {
        this.faculty = res?.response;
        this.length =res.response.length
      },
      (err) => {
        console.error(err);
      }
    )
  }

  delete(faculty: FacultyInterface) {
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: faculty },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.facultyRepo.deleteFacultyByUuid(faculty.uuid).subscribe(
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
  }

  ngOnDestroy() {

    this.sub.unsubscribe();

  }
}
