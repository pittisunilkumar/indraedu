import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseInterface, RoleInterface, RoleValueInterface } from '@application/api-interfaces';
import {  RolesService } from '@application/ui';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'application-create-role-container',
  templateUrl: './create-role-container.component.html',
  styleUrls: ['./create-role-container.component.less']
})
export class CreateRoleContainerComponent implements OnInit {
  public roleValues: RoleValueInterface[];
  public _sub = new Subscription();
  errors: string[];
  mode = this.route.snapshot.data['mode'];
  role$: Observable<ResponseInterface<RoleInterface>>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RolesService,
  ) { }

  ngOnInit(): void {
    this.loadData();
    if (this.mode === 'edit') {
      this.role$ = this.getRoleByUuid();
    }
  }
  loadData(): void {
    this._sub.add(this.roleService.getAllActiveRolesValues().subscribe(
      (res) => {
        this.roleValues = res?.response;
        // console.log(this.roleValues);
      },
      (err) => { }
    ));
  }

  getRoleByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.roleService.getRoleByUuid(params.get('uuid'));
      })
    );
  }

  submit(event: RoleInterface) {

    if (this.mode === 'add') {
      this.roleService
        .addRole(event)
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigateByUrl('/manage/roles/list');
          },
          (err) => {
            this.errors = err.error.error;
          }
        );
    } else {
      this.roleService
        .editRole(event)
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigateByUrl('/manage/roles/list');
              window.location.reload();
          },
          (err) => {
            this.errors = err.error.error;
          }
        );
    }
   
  }


}
