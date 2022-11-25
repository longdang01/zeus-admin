import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/utils/base.component';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.css']
})
export class DashboardsComponent extends BaseComponent implements OnInit, AfterViewInit  {

  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // const dynamicScripts = [
      // '/assets/js/app.js',
    // ];
    // this.loadScripts(dynamicScripts); 
  }
}
