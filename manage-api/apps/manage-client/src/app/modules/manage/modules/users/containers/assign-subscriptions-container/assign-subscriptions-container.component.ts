import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseInterface, SubscriptionInterface, UserInterface } from '@application/api-interfaces';
import { SubscriptionsRepositoryService, UsersRepositoryService } from '@application/ui';
import { Observable } from 'rxjs';

@Component({
  selector: 'application-assign-subscriptions-container',
  templateUrl: './assign-subscriptions-container.component.html',
  styleUrls: ['./assign-subscriptions-container.component.less']
})
export class AssignSubscriptionsContainerComponent implements OnInit {
  
  // subscriptions$ = this.subRepo.getActiveSubcriptions();
  subscriptions$ = this.subRepo.getAllSubscriptions();
  user$: Observable<ResponseInterface<UserInterface>>
  uuid: string;
  errors: string[];
  userName:string;
  constructor(
    private subRepo: SubscriptionsRepositoryService,
    private userRepo: UsersRepositoryService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userName = window.sessionStorage.getItem('userName')

    this.route.paramMap.subscribe(params => {
      this.uuid = params.get('uuid');
    })

    this.user$ = this.userRepo.getUserByUuid(this.uuid);

  }

  submit(payload: UserInterface) {

    return this.userRepo.assignSubscriptions(this.uuid, payload).subscribe(
      (result) => {
        console.log({ result });
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      (err) => {
        this.errors = err.error.error;
      }
    )

  }
  backToUsers(){
    this.router.navigate(['/manage/users/list'])
  }

}
