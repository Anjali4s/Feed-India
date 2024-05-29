import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { userType } from '../../../constants/usertypes';
import { AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { CookieServices } from '../../../services/cookie.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  userTypes:userType[]=Object.values(userType);

  passwordContainsNumber(control: AbstractControl) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,14}$/;
    if (passwordRegex.test(control.value)) {
      return null;
    } else {
      return { passwordInvalid: true };
    }

  }

  checkConfirmPassword():boolean{
    return this.signupForm.get('password')?.value === this.signupForm.get('confirmPassword')?.value;
  }


  signupForm: FormGroup = new FormGroup({
      signupAs: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),//new FormControl('', Validators.required),
      password: new FormControl('',[Validators.required, this.passwordContainsNumber]),
      confirmPassword: new FormControl('', [Validators.required]),//new FormControl('', [Validators.required]],
      city: new FormControl('', Validators.required),
      role: new FormGroup({
        id :new FormControl(''),
        role: new FormControl('')
      })
  });
  

  constructor(private formBuilder: FormBuilder,private user:UserService,private router:Router,private cookieService: CookieServices) {

   }

   ngOnInit(): void {
    if(this.user.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    
  }

  
  onSignup(): void {
    if(this.signupForm.invalid){
      return;
    }
    if(this.checkConfirmPassword()===false){
      this.signupForm.get('confirmPassword')?.setErrors({passwordMismatch:true});
      return;
    }
    if(this.signupForm.get('signupAs')?.value===userType.USER.toString()){
      this.signupForm.get('role')?.get('id')?.setValue('1');
    }else{
      this.signupForm.get('role')?.get('id')?.setValue('3');
    }
    this.user.signUp(this.signupForm.value).subscribe((data: User) => {
      this.cookieService.setAndUpdateCookie('user', JSON.stringify(data));
      const expires = new Date();
      expires.setHours(expires.getHours() + 1); 
      this.cookieService.deleteCookie('userExpirationTime');
      this.cookieService.setCookie('userExpirationTime', expires.toUTCString());
      if(this.cookieService.getCookie('user') !== null){
        this.router.navigate(['/']);
      }
    });;
    this.signupForm.reset();
    
  }
}
