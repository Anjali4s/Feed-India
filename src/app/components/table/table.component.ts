import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input("headers") headers: string[] = [];
  @Input("data") data: any[] = [];
  @Input("showCancel") showCancel: boolean = false;
  @Input("showEdit") showEdit: boolean = false;
  @Input("cancelFunction") cancelFunction: any;
  @Input("editFunction") editFunction: any;
  

  constructor(private order:OrderService) {
    
  }

  intitializeTable(headers: string[], data: any[]) {
    this.headers = headers;
    this.data = data;
  }

  isStringOrNumber(value: any): boolean {
    let res= (typeof value === 'string' || typeof value === 'number' || value===null || value===undefined || typeof value === 'boolean');
    return res;
  }


}
