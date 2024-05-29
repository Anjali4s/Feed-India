import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  getMyAllTransactions(id:number,page:number): Observable<any> {
    return this.http.get(`/v1/api/transaction/donor/${id}/page/${page}`);
  }

  createTransaction(data:any): Observable<any> {
    return this.http.post(`/v1/api/transaction/create`,data);
  }
}
