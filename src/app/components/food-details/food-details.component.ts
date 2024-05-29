import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../../services/food.service';
import { Router } from '@angular/router';
import { Food } from '../../models/food';

@Component({
  selector: 'app-food-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './food-details.component.html',
  styleUrl: './food-details.component.css'
})
export class FoodDetailsComponent {
  foodDeatil:Food|null=null;
  foodId:number = Number(this.router.url.split('/').at(-1));
  amount:number=0;

  quantity:number=0;

  constructor(private food:FoodService,private router: Router) { }

  getFooDetaild(id:number){
    this.food.getFoodById(id).subscribe((data)=>{
      console.log(data);
      this.foodDeatil=data;
      this.amount=this.foodDeatil.amount;
    })
  }

  addToCart(){
    if(this.quantity>0){
      if(this.quantity>this.amount){
        alert("Quantity should be less than "+this.amount+" only "+this.amount+" is added to cart");
        this.quantity=this.amount
      }
      let cartDetail:any=this.foodDeatil;
      cartDetail.amount=this.quantity;
      let cartItems = JSON.parse(localStorage.getItem("food") || "[]");
      cartItems.push(cartDetail);
      localStorage.setItem("food",JSON.stringify(cartItems));
    }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getFooDetaild(this.foodId);
  }

}
