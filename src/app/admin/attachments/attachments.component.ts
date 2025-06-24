import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AttachmentService, Attachment } from '../../core/services/attachment.service';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, CardComponent, ButtonComponent]
})
export class AttachmentsComponent implements OnInit {
  filterForm!: FormGroup;
  attachments: Attachment[] = [];

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
    private attachmentService: AttachmentService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadAllAttachments();
  }

  loadAllAttachments(): void {
    this.loading = true;
    this.attachmentService.getAllAttachments()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.attachments = response.message;
            this.totalItems = this.attachments.length;

            if (this.attachments.length === 0) {
              this.success = 'No attachments found';
            } else {
              this.success = `Showing all attachments (${this.attachments.length})`;
            }
          } else {
            this.error = response.message || 'Failed to fetch attachments';
          }
        },
        error: (err) => {
          console.error('Error fetching attachments:', err);
          this.error = 'Error fetching attachments';
        }
      });
  }

  initForm(): void {
    this.filterForm = this.formBuilder.group({
      refNo: ['', [Validators.required]]
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
    this.attachments = [];

    const refNo = this.filterForm.value.refNo;
    this.searchAttachments(refNo);
  }

  searchAttachments(refNo: string): void {
    this.loading = true;
    this.attachmentService.getAttachmentsByRefNo(refNo)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.submitting = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.attachments = response.message;
            this.totalItems = this.attachments.length;

            if (this.attachments.length === 0) {
              this.success = 'No attachments found for the given Mourya Ref No';
            } else {
              this.success = `Found ${this.attachments.length} attachment(s) for Mourya Ref No ${refNo}`;
            }
          } else {
            this.error = response.message || 'Failed to fetch attachments';
          }
        },
        error: (err) => {
          console.error('Error fetching attachments:', err);
          this.error = 'Error fetching attachments';
        }
      });
  }



  clearForm(): void {
    this.filterForm.reset();
    this.success = '';
    this.error = '';
    this.loadAllAttachments();
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

  get paginatedAttachments(): Attachment[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.attachments.slice(startIndex, startIndex + this.pageSize);
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

  get f() { return this.filterForm.controls; }
}
