import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { VisitPendingService, VisitPendingRecord, Engineer } from '../../core/services/visit-pending.service';

@Component({
  selector: 'app-visit-pending-engineer-wise',
  templateUrl: './visit-pending-engineer-wise.component.html',
  styleUrls: ['./visit-pending-engineer-wise.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, CardComponent, ButtonComponent]
})
export class VisitPendingEngineerWiseComponent implements OnInit {
  filterForm!: FormGroup;
  engineers: Engineer[] = [];
  visitPendingRecords: VisitPendingRecord[] = [];

  loading = false;
  submitting = false;
  loadingEngineers = false;

  success = '';
  error = '';

  // Selected values for display
  selectedEngineer = '';

  constructor(
    private formBuilder: FormBuilder,
    private visitPendingService: VisitPendingService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadEngineers();
  }

  initForm(): void {
    this.filterForm = this.formBuilder.group({
      engineer: ['', [Validators.required]]
    });
  }

  loadEngineers(): void {
    this.loadingEngineers = true;
    this.visitPendingService.getEngineers()
      .subscribe({
        next: (response) => {
          this.loadingEngineers = false;
          if (!response.error && response.message) {
            this.engineers = response.message;
          } else {
            this.error = 'Failed to load engineers';
          }
        },
        error: (err) => {
          this.loadingEngineers = false;
          console.error('Error loading engineers:', err);
          this.error = 'Error loading engineers';
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
    this.selectedEngineer = formValues.engineer;

    this.visitPendingService.getVisitPendingByEngineer(formValues.engineer)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.submitting = false;
          if (!response.error && response.message) {
            this.visitPendingRecords = response.message;
            this.success = `Visit pending records loaded for ${this.selectedEngineer}`;
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
    this.selectedEngineer = '';
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
