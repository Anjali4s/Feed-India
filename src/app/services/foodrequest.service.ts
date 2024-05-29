import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FoodRequest } from '../models/foodrequest';

@Injectable({
  providedIn: 'root'
})
export class FoodrequestService {

  constructor(private http: HttpClient) { }

  requestFood(foodRequest: any): Observable<FoodRequest> {
    return this.http.post<FoodRequest>("/v1/api/foodRequest/create", foodRequest);
  }

  updateFoodRequestById(id: number, foodRequest: any): Observable<FoodRequest> {
    return this.http.put<FoodRequest>(`/v1/api/foodRequest/update/${id}`, foodRequest);
  }

  getFoodRequestById(id: number,includeUser?:boolean): Observable<FoodRequest> {

    if(includeUser===undefined){
      includeUser=true;
    }
    return this.http.get<FoodRequest>(`/v1/api/foodRequest/get/${id}?includeUser=${includeUser}`);
  }

  getMyAllRequests(id:number,page:number): Observable<any> {
    return this.http.get<any>(`/v1/api/foodRequest/find/user/${id}/page/${page}`);
  }

  getTotalRequests(page:number): Observable<any> {
    return this.http.get<any>(`/v1/api/foodRequest/page/${page}`);
  }

  getFilteredFoodRequest(formData: Partial<{
    foodType: string | null;
    city: any;
    date: string | null;
  }>, page: number): Observable<FoodRequest[]> {
    let url: string = '/v1/api/foodRequest';
    if (formData.city && formData.city!==''){
      url = url + `/city/${formData.city}`;
    }
    if(formData.date && formData.date!==''){
      url = url + `/date/${formData.date}`
    }
    if(formData.foodType && formData.foodType!=='' && formData.foodType!=='ANY'){
      url = url + `/type/${formData.foodType}`;
    }
      return this.http.get<FoodRequest[]>(`${url}/page/${page}`);
  }

}
