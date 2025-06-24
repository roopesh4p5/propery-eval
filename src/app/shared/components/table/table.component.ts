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
