import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Supplier } from '../models/Supplier';

@Injectable({
  providedIn: 'root',
})

export class SupplierService {
  API_URL: string = 'http://localhost:5000/api/suppliers';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  
  constructor(private httpClient: HttpClient) {}
  
  // get
  get() {
    const apiUrl = `${this.API_URL}/`;
    return this.httpClient.get(apiUrl);
  }

  // get by id
  getById(id: any): Observable<any> {
    const apiUrl = `${this.API_URL}/${id}`;
    return this.httpClient.get(apiUrl);
  }

  // create
  create(data: Supplier): Observable<any> {
    const apiUrl = `${this.API_URL}/`;
    return this.httpClient.post(apiUrl, data, this.httpOptions)
  }
  
  // update
  update(id: any, data: Supplier): Observable<any> {
    const apiUrl = `${this.API_URL}/${id}`;
    return this.httpClient.put(apiUrl, data, this.httpOptions)
  }
  // delete
  delete(id: any): Observable<any> {
    const apiUrl = `${this.API_URL}/${id}`;
    return this.httpClient.delete(apiUrl, this.httpOptions)
  }
 
  
}