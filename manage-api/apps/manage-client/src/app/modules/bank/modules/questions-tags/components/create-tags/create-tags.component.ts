import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TagInterface } from '@application/api-interfaces';
import { HelperService } from '@application/ui';
import * as uuid from 'uuid';

@Component({
  selector: 'application-create-tags',
  templateUrl: './create-tags.component.html',
  styleUrls: ['./create-tags.component.less']
})
export class CreateTagsComponent implements OnInit {

  @Input() tag?: TagInterface;
  @Input() mode: string;
  @Output() commit = new EventEmitter<TagInterface>();
  createTagForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public helper: HelperService,
    private route: ActivatedRoute
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mode === 'edit' && changes?.tag?.currentValue) {
      this.tag = changes?.tag?.currentValue;
      this.createTagForm = this.buildForm();
    }
  }

  ngOnInit(): void {
    this.createTagForm = this.buildForm();
  }
  buildForm() {
    console.log(this.tag);
    return this.formBuilder.group({
      title: [
        this.tag ? this.tag?.title : '',
        [Validators.required, Validators.maxLength(40)],
      ],
      flags: this.formBuilder.group({
        active: this.tag ? this.tag?.flags.active : true,
      }),
    });

  }

  submit() {
    const value = this.createTagForm.value;
    if (this.mode === 'add') {
      const payload: TagInterface = {
        uuid: uuid.v4(),
        title: value.title,
        createdOn: new Date(),
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        flags: {
          active: value.flags.active,
        },
      };
      console.log(payload)

      this.commit.emit(payload);

    } else {
     console.log(this.tag?.createdBy);
     
      const payload: TagInterface = {
        uuid: this.tag?.uuid,
        title: value.title,
        createdBy: this.tag?.createdBy,
        createdOn: this.tag?.createdOn,
        modifiedOn: new Date(),
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        flags: {
          active: value.flags.active,
        },
      };
      console.log(payload)
      this.commit.emit(payload);

    }
  }
  resetForm() {
    this.createTagForm.reset();
  }
}
