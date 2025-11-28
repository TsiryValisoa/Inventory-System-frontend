import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../pagination/pagination.component';
import { ApiService } from '../../Service/api.service';
import { Router } from '@angular/router';
import { Transaction } from './transaction.interface';

@Component({
  selector: 'app-transaction',
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit {

  transactions: Transaction[] = [];
  message: string | null = null;
  search: string = '';
  valueToSearch: string = '';
  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 10;
  messageType: 'success' | 'error' |'' = '';
  statusList: string[] = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELED'];
  searchStatus: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions() : void {

    this.apiService.listAllTransactions(this.currentPage, this.itemsPerPage, this.valueToSearch).subscribe({
      next: (response: any) => {

        if (response.totalPage === 0) {
          this.totalPages = 0;
          this.currentPage = 0;
        } else {
          this.totalPages = response.totalPage;
          this.currentPage = response.currentPage + 1;
        }

        this.transactions = response.transactions || [];
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to get all transactions" + error);
      }
    })
  }

  handleSearch() : void {
    this.currentPage = 0;
    this.valueToSearch = this.search || this.searchStatus;
    this.getTransactions();
  }

  //Navigate to transactions details
  navigateToTransactionDetails(transactionId: string) : void {
    this.router.navigate([`/transaction/${transactionId}`])
  }

   onPageChange(page: number) : void {
    this.currentPage = page - 1;
    this.getTransactions();
  }

  showMessage(msg: string, type: 'success' | 'error' = 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 4000)
  }

}
