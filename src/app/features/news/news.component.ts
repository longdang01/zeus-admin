import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NewsService } from 'src/app/core/services/news.service';
import { UploadService } from 'src/app/core/services/upload.service';
declare var $:any;

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  // filter
  searchText: string = "" ;
  searchDatePost: string = "";
  
  // ckeditor config
  public Editor:any = ClassicEditor;
   
  // setup form
  newsForm!: FormGroup;
  newsId!: any;
  staffId: any = localStorage.getItem("staff") ?? "637b4195f8ddd394db3b00b1";
  postThumbnailImage!: any;

  title: string = ""; 
  state: number = 0;
  
  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  newsList: any = [];

  constructor(private newsService: NewsService,
    private uploadService: UploadService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
  ) { 
 
    this.newsForm = this.formBuilder.group({
      staff: this.staffId,
      title: [''],
      thumbnail: [''],
      content: [''],
      datePost: [''],
    })
  }

  ngOnInit(): void {
    this.getNewsList();
  }

  hideCollapse(id: any) {
    $(id).addClass("collapse");
    $(id).removeClass("show");
  }

  //Categories
  getNewsList() {
    this.newsService.get().subscribe(res => {
      this.newsList = res;
    }); 
  }

  getNews(id: any) {
    this.title = (id) ? "Cập nhật tin tức" : "Thêm tin tức";
    this.state = (id) ? 1 : 0;
    this.newsId = (id) && id;

    if(id) {
      
      this.newsService.getById(id).subscribe(res => {
        
        this.newsForm.setValue({
          staff: res['staff'],
          title: res['title'],
          thumbnail: res['thumbnail'],
          content: res['content'],
          datePost: res['datePost'],
        });
        $("#datePostNews").val(this.newsForm.get("datePost")?.value.slice(0, 10));

        if(!res['thumbnail']) this.deleteImage();
        else {
          $('#newsImage').css('display', 'block');
          $('#newsImage').attr('src', `${res['thumbnail']}`);
          $('#newsUpload').val('');
        }
      });
    } 

    if(!id) {
      this.newsForm = this.formBuilder.group({
        staff: this.staffId,
        title: [''],
        thumbnail: [''],
        content: [''],
        datePost: [''],
      })
      this.deleteImage();
    }

    $('#newsModal').modal('show');
  }

  createNews() {
    this.newsService.create(this.newsForm.value)
    .subscribe({
      next: (res) => {
        this.newsList.unshift(res);
        $('#newsModal').modal('hide');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateNews() {
    this.newsService.update(this.newsId, this.newsForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.newsList.findIndex((item: any) => item._id === res._id);
          this.newsList[index] = res;
          $('#newsModal').modal('hide');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  deleteNews(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.newsService.delete(id).subscribe((res) => {
        const index = this.newsList.findIndex((item: any) => item._id == res._id);
        this.newsList.splice(index, 1);
      })
    }
  }

  // handle image
  saveNews() {
    if(this.state === 0) this.createNews();
    if(this.state === 1) this.updateNews();
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
          this.newsForm.controls['thumbnail'].setValue(res.data.url);
          this.saveNews();
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.saveNews();
    }
  }

  loadImage(event: any) {
    $('#newsImage').css('display', 'block');
    this.readUrl($(event.target)[0].files[0], '#newsImage');
    this.postThumbnailImage = $(event.target)[0].files[0];
  }

  deleteImage() {
    $('#newsUpload').val(''); 
    $('#newsImage').attr('src', ''); 
    $('#newsImage').css('display', 'none');
    this.postThumbnailImage = null;
    this.newsForm.controls['thumbnail'].setValue('');
  }

  // handle pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getNewsList();
  }
  
  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getNewsList();
  }

}
