import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, SubscriptionsRepositoryService } from '@application/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'application-subscriptions-list-container',
  templateUrl: './subscriptions-list-container.component.html',
  styleUrls: ['./subscriptions-list-container.component.less']
})
export class SubscriptionsListContainerComponent implements OnInit, OnDestroy {

  subscriptions: SubscriptionInterface[];
  _sub = new Subscription();
  errors: string[];
  createEnable:string;
  constructor(
    private subRepo: SubscriptionsRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.createEnable = localStorage.getItem('isAccess');
    this._sub.add(this.loadData());

  }

  loadData() {

    return this.subRepo.getAllSubscriptions().subscribe(
      (res) => {
        this.subscriptions = res.response;
      }
    );

  }

  delete(sub: SubscriptionInterface) {

    const dialogRef =  this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: sub },
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result) {

        this.subRepo.removeSubscription(sub).subscribe(
          (res) => {
            console.log({ res });
            this._sub.add(this.loadData());
          },
          (err) => {
            this.errors = err;
            console.error({ err });
          }
        );

      }

    });
  }

  edit(obj: SubscriptionInterface) {
    return this.router.navigate(['../', obj.uuid, 'edit'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

}
