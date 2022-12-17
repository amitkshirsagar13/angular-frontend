import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageResponse } from 'src/app/models/pageResponse.model';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  constructor(private formBuilder: FormBuilder, private productService: ProductService) {
    console.log('constructor');
    this.createForm();
  }

  searchForm: FormGroup;
  createForm() {
    console.log('createForm');
    this.searchForm = this.formBuilder.group({
      productName: [''],
      productMaterial: [''],
    });
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

}
