import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReportService, BranchReport } from '../../core/services/report.service';
import { BankService, Branch } from '../../core/services/bank.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-branch-report',
  templateUrl: './branch-report.component.html',
  styleUrls: ['./branch-report.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    AlertComponent,
  ]
})
export class BranchReportComponent implements OnInit {
  reportForm!: FormGroup;
  branchReports: BranchReport[] = [];
  branches: Branch[] = [];
  loading = false;
  submitting = false;
  success = '';
  error = '';

  // Date formatting
  today = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private bankService: BankService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadBranches();
  }

  initForm(): void {
    // Initialize form with empty values
    this.reportForm = this.formBuilder.group({
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]]
    });
  }

  loadBranches(): void {
    this.bankService.getBranches()
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.branches = response.message;
          } else {
            this.error = 'Failed to load branches';
          }
        },
        error: (err) => {
          console.error('Error loading branches:', err);
          this.error = 'Error loading branches';
        }
      });
  }

  onSubmit(): void {
    if (this.reportForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.reportForm.controls).forEach(key => {
        const control = this.reportForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';
    this.branchReports = [];

    const formValues = this.reportForm.value;
    const branch = 'ALL'; // Always use 'ALL' for branch

    this.reportService.getBranchReport(branch, formValues.fromDate, formValues.toDate)
      .pipe(
        finalize(() => this.submitting = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.branchReports = response.message;
            this.success = 'Report generated successfully';
          } else {
            this.error = 'Failed to generate report';
          }
        },
        error: (err) => {
          console.error('Error generating report:', err);
          this.error = 'Error generating report';
        }
      });
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

  clearForm(): void {
    this.reportForm.reset({
      fromDate: null,
      toDate: null
    });
  }

  get f() { return this.reportForm.controls; }
}
