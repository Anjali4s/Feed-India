import { Time } from "@angular/common";
import { FoodType } from "../constants/foodtype";
export interface Food {
    id: number;
    foodName: string;
    foodType: FoodType;
    city: string;
    pickupDate: Date | string;
    pickupTime: Time | string;
    amount: number;
    postedAmount: number;
    available: boolean;
    pickupAddress: string;
    user:any
}
