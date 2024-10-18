import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseInterface, UserInterface } from '@application/api-interfaces';
import { SubscriptionsRepositoryService, UsersRepositoryService } from '@application/ui';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'application-user-subscriptions-container',
  templateUrl: './user-subscriptions-container.component.html',
  styleUrls: ['./user-subscriptions-container.component.less']
})
export class UserSubscriptionsContainerComponent implements OnInit {

  data: any;
  user$: Observable<ResponseInterface<UserInterface>>;
  uuid: string;
  userName:string;

  constructor(
    private userRepo: UsersRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.userName = window.sessionStorage.getItem('userName')
    this.user$ = this.getUserByUuid();
  }

  getUserByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        this.uuid = params.get('uuid');
        return this.userRepo.getUserSubscriptionsByUuid(params.get('uuid'));
      })
    );
    // return this.route.paramMap.pipe(
    //   switchMap((params) => {
    //     this.uuid = params.get('uuid');
    //     return this.userRepo.getUserByUuid(params.get('uuid'));
    //   })
    // );
  }
  backToUsers(){
    this.router.navigate(['/manage/users/list'])
  }

}
