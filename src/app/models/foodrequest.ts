import { Time } from "@angular/common";
import { FoodType } from "../constants/foodtype";


export interface FoodRequest {
    id: number;
    foodType: FoodType;
    city: string;
    pickupDate: Date | string;
    pickupTime: Time | string;
    amount: number;
    requestedAmount: number;
    pickupAddress: string;
    message:string;
    fullfilled:boolean;
    user:any;
}
