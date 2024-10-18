import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TestInterface } from '@application/api-interfaces';
import { TestsRepositoryService } from '../../repositories';

@Component({
  selector: 'application-test-remove-dialog',
  templateUrl: './test-remove-dialog.component.html',
  styleUrls: ['./test-remove-dialog.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestRemoveDialogComponent implements OnInit {

  test: TestInterface
  form: FormGroup;
  errors: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { test: TestInterface },
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TestRemoveDialogComponent>,
    private testRepo: TestsRepositoryService,
  ) { }

  ngOnInit() {

    this.test = this.data.test;
    this.form = this.buildForm();
    this.errors = null;

  }

  buildForm(): FormGroup {

    return this.formBuilder.group({});

  }

  async submit() {

    try {

      this.errors = null;
      this.form.disable();

      // await this.testRepo.deleteTestsByUuid(this.test.uuid).toPromise();

      this.dialogRef.close();

    } catch (e) {

      this.errors = e;
      this.form.enable();

    }

  }

}
