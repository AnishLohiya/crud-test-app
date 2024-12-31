import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-multi-select',
  imports: [],
  template: ` <div class="dropdown">
    <input type="text" (input)="onSearchChange($event)" placeholder="Search" class="dropdown-input"/>
    @for(value of filteredValues; track value) {
    <div class="item">
      <input
        type="checkbox"
        [checked]="selectedValues.includes(value)"
        (change)="onCheckboxChange(value)"
      />
      <label>{{ value }}</label>
    </div>
    }
  </div>`,
  styles: [
    `
      .dropdown {
        margin-top: 45px;
        max-height: 220px;
        overflow-y: auto;
        padding: 10px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 6px;
      }
      .item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      .dropdown-input {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    `,
  ],
})
export class MultiSelectComponent implements ICellEditorAngularComp {
  params: any;
  selectedValues: any[] = [];
  filteredValues: any[] = [];

  agInit(params: any): void {
    this.params = params;
    this.selectedValues = [...(params.value || [])];
    this.filteredValues = [...params.values];
  }

  getValue(): any {
    return this.selectedValues;
  }

  isPopup(): boolean {
    return true;
  }

  onCheckboxChange(value: any): void {
    if (this.selectedValues.includes(value)) {
      this.selectedValues = this.selectedValues.filter((v) => v !== value);
    } else {
      this.selectedValues.push(value);
    }
  }

  onSearchChange(event: any): void {
    const searchCol = (event.target as HTMLInputElement).value;

    this.filteredValues = this.params.values.filter((col: any) =>
      col.toLowerCase().includes(searchCol.toLowerCase())
    );

  }




}
