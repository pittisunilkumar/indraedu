import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { QBankInterface, QuestionInterface, SelectedQuestionInterface } from '@application/api-interfaces';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CopyQuestionsComponent } from '../copy-questions/copy-questions.component';
import { QBankRepositoryService } from '@application/ui';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import exportFromJSON from 'export-from-json'
import * as XLSX from 'xlsx';

export interface Task {
  name: string;
  completed: boolean;

}

@Component({
  selector: 'application-view-questions',
  templateUrl: './view-questions.component.html',
  styleUrls: ['./view-questions.component.less']
})
export class ViewQuestionsComponent implements OnInit {
  @Input() question: QuestionInterface;
  // @Input() data: QBankDataInterface;
  @Input() mode: string;
  @Input() topic: QBankInterface;
  @Input() isApiCalling: boolean;
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<QuestionInterface>();
  @Output() multipletDelete = new EventEmitter<QuestionInterface>();
  @Output() data = new EventEmitter<SelectedQuestionInterface>();
  selectedQuestion: SelectedQuestionInterface;
  selectedList: any = [];
  selectedQuestionscount: number;
  isInputEnabled: boolean;
  isChangeBtnEnabled: boolean;
  orderType: string;

  @Output() commit = new EventEmitter<QBankInterface>();
  list: any;
  questionList:any;
  total: number;
  filteredQuestions: any
  totalLength = [10, 25, 50, 100];
  displayedColumns: string[] = [
    'title',
  ];
  allSelected = false
  allComplete: boolean = false;
  Indeterminate = false;
  isBtnEnabled: boolean;
  orderValue: number;
  // exsistingOrder: number;
  // index: number;
  reOrderQuetions = []
  p: number = 1;
  itemsPerPage:number = 10;

  subjectUuid:string;
  chapteruuid:string;
  topicUuid:string;
  answer = ['','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;


  constructor(
    private router: Router,
    private _location: Location,
    private dialog: MatDialog,
    private qbankRepo: QBankRepositoryService,
  ) { }


  ngOnInit(): void {
    // this.subjectUuid = window.sessionStorage.getItem('subjectUuid'),
    // this.chapteruuid =  window.sessionStorage.getItem('chapteruuid'),
    // this.topicUuid = window.sessionStorage.getItem('topicUuid'),
    this.subjectUuid = window.localStorage.getItem('subjectUuid'),
    this.chapteruuid =  window.localStorage.getItem('chapteruuid'),
    this.topicUuid = window.localStorage.getItem('topicUuid'),
    this.selectedQuestion = {
      que: this.question,
      isSelected: false,
      positive: null,
      negative: null,
      order: null,
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.topic?.currentValue) {
      this.list = this.questionList = changes?.topic?.currentValue;
      this.list.map(res=>{res.disabled = true})
      this.filteredQuestions = changes?.topic?.currentValue;
      this.filteredQuestions = new MatTableDataSource(this.filteredQuestions);
      this.filteredQuestions.paginator = this.paginator;
      this.totalLength=[10,25,50,100,200]
      console.log(this.list);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.orderType == 'dragAndDrop') {
      this.isChangeBtnEnabled = true;
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

  lengthNumber(event) {
    console.log(event.pageIndex + 1);
    console.log(event.pageSize);
    this.itemsPerPage = event.pageSize;
    this.p = event.pageIndex + 1
  }

//   onPageChange(e) {
//     this.tempList = this.list.slice(e.pageIndex * e.pageSize,(e.pageIndex + 1) *e.pageSize);
// }

  changeOrder(event, question, index) {
    this.orderValue = event.target.value;
    console.log(index);
    
    if (this.orderType == 'type') {
      this.list[index].order = this.orderValue;
    }
    // else if (this.orderType == 'swapping') {
    //   if (question.order) {
    //     this.list.map((res, i) => {
    //       if (res.order == this.orderValue) {
    //         this.list[i].order = question.order;
    //         this.list[index].order = this.orderValue;
    //         this.reOrderQuetions.push(this.list[i])
    //         this.reOrderQuetions.push(this.list[index])
    //       }
    //     })
    //   }
    // }
    // else if (this.orderType == 'reorder') {
    //   if (this.orderValue) {
    //     this.list.map((res, i) => {
    //       if (res.order >= this.orderValue) {
    //         this.list[i].order = this.list[i].order + 1;
    //       }
    //     })
    //     this.list[index].order = this.orderValue;
    //   }
    // }

    this.isChangeBtnEnabled = true;

  }

  selectOrderType(event) {
    this.orderType = event.value;
    if (this.orderType == 'type') {
      this.isInputEnabled = true;
      this.isChangeBtnEnabled = true;
    }
    else if (this.orderType == 'dragAndDrop') {
      this.isInputEnabled = false;
      this.list.map(res=>{res.disabled = false})

    }
    // if (this.orderType == 'indexOrder') {
    //   this.isInputEnabled = false;
    //   this.isChangeBtnEnabled = true;
    //   this.list.map((res, i) => {
    //     this.list[i].order = i + 1;
    //   })
    // }
  }

  updateQuestionOrder() {
    let fromQue: string[] = [];
    let questionsData = []
    this.list.map((res, i) => {
      fromQue.push(res.uuid)
    })
    this.list.map(res => {
      questionsData.push({ 'uuid': res.uuid, 'order': parseInt(res.order) })
    })
    let questionsPayload = {
      from_subject: this.subjectUuid,
      from_chapter: this.chapteruuid,
      from_topic: this.topicUuid,
      from_que: fromQue,
      to_subject: this.subjectUuid,
      to_chapter: this.chapteruuid,
      to_topic: this.topicUuid,
      que: questionsData
    }
    console.log(questionsPayload);
    if(questionsData.length){
      this.qbankRepo.dragAndDropQBQuestions(questionsPayload).subscribe(data => { 
        if(data){
          window.location.reload();
          // this._location.back()
        }
      })
    }
  }


  filterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.list = this.questionList.filter((question) => {
        return (question?.title.toLowerCase().includes(filterValue.toLowerCase()) ||
          question?.questionId.toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    } else {
      this.list = this.questionList;
    }
    this.filteredQuestions = new MatTableDataSource(this.list);
    this.filteredQuestions.paginator = this.paginator;
  }

  toggleQuestion(event, question) {
    let selectedQuestion = {
      _id: question._id,
      uuid: question.uuid,
      order: question.order,
      title: question.title
    }
    const Quuid = question.uuid;
    let index: number;
    if (event.checked) {
      this.selectedList = [...this.selectedList, selectedQuestion];
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
    this.selectedQuestionscount = this.selectedList.length

    console.log(this.selectedList);
  }

  setAll(completed: boolean) {
    if (completed == true) {
      this.allSelected = true;
      this.filteredQuestions.data.map(res => {
        let selectedQuestion = {
          _id: res._id,
          uuid: res.uuid,
          order: res.order,
          title: res.title
        }
        const arr = this.selectedList?.filter(it => it.uuid === selectedQuestion.uuid);
        if (!arr?.length) {
          this.selectedList?.push(selectedQuestion);
        }
      })
    }
    else {
      this.allSelected = false
      this.selectedList = []
    }

    this.checkBoxChecked();
    this.selectedQuestionscount = this.selectedList.length
    console.log(this.selectedList);
  }

  checkBoxChecked() {
    if (this.filteredQuestions.data.length == this.selectedList.length) {
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

  onCopy() {
    const dialogRef = this.dialog.open(CopyQuestionsComponent, {
      data: { payload: this.selectedList, copyMode: 'questions', type: 'copy' },
      height: '70%'
    });
  }

  onMove() {
    const dialogRef = this.dialog.open(CopyQuestionsComponent, {
      data: { payload: this.selectedList, copyMode: 'questions', type: 'move' },
      height: '70%'
    });
  }
  multipletDeleteQuestions() {
    this.multipletDelete.emit(this.selectedList);
    this.isBtnEnabled = false;
  }

  sessionStorage(question){
    // window.sessionStorage.setItem('questionType', question.type)
    window.localStorage.setItem('questionType', question.type);
    window.localStorage.setItem('lastOrder', question.order);
    window.localStorage.setItem('path', 'Qbank');

  }

  exportJson(): void {
    let array = [];
    var result = this.list.reduce((unique, o) => {
      if(!unique.some(obj => obj.uuid === o.uuid && obj._id === o._id)) {
        unique.push(o);
      }
      return unique;
  },[]);
    console.log(result);
    result.map(res => {
      let cData = {
        uuid: res.uuid,
        Question: res.title,
        type: res.type,
        options: res.options,
        Answer: res.answer,
        Question_image : res.imgUrl == "" ? '' : res.imgUrl,
        description: res.description == "" ? res.title : res.description,
        difficulty:  res.difficulty,
        previous_apperance  : res.previousAppearances == '' ? '' : res.previousAppearances,
        perals: res.perals,
        tags: res.tags,
        questionId: '',
        flags: res.flags,
        testSeries: null,
        Question_order : parseInt(res.order),
        syllabus: res.syllabus,
        math_library : res.mathType,
        description_image   : res.descriptionImgUrl == "" ? '' : res.descriptionImgUrl,
        createdOn: new Date().toISOString().toString(),
        createdBy: res.createdBy,
        modifiedOn: null,
      }
      array.push(cData)
    })
    const data = array
    const fileName = window.localStorage.getItem('topicName')
    const exportType = 'json'
    exportFromJSON({ data, fileName, exportType })
  }
  exportExcel(){
    let answer = ['','A','B','C','D','E','F','G','H']
    if (this.list.length === 0) {
      alert("No data available for ExportData");
    }
    else {
      let option = 'option'

      const dataToExport = this.list
        .map(x => ({
          id:'',
          question_dynamic_id:'',
          course_id:'',
          subject_id:'',
          category_id:'',
          quiz_id:'',
          math_library: x?.mathType,
          question: x?.title,
          question_image: x?.imgUrl,
          options: JSON.stringify(x?.options),
          answer:answer[x?.answer.options],
          explanation: x?.description,
          explanation_image: x?.descriptionImgUrl,
          reference:'',
          positive_marks: x?.positive,
          negative_marks:x?.negative,
          que_number:'',
          question_type: x?.type,
          status: x?.flags.active,
          created_on: new Date().toISOString().toString(),
          modified_on: null,
        }));
        dataToExport.map((res,i)=>{
          JSON.parse(res.options).map((opt,j)=>{
            res[option+[this.answer[j+1]] ] = opt.name
          })
        })
        console.log('dataToExport',dataToExport);

      let workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport, <XLSX.Table2SheetOpts>{ sheet: 'Sheet 1' });
      let workBook: XLSX.WorkBook = XLSX.utils.book_new();

      // Adjust column width
      var wscols = [
        { wch: 15 }
      ];
      const fileName = window.localStorage.getItem('topicName')
      workSheet["!cols"] = wscols;
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet 1');
      XLSX.writeFile(workBook, `${fileName}.xlsx`);
    }
  }


}
