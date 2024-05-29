import { CommonModule,DatePipe } from '@angular/common';
import { Component,HostListener} from '@angular/core';
import { FoodType } from '../../constants/foodtype';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FoodrequestService } from '../../services/foodrequest.service';
import { FoodRequest } from '../../models/foodrequest';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent {

foodTypes:FoodType[] = Object.values(FoodType);
datePipe = new DatePipe('en-US');
page=0;
requests:FoodRequest[]=[];
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

constructor( private user:UserService, private router:Router,private cookieService: CookieService, private request:FoodrequestService) { }

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
  this.request.getFilteredFoodRequest(this.filterForm.value,this.page).pipe(
    catchError(error => {
      // Handle your error here
      this.error=error.error.message;
      this.requests=[];   
      return throwError(error);
    })
  ).subscribe((data:FoodRequest[])=>{
    this.requests=data;
  })

}


ngOnInit(): void {
  if(!this.user.isLoggedIn()){
    this.router.navigate(['/login']);
    return;
  }
  this.filterForm.controls['city'].setValue(JSON.parse(this.cookieService.get('user'))?.city||'');
  this.error=null;
  this.request.getFilteredFoodRequest(this.filterForm.value,this.page).pipe(
    catchError(error => {
      // Handle your error here
      this.error=error.error.message; 
      this.requests=[];  
      return throwError(error);
    })
  ).subscribe((data:FoodRequest[])=>{
    this.requests=data;
  })
}

}
