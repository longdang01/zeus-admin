import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../utils/base.component';
declare var $:any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent extends BaseComponent implements OnInit, AfterViewInit  {

  constructor(public router: Router,
    private injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
 
  }

  ngAfterViewInit() {
   
  }


}


