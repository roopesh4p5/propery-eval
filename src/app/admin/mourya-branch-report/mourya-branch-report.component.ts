import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { MouryaBranchReportService, MouryaBranchSummary, Branch } from '../../core/services/mourya-branch-report.service';

@Component({
  selector: 'app-mourya-branch-report',
  templateUrl: './mourya-branch-report.component.html',
  styleUrls: ['./mourya-branch-report.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, CardComponent, ButtonComponent]
})
export class MouryaBranchReportComponent implements OnInit {
  filterForm!: FormGroup;
  branches: Branch[] = [];
  reportSummary: MouryaBranchSummary | null = null;

  loading = false;
  submitting = false;
  loadingBranches = false;

  success = '';
  error = '';

  // Selected values for display
  selectedBranch = '';
  selectedDateRange = '';

  constructor(
    private formBuilder: FormBuilder,
    private mouryaBranchReportService: MouryaBranchReportService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadBranches();
  }

  initForm(): void {
    // Set default date range to current month
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.filterForm = this.formBuilder.group({
      fromDate: [this.formatDateForInput(firstDayOfMonth), [Validators.required]],
      toDate: [this.formatDateForInput(lastDayOfMonth), [Validators.required]],
      branch: ['ALL', [Validators.required]]
    });
  }

  loadBranches(): void {
    this.loadingBranches = true;
    this.mouryaBranchReportService.getBranches()
      .subscribe({
        next: (response) => {
          this.loadingBranches = false;
          if (!response.error && response.message) {
            // Add "ALL" option at the beginning
            this.branches = [
              { BID: 0, Branch: 'ALL' },
              ...response.message
            ];
          } else {
            this.error = 'Failed to load branches';
          }
        },
        error: (err) => {
          this.loadingBranches = false;
          console.error('Error loading branches:', err);
          this.error = 'Error loading branches';
        }
      });
  }

  onSubmit(): void {
    if (this.filterForm.invalid) {
      this.markFormGroupTouched(this.filterForm);
      return;
    }

    this.submitting = true;
    this.loading = true;
    this.error = '';
    this.success = '';
    this.reportSummary = null;

    const formValues = this.filterForm.value;
    this.selectedBranch = formValues.branch;
    this.selectedDateRange = `${this.formatDateForDisplay(formValues.fromDate)} to ${this.formatDateForDisplay(formValues.toDate)}`;

    this.mouryaBranchReportService.getBranchReport(
      formValues.branch,
      formValues.fromDate,
      formValues.toDate
    ).subscribe({
      next: (response) => {
        this.loading = false;
        this.submitting = false;
        if (!response.error && response.message && response.message.length > 0) {
          this.reportSummary = response.message[0];
          this.success = `Report generated for ${this.selectedBranch} branch (${this.selectedDateRange})`;
        } else {
          this.error = 'No report data found for the selected criteria';
        }
      },
      error: (err) => {
        this.loading = false;
        this.submitting = false;
        console.error('Error loading branch report:', err);
        this.error = 'Error loading branch report';
      }
    });
  }

  clearForm(): void {
    this.filterForm.reset();
    this.reportSummary = null;
    this.success = '';
    this.error = '';
    this.selectedBranch = '';
    this.selectedDateRange = '';
    this.initForm();
  }

  // Helper method to format date for input (YYYY-MM-DD)
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper method to format date for display (DD/MM/YYYY)
  formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Helper method to mark all fields as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get f() { return this.filterForm.controls; }
}
