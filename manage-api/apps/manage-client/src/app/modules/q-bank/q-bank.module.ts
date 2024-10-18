import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { UiModule } from '@application/ui';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import { QBankRoutes } from './q-bank.routes';
import { TrustHtmlPipe } from './trust-html.pipe';
// import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    ...fromComponents.components,
    ...fromContainers.containers,
    TrustHtmlPipe,
  
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    // FormsModule,
    // Ng2SearchPipeModule,
    RouterModule.forChild(QBankRoutes),
    UiModule,
    NgxPaginationModule

    // MatButtonModule
  ]
})
export class QBankModule { }
