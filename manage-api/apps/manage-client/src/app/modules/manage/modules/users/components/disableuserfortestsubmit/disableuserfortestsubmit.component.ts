import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UsersRepositoryService } from '@application/ui';
import * as uuid from 'uuid';

@Component({
  selector: 'application-disableuserfortestsubmit',
  templateUrl: './disableuserfortestsubmit.component.html',
  styleUrls: ['./disableuserfortestsubmit.component.less']
})
export class DisableuserfortestsubmitComponent implements OnInit {

  displayedColumns: string[] = [
    'sno',
    'mobile',
    'subscription',
    'submission',
    'showInActiveCourses',
    'status',
    'createdOn',
    'actions',
  ];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  resetForm = new FormGroup({
    mobile: new FormControl('', Validators.required)
  })

  constructor(
    private router: Router,
    private userService: UsersRepositoryService
  ) { }

  deleteEnabled: string;
  editEnabled: string
  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.userService.disableuserfortestsubmitsList().subscribe((res:any)=>{
      this.dataSource = new MatTableDataSource(res.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }


  submit() {
    let payload = {
      uuid: uuid.v4(),
      mobile: this.resetForm.value.mobile,
      subscription:true,
      submission:true,
      showInActiveCourses:true,
      status: true,
      createdBy: {
        uuid: localStorage.getItem('currentUserUuid'),
        name: localStorage.getItem('currentUserName'),
      },
      createdOn: new Date(),
    }
    console.log('payload',payload)
    this.userService.disableuserfortestsubmits(payload).subscribe(data => {
      if (data) {
        this.loadData();
        this.resetForm.reset();
      }
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async changeStatus(id: string, status: boolean,type:string) {
    
    if (status === false) {
      status = true;
    } else {
      status = false;
    }
    const Form = {
      status ,
      type
    };
    this.userService.disableuserfortestsubmitsStatus(id, Form).subscribe((data) => {
      this.loadData();
    });
  }

  delete(uuid){
    this.userService.removeDisableuserfortestsubmit(uuid).subscribe(data=>{
      if(data){
        this.loadData()
      }
    })
  }



}
