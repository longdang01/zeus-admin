import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlidesRoutingModule } from './slides-routing.module';
import { SlidesComponent } from './slides.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  declarations: [
    SlidesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SlidesRoutingModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,  
    CKEditorModule,
  ]
})
export class SlidesModule { }
