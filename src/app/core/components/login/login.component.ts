import { AfterViewInit, Component, Injector, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { BaseComponent } from '../../utils/base.component';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit, AfterViewInit {

  // setup form
  userForm!: FormGroup;

  title: string = ""; 
  state: number = 0;

  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  constructor(private userService: UserService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private injector: Injector
    ) { 

    super(injector);
    this.userForm = this.formBuilder.group({
      username: [''],
      password: ['']
    })


    //  const dynamicScripts = [
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
    //   '/assets/css/login.css',
    // ];
    // this.loadStyles(dynamicStyles); 
    // this.loadScripts(dynamicScripts); 
  }

  ngOnInit(): void {
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
    //   '/assets/css/login.css',
    // ];
    // this.loadStyles(dynamicStyles); 
    // this.loadScripts(dynamicScripts); 
  }

  // ngOnDestroy() {
  //   const dynamicScripts = [
  //     '/assets/js/app.js',
  //   //   '/assets/js/jquery-3.6.0.min.js',
  //   //   '/assets/js/jquery-ui.min.js',
  //   //   '/assets/js/main.js',
  //   //   '/assets/js/ntc.js',
  //   ];

  //   // const dynamicStyles = [
  //   //   '/assets/css/app.css',
  //   //   '/assets/css/jquery-ui.min.css',
  //   //   '/assets/css/farbtastic.css',
  //   //   '/assets/css/reset.css',
  //   //   '/assets/css/style.css',
  //   //   '/assets/css/login.css',
  //   // ];
  //   // this.loadStyles(dynamicStyles); 
  //   this.loadScripts(dynamicScripts); 
  // }
  
  login() {
    const val = this.userForm.value;
    if (val.username && val.password) {
      this.userService.login(this.userForm.value)
      .subscribe({
        next: (res) => {
          // localStorage.setItem("id_token", JSON.stringify(res.token));
          this.ngZone.run(() => this.router.navigateByUrl(''));
          // this.router.navigate([''])
        },
        error: (err) => {
          alert("Thông tin đăng nhập chưa chính xác !");
          console.log(err);
        }
      });
    } else {
      alert("Hãy nhập đầy đủ thông tin để đăng nhập !");
    }
  }

  



}
