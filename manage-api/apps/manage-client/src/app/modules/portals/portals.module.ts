import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { UiModule } from '@application/ui';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TranslateModule } from '@ngx-translate/core';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import { PortalRoutes } from './portals.routes';
import { DuplicateNotificationComponent } from './components/duplicate-notification/duplicate-notification.component';
import { GoogleChartsModule } from 'angular-google-charts';
// import { UploadImageComponent } from 'libs/ui/src/lib/components/upload-image/upload-image.component';


@NgModule({
  declarations: [...fromContainers.containers, ...fromComponents.components, DuplicateNotificationComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(PortalRoutes),
    CKEditorModule,
    UiModule,
    GoogleChartsModule
  ]
})
export class PortalsModule { }
