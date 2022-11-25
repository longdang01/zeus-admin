import { AfterViewInit, Component, Injector, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { StaffService } from '../../services/staff.service';
import { UserService } from '../../services/user.service';
import { BaseComponent } from '../../utils/base.component';
declare var $:any; 

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent extends BaseComponent implements OnInit, AfterViewInit {

  staff!: any;
  user!: any;

  constructor( 
    private staffService: StaffService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private injector: Injector) {
      super(injector);
      this.getUser();
    }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const dynamicScripts = [
      '/assets/js/app.js',
      '',
    ];
    
    this.loadScripts(dynamicScripts); 
  }

  getUser() {
    this.userService.getMe().subscribe((res: any) => {
      this.staff = res.staff;
    });
  }

  logout(e: any) {
    // e.preventDefault();
    // $("#dropdownAccount").hide();
    localStorage.removeItem("id_token");
    this.ngZone.run(() => this.router.navigateByUrl('/login')).then(() => {
      $('.dropdown-menu').css('display', 'none');
    });
    // this.router.navigateByUrl('/login')

  }

}
