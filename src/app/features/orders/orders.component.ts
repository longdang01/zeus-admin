import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { OrdersService } from 'src/app/core/services/orders.service';
import { OrdersStatusService } from 'src/app/core/services/ordersStatus.service';
declare var $: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {

  // filter
  searchText: string = "" ;
  searchOrdersStatus: string = "";
  searchCustomerName: string = "";

  // ckeditor config
  public Editor:any = ClassicEditor;
   
  // setup form
  ordersForm!: FormGroup;
  ordersStatusForm!: FormGroup;
  ordersId!: any;
  ordersStatusId!: any;

  title: string = ""; 
  state: number = 0;
  
  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  ordersList: any = [];
  ordersStatusList: any = [];
  ordersDetails: any = [];

  constructor(private ordersService: OrdersService,
    private ordersStatusService: OrdersStatusService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
  ) { 
 
    this.ordersForm = this.formBuilder.group({
      payment: [''],
      transport: [''],
      deliveryAddress: [''],
      orderDate: [''],
      note: [''],
      total: [''],
      status: [''],
      paid: [''],
    })

    this.ordersStatusForm = this.formBuilder.group({
      orders: this.ordersId,
      ordersStatusName: [''],
      date: ['']
    })
  }

  ngOnInit(): void {
    this.getOrdersList();
  }

  //Orders
  getOrdersList() {
    this.ordersService.get().subscribe((res: any) => {
      this.ordersList = res;
    }); 
  }

  getOrders(id: any) {
    this.title = (id) ? "Cập nhật đơn hàng" : "Thêm đơn hàng";
    this.state = (id) ? 1 : 0;
    this.ordersId = (id) && id;

    if(id) {
      this.ordersService.getById(id).subscribe(res => {
        this.ordersStatusList = res.ordersStatus;
        this.ordersDetails = res.ordersDetails;

        this.ordersForm.setValue({
          payment: res['payment'],
          transport: res['transport'],
          deliveryAddress: res['deliveryAddress'],
          orderDate: res['orderDate'],
          note: res['note'],
          total: res['total'],
          status: res['status'],
          paid: res['paid'],
        });


        $('#ordersModal').modal('show');

        this.actionOrdersStatus(0);
      });
    } 

    if(!id) {
      this.ordersForm = this.formBuilder.group({
        payment: [''],
        transport: [''],
        deliveryAddress: [''],
        orderDate: [''],
        note: [''],
        total: [''],
        status: [''],
        paid: [''],
      })
      $('#ordersModal').modal('show');
    }
  }

  updateOrders(orders?: any) {
    let selectedOrdersVal = (orders) ? orders : this.ordersForm.value; 
    let selectedOrdersId =  (orders) ? orders._id : this.ordersId; 

    selectedOrdersVal.status = Number(selectedOrdersVal.status);
    selectedOrdersVal.paid = Number(selectedOrdersVal.paid);
    this.ordersService.update(selectedOrdersId, selectedOrdersVal)
    .subscribe(
      {
        next: (res) => {
          const index = this.ordersList.findIndex((item: any) => item._id === res._id);
          this.ordersList[index] = res;
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  // OrdersStatus
  getOrdersStatus(id: any, event: any) {
    // add class to selected item
    $(event.target).parents('tr').addClass('active').siblings().removeClass('active');
    this.ordersStatusId = (id) && id;
    
    //handle action form 
    this.actionOrdersStatus(1);

    this.ordersStatusService.getById(id).subscribe(res => {

      this.ordersStatusForm.setValue({
        orders: this.ordersId,
        ordersStatusName: res['ordersStatusName'],
        date: res['date']
      });

       $("#dateOrdersStatus").val(this.ordersStatusForm.get("date")?.value.slice(0, 10));


    });
  }

  createOrdersStatus() {
    this.ordersStatusService.create(this.ordersStatusForm.value)
    .subscribe({
      next: (res) => {
        this.ordersStatusList.push(res);
        this.actionOrdersStatus(0);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateOrdersStatus() {
    this.ordersStatusService.update(this.ordersStatusId, this.ordersStatusForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.ordersStatusList.findIndex((item: any) => item._id === res._id);
          this.ordersStatusList[index] = res;
          this.actionOrdersStatus(0);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deleteOrdersStatus(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.ordersStatusService.delete(id).subscribe((res: any) => {
        const index = this.ordersStatusList.findIndex((item: any) => item._id == res._id);
        this.ordersStatusList.splice(index, 1);
        this.actionOrdersStatus(0);
      })
    }
  }

  actionOrdersStatus(action: any) {
    const btnCreateOrdersStatus = $('.btn__create-ordersStatus');
    const btnUpdateOrdersStatus = $('.btn__update-ordersStatus');

    if(action == 0) {
      btnUpdateOrdersStatus.attr('disabled', true);
      btnCreateOrdersStatus.attr('disabled', false);
      btnCreateOrdersStatus.parents('.grid').siblings('.table__sub').find('tr').removeClass('active');
      this.ordersStatusForm = this.formBuilder.group({
        orders: this.ordersId,
        ordersStatusName: [''],
        date: ['']
      })
    }

    if(action == 1) {
      btnCreateOrdersStatus.attr('disabled', true);
      btnUpdateOrdersStatus.attr('disabled', false);
    }
  }

  // handle pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getOrdersList();
  }
  
  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getOrdersList();
  }
}
