import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BankService, Branch } from '../../core/services/bank.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-manage-branch',
  templateUrl: './manage-branch.component.html',
  styleUrls: ['./manage-branch.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    AlertComponent
  ]
})
export class ManageBranchComponent implements OnInit {
  branchForm!: FormGroup;
  branches: Branch[] = [];
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
    this.loadBranches();
  }

  initForm(): void {
    this.branchForm = this.formBuilder.group({
      branchName: ['', [Validators.required]]
    });
  }

  loadBranches(): void {
    this.loading = true;
    this.bankService.getBranches()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.branches = response.message;
            this.totalItems = this.branches.length;
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
    if (this.branchForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.branchForm.controls).forEach(key => {
        const control = this.branchForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    const branchName = this.branchForm.value.branchName;

    this.bankService.addBranch(branchName)
      .pipe(
        finalize(() => this.submitting = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error) {
            this.success = 'Branch added successfully';
            this.branchForm.reset();
            this.loadBranches(); // Reload the branches list
          } else {
            this.error = response.message || 'Failed to add branch';
          }
        },
        error: (err) => {
          console.error('Error adding branch:', err);
          this.error = 'Error adding branch';
        }
      });
  }

  deleteBranch(branchId: number): void {
    if (confirm('Are you sure you want to delete this branch?')) {
      this.bankService.deleteBranch(branchId)
        .subscribe({
          next: (response) => {
            if (!response.error) {
              this.success = 'Branch deleted successfully';
              this.loadBranches(); // Reload the branches list
            } else {
              this.error = response.message || 'Failed to delete branch';
            }
          },
          error: (err) => {
            console.error('Error deleting branch:', err);
            this.error = 'Error deleting branch';
          }
        });
    }
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get paginatedBranches(): Branch[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.branches.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get f() { return this.branchForm.controls; }
}
