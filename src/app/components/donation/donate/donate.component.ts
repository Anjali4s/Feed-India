import { CommonModule,DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import { FoodType } from '../../../constants/foodtype';
import { FoodService } from '../../../services/food.service';
import { Food } from '../../../models/food';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from '../../../models/transaction';

@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule,FormsModule],
  templateUrl: './donate.component.html',
  styleUrl: './donate.component.css'
})
export class DonateComponent {

  foodTypes:FoodType[] = Object.values(FoodType);
  datePipe = new DatePipe('en-US');
  id:number|null = null;
  amount:number = 0;
  modalRef: any;


  foodForm = new FormGroup({
    foodName: new FormControl('',Validators.required),
    foodType:new FormControl(FoodType.VEG),
    city: new FormControl('',Validators.required),
    pickupDate: new FormControl('',Validators.required),
    pickupTime: new FormControl('',Validators.required),
    amount: new FormControl('',Validators.required),
    available: new FormControl(true),
    pickupAddress: new FormControl('',Validators.required),
    user: new FormGroup({
      id: new FormControl(0,Validators.required),
    })
  });


  constructor(private food:FoodService,private cookieService: CookieService, private user:UserService, private router:Router,private modalService: NgbModal, private transaction:TransactionService) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(this.user.isLoggedIn()){
      this.id=JSON.parse(this.cookieService.get('user'))?.id;
      this.foodForm.patchValue({
        user: {
          id: this.id
        }
      });
      
    }
  }

  completeTransaction(){
    if(!this.user.isLoggedIn()){
      this.modalRef.close();
      this.router.navigate(['/login']);
      return;
    }
    let currentDate = new Date();
    let sqlDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    const transaction = {
      amount: this.amount,
      donationDateTime:sqlDate,
      status:"SUCCESS",
      donor:{
        id: this.id
      }
    }
    this.transaction.createTransaction(transaction).subscribe((data:Transaction)=>{
      console.log("transaction completed",data);
    })

    this.modalRef.close();

  }


  open(content:any) {
    this.modalRef =this.modalService.open(content, {centered: true});
  }


  onSubmit(): void {
    if(!this.user.isLoggedIn()){
      this.router.navigate(['/login']);
      return;
    }
    let pickupDateControl = this.foodForm.get('pickupDate');
    let pickupTimeControl = this.foodForm.get('pickupTime');
    let cityControl = this.foodForm.get('city');
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

    console.log(this.foodForm.value);

    this.food.donateFood(this.foodForm.value).subscribe((data:Food)=>{
      console.log("donated",data);
    })

    this.foodForm.reset();
    
}


}
