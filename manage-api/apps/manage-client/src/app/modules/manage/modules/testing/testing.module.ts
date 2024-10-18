import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { UiModule } from '@application/ui';
import { TranslateModule } from '@ngx-translate/core';
// import * as fromComponents from './components';
import { TestingFormComponent } from './components/testing-form/testing-form.component';
import * as fromContainers from './containers';
import { TestingRoutes } from './testing.routes';

@NgModule({
  declarations: [
    ...fromContainers.containers,
    // ...fromComponents.components,
    TestingFormComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(TestingRoutes),
    UiModule,
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
  ],
})
export class TestingModule { }
