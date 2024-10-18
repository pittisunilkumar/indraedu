import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseInterface, RoleValueInterface } from '@application/api-interfaces';
import { RolesService } from '@application/ui';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'application-create-role-value-container',
  templateUrl: './create-role-value-container.component.html',
  styleUrls: ['./create-role-value-container.component.less']
})
export class CreateRoleValueContainerComponent implements OnInit {
  errors: string[];
  mode = this.route.snapshot.data['mode'];
  roleValues$: Observable<ResponseInterface<RoleValueInterface>>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private RoleService: RolesService,
  ) { }

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.roleValues$ = this.getRoleValueByUuid();
    }
  }

  getRoleValueByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.RoleService.getRoleValueByUuid(params.get('uuid'));
      })
    );
  }

  submit(event: RoleValueInterface) {
    if (this.mode === 'add') {
      this.RoleService
        .addRoleValue(event)
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigateByUrl('/manage/role-modules/list');
          },
          (err) => {
            this.errors = err.error.error;
          }
        );
    } else {
      this.RoleService
        .editRoleValue(event)
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigateByUrl('/manage/role-modules/list');
          },
          (err) => {
            this.errors = err.error.error;
          }
        );
    }
  }

}
