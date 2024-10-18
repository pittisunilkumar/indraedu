import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
// import { CKEditorModule } from 'ckeditor4-angular';
import { ChartsModule } from 'ng2-charts';
import { UserEffects } from './+state/user.effects';
import * as fromUser from './+state/user.reducer';
import * as fromComponents from './components';
import { FormErrorComponent } from './components/form-error/form-error.component';
import { FormFieldErrorComponent } from './components/form-field-error/form-field-error.component';
import * as fromDialogs from './dialogs';
import * as fromDiretives from './directives';
import * as fromFinders from './finders';
import * as fromGuards from './guards';
import { HelperService } from './helpers/helper-service';
import { HttpInterceptorService, TokenInterceptor } from './interceptors';
import { EnumToArrayPipe } from './pipes/enum-to-array.pipe';
import * as fromRepos from './repositories';
import * as fromServices from './services';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CourseSubjectListComponent } from './components/courses/components/course-subject-list/course-subject-list.component';
import { SyllabusInfoComponent } from './components/syllabus/components/syllabus-info/syllabus-info.component';
const NgMaterialModules = [
  MatChipsModule,
  MatCardModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule,
  MatListModule,
  MatSortModule,
  MatStepperModule,
  MatTabsModule,
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatMenuModule,
  MatProgressBarModule,
  MatSlideToggleModule,
  ChartsModule,
  MatSnackBarModule,
  CKEditorModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatButtonToggleModule,
  DragDropModule,
  MatGridListModule
];
@NgModule({
  imports: [
    CommonModule,
    ...NgMaterialModules,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forFeature(fromUser.USER_FEATURE_KEY, fromUser.reducer),
    EffectsModule.forFeature([UserEffects]),
  ],
  exports: [
    ...NgMaterialModules,
    ...fromComponents.components,
    ...fromDiretives.directives,
    ...fromDialogs.dialogs,
    // ...fromGuards.guards
    // ...fromServices.services,
  ],
  declarations: [
    ...fromComponents.components,
    ...fromDiretives.directives,
    ...fromDialogs.dialogs,
    EnumToArrayPipe,
    FormErrorComponent,
    CourseSubjectListComponent,
    SyllabusInfoComponent,
    
  ],
  entryComponents: [FormFieldErrorComponent],
})
export class UiModule {

  static forRoot(environment: any): ModuleWithProviders<UiModule> {
    return {
      ngModule: UiModule,
      providers: [
        ...fromFinders.finders,
        HelperService,
        ...fromRepos.repositories,
        ...fromServices.services,
        ...fromGuards.guards,
        // { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: 'environment', useValue: environment },
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {
            width: '600px', height: '260px', hasBackdrop: true
          }
        }

      ],
    };
  }

}
