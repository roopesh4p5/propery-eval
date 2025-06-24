import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../shared/components/card/card.component';
import { DashboardService, DashboardData } from '../core/services/dashboard.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, CardComponent]
})
export class DashboardComponent implements OnInit {
  isAdmin = false;
  isManager = false;
  loading = true;
  dashboardData: DashboardData | null = null;
  error = '';

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isManager = this.authService.isManager();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.dashboardService.getDashboardData()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error && response.message && response.message.length > 0) {
            this.dashboardData = response.message[0];
          } else {
            this.error = 'Failed to load dashboard data';
          }
        },
        error: (err) => {
          console.error('Dashboard data error:', err);
          this.error = 'Error loading dashboard data';
        }
      });
  }
}
