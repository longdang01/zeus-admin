import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CustomerService } from 'src/app/core/services/customer.service';
import { UploadService } from 'src/app/core/services/upload.service';
declare var $:any ;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  // filter
  searchText: string = "" ;
  
  // ckeditor config
  public Editor:any = ClassicEditor;
   
  // setup form
  customerForm!: FormGroup;
  customerId!: any;
  postCustomerImage!: any;

  title: string = ""; 
  state: number = 0;
  
  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  customers: any = [];

  constructor(private customerService: CustomerService,
    private uploadService: UploadService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
  ) { 
 
    this.customerForm = this.formBuilder.group({
      user: [''],
      customerName: [''],
      picture: [''],
      dob: [''],
      address: [''],
      phone: [''],
      email: [''],
    })
  }

  ngOnInit(): void {
    this.getCustomers();
  }

  hideCollapse(id: any) {
    $(id).addClass("collapse");
    $(id).removeClass("show");
  }

  //Customers
  getCustomers() {
    this.customerService.get().subscribe(res => {
      this.customers = res;
    }); 
  }

  getCustomer(id: any) {
    this.title = (id) ? "Xem thông tin nhân viên" : "Thêm nhân viên";
    this.state = (id) ? 1 : 0;
    this.customerId = (id) && id;

    if(id) {
      
      this.customerService.getById(id).subscribe(res => {
        
        this.customerForm.setValue({
          user: res['user'],
          customerName: res['customerName'],
          picture: res['picture'],
          dob: res['dob'],
          address: res['address'],
          phone: res['phone'],
          email: res['email'],
        });
        console.log(this.customerForm.value)
        $("#dobCustomer").val(this.customerForm.get("dob")?.value.slice(0, 10));

        if(!res['picture']) this.deleteImage();
        else {
          $('#customerImage').css('display', 'block');
          $('#customerImage').attr('src', `${res['picture']}`);
          $('#customerUpload').val('');
        }
      });
    } 

    if(!id) {
      this.customerForm = this.formBuilder.group({
        user: [''],
        customerName: [''],
        picture: [''],
        dob: [''],
        address: [''],
        phone: [''],
        email: [''],
      })
      this.deleteImage();
    }

    $('#customerModal').modal('show');
  }


  readUrl(fileData: any, element: any) {
    var reader = new FileReader(); 

    reader.onload = function(e: any) {
        $(element).attr('src', e.target.result); 
    }
    reader.readAsDataURL(fileData);
  }

  deleteImage() {
    $('#customerUpload').val(''); 
    $('#customerImage').attr('src', ''); 
    $('#customerImage').css('display', 'none');
    this.postCustomerImage = null;
    this.customerForm.controls['picture'].setValue('');
  }

  // handle pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getCustomers();
  }
  
  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getCustomers();
  }

}
