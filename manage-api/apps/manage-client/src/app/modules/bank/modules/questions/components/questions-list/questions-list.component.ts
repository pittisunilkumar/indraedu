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
import { Router } from '@angular/router';
import { QuestionInterface, RoleModulesEnum, RoleSubModulesEnum, SelectedQuestionInterface, SyllabusInterface } from '@application/api-interfaces';
import { HelperService, QuestionsRepositoryService, RolesService, SyllabusRepositoryService } from '@application/ui';

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
  subjects: any;
  subjactsList: any;
  subjectLength: number;
  indexArray = []

  isEditVisible: boolean;
  isAddVisible: boolean;
  isDeleteVisible: boolean;

  filteredQuestions: any;
  selectedList: SelectedQuestionInterface[] = [];
  totalLength = [10, 25, 50, 100];
  total: number;
  // p: number = 1;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  displayedColumns: string[] = [
    // 'sno',
    'title',
  ];
  isEnabled: boolean;

  length: number;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  subjectId: string;


  constructor(
    private syllabusRepository: SyllabusRepositoryService,
    private questionsRepo: QuestionsRepositoryService,
    private helper: HelperService,
    private router: Router,
    private roleService: RolesService,

  ) { }

  ngOnChanges(changes: SimpleChanges) {
    // this.questions = this.filteredQuestions = changes?.questions?.currentValue;
    // this.total = this.filteredQuestions?.length;
    // this.filteredQuestions = new MatTableDataSource(this.filteredQuestions);
    // this.filteredQuestions.paginator = this.paginator;
    // this.filteredQuestions.sort = this.sort;
    // this.total = this.filteredQuestions.data.length
    this.syllabusRepository.getOnlySubjects().subscribe(data => {
      this.subjects = data.response;
      this.subjactsList = new MatTableDataSource(this.subjects)
    })
  }
  syllabusFilter(event: any) {
    if (event.target.value == '') {
      this.isEnabled = false;
      this.filteredQuestions = []
    }
    this.subjactsList.filter = event.target.value.trim().toLowerCase();
    this.subjects = this.subjactsList.filteredData;
  }
  questionsBySubject(subject) {
    this.subjectId = subject._id
    let sub = ""
    sub = sub + "&subjectIds[]=" + subject._id
    let data = {
      page: 1,
      limit: 10,
      search: '',
      subjectIds: sub
    }
    this.questionsRepo.paginatedQuestionsBySubject(data).subscribe(
      (res: any) => {
        // this.students = res?.response;
        this.filteredQuestions = this.questions = res?.response?.data;
        this.subjectLength = res.response.length
        this.filteredQuestions = new MatTableDataSource(res?.response?.data);
        this.length = res?.response?.totalRecords;
        console.log('this.length', this.length);

        //  this.length = this.total = this.pageEvent.length = res?.response?.totalRecords;
        res.response.data.map((res, i) => {
          this.indexArray.push(i)
        });
        // this.isEnabled = true;
      },
      (err) => { }
    );
    // this.questionsRepo.getAllQuestionsBySyllabusId(subject._id).subscribe(data => {
    //   if (data) {
    //     this.filteredQuestions = data.response;

    //     this.questions =  data.response;
    //     this.subjectLength = data.response.length
    //     this.filteredQuestions = new MatTableDataSource(this.filteredQuestions);
    //     console.log( this.filteredQuestions);

    //     this.filteredQuestions.paginator = this.paginator;
    //     this.total = this.filteredQuestions.data.length;
    //     this.isEnabled = true;
    //     data.response.map((res,i)=>{
    //       this.indexArray.push(i)
    //     })
    //   }
    // })
  }
  filterQuestions(event: any) {
    let filterValue = event;

    let data = {
      // shortTitle: "",
      // questionId: ""
      search : filterValue.trim()

    }
    if (filterValue) {
      // if (filterValue.length > 10) {
      //   data.shortTitle = filterValue.trim()
      // }
      // else {
      //   data.questionId = filterValue.trim()
      // }
      this.questionsRepo.searchQuestion(data).subscribe(
        (res: any) => {
          this.filteredQuestions = this.questions = res?.response
          this.filteredQuestions = new MatTableDataSource(res?.response);
          this.length =  res?.response?.length;
        },
        (err) => { }
      );
    }
    else {
      let sub = ""
      sub = sub + "&subjectIds[]=" + this.subjectId
      let data = {
        page: 1,
        limit: 10,
        search: '',
        subjectIds: sub
      }
      this.questionsRepo.paginatedQuestionsBySubject(data).subscribe(
        (res: any) => {
          // this.students = res?.response;
          this.filteredQuestions = this.questions = res?.response?.data
          this.filteredQuestions = new MatTableDataSource(res?.response?.data);
          this.length = res?.response?.totalRecords;
        },
        (err) => { }
      );
    }
  }
  lengthNumber() {
    let sub = ""
    sub = sub + "&subjectIds[]=" + this.subjectId
    let data = {
      page: this.pageEvent.pageIndex + 1,
      limit: this.pageEvent.pageSize,
      search: '',
      subjectIds: sub
    }
    this.questionsRepo.paginatedQuestionsBySubject(data).subscribe(
      (res: any) => {
        // this.students = res?.response;
        this.filteredQuestions = this.questions = res?.response?.data
        this.filteredQuestions = new MatTableDataSource(res?.response?.data);
        this.length = res?.response?.totalRecords;
      },
      (err) => { }
    );

    // this.itemsPerPage = event.pageSize;
    // this.p = event.pageIndex + 1
  }

  // filterQuestions(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value.trim();;

  //   if (filterValue) {
  //     this.filteredQuestions.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  //     this.filteredQuestions = new MatTableDataSource(this.filteredQuestions.filteredData);
  //     this.filteredQuestions.paginator = this.paginator;
  //     // this.subjects = this.subjactsList.filteredData;
  //     // this.filteredQuestions = this.questions.filter((question) => {   
  //     //   return (
  //     //     question.title.toLowerCase().includes(filterValue) ||
  //     //     question.options.map(cou => cou?.name.toLowerCase().includes(filterValue))
  //     //   );
  //     // });
  //     this.isEnabled = true
  //   } else {
  //     if (this.subjectLength) {
  //       // this.filteredQuestions = this.questions;
  //       this.filteredQuestions = new MatTableDataSource(this.questions);
  //       this.filteredQuestions.paginator = this.paginator;
  //     }
  //     else{
  //      this.isEnabled = false;
  //     }
  //   }
  //   // this.filteredQuestions = new MatTableDataSource(this.filteredQuestions);
  //   // this.filteredQuestions.paginator = this.paginator;
  // }

  // lengthNumber(event) {
  //   console.log(event.pageSize);
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

  ngOnInit(): void {
    this.loadPermissions()
  }

  loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
      roleData[0].rolePermissions.map(res => {
        if (res.module[0].title === modules.type.QUESTIONS)
          res.subModules.map(e => {
            if (e.title == subM.type.ADD) {
              this.isAddVisible = true;
            }
            else if (e.title == subM.type.DELETE) {
              this.isDeleteVisible = true;
            }
            else if (e.title == subM.type.EDIT) {
              this.isEditVisible = true;
            }
          })
      })
      // })
    }
  }
}
