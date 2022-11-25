import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffsRoutingModule } from './staffs-routing.module';
import { StaffsComponent } from './staffs.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  declarations: [
    StaffsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StaffsRoutingModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,  
    CKEditorModule,
  ]
})
export class StaffsModule { }
