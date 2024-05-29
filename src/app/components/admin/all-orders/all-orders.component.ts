import { Component } from '@angular/core';
import { TableComponent } from '../../table/table.component';
import { Order } from '../../../models/order';
import { HostListener } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CookieServices } from '../../../services/cookie.service';
import { throwError, catchError } from 'rxjs';
import { DashboardComponent } from '../../layout/dashboard/dashboard.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [TableComponent, DashboardComponent, CommonModule],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.css'
})
export class AllOrdersComponent {
  showDashboard: boolean = window.innerWidth > 830 ? true : false;
  mobileView: boolean = window.innerWidth < 830 ? true : false;
  page: number = 0;
  error: string | null = null;
  orders: Order[] = [];
  headers: string[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.showDashboard = event.target.innerWidth > 830;
    this.mobileView = event.target.innerWidth < 830;
  }

  toggleDashboard(): void {
    this.showDashboard = !this.showDashboard
  }

  constructor(private order: OrderService, private cookieService: CookieServices) { }

  getAllOrders(): void {
    this.order.getTotalOrders(this.page).pipe(catchError(error => {
      this.error = error.error.message;
      setTimeout(() => {
        this.error = null;
      }, 2000);
      return throwError(error);
    })).subscribe((data: any) => {
      console.log(data);
      this.orders = data;
      this.headers = Object.keys(data[0]);
      // this.headers= this.headers.filter((key) => key!=='consumer');
      console.log(this.headers);
    })
  }

  ngOnInit(): void {
    this.getAllOrders();
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page -= 1;
    }
    this.getAllOrders();
  }

  nextPage(): void {
    this.page += 1;
    this.getAllOrders();
  }

  cancelOrder(order: any) {
    if (order.orderStatus !== "PROCESSING") {
      return;
    }
    // console.log("order is",order);
    let orderDetail: Order = order;
    orderDetail.orderStatus = "CANCELED";
    this.order.updateOrder(orderDetail.id, orderDetail).subscribe((data: any) => console.log(data));
  }

  editOrder(order: any) {
    console.log("order is.............", order);
    let orderDetail: Order = order;
    let date = new Date();

    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are 0-based in JavaScript
    let day = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);

    let sqlTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000+00:00`;

    console.log(sqlTimestamp);

    orderDetail.deliveredDateTime = sqlTimestamp || '';
    this.order.updateOrder(orderDetail.id, orderDetail).subscribe((data: any) => console.log(data));
  }
}
