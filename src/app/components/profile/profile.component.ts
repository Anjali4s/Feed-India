import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { CookieServices } from '../../services/cookie.service';
import { DashboardComponent } from '../layout/dashboard/dashboard.component';
import { User } from '../../models/user';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DashboardComponent, CommonModule, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  showDashboard: boolean = window.innerWidth > 830 ? true : false;
  mobileView: boolean = window.innerWidth < 830 ? true : false;
  role: string = '';
  id: number = 0;
  userDetail: User |null=null;
  profileForm: FormGroup<any> = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    dob: new FormControl(''),
    phone: new FormControl(''),
    userDetail: new FormControl('')
  })

  constructor(private cookieService: CookieServices, private user: UserService, private router: Router, private datePipe: DatePipe) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.showDashboard = event.target.innerWidth > 830;
    this.mobileView = event.target.innerWidth < 830;
  }

  toggleDashboard(): void {
    this.showDashboard = !this.showDashboard
  }

  updateProfileForm(){
    this.profileForm.patchValue({
      name: this.userDetail?.name,
      email: this.userDetail?.email,
      city: this.userDetail?.city,
      dob: this.userDetail?.dob,
      phone: this.userDetail?.phone,
      userDetail: this.userDetail?.userDetail
    }); 
  }

  updateProfile(id: number) {
    if (this.profileForm.invalid) { return; }
    if (this.profileForm.value.dob) {
      this.profileForm.value.dob = this.datePipe.transform(this.profileForm.value.dob, 'yyyy-MM-dd')
    };
    this.user.updateUser(id, this.profileForm.value).subscribe((data: User) => {
      let expires=new Date(this.cookieService.getCookie('userExpirationTime') || '');
      let options = {expires: expires,sameSite: 'Strict'};
      this.cookieService.deleteCookie('user');
      this.cookieService.setCookie('user', JSON.stringify(data),options);
      this.userDetail=data;
      this.updateProfileForm();
    })
  }

  ngOnInit(): void {
    if (this.user.isLoggedIn()) {
      this.userDetail= JSON.parse(this.cookieService.getCookie('user') || '');
      this.role = this.userDetail?.role.role || '';
      this.id = this.userDetail?.id || 0;
      this.updateProfileForm();      
    } else {
      this.router.navigate(['/login']);
    }
  }
}
