import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserCSVModel } from '@application/ui';

@Component({
  selector: 'application-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.less'],
})
export class CreateUserComponent implements OnInit {
  createUserForm: FormGroup;
  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createUserForm = this.buildForm();
  }

  buildForm() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      mobile: [null, Validators.required],
      email: ['', Validators.required],
      courses: [null],
      location: ['', Validators.required],
      college: [''],
      flags: this.formBuilder.group({
        active: false,
        paid: false,
      }),
      imgUrl: [''],
      createdOn: ['', Validators.required],
      modifiedOn: [''],
      gender: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  uploadListener($event: any): void {
    const text = [];
    const files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {
      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        const headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headersRow.length
        );
      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };
    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    const csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      const currentRecord = (<string>csvRecordsArray[i]).split(',');
      if (currentRecord.length === headerLength) {
        const csvRecord: UserCSVModel = new UserCSVModel();
        csvRecord.name = currentRecord[0].trim();
        csvRecord.mobile = Number(currentRecord[1].trim());
        csvRecord.email = currentRecord[2].trim();
        csvRecord.location = currentRecord[3].trim();
        csvRecord.college = currentRecord[4].trim();
        if (currentRecord[5].trim() === 'Active') {
          csvRecord.flags = { active: true, paid: false };
        }
        csvRecord.createdOn = new Date(currentRecord[6].trim());
        const courseNames = currentRecord[7].trim();
        const coursePaymentType = currentRecord[8].trim();
        console.log({ courseNames }, { coursePaymentType });

        csvRecord.courses = [];
        // courseNames.forEach((name, index) => {
        csvRecord.courses.push({
          name: currentRecord[7].trim(),
          paymentType: currentRecord[8].trim(),
        });
        // });
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  getHeaderArray(csvRecordsArr: any) {
    const headers = (<string>csvRecordsArr[0]).split(',');
    const headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = '';
    this.records = [];
  }
}
