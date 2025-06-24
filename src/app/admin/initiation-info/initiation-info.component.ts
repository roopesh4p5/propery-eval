import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BankService, Bank, Branch, InitiationInfo } from '../../core/services/bank.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-initiation-info',
  templateUrl: './initiation-info.component.html',
  styleUrls: ['./initiation-info.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    AlertComponent
  ]
})
export class InitiationInfoComponent implements OnInit {
  filterForm!: FormGroup;
  banks: Bank[] = [];
  branches: Branch[] = [];
  initiationInfo: InitiationInfo[] = [];
  loading = false;
  submitting = false;
  success = '';
  error = '';
  loadingBanks = false;
  loadingBranches = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private formBuilder: FormBuilder,
    private bankService: BankService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadBanks();
    this.loadBranches();
  }

  initForm(): void {
    this.filterForm = this.formBuilder.group({
      bank: ['', [Validators.required]],
      branch: ['', [Validators.required]]
    });
  }

  loadBanks(): void {
    this.loadingBanks = true;
    this.bankService.getBanks()
      .pipe(
        finalize(() => this.loadingBanks = false)
      )
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
    this.loadingBranches = true;
    this.bankService.getBranches()
      .pipe(
        finalize(() => this.loadingBranches = false)
      )
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
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.filterForm.controls).forEach(key => {
        const control = this.filterForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';
    this.initiationInfo = [];

    const bank = this.filterForm.value.bank;
    const branch = this.filterForm.value.branch;

    this.bankService.filterByBankAndBranch(bank, branch)
      .pipe(
        finalize(() => this.submitting = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.initiationInfo = response.message;
            this.totalItems = this.initiationInfo.length;
            this.currentPage = 1;
          } else {
            this.error = 'Failed to fetch initiation info';
          }
        },
        error: (err) => {
          console.error('Error fetching initiation info:', err);
          this.error = 'Error fetching initiation info';
        }
      });
  }

  clearForm(): void {
    this.filterForm.reset();
    this.initiationInfo = [];
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get paginatedItems(): InitiationInfo[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.initiationInfo.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get f() { return this.filterForm.controls; }
}
