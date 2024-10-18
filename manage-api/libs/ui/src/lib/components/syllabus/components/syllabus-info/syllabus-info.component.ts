import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'application-syllabus-info',
  templateUrl: './syllabus-info.component.html',
  styleUrls: ['./syllabus-info.component.less']
})
export class SyllabusInfoComponent implements OnInit {
  payload:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { payload: any },
  ) { }

  ngOnInit(): void {
    this.payload = this.data.payload;
  }

}
