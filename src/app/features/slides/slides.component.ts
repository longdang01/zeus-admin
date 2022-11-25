import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SlideService } from 'src/app/core/services/slide.service';
import { UploadService } from 'src/app/core/services/upload.service';
declare var $: any;

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.css']
})
export class SlidesComponent implements OnInit {

  // filter
  searchText: string = "" ;
  
  // ckeditor config
  public Editor:any = ClassicEditor;
   
  // setup form
  slideForm!: FormGroup;
  slideId!: any;
  postSlideImage!: any;

  title: string = ""; 
  state: number = 0;
  
  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  slides: any = [];

  constructor(private slideService: SlideService,
    private uploadService: UploadService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
  ) { 
 
    this.slideForm = this.formBuilder.group({
      picture: [''],
      slideName: [''],
      description: ['']
    })
  }

  ngOnInit(): void {
    this.getSlides();
  }

  //Categories
  getSlides() {
    this.slideService.get().subscribe(res => {
      this.slides = res;
    }); 
  }

  getSlide(id: any) {
    this.title = (id) ? "Cập nhật slide" : "Thêm slide";
    this.state = (id) ? 1 : 0;
    this.slideId = (id) && id;

    if(id) {
      
      this.slideService.getById(id).subscribe(res => {
        
        this.slideForm.setValue({
          picture: res['picture'],
          slideName: res['slideName'],
          description: res['description']
        });

        if(!res['picture']) this.deleteImage();
        else {
          $('#slideImage').css('display', 'block');
          $('#slideImage').attr('src', `${res['picture']}`);
          $('#slideUpload').val('');
        }
      });
    } 

    if(!id) {
      this.slideForm = this.formBuilder.group({
        picture: [''],
        slideName: [''],
        description: ['']
      })
      this.deleteImage();
    }

    $('#slideModal').modal('show');
  }

  createSlide() {
    this.slideService.create(this.slideForm.value)
    .subscribe({
      next: (res) => {
        this.slides.unshift(res);
        $('#slideModal').modal('hide');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateSlide() {
    this.slideService.update(this.slideId, this.slideForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.slides.findIndex((item: any) => item._id === res._id);
          this.slides[index] = res;
          $('#slideModal').modal('hide');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  deleteSlide(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.slideService.delete(id).subscribe((res) => {
        const index = this.slides.findIndex((item: any) => item._id == res._id);
        this.slides.splice(index, 1);
      })
    }
  }

  // handle image
  saveSlide() {
    if(this.state === 0) this.createSlide();
    if(this.state === 1) this.updateSlide();
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
          this.slideForm.controls['picture'].setValue(res.data.url);
          this.saveSlide();
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.saveSlide();
    }
  }

  loadImage(event: any) {
    $('#slideImage').css('display', 'block');
    this.readUrl($(event.target)[0].files[0], '#slideImage');
    this.postSlideImage = $(event.target)[0].files[0];
  }

  deleteImage() {
    $('#slideUpload').val(''); 
    $('#slideImage').attr('src', ''); 
    $('#slideImage').css('display', 'none');
    this.postSlideImage = null;
    this.slideForm.controls['picture'].setValue('');
  }

  // handle pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getSlides();
  }
  
  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getSlides();
  }

}
