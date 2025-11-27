import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../../pagination/pagination.component';
import { ApiService } from '../../Service/api.service';
import { Router } from '@angular/router';
import { Product } from './product.interface';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { Category } from '../../category/category.interface';

@Component({
  selector: 'app-product',
  imports: [CommonModule, PaginationComponent, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  products: Product[] = [];
  message: string | null = null;
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 10;
  messageType: 'success' | 'error' |'' = '';
  showDeleteModal: boolean = false;
  productToDeleteId: string | null = null;
  searchProduct: string = '';
  categoryId: string = '';
  categories: Category[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getProducts();
    this.loadCategories();
  }

  getProducts() : void {

    const categoryIdForApi = this.categoryId === '' ? null : parseInt(this.categoryId)

    this.apiService.listAllProducts(this.searchProduct, categoryIdForApi!).subscribe({
      next: (response: any) => {

        const products = response.products || [];
        this.totalPages = Math.ceil(products.length / this.itemsPerPage);

        this.products = products.slice(
          (this.currentPage - 1) * this.itemsPerPage,
          this.currentPage * this.itemsPerPage
        ).map((p: Product) => ({
          ...p,
          imageUrl: `${environment.apiUrl}/products/image/${p.id}`
        }));
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to get all products" + error);
      }
    })
  }

  loadCategories(): void {
    this.apiService.listAllCategories('').subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.categories = response.categories;
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to load all categories" + error);
      }
    });
  }

  //Navigate to add product
  addProductComponent() : void {
    this.router.navigate(['/add-product']);
  }

  //Navigqate to edit product
  editProductComponent(productId: string) : void {
    this.router.navigate([`/edit-product/${productId}`]);
  }

  deleteProduct(productId: string) : void {
    this.productToDeleteId = productId;
    this.showDeleteModal = true;
  }

   confirmDelete(): void {

    if (this.productToDeleteId) {
      this.apiService.deleteProduct(this.productToDeleteId).subscribe({
        next: (response: any) => {
        if (response.status === 200) {
          this.showMessage(response.message, 'success');
          this.getProducts();
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to delete product" + error);
      }
      })
    }
    this.cancelDelete();
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.productToDeleteId = null;
  }

  //Navigate to next/previous page
  onPageChange(page: number) : void {
    this.currentPage = page;
    this.getProducts();
  }

  showMessage(msg: string, type: 'success' | 'error' = 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 4000)
  }

}
