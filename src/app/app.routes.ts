import { Routes } from '@angular/router';
import { OlympicDataComponent } from './components/olympic-data/olympic-data.component';
import { ProductComponent } from './components/product/product.component';
import { EquityComponent } from './components/equity/equity.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "data",
        pathMatch: "full"
    },
    {
        path: "data",
        component: OlympicDataComponent
    },
    {
        path: "products",
        component: ProductComponent
    },
    {
        path: 'equities',
        component: EquityComponent
    }
];
