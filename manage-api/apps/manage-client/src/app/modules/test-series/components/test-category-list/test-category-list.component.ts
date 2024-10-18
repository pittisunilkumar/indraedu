import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RoleModulesEnum, RoleSubModulesEnum, TestCategoryInterface } from '@application/api-interfaces';
import { HelperService, RolesService } from '@application/ui';

@Component({
  selector: 'application-test-category-list',
  templateUrl: './test-category-list.component.html',
  styleUrls: ['./test-category-list.component.less']
})
export class TestCategoryListComponent implements OnInit, OnChanges {

  displayedColumns: string[] = [
    'sno',
    'title',
    'courses',
    'order',
    'active',
    'createdOn',
    'actions',
  ];
  dataSource: MatTableDataSource<TestCategoryInterface>;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  @Input() categories: TestCategoryInterface[];
  @Output() delete = new EventEmitter<TestCategoryInterface>();
  @Output() edit = new EventEmitter<TestCategoryInterface>();
  @Output() assignSyllabus = new EventEmitter<TestCategoryInterface>();
  @Output() categoryUuid = new EventEmitter<TestCategoryInterface>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  categoriesList: TestCategoryInterface[];
  createTestVisible:boolean;
  viewTestVisible:boolean;
  constructor(
    public helper: HelperService,
    private roleService: RolesService,
    ) {}

  deleteEnabled:string;
  editEnabled:string
  ngOnInit() {
    this.deleteEnabled = localStorage.getItem('deleteAccess');
    this.editEnabled = localStorage.getItem('editAccess');
    this.loadPermissions();
   }
   loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
        roleData[0].rolePermissions.map(res => {
          if (res.module[0].title === modules.type.TESTS){
            res.subModules.map(e => {
              if (e.title == subM.type.ADD) {
                this.createTestVisible = true;
              }
            })
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.viewTestVisible = true;
              }
            })
          }
        })
      // })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.categories?.currentValue) {
      this.categories = this.categoriesList = changes?.categories?.currentValue
      console.log('this.categories', this.categories);
      // this.dataSource = new MatTableDataSource(changes?.categories?.currentValue);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
    if (filterValue) {
      this.categories = this.categoriesList.filter((cat) => {
        return (
          cat.categories.title.toLowerCase().includes(filterValue.toLowerCase()) ||
          cat.courses.title.toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    } else {
      this.categories = this.categoriesList;
    }
  }

  getCategoryUuid(category){
    // window.sessionStorage.setItem('cUuid',category.uuid)
    // window.sessionStorage.setItem('categoryId',category._id)
    // window.sessionStorage.setItem('courseId',category.courses._id)
    // window.sessionStorage.setItem('courseName',category.courses.title)
    // window.sessionStorage.setItem('categoryName',category.categories.title)

    window.localStorage.setItem('cUuid',category.uuid)
    window.localStorage.setItem('categoryId',category._id)
    window.localStorage.setItem('courseId',category.courses._id)
    window.localStorage.setItem('courseName',category.courses.title)
    window.localStorage.setItem('categoryName',category.categories.title)
  }

}
