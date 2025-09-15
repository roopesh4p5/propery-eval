import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ManagerService } from '../services/manager.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';

interface BankStatusData {
  NoOfInitiations: number;
  VisitDoneCount: number;
  VisitPendingCount: number;
  ReportDoneCount: number;
  ReportPendingCount: number;
  ReportSentCount: number;
}

interface Bank {
  Bank: string;
}

@Component({
  selector: 'app-bank-wise-status-count',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent
  ],
  templateUrl: './bank-wise-status-count.component.html',
  styleUrl: './bank-wise-status-count.component.scss'
})
export class BankWiseStatusCountComponent implements OnInit {
  filterForm: FormGroup;
  banks: Bank[] = [];
  statusData: BankStatusData[] = [];
  loading = false;
  submitting = false;
  success = '';
  error = '';
  selectedBank = '';
  selectedFromDate = '';
  selectedToDate = '';
  assignerId = '127';

  tableColumns = [
    { key: 'NoOfInitiations', label: 'Number of Initiations' },
    { key: 'VisitDoneCount', label: 'Visit Done Count' },
    { key: 'VisitPendingCount', label: 'Visit Pending Count' },
    { key: 'ReportDoneCount', label: 'Report Done Count' },
    { key: 'ReportPendingCount', label: 'Report Pending Count' },
    { key: 'ReportSentCount', label: 'Report Sent Count' }
  ];

  constructor(
    private fb: FormBuilder,
    private managerService: ManagerService
  ) {
    this.filterForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      selectedBank: ['', Validators.required]
    });
  }

  get f() {
    return this.filterForm.controls;
  }

  ngOnInit(): void {
    this.loadBanks();
    this.setDefaultDates();
  }

  setDefaultDates(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.filterForm.patchValue({
      fromDate: this.formatDate(firstDayOfMonth),
      toDate: this.formatDate(today)
    });
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  loadBanks(): void {
    this.loading = true;
    this.managerService.getBankListByMid(this.assignerId).subscribe({
      next: (response: any) => {
        if (!response.error && response.message) {
          this.banks = response.message;
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading banks. Please try again.';
        this.loading = false;
      }
    });
  }

  onBankChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedBank = target.value;
    this.filterForm.patchValue({ selectedBank: this.selectedBank });
  }

  onSubmit(): void {
    if (this.filterForm.valid) {
      this.loadStatusData();
    }
  }

  loadStatusData(): void {
    const formValue = this.filterForm.value;
    this.submitting = true;
    this.error = '';
    this.success = '';

    this.selectedBank = formValue.selectedBank;
    this.selectedFromDate = formValue.fromDate;
    this.selectedToDate = formValue.toDate;

    this.managerService.getManagerReportOnBankDateId(
      formValue.selectedBank,
      formValue.fromDate,
      formValue.toDate,
      this.assignerId
    ).subscribe({
      next: (response: any) => {
        if (!response.error && response.message) {
          this.statusData = response.message;
          this.success = `Report generated successfully for ${formValue.selectedBank}`;
        } else {
          this.statusData = [];
          this.error = 'No data found for the selected criteria';
        }
        this.submitting = false;
      },
      error: (error) => {
        this.error = 'Error loading report data. Please try again.';
        this.statusData = [];
        this.submitting = false;
      }
    });
  }

  clearForm(): void {
    this.setDefaultDates();
    this.filterForm.patchValue({ selectedBank: '' });
    this.selectedBank = '';
    this.statusData = [];
    this.success = '';
    this.error = '';
  }

  getStatusValue(row: BankStatusData, key: string): number {
    return (row as any)[key] || 0;
  }
}
