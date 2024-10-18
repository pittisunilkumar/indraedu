import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { FacultyInterface, ResponseInterface } from '@application/api-interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentTansactionsService, FacultyRepositoryService } from '@application/ui';
@Component({
  selector: 'application-agent-payment-container',
  templateUrl: './agent-payment-container.component.html',
  styleUrls: ['./agent-payment-container.component.less']
})
export class AgentPaymentContainerComponent implements OnInit {
  agent$: Observable<ResponseInterface<FacultyInterface>>;
  errors: string[] = [];
  couponCode: string;
  facultyName:string;
  agentUuid:string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location:Location,
    private facultyRepo: FacultyRepositoryService,
    private agentTansactionsService:AgentTansactionsService
  ) { }

  ngOnInit(): void {
    this.couponCode = window.sessionStorage.getItem('couponCode')
    this.facultyName = window.sessionStorage.getItem('facultyName');
    this.agentUuid =  this.route.snapshot.paramMap.get('uuid');
    this.agent$ = this.getFacultisByUuid();
  }
  
  getFacultisByUuid() {
    return this.facultyRepo.getFacultyByUuid(this.agentUuid);
  }
  submit(payload) {
    console.log(payload);
    
    this.agentTansactionsService.addAgentTransactions(payload).subscribe(res => {
      if(res){
        this.router.navigate([`/manage/faculty/${this.agentUuid}/agentCoupons/list`])
      }
    })    
    
  }
  backToAgents() {
    this.router.navigate(['/manage/faculty/list']);
  }
  backToCoupons() {
    this._location.back();
  }

}
