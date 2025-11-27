import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../Service/api.service';
import { Product } from '../productComponent/product/product.interface';
import { Supplier } from '../supplierComponent/supplier/supplier.interface';

@Component({
  selector: 'app-purchase',
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchaseComponent implements OnInit {

  products: Product[] = [];
  suppliers: Supplier[] = [];
  message: string | null = null;
  categoryId: string = '';
  search: string = '';
  messageType: 'success' | 'error' |'' = '';

  formData: any = {
    productId: '',
    quantity: '',
    supplierId: '',
    description: ''
  }

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getProductsAndSuppliers();
  }

  getProductsAndSuppliers() : void {

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

    //Suppliers
    this.apiService.listAllSuppliers(this.search).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.suppliers = response.suppliers;
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to load all suppliers" + error);
      }
    });
  }

  handleSubmit() : void {

    if (!this.formData.productId || !this.formData.supplierId || !this.formData.description) {
      this.showMessage("All fields are required !", 'error');
      return;
    }

    const payload = {
      productId: Number(this.formData.productId),
      supplierId: Number(this.formData.supplierId),
      quantity: Number(this.formData.quantity),
      description: this.formData.description
    };

    this.apiService.purchaseProduct(payload).subscribe({
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
        this.showMessage(error?.error?.message || error?.messgae || "Unable to restrock inventory" + error);
      }
    });
  }

  resetForm() : void {
    this.formData.productId = '';
    this.formData.supplierId = '';
    this.formData.description = '';
    this.formData.quantity = '';
  }

  showMessage(msg: string, type: 'success' | 'error' = 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 4000)
  }

}
