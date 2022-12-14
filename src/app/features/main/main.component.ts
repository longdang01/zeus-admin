import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/utils/base.component';
declare var $: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent extends BaseComponent implements OnInit, AfterViewInit {

  constructor(injector: Injector) {
    super(injector);
    
  }
  
  ngOnInit(): void {
      const dynamicScripts = [
        '/assets/js/app.js',
        // '/assets/js/jquery-3.6.0.min.js',
        // '/assets/js/jquery-ui.min.js',
        // '/assets/js/main.js',
        // '/assets/js/ntc.js',
        ];
      if ($('script[src="/assets/js/app.js"]').length <= 0) {
        this.loadScripts(dynamicScripts); 
      } else {
        $('script[src*="/assets/js/app.js"]').remove();
        this.loadScripts(dynamicScripts); 
      }
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
