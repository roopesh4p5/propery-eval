import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReportService, MonthlyReport } from '../../core/services/report.service';
import { BankService, Bank } from '../../core/services/bank.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-monthly-reports',
  templateUrl: './monthly-reports.component.html',
  styleUrls: ['./monthly-reports.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    AlertComponent
  ]
})
export class MonthlyReportsComponent implements OnInit {
  dateForm!: FormGroup;
  bankForm!: FormGroup;
  branchForm!: FormGroup;

  monthlyReports: MonthlyReport[] = [];
  banks: Bank[] = [];
  branches: { BID: number; Branch: string }[] = [];

  loading = false;
  submitting = {
    dateForm: false,
    bankForm: false,
    branchForm: false
  };

  success = '';
  error = '';

  activeForm = 'dateForm'; // Track which form's results are being displayed

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private bankService: BankService
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadBanks();
  }

  initForms(): void {
    // Initialize forms with empty values

    // Date Form
    this.dateForm = this.formBuilder.group({
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]]
    });

    // Bank Form
    this.bankForm = this.formBuilder.group({
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      bank: ['', [Validators.required]]
    });

    // Branch Form
    this.branchForm = this.formBuilder.group({
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      bank: ['', [Validators.required]],
      branch: ['', [Validators.required]]
    });
  }

  loadBanks(): void {
    this.bankService.getBanks()
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.banks = response.message;
          } else {
            this.error = 'Failed to load banks';
          }
        },
        error: (err) => {
          console.error('Error loading banks:', err);
          this.error = 'Error loading banks';
        }
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

  onDateFormSubmit(): void {
    if (this.dateForm.invalid) {
      this.markFormGroupTouched(this.dateForm);
      return;
    }

    this.submitting.dateForm = true;
    this.error = '';
    this.success = '';
    this.monthlyReports = [];
    this.activeForm = 'dateForm';

    const formValues = this.dateForm.value;
    const fromDate = this.formatDateForApi(formValues.fromDate);
    const toDate = this.formatDateForApi(formValues.toDate);

    this.reportService.getMonthlyReportByDate(fromDate, toDate)
      .pipe(
        finalize(() => this.submitting.dateForm = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.monthlyReports = response.message;
            this.totalItems = this.monthlyReports.length;
            this.currentPage = 1; // Reset to first page
            this.success = 'Report generated successfully';
            this.scrollToTable();
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

  onBankFormSubmit(): void {
    if (this.bankForm.invalid) {
      this.markFormGroupTouched(this.bankForm);
      return;
    }

    this.submitting.bankForm = true;
    this.error = '';
    this.success = '';
    this.monthlyReports = [];
    this.activeForm = 'bankForm';

    const formValues = this.bankForm.value;
    const fromDate = this.formatDateForApi(formValues.fromDate);
    const toDate = this.formatDateForApi(formValues.toDate);
    const bank = formValues.bank;

    this.reportService.getMonthlyReportByDateAndBank(fromDate, toDate, bank)
      .pipe(
        finalize(() => this.submitting.bankForm = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.monthlyReports = response.message;
            this.totalItems = this.monthlyReports.length;
            this.currentPage = 1; // Reset to first page
            this.success = 'Report generated successfully';
            this.scrollToTable();
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

  onBranchFormSubmit(): void {
    if (this.branchForm.invalid) {
      this.markFormGroupTouched(this.branchForm);
      return;
    }

    this.submitting.branchForm = true;
    this.error = '';
    this.success = '';
    this.monthlyReports = [];
    this.activeForm = 'branchForm';

    const formValues = this.branchForm.value;
    const fromDate = this.formatDateForApi(formValues.fromDate);
    const toDate = this.formatDateForApi(formValues.toDate);
    const bank = formValues.bank;
    const branch = formValues.branch;

    this.reportService.getMonthlyReportByDateBankAndBranch(fromDate, toDate, bank, branch)
      .pipe(
        finalize(() => this.submitting.branchForm = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.monthlyReports = response.message;
            this.totalItems = this.monthlyReports.length;
            this.currentPage = 1; // Reset to first page
            this.success = 'Report generated successfully';
            this.scrollToTable();
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

  clearDateForm(): void {
    this.dateForm.reset({
      fromDate: '',
      toDate: ''
    });
  }

  clearBankForm(): void {
    this.bankForm.reset({
      fromDate: '',
      toDate: '',
      bank: ''
    });
  }

  clearBranchForm(): void {
    this.branchForm.reset({
      fromDate: '',
      toDate: '',
      bank: '',
      branch: ''
    });
  }

  // Helper method to mark all fields as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Helper method to format date for API (YYYY-MM-DD)
  formatDateForApi(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  // Helper method to format date for input field (YYYY-MM-DD)
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper method to format date for display (DD/MM/YYYY)
  formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Helper method to scroll to the table area
  scrollToTable(): void {
    setTimeout(() => {
      const tableElement = document.querySelector('.report-table-container');
      if (tableElement) {
        tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get paginatedReports(): MonthlyReport[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.monthlyReports.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    const maxVisiblePages = 5; // Show at most 5 page numbers at a time
    const currentPage = this.currentPage;
    const totalPages = this.totalPages;

    if (totalPages <= maxVisiblePages) {
      // If we have fewer pages than the max, show all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate the range of pages to show
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = startPage + maxVisiblePages - 1;

    // Adjust if we're near the end
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  // Helper method to check if we should show first page button
  get showFirstPage(): boolean {
    return this.currentPage > 3;
  }

  // Helper method to check if we should show last page button
  get showLastPage(): boolean {
    return this.currentPage < this.totalPages - 2;
  }

  get d() { return this.dateForm.controls; }
  get b() { return this.bankForm.controls; }
  get br() { return this.branchForm.controls; }
}
