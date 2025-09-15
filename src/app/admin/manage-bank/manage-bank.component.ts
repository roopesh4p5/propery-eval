import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BankService, Bank } from '../../core/services/bank.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-manage-bank',
  templateUrl: './manage-bank.component.html',
  styleUrls: ['./manage-bank.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    AlertComponent
  ]
})
export class ManageBankComponent implements OnInit {
  bankForm!: FormGroup;
  banks: Bank[] = [];
  loading = false;
  submitting = false;
  success = '';
  error = '';
  
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
  }

  initForm(): void {
    this.bankForm = this.formBuilder.group({
      bankName: ['', [Validators.required]]
    });
  }

  loadBanks(): void {
    this.loading = true;
    this.bankService.getBankInfo()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.banks = response.message;
            this.totalItems = this.banks.length;
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

  onSubmit(): void {
    if (this.bankForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.bankForm.controls).forEach(key => {
        const control = this.bankForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    const bankName = this.bankForm.value.bankName;

    this.bankService.addBank(bankName)
      .pipe(
        finalize(() => this.submitting = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error) {
            this.success = 'Bank added successfully';
            this.bankForm.reset();
            this.loadBanks(); // Reload the banks list
          } else {
            this.error = response.message || 'Failed to add bank';
          }
        },
        error: (err) => {
          console.error('Error adding bank:', err);
          this.error = 'Error adding bank';
        }
      });
  }

  deleteBank(bankId: number): void {
    if (confirm('Are you sure you want to delete this bank?')) {
      this.bankService.deleteBank(bankId)
        .subscribe({
          next: (response) => {
            if (!response.error) {
              this.success = 'Bank deleted successfully';
              this.loadBanks(); // Reload the banks list
            } else {
              this.error = response.message || 'Failed to delete bank';
            }
          },
          error: (err) => {
            console.error('Error deleting bank:', err);
            this.error = 'Error deleting bank';
          }
        });
    }
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get paginatedBanks(): Bank[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.banks.slice(startIndex, startIndex + this.pageSize);
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

  get f() { return this.bankForm.controls; }
}
