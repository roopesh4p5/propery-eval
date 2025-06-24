import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() hasHeader = true;
  @Input() hasFooter = false;
  @Input() padding = true;
  @Input() shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() border = true;
  @Input() rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() hover = false;

  get cardClasses(): string {
    const baseClasses = 'bg-white overflow-hidden';

    const shadowClasses = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    };

    const roundedClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl'
    };

    const borderClass = this.border ? 'border border-gray-200' : '';
    const hoverClass = this.hover ? 'transition-shadow duration-300 hover:shadow-lg' : '';

    return `${baseClasses} ${shadowClasses[this.shadow]} ${roundedClasses[this.rounded]} ${borderClass} ${hoverClass}`;
  }

  get bodyClasses(): string {
    return this.padding ? 'p-4' : '';
  }
}
