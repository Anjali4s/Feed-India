import { CommonModule } from '@angular/common';
import { Component,HostListener } from '@angular/core';
import { CookieServices } from '../../../services/cookie.service';
import { DashboardComponent } from '../../layout/dashboard/dashboard.component';
import { TableComponent } from '../../table/table.component';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FoodRequest } from '../../../models/foodrequest';
import { FoodrequestService } from '../../../services/foodrequest.service';

@Component({
  selector: 'app-myrequest',
  standalone: true,
  imports: [CommonModule, DashboardComponent, TableComponent],
  templateUrl: './myrequest.component.html',
  styleUrl: './myrequest.component.css'
})
export class MyrequestComponent {
  showDashboard: boolean = window.innerWidth > 830 ? true : false;
  mobileView: boolean = window.innerWidth < 830 ? true : false;
  page:number=0;
  error:string|null=null;
  requests:FoodRequest[]=[];
  headers:string[]=[];

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.showDashboard = event.target.innerWidth > 830;
    this.mobileView = event.target.innerWidth < 830;
  }

  toggleDashboard():void{
    this.showDashboard = !this.showDashboard
  }

  constructor(private request:FoodrequestService, private cookieService: CookieServices) { }

  getAllRequests():void{
    this.request.getMyAllRequests(JSON.parse(this.cookieService.getCookie('user') || '').id,this.page).pipe(catchError(error => {
      
      this.error = error.error.message;
      setTimeout(() => {
        this.error = null;
      }, 2000);
      return throwError(error);
    })).subscribe((data: any) => {
      console.log(data);
      this.requests = data;
      this.headers = Object.keys(data[0]);
      this.headers= this.headers.filter((key) => key!=='user');
      console.log(this.headers);
    })
  }

  ngOnInit(): void {
    this.getAllRequests();
  }

  previousPage():void{
    if(this.page>0){
      this.page-=1;
    }
    this.getAllRequests();
  }

  nextPage():void{
    this.page+=1;
    this.getAllRequests();
  }
}
