import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SupplierService } from 'src/app/core/services/supplier.service';
import { UploadService } from 'src/app/core/services/upload.service';
declare var $: any;

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  // filter
  searchText: string = "" ;
  
  // ckeditor config
  public Editor:any = ClassicEditor;
   
  // setup form
  supplierForm!: FormGroup;
  supplierId!: any;
  postSupplierImage!: any;

  title: string = ""; 
  state: number = 0;
  
  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  suppliers: any = [];

  constructor(private supplierService: SupplierService,
    private uploadService: UploadService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
  ) { 
 
    this.supplierForm = this.formBuilder.group({
      picture: [''],
      supplierName: [''],
      address: [''],
      phone: [''],
      email: [''],
      description: ['']
    })
  }

  ngOnInit(): void {
    this.getSuppliers();
  }

  //Categories
  getSuppliers() {
    this.supplierService.get().subscribe(res => {
      this.suppliers = res;
    }); 
  }

  getSupplier(id: any) {
    this.title = (id) ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp";
    this.state = (id) ? 1 : 0;
    this.supplierId = (id) && id;

    if(id) {
      
      this.supplierService.getById(id).subscribe(res => {
        
        this.supplierForm.setValue({
          picture: res['picture'],
          supplierName: res['supplierName'],
          address: res['address'],
          phone: res['phone'],
          email: res['email'],
          description: res['description']
        });

        if(!res['picture']) this.deleteImage();
        else {
          $('#supplierImage').css('display', 'block');
          $('#supplierImage').attr('src', `${res['picture']}`);
          $('#supplierUpload').val('');
        }
      });
    } 

    if(!id) {
      this.supplierForm = this.formBuilder.group({
        picture: [''],
        supplierName: [''],
        address: [''],
        phone: [''],
        email: [''],
        description: ['']
      })
      this.deleteImage();
    }

    $('#supplierModal').modal('show');
  }

  createSupplier() {
    this.supplierService.create(this.supplierForm.value)
    .subscribe({
      next: (res) => {
        this.suppliers.unshift(res);
        $('#supplierModal').modal('hide');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateSupplier() {
    this.supplierService.update(this.supplierId, this.supplierForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.suppliers.findIndex((item: any) => item._id === res._id);
          this.suppliers[index] = res;
          $('#supplierModal').modal('hide');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  deleteSupplier(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.supplierService.delete(id).subscribe((res) => {
        const index = this.suppliers.findIndex((item: any) => item._id == res._id);
        this.suppliers.splice(index, 1);
      })
    }
  }

  // handle image
  saveSupplier() {
    if(this.state === 0) this.createSupplier();
    if(this.state === 1) this.updateSupplier();
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
          this.supplierForm.controls['picture'].setValue(res.data.url);
          this.saveSupplier();
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.saveSupplier();
    }
  }

  loadImage(event: any) {
    $('#supplierImage').css('display', 'block');
    this.readUrl($(event.target)[0].files[0], '#supplierImage');
    this.postSupplierImage = $(event.target)[0].files[0];
  }

  deleteImage() {
    $('#supplierUpload').val(''); 
    $('#supplierImage').attr('src', ''); 
    $('#supplierImage').css('display', 'none');
    this.postSupplierImage = null;
    this.supplierForm.controls['picture'].setValue('');
  }

  // handle pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getSuppliers();
  }
  
  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getSuppliers();
  }
}
