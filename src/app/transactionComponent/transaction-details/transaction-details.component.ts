import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Service/api.service';
import { Router } from '@angular/router';
import { Transaction } from '../transaction/transaction.interface';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-transaction-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-details.component.html',
  styleUrl: './transaction-details.component.css'
})
export class TransactionDetailsComponent implements OnInit {

  transaction: Transaction | null = null;
  transactionId: string | null = '';
  status: string = '';
  message: string | null = '';
  messageType: 'success' | 'error' |'' = '';
  isEditing: boolean = false;
  imageUrl?: string | null = null;
  statusList: string[] = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELED'];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.transactionId = this.router.url.split('/')[2];
    if (this.transactionId) {
      this.isEditing = true;
      this.getTransactionById();
    }
  }

  getTransactionById() : void {

    this.apiService.listTransactionById(this.transactionId!).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.transaction = response.transaction;
          this.status = this.transaction?.status || '';;
          this.imageUrl = `${environment.apiUrl}/products/image/${this.transaction?.product.id}`;
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to get transaction by id" + error);
      }
    });
  }

  updateTransaction() : void {

    this.apiService.updateTransaction(this.transactionId!, this.status).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showMessage(response.message, 'success');
          setTimeout(() => {
              this.router.navigate(['/transaction'])
            }, 500);
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to update transction status" + error);
      }
    });
  }

  goToTransaxtionList() : void {
    this.router.navigate(['/transaction']);
  }

  showMessage(msg: string, type: 'success' | 'error' = 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 4000)
  }

}
