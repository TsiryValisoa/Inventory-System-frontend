import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { ApiService } from './Service/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'IMS-app';

  constructor(private apiService: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  isAuth() : boolean {
    return this.apiService.isAuthenticated();
  }

  isAdmin() : boolean {
    return this.apiService.isAdmin();
  }

  logout() : void {
    this.apiService.logout();
    this.router.navigate(["/login"])
    this.cdr.detectChanges();
  }

}
