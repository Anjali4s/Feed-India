import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import {Observable} from 'rxjs';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CookieServices } from '../services/cookie.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient,private cookieService: CookieServices, private router:Router) {
  }
  login(loginData: Partial<{
    username: string | null;
    password: string | null;
  }>): Observable<User> {
    return this.http.post<User>('/v1/api/login', loginData);
  }
  signUp(signupData: any): Observable<User> {
    console.log(signupData)
    return this.http.post<User>('/v1/api/register', signupData);
  }

  loadUser(): void {
    this.http.get<User>('/v1/api/load/user')
    .subscribe((data: User) => {
      this.cookieService.setCookie('user', JSON.stringify(data));
      
    })
  }

  logout(): void {
    this.http.post('/v1/api/logout', {}).pipe(catchError(error => {
      return throwError(error);
    })).subscribe((data:any) => {
      this.cookieService.deleteCookie('user');
      this.cookieService.deleteCookie('userExpirationTime');
      this.router.navigate(['/login']);
    })
  }

  updateUser(id:number,user: any): Observable<User> {
    console.log(user);
    return this.http.put<User>(`/v1/api/user/update/${id}`, user);
  }

  isLoggedIn(): boolean {
    return this.cookieService.checkCookie('user');
  }


}
