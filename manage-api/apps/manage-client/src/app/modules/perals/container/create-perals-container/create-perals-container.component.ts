import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PeralsService, RolesService } from '@application/ui';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { PearlsInputInterface, ResponseInterface } from '@application/api-interfaces';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'application-create-perals-container',
  templateUrl: './create-perals-container.component.html',
  styleUrls: ['./create-perals-container.component.less']
})
export class CreatePeralsContainerComponent implements OnInit {
  mode = this.route.snapshot.data['mode'];
  errors: string[];
  perals$: Observable<ResponseInterface<PearlsInputInterface>>;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private peralService: PeralsService,
    private _location:Location
  ) { }

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.perals$ = this.getRoleValueByUuid();
    }
  }

  getRoleValueByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.peralService.getPeralByUuid(params.get('uuid'));
      })
    );
  }

  submit(event: PearlsInputInterface) {
    if (this.mode === 'add') {
      this.peralService
        .addPeral(event)
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigateByUrl('/perals/list');
          },
          (err) => {
            this.errors = err.error.error;
          }
        );
    } else {
      this.peralService
        .editPeral(event)
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigateByUrl('/perals/list');
          },
          (err) => {
            this.errors = err.error.error;
          }
        );
    }
  }

}
