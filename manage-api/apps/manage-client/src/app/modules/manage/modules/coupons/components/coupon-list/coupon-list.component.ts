import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CouponInterface } from '@application/api-interfaces';
import { HelperService } from '@application/ui';

@Component({
  selector: 'application-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouponListComponent implements OnInit, OnChanges {
  displayedColumns: string[] = [
    'sno',
    'code',
    'subscription',
    'couponType',
    'total',
    'available',
    'discountType',
    'discount',
    // 'availedBy',
    'activeFrom',
    'expiryDate',
    'createdOn',
    'active',
    // 'modifiedOn',
    'actions',
  ];
  isDisabled=true
  dataSource: MatTableDataSource<CouponInterface>;
  todayDate = new Date();
  filteredList: any;
  list: any;

  

  @Input() coupons: CouponInterface[];
  @Output() delete = new EventEmitter<CouponInterface>();
  @Output() assignSyllabus = new EventEmitter<CouponInterface>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public helper: HelperService) {
    this.todayDate.setDate(this.todayDate.getDate() - 1)
  }
  deleteEnabled:string;
  editEnabled:string
  ngOnInit() {
    this.deleteEnabled = localStorage.getItem('deleteAccess');
    this.editEnabled = localStorage.getItem('editAccess');
   }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.coupons?.currentValue) {
      this.filteredList = this.list = changes?.coupons?.currentValue
      this.dataSource = new MatTableDataSource(changes?.coupons?.currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    // console.log(this.dataSource.filteredData);
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    if (filterValue) {
      this.filteredList = this.list.filter((cou) => {
        return (
          cou.code.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          cou.subscription?.title.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          cou.couponType.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          cou.discountType.toLowerCase().includes(filterValue.toLocaleLowerCase())
        )
      });
      this.dataSource = new MatTableDataSource(this.filteredList);
    } else {
      this.dataSource = new MatTableDataSource(this.list);
    }
    this.dataSource.paginator = this.paginator;

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }
}
