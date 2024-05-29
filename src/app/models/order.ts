import { FoodType } from "../constants/foodtype";
import { Time } from "@angular/common";

export interface Order {
    id: number;
    foodType: FoodType;
    city: string;
    amount: number;
    pickUpAddress: string;
    deliveryAddress: string;
    orderStatus: string;
    donorIds: string;
    foodIds: string;
    pickedUpDateTime: Date | string;
    deliveredDateTime: Date | string;
    user:any
}
