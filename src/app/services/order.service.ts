import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getMyAllOrders(id:number,page:number): Observable<any> {
    return this.http.get(`/v1/api/order/consumer/${id}/page/${page}`);
  }

  getTotalOrders(page:number): Observable<any> {
    return this.http.get(`/v1/api/order/page/${page}`);
  }

  createOrder(order: any): Observable<any> {
    console.log("creating order")
    console.log(order)
    return this.http.post('/v1/api/order/create', order);
  }

  updateOrder(id:number,order: any): Observable<any> {
    // console.log("api called for update order")
    return this.http.put(`/v1/api/order/update/${id}`, order);
  }

  
}
