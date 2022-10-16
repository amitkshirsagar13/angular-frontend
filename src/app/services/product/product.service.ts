import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PageResponse } from 'src/app/models/pageResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  backend: string = environment.backend;
  fetchProducts(sortActive: string, sortDirection:string, page: number, pageSize: number): Observable<PageResponse> {
    return this.httpClient
      .get<PageResponse>(this.backend + `/products?&page=${page+1}&pageSize=${pageSize}&sortBy=${sortActive}&orderBy=${sortDirection === "" ? 1:-1}`);
  }
}
