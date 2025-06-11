import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { UserService } from './services/user.service';
import { CsrfService } from './services/csrf.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'feedIndia';

  // user: UserService;

  constructor( private csrf: CsrfService){
    // this.user = new UserService(); // Initialize UserService instance
  }

  // constructor( private csrf: CsrfService, user:UserService,){
  //   this.user = user; // Assign the UserService instance to 'user'
  // }

  ngOnInit(): void {
    this.csrf.fetchCsrfToken(); // Fetch CSRF token on app load
    // this.user.loadUser();
  }
}
