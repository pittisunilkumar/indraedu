import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BankRoutes } from './bank.routes';
import * as fromComponents from './components';
import * as fromModules from './modules';
// import { BankTrustHtmlPipe } from './trust-html.pipe';

@NgModule({
  declarations: [
    ...fromComponents.components,
    // BankTrustHtmlPipe
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ...fromModules.modules,
    RouterModule.forChild(BankRoutes),
  ]
})
export class BankModule { }
