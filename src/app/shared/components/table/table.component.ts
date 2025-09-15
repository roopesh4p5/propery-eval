import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
  sortable?: boolean;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading = false;
  @Input() showPagination = true;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Input() totalItems = 0;
  @Input() sortColumn: string | null = null;
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Input() selectable = false;
  @Input() selectedItems: any[] = [];

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{column: string, direction: 'asc' | 'desc'}>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();

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

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onSort(column: TableColumn): void {
    if (!column.sortable) return;
    
    const direction = this.sortColumn === column.key && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit({ column: column.key, direction });
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  isSelected(item: any): boolean {
    return this.selectedItems.some(selected => selected.id === item.id);
  }

  toggleSelection(event: Event, item: any): void {
    event.stopPropagation();
    
    const isSelected = this.isSelected(item);
    let newSelection: any[];
    
    if (isSelected) {
      newSelection = this.selectedItems.filter(selected => selected.id !== item.id);
    } else {
      newSelection = [...this.selectedItems, item];
    }
    
    this.selectionChange.emit(newSelection);
  }
}
