import { Injectable } from '@angular/core';
import decode from 'jwt-decode';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: "root"
})
export class AuthService {

  public getToken(): any {
    return localStorage.getItem('id_token');
  }
  
  public isAuthenticated(): boolean {
    const helper = new JwtHelperService();
    // get the token
    const token = this.getToken();
    // console.log(token)
    // console.log(helper.isTokenExpired(token))
    // return a boolean indicating whether or not the token is expired
    // return helper.isTokenExpired(token)
    return token ? true : false;
  }

}