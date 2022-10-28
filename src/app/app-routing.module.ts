import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './components/products/product/product.component';
import { ProductsComponent } from './components/products/products/products.component';

const routes: Routes = [
  { path: 'product', component: ProductComponent  },
  { path: 'products', component: ProductsComponent  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
