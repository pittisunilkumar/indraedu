import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AgentTransactonsInterface, FacultyInterface } from '@application/api-interfaces';
import { Location } from '@angular/common';
import * as uuid from 'uuid';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyRepositoryService } from '@application/ui';


@Component({
  selector: 'application-agent-payment',
  templateUrl: './agent-payment.component.html',
  styleUrls: ['./agent-payment.component.less']
})
export class AgentPaymentComponent implements OnInit {

  @Input() agent:FacultyInterface;
  today = new Date();
  paymentMode:string;
  amount:number;
  agentDueAmount:number;
  paymentsForm: FormGroup;
  couponId:string;
  agentId:string;
  @Output() commit = new EventEmitter<AgentTransactonsInterface>();


  agentUuid:string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location:Location,
    private formBuilder: FormBuilder,
    private facultyRepo: FacultyRepositoryService,

  ) { }


  ngOnChanges() {
    this.buildForm();
    this.agent= this.agent
  }

  ngOnInit(): void {
    this.buildForm();
    this.amount =parseInt(window.sessionStorage.getItem('agentTotalAmount'));
    this.agentDueAmount =parseInt(window.sessionStorage.getItem('agentDueAmount'));
    this.couponId = window.sessionStorage.getItem('couponId')
    this.agentId =window.sessionStorage.getItem('agentId')
  }

  buildForm() {
    this.paymentsForm = this.formBuilder.group({
      modeOfPayment: ['', Validators.required],
      paidAmount:['',Validators.required],
      billNumber: [''],
      chequeNumber: [''],
      chequeDate: [''],
      bankName: [''],
      transactionNumber: [''],
      upiTransactionNumber: [''],
      referanceNumber: [''],
      card: [''],
      cardType: [''],
      upiId: [''],
      bank: this.formBuilder.group({
        accountNumber:[this.agent?.bank.accountNumber],
        branchName:[this.agent?.bank.branch],
        ifscCode:[this.agent?.bank.ifsc],
      }),
      imgUrl: this.formBuilder.group({
        imgUrl: '',
        upload: true,
      }),
    })
  }

  getPaymentMode(mode){
    this.paymentMode = mode.value
    console.log('this.paymentMode',this.paymentMode);
   }
   getImageUrl(data: { fileUrl: string; upload: boolean }) {
    this.paymentsForm.controls['imgUrl'].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }

   submit() {
    const value = this.paymentsForm.value;
  
    let payload: any = {
      uuid: uuid.v4(),
      dateOfPayment: this.today,
      paidAmount:parseInt(value.paidAmount),
      agent:this.agentId,
      couponId: this.couponId,
      modeOfPayment: value.modeOfPayment,
      paymentStatus:'SUCCESS',
      fileUrl: value.imgUrl.imgUrl,
      billNumber: value.billNumber,
      chequeNumber: value.chequeNumber,
      chequeDate: value.chequeDate,
      bankName: value.bankName,
      referenceNumber: value.referanceNumber,
      upiId: value.upiId,
      bank:value.modeOfPayment == 'bank' ? value.bank:{},
      mode_transactionNumber: value.modeOfPayment ==='online'? value.transactionNumber:value.upiTransactionNumber,
      paymentCreatedOn:new Date(),
      createdBy: {
        uuid: localStorage.getItem('currentUserUuid'),
        name: localStorage.getItem('currentUserName'),
      },
    }

    console.log('payload', payload);
    return this.commit.emit(payload)

  }

   backToCoupons() {
    this._location.back();
  }
}
