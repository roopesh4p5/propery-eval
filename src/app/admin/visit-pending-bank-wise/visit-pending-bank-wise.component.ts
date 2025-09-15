import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { VisitPendingBankWiseService, VisitPendingBankRecord, Bank, BankBranch } from '../../core/services/visit-pending-bank-wise.service';

@Component({
  selector: 'app-visit-pending-bank-wise',
  templateUrl: './visit-pending-bank-wise.component.html',
  styleUrls: ['./visit-pending-bank-wise.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, CardComponent, ButtonComponent]
})
export class VisitPendingBankWiseComponent implements OnInit {
  filterForm!: FormGroup;
  banks: Bank[] = [];
  branches: BankBranch[] = [];
  visitPendingRecords: VisitPendingBankRecord[] = [];

  loading = false;
  submitting = false;
  loadingBanks = false;
  loadingBranches = false;

  success = '';
  error = '';

  // Selected values for display
  selectedBank = '';
  selectedBranch = '';

  constructor(
    private formBuilder: FormBuilder,
    private visitPendingBankWiseService: VisitPendingBankWiseService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadBanks();
  }

  initForm(): void {
    this.filterForm = this.formBuilder.group({
      bank: ['', [Validators.required]],
      branch: ['', [Validators.required]]
    });

    // Watch for bank changes to load branches
    this.filterForm.get('bank')?.valueChanges.subscribe(bankValue => {
      if (bankValue) {
        this.loadBranches();
        this.filterForm.get('branch')?.setValue(''); // Reset branch selection
        this.visitPendingRecords = []; // Clear any existing records
      }
    });
  }

  loadBanks(): void {
    this.loadingBanks = true;
    this.visitPendingBankWiseService.getBanks()
      .subscribe({
        next: (response) => {
          this.loadingBanks = false;
          if (!response.error && response.message) {
            this.banks = response.message;
          } else {
            this.error = 'Failed to load banks';
          }
        },
        error: (err) => {
          this.loadingBanks = false;
          console.error('Error loading banks:', err);
          this.error = 'Error loading banks';
        }
      });
  }

  loadBranches(): void {
    this.loadingBranches = true;
    this.branches = [];

    this.visitPendingBankWiseService.getBankBranches()
      .subscribe({
        next: (response) => {
          this.loadingBranches = false;
          if (!response.error && response.message) {
            this.branches = response.message;
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
    this.visitPendingRecords = [];

    const formValues = this.filterForm.value;
    this.selectedBank = formValues.bank;
    this.selectedBranch = formValues.branch;

    this.visitPendingBankWiseService.getVisitPendingByBankBranch(formValues.bank, formValues.branch)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.submitting = false;
          if (!response.error && response.message) {
            this.visitPendingRecords = response.message;
            this.success = `Visit pending records loaded for ${this.selectedBank} - ${this.selectedBranch}`;
          } else {
            this.error = 'No visit pending records found';
          }
        },
        error: (err) => {
          this.loading = false;
          this.submitting = false;
          console.error('Error loading visit pending records:', err);
          this.error = 'Error loading visit pending records';
        }
      });
  }

  clearForm(): void {
    this.filterForm.reset();
    this.visitPendingRecords = [];
    this.success = '';
    this.error = '';
    this.selectedBank = '';
    this.selectedBranch = '';
    this.branches = [];
    this.initForm();
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
