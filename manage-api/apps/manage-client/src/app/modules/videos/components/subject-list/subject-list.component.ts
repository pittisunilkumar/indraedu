import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { QBankSubjectInterface, RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { HelperService, RolesService, VideosRepositoryService } from '@application/ui';

@Component({
  selector: 'application-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.less']
})
export class SubjectListComponent implements OnInit {

  @Input() list: QBankSubjectInterface[];
  @Output() delete = new EventEmitter<QBankSubjectInterface>();
  filteredList: QBankSubjectInterface[] | any;
  listData:any
  @ViewChild(MatAccordion) accordion: MatAccordion;

  actionsVisible = true;
  isChapterVisible:boolean;
  addVideoVisible:boolean;

  orderValue: number;
  isInputEnabled: boolean;
  isChangeBtnEnabled: boolean;
  orderType: string;
  subjectList:any

  constructor(
    public helper: HelperService,
    private router: Router,
    private videosRepo: VideosRepositoryService,
    private roleService: RolesService,

  ) { }

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
    //  this.roleService.getRoleById(role).subscribe(r => {
       roleData[0].rolePermissions.map(res => {
         if (res.module[0].title === modules.type.VIDEO_CHAPTERS){
           res.subModules.map(e => {
             if (e.title == subM.type.VIEW) {
               this.isChapterVisible = true;
             }
           })
         }
         else if (res.module[0].title === modules.type.VIDEOS){
           res.subModules.map(e => {
             if (e.title == subM.type.ADD) {
               this.addVideoVisible = true;
             }
           })
         }
       })
    //  })
   }
 }

   
  ngOnChanges(changes: SimpleChanges) {
    this.filteredList = this.list;
    this.filteredList.map(res=>{res.disabled = true})

    console.log(this.filteredList);
    
    this.listData = this.list
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.orderType == 'dragAndDrop') {
      this.isChangeBtnEnabled = true;
      this.list = this.filteredList
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
      this.subjectList = this.filteredList
      this.subjectList.map((res, i) => {
        this.subjectList[i].order = i + 1;
      })
    }
  }


  selectOrderType(event) {
    this.orderType = event.value;
    if (this.orderType == 'type') {
      this.isChangeBtnEnabled = true;
    }
    else if (this.orderType == 'dragAndDrop') {
      this.isInputEnabled = false;
      this.filteredList.map(res=>{res.disabled = false})

    }
  }
  updateSubjectOrder() {
    console.log('this.list',this.subjectList);
    let subjectPayload = []
    this.subjectList.map(res=>{
      subjectPayload.push({'uuid':res.uuid,'order':res.order})
    })
    console.log('subjectPayload',subjectPayload);
    
    if(subjectPayload){
      this.videosRepo.dragAndDropVideoSubjects(subjectPayload).subscribe(data => { 
        if(data){
          window.location.reload();
          // this._location.back()
        }
      })
    }
  }
 

  applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.filteredList = this.listData.filter((subject) => {
        return (
          subject.syllabus?.title.toLowerCase().includes(filterValue.toLowerCase()) ||
          subject.courses?.title.toLowerCase().includes(filterValue.toLowerCase()) ||
          subject.flags?.active.toString().toLowerCase().includes(filterValue.toLocaleLowerCase()) 
        );
      });
    } else {
      this.filteredList = this.listData;
    }
  }

  edit(obj: QBankSubjectInterface) {
    return this.router.navigateByUrl(`/videos/subjects/${obj.uuid}/edit`);
  }

  getSubject(subject){
    window.localStorage.setItem('videoSubjectName',subject.syllabus.title);
    window.localStorage.setItem('videoSubjectUuid',subject.uuid);
    window.localStorage.setItem('subjectId',subject.syllabus._id);
    window.localStorage.setItem('courseId',subject.courses._id);
  }

}
