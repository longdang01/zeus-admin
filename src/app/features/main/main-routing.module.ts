import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { 
        path: '', 
        redirectTo: 'dashboards',
        pathMatch: 'full'
      },
      { 
        path: 'dashboards', 
        loadChildren: () => 
        import('../dashboards/dashboards.module').then(m => m.DashboardsModule)
      },
      { 
        path: 'products',
        loadChildren: () => 
        import('../products/products.module').then(m => m.ProductsModule),
        canActivate: [RoleGuard],
        data: {roles: [0, 1]} 
      },
      { 
        path: 'categories',
        loadChildren: () => 
        import('../categories/categories.module').then(m => m.CategoriesModule),
        canActivate: [RoleGuard],
        data: {roles: [0, 1]} 
      },
      { 
        path: 'suppliers',
        loadChildren: () => 
        import('../suppliers/suppliers.module').then(m => m.SuppliersModule),
        canActivate: [RoleGuard],
        data: {roles: [0, 1]}  
      },
      {
        path: 'collections',
        loadChildren: () => 
        import('../collections/collections.module').then(m => m.CollectionsModule),
        canActivate: [RoleGuard],
        data: {roles: [0, 1]}  
      },
      {   
        path: 'brands',
        loadChildren: () =>
        import('../brands/brands.module').then(m => m.BrandsModule),
        canActivate: [RoleGuard],
        data: {roles: [0, 1]}  
      },
      { 
        path: 'orders',
        loadChildren: () => 
        import('../orders/orders.module').then(m => m.OrdersModule),
        canActivate: [RoleGuard],
        data: {roles: [0, 2]}   
      },
      { 
        path: 'payments',
        loadChildren: () => 
        import('../payments/payments.module').then(m => m.PaymentsModule),
        canActivate: [RoleGuard],
        data: {roles: [0, 2]}   
      },
      { 
        path: 'transports',
        loadChildren: () => 
        import('../transports/transports.module').then(m => m.TransportsModule),
        canActivate: [RoleGuard],
        data: {roles: [0, 2]}   
      },
      { 
        path: 'staffs',
        loadChildren: () => 
        import('../staffs/staffs.module').then(m => m.StaffsModule),
        canActivate: [RoleGuard],
        data: {roles: [0]}   
      },
      { 
        path: 'roles',
        loadChildren: () => 
        import('../roles/roles.module').then(m => m.RolesModule),
        canActivate: [RoleGuard],
        data: {roles: [0]}    
      },
      { 
        path: 'news',
        loadChildren: () => 
        import('../news/news.module').then(m => m.NewsModule),
        canActivate: [RoleGuard],
        data: {roles: [0, 3]}  
      },
      // {
      //   path: '',
      //   redirectTo: 'dashboards',
      //   pathMatch: 'full'
      // },
      { path: 'customers', loadChildren: () => import('../customers/customers.module').then(m => m.CustomersModule),
      canActivate: [RoleGuard],
      data: {roles: [0, 2]}  },
      { path: 'slides', loadChildren: () => import('../slides/slides.module').then(m => m.SlidesModule),
      canActivate: [RoleGuard],
      data: {roles: [0, 3]} },
      { path: 'ordersDetails', loadChildren: () => import('../orders-details/orders-details.module').then(m => m.OrdersDetailsModule),
      canActivate: [RoleGuard],
      data: {roles: [0, 2]} },
      { path: 'import-products', loadChildren: () => import('../import-products/import-products.module').then(m => m.ImportProductsModule),
      canActivate: [RoleGuard],
      data: {roles: [0, 1]} },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
