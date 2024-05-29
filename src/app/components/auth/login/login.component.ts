import { Component } from '@angular/core';
import { ReactiveFormsModule,FormControl, FormGroup,  Validators  } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { RouterLink } from '@angular/router';
import { AbstractControl } from '@angular/forms';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { CookieServices } from '../../../services/cookie.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  error:string|null=null;


  passwordContainsNumber(control: AbstractControl) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,14}$/;
    if (passwordRegex.test(control.value)) {
      return null;
    } else {
      return { passwordInvalid: true };
    }

  }

  
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required,this.passwordContainsNumber]),
    terms: new FormControl(false, Validators.required)
  });

  

  constructor(private user:UserService, private router:Router,private cookieService: CookieServices) {
    
  }
 

  isLoggedIn(): boolean {
    return this.cookieService.checkCookie('user');
  }

  onLogin() {
    console.log("called")
    console.log(this.loginForm.value);
    this.user.login(this.loginForm.value)
    .pipe(catchError(error => {
      this.error=error.error.message;
      setTimeout(() => {
        this.error = null;
      }, 2000);
      return throwError(error);
    }))
    .subscribe((data: User) => {
      this.cookieService.setAndUpdateCookie('user', JSON.stringify(data));
      const expires = new Date();
      expires.setHours(expires.getHours() + 1); 
      this.cookieService.deleteCookie('userExpirationTime');
      this.cookieService.setCookie('userExpirationTime', expires.toUTCString());
      if(this.cookieService.checkCookie('user')) {
        this.router.navigate(['/']);
      }
    });

    this.loginForm.reset();
  }

  ngOnInit(): void {
    if(this.user.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    
  }
}
