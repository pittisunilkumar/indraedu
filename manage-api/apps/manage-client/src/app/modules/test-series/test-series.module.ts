import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiModule } from '@application/ui';
import { TranslateModule } from '@ngx-translate/core';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import { TestSeriesRoutes } from './test-series.routes';
import { TsTrustHtmlPipe } from './trust-html.pipe';
import { CopyMoveQuestionsComponent } from './components/copy-move-questions/copy-move-questions.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    ...fromComponents.components,
    ...fromContainers.containers,
    TsTrustHtmlPipe,
    CopyMoveQuestionsComponent,
    
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(TestSeriesRoutes),
    UiModule,
    NgxPaginationModule
  ]
})
export class TestSeriesModule { }
