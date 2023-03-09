import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'not-found', component: NotFoundComponent  },
  { 
    path: 'login', 
    loadChildren: () => import('./features/login/login.module')
    .then(m => m.LoginModule)
  },
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
