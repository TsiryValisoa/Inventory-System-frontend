import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../pagination/pagination.component';
import { ApiService } from '../Service/api.service';
import { Router } from '@angular/router';
import { User } from '../profileComponent/profile/user.interface';

@Component({
  selector: 'app-archive',
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.css'
})
export class ArchiveComponent implements OnInit {

  users: User[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 10;
  valueToSearch: string = '';
  messageType: 'success' | 'error' |'' = '';
  message: string | null = null;
  searchStatus: string = '';
  search: string = '';
  statusList: string[] = ['ADMIN', 'MANAGER'];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.listDisableUser();
  }

  listDisableUser() : void {
    this.apiService.listAllDisableUsers(this.currentPage, this.itemsPerPage, this.valueToSearch).subscribe({
      next: (response: any) => {

        if (response.totalPage === 0) {
          this.totalPages = 0;
          this.currentPage = 0;
        } else {
          this.totalPages = response.totalPage;
          this.currentPage = response.currentPage + 1;
        }

        this.users = response.users;
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to get all disabled users" + error);
      }
    })
  }

  enableUser(userId: string) : void {

    this.apiService.enableUser(userId).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showMessage(response.message, 'success');
          this.handleSearch();
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to enable user" + error);
      }
    });
  }

  handleSearch() : void {
    this.currentPage = 0;
    this.valueToSearch = this.search || this.searchStatus;
    this.listDisableUser();
  }

  onPageChange(page: number) : void {
    this.currentPage = page - 1;
    this.listDisableUser();
  }

   showMessage(msg: string, type: 'success' | 'error' = 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 4000)
  }

}
