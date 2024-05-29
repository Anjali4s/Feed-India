import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Food } from '../../../models/food';

@Component({
  selector: 'app-food-cart',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './food-cart.component.html',
  styleUrl: './food-cart.component.css'
})
export class FoodCartComponent {
  cartItems:Food[] = [];

  totalAmount() {
    return this.cartItems.reduce((total, item) => total + item.amount, 0);
  } 
  
  removeItem(id:number) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    localStorage.setItem("food",JSON.stringify(this.cartItems));
  }

  ngOnInit(): void {
    this.cartItems = JSON.parse(localStorage.getItem("food") || "[]");
  }
}
