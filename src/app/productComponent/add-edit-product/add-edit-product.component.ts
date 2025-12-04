import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Service/api.service';
import { Router } from '@angular/router';
import { Category } from '../../category/category.interface';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-edit-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.css'
})
export class AddEditProductComponent implements OnInit {
  
  productId: string | null = null;
  name: string = '';
  sku: string = '';
  price: number | null = null;
  stockQuantity: number | null = null;
  categoryId: string = '';
  description: string = '';
  expiryDate: string = '';
  imageFile: File | null = null;
  imageUrl?: string | null = null;
  isEditing: boolean = false;
  categories: Category[] = []
  message: string | null = null;
  messageType: 'success' | 'error' |'' = '';
  itemsPerPage: number = 10;
  currentPage: number = 0;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {

    this.productId = this.router.url.split('/')[2];
    this.loadCategories();
    if (this.productId) {
      this.isEditing = true;
      this.getProductById();
    }
  }

  loadCategories(): void {
    this.apiService.listAllCategories(this.currentPage, this.itemsPerPage,'').subscribe({
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

  getProductById() : void {

    this.apiService.listProductById(this.productId!).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          const product = response.product;
          this.name = product.name;
          this.sku = product.sku;
          this.price = product.price;
          this.stockQuantity = product.stockQuantity;
          this.categoryId = product.categoryId;
          this.description = product.description;
          this.expiryDate = product.expiryDate;
          if (product.id) {
            this.imageUrl = `${environment.apiUrl}/products/image/${product.id}`;
          }
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to get product by id" + error);
      }
    })
  }

  handleImageChange(event: Event) : void {

    //Get HTML element, cast it as HTMLInputElement and stock it's value
    const input = event.target as HTMLInputElement;

    //Verify if a file is selected
    if (input?.files?.[0]) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imageUrl = reader.result as string;
      }
      reader.readAsDataURL(this.imageFile);
    }
  }

  handleSubmit(event: Event) : void {

    event.preventDefault();

    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("sku", this.sku);
    formData.append("price", String(this.price));
    formData.append("stockQuantity", String(this.stockQuantity));
    formData.append("categoryId", this.categoryId);
    formData.append("description", this.description);
    if (this.expiryDate) {
      formData.append("expiryDate", this.expiryDate);
    }
    if (this.imageFile) {
      formData.append("imageFile", this.imageFile);
    }

    if (this.isEditing) {
      formData.append("productId", this.productId!);
      this.apiService.updateProduct(this.productId!, formData).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.showMessage(response.message, 'success');
            setTimeout(() => {
              this.router.navigate(['/product']);
            }, 500);
          } else {
            this.showMessage(response.message), 'error';
          }
        },
        error: (error) => {
          this.showMessage(error?.error?.message || error?.messgae || "Unable to update product" + error);
        }
      })
    } else {
      this.apiService.addProduct(formData).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.showMessage(response.message, 'success');
            setTimeout(() => {
              this.router.navigate(['/product']);
            }, 500);
          } else {
            this.showMessage(response.message, 'error');
          }
        },
        error: (error) => {
          this.showMessage(error?.error?.message || error?.messgae || "Unable to add product" + error);
        }
      })
    }
  }

  goToProductList() {
    this.router.navigate(['/product']);
  }

  onChangeClick(event: Event) : void {
    const input = event.target as HTMLInputElement;
    input.showPicker?.();
  }

  showMessage(msg: string, type: 'success' | 'error' = 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 4000)
  }

}
