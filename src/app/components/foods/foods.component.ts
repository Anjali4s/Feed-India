import { CommonModule,DatePipe } from '@angular/common';
import { Component,HostListener} from '@angular/core';
import { FoodType } from '../../constants/foodtype';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FoodService } from '../../services/food.service';
import { Food } from '../../models/food';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-foods',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './foods.component.html',
  styleUrl: './foods.component.css'
})
export class FoodsComponent {
foodTypes:FoodType[] = Object.values(FoodType);
datePipe = new DatePipe('en-US');
page=0;
foods:Food[]=[];
error:string|null=null;
showFilter = window.innerWidth > 830;

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.showFilter = event.target.innerWidth > 830;
  }

  nextPage():void{
    this.page++;
    console.log(this.page);
    this.onSubmit();
  }
  previousPage():void{
    if(this.page>0){
      this.page--;
    }
    this.onSubmit();    
  }

filterForm = new FormGroup({
  foodType: new FormControl(FoodType.ANY.toString()),
  city: new FormControl('',Validators.required),
  date: new FormControl(''),

})

constructor(private food:FoodService, private user:UserService, private router:Router,private cookieService: CookieService) { }

toggleFilter():void{
  this.showFilter=!this.showFilter;
}
onSubmit(): void {
  if(this.filterForm.invalid){
    return;
  }
  this.error=null;
  let dateControl = this.filterForm.get('date');
  let cityControl = this.filterForm.get('city');
  if(cityControl?.value){
    cityControl.setValue(cityControl.value?.toLocaleLowerCase()||'');
  }
  if(dateControl?.value){
    var sqlDate = this.datePipe.transform(dateControl.value, 'yyyy-MM-dd');
    dateControl.setValue(sqlDate);
  }
  this.food.getFilteredFood(this.filterForm.value,this.page).pipe(
    catchError(error => {
      // Handle your error here
      this.error=error.error.message;
      this.foods=[];   
      return throwError(error);
    })
  ).subscribe((data:Food[])=>{
    this.foods=data;
  })
}



ngOnInit(): void {
  if(!this.user.isLoggedIn()){
    this.router.navigate(['/login']);
  }else{
    this.filterForm.controls['city'].setValue(JSON.parse(this.cookieService.get('user'))?.city||'');
  }

  this.error=null;
  this.food.getAllFood(this.filterForm.value.city,this.page).pipe(
    catchError(error => {
      // Handle your error here
      this.error=error.error.message; 
      this.foods=[];  
      return throwError(error);
    })
  ).subscribe((data:Food[])=>{
    this.foods=data;
  })
}
}
