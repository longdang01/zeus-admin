import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
        import('../products/products.module').then(m => m.ProductsModule) 
      },
      { 
        path: 'categories',
        loadChildren: () => 
        import('../categories/categories.module').then(m => m.CategoriesModule) 
      },
      { 
        path: 'suppliers',
        loadChildren: () => 
        import('../suppliers/suppliers.module').then(m => m.SuppliersModule) 
      },
      {
        path: 'collections',
        loadChildren: () => 
        import('../collections/collections.module').then(m => m.CollectionsModule) 
      },
      {   
        path: 'brands',
        loadChildren: () =>
        import('../brands/brands.module').then(m => m.BrandsModule) 
      },
      { 
        path: 'orders',
        loadChildren: () => 
        import('../orders/orders.module').then(m => m.OrdersModule) 
      },
      { 
        path: 'payments',
        loadChildren: () => 
        import('../payments/payments.module').then(m => m.PaymentsModule) 
      },
      { 
        path: 'transports',
        loadChildren: () => 
        import('../transports/transports.module').then(m => m.TransportsModule) 
      },
      { 
        path: 'staffs',
        loadChildren: () => 
        import('../staffs/staffs.module').then(m => m.StaffsModule) 
      },
      { 
        path: 'roles',
        loadChildren: () => 
        import('../roles/roles.module').then(m => m.RolesModule) 
      },
      { 
        path: 'news',
        loadChildren: () => 
        import('../news/news.module').then(m => m.NewsModule) 
      },
      // {
      //   path: '',
      //   redirectTo: 'dashboards',
      //   pathMatch: 'full'
      // },
      { path: 'customers', loadChildren: () => import('../customers/customers.module').then(m => m.CustomersModule) },
      { path: 'slides', loadChildren: () => import('../slides/slides.module').then(m => m.SlidesModule) },
      { path: 'ordersDetails', loadChildren: () => import('../orders-details/orders-details.module').then(m => m.OrdersDetailsModule) },
      { path: 'import-products', loadChildren: () => import('../import-products/import-products.module').then(m => m.ImportProductsModule) },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
