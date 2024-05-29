import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CookieServices } from '../../../services/cookie.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { FoodService } from '../../../services/food.service';
import { Food } from '../../../models/food';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-food-address',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './food-address.component.html',
  styleUrl: './food-address.component.css'
})
export class FoodAddressComponent {
  addressForm = new FormGroup({
    'street': new FormControl('', Validators.required),
    'city': new FormControl(null, Validators.required),
    'state': new FormControl(null, Validators.required),
    'zip': new FormControl(null, Validators.required)
  });
  datePipe = new DatePipe('en-US');

  cartItems: Food[] = JSON.parse(localStorage.getItem("food") || "[]");
  totalAmount() {
    return this.cartItems.reduce((total: any, item: any) => total + item.amount, 0);
  }

  constructor(private order: OrderService, private cookie: CookieServices, private food: FoodService) { }


  onSubmit() {
    let address = this.addressForm.value.street+", "+this.addressForm.value.city+", "+this.addressForm.value.state+", "+this.addressForm.value.zip;
    console.log(address);
    let city = this.addressForm.value.city;
    this.cartItems.forEach((item: Food, index: number) => {
      console.log("Index is ", index);
      this.food.getFoodById(item.id).subscribe((data: Food) => {
        if (data.amount >= item.amount) {

          let donorIds = data.user.id.toString();
          let foodIds = data.id.toString();
          console.log(donorIds, foodIds);

          let datetimeString = `${data.pickupDate}T${data.pickupTime}`;
          let date = new Date(datetimeString);
          let sqlTimestamp = this.datePipe.transform(date, "yyyy-MM-dd'T'HH:mm:ss.SSSZ");
          let orderDetail = {
            amount: this.totalAmount(),
            pickUpAddress: data.pickupAddress,
            deliveryAddress:address,
            pickedUpDateTime:sqlTimestamp,
            donorIds: donorIds,
            foodIds: foodIds,
            city: city,
            consumer: {
              id: JSON.parse(this.cookie.getCookie('user') || '').id
            }
          }
          this.order.createOrder(orderDetail).subscribe((data: any) => {
            console.log(data);
            localStorage.removeItem("food");
          });
          let amountData = {
            amount: data.amount - item.amount,
            available: data.amount !== item.amount
          }
          this.food.updateFoodById(item.id, amountData).subscribe((data: any) => {
            console.log(data);
          });
        } else {
          this.cartItems.splice(index, 1);
          localStorage.setItem("food", JSON.stringify(this.cartItems));
        }
      })
    })
    this.addressForm.reset();
  }
}
