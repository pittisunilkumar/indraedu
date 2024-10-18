import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DepartmentsService, HelperService } from '@application/ui';
import { Subscription } from 'rxjs';
import { SendReplyComponent } from '../send-reply/send-reply.component';

@Component({
  selector: 'application-complaints-list',
  templateUrl: './complaints-list.component.html',
  styleUrls: ['./complaints-list.component.less']
})
export class ComplaintsListComponent implements OnInit {
  totalLength = [10, 25, 50, 100];
  total: number;
  errors: string[];
  sub = new Subscription();
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  displayedColumns: string[] = [
    'sno',
    'ticketId',
    'course',
    'department',
    'mobile',
    'message',
    'type',
    'priority',
    'createdOn',
    'lastUpdated',
    'status',
    'actions'
  ];
  dataSource: any;
  currentUser: any;
  tickets: any;
  filterdTickets: any;
  constructor(
    private departmentsService: DepartmentsService,
    public helperService: HelperService,
    private router:Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getTickets();
    localStorage.removeItem('ticket')
  }
  getTickets() {
    let payload = {
      departmentId: this.currentUser.department.map(res => res._id)
    }
    this.departmentsService.getAllTickets(payload).subscribe(res => {
      this.tickets = this.filterdTickets = res?.response;
      console.log('this.filterdTickets ',this.filterdTickets );
      
      this.dataSource = new MatTableDataSource(this.filterdTickets);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  filterComplaints(comp: Event) {
    const filterValue = (comp.target as HTMLInputElement).value.toLowerCase().trim();;
    if (filterValue) {
      this.dataSource = this.tickets.filter((tic) => {
        return (
          tic?.ticketId.toLowerCase().includes(filterValue) ||
          tic?.message.toLowerCase().includes(filterValue) ||
          tic?.priority.toLowerCase().includes(filterValue) ||
          tic?.department?.title.toLowerCase().includes(filterValue)
        )
      });
    } else {
      this.dataSource = this.tickets;
    }
    this.dataSource = new MatTableDataSource(this.dataSource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDepartmentTickets(dep) {
    let payload = {
      departmentId: [dep._id]
    }
    this.departmentsService.getAllTickets(payload).subscribe(res => {
      this.tickets = this.filterdTickets = res?.response;
      this.dataSource = new MatTableDataSource(this.filterdTickets);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  updateTicketStatus(ticket, status) {
    let payload = {
      uuid: ticket.uuid,
      status: status,
      modifiedOn: new Date(),
      modifiedBy: {
        uuid: localStorage.getItem('currentUserUuid'),
        name: localStorage.getItem('currentUserName'),
      },
    }
    this.departmentsService.updateTicket(payload).subscribe(res => {
      if (res) {
        this.getTickets();
      }
    })

  }

  filterTicketsByStatus(ticket){
    const filterValue = ticket.value;
    if (filterValue) {
      this.dataSource = this.tickets.filter((tic) => {
        return (
          tic?.status.toString().toLowerCase().includes(filterValue)
        )
      });
    } else {
      this.dataSource = this.tickets;
    }
    this.dataSource = new MatTableDataSource(this.dataSource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  viewTicket(ticket){
       this.router.navigate(['manage/complaints/ticket/view']);
      //  localStorage.setItem('ticket',JSON.stringify(ticket));
       localStorage.setItem('ticketUUid',ticket.uuid);

  }

  sendReplay(ticket){
    const dialogRef = this.dialog.open(SendReplyComponent, {
      data: { payload: ticket },
      height: '96%',
      width: '80%'
    });
  }

}
