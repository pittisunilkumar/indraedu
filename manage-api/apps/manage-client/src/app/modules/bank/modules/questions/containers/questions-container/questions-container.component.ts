import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { QuestionInterface, ResponseInterface, RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, HelperService, QuestionsRepositoryService, RolesService } from '@application/ui';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'application-questions-container',
  templateUrl: './questions-container.component.html',
  styleUrls: ['./questions-container.component.less'],
})
export class QuestionsContainerComponent implements OnInit {
  questions$: Observable<ResponseInterface<QuestionInterface[]>>;
  sub: Subscription;
  length:number;
  errors: string[];
  isEnabled = true;
  currentURL='';
  modules:any;
  pathName:string;
  baseUrl:string;
  moduleName?:string;

  isAddVisible: boolean;
  

  constructor(
    private questionsRepo: QuestionsRepositoryService,
    private dialog: MatDialog,
    private helper: HelperService,
    private router: Router,
    private roleService: RolesService,
    ) {
      router.events.subscribe(event => {
        if (event instanceof NavigationEnd ) {
            this.currentURL = event.url;
            this.pathName = this.currentURL.split("/").join(" ");
            this.baseUrl = this.pathName.split(" ")[2];
            localStorage.setItem('baseUrl',this.baseUrl)
        }
      });
    }

  ngOnInit(): void {
    window.localStorage.removeItem('questionType')
    // this.loadData();
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
            })
        })
      // })
    }
  }

  loadData() {
    this.questions$ = this.questionsRepo.getAllQuestions();
    // this.questions$.subscribe(data=>{
    //   this.length = data.response.length
    // })
    // this.questionsRepo.getAllQuestions().subscribe(data =>{
    //   this.length =data.response.length ;
    // })
  }
  // isEnable(){
  //   this.isEnabled =false
  // }

  removeQuestion(question: QuestionInterface) {
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: question },
      height:'60%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.questionsRepo.removeQuestion(question).subscribe(
          (res) => {
            console.log({ res });
            this.questions$ = this.questionsRepo.getAllQuestions();
          },
          (err) => {
            console.log({ err });
            this.errors = err.error.error;
          }
        );
      }
    })

  }
  setPath(){
    window.localStorage.setItem('path','bank')
  }
  
}
