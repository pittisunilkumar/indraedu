import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackService, HelperService } from '@application/ui';

@Component({
  selector: 'application-feedback-graph',
  templateUrl: './feedback-graph.component.html',
  styleUrls: ['./feedback-graph.component.less'],
  host: {
    "(window:resize)": "onWindowResize($event)"
  }
})
export class FeedbackGraphComponent implements OnInit {
  feedback: any;
  feedbackList: any;
  replies:any;
  colorCodes=['red','#001E9B','#D68910','#6C3483','green']

  displayedColumns: string[] = [
    'sno',
    'name',
    'mobile',
    'rating',
    'createdOn',
    'message',
  ];

  dataSource: any;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;


  // type = 'ColumnChart';
  data = [['', 0]];
  columnNames = ['', 'Rating'];
  columnOptions: any

  isMobile: boolean = false;
  width: number = window.innerWidth;
  height: number = window.innerHeight;
  mobileWidth: number = 760;

  constructor(
    public helper: HelperService,
    private route: ActivatedRoute,
    private feedbackService: FeedbackService,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getGraphData();
  }
  async getGraphData() {
    this.windowSize();
    let departmentsUuid = this.route.snapshot.paramMap.get('uuid');
    let feedback: any
    feedback = await this.feedbackService.findFeedback(departmentsUuid).toPromise();
    this.feedback = feedback.response;
    this.replies =this.feedback.replies;
    this.dataSource = new MatTableDataSource(this.replies);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    let array = []
    let counts = {}
    this.feedback?.replies.map(function (x) {
      array.push(x.rating)
    })
    array.map(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    })
    this.data = [['1 Star', counts[1]], ['2 Star', counts[2]], ['3 Star', counts[3]], ['4 Star', counts[4]], ['5 Star', counts[5]]]

  }
  filterReplies(event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();;
    if (filterValue) {
      this.replies = this.feedback.replies.filter((rpl) => {
        return (
          rpl?.user_id?.name.toLowerCase().includes(filterValue.toLocaleLowerCase()) || 
          rpl?.user_id?.mobile.toString().toLowerCase().includes(filterValue.toLocaleLowerCase()) || 
          rpl?.message.toLowerCase().includes(filterValue.toLocaleLowerCase()) 
        )
      });
    } else {
      this.replies = this.feedback.replies;
    }
    this.dataSource = new MatTableDataSource(this.replies);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  goBack() {
    this.router.navigate(['/portal/feedback/list'])
  }

  windowSize() {
    if (this.width < 760) {
      this.columnOptions = {
        is3D: true,
        responsive: true,
        width: 350,
        height: 300,
        // colors: ['#40C4FF', '#1E88E5', 'red'],
        legend: { position: 'top', maxLines: 2 },
        bar: { groupWidth: '50%' },
        isStacked: false,
        animation: {
          duration: 2000,
          easing: 'out',
        },
      };
    }
    else {
      this.columnOptions = {
        is3D: true,
        responsive: true,
        width: 600,
        height: 350,
        // colors: ['#40C4FF', '#1E88E5', 'red'],
        legend: { position: 'top', maxLines: 2 },
        bar: { groupWidth: '50%' },
        isStacked: false,
        animation: {
          duration: 2000,
          easing: 'out',
        },
      };
    }
  }

  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.height = event.target.innerHeight;
    this.isMobile = this.width < this.mobileWidth;
    this.windowSize();
  }


}
