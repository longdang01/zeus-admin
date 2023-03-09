import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { RoleService } from 'src/app/core/services/role.service';
declare var $: any;
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})

export class RolesComponent implements OnInit {
  // filter
  searchText: string = "" ;

  // ckeditor config
  public Editor:any = ClassicEditor;
   
  // setup form
  roleForm!: FormGroup;
  roleId!: any;

  title: string = ""; 
  state: number = 0;
  
  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  roles: any = [];

  constructor(private roleService: RoleService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
  ) { 
 
    this.roleForm = this.formBuilder.group({
      roleName: [''],
      description: [''],
      isActive: ['']
    })
  }

  ngOnInit(): void {
    this.getRoles();
  }

  hideCollapse(id: any) {
    $(id).addClass("collapse");
    $(id).removeClass("show");
  }
  
  changeRoleType = (event: any) => {
    const val = (event.target.value == 0) ? "Quản trị viên" :
     (event.target.value == 1) ? "Nhập hàng" :
     (event.target.value == 2) ? "Bán hàng" : 
     (event.target.value == 3) ? "Người dùng" :
     (event.target.value == 4) ? "Nội dung" : "Vai trò chưa xây dựng";

     this.roleForm.controls['roleName'].setValue(val);
  }

  //Roles
  getRoles() {
    this.roleService.get().subscribe((res: any) => {
      this.roles = res;

    }); 
  }

  getRole(id: any) {
    this.title = (id) ? "Cập nhật vai trò" : "Thêm vai trò";
    this.state = (id) ? 1 : 0;
    this.roleId = (id) && id;

    if(id) {
      this.roleService.getById(id).subscribe(res => {
 
        this.roleForm.setValue({
          roleName: res['roleName'],
          description: res['description'],
          isActive: res['isActive']
        });
      });
    } 

    if(!id) {
      this.roleForm = this.formBuilder.group({
        roleName: [''],
        description: [''],
        isActive: ['']
      })
    }

    $('#roleModal').modal('show');
  }

  createRole() {
    this.roleService.create(this.roleForm.value)
    .subscribe({
      next: (res) => {
        this.roles.push(res);
        $('#roleModal').modal('hide');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateRole() {
    this.roleService.update(this.roleId, this.roleForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.roles.findIndex((item: any) => item._id === res._id);
          this.roles[index] = res;
          $('#roleModal').modal('hide');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  deleteRole(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.roleService.delete(id).subscribe((res) => {
        const index = this.roles.findIndex((item: any) => item._id == res._id);
        this.roles.splice(index, 1);
      })
    }
  }

  // handle pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getRoles();
  }
  
  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getRoles();
  }

}
