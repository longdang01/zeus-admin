import { AfterViewInit, Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { BaseComponent } from '../../utils/base.component';
declare var $:any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent extends BaseComponent implements OnInit, AfterViewInit  {

  @Input() staff: any = {};

  // 1: Nhập hàng, 2: Bán hàng, 3: Người dùng, 4: Nội dung
  constructor(public router: Router,
    private userService: UserService,
    private injector: Injector) {
    super(injector);
  }
  
  ngOnInit(): void {
   
  }

  ngAfterViewInit() {
    // $(document).ready(() => {
    //   const dynamicScripts = [
    //     '/assets/js/app.js',
    //     ];
  
    //   if ($('script[src="/assets/js/app.js"]').length <= 0) {
    //       this.loadScripts(dynamicScripts); 
    //   } else {
    //       $('script[src*="/assets/js/app.js"]').remove();
    //       setTimeout(() => {
    //         this.loadScripts(dynamicScripts); 
    //       }, 500);
    //   }
    // })
  }

  ngAfterViewChecked() {
   
  }
 

}


