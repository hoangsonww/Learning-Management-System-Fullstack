import { Component, OnInit } from '@angular/core';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-progress-list',
  standalone: true,
  templateUrl: './progress-list.component.html',
  styleUrls: ['./progress-list.component.css']
})
export class ProgressListComponent implements OnInit {
  progressRecords: any[] = [];
  errorMessage: string = '';

  constructor(private progressService: ProgressService) {}

  ngOnInit(): void {
    this.progressService.getProgress().subscribe(
      (data) => {
        this.progressRecords = data;
      },
      (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized access. Please log in.';
        } else {
          this.errorMessage = 'Error fetching progress records.';
        }
      }
    );
  }
}
