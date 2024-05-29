import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieServices } from '../cookie.service';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router, private user: UserService,private cookie:CookieServices) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isLoggedIn = this.user.isLoggedIn();
    if (isLoggedIn) {
      const role = this.cookie.checkCookie('user') ? JSON.parse(this.cookie.getCookie('user') || '').role.role : '';
      return role==="ADMIN";
    } else {
      this.router.navigate(['/login']);  // Redirect to login page if not logged in
      return false;
    }
  }
}
