import { Component } from '@angular/core';
import { IProduct } from '../../interfaces/iproduct';
import { ProductsService } from '../../services/products.service';
import { ColDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from '../action-cell-renderer/action-cell-renderer.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AgGenericGridComponent } from '../../shared/ag-generic-grid/ag-generic-grid.component';
import { FormModalComponent } from '../../shared/form-modal/form-modal.component';
import { productFormFields } from '../../utils/productFormFields';

@Component({
  selector: 'app-product',
  imports: [AgGenericGridComponent, MatDialogModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  products: IProduct[] = [];

  constructor(private productService: ProductsService, 
    private dialog: MatDialog
  ) {}

  colDefs: ColDef[] = [
    { field: 'id' },
    { field: 'title'},
    { field: 'price' },
    { field: 'description' },
    { field: 'category' },
    {
      headerName: 'Actions',
      cellRenderer: ActionCellRendererComponent,
      cellRendererParams: {
        onEdit: (id: string) => this.updateProduct(id),
        onDelete: (id: string) => this.deleteProduct(id),
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
  };

  pagination: boolean = true;
  paginationPageSize: number = 10;
  paginationPageSizeSelector: number[] = [5, 10, 20];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products: IProduct[]) => {
        this.products = products;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(FormModalComponent, {
      data: {
        formFields: productFormFields,
        initialValues: {},
      },
    });

    dialogRef.afterClosed().subscribe((result: IProduct) => {
      if (result) {
        const newProduct = { ...result };
        this.productService.createProduct(newProduct).subscribe({
          next: () => this.loadProducts(),
          error: (err) => console.error('Error creating product:', err),
        });
      }
    });
  }

  updateProduct(id: string): void {
    const record = this.products.find((product) => product.id === id);
    console.log('Record:', record);
    if (record) {
      const dialogRef = this.dialog.open(FormModalComponent, {
        data: {
          formFields: productFormFields,
          initialValues: {
            title: record.title,
            price: record.price,
            description: record.description,
            category: record.category,
          },
        },
      });
  
      dialogRef.afterClosed().subscribe((result: IProduct) => {
        if (result) {
          this.productService.updateProduct(id, result).subscribe({
            next: () => this.loadProducts(),
            error: (err) => console.error('Error updating product:', err),
          });
        }
      });
    }
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error('Error deleting product:', err),
    });
  }
}
