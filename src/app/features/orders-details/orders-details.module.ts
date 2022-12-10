import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersDetailsRoutingModule } from './orders-details-routing.module';
import { OrdersDetailsComponent } from './orders-details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    OrdersDetailsComponent
  ],
  imports: [
    CommonModule,
    OrdersDetailsRoutingModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,  
    CKEditorModule,
  ]
})
export class OrdersDetailsModule { }
