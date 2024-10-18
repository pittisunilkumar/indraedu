import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { HelperService, SubscriptionsRepositoryService } from '@application/ui';

@Component({
  selector: 'application-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.less']
})
export class CoursesListComponent implements OnInit {

  @Input() list: any;
  @Input() actionsVisible = true;
  // @Output() delete = new EventEmitter<SubscriptionCourseInterface>();
  // @Output() edit = new EventEmitter<SubscriptionCourseInterface>();
  filteredList: any;

  constructor(
    public helper: HelperService,
    private subRepo: SubscriptionsRepositoryService,
  ) { }

  ngOnInit(): void {
    
  }
  ngOnChanges(changes: SimpleChanges) {
    this.filteredList = this.list;
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.filteredList = this.list.filter((question) => {
        // return question.title.toLowerCase().includes(filterValue);
      });
    } else {
      this.filteredList = this.list
    }
  }



}
