import { CommonModule } from '@angular/common';
import { Component,HostListener } from '@angular/core';
import { CookieServices } from '../../../services/cookie.service';
import { DashboardComponent } from '../../layout/dashboard/dashboard.component';
import { TableComponent } from '../../table/table.component';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Transaction } from '../../../models/transaction';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, DashboardComponent, TableComponent],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent {
  showDashboard: boolean = window.innerWidth > 830 ? true : false;
  mobileView: boolean = window.innerWidth < 830 ? true : false;
  page:number=0;
  error:string|null=null;
  transactions:Transaction[]=[];
  headers:string[]=[];

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.showDashboard = event.target.innerWidth > 830;
    this.mobileView = event.target.innerWidth < 830;
  }

  toggleDashboard():void{
    this.showDashboard = !this.showDashboard
  }

  constructor(private transaction:TransactionService, private cookieService: CookieServices) { }

  getAllDonations():void{
    this.transaction.getMyAllTransactions(JSON.parse(this.cookieService.getCookie('user') || '').id,this.page).pipe(catchError(error => {
      
      this.error = error.error.message;
      setTimeout(() => {
        this.error = null;
      }, 2000);
      return throwError(error);
    })).subscribe((data: any) => {
      console.log(data);
      this.transactions= data;
      this.headers = Object.keys(data[0]);
      this.headers= this.headers.filter((key) => key!=='donor');
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
