import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BannerInterface, RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { HelperService, RolesService } from '@application/ui';

@Component({
  selector: 'application-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannersListComponent implements OnInit, OnChanges {

  @Input() banners: BannerInterface[];
  // isDeleteVisible: boolean;
  // isEditVisible: boolean;

  @Output() delete = new EventEmitter<BannerInterface>();

  search: string;
  filteredBanners: BannerInterface[];

  deleteEnabled:string;
  editEnabled:string

  constructor(
    private roleService: RolesService,
    public helper: HelperService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.banners = this.filteredBanners = changes?.banners?.currentValue;
  }
 
  ngOnInit() {
    this.deleteEnabled = localStorage.getItem('deleteAccess');
    this.editEnabled = localStorage.getItem('editAccess');
    // this.loadPermissions()
  }
  // loadPermissions() {
  //   let modules = this.helper.enumtoArray(RoleModulesEnum);
  //   let subM = this.helper.enumtoArray(RoleSubModulesEnum);
  //   let role = localStorage.getItem('role');
  //   if (role) {
  //     this.roleService.getRoleById(role).subscribe(r => {
  //       r.response[0].rolePermissions.map(res => {
  //         if (res.module[0].title === modules.type.BANNERS)
  //           res.subModules.map(e => {
  //              if (e.title == subM.type.DELETE) {
  //               this.isDeleteVisible = true;
  //             }
  //             else if (e.title == subM.type.EDIT) {
  //               this.isEditVisible = true;
  //             }
  //           })
  //       })
  //     })
  //   }
  // }

  filterBanners(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    if (filterValue) {
      this.filteredBanners = this.banners.filter((banner) => {
        return (
          banner.title.toLowerCase().includes(filterValue) ||
          banner.courses.some(cou => cou?.title.toLowerCase().includes(filterValue))
        );
      });
    } else {
      this.filteredBanners = this.banners;
    }

  }

}
