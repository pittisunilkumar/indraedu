import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RoleModulesEnum, RoleSubModulesEnum, TagInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, HelperService, RolesService, TagsRepositoryService } from '@application/ui';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'application-tags-list-container',
  templateUrl: './tags-list-container.component.html',
  styleUrls: ['./tags-list-container.component.less']
})
export class TagsListContainerComponent implements OnInit,OnDestroy {
  tags$: Observable<TagInterface>
  errors: string[];
  sub = new Subscription();
  // length:number;

  isEditVisible: boolean;
  isAddVisible: boolean;
  isDeleteVisible: boolean;
  
  constructor(
    private tagsRepo: TagsRepositoryService,
    private dialog: MatDialog,
    private helper: HelperService,
    private roleService: RolesService,
  ) { }

  ngOnInit(): void {
    // this.loadData();
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
          if (res.module[0].title === modules.type.QUESTION_TAGS)
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
  loadData() {
    this.tagsRepo.getAllTags().subscribe(res=>{
      this.tags$ =res?.response;
      console.log(this.tags$);
      
    })
    // this.tags$ = this.tagsRepo.getAllTags();
    // this.tagsRepo.getAllTags().subscribe(data =>{
    //   this.length =data.response.length ;
    // })
  }
  delete(data: TagInterface) {
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: data },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.sub.add(this.tagsRepo.deleteTagByUuid(data.uuid).subscribe(
          (res) => {
            console.log({ res });
            this.loadData();
          },
          (err) => {
            console.log({ err });
            this.errors = err.error.error;
          }
        ));
      }
    })
  }

 

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


}
