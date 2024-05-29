import { Component } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { SimpleChanges } from '@angular/core';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgbModule,RouterModule, CommonModule, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isCollapsed = true;
  optionExpanded: boolean = false;

  constructor(private user:UserService) {  }

  onHover(): void {
    console.log("Hovered");
    this.optionExpanded = !this.optionExpanded
  }

  isLoggedIn(): boolean {
    return this.user.isLoggedIn();
  }


  logout(): void {
    this.user.logout();
  }

  
}
