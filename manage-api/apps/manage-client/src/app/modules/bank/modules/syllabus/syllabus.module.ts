import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiModule } from '@application/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SyllabusRoutes } from './syllabus.routes';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild(SyllabusRoutes),
    UiModule,
  ],
})
export class SyllabusModule {}
