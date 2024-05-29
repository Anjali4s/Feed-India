import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieServices {

  constructor(private cookieService: CookieService) { }

  setCookie(key:string,value:any,options?:any): void {
    if(options === undefined) {
      const expires = new Date();
      expires.setHours(expires.getHours() + 1); 
      options = {expires: expires,sameSite: 'Strict'};
    }
    if(!this.checkCookie(key)) {
      this.cookieService.set(key, value, options);
    }  
  }

  setAndUpdateCookie(key:string,value:any,options?:any): void {
    if(this.checkCookie(key)) {
      this.deleteCookie(key);
    }
    if(options === undefined) {
      const expires = new Date();
      expires.setHours(expires.getHours() + 1); 
      options = {expires: expires,sameSite: 'Strict'};
    }
    this.setCookie(key,value,options);
  }

  deleteCookie(key:string): void {
    this.cookieService.delete(key);
  }

  getCookie(key:string): string|null {
    return this.cookieService.get(key);
  }

  checkCookie(key:string): boolean {
    return this.cookieService.check(key);
  }
}
