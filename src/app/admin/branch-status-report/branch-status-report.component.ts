import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BranchReportService, BranchSummary, VisitTeamMember, ReportTeamMember, InvoiceDetail } from '../../core/services/branch-report.service';
import { BankService } from '../../core/services/bank.service';
import { finalize, forkJoin } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-branch-status-report',
  templateUrl: './branch-status-report.component.html',
  styleUrls: ['./branch-status-report.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, CardComponent, ButtonComponent],
  providers: [DatePipe]
})
export class BranchStatusReportComponent implements OnInit {
  filterForm!: FormGroup;
  branches: { BID: number; Branch: string }[] = [];

  loading = false;
  submitting = false;

  success = '';
  error = '';

  // Report data
  branchSummary: BranchSummary | null = null;
  visitTeamStats: VisitTeamMember[] = [];
  reportTeamStats: ReportTeamMember[] = [];
  cashDetails: InvoiceDetail[] = [];
  performaInvoiceDetails: InvoiceDetail[] = [];
  regularInvoiceDetails: InvoiceDetail[] = [];

  // Selected month and year for display
  selectedMonth = '';
  selectedYear = '';
  selectedBranch = '';

  // Available months for dropdown
  months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Available years for dropdown
  years = [
    { value: '2020', label: '2020' },
    { value: '2021', label: '2021' },
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' },
    { value: '2028', label: '2028' },
    { value: '2029', label: '2029' },
    { value: '2030', label: '2030' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private branchReportService: BranchReportService,
    private bankService: BankService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadBranches();
  }

  initForm(): void {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;

    this.filterForm = this.formBuilder.group({
      branch: ['', [Validators.required]],
      monthYear: [currentMonth, [Validators.required]]
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
    if (this.filterForm.invalid) {
      this.markFormGroupTouched(this.filterForm);
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';
    this.clearReportData();

    const formValues = this.filterForm.value;
    this.selectedBranch = formValues.branch;

    // Parse the month-year value (format: "2024-09")
    const [year, month] = formValues.monthYear.split('-');
    this.selectedMonth = this.getMonthName(month);
    this.selectedYear = year;

    // Calculate date range for the selected month
    // First day of the month at 00:00:00
    const fromDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    fromDate.setHours(0, 0, 0, 0);

    // Last day of the month at 23:59:59
    const toDate = new Date(parseInt(year), parseInt(month), 0);
    toDate.setHours(23, 59, 59, 999);

    // Convert to ISO string format as expected by the API
    const fromDateStr = fromDate.toISOString();
    const toDateStr = toDate.toISOString();

    console.log('Date range for API calls:', {
      branch: formValues.branch,
      fromDate: fromDateStr,
      toDate: toDateStr
    });

    this.loadReportData(formValues.branch, fromDateStr, toDateStr);
  }

  loadReportData(branch: string, fromDate: string, toDate: string): void {
    this.loading = true;

    // Handle each API call separately to prevent one failure from affecting others
    this.loadBranchSummary(branch, fromDate, toDate);
    this.loadVisitTeamStats(branch, fromDate, toDate);
    this.loadReportTeamStats(branch, fromDate, toDate);
    this.loadCashDetails(branch, fromDate, toDate);
    this.loadPerformaInvoiceDetails(branch, fromDate, toDate);
    this.loadRegularInvoiceDetails(branch, fromDate, toDate);

    // Set success message and finish loading after a short delay
    setTimeout(() => {
      this.loading = false;
      this.submitting = false;
      this.success = `Report generated for ${this.selectedBranch} - ${this.selectedMonth} ${this.selectedYear}`;
    }, 2000);
  }

  loadBranchSummary(branch: string, fromDate: string, toDate: string): void {
    this.branchReportService.getBranchSummary(branch, fromDate, toDate)
      .subscribe({
        next: (response) => {
          if (!response.error && response.message && response.message.length > 0) {
            this.branchSummary = response.message[0];
          } else {
            console.warn('Branch summary API returned no data or error:', response);
          }
        },
        error: (err) => {
          console.error('Error loading branch summary:', err);
        }
      });
  }

  loadVisitTeamStats(branch: string, fromDate: string, toDate: string): void {
    this.branchReportService.getVisitTeamStats(branch, fromDate, toDate)
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.visitTeamStats = response.message;
          } else {
            console.warn('Visit team stats API returned no data or error:', response);
          }
        },
        error: (err) => {
          console.error('Error loading visit team stats:', err);
        }
      });
  }

  loadReportTeamStats(branch: string, fromDate: string, toDate: string): void {
    this.branchReportService.getReportTeamStats(branch, fromDate, toDate)
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.reportTeamStats = response.message;
          } else {
            console.warn('Report team stats API returned no data or error:', response);
          }
        },
        error: (err) => {
          console.error('Error loading report team stats:', err);
        }
      });
  }

  loadCashDetails(branch: string, fromDate: string, toDate: string): void {
    this.branchReportService.getCashDetails(branch, fromDate, toDate)
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.cashDetails = response.message;
          } else {
            console.warn('Cash details API returned no data or error:', response);
          }
        },
        error: (err) => {
          console.error('Error loading cash details:', err);
        }
      });
  }

  loadPerformaInvoiceDetails(branch: string, fromDate: string, toDate: string): void {
    this.branchReportService.getPerformaInvoiceDetails(branch, fromDate, toDate)
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.performaInvoiceDetails = response.message;
          } else {
            console.warn('Performa invoice details API returned no data or error:', response);
          }
        },
        error: (err) => {
          console.error('Error loading performa invoice details:', err);
        }
      });
  }

  loadRegularInvoiceDetails(branch: string, fromDate: string, toDate: string): void {
    this.branchReportService.getRegularInvoiceDetails(branch, fromDate, toDate)
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.regularInvoiceDetails = response.message;
          } else {
            console.warn('Regular invoice details API returned no data or error:', response);
          }
        },
        error: (err) => {
          console.error('Error loading regular invoice details:', err);
        }
      });
  }

  clearForm(): void {
    this.filterForm.reset();
    this.clearReportData();
    this.success = '';
    this.error = '';
    this.initForm(); // Reset to current month/year
  }

  clearReportData(): void {
    this.branchSummary = null;
    this.visitTeamStats = [];
    this.reportTeamStats = [];
    this.cashDetails = [];
    this.performaInvoiceDetails = [];
    this.regularInvoiceDetails = [];
    this.selectedMonth = '';
    this.selectedYear = '';
    this.selectedBranch = '';
  }

  // Helper method to mark all fields as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Helper method to get month name from month number
  getMonthName(monthNumber: string): string {
    const month = this.months.find(m => m.value === monthNumber);
    return month ? month.label : '';
  }

  get f() { return this.filterForm.controls; }
}
