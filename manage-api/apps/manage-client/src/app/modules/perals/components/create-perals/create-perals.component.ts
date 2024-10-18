import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PearlsInputInterface } from '@application/api-interfaces';
import { HelperService } from '@application/ui';
import * as uuid from 'uuid';
import * as Editor from 'apps/manage-client/src/assets/ckeditor5-31.0.0-sttok6yne3zl'

@Component({
  selector: 'application-create-perals',
  templateUrl: './create-perals.component.html',
  styleUrls: ['./create-perals.component.less']
})
export class CreatePeralsComponent implements OnInit {
  public config: any;
  public Editor = Editor
  // @Input() Editor: any;
  @Input() perals?: PearlsInputInterface;
  @Input() mode: string;
  @Output() commit = new EventEmitter<PearlsInputInterface>();
  createPeralForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    public helper: HelperService,
  ) { 
    this.config = this.helper.editorProperties()
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.perals?.currentValue) {
      this.perals = changes?.perals?.currentValue;
    }
    this.buildForm();

  }

  ngOnInit(): void {

    this.buildForm()
  }
  buildForm() {
    this.createPeralForm = this.formBuilder.group({
      title: [this.perals ? this.perals?.title : '',Validators.required],
      explaination: [this.perals ? this.perals?.explaination : '',Validators.required],
      flags: this.formBuilder.group({
        active: this.perals ? this.perals?.flags.active : true,
      }),
    });
  }
  submit() {
    let value = this.createPeralForm.value
    if (this.mode === 'add') {
      const payload: PearlsInputInterface = {
        uuid: uuid.v4(),
        title:value.title,
        explaination:value.explaination,
        queIds:[],
        flags: value.flags,
        createdOn: new Date(),
        modifiedOn: null,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      }
      console.log('payload',payload);
       this.commit.emit(payload);
    }
    else {
      const payload: PearlsInputInterface = {
        uuid: this.perals.uuid,
        title:value.title,
        explaination:value.explaination,
        queIds:this.perals.queIds,
        flags: value.flags,
        createdOn: this.perals.createdOn,
        modifiedOn: new Date(),
        createdBy: this.perals.createdBy,
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      }
       this.commit.emit(payload);
    }
  }


}
