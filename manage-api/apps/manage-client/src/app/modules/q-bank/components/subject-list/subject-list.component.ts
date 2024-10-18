import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { QBankSubjectInterface, RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { HelperService, QBankRepositoryService, RolesService } from '@application/ui';

@Component({
  selector: 'application-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.less']
})
export class SubjectListComponent implements OnInit, OnChanges {

  @Input() list: QBankSubjectInterface[];
  @Output() delete = new EventEmitter<QBankSubjectInterface>();
  filteredList: any;
  actionsVisible = true;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  isChapterVisible:boolean;
  addTopicVisible:boolean;

  orderValue: number;
  isInputEnabled: boolean;
  isChangeBtnEnabled: boolean;
  orderType: string;
  subjectList:any;

  active:boolean;

  constructor(
    public helper: HelperService,
    private router: Router,
    private roleService: RolesService,
    private qbankRepo: QBankRepositoryService,

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
      // this.roleService.getRoleById(role).subscribe(r => {
        roleData[0].rolePermissions.map(res => {
          if (res.module[0].title === modules.type.QBANK_CHAPTERS){
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isChapterVisible = true;
              }
            })
          }
          else if (res.module[0].title === modules.type.QBANK_TOPICS){
            res.subModules.map(e => {
              if (e.title == subM.type.ADD) {
                this.addTopicVisible = true;
              }
            })
          }
        })
      // })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filteredList = this.list;
    this.filteredList.map(res=>{res.disabled = true})
    console.log( this.filteredList);
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
      this.active = true;
      this.filteredList.map(res=>{
        res.disabled = false
      })
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
      this.qbankRepo.dragAndDropQBSubjects(subjectPayload).subscribe(data => { 
        if(data){
          window.location.reload();
          // this._location.back()
        }
      })
    }
  }
  edit(obj: QBankSubjectInterface) {
    return this.router.navigateByUrl(`/q-bank/subjects/${obj.uuid}/edit`);
  }
  filterList(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value.trim();
    // let val = filterValue.toLowerCase()
    // console.log('filterValue',filterValue);
    // console.log('val',val);
    if (filterValue) {
      this.filteredList = this.list.filter((subject) => {
        return (
          subject.syllabus?.title.toLowerCase().includes(filterValue.toLowerCase()) ||
          subject.courses?.title.toLowerCase().includes(filterValue.toLowerCase())||
          subject.flags?.active.toString().toLowerCase().includes(filterValue.toLocaleLowerCase()) 
        );
      });
      // this.filteredList = this.list.filter((question) => {
      //    return question.syllabus.title.toLowerCase().includes(filterValue.toLowerCase());
      // });
    } else {
      this.filteredList = this.list;
    }
  }

  getSubject(subject){
    console.log(subject);
    // window.sessionStorage.removeItem('subjectName');
    // window.sessionStorage.removeItem('subjectUuid');
    // window.sessionStorage.removeItem('syllabusUuid');
    // window.sessionStorage.setItem('subjectName',subject.syllabus.title);
    // window.sessionStorage.setItem('subjectUuid',subject.uuid);
    // window.sessionStorage.setItem('syllabus_id',subject.syllabus._id);
    // window.sessionStorage.setItem('Qbank_id',subject._id);
    // window.sessionStorage.setItem('courseId',subject.courses._id);

    window.localStorage.removeItem('subjectName');
    window.localStorage.removeItem('subjectUuid');
    window.localStorage.removeItem('syllabusUuid');
    window.localStorage.setItem('subjectName',subject.syllabus.title);
    window.localStorage.setItem('subjectUuid',subject.uuid);
    window.localStorage.setItem('syllabus_id',subject.syllabus._id);
    window.localStorage.setItem('Qbank_id',subject._id);
    window.localStorage.setItem('courseId',subject.courses._id);

  }

  addTopic(subject){
    console.log(subject.syllabus._id);
  }

}
