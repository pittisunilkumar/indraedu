import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, FeedbackService, HelperService } from '@application/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'application-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.less']
})
export class FeedbackListComponent implements OnInit {

  isAddVisible: boolean;
  isDeleteVisible: boolean;
  isEditVisible: boolean;
  feedbacks: any;
  // @Output() delete = new EventEmitter<TagInterface>();

  search: string;
  // filteredFeedbacks:  MatTableDataSource<TagInterface>;
  filteredFeedbacks: any;

  totalLength = [10, 25, 50, 100];
  total: number;
  errors: string[];
  sub = new Subscription();
  // p: number = 1;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  displayedColumns: string[] = [
    'sno',
    'title',
    'feedback_type',
    'batch',
    'users',
    'repliesCount',
    'averageRating',
    'status',
    'actions'
  ];
  today = new Date()

  constructor(
    private feedbackService: FeedbackService,
    private dialog: MatDialog,
    private helper: HelperService,
    private router: Router
  ) {
    // this.today.setDate(this.today.getDate() - 1)
  }

  loadData() {
    this.feedbackService.getFeedbacks().subscribe(res => {
      this.feedbacks = this.filteredFeedbacks = res?.response;
      console.log('this.filteredFeedbacks',this.filteredFeedbacks);
      
      this.filteredFeedbacks = new MatTableDataSource(this.filteredFeedbacks);
      this.filteredFeedbacks.paginator = this.paginator;
      this.filteredFeedbacks.sort = this.sort;
    })
  }

  ngOnInit(): void {
    this.loadPermissions();
    this.loadData();
  }

  delete(data) {
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: data },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sub.add(this.feedbackService.deleteFeedback(data._id).subscribe(
          (res) => {
            this.loadData();
          },
          (err) => {
            this.errors = err.error.error;
          }
        ));
      }
    })
  }


  filterDepartments(department: Event) {
    const filterValue = (department.target as HTMLInputElement).value.toLowerCase().trim();;
    if (filterValue) {
      this.filteredFeedbacks = this.feedbacks.filter((tag) => {
        return (tag?.title.toLowerCase().includes(filterValue)||
        tag?.feedback_type.toLowerCase().includes(filterValue))
      });
    } else {
      this.filteredFeedbacks = this.feedbacks;
    }
    this.filteredFeedbacks = new MatTableDataSource(this.filteredFeedbacks);
    this.filteredFeedbacks.paginator = this.paginator;
    this.filteredFeedbacks.sort = this.sort;
  }

  feedbackGraph(feedback){
        this.router.navigate([`portal/feedback/${feedback.uuid}/graph`])
  }

  loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
      roleData[0].rolePermissions.map(res => {
        if (res.module[0].title === modules.type.FEEDBACK)
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
}
