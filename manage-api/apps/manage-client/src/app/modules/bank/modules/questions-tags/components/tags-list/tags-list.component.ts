import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TagInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, TagsRepositoryService } from '@application/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'application-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.less']
})
export class TagsListComponent implements OnInit {
  @Input() isDeleteVisible: boolean;
  @Input() isEditVisible: boolean;
  @Input() tags: TagInterface[];
  // @Output() delete = new EventEmitter<TagInterface>();

  search: string;
  // filteredTags:  MatTableDataSource<TagInterface>;
  filteredTags:  any;

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
    'status',
    'actions'
  ];

  constructor(  
    private tagsRepo: TagsRepositoryService,
    private dialog: MatDialog,
    ) { }

  // ngOnChanges(changes: SimpleChanges) {
  //   this.tags = this.filteredTags = changes?.tags?.currentValue;
  //   console.log('this.filteredTags',this.filteredTags);
    
  //   this.filteredTags = new MatTableDataSource(this.filteredTags);
  //   this.filteredTags.paginator = this.paginator;
  //   this.filteredTags.sort = this.sort;
  // }
  loadData() {
    this.tagsRepo.getAllTags().subscribe(res=>{
      this.tags =res?.response;
      this.tags = this.filteredTags =res?.response;
      this.filteredTags = new MatTableDataSource(this.filteredTags);
      this.filteredTags.paginator = this.paginator;
      this.filteredTags.sort = this.sort;
    })
  }

  ngOnInit(): void {
    this.loadData();
  }

  delete(data: TagInterface) {
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: data },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.sub.add(this.tagsRepo.deleteTagByUuid(data.uuid).subscribe(
          (res) => {
            console.log({ res });
            this.loadData();
          },
          (err) => {
            console.log({ err });
            this.errors = err.error.error;
          }
        ));
      }
    })
  }


  filterTags(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();;
    if (filterValue) {
      this.filteredTags = this.tags.filter((tag) => {
        return tag.title.toLowerCase().includes(filterValue)
      });
    } else {
      this.filteredTags = this.tags;
    }
    this.filteredTags = new MatTableDataSource(this.filteredTags);
    this.filteredTags.paginator = this.paginator;
    this.filteredTags.sort = this.sort;
  }

}
