import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { OrdersDetailService } from 'src/app/core/services/ordersDetail.service';

declare var $: any;

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.css']
})
export class OrdersDetailsComponent implements OnInit {

  // filter
  searchOrdersDetailStatus: string = "";
  searchOrdersCode: string = "";

  // ckeditor config
  public Editor:any = ClassicEditor;
   
  // setup form
  ordersDetailForm!: FormGroup;
  ordersDetailId!: any;

  title: string = ""; 
  state: number = 0;
  
  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  ordersDetails: any = [];

  constructor(private ordersDetailService: OrdersDetailService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
  ) { 
 
    this.ordersDetailForm = this.formBuilder.group({
      orders: [''],
      product: [''],
      color: [''],
      size: [''],
      price: [''],
      quantity: [''],
      note: [''],
      status: [''],
    })
  }

  ngOnInit(): void {
    this.getOrdersDetails();
  }

  hideCollapse(id: any) {
    $(id).addClass("collapse");
    $(id).removeClass("show");
  }
  
  //OrdersDetail
  getOrdersDetails() {
    this.ordersDetailService.search().subscribe((res: any) => {
      this.ordersDetails = res;
    }); 
  }

  getOrdersDetail(id: any) {
    this.title = (id) && "Cập nhật sản phẩm";
    this.state = (id) && 1 ;
    this.ordersDetailId = (id) && id;

    if(id) {
      this.ordersDetailService.getById(id).subscribe(res => {

        this.ordersDetailForm.setValue({
          orders: res['orders'],
          product: res['product'],
          color: res['color'],
          size: res['size'],
          price: res['price'],
          quantity: res['quantity'],
          note: res['note'],
          status: res['status'],
        });


        $('#ordersDetailModal').modal('show');
      });
    } 
  }

  updateOrdersDetail() {
    this.ordersDetailService.update(this.ordersDetailId, this.ordersDetailForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.ordersDetails.findIndex((item: any) => item._id === res._id);
          this.ordersDetails[index] = res;
          $('#ordersDetailModal').modal('hide');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  // handle pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getOrdersDetails();
  }
  
  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getOrdersDetails();
  }

}
