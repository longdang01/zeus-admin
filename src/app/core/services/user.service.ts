import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/User';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  
  API_URL: string = 'http://localhost:5000/api/users';

  constructor(private httpClient: HttpClient,private auth: AuthService) {}
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }
  
  // get me
  getMe(): Observable<any> {
    const apiUrl = `${this.API_URL}/me`;
    return this.httpClient.get(apiUrl);
  }

  // register
  register(data: User): Observable<any> {
    const apiUrl = `${this.API_URL}/`;
    return this.httpClient.post(apiUrl, data, this.httpOptions)
  }

  // login
  login(data: User): Observable<any> {
    const apiUrl = `${this.API_URL}/login`;
    return this.httpClient.post(apiUrl, data, this.httpOptions).pipe(
      tap((res: any) => localStorage.setItem("id_token", res.token))
    );
  }
}