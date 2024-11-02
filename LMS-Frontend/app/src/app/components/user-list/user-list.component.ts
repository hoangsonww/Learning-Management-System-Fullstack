import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  errorMessage: string = '';
  loading: boolean = true; // Added to track the loading state
  chart: Chart<'pie'> | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        this.loading = false; // Set loading to false once data is fetched
        this.renderChart();
      },
      (error) => {
        this.loading = false; // Stop loading even if there is an error
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized access. Please log in.';
        } else {
          this.errorMessage =
            'Error fetching data due to expired token. Please try registering and logging in again.';
        }
      },
    );
  }

  renderChart(): void {
    const ctx = document.getElementById('userChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    const chartConfig: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: ['Students', 'Instructors'],
        datasets: [
          {
            data: [
              this.users.filter((user) => !user.is_instructor).length,
              this.users.filter((user) => user.is_instructor).length,
            ],
            backgroundColor: ['#007bff', '#ffc107'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    };

    this.chart = new Chart(ctx, chartConfig);
  }
}
