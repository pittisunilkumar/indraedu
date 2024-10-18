import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PearlsInputInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, PeralsService } from '@application/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'application-perals-list-container',
  templateUrl: './perals-list-container.component.html',
  styleUrls: ['./perals-list-container.component.less']
})
export class PeralsListContainerComponent implements OnInit {
  errors: string[];

  perals: PearlsInputInterface[];
  _sub = new Subscription();
  createEnable:string;
  constructor(
    private peralService: PeralsService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.createEnable = localStorage.getItem('isAccess');
    this._sub.add(this.loadData());

  }

  loadData() {

    return this.peralService.getAllPerals().subscribe(
      (res) => {
        this.perals = res.response;
      }
    );

  }

  delete(sub: PearlsInputInterface) {

    const dialogRef =  this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: sub },
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result) {

        this.peralService.removePeral(sub).subscribe(
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

  edit(obj: PearlsInputInterface) {
    return this.router.navigate(['../', obj.uuid, 'edit'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

}
