import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { BaseComponent } from 'src/app/core/utils/base.component';
declare var $: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent extends BaseComponent implements OnInit, AfterViewInit {
  staff: any = {};

  constructor(injector: Injector,
    private userService: UserService,
    ) {
    super(injector);
    
  }
  
  getMe() {
    this.userService.getMe()
     .subscribe((res) => {
        if(res.staff) {
          this.staff = res.staff;
        } else {
          alert("Thông tin đăng nhập không chính xác")
        }
      })
  }

  ngOnInit(): void {
    $(document).ready(() => {
      this.getMe();

      const dynamicScripts = [
        '/assets/js/app.js',
        // '/assets/js/jquery-3.6.0.min.js',
        // '/assets/js/jquery-ui.min.js',
        // '/assets/js/main.js',
        // '/assets/js/ntc.js',
        ];
        setTimeout(() => {
          if ($('script[src="/assets/js/app.js"]').length <= 0) {
            this.loadScripts(dynamicScripts); 
          } else {
            $('script[src*="/assets/js/app.js"]').remove();
              this.loadScripts(dynamicScripts); 
          }
          
        }, 1000);
    })
  }

  ngAfterViewInit(): void {
    
    // const dynamicScripts = [
    //   '/assets/js/app.js',
      // '/assets/js/jquery-3.6.0.min.js',
      // '/assets/js/jquery-ui.min.js',
      // '/assets/js/main.js',
      // '/assets/js/ntc.js',
    // ];

    // const dynamicStyles = [
    //   '/assets/css/app.css',
    //   '/assets/css/jquery-ui.min.css',
    //   '/assets/css/farbtastic.css',
    //   '/assets/css/reset.css',
    //   '/assets/css/style.css',
    // ];
    // this.loadStyles(dynamicStyles); 
    // this.loadScripts(dynamicScripts); 
  }
  

  


}
