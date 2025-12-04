import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-supplier',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-supplier.component.html',
  styleUrl: './add-edit-supplier.component.css'
})
export class AddEditSupplierComponent implements OnInit {

  message: string | null = null;
  isEditing: boolean = false;
  supplierId: string | null = null;
  messageType: 'success' | 'error' |'' = '';

  formData: any = {
    name: '',
    address: ''
  }

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {

    //Extracting supplier id from url
    this.supplierId = this.router.url.split('/')[2];

    if (this.supplierId) {
      this.isEditing = true;
      this.getSupplierById();
    }
  }

  getSupplierById() : void {

    this.apiService.listSupplierById(this.supplierId!).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.formData = {
            name: response.supplier.name,
            address: response.supplier.address
          };
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to get supplier by id" + error);
      }
    })
  }

  //Handle submission form
  handleSubmit() {

    if (!this.formData.name || !this.formData.address) {
      this.showMessage("All fields are required !");
      return;
    }

    //Data for submission
    const supplierData = {
      name: this.formData.name,
      address: this.formData.address
    };

    if (this.isEditing) {

      this.apiService.updateSupplier(this.supplierId!, supplierData).subscribe({
        next: (reponse: any) => {
          if (reponse.status === 200) {
            this.showMessage(reponse.message, 'success');
            setTimeout(() => {
              this.router.navigate(['/supplier']);
            }, 500);
          } else {
            this.showMessage(reponse.message, 'error')
          }
        },
        error: (error) => {
          this.showMessage(error?.error?.message || error?.messgae || "Unable to edit supplier" + error);
        }
      })
    } else {
      this.apiService.addSupplier(this.formData).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.showMessage(response.message, 'success');
            setTimeout(() => {
              this.router.navigate(['/supplier']);
            }, 500);
          } else {
            this.showMessage(response.message, 'error')
          }
        },
        error: (error) => {
          this.showMessage(error?.error?.message || error?.messgae || "Unable to add supplier" + error);
        }
      })
    }
  }

  goToSupplierList() {
    this.router.navigate(['/supplier']);
  }

   showMessage(msg: string, type: 'success' | 'error' = 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 4000)
  }

}
