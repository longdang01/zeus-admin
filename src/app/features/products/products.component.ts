import { AfterViewInit, Component, Injector, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ResolveStart, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ColorService } from 'src/app/core/services/color.service';
import { ColorImageService } from 'src/app/core/services/colorImage.service';
import { DiscountService } from 'src/app/core/services/discount.service';
import { ProductService } from 'src/app/core/services/product.service';
import { SizeService } from 'src/app/core/services/size.service';
import { UploadService } from 'src/app/core/services/upload.service';
import { BaseComponent } from 'src/app/core/utils/base.component';
declare var $: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent extends BaseComponent implements OnInit, AfterViewInit {
  

  // filter
  searchText: string = "" ;

  // ckeditor config
  public Editor:any = ClassicEditor;
   
  // setup form
  productForm!: FormGroup;
  colorForm!: FormGroup;
  sizeForm!: FormGroup;
  discountForm!: FormGroup;
  colorImageForm!: FormGroup;
  productId!: any;
  colorId!: any;
  sizeId!: any;
  discountId!: any;
  colorImageId!: any;

  postSizeGuideImage!: any;
  postColorImage!: any;
  title: string = ""; 
  state: number = 0;
  
  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  products: any = [];
  categories: any = [];
  brands: any = [];
  suppliers: any = [];
  collections: any = [];
  colors: any = [];
  sizes: any = [];
  discounts: any = [];
  colorImages: any = [];

  constructor(private productService: ProductService,
    private colorService: ColorService,
    private discountService: DiscountService,
    private sizeService: SizeService,
    private colorImageService: ColorImageService,
    private uploadService: UploadService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private injector: Injector
  ) { 
    super(injector);

    this.productForm = this.formBuilder.group({
      subCategory: [''],
      brand: [''],
      collectionInfo: [''],
      supplier: [''],
      productName: [''],
      origin: [''],
      material: [''],
      style: [''],
      sizeGuide: [''],
      description: [''],
    })

    this.colorForm = this.formBuilder.group({
      product: this.productId,
      price: [''],
      colorName: [''],
      hex: ['']
    })

    this.sizeForm = this.formBuilder.group({
      color: this.colorId,
      sizeName: [''],
      quantity: [''],
    })

    this.discountForm = this.formBuilder.group({
      color: this.colorId,
      discountName: [''],
      value: [''],
      symbol: [''],
      amount: [''],
      isActive: [''],
    })

    this.colorImageForm = this.formBuilder.group({
      color: this.colorId,
      picture: [''],
    })

   
  }

  ngOnInit(): void {
    this.getProducts();
  }
  
  ngAfterViewInit(): void {
    
  }

  hideCollapse(id: any) {
      $(id).addClass("collapse");
      $(id).removeClass("show");
  }

  //Products
  getProducts() {
    this.productService.get().subscribe((res: any) => {
      this.products = res.products;
      this.categories = res.categories;
      this.brands = res.brands;
      this.suppliers = res.suppliers;
      this.collections = res.collections;
      this.getStock();
    }); 
  }

  getProduct(id: any) {
    this.title = (id) ? "Cập nhật sản phẩm" : "Thêm sản phẩm";
    this.state = (id) ? 1 : 0;
    this.productId = (id) && id;

    if(id) {
      this.productService.getById(id).subscribe(res => {
        const dynamicScripts = [
          '/assets/js/farbtastic.js',
          '/assets/js/ntc_main.js',
        ];
        this.loadScripts(dynamicScripts); 

        this.colors = res.colors;

        // this.loadScripts();
        this.productForm.setValue({
          subCategory: res['subCategory']._id,
          brand: res['brand'],
          collectionInfo: res['collectionInfo'],
          supplier: res['supplier'],
          productName: res['productName'],
          origin: res['origin'],
          material: res['material'],
          style: res['style'],
          sizeGuide: res['sizeGuide'],
          description: res['description'],
        });
        this.actionColor(0);

        if(!res['sizeGuide']) this.deleteImage();
        else {
          $('#sizeGuideImage').css('display', 'block');
          $('#sizeGuideImage').attr('src', `${res['sizeGuide']}`);
          $('#sizeGuideUpload').val('');
        }
      });
    } 

    if(!id) {
      this.productForm = this.formBuilder.group({
        subCategory: [''],
        brand: [''],
        collectionInfo: [''],
        supplier: [''],
        productName: [''],
        origin: [''],
        material: [''],
        style: [''],
        sizeGuide: [''],
        description: [''],
      })
      this.deleteImage();
    }
    
    $('#productModal').modal('show');
  }

  createProduct() {
    this.productService.create(this.productForm.value)
    .subscribe({
      next: (res) => {
        this.products.unshift(res);
        $('#productModal').modal('hide');
        this.getStock();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateProduct() {
    this.productService.update(this.productId, this.productForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.products.findIndex((item: any) => item._id === res._id);
          this.products[index] = res;
          this.getStock();
          $('#productModal').modal('hide');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  deleteProduct(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.productService.delete(id).subscribe((res) => {
        const index = this.products.findIndex((item: any) => item._id == res._id);
        this.products.splice(index, 1);
      })
    }
  }

  // handle product image
  saveProduct() {
    if(this.state === 0) this.createProduct();
    if(this.state === 1) this.updateProduct();
  }

  /** get stock */
  getStock() {
    this.products.forEach((item: any, index: any) => {
        let sizes: any = [];
        let remainingStock = 0;  

        item.colors.forEach((item: any, index: any) => {
            sizes.push(item.sizes);
        })

        sizes = [].concat.apply([], sizes);

        sizes.forEach((item: any, index: any) => {
            remainingStock += item.quantity;
        })

        item['stock'] = remainingStock;
    })
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
          this.productForm.controls['sizeGuide'].setValue(res.data.url);
          this.saveProduct();
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.saveProduct();
    }
  }

  loadImage(event: any) {
    $('#sizeGuideImage').css('display', 'block');
    this.readUrl($(event.target)[0].files[0], '#sizeGuideImage');
    this.postSizeGuideImage = $(event.target)[0].files[0];
  }

  deleteImage() {
    $('#sizeGuideUpload').val(''); 
    $('#sizeGuideImage').attr('src', ''); 
    $('#sizeGuideImage').css('display', 'none');
    this.postSizeGuideImage = null;
    this.productForm.controls['sizeGuide'].setValue('');
  }

  // Colors
  getBack() {
    $("#colorModal").modal('hide');
    $("#productModal").modal('show');
    $('.modal-backdrop').css('z-index', 1050);
    $('.modal').css('z-index', 1060);
  }

  getColor(id: any, event: any, state?: any) {
    // add class to selected item
    $(event.target).parents('tr').addClass('active').siblings().removeClass('active');
    this.colorId = (id) && id;
    
    //handle action form 
    this.actionColor(1);

    this.colorService.getById(id).subscribe(res => {

      this.colorForm.setValue({
        product: this.productId,
        price: res['price'],
        colorName: res['colorName'],
        hex: res['hex'],
      }); 
      $('#colorbox').css("background", res['hex']);

      this.sizes = res.sizes;
      this.discounts = [...res.sales, ...res.codes];
      this.colorImages = res.images;
      if(state == 1) {
        // $scope.actionPrice(-1);
        this.actionSize(0);
        this.actionDiscount(0);
        this.actionColorImage(0);

        $('#productModal').modal('hide');
        $('#colorModal').modal('show');
        $('.modal-backdrop').css('z-index', 1050);
        $('.modal').css('z-index', 1060);
      }
    });
  }

  setPickColor() {
    const colorName = $("#colorname").val();
    const hex = $("#colorinp").val();
    this.colorForm.patchValue({
      colorName,
      hex,
    });
  }

  createColor() {
    this.setPickColor();
    this.colorService.create(this.colorForm.value)
    .subscribe({
      next: (res) => {
        this.colors.unshift(res);
        this.actionColor(0);

        //handle stock 
        const product = this.products.find((item: any) => item._id == this.productId);
        product.colors.unshift(res);

        const idxProduct = this.products.findIndex((item: any) => item._id === product._id);
        this.products[idxProduct] = product;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateColor() {
    this.setPickColor();

    this.colorService.update(this.colorId, this.colorForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.colors.findIndex((item: any) => item._id === res._id);
          this.colors[index] = res;
          this.actionColor(0);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deleteColor(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.colorService.delete(id).subscribe((res) => {
        const index = this.colors.findIndex((item: any) => item._id == res._id);
        this.colors.splice(index, 1);
        this.actionColor(0);

        // handle stock
        const product = this.products.find((item: any) => item._id == this.productId);
        const idxColor = product.colors.findIndex((item: any) => item._id = res._id);
        product.colors[idxColor].sizes = [];

        const idxProduct = this.products.findIndex((item: any) => item._id === product._id);
        this.products[idxProduct] = product;
        this.getStock();
      })
    }
  }

  actionColor(action: any) {
    const btnCreateColor = $('.btn__create-color');
    const btnUpdateColor = $('.btn__update-color');

    if(action == 0) {
        btnUpdateColor.attr('disabled', true);
        btnCreateColor.attr('disabled', false);
        btnCreateColor.parents('.grid').siblings('.table__sub').find('tr').removeClass('active');
        this.colorForm = this.formBuilder.group({
          product: this.productId,
          price: [''],
          colorName: [''],
          hex: ['']
        })
        $(".choose-color").css('background', 'transparent')
    }

    if(action == 1) {
      btnCreateColor.attr('disabled', true);
      btnUpdateColor.attr('disabled', false);
    }
  }

  // Sizes
  getSize(id: any, event: any) {
    // add class to selected item
    $(event.target).parents('tr').addClass('active').siblings().removeClass('active');
    this.sizeId = (id) && id;
    
    //handle action form 
    this.actionSize(1);

    this.sizeService.getById(id).subscribe(res => {

      this.sizeForm.setValue({
        color: this.colorId,
        sizeName: res['sizeName'],
        quantity: res['quantity'],
      }); 
    });
  }

  createSize() {
    this.sizeService.create(this.sizeForm.value)
    .subscribe({
      next: (res) => {
        this.sizes.push(res);
        this.actionSize(0);
        
        // handle stock
        const color = this.colors.find((item: any) => item._id == this.colorId);
        const product = this.products.find((item: any) => item._id == this.productId);
        
        const idx = product.colors.findIndex((item: any) => item._id === color._id);
        product.colors[idx].sizes.push(res);

        const idxProduct = this.products.findIndex((item: any) => item._id === product._id);
        this.products[idxProduct] = product;
        this.getStock();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateSize() {
    this.sizeService.update(this.sizeId, this.sizeForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.sizes.findIndex((item: any) => item._id === res._id);
          this.sizes[index] = res;
          this.actionSize(0);
         
          // handle stock
          const color = this.colors.find((item: any) => item._id == this.colorId);
          const product = this.products.find((item: any) => item._id == this.productId);
          const idx = product.colors.findIndex((item: any) => item._id === color._id);
          const idxSize = product.colors[idx].sizes.findIndex((item: any) => item._id === res._id);
          product.colors[idx].sizes[idxSize] = res;

          const idxProduct = this.products.findIndex((item: any) => item._id === product._id);
          this.products[idxProduct] = product;
          this.getStock();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deleteSize(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.sizeService.delete(id).subscribe((res) => {
        const index = this.sizes.findIndex((item: any) => item._id == res._id);
        this.sizes.splice(index, 1);
        this.actionSize(0);

        // handle stock
        const color = this.colors.find((item: any) => item._id == this.colorId);
        const product = this.products.find((item: any) => item._id == this.productId);
        const idx = product.colors.findIndex((item: any) => item._id === color._id);
        const idxSize = product.colors[idx].sizes.findIndex((item: any) => item._id === res._id);
        product.colors[idx].sizes.splice(idxSize, 1);

        const idxProduct = this.products.findIndex((item: any) => item._id === product._id);
        this.products[idxProduct] = product;
        this.getStock();
      })
    }
  }

  actionSize(action: any) {
    const btnCreateSize = $('.btn__create-size');
    const btnUpdateSize = $('.btn__update-size');

    if(action == 0) {
      btnUpdateSize.attr('disabled', true);
      btnCreateSize.attr('disabled', false);
      btnCreateSize.parents('.grid').siblings('.table__sub').find('tr').removeClass('active');
      this.sizeForm = this.formBuilder.group({
        color: this.colorId,
        sizeName: [''],
        quantity: [''],
      })
    }

    if(action == 1) {
      btnCreateSize.attr('disabled', true);
      btnUpdateSize.attr('disabled', false);
    }
  }

  // Discount
  getDiscount(id: any, event: any) {
    // add class to selected item
    $(event.target).parents('tr').addClass('active').siblings().removeClass('active');
    this.discountId = (id) && id;
    
    //handle action form 
    this.actionDiscount(1);

    this.discountService.getById(id).subscribe(res => {

      this.discountForm.setValue({
        color: this.colorId,
        discountName: res['discountName'],
        value: res['value'],
        symbol: res['symbol'],
        amount: res['amount'],
        isActive: res['isActive'],
      }); 
    });
  }

  createDiscount() {
    this.discountService.create(this.discountForm.value)
    .subscribe({
      next: (res) => {
        this.discounts.push(res);
        this.actionDiscount(0);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateDiscount() {
    this.discountService.update(this.discountId, this.discountForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.discounts.findIndex((item: any) => item._id === res._id);
          this.discounts[index] = res;
          this.actionDiscount(0);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deleteDiscount(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.discountService.delete(id).subscribe((res) => {
        const index = this.discounts.findIndex((item: any) => item._id == res._id);
        this.discounts.splice(index, 1);
        this.actionDiscount(0);
      })
    }
  }

  actionDiscount(action: any) {
    const btnCreateDiscount = $('.btn__create-discount');
    const btnUpdateDiscount = $('.btn__update-discount');

    if(action == 0) {
      btnUpdateDiscount.attr('disabled', true);
      btnCreateDiscount.attr('disabled', false);
      btnCreateDiscount.parents('.grid').siblings('.table__sub').find('tr').removeClass('active');
      this.discountForm = this.formBuilder.group({
        color: this.colorId,
        discountName: [''],
        value: [''],
        symbol: [''],
        amount: [''],
        isActive: [''],
      })
    }

    if(action == 1) {
      btnCreateDiscount.attr('disabled', true);
      btnUpdateDiscount.attr('disabled', false);
    }
  }

  // Color Image
  getColorImage(id: any, event: any) {
    // add class to selected item
    $(event.target).parents('tr').addClass('active').siblings().removeClass('active');
    this.colorImageId = (id) && id;
    
    //handle action form 
    this.actionColorImage(1);

    this.colorImageService.getById(id).subscribe(res => {

      this.colorImageForm.setValue({
        color: this.colorId,
        picture: res['picture'],
      }); 

      $('#colorImage').css('display', 'block');
      $('#colorImage').attr('src', `${res['picture']}`);
      $('#colorUpload').val('');
    });

  }

  createColorImage() {

    this.colorImageService.create(this.colorImageForm.value)
    .subscribe({
      next: (res) => {
        this.colorImages.unshift(res);
        this.actionColorImage(0);
        this.deleteColorPicture();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateColorImage() {

    this.colorImageService.update(this.colorImageId,
       this.colorImageForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.colorImages.findIndex((item: any) => item._id === res._id);
          this.colorImages[index] = res;
          this.actionColorImage(0);
          this.deleteColorPicture();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deleteColorImage(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.colorImageService.delete(id).subscribe((res) => {
        const index = this.colorImages.findIndex((item: any) => item._id == res._id);
        this.colorImages.splice(index, 1);
        this.actionColorImage(0);
      })
    } 
  }

  actionColorImage(action: any) {
    const btnCreateColorImage = $('.btn__create-image');
    const btnUpdateColorImage = $('.btn__update-image');

    if(action == 0) {
      btnUpdateColorImage.attr('disabled', true);
      btnCreateColorImage.attr('disabled', false);
      btnCreateColorImage.parents('.grid').siblings('.table__sub').find('tr').removeClass('active');
      this.colorImageForm = this.formBuilder.group({
        color: this.colorId,
        picture: [''],
      })
      this.deleteColorPicture();
    }

    if(action == 1) {
      btnCreateColorImage.attr('disabled', true);
      btnUpdateColorImage.attr('disabled', false);
    }
  }

  // handle image
  saveColorImage(state: any) {
    if(state === 0) this.createColorImage();
    if(state === 1) this.updateColorImage();
  }

  uploadColorImage(data: any, state: any) {
    
    if(data) {
      this.uploadService.upload(data)
      .subscribe({
        next: (res) => {
          this.colorImageForm.controls['picture'].setValue(res.data.url);

          this.saveColorImage(state);
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.saveColorImage(state);
    }
  }

  loadColorImage(event: any) {
    $('#colorImage').css('display', 'block');
    this.readUrl($(event.target)[0].files[0], '#colorImage');
    this.postColorImage = $(event.target)[0].files[0];
  }

  deleteColorPicture() {
    $('#colorUpload').val(''); 
    $('#colorImage').attr('src', ''); 
    $('#colorImage').css('display', 'none');
    this.postColorImage = null;
    this.colorImageForm.controls['picture'].setValue('');
  }


  // handle pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getProducts();
  }
  
  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getProducts();
  }

}
