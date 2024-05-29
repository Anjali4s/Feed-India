import { CommonModule,DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import {ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import { FoodType } from '../../constants/foodtype';
import { FoodrequestService } from '../../services/foodrequest.service';
import { FoodRequest } from '../../models/foodrequest';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-request',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './request-food.component.html',
  styleUrl: './request-food.component.css'
})
export class RequestFoodComponent {
  foodTypes:FoodType[] = Object.values(FoodType);
  datePipe = new DatePipe('en-US');
  id:number|null = null;


  requestForm = new FormGroup({
    foodType:new FormControl(FoodType.VEG),
    city: new FormControl('',Validators.required),
    pickupDate: new FormControl('',Validators.required),
    pickupTime: new FormControl('',Validators.required),
    amount: new FormControl('',Validators.required),
    fullfilled: new FormControl(false),
    pickupAddress: new FormControl('',Validators.required),
    message: new FormControl('',Validators.required),
    user: new FormGroup({
      id: new FormControl(0,Validators.required),
    })
  });


  constructor(private request:FoodrequestService,private cookieService: CookieService,private user:UserService,private router:Router) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(this.user.isLoggedIn()){
      this.id=JSON.parse(this.cookieService.get('user'))?.id;
      this.requestForm.patchValue({
        user: {
          id: this.id
        }
      });
    }
  }
  onSubmit(): void {
    if(!this.user.isLoggedIn()){
      this.router.navigate(['/login']);
      return;
    }
    let pickupDateControl = this.requestForm.get('pickupDate');
    let pickupTimeControl = this.requestForm.get('pickupTime');
    let cityControl = this.requestForm.get('city');
    if (pickupDateControl) {
        var sqlDate = this.datePipe.transform(pickupDateControl.value, 'yyyy-MM-dd');
        pickupDateControl.setValue(sqlDate);
        console.log(sqlDate);
    }

    if(pickupTimeControl){
      var sqlTime = pickupTimeControl.value+":00";
      pickupTimeControl.setValue(sqlTime);
      console.log(sqlTime);
    }

    if(cityControl){
      cityControl.setValue(cityControl.value?.toLocaleLowerCase() || '');
    }

    this.request.requestFood(this.requestForm.value).subscribe((data:FoodRequest)=>{
      console.log("donated",data);
    })

    this.requestForm.reset();
    
}
}
