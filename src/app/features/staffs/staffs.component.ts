import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { StaffService } from 'src/app/core/services/staff.service';
import { UploadService } from 'src/app/core/services/upload.service';
import { UserService } from 'src/app/core/services/user.service';
declare var $: any;

@Component({
  selector: 'app-staffs',
  templateUrl: './staffs.component.html',
  styleUrls: ['./staffs.component.css']
})

export class StaffsComponent implements OnInit {

  // filter
  searchText: string = "" ;
  
  // ckeditor config
  public Editor:any = ClassicEditor;
   
  // setup form
  staffForm!: FormGroup;
  userForm!: FormGroup;
  staffId!: any;
  postStaffImage!: any;

  title: string = ""; 
  state: number = 0;
  
  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  staffs: any = [];
  roles: any = [];

  constructor(private staffService: StaffService,
    private userService: UserService,
    private uploadService: UploadService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
  ) { 
 
    this.staffForm = this.formBuilder.group({
      user: [''],
      role: [''],
      staffName: [''],
      picture: [''],
      dob: [''],
      address: [''],
      phone: [''],
      email: ['']
    })

    this.userForm = this.formBuilder.group({
      username: [''],
      password: [''],
    })
  }

  ngOnInit(): void {
    this.getStaffs();
  }

  hideCollapse(id: any) {
    $(id).addClass("collapse");
    $(id).removeClass("show");
  }

  //Categories
  getStaffs() {
    this.staffService.get().subscribe((res: any) => {
      this.staffs = res.staffs;
      this.roles = res.roles;
    }); 
  }

  getStaff(id: any) {
    this.title = (id) ? "Cập nhật thông tin nhân viên" : "Thêm nhân viên";
    this.state = (id) ? 1 : 0;
    this.staffId = (id) && id;

    if(id) {
      
      this.staffService.getById(id).subscribe(res => {
        
        this.staffForm.setValue({
          user: res['user'],
          role: res['role']._id,
          staffName: res['staffName'],
          picture: res['picture'],
          dob: res['dob'],
          address: res['address'],
          phone: res['phone'],
          email: res['email']
        });

        this.userForm = this.formBuilder.group({
          username: res['user'].username,
          password: res['user'].password,
        })

        $("#dobStaff").val(this.staffForm.get("dob")?.value.slice(0, 10));


        if(!res['picture']) this.deleteImage();
        else {
          $('#staffImage').css('display', 'block');
          $('#staffImage').attr('src', `${res['picture']}`);
          $('#staffUpload').val('');
        }
      });
    } 

    if(!id) {
      this.staffForm = this.formBuilder.group({
        user: [''],
        role: [''],
        staffName: [''],
        picture: [''],
        dob: [''],
        address: [''],
        phone: [''],
        email: ['']
      })

      this.userForm = this.formBuilder.group({
        username: [''],
        password: [''],
      })

      this.deleteImage();
    }

    $('#staffModal').modal('show');
  }

  createUser() {
    this.userService.register(this.userForm.value)
    .subscribe({
      next: (res) => {
        this.staffForm.patchValue({
          user: res['_id']
        })

        this.createStaff();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  createStaff() {
    this.staffService.create(this.staffForm.value)
    .subscribe({
      next: (res) => {
        this.staffs.unshift(res);
        $('#staffModal').modal('hide');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateStaff() {
    this.staffService.update(this.staffId, this.staffForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.staffs.findIndex((item: any) => item._id === res._id);
          this.staffs[index] = res;
          $('#staffModal').modal('hide');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  deleteStaff(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.staffService.delete(id).subscribe((res) => {
        const index = this.staffs.findIndex((item: any) => item._id == res._id);
        this.staffs.splice(index, 1);
      })
    }
  }

  // handle image
  saveStaff() {
    if(this.state === 0) this.createUser();
    if(this.state === 1) this.updateStaff();
  }

  readUrl(fileData: any, element: any) {
    var reader = new FileReader(); 

    reader.onload = function(e: any) {
        $(element).attr('src', e.target.result); 
    }
    reader.readAsDataURL(fileData);
  }

  upload(data: any) {
    if(data) {
      this.uploadService.upload(data)
      .subscribe({
        next: (res) => {
          this.staffForm.controls['picture'].setValue(res.data.url);
          this.saveStaff();
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.saveStaff();
    }
  }

  loadImage(event: any) {
    $('#staffImage').css('display', 'block');
    this.readUrl($(event.target)[0].files[0], '#staffImage');
    this.postStaffImage = $(event.target)[0].files[0];
  }

  deleteImage() {
    $('#staffUpload').val(''); 
    $('#staffImage').attr('src', ''); 
    $('#staffImage').css('display', 'none');
    this.postStaffImage = null;
    this.staffForm.controls['picture'].setValue('');
  }

  // handle pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getStaffs();
  }
  
  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getStaffs();
  }

}
