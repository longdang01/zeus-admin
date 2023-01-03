import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ImportProductService } from 'src/app/core/services/importProduct.service';
import { ProductService } from 'src/app/core/services/product.service';
declare var $:any;

@Component({
  selector: 'app-import-products',
  templateUrl: './import-products.component.html',
  styleUrls: ['./import-products.component.css']
})
export class ImportProductsComponent implements OnInit {

  // filter
  searchText: string = "" ;
  searchProductName: string = "" ;
  searchIsActive: string = "";


  // ckeditor config
  public Editor:any = ClassicEditor;
  
  // setup form
  importForm!: FormGroup;
  importId!: any;

  title: string = ""; 
  state: number = 0;

  selectedColor: any = "";
  selectedSize: any = "";

  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  importProducts: any = [];
  products: any = [];

  constructor(
    private importProductService: ImportProductService,
    private productService: ProductService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
  ) { 

    this.importForm = this.formBuilder.group({
      importCode: [''],
      product: [''],
      color: [''],
      size: [''],
      price: [''],
      quantity: [''],
      note: [''],
      isActive: [''],
    })
  }

  ngOnInit(): void {
    this.getImportProducts();
  }

  toggleSearch = () => {
    if(this.searchProductName == "") {
      $('#productSearchTable').addClass('hide');
      $('#productSearchTable').removeClass('show'); 
    }
    else {
      $('#productSearchTable').removeClass('hide');
      $('#productSearchTable').addClass('show');
    }
  }

  hideCollapse(id: any) {
    $(id).addClass("collapse");
    $(id).removeClass("show");
  }

  openImportForm = (event: any) => {
    this.selectedColor = '';
    this.selectedSize = '';
    $('.miniImport').removeClass("show");
    $('.miniImport').addClass("hide");
    $(event.target).parents("tr").find(".miniImport").addClass('show');
    $(event.target).parents("tr").find(".miniImport").removeClass('hide');
  }

  changeColor = (product:any) => {
    if(this.selectedColor == "") this.selectedSize = "";
  }

  changeSize = (product:any) => {
  }

  //ImportProduct
  getImportProducts() {
    this.importProductService.get().subscribe((res: any) => {
      this.importProducts = res;
    }); 
  }

  getImportProduct(id: any) {
    this.title = (id) ? "Cập nhật đơn nhập" : "Thêm đơn nhập";
    this.state = (id) ? 1 : 0;
    this.importId = (id) && id;

    if(id) {
      this.importProductService.getById(id).subscribe(res => {

        this.importForm.setValue({
          importCode: res['importCode'],
          product: res['product'],
          color: res['color'],
          size: res['size'],
          price: res['price'],
          quantity: res['quantity'],
          note: res['note'],
          isActive: res['isActive'],
        });
      });

    } 

    if(!id) {
      this.searchProductName = '';

      this.importForm = this.formBuilder.group({
        importCode: [''],
        product: [''],
        color: [''],
        size: [''],
        price: [''],
        quantity: [''],
        note: [''],
        isActive: [''],
      })

      this.productService.get().subscribe((res: any) => {
        this.products = res.products;
      }); 

    }
    $('#importModal').modal('show');
  }

  createImportProduct() {
    if(!this.selectedColor || !this.selectedSize) {

      alert("Chọn màu và kích cỡ để nhập hàng");
      return;
    }

    const postImportProd:any = {
      staff: localStorage.getItem('staff'),
      date: new Date().toISOString().slice(0, 10),
      product: this.selectedColor.product,
      color: this.selectedColor._id,
      size: this.selectedSize._id,
      price: this.selectedColor.priceImport,
      quantity: this.selectedSize.quantity,
      isActive: 1
    }

    this.importProductService.create(postImportProd)
    .subscribe({
      next: (res) => {
        alert("Thêm đơn nhập thành công")
        this.importProducts.unshift(res);
        this.selectedColor = '';
        this.selectedSize = '';
        $('.miniImport').removeClass("show");
        $('.miniImport').addClass("hide");
        // $('#ImportProductModal').modal('hide');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateImportProduct() {

    this.importProductService.update(this.importId, this.importForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.importProducts.findIndex((item: any) => item._id === res._id);
          this.importProducts[index] = res;
          $('#importModal').modal('hide');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  deleteImportProduct(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.importProductService.delete(id).subscribe((res) => {
        const index = this.importProducts.findIndex((item: any) => item._id == res._id);
        this.importProducts.splice(index, 1);
      })
    }
  }

  // handle pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getImportProducts();
  }

  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getImportProducts();
  }

}
