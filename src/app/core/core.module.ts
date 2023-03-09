import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NotFoundComponent } from './components/not-found/not-found.component';


@NgModule({
  declarations: [
    TopBarComponent,
    SidebarComponent,
    LoginComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    //
    SharedModule,
    NgxPaginationModule,
    CKEditorModule,
  ],
  exports: [
    SidebarComponent,
    TopBarComponent,
  ],
})
export class CoreModule { }
