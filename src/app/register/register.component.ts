import { Component } from '@angular/core';
import { ApiService } from '../Service/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  formData: any = {
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  };

  message: string | null = null;
  messageType: 'success' | 'error' |'' = '';

  constructor(private apiService: ApiService, private router: Router) {}

  async handleSubmit() {
    if (!this.formData.name ||
        !this.formData.email ||
        !this.formData.password ||
        !this.formData.phoneNumber
    ) {
      this.showMessage("All fields are required !", 'error');
      return;
    }

    try {
      const response: any = await firstValueFrom(this.apiService.registerUser(this.formData));
      if (response.status === 200) {
        this.showMessage(response.message, 'success')
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 4000);
      }
    } catch (error: any) {
      console.log(error);
      //Try to display a specific error message if one exists, otherwise another message, otherwise a generic message.
      this.showMessage(error?.error?.message || error?.messgae || "Unable to register a user" + error);
    }
  }

  showMessage(msg: string, type: 'success' | 'error' = 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 4000)
  }
 
}
