import { CommonModule } from '@angular/common';
import { Component,HostListener } from '@angular/core';
import { CookieServices } from '../../../services/cookie.service';
import { DashboardComponent } from '../../layout/dashboard/dashboard.component';
import { TableComponent } from '../../table/table.component';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Food } from '../../../models/food';
import { FoodService } from '../../../services/food.service';


@Component({
  selector: 'app-mydonation',
  standalone: true,
  imports: [CommonModule, DashboardComponent, TableComponent],
  templateUrl: './mydonation.component.html',
  styleUrl: './mydonation.component.css'
})
export class MydonationComponent {
  showDashboard: boolean = window.innerWidth > 830 ? true : false;
  mobileView: boolean = window.innerWidth < 830 ? true : false;
  page:number=0;
  error:string|null=null;
  donations:Food[]=[];
  headers:string[]=[];

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.showDashboard = event.target.innerWidth > 830;
    this.mobileView = event.target.innerWidth < 830;
  }

  toggleDashboard():void{
    this.showDashboard = !this.showDashboard
  }

  constructor(private food:FoodService, private cookieService: CookieServices) { }

  getAllDonations():void{
    this.food.getMyAllDonations(JSON.parse(this.cookieService.getCookie('user') || '').id,this.page).pipe(catchError(error => {
      
      this.error = error.error.message;
      setTimeout(() => {
        this.error = null;
      }, 2000);
      return throwError(error);
    })).subscribe((data: any) => {
      console.log(data);
      this.donations = data;
      this.headers = Object.keys(data[0]);
      this.headers= this.headers.filter((key) => key!=='user');
      console.log(this.headers);
    })
  }

  ngOnInit(): void {
    this.getAllDonations();
  }

  previousPage():void{
    if(this.page>0){
      this.page-=1;
    }
    this.getAllDonations();
  }

  nextPage():void{
    this.page+=1;
    this.getAllDonations();
  }

}
