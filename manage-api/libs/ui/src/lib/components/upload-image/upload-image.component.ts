import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AWSS3Service } from '../../finders/aws-s3.service';

@Component({
  selector: 'application-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadImageComponent implements OnInit, OnChanges {
  form: FormGroup;
  @Input() url?: string;
  @Input() isImage? = true;
  @Input() title?: string;
  @Input() mandatory?: string;

  @Output() formData = new EventEmitter<{ fileUrl: string; upload: boolean }>();

  inputPlaceholder: string;

  constructor(
    private awsS3: AWSS3Service,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.inputPlaceholder = this.title ? this.title : this.isImage ? 'COMMON.IMG_URL' : 'COMMON.FILE_URL';
    if (changes?.url?.currentValue) {
      this.url = changes?.url?.currentValue;
      this.buildForm();
    }
  }

  ngOnInit(): void {
    this.buildForm();
    this.inputPlaceholder = this.title ? this.title : this.isImage ? 'COMMON.IMG_URL' : 'COMMON.FILE_URL';
  }

  buildForm() {
    console.log(this.url);
    
    this.form = this.formBuilder.group({
      fileUrl: this.url ? this.url : '',
      uploadFile: '',
      upload: true,
    });
    this.changeDetectorRef.detectChanges();
  }
  async upload(
    event,
    option?: {
      name: string;
      value: number;
      fileUrl: string;
      upload: boolean;
    }
  ) {
    // if (this.checkFileExists(event[0].name)) {
    await this.awsS3.uploadFile(event, 'uploads').then((result) => {
      if (option) {
        option.fileUrl = result[0]?.Location;
      } else {
        this.form.controls.fileUrl.patchValue({
          uploadFile: result[0]?.Location,
          fileUrl: result[0]?.Location,
        });
        const value = this.form.value;

        this.formData.emit({
          fileUrl: value.fileUrl.fileUrl,
          upload: value.upload,
        });
      }
    });
  }
}
