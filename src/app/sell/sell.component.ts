import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../Service/api.service';
import { Product } from '../productComponent/product/product.interface';

@Component({
  selector: 'app-sell',
  imports: [CommonModule, FormsModule],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css'
})
export class SellComponent implements OnInit {

  products: Product[] = [];
  productId: string = '';
  categoryId: string = '';
  search: string = '';
  quantity: string = '';
  description: string = '';
  message: string | null = null;
  messageType: 'success' | 'error' |'' = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() : void {

    //Products
    const categoryIdForApi = this.categoryId === '' ? null : parseInt(this.categoryId)

    this.apiService.listAllProducts(this.search, categoryIdForApi!).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.products = response.products;
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to load all products" + error);
      }
    });
  }

  handleSubmit() : void {

    if (!this.productId || !this.description) {
      this.showMessage("All fields are required !", 'error');
      return;
    }

    const payload = {
      productId: this.productId,
      quantity: this.quantity,
      description: this.description
    };

    this.apiService.sellProduct(payload).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showMessage(response.message, 'success');
          this.resetForm();
          //TODO: redirect to transaction
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to sell a product" + error);
      }
    });
  }

  resetForm() : void {
    this.productId = '';
    this.description = '';
    this.quantity = '';
  }

  showMessage(msg: string, type: 'success' | 'error' = 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 4000)
  }

}
