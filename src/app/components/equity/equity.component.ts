import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { IEquity } from '../../interfaces/iequity';
import { EquityService } from '../../services/equity/equity.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent, SideBarDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from '../action-cell-renderer/action-cell-renderer.component';
import { FormModalComponent } from '../../shared/form-modal/form-modal.component';
import { equityFormFields } from '../../utils/equityFormFields';
import { formatDateToDDMMYYYY, formatDateToYYYYMMDD } from '../../shared/functions/shared-functions';
import { AgGridAngular } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { marketCapValues } from '../../utils/drop-down/market-cap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-equity',
  imports: [MatDialogModule, AgGridAngular, FormsModule, MatFormFieldModule, MatIconModule, MatInputModule, NgFor],
  templateUrl: './equity.component.html',
  styleUrl: './equity.component.scss'
})
export class EquityComponent {

  equities: IEquity[] = [];
  private gridApi!: GridApi<IEquity>;
  searchCol: string = '';
  jsonFilePath: string = 'presets.json';
  filtersList: { name: string; state: { filterModel: any; columnState: any[] } }[] = [];

  constructor(private equityService: EquityService, private dialog: MatDialog,
    private http: HttpClient
  ) { }

  colDefs: ColDef[] = [
    { field: 'id', filter: 'agTextColumnFilter' },
    { field: 'company_name' },
    { field: 'stock_symbol' },
    {
      field: 'purchase_date', filter: 'agDateColumnFilter',
    },
    {
      field: 'sale_date', filter: 'agDateColumnFilter',
    },
    { field: 'stock_name' },
    { field: 'stock_sector' },
    {
      field: 'stock_industry',
      cellRenderer: (params: any) => params.data.stock_industry,
    },
    {
      field: 'stock_market_cap',
      cellRenderer: (params: any) => params.data.stock_market_cap,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        values: marketCapValues,
        cellRender: (params: any) => params.value,
      }
    },
    { field: 'purchase_price' },
    { field: 'sale_price' },
    { field: 'profit' },
    { field: 'quantity' },
    { field: 'dividend_yield' },
    { field: 'earnings_per_share' },
    { field: 'revenue' },
    { field: 'expenses' },
    { field: 'net_income' },
    { field: 'market_price' },
    { field: 'market_capitalization' },
    { field: 'outstanding_shares' },
    { field: 'equity_ratio' },
    { field: 'debt_ratio' },
    { field: 'return_on_equity' },
    { field: 'price_to_earnings_ratio' },
    { field: 'price_to_sales_ratio' },
    { field: 'price_to_book_ratio' },
    { field: 'beta' },
    { field: 'volatility' },
    { field: 'dividend_payout_ratio' },
    {
      headerName: 'Actions',
      cellRenderer: ActionCellRendererComponent,
      cellRendererParams: {
        onEdit: (id: string) => this.updateEquity(id),
        onDelete: (id: string) => this.deleteEquity(id),
      },
      minWidth: 150,
      filter: false,
      editable: false,
    },
  ];

  cellClassRules = {
    'highlight-cell': (params: any) => params.data && params.data[`${params.colDef.field}Highlight`],
  };

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    filter: true,
    floatingFilter: true,
    editable: true,
  };

  pagination: boolean = true;
  paginationPageSize: number = 20;
  paginationPageSizeSelector: number[] = [20, 50, 100, 200];

  ngOnInit(): void {
    this.loadEquities();
    this.loadPresets();
  }

  loadEquities() {
    this.equityService.getEquities().subscribe({
      next: (equities: IEquity[]) => {
        this.equities = equities;
      },
      error: (err) => {
        console.error('Error loading equities', err);
      }
    })
  }


  openCreateModal() {
    const dialogRef = this.dialog.open(FormModalComponent, {
      data: {
        formFields: equityFormFields,
        initialValues: {},
      },
    });

    dialogRef.afterClosed().subscribe((result: IEquity) => {
      console.log('result', result);
      const purchase_date = formatDateToDDMMYYYY(result.purchase_date);
      const sale_date = formatDateToDDMMYYYY(result.sale_date);
      result = { ...result, purchase_date, sale_date };
      if (result) {
        this.equityService.createEquity(result).subscribe({
          next: () => this.loadEquities(),
          error: (err) => console.error(err),
        });
      }
    });
  }

  updateEquity(id: string) {
    this.equityService.getEquityById(id).subscribe({
      next: (equity: IEquity) => {
        const dialogRef = this.dialog.open(FormModalComponent, {
          data: {
            formFields: equityFormFields,
            initialValues: {
              ...equity,
              purchase_date: formatDateToYYYYMMDD(equity.purchase_date),
              sale_date: formatDateToYYYYMMDD(equity.sale_date),
            }
          },
        });
        console.log('equity', equity);
        dialogRef.afterClosed().subscribe((result: IEquity) => {
          const purchase_date = formatDateToDDMMYYYY(result.purchase_date);
          const sale_date = formatDateToDDMMYYYY(result.sale_date);
          result = { ...result, purchase_date, sale_date };
          console.log('result', result);
          if (result) {
            this.equityService.updateEquity(id, result).subscribe({
              next: () => {
                this.loadEquities();
              },
              error: (err) => {
                console.error('Error updating equity', err);
              }
            });
          }
        });
      },
      error: (err) => {
        console.error('Error loading equity', err);
      }
    });
  }

  deleteEquity(id: string) {
    this.equityService.deleteEquity(id).subscribe({
      next: () => {
        this.loadEquities();
      },
      error: (err) => {
        console.error('Error deleting equity', err);
      }
    });
  }

  onCellValueChanged(params: any) {
    this.equityService.updateEquity(params.data.id, params.data).subscribe({
      next: () => {
        this.loadEquities();
      },
      error: (err) => {
        console.error('Error updating equity', err);
      }
    });
  }

  onBtExport() {
    this.gridApi.exportDataAsExcel();
  }

  public sideBar: SideBarDef | string | string[] | boolean | null = "filters";

  onGridReady(params: GridReadyEvent<IEquity>) {
    this.gridApi = params.api;

    // const toolPanelInstance = params.api.getToolPanelInstance('filters');
    // if (toolPanelInstance) {
    //   toolPanelInstance.expandFilters();
    // }
  }



  clearFilters() {
    this.gridApi.setFilterModel(null);
    this.gridApi.resetColumnState();
    document.getElementsByTagName('select')[0].selectedIndex = 0;
  }

  onSearchColumn() {
    const cols = this.gridApi.getAllGridColumns();

    const searchedCols = cols.filter((col) => col.getColId().toLowerCase().includes(this.searchCol.toLowerCase()));
    if (searchedCols.length > 0) {
      this.gridApi.moveColumns(searchedCols, 4);
    }

    console.log(this.gridApi.getColumnState());
  }

  // saveFilterModel() {
  //   const filterModel = this.gridApi.getFilterModel();
  //   const columnState = this.gridApi.getColumnState();

  //   if (Object.keys(filterModel).length > 0 || columnState.length > 0) {
  //     const filterName = prompt("Enter a name for the filter:");
  //     if (filterName) {
  //       this.filtersList.push({ name: filterName, state: { filterModel, columnState } });
  //       console.log('filtersList', this.filtersList);   
  //     }
  //     this.clearFilters();
  //   } else {
  //     alert("No filters to save.");
  //   }
  // }

  loadPresets() {
    this.http.get('http://localhost:8000/presets').subscribe({
      next: (data: any) => {
        this.filtersList = data;
        console.log('filtersList', this.filtersList);
      },
      error: (err) => {
        console.error('Error loading presets', err);
      }
    });
  }

  saveFilterModel() {
    const filterModel = this.gridApi.getFilterModel();
    const columnState = this.gridApi.getColumnState();

    if (Object.keys(filterModel).length > 0 || columnState.length > 0) {
      const filterName = prompt("Enter a name for the filter:");
      if (filterName) {
        const newPreset = { name: filterName, state: { filterModel, columnState } };
        this.http.post('http://localhost:8000/presets', newPreset).subscribe({
          next: () => {
            this.filtersList.push(newPreset);
            console.log('filtersList', this.filtersList);
          },
          error: (err) => {
            console.error('Error saving filter', err);
          }
        });
      }
      this.clearFilters();
    } else {
      alert("No filters to save.");
    }
  }

  applySavedFilter(event: Event) {
    const name = (event.target as HTMLSelectElement).value;
    console.log('Selected filter name:', name);

    const selectedFilter = this.filtersList.find(filter => filter.name === name);
    console.log('Selected filter object:', selectedFilter);

    if (selectedFilter) {
      this.gridApi.setFilterModel(selectedFilter.state.filterModel);
      this.gridApi.applyColumnState({ state: selectedFilter.state.columnState, applyOrder: true });
    }
  }

  // only to view the saved filters
  // updateSavedFiltersDisplay() {
  //   const filterNames = this.filtersList.map(filter => filter.name).join(", ") || "(none)";
  //   (document.querySelector("#savedFilters") as any).textContent = filterNames;
  // }

}
