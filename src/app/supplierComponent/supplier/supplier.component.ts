import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Service/api.service';
import { Router } from '@angular/router';
import { Supplier } from './supplier.interface';

@Component({
  selector: 'app-supplier',
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css'
})
export class SupplierComponent implements OnInit{

  suppliers: Supplier[] = [];
  message: string | null = null;
  supplierToDeleteId: string | null = null;
  showDeleteModal: boolean = false;
  searchSupplier: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers() : void {

    this.apiService.listAllSuppliers(this.searchSupplier).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.suppliers = response.suppliers
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to get all suppliers" + error);
      }
    })
  }

  //Navigate to add supplier component
  navigateToAddSupplier() : void {
    this.router.navigate([`/add-supplier`]);
  }

  //Navigate to edit supplier component
  navigateToEditSupplier(supplierId: string) : void {
    this.router.navigate([`/edit-supplier/${supplierId}`]);
  }

  deleteSupplier(supplierId: string) : void {
    this.supplierToDeleteId = supplierId;
    this.showDeleteModal = true;
  }

  confirmDelete() : void {
    
    if (this.supplierToDeleteId) {
      this.apiService.deleteSupplier(this.supplierToDeleteId).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showMessage(response.message);
          this.getSuppliers();
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to delete supplier" + error);
      }
    })
    }
    this.cancelDelete();
  }

  cancelDelete() : void {
    this.showDeleteModal = false;
    this.supplierToDeleteId = null;
  }

  showMessage(message: string) {
    this.message = message;
    //Disappear after
    setTimeout(() => {
      this.message = null;
    }, 4000)
  }

}
