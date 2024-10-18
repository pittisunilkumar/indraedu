import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseInterface, RoleSubModuleInterface } from '@application/api-interfaces';
import { RolesService } from '@application/ui';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'application-create-role-sub-module-container',
  templateUrl: './create-role-sub-module-container.component.html',
  styleUrls: ['./create-role-sub-module-container.component.less']
})
export class CreateRoleSubModuleContainerComponent implements OnInit {
  errors: string[];
  mode = this.route.snapshot.data['mode'];
  roleSubModules$: Observable<ResponseInterface<RoleSubModuleInterface>>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private RoleService: RolesService,
  ) { }

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.roleSubModules$ = this.getRoleValueByUuid();
    }
  }

  getRoleValueByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.RoleService.getRoleSubModuleByUuid(params.get('uuid'));
      })
    );
  }

  submit(event: RoleSubModuleInterface) {
    if (this.mode === 'add') {
      this.RoleService
        .addRoleSubModule(event)
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigateByUrl('/manage/role-sub-modules/list');
          },
          (err) => {
            this.errors = err.error.error;
          }
        );
    } else {
      this.RoleService
        .editRoleSubModulee(event)
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigateByUrl('/manage/role-sub-modules/list');
          },
          (err) => {
            this.errors = err.error.error;
          }
        );
    }
  }
}
