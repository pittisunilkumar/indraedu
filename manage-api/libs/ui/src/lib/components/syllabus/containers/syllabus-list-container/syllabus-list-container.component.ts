import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ResponseInterface, RoleModulesEnum, RoleSubModulesEnum, SyllabusInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, HelperService } from '@application/ui';
import { Observable } from 'rxjs';
import { RolesService, SyllabusRepositoryService } from '../../../../repositories';

@Component({
  selector: 'application-list-container',
  templateUrl: './syllabus-list-container.component.html',
  styleUrls: ['./syllabus-list-container.component.less'],
})
export class SyllabusListContainerComponent implements OnInit {
  canShowCreateBlock = true;
  errors: string[];
  syllabus$: Observable<ResponseInterface<SyllabusInterface[]>>;
 length:number;
 isEditVisible: boolean;
 isAddVisible: boolean;
 isDeleteVisible: boolean;


  constructor(
    private syllabusRepository: SyllabusRepositoryService,
    private router: Router,
    private dialog: MatDialog,
    private helper: HelperService,
    private roleService: RolesService,
    
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadPermissions()
  }

  loadData() {
    this.syllabus$ = this.syllabusRepository.GetSubjectsAndChapters();
    this.syllabus$.subscribe(data=>{
      this.length = data.response.length
      console.log(data.response);
    })
    
  }
  loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
        roleData[0].rolePermissions.map(res => {
          if (res.module[0].title === modules.type.SYLLABUS)
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

  delete(syllabus: SyllabusInterface) {
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: syllabus },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.syllabusRepository.removeSyllabus(syllabus).subscribe(
          (res) => {
            console.log({ res });
            this.loadData();
          },
          (err) => {
            console.log({ err });
            this.errors = err.error.error;
          }
        );
      }
    })
  }

  edit(syllabus: SyllabusInterface) {
    return this.router.navigateByUrl(`/syllabus/${syllabus.uuid}/edit`);
  }
}
