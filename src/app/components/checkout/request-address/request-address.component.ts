import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CookieServices } from '../../../services/cookie.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { FoodrequestService } from '../../../services/foodrequest.service';
import { FoodRequest } from '../../../models/foodrequest';
import { FoodService } from '../../../services/food.service';
import { FoodType } from '../../../constants/foodtype';
import { Food } from '../../../models/food';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-request-address',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './request-address.component.html',
  styleUrl: './request-address.component.css'
})
export class RequestAddressComponent {
  addressForm = new FormGroup({
    'street': new FormControl('',Validators.required),
    'city': new FormControl(null,Validators.required),
    'state': new FormControl(null,Validators.required),
    'zip': new FormControl(null,Validators.required)
  });

  datePipe = new DatePipe('en-US');

  cartItems:FoodRequest[] = JSON.parse(localStorage.getItem("request") || "[]");
  totalAmount() {
    return this.cartItems.reduce((total:any, item:any) => total + item.amount, 0);
  }

  constructor(private order:OrderService, private cookie:CookieServices, private foodRequest: FoodrequestService, private food: FoodService) { }


  onSubmit() { 
    let address = this.addressForm.value.street+", "+this.addressForm.value.city+", "+this.addressForm.value.state+", "+this.addressForm.value.zip;
    this.cartItems.forEach((item:FoodRequest,index:number)=>{
      this.foodRequest.getFoodRequestById(item.id).subscribe((data:FoodRequest)=>{
        if(data.amount >= 0){
          let foodForm = new FormGroup({
            foodName: new FormControl(''),
            foodType:new FormControl(item.foodType),
            city: new FormControl(item.city),
            pickupDate: new FormControl(item.pickupDate),
            pickupTime: new FormControl(item.pickupTime),
            amount: new FormControl(item.amount),
            available: new FormControl(false),
            pickupAddress: new FormControl(address),
            user: new FormGroup({
              id: new FormControl(JSON.parse(this.cookie.getCookie('user')||'')?.id),
            })
          });
          this.food.donateFood(foodForm.value).subscribe((data:Food)=>{console.log("food donated.....",data);});    
          let amountData={
            amount:data.amount-item.amount,
            fullfilled: data.amount===item.amount
          }
          this.foodRequest.updateFoodRequestById(item.id,amountData).subscribe((data:any)=>{
            // console.log(data);
            let datetimeString = `${data.pickupDate}T${data.pickupTime}`;
            let date = new Date(datetimeString);
            let sqlTimestamp = this.datePipe.transform(date, "yyyy-MM-dd'T'HH:mm:ss.SSSZ");
            let orderDetail = {
              amount: item.amount,
              pickUpAddress: address,
              pickedUpDateTime: sqlTimestamp,
              deliveryAddress: data.pickupAddress,
              donorIds:JSON.parse(this.cookie.getCookie('user')||'').id.toString(),
              foodIds:item.id.toString(),
              city:foodForm.value.city,
              consumer:{
                id:item.user.id
              }
            }
            // console.log("orderDetails is",orderDetail);
            this.order.createOrder(orderDetail).subscribe((data:any)=>{
              // console.log(data);
              this.cartItems.splice(index,1);
              localStorage.setItem("request",JSON.stringify(this.cartItems));
            });
          });
        }else{
          this.cartItems.splice(index,1);
          localStorage.setItem("request",JSON.stringify(this.cartItems));
        }
      })
    })

    this.addressForm.reset();
  }
}
