import { CommonModule } from '@angular/common';
import { Component,HostListener } from '@angular/core';
import { CookieServices } from '../../../services/cookie.service';
import { OrderService } from '../../../services/order.service';
import { DashboardComponent } from '../../layout/dashboard/dashboard.component';
import { TableComponent } from '../../table/table.component';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {Order} from '../../../models/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, DashboardComponent, TableComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  showDashboard: boolean = window.innerWidth > 830 ? true : false;
  mobileView: boolean = window.innerWidth < 830 ? true : false;
  page:number=0;
  error:string|null=null;
  orders:Order[]=[];
  headers:string[]=[];

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.showDashboard = event.target.innerWidth > 830;
    this.mobileView = event.target.innerWidth < 830;
  }

  toggleDashboard():void{
    this.showDashboard = !this.showDashboard
  }

  constructor(private order:OrderService, private cookieService: CookieServices) { }

  getAllOrders():void{
    this.order.getMyAllOrders(JSON.parse(this.cookieService.getCookie('user') || '').id,this.page).pipe(catchError(error => {
      
      this.error = error.error.message;
      setTimeout(() => {
        this.error = null;
      }, 2000);
      return throwError(error);
    })).subscribe((data: any) => {
      console.log(data);
      this.orders = data;
      this.headers = Object.keys(data[0]);
      this.headers= this.headers.filter((key) => key!=='consumer');
      console.log(this.headers);
    })
  }

  ngOnInit(): void {
    this.getAllOrders();
  }

  previousPage():void{
    if(this.page>0){
      this.page-=1;
    }
    this.getAllOrders();
  }

  nextPage():void{
    this.page+=1;
    this.getAllOrders();
  }

  cancelOrder(order:any) {
    if(order.orderStatus!=="PROCESSING"){
      return;
    }
    console.log("order is",order);
    let orderDetail:Order = order;
    orderDetail.orderStatus = "CANCELED";
    this.order.updateOrder(orderDetail.id, orderDetail).subscribe((data:any) => console.log(data));
  }
}
