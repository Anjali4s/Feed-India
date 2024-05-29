import { CommonModule } from '@angular/common';
import { Component,HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FoodRequest } from '../../../models/foodrequest';


@Component({
  selector: 'app-request-cart',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './request-cart.component.html',
  styleUrl: './request-cart.component.css'
})
export class RequestCartComponent {
  cartItems:FoodRequest[] = [];

  showFilter = window.innerWidth > 563;

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.showFilter = event.target.innerWidth > 563;
  }

  totalAmount() {
    return this.cartItems.reduce((total, item) => total + item.amount, 0);
  } 
  
  removeItem(id:number) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    localStorage.setItem("request",JSON.stringify(this.cartItems));
  }

  ngOnInit(): void {
    this.cartItems = JSON.parse(localStorage.getItem("request") || "[]");
  }
}
