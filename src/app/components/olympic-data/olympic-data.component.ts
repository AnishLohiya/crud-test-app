import { Component } from '@angular/core';
import { IOlympicData } from '../../interfaces/iolympic-data';
import { OlympicsDataService } from '../../services/olympics-data.service';
import { CellClassParams, ColDef, ExcelStyle, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { ActionCellRendererComponent } from '../action-cell-renderer/action-cell-renderer.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AgGenericGridComponent } from '../../shared/ag-generic-grid/ag-generic-grid.component';
import { FormModalComponent } from '../../shared/form-modal/form-modal.component';
import { olympicDataFormFields } from '../../utils/olympicDataFormFields';
import { filterDateParams } from '../../shared/cell-params/DateParams';
import { formatDateToDDMMYYYY, formatDateToYYYYMMDD } from '../../shared/functions/shared-functions';
import 'ag-grid-enterprise'
import { AgGridAngular } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-olympic-data',
  imports: [AgGenericGridComponent, MatDialogModule, AgGridAngular, MatIconModule],
  templateUrl: './olympic-data.component.html',
  styleUrl: './olympic-data.component.scss',
})
export class OlympicDataComponent {
  olympicData: IOlympicData[] = [];

  constructor(
    private olympicDataService: OlympicsDataService,
    private dialog: MatDialog
  ) { }

  colDefs: ColDef[] = [
    { field: 'athlete', filter: 'agTextColumnFilter', },
    { field: 'country', filter: 'agTextColumnFilter',
      cellClassRules: {
        redFont: (params) => {
          return params.value === "United States";
        },
      },
    },
    { field: 'sport', filter: 'agTextColumnFilter' },
    { field: 'age', flex: 0.8, filter: 'agNumberColumnFilter' },
    {
      field: 'year', flex: 0.8, 
      filter: 'agNumberColumnFilter',
      cellClass: ["redFont", "greenBackground"],
    },
    {
      field: 'date',
      filter: 'agDateColumnFilter',
      filterParams: filterDateParams,
      flex: 1.6,
    },
    { field: 'gold', cellClass: 'gold-cell', flex: 0.8 },
    { field: 'silver', cellClass: 'silver-cell', flex: 0.8 },
    { field: 'bronze', cellClass: 'bronze-cell', flex: 0.8 },
    { field: 'total', cellClass: 'total-cell', flex: 0.8 },
    {
      headerName: 'Actions',
      cellRenderer: ActionCellRendererComponent,
      cellRendererParams: {
        onEdit: (id: string) => this.updateOlympicRecord(id),
        onDelete: (id: number) => this.deleteOlympicRecord(id),
      },
      filter: false,
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    filter: true,
    floatingFilter: true,
    editable: true,
    cellClassRules: {
      darkGreyBackground: (params: CellClassParams) => {
        return params.data.id === "99e5"
      },
    },
  };

  
  public excelStyles: ExcelStyle[] = [
    {
      id: "cell",
      alignment: {
        vertical: "Center",
      },
    },
    {
      id: "greenBackground",
      interior: {
        color: "#b5e6b5",
        pattern: "Solid",
      },
    },
    {
      id: "redFont",
      font: {
        fontName: "Calibri Light",
        underline: "Single",
        italic: true,
        color: "#BB0000",
      },
    },
    {
      id: "darkGreyBackground",
      interior: {
        color: "#888888",
        pattern: "Solid",
      },
      font: {
        fontName: "Calibri Light",
        color: "#ffffff",
      },
    },
  ];

  gridOptions: GridOptions = {
   
  }
  
  
  // During export:
 
  pagination: boolean = true;
  paginationPageSize: number = 50;
  paginationPageSizeSelector: number[] = [20, 50, 100, 500];

  ngOnInit(): void {
    this.loadOlympicsData();
  }
  private gridApi!: GridApi<IOlympicData>;

  onCsvExport() {
    this.gridApi.exportDataAsCsv();
  }

  onExcelExport() {
    this.gridApi.exportDataAsExcel();
  }
   onGridReady(params: GridReadyEvent<IOlympicData>) {
      this.gridApi = params.api;
  
      // this.gridApi.setGridOption('datasource', this.dataSource);
      // console.log(this.dataSource);
      // this.gridApi.sizeColumnsToFit();
      // const toolPanelInstance = params.api.getToolPanelInstance('filters');
      // if (toolPanelInstance) {
      //   toolPanelInstance.expandFilters();
      // }
    }

  loadOlympicsData(): void {
    this.olympicDataService.getOlympicsData().subscribe({
      next: (data: IOlympicData[]) => {
        this.olympicData = data;
      },
      error: (err: Error) => {
        console.error(err);
      },
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(FormModalComponent, {
      data: {
        formFields: olympicDataFormFields,
        initialValues: {},
      },
    });

    dialogRef.afterClosed().subscribe((result: IOlympicData) => {
      const date = formatDateToDDMMYYYY(result.date);
      result = { ...result, date };
      console.log('result', result);
      if (result) {
        this.olympicDataService.createOlympicData(result).subscribe({
          next: () => this.loadOlympicsData(),
          error: (err) => console.error(err),
        });
      }
    });
  }

  updateOlympicRecord(id: string): void {
    const record = this.olympicData.find((item) => item.id === id);
    console.log('record', record);
    if (record) {
      const dialogRef = this.dialog.open(FormModalComponent, {
        data: {
          formFields: olympicDataFormFields,
          initialValues: {
            ...record,
            date: formatDateToYYYYMMDD(record.date),
          }
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        const date = formatDateToDDMMYYYY(result.date);
        result = { ...result, date };
        console.log('result', result);
        if (result) {
          this.olympicDataService.updateOlympicData(id, result).subscribe({
            next: () => this.loadOlympicsData(),
            error: (err) => console.error(err),
          });
        }
      });
    }
  }

  deleteOlympicRecord(id: number): void {
    this.olympicDataService.deleteOlympicData(id).subscribe({
      next: () => {
        this.loadOlympicsData();
      },
      error: (err: Error) => {
        console.error(err);
      },
    });
  }



}