import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class UploadService {
  API_URL: string = 'http://localhost:5000/api/upload';

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   })
  // }
  
  constructor(private httpClient: HttpClient) {}
  
  // upload
  upload(image: any): Observable<any> {
    const apiUrl = `${this.API_URL}/`;
    const formData = new FormData();
    formData.append('image', image);

    return this.httpClient.post(apiUrl, formData)
  }
  
  
}