import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BankReportService, BankSummary, BankVisitTeamMember, BankReportTeamMember, BankInvoiceDetail } from '../../core/services/bank-report.service';
import { BankService } from '../../core/services/bank.service';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-bank-wise-report',
  templateUrl: './bank-wise-report.component.html',
  styleUrls: ['./bank-wise-report.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, CardComponent, ButtonComponent],
  providers: [DatePipe]
})
export class BankWiseReportComponent implements OnInit {
  filterForm!: FormGroup;
  banks: { Bank: string }[] = [];
  branches: { Branch: string }[] = [];

  loading = false;
  submitting = false;
  loadingBranches = false;

  success = '';
  error = '';

  // Report data
  bankSummary: BankSummary | null = null;
  visitTeamStats: BankVisitTeamMember[] = [];
  reportTeamStats: BankReportTeamMember[] = [];
  cashDetails: BankInvoiceDetail[] = [];
  performaInvoiceDetails: BankInvoiceDetail[] = [];
  regularInvoiceDetails: BankInvoiceDetail[] = [];

  // Selected values for display
  selectedMonth = '';
  selectedYear = '';
  selectedBank = '';
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

  constructor(
    private formBuilder: FormBuilder,
    private bankReportService: BankReportService,
    private bankService: BankService,
    
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadBanks();
  }

  initForm(): void {
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = currentDate.getFullYear().toString();

    this.filterForm = this.formBuilder.group({
      bank: ['', [Validators.required]],
      branch: ['', [Validators.required]],
      month: [currentMonth, [Validators.required]],
      year: [currentYear, [Validators.required]]
    });

    // Watch for bank changes to load branches
    this.filterForm.get('bank')?.valueChanges.subscribe(bankValue => {
      if (bankValue) {
        this.loadBranches(bankValue);
        this.filterForm.get('branch')?.setValue(''); // Reset branch selection
        this.clearReportData(); // Clear any existing report data
      }
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

  loadBranches(bank: string): void {
    this.loadingBranches = true;
    this.branches = [];

    this.bankReportService.getBranchesByBank(bank)
      .subscribe({
        next: (response) => {
          this.loadingBranches = false;
          if (!response.error && response.message) {
            this.branches = response.message;
          } else {
            this.error = 'Failed to load branches for selected bank';
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
    this.error = '';
    this.success = '';
    this.clearReportData();

    const formValues = this.filterForm.value;
    this.selectedBank = formValues.bank;
    this.selectedBranch = formValues.branch;
    this.selectedMonth = this.getMonthName(formValues.month);
    this.selectedYear = formValues.year;

    // Calculate date range for the selected month
    // First day of the month at 00:00:00
    const fromDate = new Date(parseInt(formValues.year), parseInt(formValues.month) - 1, 1);
    fromDate.setHours(0, 0, 0, 0);

    // Last day of the month at 23:59:59
    const toDate = new Date(parseInt(formValues.year), parseInt(formValues.month), 0);
    toDate.setHours(23, 59, 59, 999);

    // Convert to ISO string format as expected by the API
    const fromDateStr = fromDate.toISOString();
    const toDateStr = toDate.toISOString();

    console.log('Date range for API calls:', {
      bank: formValues.bank,
      branch: formValues.branch,
      month: formValues.month,
      year: formValues.year,
      fromDate: fromDateStr,
      toDate: toDateStr
    });

    this.loadReportData(formValues.bank, formValues.branch, fromDateStr, toDateStr);
  }

  loadReportData(bank: string, branch: string, fromDate: string, toDate: string): void {
    this.loading = true;

    // Handle each API call separately to prevent one failure from affecting others
    this.loadBankSummary(bank, branch, fromDate, toDate);
    this.loadBankVisitTeamStats(bank, branch, fromDate, toDate);
    this.loadBankReportTeamStats(bank, branch, fromDate, toDate);
    this.loadBankCashDetails(bank, branch, fromDate, toDate);
    this.loadBankPerformaInvoiceDetails(bank, branch, fromDate, toDate);
    this.loadBankRegularInvoiceDetails(bank, branch, fromDate, toDate);

    // Set success message and finish loading after a short delay
    setTimeout(() => {
      this.loading = false;
      this.submitting = false;
      this.success = `Report generated for ${this.selectedBank} - ${this.selectedBranch} - ${this.selectedMonth} ${this.selectedYear}`;
    }, 2000);
  }

  loadBankSummary(bank: string, branch: string, fromDate: string, toDate: string): void {
    this.bankReportService.getBankSummary(bank, branch, fromDate, toDate)
      .subscribe({
        next: (response) => {
          if (!response.error && response.message && response.message.length > 0) {
            this.bankSummary = response.message[0];
          } else {
            console.warn('Bank summary API returned no data or error:', response);
          }
        },
        error: (err) => {
          console.error('Error loading bank summary:', err);
        }
      });
  }

  loadBankVisitTeamStats(bank: string, branch: string, fromDate: string, toDate: string): void {
    this.bankReportService.getBankVisitTeamStats(bank, branch, fromDate, toDate)
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.visitTeamStats = response.message;
          } else {
            console.warn('Bank visit team stats API returned no data or error:', response);
          }
        },
        error: (err) => {
          console.error('Error loading bank visit team stats:', err);
        }
      });
  }

  loadBankReportTeamStats(bank: string, branch: string, fromDate: string, toDate: string): void {
    this.bankReportService.getBankReportTeamStats(bank, branch, fromDate, toDate)
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.reportTeamStats = response.message;
          } else {
            console.warn('Bank report team stats API returned no data or error:', response);
          }
        },
        error: (err) => {
          console.error('Error loading bank report team stats:', err);
        }
      });
  }

  loadBankCashDetails(bank: string, branch: string, fromDate: string, toDate: string): void {
    this.bankReportService.getBankCashDetails(bank, branch, fromDate, toDate)
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.cashDetails = response.message;
          } else {
            console.warn('Bank cash details API returned no data or error:', response);
          }
        },
        error: (err) => {
          console.error('Error loading bank cash details:', err);
        }
      });
  }

  loadBankPerformaInvoiceDetails(bank: string, branch: string, fromDate: string, toDate: string): void {
    this.bankReportService.getBankPerformaInvoiceDetails(bank, branch, fromDate, toDate)
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.performaInvoiceDetails = response.message;
          } else {
            console.warn('Bank performa invoice details API returned no data or error:', response);
          }
        },
        error: (err) => {
          console.error('Error loading bank performa invoice details:', err);
        }
      });
  }

  loadBankRegularInvoiceDetails(bank: string, branch: string, fromDate: string, toDate: string): void {
    this.bankReportService.getBankRegularInvoiceDetails(bank, branch, fromDate, toDate)
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.regularInvoiceDetails = response.message;
          } else {
            console.warn('Bank regular invoice details API returned no data or error:', response);
          }
        },
        error: (err) => {
          console.error('Error loading bank regular invoice details:', err);
        }
      });
  }

  clearForm(): void {
    this.filterForm.reset();
    this.clearReportData();
    this.success = '';
    this.error = '';
    this.branches = [];
    this.initForm(); // Reset to current month/year
  }

  clearReportData(): void {
    this.bankSummary = null;
    this.visitTeamStats = [];
    this.reportTeamStats = [];
    this.cashDetails = [];
    this.performaInvoiceDetails = [];
    this.regularInvoiceDetails = [];
    this.selectedMonth = '';
    this.selectedYear = '';
    this.selectedBank = '';
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