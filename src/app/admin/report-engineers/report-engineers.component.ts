import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReportEngineerService, ReportEngineer } from '../../core/services/report-engineer.service';
import { BankService } from '../../core/services/bank.service';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-report-engineers',
  templateUrl: './report-engineers.component.html',
  styleUrls: ['./report-engineers.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, CardComponent, ButtonComponent]
})
export class ReportEngineersComponent implements OnInit {
  engineerForm!: FormGroup;
  engineers: ReportEngineer[] = [];
  branches: { BID: number; Branch: string }[] = [];
  
  loading = false;
  submitting = false;
  isEditing = false;
  editingEngineerId: number | null = null;
  
  success = '';
  error = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private formBuilder: FormBuilder,
    private reportEngineerService: ReportEngineerService,
    private bankService: BankService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadEngineers();
    this.loadBranches();
  }

  initForm(): void {
    this.engineerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: [''], // Email is optional
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      branch: ['', [Validators.required]]
    });
  }

  loadEngineers(): void {
    this.loading = true;
    this.reportEngineerService.getReportEngineers()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.engineers = response.message;
            this.totalItems = this.engineers.length;
          } else {
            this.error = 'Failed to load report engineers';
          }
        },
        error: (err) => {
          console.error('Error loading report engineers:', err);
          this.error = 'Error loading report engineers';
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

  onSubmit(): void {
    if (this.engineerForm.invalid) {
      this.markFormGroupTouched(this.engineerForm);
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    const formValues = this.engineerForm.value;
    const engineer: ReportEngineer = {
      VEName: formValues.name,
      VEEmail: formValues.email || undefined,
      VEContact: formValues.contact,
      VEBranch: formValues.branch
    };

    if (this.isEditing && this.editingEngineerId) {
      engineer.VID = this.editingEngineerId;
      this.updateEngineer(engineer);
    } else {
      this.addEngineer(engineer);
    }
  }

  addEngineer(engineer: ReportEngineer): void {
    this.reportEngineerService.addReportEngineer(engineer)
      .pipe(
        finalize(() => this.submitting = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error) {
            this.success = 'Report engineer added successfully';
            this.engineerForm.reset();
            this.loadEngineers();
            this.scrollToTable();
          } else {
            this.error = response.message || 'Failed to add report engineer';
          }
        },
        error: (err) => {
          console.error('Error adding report engineer:', err);
          this.error = 'Error adding report engineer';
        }
      });
  }

  updateEngineer(engineer: ReportEngineer): void {
    this.reportEngineerService.updateReportEngineer(engineer)
      .pipe(
        finalize(() => {
          this.submitting = false;
          this.isEditing = false;
          this.editingEngineerId = null;
        })
      )
      .subscribe({
        next: (response) => {
          if (!response.error) {
            this.success = 'Report engineer updated successfully';
            this.engineerForm.reset();
            this.loadEngineers();
            this.scrollToTable();
          } else {
            this.error = response.message || 'Failed to update report engineer';
          }
        },
        error: (err) => {
          console.error('Error updating report engineer:', err);
          this.error = 'Error updating report engineer';
        }
      });
  }

  editEngineer(engineer: ReportEngineer): void {
    this.isEditing = true;
    this.editingEngineerId = engineer.VID || null;
    this.engineerForm.patchValue({
      name: engineer.VEName,
      email: engineer.VEEmail || '',
      contact: engineer.VEContact,
      branch: engineer.VEBranch
    });
    this.scrollToForm();
  }

  deleteEngineer(vid: number): void {
    if (confirm('Are you sure you want to delete this report engineer?')) {
      this.loading = true;
      this.reportEngineerService.deleteReportEngineer(vid)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: (response) => {
            if (!response.error) {
              this.success = 'Report engineer deleted successfully';
              this.loadEngineers();
            } else {
              this.error = response.message || 'Failed to delete report engineer';
            }
          },
          error: (err) => {
            console.error('Error deleting report engineer:', err);
            this.error = 'Error deleting report engineer';
          }
        });
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingEngineerId = null;
    this.engineerForm.reset();
  }

  clearForm(): void {
    this.engineerForm.reset();
    this.isEditing = false;
    this.editingEngineerId = null;
  }

  // Helper method to mark all fields as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Pagination methods
  changePage(page: number): void {
    this.currentPage = page;
  }

  get paginatedEngineers(): ReportEngineer[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.engineers.slice(startIndex, startIndex + this.pageSize);
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

  // Helper method to scroll to the form
  scrollToForm(): void {
    setTimeout(() => {
      const formElement = document.querySelector('.engineer-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  // Helper method to scroll to the table
  scrollToTable(): void {
    setTimeout(() => {
      const tableElement = document.querySelector('.engineer-table-container');
      if (tableElement) {
        tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  get f() { return this.engineerForm.controls; }
}
