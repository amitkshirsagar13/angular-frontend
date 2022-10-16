import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
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

  constructor(private productService: ProductService) { }

  isLoading = false;
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25];

  displayedColumns: string[] = [
    'id',
    'productName',
    'productDescription',
    'productMaterial',
    'description',
    'price',
    'department',
    'productImage',
    'createdAt'
  ];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  ngOnInit(): void {
    this.loadData();
    console.log('ngOnInit');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.dataSource.paginator = this.paginator;
    const sortState: Sort = {active: 'id', direction: 'asc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'createdAt': return new Date(item.createdAt).getTime();
        default: return item[property as keyof Product];
      }
    };
    this.dataSource.sort = this.sort;
  }

  loadData() {
    this.isLoading = true;
    this.productService.
      fetchProducts(this.sort.active, this.sort.direction, this.currentPage, this.pageSize)
      .subscribe({
        next: (response: PageResponse) => {
          this.dataSource.data = response.data;
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = response.totalRows;
            this.sort.sortChange.emit({active: this.sort.active, direction: this.sort.direction});
          });
          this.isLoading = false;
          console.log('loadData');
        },
        error: (error:any) => {
          console.log(error);
          this.isLoading = false;
        }
      });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

}
