import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password1: string = '';
  password2: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.authService.register(this.username, this.email, this.password1, this.password2).subscribe(
      () => {
        this.router.navigate(['/login']); // Redirect to login page after successful registration
      },
      (error) => {
        this.errorMessage = error.error?.detail || 'Registration failed';
      }
    );
  }
}
