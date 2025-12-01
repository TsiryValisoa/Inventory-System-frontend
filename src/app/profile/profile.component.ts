import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from './user.interface';
import { ApiService } from '../Service/api.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user: User | null = null;
  message: string | null = null;
  messageType: 'success' | 'error' |'' = '';
  userId: string | null = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo() : void {

    this.apiService.getLoggedInUserInfo().subscribe({
      next: (response: any) => {
        this.user = response;

        //Extract user Id
        if (this.user && this.user.id) {
          this.userId = String(this.user.id);
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.messgae || "Unable to get logged user" + error);
      }
    });
  }

  updateUserInfo() : void {

    this.apiService.updateUser(this.userId!, this.user).subscribe({
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

  showMessage(msg: string, type: 'success' | 'error' = 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 4000)
  }

}
