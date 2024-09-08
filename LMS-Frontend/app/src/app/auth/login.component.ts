import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router'; // Import RouterModule
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Include RouterModule
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        localStorage.setItem('token', response.key);
        this.router.navigate(['/courses']);
      },
      (error) => {
        this.errorMessage = 'Invalid username or password';
      }
    );
  }
}
