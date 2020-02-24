import {Component, OnInit, ViewChild, Input, Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {formatDate} from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { TransactionData } from '../transaction-data';
import { Transaction } from '../transaction';
import { Transactions } from '../transactions';
import { Router } from '@angular/router';



/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-transactions-history',
  templateUrl: './transactions-history.component.html',
  styleUrls: ['./transactions-history.component.css']
})
export class TransactionsHistoryComponent implements OnInit {

  columns: string[] = ['id', 'date', 'name', 'amount', 'balance'];

  dataSource = new MatTableDataSource();


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor( @Inject('BASE_URL') private baseUrl: string,
               private router: Router,
               private http: HttpClient) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    const url = this.baseUrl + 'api/protected/transactions';
    this.http
        .get<Transactions>(url)
        .subscribe(res => {
                            if (res) {
                                this.dataSource.data = res.transactions;
                          }},
                   error => error);
  }
}


