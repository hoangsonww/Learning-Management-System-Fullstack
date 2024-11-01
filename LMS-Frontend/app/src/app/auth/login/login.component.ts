import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false; // New flag to manage loading state

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login(): void {
    // Reset error message before login attempt
    this.errorMessage = '';

    // Set loading state to true
    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe(
      () => {
        // Reset loading state on success
        this.isLoading = false;
        this.router.navigate(['/']); // Redirect to home page after successful login
      },
      (error) => {
        // Reset loading state and show error on failure
        this.isLoading = false;
        console.log(error);
        this.errorMessage =
          error.error?.detail ||
          'Invalid username or password. Please try registering first.';
      },
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
