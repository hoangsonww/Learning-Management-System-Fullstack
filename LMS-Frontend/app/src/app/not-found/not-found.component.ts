import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule if routing is used in templates

@Component({
  selector: 'app-not-found',
  standalone: true,
  templateUrl: './not-found.component.html',
  imports: [RouterModule], // Include RouterModule if using router-related features
})
export class NotFoundComponent {}
