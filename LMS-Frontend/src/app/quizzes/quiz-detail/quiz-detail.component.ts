import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../core/services/quiz.service';
import { Quiz } from '../../core/models/quiz.model';

@Component({
  selector: 'app-quiz-detail',
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.css'],
})
export class QuizDetailComponent implements OnInit {
  quiz!: Quiz;

  constructor(private route: ActivatedRoute, private quizService: QuizService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadQuiz(id);
    }
  }

  loadQuiz(id: string): void {
    this.quizService.getQuiz(id).subscribe(
      (data) => {
        this.quiz = data;
      },
      (error) => {
        console.error('Error fetching quiz:', error);
      }
    );
  }
}
