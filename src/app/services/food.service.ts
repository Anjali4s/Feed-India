import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Food } from '../models/food';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) { }

  donateFood(food: any): Observable<Food> {
    return this.http.post<Food>("/v1/api/food/create", food);
  }

  getMyAllDonations(id:number,page:number): Observable<any> {
    return this.http.get<any>(`/v1/api/food/user/${id}/page/${page}`);
  }

  getAllFood(city: any, page: number): Observable<Food[]> {
    console.log("getting all foods")
    return this.http.get<Food[]>(`/v1/api/food/city/${city}/page/${page}`);
  }

  getFilteredFood(formData: Partial<{
    foodType: string | null;
    city: any;
    date: string | null;
  }>, page: number): Observable<Food[]> {
    console.log("getting filterd foods")
    let url: string = '/v1/api/food';
    if (formData.city && formData.city!==''){
      url = url + `/city/${formData.city}`;
    }
    if(formData.date && formData.date!==''){
      url = url + `/date/${formData.date}`
    }
    if(formData.foodType && formData.foodType!=='' && formData.foodType!=='ANY'){
      url = url + `/type/${formData.foodType}`;
    }
      // if(formData.)
      return this.http.get<Food[]>(`${url}/page/${page}`);
  }

  getFoodById(id: number,includeUser?:boolean): Observable<Food> {
    if(includeUser===undefined){
      includeUser=true;
    }
    return this.http.get<Food>(`/v1/api/food/id/${id}?includeUser=${includeUser}`);
  }

  updateFoodById(id:number,formData:any):Observable<Food>{
    return this.http.put<Food>(`/v1/api/food/update/${id}`,formData);
  }
}
