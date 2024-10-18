import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { QBankSubjectInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, QBankRepositoryService } from '@application/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'application-subject-list-container',
  templateUrl: './subject-list-container.component.html',
  styleUrls: ['./subject-list-container.component.less']
})
export class SubjectListContainerComponent implements OnInit {

  list: QBankSubjectInterface[];
  _sub = new Subscription();
  errors: string[];

  constructor(
    private qbankRepo: QBankRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }
  createEnable:string
  ngOnInit(): void {
    this.createEnable = localStorage.getItem('isAccess');
    window.sessionStorage.clear();

    window.localStorage.removeItem('subjectName');
    window.localStorage.removeItem('subjectUuid');
    window.localStorage.removeItem('syllabusUuid');
    window.localStorage.removeItem('syllabus_id');
    window.localStorage.removeItem('Qbank_id');
    window.localStorage.removeItem('courseId');
    window.localStorage.removeItem('topicUuid');
    window.localStorage.removeItem('topicName');
    window.localStorage.removeItem('chapteruuid');
    window.localStorage.removeItem('chapterName');
    window.localStorage.removeItem('questionType');
    window.localStorage.removeItem('path');


    this._sub.add(this.loadData());

  }

  loadData() {

    return this.qbankRepo.getAllQBankSubjects().subscribe(
      (res) => {
        this.list = res.response;
      }
    );

  }

  deleteSubject(subject: QBankSubjectInterface) {

    const dialogRef =  this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: subject.syllabus },
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result) {

        this.qbankRepo.deleteQBankSubjectsByUuid(subject.uuid).subscribe(
          (res) => {
            console.log({ res });
            this._sub.add(this.loadData());
          },
          (err) => {
            this.errors = err;
            console.error({ err });
          }
        );

      }

    });

  }

}
