import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription = new Subscription();
  private loggedInStatus: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Start with an immediate check, then every 2 seconds
    this.authSubscription = interval(2000)
      .pipe(
        startWith(0), // Immediately triggers the first emission
        switchMap(() => this.authService.isTokenValid()), // Check token validity
      )
      .subscribe((isValid) => {
        this.loggedInStatus = isValid;
      });
  }

  isLoggedIn(): boolean {
    return this.loggedInStatus;
  }

  logout(): void {
    this.authService.logout();
    this.loggedInStatus = false; // Update immediately on logout
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
