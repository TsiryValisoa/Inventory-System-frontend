import { Component, OnInit } from '@angular/core';
import { Category } from './category.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../Service/api.service';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  categories: Category[] = [];
  categoryName: string = '';
  message: string | null = null;
  isEditing: boolean = false;
  editingCategoryId: string | null = null;
  showDeleteModal: boolean = false;
  categoryToDeleteId: string | null = null;
  searchCategory: string = '';
  messageType: 'success' | 'error' |'' = '';
  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 10;
  valueToSearch: string = '';
  searchStatus: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  addCategory(): void {

    if (!this.categoryName) {
      this.showMessage("Category name is required !", 'error');
      return;
    }

    this.apiService.createCategory({name: this.categoryName}).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showMessage(response.message, 'success');
          this.categoryName = '';
          this.getCategories();
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to save category" + error);
      }
    })
  }

  getCategories() : void {

    this.apiService.listAllCategories(this.currentPage, this.itemsPerPage, this.valueToSearch).subscribe({
      next: (response: any) => {
        if (response.status === 200) {

          if (response.totalPage === 0) {
            this.totalPages = 0;
            this.currentPage = 0;
          } else {
            this.totalPages = response.totalPage;
            this.currentPage = response.currentPage + 1;
          }
        
          this.categories = response.categories;
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to get all categories" + error);
      }
    })
  }

  //TODO get category by it's ID

  editCategory() : void {

    if (!this.editingCategoryId || !this.categoryName) {
      return;
    }

    this.apiService.updateCategory(this.editingCategoryId, {name: this.categoryName}).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showMessage(response.message, 'success');
          this.categoryName = '';
          this.isEditing = false;
          this.getCategories();
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to edit category" + error);
      }
    })
  }

  //Set the category to edit
  handleEditCategory(category: Category) : void {

    this.isEditing = true;
    this.editingCategoryId = category.id;
    this.categoryName = category.name;
  }

  //Cancel form to add
  resterForm(): void {
    this.categoryName = '';
    this.isEditing = false;
    this.editingCategoryId = null;
  }

  deleteCategory(categoryId: string) : void {
    this.categoryToDeleteId = categoryId;
    this.showDeleteModal = true;
  }

  //Confirm delete
  confirmDelete(): void {

    if (this.categoryToDeleteId) {
      this.apiService.deleteCategory(this.categoryToDeleteId).subscribe({
        next: (response: any) => {
        if (response.status === 200) {
          this.showMessage(response.message, 'success');
          this.getCategories();
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to delete category" + error);
      }
      })
    }
    //Close modal
    this.cancelDelete();
  }

  //cancel delete
  cancelDelete(): void {
    this.showDeleteModal = false;
    this.categoryToDeleteId = null;
  }

  handleSearch() : void {
    this.currentPage = 0;
    this.valueToSearch = this.searchCategory || this.searchStatus;
    this.getCategories();
  }

  onPageChange(page: number) : void {
    this.currentPage = page - 1;
    this.getCategories();
  }

  showMessage(msg: string, type: 'success' | 'error' = 'error') {
    this.message = msg;
    this.messageType = type;
    //Disappear after
    setTimeout(() => {
      this.message = null;
    }, 4000)
  }

}
