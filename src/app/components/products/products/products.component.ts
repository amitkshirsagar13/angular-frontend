import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageResponse } from 'src/app/models/pageResponse.model';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product/product.service';
import { InputError } from '../../common/utils/forms/error/error.model';
import { rangeValidator } from '../../common/utils/validators/range-validators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {

  constructor(private formBuilder: FormBuilder, private productService: ProductService) {
    console.log('constructor');
    this.createOrRecreateForm();
  }

  // Always create method createForm and call it from the constructor
  searchForm: FormGroup;
  get sfC(): any {
    return this.searchForm.controls
  }
  createOrRecreateForm() {
    console.log('createOrRecreateForm');
    this.searchForm = this.formBuilder
      .group(
        {
          productName: ['', Validators.minLength(5)],
          productMaterial: ['', { validators: Validators.maxLength(5), updateOn: 'change'}], 
          minPrice: ['', { validators: Validators.min(10) }], 
          maxPrice: ['', { validators: Validators.max(1000000) }], 
        }, 
        { validators: rangeValidator('minPrice', 'maxPrice'), updateOn: 'blur' }
      );
  }
  
  error(field: string|undefined): InputError {
    if(!field) {
      return {
        canShow: this.searchForm.dirty,
        items: this.searchForm.errors ? this.searchForm.errors : {},
        field: 'form'
      }
    }
    const control:any = this.searchForm.get(field);
    return {
      canShow: control.touched || control.dirty,
      items: control.errors ? control.errors : {},
      field
    };
  }

  isLoading = false;
  pageSize = 25;
  totalRows = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25];

  displayedColumns: string[] = [
    'id',
    'productName',
    'productMaterial',
    'price',
    'department',
    'productImage',
    'createdAt'
  ];

  dataSource: MatTableDataSource<Product> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort = new MatSort();

  ngOnInit(): void {
    console.log('ngOnInit');
    
    this.dataSource.filterPredicate = this.filterPredicate
    this.loadData();
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.dataSource.paginator = this.paginator;
    this.paginator.pageIndex = this.currentPage;
    this.paginator.length = this.dataSource.data.length;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'createdAt': return new Date(item.createdAt).getTime();
        default: return item[property as keyof Product];
      }
    };
    this.dataSource.sort = this.sort;
  }

  loadData() {
    console.log('loadData');
    this.isLoading = true;
    this.productService.
      fetchProducts(this.sort?.active ?? 'id', this.sort?.direction ?? 'asc', this.currentPage, this.pageSize)
      .subscribe({
        next: (response: PageResponse) => {
          this.dataSource.data = response.data;
          setTimeout(()=>{
            this.paginator.pageIndex = response.page - 1;
            this.paginator.length = response.totalRows;
          });
          this.isLoading = false;
        },
        error: (error:any) => {
          console.log(error);
          this.isLoading = false;
        }
      });
  }

  onPageChanged(event: PageEvent) {
    console.log('onPageChanged')
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  onSortChanged(event: Sort) {
    console.log('onSortChanged:', event.active, ":", event.direction)
    this.sort.active = event.active;
    this.sort.direction = event.direction;
    this.loadData();
  }

  filterPredicate = (data: any, filter: string) => {
    let showRecord = true;
    let searchTerms = JSON.parse(filter);
    
    if (showRecord && searchTerms.productName) {
      showRecord = false;
      if(searchTerms.productName === data.productName) {
        showRecord = true;
      }
    }

    if (showRecord && searchTerms.productMaterial) {
      showRecord = false;
      if(searchTerms.productMaterial === data.productMaterial) {
        showRecord = true;
      }
    }

    if (showRecord && searchTerms.price) {
      showRecord = false;
      if(searchTerms.price.min < data.price && searchTerms.price.max > data.price) {
        showRecord = true;
      }
    }

    return showRecord;
  }

  searchFn() {
    // Create searchTerms from the searchForm control fields
    const searchTerms = {
      productName: this.sfC.productName.value,
      productMaterial: this.sfC.productMaterial.value,
      price: this.sfC.minPrice.value || this.sfC.maxPrice.value ? {
        min: this.sfC.minPrice.value,
        max: this.sfC.maxPrice.value,
      }: undefined
    };

    console.log(searchTerms);
    
    this.dataSource.filter = JSON.stringify(searchTerms);
  }
}
