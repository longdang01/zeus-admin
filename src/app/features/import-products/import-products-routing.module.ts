import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportProductsComponent } from './import-products.component';

const routes: Routes = [{ path: '', component: ImportProductsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportProductsRoutingModule { }
