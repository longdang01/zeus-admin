import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportProductsRoutingModule } from './import-products-routing.module';
import { ImportProductsComponent } from './import-products.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  declarations: [
    ImportProductsComponent
  ],
  imports: [
    CommonModule,
    ImportProductsRoutingModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,  
    CKEditorModule,
  ]
})
export class ImportProductsModule { }
