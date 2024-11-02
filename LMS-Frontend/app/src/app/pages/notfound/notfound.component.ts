import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './notfound.component.html',
  standalone: true,
  styleUrls: ['./notfound.component.css'],
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  // Method to navigate back to the home page
  goToHome(): void {
    this.router.navigate(['/']);
  }
}
