import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BrandService } from 'src/app/core/services/brand.service';
declare var $: any;

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {
  // filter
  searchText: string = "" ;

  // ckeditor config
  public Editor:any = ClassicEditor;
   
  // setup form
  brandForm!: FormGroup;
  brandId!: any;

  title: string = ""; 
  state: number = 0;
  
  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  brands: any = [];

  constructor(private brandService: BrandService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
  ) { 
 
    this.brandForm = this.formBuilder.group({
      brandName: [''],
      description: ['']
    })
  }

  ngOnInit(): void {
    this.getBrands();
  }

  hideCollapse(id: any) {
    $(id).addClass("collapse");
    $(id).removeClass("show");
  }

  //Brands
  getBrands() {
    this.brandService.get().subscribe((res: any) => {
      this.brands = res;
    }); 
  }

  getBrand(id: any) {
    this.title = (id) ? "Cập nhật thương hiệu" : "Thêm thương hiệu";
    this.state = (id) ? 1 : 0;
    this.brandId = (id) && id;

    if(id) {
      this.brandService.getById(id).subscribe(res => {
        this.brandForm.setValue({
          brandName: res['brandName'],
          description: res['description']
        });
      });
    } 

    if(!id) {
      this.brandForm = this.formBuilder.group({
        brandName: [''],
        description: ['']
      })
    }

    $('#brandModal').modal('show');
  }

  createBrand() {
    this.brandService.create(this.brandForm.value)
    .subscribe({
      next: (res) => {
        this.brands.unshift(res);
        $('#brandModal').modal('hide');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateBrand() {
    this.brandService.update(this.brandId, this.brandForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.brands.findIndex((item: any) => item._id === res._id);
          this.brands[index] = res;
          $('#brandModal').modal('hide');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  deleteBrand(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.brandService.delete(id).subscribe((res) => {
        const index = this.brands.findIndex((item: any) => item._id == res._id);
        this.brands.splice(index, 1);
      })
    }
  }

  // handle pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getBrands();
  }
  
  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getBrands();
  }
}
