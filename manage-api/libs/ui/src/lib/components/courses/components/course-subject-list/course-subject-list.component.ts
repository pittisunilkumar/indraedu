import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'application-course-subject-list',
  templateUrl: './course-subject-list.component.html',
  styleUrls: ['./course-subject-list.component.less']
})
export class CourseSubjectListComponent implements OnInit {
  payload:any;
  subscriptionData:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { payload: any },
  ) { }

  ngOnInit(): void {
    this.payload = this.data.payload;
    console.log(this.payload);
    
  }

}
