import { Component, OnInit, OnDestroy } from '@angular/core';
import { BannersRepositoryService, CommandRemoveDialogComponent, HelperService, RolesService } from '@application/ui';
import { BannerInterface, RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { Subscription, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'application-banners-list-container',
  templateUrl: './banners-list-container.component.html',
  styleUrls: ['./banners-list-container.component.less'],
})
export class BannersListContainerComponent implements OnInit, OnDestroy {

  banners: Observable<BannerInterface>
  errors: string[];
  sub = new Subscription();
  length: number;

  isEditVisible: boolean;
  isAddVisible: boolean;
  isDeleteVisible: boolean;


  constructor(
    private bannerRepo: BannersRepositoryService,
    private dialog: MatDialog,
    public helper: HelperService,
    private router: Router,
    private roleService: RolesService,

  ) {

  }

  ngOnInit(): void {
    // let data = this.helper.createAccess();
    // console.log('data',data);
    // const permission = localStorage.getItem('isAccess')
    // console.log('permission',permission);
    
    this.loadData();
    this.loadPermissions();
  }

  loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
        roleData[0].rolePermissions.map(res => {
          if (res.module[0].title === modules.type.BANNERS)
            res.subModules.map(e => {
              if (e.title == subM.type.ADD) {
                this.isAddVisible = true;
              }
              else if (e.title == subM.type.DELETE) {
                this.isDeleteVisible = true;
              }
              else if (e.title == subM.type.EDIT) {
                this.isEditVisible = true;
              }
            })
        })
      // })
    }
  }

  loadData() {
    this.banners = this.bannerRepo.getAllBanners();
    this.bannerRepo.getAllBanners().subscribe(data => {
      this.length = data.response.length;
    })
  }

  delete(data: BannerInterface) {
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: data },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sub.add(this.bannerRepo.deleteBannerByUuid(data.uuid).subscribe(
          (res) => {
            console.log({ res });
            this.loadData();
          },
          (err) => {
            console.log({ err });
            this.errors = err.error.error;
          }
        ));
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
