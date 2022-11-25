import { Component, NgZone, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/core/services/category.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute, Router } from '@angular/router';
import { SubCategoryService } from 'src/app/core/services/subCategory.service';
declare var $: any;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {

  // filter
  searchText: string = "" ;

  // ckeditor config
  public Editor:any = ClassicEditor;
   
  // setup form
  categoryForm!: FormGroup;
  subCategoryForm!: FormGroup;
  categoryId!: any;
  subCategoryId!: any;

  title: string = ""; 
  state: number = 0;
  
  // pagination
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes: any = [10, 20, 30, 40, 50];

  categories: any = [];
  subCategories: any = [];

  constructor(private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
  ) { 
 
    this.categoryForm = this.formBuilder.group({
      categoryName: [''],
      description: ['']
    })

    this.subCategoryForm = this.formBuilder.group({
      category: this.categoryId,
      subCategoryName: [''],
      description: ['']
    })
  }

  ngOnInit(): void {
    this.getCategories();
  }

  hideCollapse(id: any) {
    $(id).addClass("collapse");
    $(id).removeClass("show");
  }
  
  //Categories
  getCategories() {
    this.categoryService.get().subscribe((res: any) => {
      this.categories = res;

    }); 
  }

  getCategory(id: any) {
    this.title = (id) ? "Cập nhật danh mục" : "Thêm danh mục";
    this.state = (id) ? 1 : 0;
    this.categoryId = (id) && id;

    if(id) {
      this.categoryService.getById(id).subscribe(res => {
        this.subCategories = res.subCategories;
 
        this.categoryForm.setValue({
          categoryName: res['categoryName'],
          description: res['description']
        });

        this.actionSubCategory(0);
      });
    } 

    if(!id) {
      this.categoryForm = this.formBuilder.group({
        categoryName: [''],
        description: ['']
      })
    }

    $('#categoryModal').modal('show');
  }

  createCategory() {
    this.categoryService.create(this.categoryForm.value)
    .subscribe({
      next: (res) => {
        this.categories.push(res);
        $('#categoryModal').modal('hide');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateCategory() {
    this.categoryService.update(this.categoryId, this.categoryForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.categories.findIndex((item: any) => item._id === res._id);
          this.categories[index] = res;
          $('#categoryModal').modal('hide');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  deleteCategory(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.categoryService.delete(id).subscribe((res) => {
        const index = this.categories.findIndex((item: any) => item._id == res._id);
        this.categories.splice(index, 1);
      })
    }
  }


  // SubCategories
  getSubCategory(id: any, event: any) {
    // add class to selected item
    $(event.target).parents('tr').addClass('active').siblings().removeClass('active');
    this.subCategoryId = (id) && id;
    
    //handle action form 
    this.actionSubCategory(1);

    this.subCategoryService.getById(id).subscribe(res => {

      this.subCategoryForm.setValue({
        category: this.categoryId,
        subCategoryName: res['subCategoryName'],
        description: res['description']
      }); 
    });
  }

  createSubCategory() {
    this.subCategoryService.create(this.subCategoryForm.value)
    .subscribe({
      next: (res) => {
        this.subCategories.push(res);
        this.actionSubCategory(0);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateSubCategory() {
    this.subCategoryService.update(this.subCategoryId, this.subCategoryForm.value)
    .subscribe(
      {
        next: (res) => {
          const index = this.subCategories.findIndex((item: any) => item._id === res._id);
          this.subCategories[index] = res;
          this.actionSubCategory(0);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deleteSubCategory(id: any) {
    const confirm = window.confirm('Bạn có chắc chắn xóa không?'); 

    if(confirm) {
      this.subCategoryService.delete(id).subscribe((res) => {
        const index = this.subCategories.findIndex((item: any) => item._id == res._id);
        this.subCategories.splice(index, 1);
        this.actionSubCategory(0);
      })
    }
  }

  actionSubCategory(action: any) {
    const btnCreateSubCategory = $('.btn__create-subCategory');
    const btnUpdateSubCategory = $('.btn__update-subCategory');

    if(action == 0) {
        btnUpdateSubCategory.attr('disabled', true);
        btnCreateSubCategory.attr('disabled', false);
        btnCreateSubCategory.parents('.grid').siblings('.table__sub').find('tr').removeClass('active');
        this.subCategoryForm = this.formBuilder.group({
          category: this.categoryId,
          subCategoryName: [''],
          description: ['']
        })
    }

    if(action == 1) {
        btnCreateSubCategory.attr('disabled', true);
        btnUpdateSubCategory.attr('disabled', false);
    }
  }

  // handle pagination
  onTableDataChange(event: any) {
    this.page = event;
    this.getCategories();
  }
  
  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getCategories();
  }

}
