import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'application-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.less']
})
export class AlertDialogComponent implements OnInit {

  payload: any;
  form: FormGroup;
  errors: string[];
  type:string

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { payload: any, type: string },
    private formBuilder: FormBuilder,
    private _location:Location,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.type = this.data.type;
    this.payload = this.data.payload;
  }

  async submit() {
   this.router.navigate(['/q-bank/subjects/list'])
  }

}
