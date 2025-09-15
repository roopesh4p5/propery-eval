import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BankService, Branch, BankBranchInfo } from '../../core/services/bank.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-manage-bank-branch',
  templateUrl: './manage-bank-branch.component.html',
  styleUrls: ['./manage-bank-branch.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    AlertComponent
  ]
})
export class ManageBankBranchComponent implements OnInit {
  bankBranchForm!: FormGroup;
  bankBranchInfoList: BankBranchInfo[] = [];
  branches: Branch[] = [];
  loading = false;
  submitting = false;
  success = '';
  error = '';
  editMode = false;
  currentBBID: number | null = null;
  
  // States list
  states: string[] = [
    'ANDAMAN AND NICOBAR ISLANDS', 'ANDHRA PRADESH', 'ARUNACHAL PRADESH', 'ASSAM', 'BIHAR',
    'CHANDIGARH', 'CHHATTISGARH', 'DADRA AND NAGAR HAVELI AND DAMAN AND DIU', 'DELHI', 'GOA',
    'GUJARAT', 'HARYANA', 'HIMACHAL PRADESH', 'JAMMU AND KASHMIR', 'JHARKHAND',
    'KARNATAKA', 'KERALA', 'LADAKH', 'LAKSHADWEEP', 'MADHYA PRADESH',
    'MAHARASHTRA', 'MANIPUR', 'MEGHALAYA', 'MIZORAM', 'NAGALAND',
    'ODISHA', 'PUDUCHERRY', 'PUNJAB', 'RAJASTHAN', 'SIKKIM',
    'TAMIL NADU', 'TELANGANA', 'TRIPURA', 'UTTAR PRADESH', 'UTTARAKHAND',
    'WEST BENGAL'
  ];
  
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
    this.loadBankBranchInfo();
  }

  initForm(bankBranchInfo?: BankBranchInfo): void {
    this.bankBranchForm = this.formBuilder.group({
      branch: [bankBranchInfo?.Branch || '', [Validators.required]],
      bank: [bankBranchInfo?.Bank || '', [Validators.required]],
      state: [bankBranchInfo?.BState || '', [Validators.required]],
      billName: [bankBranchInfo?.BillName || '', [Validators.required]],
      billAcc: [bankBranchInfo?.BillAcc || '', [Validators.required]],
      billIFSC: [bankBranchInfo?.BillIFSC || '', [Validators.required]],
      bPAN: [bankBranchInfo?.BPAN || '', [Validators.required]],
      bGSTIN: [bankBranchInfo?.BGSTIN || '', [Validators.required]],
      ourBank: [bankBranchInfo?.Our_Bank || '', [Validators.required]],
      fromName: [bankBranchInfo?.From_Name || '', [Validators.required]],
      bEmail: [bankBranchInfo?.BEmail || '', [Validators.email]],
      bMobile: [bankBranchInfo?.BMobile || '', [Validators.pattern('^[0-9]{10}$')]],
      bAddress: [bankBranchInfo?.BAddress || ''],
      fromGSTIN: [bankBranchInfo?.From_GSTIN || ''],
      toName: [bankBranchInfo?.To_Name || ''],
      toEmail: [bankBranchInfo?.To_Email || '', [Validators.email]],
      toMobile: [bankBranchInfo?.To_Mobile || '', [Validators.pattern('^[0-9]{10}$')]],
      toAddress: [bankBranchInfo?.To_Address || ''],
      toGSTIN: [bankBranchInfo?.To_GSTIN || '']
    });
    
    this.editMode = !!bankBranchInfo;
    this.currentBBID = bankBranchInfo?.BBID || null;
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

  loadBankBranchInfo(): void {
    this.loading = true;
    this.bankService.getBankBranchInfo()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.bankBranchInfoList = response.message;
            this.totalItems = this.bankBranchInfoList.length;
          } else {
            this.error = 'Failed to load bank branch information';
          }
        },
        error: (err) => {
          console.error('Error loading bank branch information:', err);
          this.error = 'Error loading bank branch information';
        }
      });
  }

  onSubmit(): void {
    if (this.bankBranchForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.bankBranchForm.controls).forEach(key => {
        const control = this.bankBranchForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    const formValues = this.bankBranchForm.value;
    
    const bankBranchInfo: BankBranchInfo = {
      BBID: this.currentBBID || undefined,
      Branch: formValues.branch,
      Bank: formValues.bank,
      BState: formValues.state,
      BillName: formValues.billName,
      BillAcc: formValues.billAcc,
      BillIFSC: formValues.billIFSC,
      BPAN: formValues.bPAN,
      BGSTIN: formValues.bGSTIN,
      Our_Bank: formValues.ourBank,
      From_Name: formValues.fromName,
      BEmail: formValues.bEmail || '',
      BMobile: formValues.bMobile || '',
      BAddress: formValues.bAddress || '',
      From_GSTIN: formValues.fromGSTIN || '',
      To_Name: formValues.toName || '',
      To_Email: formValues.toEmail || '',
      To_Mobile: formValues.toMobile || '',
      To_Address: formValues.toAddress || '',
      To_GSTIN: formValues.toGSTIN || ''
    };

    const request = this.editMode
      ? this.bankService.updateBankBranchInfo(bankBranchInfo)
      : this.bankService.addBankBranchInfo(bankBranchInfo);

    request
      .pipe(
        finalize(() => this.submitting = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error) {
            this.success = this.editMode
              ? 'Bank branch information updated successfully'
              : 'Bank branch information added successfully';
            this.bankBranchForm.reset();
            this.editMode = false;
            this.currentBBID = null;
            this.loadBankBranchInfo(); // Reload the list
          } else {
            this.error = response.message || 'Failed to save bank branch information';
          }
        },
        error: (err) => {
          console.error('Error saving bank branch information:', err);
          this.error = 'Error saving bank branch information';
        }
      });
  }

  editBankBranchInfo(bankBranchInfo: BankBranchInfo): void {
    this.initForm(bankBranchInfo);
    
    // Scroll to the form
    setTimeout(() => {
      const formElement = document.querySelector('.bank-branch-form-container');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Add a highlight effect to the form
        formElement.classList.add('highlight-form');
        setTimeout(() => {
          formElement.classList.remove('highlight-form');
        }, 1500);
      } else {
        // Fallback to window scroll if element not found
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
    
    this.success = `Editing bank branch information for ${bankBranchInfo.Branch}`;
  }

  deleteBankBranchInfo(bbId: number): void {
    if (confirm('Are you sure you want to delete this bank branch information?')) {
      this.bankService.deleteBankBranchInfo(bbId)
        .subscribe({
          next: (response) => {
            if (!response.error) {
              this.success = 'Bank branch information deleted successfully';
              this.loadBankBranchInfo(); // Reload the list
            } else {
              this.error = response.message || 'Failed to delete bank branch information';
            }
          },
          error: (err) => {
            console.error('Error deleting bank branch information:', err);
            this.error = 'Error deleting bank branch information';
          }
        });
    }
  }

  cancelEdit(): void {
    this.bankBranchForm.reset();
    this.editMode = false;
    this.currentBBID = null;
    this.success = '';
    this.error = '';
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get paginatedItems(): BankBranchInfo[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.bankBranchInfoList.slice(startIndex, startIndex + this.pageSize);
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

  get f() { return this.bankBranchForm.controls; }
}
