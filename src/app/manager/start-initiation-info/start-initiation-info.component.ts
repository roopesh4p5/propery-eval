import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ManagerService } from '../services/manager.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';

// import { SharedService } from '../../shared/services/shared.service';
// FIX: Check if SharedService exists at the given path. If not, update the path or remove the import if unused.

@Component({
  selector: 'app-start-initiation-info',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonComponent,
    CardComponent
  ],
  templateUrl: './start-initiation-info.component.html',
  styleUrl: './start-initiation-info.component.scss'
})
export class StartInitiationInfoComponent implements OnInit {
  initiationForm: FormGroup;
  banks: any[] = [];
  branches: any[] = [];
  managerEmails: any[] = [];
  engineerEmails: any[] = [];
  initiationEngineerEmails: any[] = [];
  mouryaBranches: any[] = [];
  siteEngineers: any[] = [];
  initiationEngineers: any[] = [];
  transactions: any[] = [];
  editMode = false;
  editTransactionData: any = null;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalTransactions = 0;

  // Filter
  phoneNumberFilter: string = '';
  filteredTransactions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private managerService: ManagerService
  ) {
    this.initiationForm = this.fb.group({
      empName: ['', [Validators.required, Validators.minLength(2)]],
      empEmail: ['', [Validators.required, Validators.email]],
      empContact: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      custName: ['', [Validators.required, Validators.minLength(2)]],
      custMobile: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      custEmail: ['', [Validators.email]],
      contactName: ['', [Validators.required, Validators.minLength(2)]],
      contactNumber: ['', [Validators.pattern('^[6-9]\\d{9}$')]],
      clientBranch: ['', Validators.required],
      refNo: ['', Validators.required], // Based on API error, this is required
      propertyAddress: ['', [Validators.required, Validators.minLength(10)]],
      comments: [''],
      attachment: [''],
      mapLink: ['', [Validators.pattern('https?://.+')]],
      createdDatetime: [''], // This will be set automatically
      status: ['Started Initiation - Visit Pending'],
      assignerID: ['127'],
      dateOfRequest: ['', Validators.required],
      caseType: [''],
      bank: ['', Validators.required],
      branch: ['', Validators.required],
      documentInfo: [''],
      bankRefNo: [''],
      bankAgentName: [''],
      assignerBranch: [''],
      transType: [''],
      remarks: [''],
      inEmail: ['', [Validators.email]],
      inName: [''],
      inContact: ['', [Validators.pattern('^[6-9]\\d{9}$')]],
      inBranch: [''],
    });
  }

  // Getter for easy access to form controls
  get f() {
    return this.initiationForm.controls;
  }

  // Helper method to check if field should show validation error
  shouldShowError(fieldName: string): boolean {
    const field = this.initiationForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Helper method to get validation error message
  getErrorMessage(fieldName: string): string {
    const field = this.initiationForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'This field is required';
    }
    if (field.errors['email']) {
      return 'Please enter a valid email address';
    }
    if (field.errors['pattern']) {
      if (fieldName.includes('Contact') || fieldName.includes('Mobile')) {
        return 'Please enter a valid 10-digit mobile number starting with 6-9';
      }
      if (fieldName === 'mapLink') {
        return 'Please enter a valid URL';
      }
      return 'Please enter a valid format';
    }
    if (field.errors['minlength']) {
      return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
    }
    return 'Invalid input';
  }

  ngOnInit(): void {
    this.fetchDropdownData();
  }

  fetchDropdownData() {
    const assignerId = '127';

    // Fetch banks
    this.managerService.getBanks().subscribe((response: any) => {
      if (!response.error && response.message) {
        this.banks = response.message;
      }
    });

    // Fetch bank branches (for Mourya Branch dropdown)
    this.managerService.getBankBranches().subscribe((response: any) => {
      if (!response.error && response.message) {
        this.mouryaBranches = response.message;
      }
    });

    // Fetch site engineers (using getManagerEmails API)
    this.managerService.getManagerEmails(assignerId).subscribe((response: any) => {
      if (!response.error && response.message) {
        this.siteEngineers = response.message;
      }
    });

    // Fetch initiation engineers (using getEngineerEmails API)
    this.managerService.getEngineerEmails(assignerId).subscribe((response: any) => {
      if (!response.error && response.message) {
        this.initiationEngineers = response.message;
      }
    });

    // Fetch transactions
    this.managerService.getTransactionsByManager(assignerId).subscribe((response: any) => {
      if (!response.error && response.message) {
        this.transactions = response.message;
        this.applyPhoneFilter();
      }
    });
  }

  onSiteEngineerChange(selectedEmail: string) {
    const selectedEngineer = this.siteEngineers.find(engineer => engineer.EmpEmail === selectedEmail);
    if (selectedEngineer) {
      this.initiationForm.patchValue({
        empName: selectedEngineer.EmpName,
        empContact: selectedEngineer.EmpContact,
        assignerBranch: selectedEngineer.Branch
      });

      // Disable the auto-populated fields
      this.initiationForm.get('empName')?.disable();
      this.initiationForm.get('empContact')?.disable();
      this.initiationForm.get('assignerBranch')?.disable();
    }
  }

  onInitiationEngineerChange(selectedEmail: string) {
    const selectedEngineer = this.initiationEngineers.find(engineer => engineer.InEmail === selectedEmail);
    if (selectedEngineer) {
      this.initiationForm.patchValue({
        inName: selectedEngineer.InName,
        inContact: selectedEngineer.InContact,
        inBranch: selectedEngineer.InBranch
      });

      // Disable the auto-populated fields
      this.initiationForm.get('inName')?.disable();
      this.initiationForm.get('inContact')?.disable();
      this.initiationForm.get('inBranch')?.disable();
    }
  }

  onSubmit() {
    if (this.initiationForm.valid) {
      // Re-enable disabled fields before submitting to include them in the form value
      this.initiationForm.get('empName')?.enable();
      this.initiationForm.get('empContact')?.enable();
      this.initiationForm.get('assignerBranch')?.enable();
      this.initiationForm.get('inName')?.enable();
      this.initiationForm.get('inContact')?.enable();
      this.initiationForm.get('inBranch')?.enable();

      // Prepare the form data with required fields
      const formData = {
        ...this.initiationForm.value,
        CreatedDatetime: new Date().toISOString(), // Add current timestamp as required by API
        // Ensure all required fields are present and not empty
        RefNo: this.initiationForm.value.refNo || 'AUTO-' + Date.now(), // Generate ref number if empty
      };

      this.managerService.submitInitiation(formData).subscribe({
        next: (response) => {
          if (response && !response.error) {
            console.log('Initiation submitted successfully!');
            this.initiationForm.reset();
            this.initiationForm.patchValue({
              status: 'Started Initiation - Visit Pending',
              assignerID: '127'
            });
            // Refresh transactions list
            this.fetchDropdownData();
          } else {
            console.error('Error: ' + (response.message || 'Unknown error occurred'));
          }
        },
        error: (error) => {
          console.error('Submission error:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.initiationForm.controls).forEach(key => {
        this.initiationForm.get(key)?.markAsTouched();
      });
    }
  }

  applyPhoneFilter(): void {
    if (!this.phoneNumberFilter) {
      this.filteredTransactions = [...this.transactions];
    } else {
      this.filteredTransactions = this.transactions.filter(transaction =>
        transaction.CustMobile?.includes(this.phoneNumberFilter) ||
        transaction.ContactNumber?.includes(this.phoneNumberFilter)
      );
    }
    this.totalTransactions = this.filteredTransactions.length;
    this.currentPage = 1; // Reset to first page when filter changes
  }

  onPhoneFilterChange(): void {
    this.applyPhoneFilter();
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get paginatedTransactions(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredTransactions.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalTransactions / this.pageSize);
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

  editTransaction(transaction: any): void {
    this.editMode = true;
    this.editTransactionData = transaction;

    // Map transaction data to form fields
    this.initiationForm.patchValue({
      empEmail: transaction.EmpEmail || '',
      empName: transaction.EmpName || '',
      empContact: transaction.EmpContact || '',
      custName: transaction.CustName || '',
      custMobile: transaction.CustMobile || '',
      custEmail: transaction.CustEmail || '',
      contactName: transaction.ContactName || '',
      contactNumber: transaction.ContactNumber || '',
      clientBranch: transaction.Client_Branch || '',
      refNo: transaction.RefNo || '',
      propertyAddress: transaction.PropertyAddress || '',
      comments: transaction.Comments || '',
      attachment: transaction.Attachment || '',
      mapLink: transaction.MapLink || '',
      dateOfRequest: transaction.DateofRequest || '',
      caseType: transaction.CaseType || '',
      bank: transaction.Bank || '',
      branch: transaction.Branch || '',
      documentInfo: transaction.DocumentInfo || '',
      bankRefNo: transaction.BankRefNo || '',
      bankAgentName: transaction.BankAgentName || '',
      assignerBranch: transaction.AssignerBranch || '',
      transType: transaction.Trans_type || '',
      remarks: transaction.Remarks || '',
      inEmail: transaction.InEmail || '',
      inName: transaction.InName || '',
      inContact: transaction.InContact || '',
      inBranch: transaction.InBranch || ''
    });

    // Scroll to the form with a slight delay to ensure DOM is updated
    setTimeout(() => {
      const formElement = document.querySelector('.start-initiation-form-container');
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
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editTransactionData = null;
    this.initiationForm.reset({
      status: 'Started Initiation - Visit Pending',
      assignerID: '127'
    });
  }
}
