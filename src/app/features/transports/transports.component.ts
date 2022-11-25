import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TransportService } from 'src/app/core/services/transport.service';
declare var $: any;

@Component({
  selector: 'app-transports',
  templateUrl: './transports.component.html',
  styleUrls: ['./transports.component.css']
})
export class TransportsComponent implements OnInit {
  // filter
  searchText: string = "" ;

  // ckeditor config
  public Editor:any = ClassicEditor;
  
  // setup form
  transportForm!: FormGroup;
  transportId!: any;

  title: string = ""; 
  state: number = 0;

  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  transports: any = [];

  constructor(private transportService: TransportService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
  ) { 

    this.transportForm = this.formBuilder.group({
      transportType: [''],
      fee: [''],
      description: ['']
    })
  }

  ngOnInit(): void {
    this.getTransports();
  }

  //Transport
  getTransports() {
    this.transportService.get().subscribe((res: any) => {
      this.transports = res;

    }); 
  }

  getTransport(id: any) {
    this.title = (id) ? "Cập nhật hình thức vận chuyển" : "Thêm hình thức vận chuyển";
    this.state = (id) ? 1 : 0;
    this.transportId = (id) && id;

    if(id) {
      this.transportService.getById(id).subscribe(res => {

        this.transportForm.setValue({
          transportType: res['transportType'],
          fee: res['fee'],
          description: res['description']
        });
      });
    } 

    if(!id) {
      this.transportForm = this.formBuilder.group({
        transportType: [''],
        fee: [''],
        description: ['']
      })
    }

    $('#transportModal').modal('show');
  }

  createTransport() {
    this.transportService.create(this.transportForm.value)
    .subscribe({
      next: (res) => {
        this.transports.push(res);
        $('#transportModal').modal('hide');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateTransport() {
    this.transportService.update(this.transportId, this.transportForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.transports.findIndex((item: any) => item._id === res._id);
          this.transports[index] = res;
          $('#transportModal').modal('hide');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  deleteTransport(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.transportService.delete(id).subscribe((res) => {
        const index = this.transports.findIndex((item: any) => item._id == res._id);
        this.transports.splice(index, 1);
      })
    }
  }

  // handle pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getTransports();
  }

  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getTransports();
  }

}
