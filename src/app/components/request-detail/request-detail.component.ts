import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FoodRequest } from '../../models/foodrequest';
import { FoodrequestService } from '../../services/foodrequest.service';


@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './request-detail.component.html',
  styleUrl: './request-detail.component.css'
})
export class RequestDetailComponent {
  requestDeatil:FoodRequest|null=null;
  requestId:number = Number(this.router.url.split('/').at(-1));
  amount:number=0;

  quantity:number=0;

  constructor(private foodRequest:FoodrequestService,private router: Router) { }

  addToCart(){
    if(this.quantity>0){
      if(this.quantity>this.amount){
        alert("Quantity should be less than "+this.amount+" only "+this.amount+" is added to cart");
        this.quantity=this.amount
      }
      let cartDetail:any=this.requestDeatil;
      cartDetail.amount=this.quantity;
      let cartItems = JSON.parse(localStorage.getItem("request") || "[]");
      cartItems.push(cartDetail);
      localStorage.setItem("request",JSON.stringify(cartItems));
    }
  }

  getFooDetaild(id:number){
    this.foodRequest.getFoodRequestById(id).subscribe((data)=>{
      console.log(data);
      this.requestDeatil=data;
      this.amount=this.requestDeatil.amount;
    })
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getFooDetaild(this.requestId);
  }
}
