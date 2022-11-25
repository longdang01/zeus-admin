import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CollectionService } from 'src/app/core/services/collection.service';
import { CollectionImageService } from 'src/app/core/services/collectionImage.service';
import { UploadService } from 'src/app/core/services/upload.service';
declare var $: any;

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

  // filter
  searchText: string = "" ;

  // ckeditor config
  public Editor:any = ClassicEditor;
   
  // setup form
  collectionForm!: FormGroup;
  collectionImageForm!: FormGroup;
  collectionId!: any;
  collectionImageId!: any;
  postCollectionImage!: any;

  title: string = ""; 
  state: number = 0;
  
  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  collections: any = [];
  collectionImages: any = [];

  constructor(private collectionService: CollectionService,
    private collectionImageService: CollectionImageService,
    private uploadService: UploadService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
  ) { 
 
    this.collectionForm = this.formBuilder.group({
      collectionName: [''],
      description: ['']
    })

    this.collectionImageForm = this.formBuilder.group({
      collectionInfo: this.collectionId,
      picture: [''],
    })
  }

  ngOnInit(): void {
    this.getCollections();
  }

  hideCollapse(id: any) {
    $(id).addClass("collapse");
    $(id).removeClass("show");
  }
  
  //Collections
  getCollections() {
    this.collectionService.get().subscribe(res => {
      this.collections = res;
    }); 
  }

  getCollection(id: any) {
    this.title = (id) ? "Cập nhật bộ sưu tập" : "Thêm bộ sưu tập";
    this.state = (id) ? 1 : 0;
    this.collectionId = (id) && id;

    if(id) {
      this.collectionService.getById(id).subscribe(res => {
        this.collectionImages = res.images;
 
        this.collectionForm.setValue({
          collectionName: res['collectionName'],
          description: res['description']
        });

        this.actionCollectionImage(0);
      });
    } 

    if(!id) {
      this.collectionForm = this.formBuilder.group({
        collectionName: [''],
        description: ['']
      })
    }

    $('#collectionModal').modal('show');
  }

  createCollection() {
    this.collectionService.create(this.collectionForm.value)
    .subscribe({
      next: (res) => {
        this.collections.unshift(res);
        $('#collectionModal').modal('hide');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateCollection() {
    this.collectionService.update(this.collectionId, this.collectionForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.collections.findIndex((item: any) => item._id === res._id);
          this.collections[index] = res;
          $('#collectionModal').modal('hide');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  deleteCollection(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.collectionService.delete(id).subscribe((res) => {
        const index = this.collections.findIndex((item: any) => item._id == res._id);
        this.collections.splice(index, 1);
      })
    }
  }

  // CollectionImages
  getCollectionImage(id: any, event: any) {
    // add class to selected item
    $(event.target).parents('tr').addClass('active').siblings().removeClass('active');
    this.collectionImageId = (id) && id;
    
    //handle action form 
    this.actionCollectionImage(1);

    this.collectionImageService.getById(id).subscribe(res => {

      this.collectionImageForm.setValue({
        collectionInfo: this.collectionId,
        picture: res['picture'],
      }); 

      $('#collectionImage').css('display', 'block');
      $('#collectionImage').attr('src', `${res['picture']}`);
      $('#collectionUpload').val('');
    });

  }

  createCollectionImage() {

    this.collectionImageService.create(this.collectionImageForm.value)
    .subscribe({
      next: (res) => {
        this.collectionImages.unshift(res);
        this.actionCollectionImage(0);
        this.deleteImage();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateCollectionImage() {

    this.collectionImageService.update(this.collectionImageId,
       this.collectionImageForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.collectionImages.findIndex((item: any) => item._id === res._id);
          this.collectionImages[index] = res;
          this.actionCollectionImage(0);
          this.deleteImage();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deleteCollectionImage(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.collectionImageService.delete(id).subscribe((res) => {
        const index = this.collectionImages.findIndex((item: any) => item._id == res._id);
        this.collectionImages.splice(index, 1);
        this.actionCollectionImage(0);
      })
    } 
  }

  actionCollectionImage(action: any) {
    const btnCreateCollectionImage = $('.btn__create-collectionImage');
    const btnUpdateCollectionImage = $('.btn__update-collectionImage');

    if(action == 0) {
      btnUpdateCollectionImage.attr('disabled', true);
      btnCreateCollectionImage.attr('disabled', false);
      btnCreateCollectionImage.parents('.grid').siblings('.table__sub').find('tr').removeClass('active');
      this.collectionImageForm = this.formBuilder.group({
        collectionInfo: this.collectionId,
        picture: [''],
      })
      this.deleteImage();
    }

    if(action == 1) {
      btnCreateCollectionImage.attr('disabled', true);
      btnUpdateCollectionImage.attr('disabled', false);
    }
  }

  // handle image
  saveCollectionImage(state: any) {
    if(state === 0) this.createCollectionImage();
    if(state === 1) this.updateCollectionImage();
  }

  readUrl(fileData: any, element: any) {
    var reader = new FileReader(); 

    reader.onload = function(e: any) {
        $(element).attr('src', e.target.result); 
    }
    reader.readAsDataURL(fileData);
  }

  upload(data: any, state: any) {
    
    if(data) {
      this.uploadService.upload(data)
      .subscribe({
        next: (res) => {
          this.collectionImageForm.controls['picture'].setValue(res.data.url);

          this.saveCollectionImage(state);
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.saveCollectionImage(state);
    }
  }

  loadImage(event: any) {
    $('#collectionImage').css('display', 'block');
    this.readUrl($(event.target)[0].files[0], '#collectionImage');
    this.postCollectionImage = $(event.target)[0].files[0];
  }

  deleteImage() {
    $('#collectionUpload').val(''); 
    $('#collectionImage').attr('src', ''); 
    $('#collectionImage').css('display', 'none');
    this.postCollectionImage = null;
    this.collectionImageForm.controls['picture'].setValue('');
  }

  // handle pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getCollections();
  }
  
  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getCollections();
  }

}
