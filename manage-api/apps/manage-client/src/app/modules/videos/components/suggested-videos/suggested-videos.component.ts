import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VideosRepositoryService } from '@application/ui';

@Component({
  selector: 'application-suggested-videos',
  templateUrl: './suggested-videos.component.html',
  styleUrls: ['./suggested-videos.component.less']
})
export class SuggestedVideosComponent implements OnInit {

  displayedColumns: string[] = [
    'sno',
    'course',
    'subject',
    'chapter',
    'video',
    'createdOn',
    'active',
    // 'actions',
  ];
  filteredList: any;
  list: any;
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private videoRepo: VideosRepositoryService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.videoRepo.getAllSuggestedVideos().subscribe(data => {
      this.filteredList = this.list = data?.response;
      this.dataSource = new MatTableDataSource(this.filteredList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.filteredList = this.list.filter((emp) => {
        return (
          emp?.course?.title.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          emp?.subject?.title.toString().toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          emp?.chapter?.title.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          emp?.video?.title.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          emp?.status.toString().toLowerCase().includes(filterValue.toLocaleLowerCase())
        )
      });
      this.dataSource = new MatTableDataSource(this.filteredList);
    } else {
      this.dataSource = new MatTableDataSource(this.list);
    }
    this.dataSource.paginator = this.paginator;
  }

  async changeStatus(id: string, status: boolean) {
    if (status === false) {
      status = true;
    } else {
      status = false;
    }
    const Form = {
      status,
    };
    this.videoRepo.updateSuggestedVideoStatus(id, Form).subscribe((data) => {
      this.loadData();
    });
  }
}
