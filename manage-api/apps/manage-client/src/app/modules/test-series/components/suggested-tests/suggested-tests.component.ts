import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TestsRepositoryService } from '@application/ui';

@Component({
  selector: 'application-suggested-tests',
  templateUrl: './suggested-tests.component.html',
  styleUrls: ['./suggested-tests.component.less']
})
export class SuggestedTestsComponent implements OnInit {

  displayedColumns: string[] = [
    'sno',
    'course',
    'category',
    'topic',
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
    private testRepo: TestsRepositoryService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.testRepo.getAllSuggestedTests().subscribe(data => {
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
          emp?.category?.categories?.title.toString().toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          emp?.test?.title.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
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
    this.testRepo.updateSuggestedTestStatus(id, Form).subscribe((data) => {
      this.loadData();
    });
  }


}
