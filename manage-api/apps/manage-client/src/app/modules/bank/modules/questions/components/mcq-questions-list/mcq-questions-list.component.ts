import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RoleModulesEnum, RoleSubModulesEnum, SelectedQuestionInterface } from '@application/api-interfaces';
import { HelperService, QuestionsRepositoryService, RolesService, SyllabusRepositoryService } from '@application/ui';

@Component({
  selector: 'application-mcq-questions-list',
  templateUrl: './mcq-questions-list.component.html',
  styleUrls: ['./mcq-questions-list.component.less']
})
export class McqQuestionsListComponent implements OnInit {

  subjects: any;
  subjactsList: any;
  subjectLength: number;
  indexArray = [];

  questions: any;

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

  constructor(
    private syllabusRepository: SyllabusRepositoryService,
    private questionsRepo: QuestionsRepositoryService,
    private helper: HelperService,
    private router: Router,
    private roleService: RolesService,

  ) { }

  ngOnChanges(changes: SimpleChanges) {
  }


  ngOnInit(): void {
    this.questionsRepo.viewMcqOfTheDay().subscribe(data => {
      this.questions = this.filteredQuestions = data.response;
      this.total = this.filteredQuestions?.length;
      this.filteredQuestions = new MatTableDataSource(this.filteredQuestions);
      this.filteredQuestions.paginator = this.paginator;
      this.filteredQuestions.sort = this.sort;
      this.total = this.filteredQuestions.data.length
    })
    // this.loadPermissions()
  }

  filterQuestions(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();;
    if (filterValue) {
      this.filteredQuestions = this.questions.filter((question) => {
        return question?.questionId?.title.toLowerCase().includes(filterValue.toLowerCase())
        // return (question?.questionId?.title.toLowerCase().includes(filterValue.toLowerCase()) ||
        //   question?.questionId?.questionId?.toLowerCase().includes(filterValue.toLowerCase())
        // );
      });
      this.filteredQuestions = new MatTableDataSource(this.filteredQuestions);
      this.filteredQuestions.paginator = this.paginator;
    } else {
      this.filteredQuestions = this.questions;
      this.filteredQuestions = new MatTableDataSource(this.filteredQuestions);
      this.filteredQuestions.paginator = this.paginator;
    }
    // this.filteredQuestions = new MatTableDataSource(this.questions);
    // this.filteredQuestions.paginator = this.paginator;
  }

  async changeStatus(id: string, status: boolean) {
    if (status === false) {
      status = true;
    } else {
      status = false;
    }
    const Form = {
      status,
    };
    this.questionsRepo.updateMcqStatus(id, Form).subscribe((data) => {
      // this.loadData();
    });
  }

  // loadPermissions() {
  //   let modules = this.helper.enumtoArray(RoleModulesEnum);
  //   let subM = this.helper.enumtoArray(RoleSubModulesEnum);
  //   let role = localStorage.getItem('role');
  //   let roleData = JSON.parse(localStorage.getItem('roleData'));

  //   if (role) {
  //     // this.roleService.getRoleById(role).subscribe(r => {
  //       roleData[0].rolePermissions.map(res => {
  //         if (res.module[0].title === modules.type.QUESTIONS)
  //           res.subModules.map(e => {
  //             if (e.title == subM.type.ADD) {
  //               this.isAddVisible = true;
  //             }
  //             else if (e.title == subM.type.DELETE) {
  //               this.isDeleteVisible = true;
  //             }
  //             else if (e.title == subM.type.EDIT) {
  //               this.isEditVisible = true;
  //             }
  //           })
  //       })
  //     // })
  //   }
  // }

}
