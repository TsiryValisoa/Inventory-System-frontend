import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../profile/user.interface';
import { ApiService } from '../../Service/api.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.css'
})
export class UserAdminComponent {

  formData: any = {
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  };

  roleType: string[] = ['ADMIN', 'MANAGER'];

  message: string | null = null;
  messageType: 'success' | 'error' |'' = '';

  constructor(private apiService: ApiService, private router: Router) {}

  async handleSubmit() {
      if (!this.formData.name ||
          !this.formData.email ||
          !this.formData.password ||
          !this.formData.phoneNumber
      ) {
        this.showMessage("All fields are required !");
        return;
      }
  
      try {
        const response: any = await firstValueFrom(this.apiService.registerUser(this.formData));
        if (response.status === 200) {
          this.showMessage(response.message, 'success')
          this.router.navigate(["/user-list"]);
        } else {
          this.showMessage(response.message, 'error');
        }
      } catch (error: any) {
        console.log(error);
        this.showMessage(error?.error?.message || error?.messgae || "Unable to register a user" + error);
      }
    }

  returnToUserList() : void {
    this.router.navigate(["/user-list"]);
  }

  showMessage(msg: string, type: 'success' | 'error' = 'error') {
      this.message = msg;
      this.messageType = type;
      setTimeout(() => {
        this.message = null;
    }, 4000)
  }
}
