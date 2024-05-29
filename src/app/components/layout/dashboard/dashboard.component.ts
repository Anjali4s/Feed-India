import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { User } from '../../../models/user';
import { CookieServices } from '../../../services/cookie.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  user:User|null=null;

  constructor(private cookieService: CookieServices) { }

  ngOnInit(): void {
    this.user=JSON.parse(this.cookieService.getCookie('user')||'');
    console.log(this.user?.role?.role);
  }
}
