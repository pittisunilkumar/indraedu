import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import {  TagsRoutes } from './questions-tags-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiModule } from '@application/ui';
import { CreateTagsContainerComponent } from './containers/create-tags-container/create-tags-container.component';

@NgModule({
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
    
   ],
  imports: [
    CommonModule,
    // QuestionsTagsRoutingModule,
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(TagsRoutes),
    UiModule,
  ]
})
export class QuestionsTagsModule { }
