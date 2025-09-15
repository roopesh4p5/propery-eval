import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService, Branch, UserRole, User } from '../../core/services/user.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardComponent,
    ButtonComponent,
    AlertComponent
  ]
})
export class UsersComponent implements OnInit {
  userForm!: FormGroup;
  branches: Branch[] = [];
  userRoles: UserRole[] = [];
  users: User[] = [];
  loading = false;
  submitting = false;
  success = '';
  error = '';
  loadingBranches = false;
  loadingUsers = false;
  editMode = false;
  editUserId: number | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalUsers = 0;

  // Filter
  selectedBranchFilter: string = '';
  filteredUsers: User[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadBranches();
    this.loadUsers();
    this.userRoles = this.userService.getUserRoles();
  }

  initForm(user?: User): void {
    this.userForm = this.formBuilder.group({
      name: [user?.Name || '', [Validators.required]],
      email: [user?.Email || '', [Validators.required, Validators.email]],
      password: [user?.Password || '', [Validators.required, Validators.minLength(8)]],
      userRole: [user?.UserRole || '', [Validators.required]],
      branch: [user?.Branch || '', [Validators.required]],
      isActive: [user?.IsActive || 'Y']
    });

    this.editMode = !!user;
    this.editUserId = user?.UserID || null;
  }

  loadBranches(): void {
    this.loadingBranches = true;
    this.userService.getBranches()
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

  loadUsers(): void {
    this.loadingUsers = true;
    this.userService.getUsers()
      .pipe(
        finalize(() => this.loadingUsers = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.error && response.message) {
            this.users = response.message;
            this.applyBranchFilter();
          } else {
            this.error = 'Failed to load users';
          }
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.error = 'Error loading users';
        }
      });
  }

  applyBranchFilter(): void {
    if (!this.selectedBranchFilter) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.Branch === this.selectedBranchFilter
      );
    }
    this.totalUsers = this.filteredUsers.length;
    this.currentPage = 1; // Reset to first page when filter changes
  }

  onBranchFilterChange(branch: string): void {
    this.selectedBranchFilter = branch;
    this.applyBranchFilter();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    const userData = {
      Name: this.userForm.value.name,
      Email: this.userForm.value.email,
      Password: this.userForm.value.password,
      UserRole: this.userForm.value.userRole,
      IsActive: this.userForm.value.isActive,
      Branch: this.userForm.value.branch
    };

    if (this.editMode && this.editUserId) {
      // Update existing user
      this.userService.updateUser({
        ...userData,
        UserID: this.editUserId
      })
        .pipe(
          finalize(() => this.submitting = false)
        )
        .subscribe({
          next: (response) => {
            if (!response.error) {
              this.success = 'User updated successfully';
              this.loadUsers();
              this.resetForm();
            } else {
              this.error = response.message || 'Failed to update user';
            }
          },
          error: (err) => {
            console.error('Error updating user:', err);
            this.error = 'Error updating user';
          }
        });
    } else {
      // Add new user
      this.userService.addUser(userData)
        .pipe(
          finalize(() => this.submitting = false)
        )
        .subscribe({
          next: (response) => {
            if (!response.error) {
              this.success = 'User added successfully';
              this.loadUsers();
              this.resetForm();
            } else {
              this.error = response.message || 'Failed to add user';
            }
          },
          error: (err) => {
            console.error('Error adding user:', err);
            this.error = 'Error adding user';
          }
        });
    }
  }

  editUser(user: User): void {
    this.initForm(user);
    this.success = `Editing user: ${user.Name}`;

    // Scroll to the form with a slight delay to ensure DOM is updated
    setTimeout(() => {
      const formElement = document.querySelector('.user-form-container');
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

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId)
        .subscribe({
          next: (response) => {
            if (!response.error) {
              this.success = 'User deleted successfully';
              this.loadUsers();
            } else {
              this.error = response.message || 'Failed to delete user';
            }
          },
          error: (err) => {
            console.error('Error deleting user:', err);
            this.error = 'Error deleting user';
          }
        });
    }
  }

  resetForm(): void {
    this.userForm.reset({
      isActive: 'Y'
    });
    this.editMode = false;
    this.editUserId = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalUsers / this.pageSize);
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

  get f() { return this.userForm.controls; }
}
