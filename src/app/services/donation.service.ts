import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  constructor(private http: HttpClient) { }

  getMyAllDonations(id:number,page:number): Observable<any> {
    return this.http.get<any>(`/v1/api/food/user/${id}/page/${page}`);
  }
  getTotalDonations(page:number): Observable<any> {
    return this.http.get<any>(`/v1/api/food/page/${page}`);
  }
}
