import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BankService, Bank, Branch, InitiationInfo } from '../../core/services/bank.service';
import { AttachmentService } from '../../core/services/attachment.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
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
    AlertComponent,
    ModalComponent
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

  // Attachment modal properties
  isAttachmentModalOpen = false;
  selectedItem: InitiationInfo | null = null;
  selectedFile: File | null = null;
  fileValidationMessage = '';
  isFileValid = false;
  uploadingFile = false;

  constructor(
    private formBuilder: FormBuilder,
    private bankService: BankService,
    private attachmentService: AttachmentService
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

  // Attachment Modal Methods
  openAttachmentModal(item: InitiationInfo): void {
    this.selectedItem = item;
    this.selectedFile = null;
    this.fileValidationMessage = '';
    this.isFileValid = false;
    this.isAttachmentModalOpen = true;
  }

  closeAttachmentModal(): void {
    this.isAttachmentModalOpen = false;
    this.selectedItem = null;
    this.selectedFile = null;
    this.fileValidationMessage = '';
    this.isFileValid = false;
    this.uploadingFile = false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Validate the file
      const validation = this.attachmentService.validateFile(this.selectedFile);
      this.isFileValid = validation.isValid;
      this.fileValidationMessage = validation.message;
    } else {
      this.selectedFile = null;
      this.fileValidationMessage = '';
      this.isFileValid = false;
    }
  }

  uploadAttachment(): void {
    if (!this.selectedFile || !this.selectedItem || !this.isFileValid) {
      return;
    }

    // Use TransID as the reference number for upload
    const refNo = String(this.selectedItem.TransID || '');

    if (!refNo) {
      this.error = 'Missing Transaction ID for upload';
      return;
    }

    this.uploadingFile = true;
    this.error = '';
    this.success = '';

    this.attachmentService.uploadReportAttachment(refNo, this.selectedFile)
      .pipe(
        finalize(() => this.uploadingFile = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error) {
            this.success = 'Attachment uploaded successfully!';
            this.closeAttachmentModal();
          } else {
            this.error = response.message || 'Failed to upload attachment';
          }
        },
        error: (err) => {
          console.error('Error uploading attachment:', err);
          this.error = 'Error uploading attachment. Please try again.';
        }
      });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  get f() { return this.filterForm.controls; }
}
