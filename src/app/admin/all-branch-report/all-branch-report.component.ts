import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DashboardService, BranchReportData } from '../../core/services/dashboard.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-all-branch-report',
  templateUrl: './all-branch-report.component.html',
  styleUrls: ['./all-branch-report.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    AlertComponent
  ]
})
export class AllBranchReportComponent implements OnInit {
  filterForm!: FormGroup;
  reportData: BranchReportData[] = [];
  filteredData: BranchReportData[] = [];
  uniqueBranches: string[] = [];
  selectedBranches: string[] = [];

  loading = false;
  success = '';
  error = '';

  displayColumns = [
    { key: 'Branch', label: 'Branch' },
    { key: 'NoOfInitiations', label: 'Total Cases' },
    { key: 'ReportSentCount', label: 'Report Sent' },
    { key: 'VisitDoneCount', label: 'Visit Done Document Pending' },
    { key: 'StartedInitiationCount', label: 'Start Initiation' },
    { key: 'Reportinprocess', label: 'Report in Process' },
    { key: 'ReportPendingCount', label: 'Document Pending' },
    { key: 'RejectWithoutVisit', label: 'Reject Without Visit' },
    { key: 'RejectAfterVisit', label: 'Rejected After Visit' },
    { key: 'VisitPendingCount', label: 'Visit Pending' },
    { key: 'Others', label: 'Others' }
  ];

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.filterForm = this.formBuilder.group({
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      branches: [[]]
    });
  }

  onSubmit(): void {
    if (this.filterForm.invalid) {
      this.markFormGroupTouched(this.filterForm);
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const formValues = this.filterForm.value;

    this.dashboardService.getBranchReport('ALL', formValues.fromDate, formValues.toDate)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.reportData = response.message;
            this.totalItems = this.reportData.length;
            this.updateUniqueBranches();
            this.filterData();
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

  updateUniqueBranches(): void {
    this.uniqueBranches = Array.from(new Set(this.reportData.map(item => item.Branch)));
  }

  onBranchSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);
    this.selectedBranches = selectedOptions;
    this.filterData();
  }

  filterData(): void {
    if (this.selectedBranches.length === 0) {
      this.filteredData = this.reportData;
    } else {
      this.filteredData = this.reportData.filter(item => this.selectedBranches.includes(item.Branch));
    }
    this.totalItems = this.filteredData.length;
    this.currentPage = 1;
  }

  clearForm(): void {
    this.filterForm.reset();
    this.reportData = [];
    this.filteredData = [];
    this.uniqueBranches = [];
    this.selectedBranches = [];
    this.totalItems = 0;
    this.currentPage = 1;
    this.error = '';
    this.success = '';
  }

  downloadCSV(): void {
    if (this.filteredData.length === 0) {
      this.error = 'No data to export';
      return;
    }

    const csvData = this.convertToCSV(this.filteredData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'all_branch_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private convertToCSV(data: BranchReportData[]): string {
    const headerRow = this.displayColumns.map(column => column.label).join(',');
    const dataRows = data.map(row => {
      return this.displayColumns.map(column => {
        let cellData = (row as any)[column.key] || '0';
        cellData = cellData.toString().replace(/"/g, '""');
        if (cellData.includes(',') || cellData.includes('"') || cellData.includes('\n')) {
          cellData = `"${cellData}"`;
        }
        return cellData;
      }).join(',');
    });

    return [headerRow, ...dataRows].join('\n');
  }

  // Pagination methods
  changePage(page: number): void {
    this.currentPage = page;
  }

  get paginatedData(): BranchReportData[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    const maxVisiblePages = 5;
    const currentPage = this.currentPage;
    const totalPages = this.totalPages;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  get showFirstPage(): boolean {
    return this.currentPage > 3;
  }

  get showLastPage(): boolean {
    return this.currentPage < this.totalPages - 2;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get f() { return this.filterForm.controls; }
}