import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Service/api.service';
import { User } from '../profile/user.interface';
import { PaginationComponent } from '../../pagination/pagination.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {

  users: User[] = [];
  message: string | null = null;
  userId: string = '';
  showDeleteModal: boolean = false;
  userToDeleteId: string | null = null;
  messageType: 'success' | 'error' |'' = '';
  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 15;
  valueToSearch: string = '';
  search: string = '';
  searchStatus: string = '';
  statusList: string[] = ['ADMIN', 'MANAGER'];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() : void {

    this.apiService.getAllUser(this.currentPage, this.itemsPerPage, this.valueToSearch).subscribe({
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
        this.showMessage(error?.error?.message || error?.messgae || "Unable to get all users" + error);
      }
    }); 
  }

  disableUser(userId: string) : void {

    console.log("User ID:", userId);
    this.apiService.disableUser(userId).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showMessage(response.message, 'success');
          this.handleSearch();
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to disable user" + error);
      }
    });
  }

  deleteUser(userId: string) : void {
    this.userToDeleteId = userId;
    this.showDeleteModal = true;
  }

  confirmDelete() : void {

    if (this.userToDeleteId) {
      this.apiService.deleteUser(this.userToDeleteId).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.showMessage(response.message, 'success');
            this.handleSearch();
          } else {
            this.showMessage(response.message, 'error');
          }
        },
        error: (error) => {
          this.showMessage(error?.error?.message || error?.messgae || "Unable to delete user" + error);
        }
      })
    }
    this.cancelDelete();
  }

  updateUserInfo() : void {
  
    this.apiService.updateUser(this.userId!, this.users).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showMessage(response.message, 'success');
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to update user" + error);
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.userToDeleteId = null;
  }

  handleSearch() : void {
    this.currentPage = 0;
    this.valueToSearch = this.search || this.searchStatus;
    this.getAllUsers();
  }

  navigateToAddNewAdmin() : void {
    this.router.navigate(['/user-admin'])
  }

  onPageChange(page: number) : void {
    this.currentPage = page - 1;
    this.getAllUsers();
  }

  showMessage(msg: string, type: 'success' | 'error' = 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 4000)
  }

}
