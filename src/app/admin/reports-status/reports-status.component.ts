import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ReportsStatusService, ReportRecord, Bank, Branch, Status } from '../../core/services/reports-status.service';

@Component({
  selector: 'app-reports-status',
  templateUrl: './reports-status.component.html',
  styleUrls: ['./reports-status.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, CardComponent, ButtonComponent]
})
export class ReportsStatusComponent implements OnInit {
  filterForm!: FormGroup;
  searchForms!: { bankRef: FormGroup; customerName: FormGroup; mouraRef: FormGroup };

  banks: Bank[] = [];
  branches: Branch[] = [];
  mouryaBranches: Branch[] = [];
  reportRecords: ReportRecord[] = [];

  loading = false;
  submitting = false;
  loadingData = false;

  success = '';
  error = '';

  // Available status options
  statusOptions: Status[] = [
    { value: 'Started Initiation - Visit Pending', label: 'Started Initiation - Visit Pending' },
    { value: 'Reject Without Visit', label: 'Reject Without Visit' },
    { value: 'Visit Done-Document Pending to Start Report', label: 'Visit Done-Document Pending to Start Report' },
    { value: 'Report in process', label: 'Report in process' },
    { value: 'Report Pending - Query Raised', label: 'Report Pending - Query Raised' },
    { value: 'Report Sent', label: 'Report Sent' },
    { value: 'Reject-After Visit', label: 'Reject-After Visit' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private reportsStatusService: ReportsStatusService
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadInitialData();
  }

  initForms(): void {
    // Main filter form
    this.filterForm = this.formBuilder.group({
      mouryaBranch: [''],
      bank: [''],
      branch: [''],
      status: ['']
    });

    // Search forms
    this.searchForms = {
      bankRef: this.formBuilder.group({
        bankRefNo: ['', [Validators.minLength(1)]]
      }),
      customerName: this.formBuilder.group({
        customerName: ['', [Validators.minLength(1)]]
      }),
      mouraRef: this.formBuilder.group({
        mouraRefNo: ['', [Validators.minLength(5)]]
      })
    };

    // Watch for bank changes to load branches
    this.filterForm.get('bank')?.valueChanges.subscribe(bankValue => {
      if (bankValue) {
        this.filterForm.get('branch')?.setValue('');
      }
    });
  }

  loadInitialData(): void {
    this.loadingData = true;

    // Load banks and branches in parallel
    Promise.all([
      this.reportsStatusService.getBanks().toPromise(),
      this.reportsStatusService.getBranches().toPromise()
    ]).then(([banksResponse, branchesResponse]) => {
      this.loadingData = false;

      if (banksResponse && !banksResponse.error) {
        this.banks = banksResponse.message;
      }

      if (branchesResponse && !branchesResponse.error) {
        this.branches = branchesResponse.message;
        this.mouryaBranches = branchesResponse.message; // Same source for Mourya branches
      }
    }).catch(err => {
      this.loadingData = false;
      console.error('Error loading initial data:', err);
      this.error = 'Error loading initial data';
    });
  }

  onFilterSubmit(): void {
    this.submitting = true;
    this.error = '';
    this.success = '';
    this.reportRecords = [];

    const formValues = this.filterForm.value;

    this.reportsStatusService.getReportsByFilter(
      formValues.mouryaBranch,
      formValues.bank,
      formValues.branch,
      formValues.status
    ).subscribe({
      next: (response) => {
        this.submitting = false;
        if (!response.error && response.message) {
          this.reportRecords = response.message;
          this.success = `Found ${this.reportRecords.length} records`;
        } else {
          this.error = 'No records found';
        }
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error loading reports:', err);
        this.error = 'Error loading reports';
      }
    });
  }

  onSearchSubmit(searchType: 'bankRef' | 'customerName' | 'mouraRef'): void {
    const form = this.searchForms[searchType];

    if (form.invalid) {
      Object.keys(form.controls).forEach(key => {
        form.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';
    this.reportRecords = [];

    const searchValue = Object.values(form.value)[0] as string;

    this.reportsStatusService.searchReports(searchType, searchValue)
      .subscribe({
        next: (response) => {
          this.submitting = false;
          if (!response.error && response.message) {
            this.reportRecords = response.message;
            this.success = `Found ${this.reportRecords.length} records`;
          } else {
            this.error = 'No records found';
          }
        },
        error: (err) => {
          this.submitting = false;
          console.error('Error searching reports:', err);
          this.error = 'Error searching reports';
        }
      });
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.reportRecords = [];
    this.success = '';
    this.error = '';
  }

  clearSearch(searchType: 'bankRef' | 'customerName' | 'mouraRef'): void {
    this.searchForms[searchType].reset();
    this.reportRecords = [];
    this.success = '';
    this.error = '';
  }

  get f() { return this.filterForm.controls; }
  get bankRefForm() { return this.searchForms.bankRef.controls; }
  get customerForm() { return this.searchForms.customerName.controls; }
  get mouraRefForm() { return this.searchForms.mouraRef.controls; }
}
