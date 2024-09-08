import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.authService.register(this.username, this.password, this.email).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      (error: any) => {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}
