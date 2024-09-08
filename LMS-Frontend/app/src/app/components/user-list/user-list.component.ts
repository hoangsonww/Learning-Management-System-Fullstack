import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common'; // Import CommonModule
import Chart from 'chart.js/auto'; // Import Chart.js

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule], // Add CommonModule to imports
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  errorMessage: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        this.renderChart(); // Render the chart after fetching users
      },
      (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized access. Please log in.';
        } else {
          this.errorMessage = 'Error fetching users.';
        }
      }
    );
  }

  // Function to render the Chart.js pie chart
  renderChart(): void {
    const ctx = document.getElementById('userChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Students', 'Instructors'],
        datasets: [{
          data: [
            this.users.filter(user => !user.is_instructor).length,
            this.users.filter(user => user.is_instructor).length
          ],
          backgroundColor: ['#007bff', '#ffc107']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}
