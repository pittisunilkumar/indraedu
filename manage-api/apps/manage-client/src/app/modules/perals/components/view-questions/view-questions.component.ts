import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService, PeralsService } from '@application/ui';
import { switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';


@Component({
  selector: 'application-view-questions',
  templateUrl: './view-questions.component.html',
  styleUrls: ['./view-questions.component.less']
})
export class ViewQuestionsComponent implements OnInit {
  perals$: any;
  totalLength = [10, 25, 50, 100];
  filteredQuestions: any
  displayedColumns: string[] = [
    'title',
  ];
  @ViewChild(MatAccordion) accordion: MatAccordion;


  constructor(
    public helper: HelperService,
    private route: ActivatedRoute,
    private peralService: PeralsService,
    private _location: Location
  ) { }

  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;

  getPeralByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.peralService.viewQuestions(params.get('uuid'));
      })
    );
  }

  ngOnInit(): void {
    this.getPeralByUuid().subscribe(data => {
      this.perals$ = data.response;
      this.filteredQuestions = new MatTableDataSource(this.perals$.queIds);
      this.filteredQuestions.paginator = this.paginator;
    })
  }
  filterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.filteredQuestions.filter = filterValue.trim().toLowerCase();
    if (this.filteredQuestions.paginator) {
      this.filteredQuestions.paginator.firstPage();
    }
  }
  backToPerals(){
     this._location.back()
  }

}
