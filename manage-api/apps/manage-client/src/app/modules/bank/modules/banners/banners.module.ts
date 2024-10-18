import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiModule } from '@application/ui';
import { TranslateModule } from '@ngx-translate/core';
import { BannerRoutes } from './banners.routes';
import * as fromComponents from './components';
import * as fromContainers from './containers';

@NgModule({
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(BannerRoutes),
    UiModule,
  ],
})
export class BannersModule {}
