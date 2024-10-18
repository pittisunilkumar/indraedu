import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { PearlsInputInterface } from '@application/api-interfaces';
import { HelperService, PeralsService } from '@application/ui';

@Component({
  selector: 'application-perals-list',
  templateUrl: './perals-list.component.html',
  styleUrls: ['./perals-list.component.less']
})
export class PeralsListComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() perals: PearlsInputInterface[];
  @Input() actionsVisible = true;
  @Output() delete = new EventEmitter<PearlsInputInterface>();
  @Output() edit = new EventEmitter<PearlsInputInterface>();
  filteredList: PearlsInputInterface[];

  constructor(
    public helper: HelperService,
    private peralService: PeralsService,
    private router: Router
  ) { }

  deleteEnabled:string;
  editEnabled:string
  ngOnInit() {
    this.deleteEnabled = localStorage.getItem('deleteAccess');
    this.editEnabled = localStorage.getItem('editAccess');
    window.sessionStorage.clear();
   }
 
  ngOnChanges(changes: SimpleChanges) {
    this.filteredList = this.perals;
    console.log(' this.filteredList', this.filteredList);
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.filteredList = this.perals.filter((sub) => {
        return sub.title.toLowerCase().includes(filterValue.toLocaleLowerCase()) 
      });
    } else {
      this.filteredList = this.perals
    }
  }

}
