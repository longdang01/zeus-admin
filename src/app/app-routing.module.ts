import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent  },
  { 
    path: '', loadChildren: () => 
    import('./features/main/main.module').then(m => m.MainModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  // , { preloadingStrategy: PreloadAllModules }
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
