import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule if routing is used in templates

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule], // Include RouterModule if using router-related features
  templateUrl: './home.component.html'
})
export class HomeComponent {}
