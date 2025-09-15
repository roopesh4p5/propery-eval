import { Component, OnInit } from '@angular/core';
import { ManagerDashboardService, ManagerDashboardData } from '../../core/services/manager-dashboard.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, CardComponent]
})
export class ManagerDashboardComponent implements OnInit {
  dashboardData?: ManagerDashboardData;
  loading = true;
  error = '';

  constructor(private dashboardService: ManagerDashboardService) {}

  ngOnInit(): void {
    // Replace 127 with dynamic manager ID as needed
    this.dashboardService.getDashboardInfo(127).subscribe({
      next: (res) => {
        // API response: { error: boolean, message: ManagerDashboardData[] }
        if (res && !res.error && Array.isArray(res.message) && res.message.length > 0) {
          this.dashboardData = res.message[0];
        } else {
          this.error = 'No data found.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard.';
        this.loading = false;
      }
    });
  }
}
