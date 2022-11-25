import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { PaymentService } from 'src/app/core/services/payment.service';
declare var $: any;

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  // filter
  searchText: string = "" ;

  // ckeditor config
  public Editor:any = ClassicEditor;
  
  // setup form
  paymentForm!: FormGroup;
  paymentId!: any;

  title: string = ""; 
  state: number = 0;

  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  payments: any = [];

  constructor(private paymentService: PaymentService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
  ) { 

    this.paymentForm = this.formBuilder.group({
      paymentType: [''],
      description: ['']
    })
  }

  ngOnInit(): void {
    this.getPayments();
  }

  //Payments
  getPayments() {
    this.paymentService.get().subscribe((res: any) => {
      this.payments = res;

    }); 
  }

  getPayment(id: any) {
    this.title = (id) ? "Cập nhật hình thức thanh toán" : "Thêm hình thức thanh toán";
    this.state = (id) ? 1 : 0;
    this.paymentId = (id) && id;

    if(id) {
      this.paymentService.getById(id).subscribe(res => {

        this.paymentForm.setValue({
          paymentType: res['paymentType'],
          description: res['description']
        });
      });
    } 

    if(!id) {
      this.paymentForm = this.formBuilder.group({
        paymentType: [''],
        description: ['']
      })
    }

    $('#paymentModal').modal('show');
  }

  createPayment() {
    this.paymentService.create(this.paymentForm.value)
    .subscribe({
      next: (res) => {
        this.payments.push(res);
        $('#paymentModal').modal('hide');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updatePayment() {
    this.paymentService.update(this.paymentId, this.paymentForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.payments.findIndex((item: any) => item._id === res._id);
          this.payments[index] = res;
          $('#paymentModal').modal('hide');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  deletePayment(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.paymentService.delete(id).subscribe((res) => {
        const index = this.payments.findIndex((item: any) => item._id == res._id);
        this.payments.splice(index, 1);
      })
    }
  }

  // handle pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getPayments();
  }

  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getPayments();
  }

}
