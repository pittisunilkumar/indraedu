import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CouponInterface, RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { HelperService, RolesService } from '@application/ui';

@Component({
  selector: 'application-faculty-coupons-list',
  templateUrl: './faculty-coupons-list.component.html',
  styleUrls: ['./faculty-coupons-list.component.less']
})
export class FacultyCouponsListComponent implements OnInit {

  displayedColumns: string[] = [
    'sno',
    'code',
    'totalCoupons',
    'availableCoupons',
    'commission',
    'commissionAmount',
    'userCount',
    'agentTotalAmount',
    'paidAmount',
    'agentDueAmount',
    // 'status',
    'actions'
  ];
  isPayVisible:boolean;
  currentUserType:string

// agentDueAmount: 0
// agentTotalAmount: 0
// availableCoupons: 10
// totalCoupons: 10

  dataSource: MatTableDataSource<CouponInterface>;

  @Input() coupons: CouponInterface[];
  @Output() delete = new EventEmitter<CouponInterface>();
  @Output() assignSyllabus = new EventEmitter<CouponInterface>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public helper: HelperService,
    private roleService: RolesService,
    ) { }

  ngOnInit() {
    this.currentUserType =localStorage.getItem('currentUserType');

   }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.coupons?.currentValue) {
      console.log('changes?.coupons?.currentValue',changes?.coupons?.currentValue);
      
      this.dataSource = new MatTableDataSource(changes?.coupons?.currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    this.loadPermissions()
  }
  loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
        roleData[0].rolePermissions.map(res => {
          if (res.module[0].title === modules.type.AGENTS)
            res.subModules.map(e => {
              if (e.title == subM.type.AGENT_AMOUNT_PAY) {
                this.isPayVisible = true;
              }
            })
        })
      // })
    }
  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value.trim();

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }


  getCoupon(coupon){
   window.sessionStorage.setItem('couponCode',coupon.code);
   window.sessionStorage.setItem('couponId',coupon._id)
   window.sessionStorage.setItem('agentTotalAmount',coupon.agentTotalAmount)
   window.sessionStorage.setItem('agentDueAmount',coupon.agentDueAmount)
  }

}
