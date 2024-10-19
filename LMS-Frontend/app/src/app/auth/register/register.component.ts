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
  passwordError: string | null = null;
  isLoading: boolean = false;  // New flag to manage loading state

  constructor(private authService: AuthService, private router: Router) {}

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

  register(): void {
    this.errorMessage = '';
    if (this.password1 !== this.password2) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.passwordError) {
      return;
    }

    // Set loading state to true before making the request
    this.isLoading = true;

    this.authService.register(this.username, this.email, this.password1, this.password2).subscribe(
      () => {
        // Reset loading state on success
        this.isLoading = false;
        this.router.navigate(['/login']); // Redirect to login page after successful registration
      },
      (error) => {
        // Reset loading state and show error on failure
        this.isLoading = false;
        this.errorMessage = error.error?.detail || 'Registration failed. Please try again.';
      }
    );
  }
}
