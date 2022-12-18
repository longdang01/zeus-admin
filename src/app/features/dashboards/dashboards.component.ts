import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { StaticsService } from 'src/app/core/services/statics.service';
import { BaseComponent } from 'src/app/core/utils/base.component';
declare var $: any;

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.css']
})
export class DashboardsComponent extends BaseComponent implements OnInit, AfterViewInit  {

  totalProductSales: number = 0;
  totalProducts: number = 0;
  totalCustomers: number = 0;
  totalOrders: number = 0;

  constructor(private injector: Injector,
    private staticsService: StaticsService) {
    super(injector);
  }

  ngOnInit(): void {
    this.getTotalProductSales();
    this.getTotalProducts();
    this.getTotalCustomers();
    this.getTotalOrders();
  }

  getTotalProductSales = () => {
    this.staticsService.getTotalProductSales().subscribe((res: any) => {
      this.totalProductSales = res;
    }); 
  }

  getTotalProducts = () => {
    this.staticsService.getTotalProducts().subscribe((res: any) => {
      this.totalProducts = res;
    }); 
  }

  getTotalCustomers = () => {
    this.staticsService.getTotalCustomers().subscribe((res: any) => {
      this.totalCustomers = res;
    }); 
  }

  getTotalOrders = () => {
    this.staticsService.getTotalOrders().subscribe((res: any) => {
      this.totalOrders = res;
    }); 
  }


  ngAfterViewInit(): void {
    // const dynamicScripts = [
      // '/assets/js/app.js',
    // ];
    // this.loadScripts(dynamicScripts); 
  }

  hideCollapse(id: any) {
    $(id).addClass("collapse");
    $(id).removeClass("show");
  }
}
