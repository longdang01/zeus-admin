import { AfterViewInit, Component, Inject, Injector, OnInit } from '@angular/core';
import { ScriptService } from './core/services/script.service';
import { BaseComponent } from './core/utils/base.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseComponent implements OnInit, AfterViewInit{
  title = 'zeus-admin';

  constructor(injector: Injector,
    private scriptService: ScriptService) {
    super(injector);
    // this.scriptService.load('app', 'jquery', 'jquery-ui', 'main', 'ntc').then(data => {
    //   console.log('script loaded ', data);
    // }).catch(error => console.log(error));
    const dynamicScripts = [
      // '/assets/js/app.js',
      '/assets/js/jquery-3.6.0.min.js',
      '/assets/js/jquery-ui.min.js',
      '/assets/js/main.js',
      '/assets/js/ntc.js',
      // '/assets/js/farbtastic.js',
      // '/assets/js/ntc_main.js',
    ];

    const dynamicStyles = [
      '/assets/css/app.css',
      '/assets/css/jquery-ui.min.css',
      '/assets/css/farbtastic.css',
      '/assets/css/reset.css',
      '/assets/css/style.css',
      '/assets/css/login.css',
    ];
    this.loadStyles(dynamicStyles); 
    this.loadScripts(dynamicScripts); 
  }

  ngOnInit() {
    
  }

  ngAfterViewInit(): void {
    // const dynamicScripts = [
      // '/assets/js/app.js',
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
