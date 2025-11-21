import { Component } from '@angular/core';
import { ApiService } from '../Service/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formData: any = {
    email: '',
    password: ''
  };

  message: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  async handleSubmit() {
    if (!this.formData.email ||
        !this.formData.password
    ) {
      this.showMessage("All fields are required !");
      return;
    }

    try {
      const response: any = await firstValueFrom(this.apiService.loginUser(this.formData));
      if (response.status === 200) {
        this.apiService.encryptAndSaveToStorage('token', response.token);
        this.apiService.encryptAndSaveToStorage('role', response.role);
        this.router.navigate(["/dashboard"]);
      }
    } catch (error: any) {
      console.log(error);
      //Try to display a specific error message if one exists, otherwise another message, otherwise a generic message.
      this.showMessage(error?.error?.message || error?.messgae || "Unable to log in as a user" + error);
    }
  }

  showMessage(message: string) {
    this.message = message;
    //Disappear after
    setTimeout(() => {
      this.message = null;
    }, 4000)
  }

}
