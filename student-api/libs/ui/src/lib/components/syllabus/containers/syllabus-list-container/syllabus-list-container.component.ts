import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ResponseInterface, SyllabusInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent } from '@application/ui';
import { Observable } from 'rxjs';
import { SyllabusRepositoryService } from '../../../../repositories';

@Component({
  selector: 'application-list-container',
  templateUrl: './syllabus-list-container.component.html',
  styleUrls: ['./syllabus-list-container.component.less'],
})
export class SyllabusListContainerComponent implements OnInit {
  canShowCreateBlock = true;
  errors: string[];
  syllabus$: Observable<ResponseInterface<SyllabusInterface[]>>;
 length:number

  constructor(
    private syllabusRepository: SyllabusRepositoryService,
    private router: Router,
    private dialog: MatDialog,
    
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.syllabus$ = this.syllabusRepository.getAllSyllabus();
    this.syllabus$.subscribe(data=>{
      this.length = data.response.length
      console.log(data.response);
    })
    
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
