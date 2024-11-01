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
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password1: string = '';
  password2: string = '';
  errorMessage: string = '';
  passwordError: string | null = null;
  isLoading: boolean = false; // New flag to manage loading state

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  /**
   * This function ensures the password is not purely numeric and also
   * provides error messages for form validation.
   */
  validatePassword(): void {
    const isNumeric = /^\d+$/.test(this.password1);
    if (isNumeric) {
      this.passwordError = 'Password cannot be entirely numeric.';
    } else {
      this.passwordError = null; // Reset if valid
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  register(): void {
    this.errorMessage = '';

    // Validate password match
    if (this.password1 !== this.password2) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.passwordError) {
      return;
    }

    // Set loading state to true before making the request
    this.isLoading = true;

    this.authService
      .register(this.username, this.email, this.password1, this.password2)
      .subscribe(
        () => {
          // Reset loading state on success
          this.isLoading = false;
          this.router.navigate(['/login']); // Redirect to login page after successful registration
        },
        (error) => {
          // Reset loading state on failure
          this.isLoading = false;

          // Handle and display specific error messages from the backend
          if (error.error) {
            if (error.error.username) {
              this.errorMessage = error.error.username[0]; // Display the first error message related to username
            } else if (error.error.email) {
              this.errorMessage = error.error.email[0]; // Display the first error message related to email
            } else if (error.error.password1) {
              this.errorMessage = error.error.password1[0]; // Display the first error message related to password1
            } else if (error.error.non_field_errors) {
              this.errorMessage = error.error.non_field_errors[0]; // Display general error messages
            } else {
              this.errorMessage = 'Registration failed. Please try again.';
            }
          } else {
            this.errorMessage = 'An unknown error occurred. Please try again.';
          }
        },
      );
  }
}
