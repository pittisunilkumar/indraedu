import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Location } from '@angular/common';
@Component({
  selector: 'application-command-remove-dialog',
  templateUrl: './command-remove-dialog.component.html',
  styleUrls: ['./command-remove-dialog.component.less']
})
export class CommandRemoveDialogComponent implements OnInit {

  payload: any;
  form: FormGroup;
  errors: string[];
  type:string

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { payload: any, type: string },
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CommandRemoveDialogComponent>,
    private _location: Location
  ) { }

  ngOnInit() {
   console.log(this.data.payload);
   this.type = this.data.type;
   console.log('this.type',this.type);
    this.payload = this.data.payload;
    this.form = this.buildForm();
    this.errors = null;
    if(this.type == 'videoSubject'){
      this.payload = this.payload.syllabus;
    }

  }

  buildForm(): FormGroup {

    return this.formBuilder.group({});

  }

  async submit() {

    // try {

    //   this.errors = null;
    //   this.form.disable();

    //   await this.testRepo.deleteTestsByUuid(this.test.uuid).toPromise();

    //   this.dialogRef.close();

    // } catch (e) {

    //   this.errors = e;
    //   this.form.enable();

    // }

  }
 

}
