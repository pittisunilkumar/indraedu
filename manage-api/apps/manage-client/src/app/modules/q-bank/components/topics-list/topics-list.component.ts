import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QBankInterface, QBankSubjectChapterInterface, RoleModulesEnum, RoleSubModulesEnum, TestInterface } from '@application/api-interfaces';
import { HelperService, QBankRepositoryService, QuestionsRepositoryService, RolesService } from '@application/ui';
import { CopyQuestionsComponent } from '..';

@Component({
  selector: 'application-qbank-topics-list',
  templateUrl: './topics-list.component.html',
  styleUrls: ['./topics-list.component.less']
})
export class TopicsListComponent implements OnInit, OnChanges {

  @Input() chapters: QBankSubjectChapterInterface[];

  @Output() delete = new EventEmitter<TestInterface>();
  @Output() multipletDeleteTopic = new EventEmitter<TestInterface>();
  @Output() chapterDelete = new EventEmitter<QBankSubjectChapterInterface>();
  @Output() multipletDelete = new EventEmitter<QBankSubjectChapterInterface>();
  @Output() edit = new EventEmitter<TestInterface>();
  @Output() viewQuestions = new EventEmitter<TestInterface>();

  filteredList: any;
  allSelected = false
  allComplete: boolean = false;
  Indeterminate = false;
  isBtnEnabled:boolean;
  selectedList: any = [];
  selectedChapterCount:number;

  isChapterVisible:boolean;
  viewTopicQueEnable:boolean;
  editTopicEnable:boolean;
  deleteTopivEnabled:boolean;
  viewTopicEnable:boolean;

  orderValue: number;
  isInputEnabled: boolean;
  isChangeBtnEnabled: boolean;
  orderType: string;
  list:any;
  qBankSubjectUuid:string;


  constructor(
    public helper: HelperService,
    private dialog: MatDialog,
    private roleService: RolesService,
    private queRepo: QuestionsRepositoryService,
    private qbankRepo: QBankRepositoryService,

  ) {}

  ngOnInit() {
    this.loadPermissions();
    // this.qBankSubjectUuid = window.sessionStorage.getItem('subjectUuid');
    this.qBankSubjectUuid = window.localStorage.getItem('subjectUuid');

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
              if (e.title == subM.type.DELETE) {
                this.isChapterVisible = true;
              }
            })
          }
          else if (res.module[0].title === modules.type.QBANK_TOPICS){
            res.subModules.map(e => {
              if (e.title == subM.type.EDIT) {
                this.editTopicEnable = true;
              }
              else if (e.title == subM.type.DELETE) {
                this.deleteTopivEnabled = true;
              }
              else if (e.title == subM.type.VIEW_QUESTIONS) {
                this.viewTopicQueEnable = true;
              }
              else if (e.title == subM.type.VIEW) {
                this.viewTopicEnable = true;
              }
            })
          }
        })
      // })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.chapters = this.filteredList = changes?.chapters?.currentValue;
    this.filteredList.map(res=>{res.disabled = true})

  }

  filterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.filteredList = this.chapters.filter((question) => {
        return question.title.toLowerCase().includes(filterValue.toLowerCase());
      });
    } else {
      this.filteredList = this.chapters;
    }
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
      this.list.map((res, i) => {
        this.list[i].order = i + 1;
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
  updateChaptersOrder() {
    console.log('this.list',this.list);
    let chaptersPayload = {
      from_subject: this.qBankSubjectUuid,
      chapters: this.list,
    }
    console.log(chaptersPayload);
    if(chaptersPayload){
      this.qbankRepo.dragAndDropQBChapters(chaptersPayload).subscribe(data => { 
        if(data){
          window.location.reload();
          // this._location.back()
        }
      })
    }
  }
  getChapterUUid(chapter){
    // window.sessionStorage.removeItem('chapteruuid');
    // window.sessionStorage.removeItem('chapterName');
    // window.sessionStorage.setItem('chapteruuid',chapter.uuid);
    // window.sessionStorage.setItem('chapterName',chapter.title);

    window.localStorage.removeItem('chapteruuid');
    window.localStorage.removeItem('chapterName');
    window.localStorage.setItem('chapteruuid',chapter.uuid);
    window.localStorage.setItem('chapterName',chapter.title);
  }

  toggleQuestion(event, chapter) {
    const Quuid = chapter.uuid;
    let index: number;
    if (event.checked) {
      this.selectedList = [...this.selectedList,chapter];
    }
    else {
      this.selectedList?.filter((it, ind) => {
        if (it.uuid === Quuid) {
          index = ind;
        }
      });
      this.selectedList?.splice(index, 1);
    }
    this.checkBoxChecked();
    this.selectedChapterCount = this.selectedList.length;
    console.log(this.selectedList);
  }

  setAll(completed: boolean) {
    if (completed == true) {
      this.allSelected = true;
      this.filteredList.map(res => {
        const arr = this.selectedList?.filter(it => it.uuid === res.uuid);
        if (!arr?.length) {
          this.selectedList?.push(res);
        }
      })
    }
    else {
      this.allSelected = false
      this.selectedList = []
    }

    this.checkBoxChecked();
    this.selectedChapterCount = this.selectedList.length;
    console.log(this.selectedList);
  }

  checkBoxChecked(){
    if (this.filteredList.length == this.selectedList.length) {
      this.Indeterminate = false;
      this.allComplete = true;
      this.isBtnEnabled = true;
    }
    else {
      if (this.selectedList.length == 0) {
        this.Indeterminate = false;
        this.allComplete = false;
        this.isBtnEnabled = false;
      }
      else if (this.selectedList.length > 0) {
        this.Indeterminate = true;
        this.isBtnEnabled = true;
      }
    }
  }

  onCopy(){
    const dialogRef = this.dialog.open(CopyQuestionsComponent, {
      data: { payload: this.selectedList,copyMode:'chapters',type:'copy' },
      height:'50%'
    });
  }
  onMove(){
    const dialogRef = this.dialog.open(CopyQuestionsComponent, {
      data: { payload: this.selectedList,copyMode:'chapters',type:'move' },
      height:'50%'
    });
  }
  multipletDeleteChapters(){
    this.multipletDelete.emit(this.selectedList);
    this.isBtnEnabled = false;
  }

  updateShortName(){
    let array = []
    this.filteredList.map(res=>{
      res.topics.map(topic=>{
        topic.que.map(que=>{
          array.push(que)
        })        
      })
    })
    console.log('array',array);
    this.queRepo.updateShortTitle(array).subscribe(data => {
      if (data) {
        window.location.reload();
      }
    })
    
    
  }

}
