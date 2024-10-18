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
import { ActivatedRoute } from '@angular/router';
import { QuestionInterface, SelectedQuestionInterface, SyllabusInterface } from '@application/api-interfaces';
import { QuestionsRepositoryService, SyllabusRepositoryService } from '@application/ui';

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
  @Input() total: number;

  filteredQuestions: any;
  selectedList: SelectedQuestionInterface[] = [];
  mode = this.route.snapshot.data['mode'];
  totalLength = [];
  subjactsList: any;
  subjects: any;
  pageEvent: PageEvent;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];




  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  displayedColumns: string[] = [
    'title',
  ];
  constructor(
    private route: ActivatedRoute,
    private questionsRepo: QuestionsRepositoryService,
    private syllabusRepository: SyllabusRepositoryService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if(this.mode == 'edit'){
      let subId;
      this.route.paramMap.subscribe(params => {
        subId = params.get('subjectId')
      })
      let data = {
        page:  1,
        limit: 10,
        search: '',
        subjectIds: subId
      };
      this.questionsRepo.paginatedQuestionsBySubject(data).subscribe(
        (res: any) => {
          // this.students = res?.response;
          this.filteredQuestions = this.questions = res?.response?.data
          this.filteredQuestions = new MatTableDataSource(res?.response?.data);
          this.total = res?.response?.totalRecords;
        },
        (err) => { }
      );
    }
    else{
      this.filteredQuestions = this.questions;
      this.filteredQuestions = new MatTableDataSource(this.filteredQuestions);
    }
    // this.filteredQuestions.paginator = this.paginator;
    // this.filteredQuestions.sort = this.sort;
    // console.log('this.total',this.total);
    // this.totalLength = [25, 50, 100, 250, 500, this.filteredQuestions.filteredData.length]

    this.syllabusRepository.getOnlySubjects().subscribe(data => {
      this.subjects = data.response
      this.subjactsList = new MatTableDataSource(this.subjects)
    })
  }

  syllabusFilter(event: any) {
    if (event.target.value == '') {
      this.filteredQuestions = []
    }
    this.subjactsList.filter = event.target.value.trim().toLowerCase();
    this.subjects = this.subjactsList.filteredData;
  }
  questionsBySubject(subject) {
    let data = {
      page: 1,
      limit: 10,
      search: '',
      subjectIds: subject._id
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
    // this.questionsRepo.getAllQuestionsBySyllabusId(subject._id).subscribe(data => {
    //   if (data) {

    //     this.filteredQuestions =this.questions = data.response;
    //     this.filteredQuestions = new MatTableDataSource(this.filteredQuestions);
    //     // this.filteredQuestions.paginator = this.paginator;
    //     // this.filteredQuestions.sort = this.sort;
    //     this.totalLength= [ 25, 50, 100,250,500,this.filteredQuestions.filteredData.length]
    //   }
    // })
  }

  // filterQuestions(event: any) {
  //    const filterValue = (event.target as HTMLInputElement).value.trim();
  //   // this.questions.filter = event.target.value.trim().toLowerCase();
  //   // this.filteredQuestions = this.questions;
  //   if (filterValue) {
  //     this.filteredQuestions = this.questions.filter((question) => {
  //       return (
  //         question?.title.toLowerCase().includes(filterValue)||
  //         question?.questionId.toLowerCase().includes(filterValue)
  //       )
  //     });
  //   } else {
  //     this.filteredQuestions = this.questions;
  //   }
  //   this.filteredQuestions = new MatTableDataSource(this.filteredQuestions);
  //   this.filteredQuestions.paginator = this.paginator;
  //   this.filteredQuestions.sort = this.sort;
  // }

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
    this.selection.emit(this.selectedList);
  }
  filterQuestions(event: any) {
    let filterValue = event;
    let data = {
      search: filterValue.trim()
    }
    if (filterValue) {
      this.questionsRepo.searchQuestion(data).subscribe(
        (res: any) => {
          this.filteredQuestions = this.questions = res?.response
          this.filteredQuestions = new MatTableDataSource(res?.response);
          this.total = res?.response?.length;

        },
        (err) => { }
      );
    }
    else {
      let subId;
      this.route.paramMap.subscribe(params => {
        subId = params.get('subjectId')
      })
      let data = {
        page: 1,
        limit: 10,
        search: '',
        subjectIds: subId
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
    }

  }

  lengthNumber(event) {
    let subId;
    this.route.paramMap.subscribe(params => {
      subId = params.get('subjectId')
    })
    let data = {
      page: event.pageIndex + 1,
      limit: event.pageSize,
      search: '',
      subjectIds: subId
    };
    this.questionsRepo.paginatedQuestionsBySubject(data).subscribe(
      (res: any) => {
        // this.students = res?.response;
        this.filteredQuestions = this.questions = res?.response?.data
        this.filteredQuestions = new MatTableDataSource(res?.response?.data);
        this.total = res?.response?.totalRecords;
        console.log('this.total', this.total);

      },
      (err) => { }
    );
  }

  ngOnInit(): void {
  }
}
