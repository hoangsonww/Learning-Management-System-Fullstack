import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule if routing is used in templates

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [RouterModule], // Include RouterModule if using router-related features
})
export class FooterComponent {}
