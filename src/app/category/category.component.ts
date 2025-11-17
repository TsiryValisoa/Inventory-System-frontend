import { Component, OnInit } from '@angular/core';
import { Category } from './category.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../Service/api.service';

@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule],
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  addCategory(): void {

    if (!this.categoryName) {
      this.showMessage("Category name is required");
      return;
    }

    this.apiService.createCategory({name: this.categoryName}).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showMessage(response.message);
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

    this.apiService.listAllCategories().subscribe({
      next: (response: any) => {
        if (response.status === 200) {
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
          this.showMessage(response.message);
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

  //reset form to add
  resterForm() {
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
          this.showMessage(response.message);
          this.getCategories();
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to edit category" + error);
      }
      })
    }
    //Close modal
    this.showDeleteModal = false;
    this.categoryToDeleteId = null;
  }

  //cancel delete
  cancelDelete(): void {
    this.showDeleteModal = false;
    this.categoryToDeleteId = null;
  }

  showMessage(message: string) {
    this.message = message;
    //Disappear after
    setTimeout(() => {
      this.message = null;
    }, 4000)
  }

}
