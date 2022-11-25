import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalSuccessComponent } from './components/modal-success/modal-success.component';
import { ModalFailureComponent } from './components/modal-failure/modal-failure.component';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';
import { FilterPipe } from './pipes/filter.pipe';



@NgModule({
  declarations: [
    ModalSuccessComponent,
    ModalFailureComponent,
    ModalConfirmComponent,
    FilterPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FilterPipe,
  ]
})
export class SharedModule { }
