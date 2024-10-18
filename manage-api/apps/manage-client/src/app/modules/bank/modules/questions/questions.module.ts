import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiModule } from '@application/ui';
import { TranslateModule } from '@ngx-translate/core';
import { BankTrustHtmlPipe } from '../../trust-html.pipe';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import { QuestionsRoutes } from './questions.routes';
import { NgxPaginationModule } from 'ngx-pagination';
// import { CKEditorModule } from 'ckeditor4-angular';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
    BankTrustHtmlPipe,
           
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(QuestionsRoutes),
    UiModule,
    CKEditorModule,
    NgxPaginationModule
  ],
  providers: [
    // {
    //   provide: PLATFORM_PIPES,
    //   useValue: TranslatePipe,
    //   multi: true
    // }
  ],
})
export class QuestionsModule {}
