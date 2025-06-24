import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AlertComponent {
  @Input() type: 'success' | 'info' | 'warning' | 'error' = 'info';
  @Input() message = '';
  @Input() title = '';
  @Input() dismissible = true;
  @Input() icon = true;
  @Input() bordered = false;
  @Input() rounded = true;

  @Output() dismissed = new EventEmitter<void>();

  visible = true;

  dismiss(): void {
    this.visible = false;
    this.dismissed.emit();
  }

  get alertClasses(): string {
    const baseClasses = 'p-4';

    const typeClasses = {
      success: 'bg-green-50 text-green-800',
      info: 'bg-blue-50 text-blue-800',
      warning: 'bg-yellow-50 text-yellow-800',
      error: 'bg-red-50 text-red-800'
    };

    const borderClasses = {
      success: this.bordered ? 'border border-green-300' : '',
      info: this.bordered ? 'border border-blue-300' : '',
      warning: this.bordered ? 'border border-yellow-300' : '',
      error: this.bordered ? 'border border-red-300' : ''
    };

    const roundedClass = this.rounded ? 'rounded-md' : '';

    return `${baseClasses} ${typeClasses[this.type]} ${borderClasses[this.type]} ${roundedClass}`;
  }

  get iconClass(): string {
    const iconClasses = {
      success: 'text-green-400',
      info: 'text-blue-400',
      warning: 'text-yellow-400',
      error: 'text-red-400'
    };

    return iconClasses[this.type];
  }
}
