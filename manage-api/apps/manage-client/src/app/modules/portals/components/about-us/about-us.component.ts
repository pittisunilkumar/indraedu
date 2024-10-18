import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AboutInterface } from '@application/api-interfaces';
import { HelperService } from '@application/ui';
import * as uuid from 'uuid';
import * as Editor from 'apps/manage-client/src/assets/ckeditor5-31.0.0-sttok6yne3zl'


@Component({
  selector: 'application-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.less']
})
export class AboutUsComponent implements OnInit, OnChanges {

  public config: any;
  public Editor = Editor

  @Input() aboutUs?: AboutInterface;

  @Output() commit = new EventEmitter<AboutInterface>();

  aboutUsForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public helper: HelperService
  ) { this.config = this.helper.editorProperties() }

  ngOnInit(): void {

    this.buildForm();

  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes?.aboutUs?.currentValue) {
      this.aboutUs = changes?.aboutUs?.currentValue?.response[0];
      console.log(this.aboutUs);
      this.buildForm();
    }

  }

  buildForm() {

    this.aboutUsForm = this.formBuilder.group({
      title: [this.aboutUs ? this.aboutUs?.title : ''],
      content: [this.aboutUs ? this.aboutUs?.content : '', Validators.required],
    });

  }

  submit() {

    const value = this.aboutUsForm.value;

    if (!this.aboutUs) {
      const payload: AboutInterface = {
        uuid: uuid.v4(),
        title: value.title,
        content: value.content,
        createdOn: new Date(),
        modifiedOn: null,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      };

      this.commit.emit(payload);

    } else {

      const payload: AboutInterface = {
        uuid: this.aboutUs.uuid,
        title: value.title,
        content: value.content,
        createdOn: this.aboutUs.createdOn,
        modifiedOn: new Date(),
        createdBy: this.aboutUs.createdBy,
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      };

      this.commit.emit(payload);
    }

  }

}
