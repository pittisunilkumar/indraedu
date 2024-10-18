import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, HelperService, NotificationService, NotificationType, UsersRepositoryService } from '@application/ui';
import { Subscription } from 'rxjs';
import { DuplicateNotificationComponent } from '../duplicate-notification/duplicate-notification.component';

@Component({
  selector: 'application-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.less']
})
export class NotificationsListComponent implements OnInit {
  DisplayedColumns: string[] = [
    'sno',
    'title',
    'message',
    'notificationType',
    'batch',
    'branch',
    'users',
    // 'scheduleOn',
    'sendStatus',
    'createdOn',
    'createdBy',
    'actions'
  ];
  filteredList: any;
  list: any;
  dataSource: any;

  isAddVisible: boolean;
  isDeleteVisible: boolean;
  isEditVisible: boolean;

  sub = new Subscription();
  errors: string[];
  
  form = new FormGroup({
    fromDate: new FormControl('',Validators.required),
    toDate: new FormControl('',Validators.required)
  })

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private userRepo: UsersRepositoryService,
    private notification: NotificationService,
    private router:Router,
    private helper: HelperService,
    private dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.loadNotifications();
    this.loadPermissions();
  }

  loadNotifications(){
    this.userRepo.notificationList().subscribe(res => {
      this.filteredList = this.list = res.response
      this.dataSource = new MatTableDataSource(res.response);
      this.dataSource.paginator = this.paginator;
    })
  }
  applyFilter(event) {
    let filterValue = event.trim()
    if (filterValue) {
      this.filteredList = this.list.filter((test) => {
        return (
          test?.title.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          test?.message.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          test?.notificationType.toLowerCase().includes(filterValue.toLocaleLowerCase()) 
          // test?.campaign.toLowerCase().includes(filterValue.toLocaleLowerCase())
        )
      });
      this.dataSource = new MatTableDataSource(this.filteredList);
      
    }
    else {
      this.dataSource = new MatTableDataSource(this.list);
    }
    this.dataSource.paginator = this.paginator;
  }

  searchNotifications() {
    let dates = {
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate.setDate(this.form.value.toDate.getDate() + 1)
    }
    this.userRepo.searchNotifications(dates).subscribe(data => {
      this.dataSource = new MatTableDataSource(data.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (this.dataSource.filteredData.length) {
        this.notification.showNotification({
          type: NotificationType.SUCCESS,
          payload: {
            message: 'Notifications fetched successfully',
            statusCode: 200,
            statusText: 'Successfully',
            status: 201
          },
        });
      }
      else{
        this.notification.showNotification({
          type: NotificationType.ERROR,
          payload: {
            message: '',
            statusCode: 200,
            statusText: 'Successfully',
            status: 201
          },
        });
      }
    })
  }
  delete(data) {
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: data },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sub.add(this.userRepo.deleteNotification(data._id).subscribe(
          (res) => {
            this.loadNotifications();
          },
          (err) => {
            this.errors = err.error.error;
          }
        ));
      }
    })
  }

  viewNotification(data){
    this.router.navigate([`portal/notifications/${data._id}`])
    
  }

  duplicateNotification(notificcation){
    const dialogRef = this.dialog.open(DuplicateNotificationComponent, {
      data: { payload: notificcation },
    });
  }

  loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));
    console.log(' this.isDeleteVisible', this.isDeleteVisible);

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
      roleData[0].rolePermissions.map(res => {
        if (res.module[0].title === modules.type.NOTIFICATION)
          res.subModules.map(e => {
            if (e.title == subM.type.ADD) {
              this.isAddVisible = true;
            }
            else if (e.title == subM.type.DELETE) {
              this.isDeleteVisible = true;
              console.log(' this.isDeleteVisible', this.isDeleteVisible);

            }
            else if (e.title == subM.type.EDIT) {
              this.isEditVisible = true;
              console.log(' this.isEditVisible', this.isEditVisible);
              
            }
          })
      })
      // })
    }
  }


}
