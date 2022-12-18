import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class StaticsService {
  API_URL: string = 'http://localhost:5000/api/statics';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  
  constructor(private httpClient: HttpClient) {}
  
  // getTotalProductSales
  getTotalProductSales() {
    const apiUrl = `${this.API_URL}/get-total-product-sales`;
    return this.httpClient.get(apiUrl);
  }

  // getTotalProducts
  getTotalProducts() {
    const apiUrl = `${this.API_URL}/get-total-products`;
    return this.httpClient.get(apiUrl);
  }

  // getTotalCustomers
  getTotalCustomers() {
    const apiUrl = `${this.API_URL}/get-total-customers`;
    return this.httpClient.get(apiUrl);
  }

  // getTotalOrders
  getTotalOrders() {
    const apiUrl = `${this.API_URL}/get-total-orders`;
    return this.httpClient.get(apiUrl);
  }

  
}