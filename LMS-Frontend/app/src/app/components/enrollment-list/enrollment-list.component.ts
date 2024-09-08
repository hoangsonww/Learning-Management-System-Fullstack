import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from '../../services/enrollment.service';
import { UserService } from '../../services/user.service'; // Import UserService
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

// Define an interface for Enrollment
interface Enrollment {
  _id: string;
  student: string;
  course: string;
  enrolled_at: string;
}

// Define an interface for User
interface User {
  _id: string;
  username: string;
  email: string;
  is_instructor: boolean;
  is_student: boolean;
  bio: string;
  profile_picture: string;
}

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.css']
})
export class EnrollmentListComponent implements OnInit {
  enrollments: Enrollment[] = [];
  users: User[] = []; // Array to hold user data
  errorMessage: string = '';

  constructor(private enrollmentService: EnrollmentService, private userService: UserService) {}

  ngOnInit(): void {
    // Fetch users data first
    this.userService.getUsers().subscribe(
      (usersData: User[]) => {
        this.users = usersData; // Store users data
        this.fetchEnrollments(); // Fetch enrollments after users data is fetched
      },
      (error) => {
        this.errorMessage = 'Error fetching users.';
      }
    );
  }

  fetchEnrollments(): void {
    this.enrollmentService.getEnrollments().subscribe(
      (data: Enrollment[]) => {
        // Create a mapping of user IDs to usernames
        const userMap = new Map<string, string>();
        this.users.forEach(user => userMap.set(user._id, user.username));

        // Replace student IDs with usernames
        this.enrollments = data.map((enrollment: Enrollment) => ({
          ...enrollment,
          student: userMap.get(enrollment.student) || enrollment.student, // Use the mapped username or fallback to the ID
          course: "Calculus III - Multivariable Calculus" // Replace course name as required
        }));
        this.renderChart(); // Render the chart after fetching enrollments
      },
      (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized access. Please log in.';
        } else {
          this.errorMessage = 'Error fetching enrollments.';
        }
      }
    );
  }

  // Function to render the Chart.js pie chart
  renderChart(): void {
    const ctx = document.getElementById('enrollmentChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Users', 'Courses', 'Enrollments'],
        datasets: [{
          data: [
            this.enrollments.length,
            10,
            30
          ],
          backgroundColor: ['#007bff', '#ffc107', '#28a745']
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
