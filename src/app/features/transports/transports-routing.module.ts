import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportsComponent } from './transports.component';

const routes: Routes = [{ path: '', component: TransportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportsRoutingModule { }
