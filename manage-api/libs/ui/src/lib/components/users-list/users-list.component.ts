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
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  RoleModulesEnum,
  RoleSubModulesEnum,
  UserInterface,
} from '@application/api-interfaces';
import {
  NotificationService,
  NotificationType,
  RolesService,
  UsersRepositoryService,
} from '@application/ui';
import { HelperService } from '../../helpers/helper-service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'application-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit, OnChanges {
  displayedColumns: string[] = [
    'sno',
    'name',
    // 'type',
    'mobile',
    'email',
    'subscription',
    'createdOn',
    'active',
    'actions',
  ];
  filteredList: any;
  list: any;
  dataSource: MatTableDataSource<UserInterface>;
  isAssignSubVisible: boolean;
  testReset: boolean;
  total: number;
  public students: UserInterface[];
  totalLength = [10, 25, 50, 100];
  form = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
  });
  length: number;
  paginationActive = true;
  subscriptionEnable = false;
  pageEvent: PageEvent;

  @Input() users: UserInterface[];
  @Output() delete = new EventEmitter<UserInterface>();
  @Output() resetPassword = new EventEmitter<UserInterface>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public helper: HelperService,
    private router: Router,
    private roleService: RolesService,
    private userRepo: UsersRepositoryService,
    private notification: NotificationService
  ) {}

  deleteEnabled: string;
  editEnabled: string;
  ngOnInit() {
    this.deleteEnabled = localStorage.getItem('deleteAccess');
    this.editEnabled = localStorage.getItem('editAccess');
    this.loadPermissions();
  }
  loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
      roleData[0].rolePermissions.map((res) => {
        if (res.module[0].title === modules.type.USERS)
          res.subModules.map((e) => {
            if (e.title == subM.type.ASSIGN_SUBSCRIPTIONS) {
              this.isAssignSubVisible = true;
            } else if (e.title == subM.type.TEST_RESET) {
              this.testReset = true;
            }
          });
      });
      // })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Assign the data to the data source for the table to render
    if (changes?.users?.currentValue) {
      console.log(
        'changes?.users?.currentValue',
        changes?.users?.currentValue?.data
      );
      // const users = changes?.users?.currentValue.totalRecords
      //   .filter(user => user.mobile !== 9108391276)
      this.filteredList = this.list = changes?.users?.currentValue?.data;
      this.dataSource = new MatTableDataSource(
        changes?.users?.currentValue?.data
      );
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      this.total = changes?.users?.currentValue?.totalRecords;
      // console.log('this.total',this.total);
    }
  }

  lengthNumber(event) {
    // console.log(event.pageIndex + 1);
    // console.log(event.pageSize);
    if (!this.subscriptionEnable) {
      // let data = {
      //   page: this.pageEvent?.pageIndex + 1,
      //   limit:this.pageEvent?.pageSize,
      //   search: ''
      // }
      let data = {
        page: event.pageIndex + 1,
        limit: event.pageSize,
        search: '',
      };
      this.userRepo.getStudentsPerPage(data).subscribe(
        (res: any) => {
          // this.students = res?.response;
          this.filteredList = this.list = res?.response?.data;
          this.dataSource = new MatTableDataSource(res?.response?.data);
        },
        (err) => {}
      );
    }

    // this.itemsPerPage = event.pageSize;
    // this.p = event.pageIndex + 1
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  applyFilter(event: any) {
    // const filterValue = (event.target as HTMLInputElement).value.trim();
    const filterValue = event;
    // let data = {
    //   mobile: parseInt(filterValue)
    // }
    // this.userRepo.searchByMobile(data).subscribe(
    //   (res: any) => {
    //     console.log('resres',res);
    //     // this.students = res?.response;
    //     this.filteredList = this.list = res?.response
    //     this.dataSource = new MatTableDataSource(res?.response);
    //     this.total = res?.response?.totalRecords;
    //     // this.totalLength=[10,25,50,100,this.list.length]
    //   },
    //   (err) => { }
    // );

    let data = {
      page: 1,
      limit: 100,
      search: filterValue,
    };
    this.userRepo.getStudentsPerPage(data).subscribe(
      (res: any) => {
        // this.students = res?.response;
        this.filteredList = this.list = res?.response?.data;
        this.dataSource = new MatTableDataSource(res?.response?.data);
        this.total = res?.response?.totalRecords;
        // this.totalLength=[10,25,50,100,this.list.length]
      },
      (err) => {}
    );

    //   if (filterValue) {
    //     this.filteredList = this.list.filter((user) => {
    //       return (
    //         user.name.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
    //         user.mobile.toString().toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
    //         user.email.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
    //         user.flags?.isActive.toString().toLowerCase().includes(filterValue.toLocaleLowerCase())
    //       )
    //     });
    //     this.dataSource = new MatTableDataSource(this.filteredList);

    //   } else {
    //     this.dataSource = new MatTableDataSource(this.list);
    //   }
    //   this.dataSource.paginator = this.paginator;

    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  edit(user: UserInterface) {
    return this.router.navigateByUrl(`/manage/users/${user.uuid}/edit`);
  }

  goToSubscriptions(user) {
    window.sessionStorage.setItem('userName', user.name);
    window.sessionStorage.setItem('userId', user._id);
    window.sessionStorage.setItem('userUuid', user.uuid);
    return this.router.navigateByUrl(`/manage/users/${user.uuid}/packages`);
  }
  userTests(user) {
    window.sessionStorage.setItem('userName', user.name);
    // return this.router.navigateByUrl(`/manage/users/${user._id}/tests`);
  }

  resetAllSubscriptions(uuid) {
    this.userRepo.resetAllSubscrptions(uuid).subscribe((data) => {});
  }

  userAccess() {
    const type = localStorage.getItem('currentUserType');
    return type === 'ADMIN' || type === 'SUPER';
  }

  searchPayments() {
    // this.dataSource = new MatTableDataSource([]);
    let dates = {
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,
    };
    this.paginationActive = false;

    console.log('dates', dates);
    this.userRepo.searchTransactions(dates).subscribe((data) => {
      this.filteredList = this.list = data.response;
      this.dataSource = new MatTableDataSource(this.filteredList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.length = this.dataSource.filteredData.length;
      this.subscriptionEnable = true;
      // console.log('this.dataSource.filteredData', this.dataSource.filteredData);

      if (this.length) {
        this.notification.showNotification({
          type: NotificationType.SUCCESS,
          payload: {
            message: 'User details fetched successfully',
            statusCode: 200,
            statusText: 'Successfully',
            status: 201,
          },
        });
      } else {
        this.notification.showNotification({
          type: NotificationType.ERROR,
          payload: {
            message: '',
            statusCode: 200,
            statusText: 'Successfully',
            status: 201,
          },
        });
      }
    });
  }

  exportTable() {
    if (this.dataSource.filteredData.length === 0) {
      alert('No data available for ExportData');
    } else {
      // if (this.paginationActive) {
      //   let data = {
      //     page: 1,
      //     limit: this.total ? this.total : 1000,
      //     search: '',
      //   };
      //   this.userRepo.getStudentsPerPage(data).subscribe(
      //     (res: any) => {
      //       // this.students = res?.response;
      //       this.filteredList = this.list = res?.response?.data;
      //       this.dataSource = new MatTableDataSource(res?.response?.data);
      //     });
      // } else {
        const dataToExport = this.dataSource.filteredData.map((x) => ({
          Name: x?.name ? x?.name : '---',
          Mobile: x?.mobile ? x?.mobile : '---',
          Email: x?.email ? x?.email : '---',
          College: x?.college ? x?.college : '---',
          CreatedOn: x?.createdOn,
          OTP: x?.otp,
          Status: x?.accessToken ? '' : 'User Not Verified',
          // Subscriptions : x?.subscriptions? x?.subscriptions.map(res=>res?.title[0]).toString():'',
          // Subscriptions : x?.subscriptions? x?.subscriptions?.length:'',
          // ExpiryDate : x?.subscriptions? x?.subscriptions.map(res=>res.expiry_date).toString():''
          // CreatedBy:x?.createdBy.name`
        }));
        let workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport, <
          XLSX.Table2SheetOpts
        >{ sheet: 'Sheet 1' });
        let workBook: XLSX.WorkBook = XLSX.utils.book_new();

        // Adjust column width
        var wscols = [{ wch: 15 }];

        workSheet['!cols'] = wscols;
        XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet 1');
        XLSX.writeFile(workBook, `Users.xlsx`);
    }
  }

  inActiveUsersList() {
    this.userRepo.inActiveUsers().subscribe((res: any) => {
      this.filteredList = this.list = res.response;
      this.dataSource = new MatTableDataSource(this.filteredList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.length = this.dataSource.filteredData.length;
      this.subscriptionEnable = true;

      if (this.length) {
        this.notification.showNotification({
          type: NotificationType.SUCCESS,
          payload: {
            message: 'InActive User details fetched successfully',
            statusCode: 200,
            statusText: 'Successfully',
            status: 201,
          },
        });
      } else {
        this.notification.showNotification({
          type: NotificationType.ERROR,
          payload: {
            message: '',
            statusCode: 200,
            statusText: 'Successfully',
            status: 201,
          },
        });
      }
    });
  }
}
