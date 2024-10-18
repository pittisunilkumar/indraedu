import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QuestionInterface, SelectedQuestionInterface } from '@application/api-interfaces';
import { QuestionsRepositoryService } from '@application/ui';

@Component({
  selector: 'application-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.less'],
})
export class QuestionsListComponent implements OnInit, OnChanges {

  @Input() questions: QuestionInterface[];
  @Output() delete = new EventEmitter<QuestionInterface>();
  @Output() edit = new EventEmitter<QuestionInterface>();
  @Input() canSelect?= false;
  @Output() selection = new EventEmitter<SelectedQuestionInterface[]>();
  @Input() assignedQuestions: Array<any>;

  filteredQuestions: any;
  selectedList: SelectedQuestionInterface[] = [];
  totalLength = [];
  @Input() total: number;
  @Input() subjectIds: any
  displayedColumns: string[] = [
    'title',
  ];

  p: number = 1;
  itemsPerPage:number = 10;
  length = 1000;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;


  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;

  constructor(
    private questionsRepo: QuestionsRepositoryService,

  ) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log('total8978', this.total);
    this.questions = this.filteredQuestions = changes?.questions?.currentValue;
    this.filteredQuestions = new MatTableDataSource(this.filteredQuestions);
    this.filteredQuestions.paginator = this.paginator;
    this.filteredQuestions.sort = this.sort;
    this.totalLength = [25, 50, 100, 250]
  }

  filterQuestions(event: any) {
    let filterValue = event;

    let data ={
      // shortTitle:"",
      // questionId:""
      search : filterValue.trim()
  }
    if(filterValue){
      // if(filterValue.length > 10){
      //   data.shortTitle =filterValue.trim()
      // }
      // else{
      //   data.questionId =filterValue.trim()
      // }
      this.questionsRepo.searchQuestion(data).subscribe(
        (res: any) => {
          this.filteredQuestions = this.questions = res?.response
          this.filteredQuestions = new MatTableDataSource(res?.response);
          this.total= res?.response?.length;

        },
        (err) => { }
      );
    }
    else{
      let sub = ''
      this.subjectIds.map(res => {
        if (res) {
          sub = sub + "&subjectIds[]=" + res
        }
      })
      let data = {
        page: 1,
        limit:10,
        search: '',
        subjectIds: sub
      }
      this.questionsRepo.paginatedQuestionsBySubject(data).subscribe(
        (res: any) => {
          // this.students = res?.response;
          this.filteredQuestions = this.questions = res?.response?.data
          this.filteredQuestions = new MatTableDataSource(res?.response?.data);
          this.total=this.pageEvent.length = res?.response?.totalRecords;
        },
        (err) => { }
      );    }
    // const filterValue = (event.target as HTMLInputElement).value.trim();
    // console.log( this.filteredQuestions);
    // if (filterValue) {
    //   this.filteredQuestions = this.questions.filter((question) => {
    //     return (
    //       question?.title.toLowerCase().includes(filterValue)||
    //       question?.questionId.toLowerCase().includes(filterValue)
    //     )
    //   });
    //   this.filteredQuestions = new MatTableDataSource(this.filteredQuestions);
    // } else {
    //     this.filteredQuestions = new MatTableDataSource(this.questions);
    // }
    // this.filteredQuestions.paginator = this.paginator;
    // this.filteredQuestions.sort = this.sort;
    // this.totalLength= [ 25, 50, 100,250,500,this.filteredQuestions?.filteredData?.length]

  }

  lengthNumber() {
    this.pageEvent.length = this.total
    let sub = ''
    this.subjectIds.map(res => {
      if (res) {
        sub = sub + "&subjectIds[]=" + res
      }
    })
    let data = {
      page: this.pageEvent?.pageIndex + 1,
      limit:this.pageEvent?.pageSize,
      search: '',
      subjectIds: sub
    }
    this.questionsRepo.paginatedQuestionsBySubject(data).subscribe(
      (res: any) => {
        // this.students = res?.response;
        this.filteredQuestions = this.questions = res?.response?.data
        this.filteredQuestions = new MatTableDataSource(res?.response?.data);
        this.total = res?.response?.totalRecords;
      },
      (err) => { }
    );
    // this.itemsPerPage = event.pageSize;
    // this.p = event.pageIndex + 1
  }

  buildSelectedList(payload: SelectedQuestionInterface) {
    const Quuid = payload?.que?.uuid;
    let index: number;

    if (payload.isSelected) {
      const arr = this.selectedList?.filter(it => it.que.uuid === Quuid);
      if (!arr?.length) {
        this.selectedList?.push(payload);
      }
    } else {
      this.selectedList?.filter((it, ind) => {
        if (it.que.uuid === Quuid) {
          index = ind;
        }
      });
      this.selectedList?.splice(index, 1);
    }
    // let list = []
    // console.log('this.selectedList8978',this.selectedList);

    // this.questions.map(e=>{
    //  this.selectedList.map(res=>{

    //     if(e.uuid === res.que.uuid){
    //       list.push(res)
    //     }
    //   })
    //   // console.log('list8978',list);

    // });
    this.selection.emit(this.selectedList);



    // this.selection.emit(this.selectedList);


  }

  ngOnInit(): void {
    // this.pageEvent.length = this.total

   }
}
