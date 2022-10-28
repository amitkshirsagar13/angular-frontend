import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductsComponent } from './components/products/products/products.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MaterialCustomModule } from 'src/material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './components/common/header/header.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { ProductComponent } from './components/products/product/product.component';
import { MenuComponent } from './components/menus/menu/menu.component';
import { MenuSidenavComponent } from './components/menus/menu-sidenav/menu-sidenav.component';
import { FileUploadComponent } from './components/common/utils/forms/file-upload/file-upload.component';
import { ProgressComponent } from './components/common/utils/progress/progress.component';


@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    MenuComponent,
    ProductComponent,
    HeaderComponent,
    FooterComponent,
    MenuSidenavComponent,
    FileUploadComponent,
    ProgressComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MaterialCustomModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSidenavModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
