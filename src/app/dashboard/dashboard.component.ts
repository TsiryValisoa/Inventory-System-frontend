import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Transaction } from '../transactionComponent/transaction/transaction.interface';
import { ApiService } from '../Service/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  transactions: Transaction[] = [];
  transactionTypeData: any[] = [];
  transactionAmountData: any[] = [];
  monthlyTransactionData: any[] = [];
  months = [
    {name: 'January', value : '01'},
    {name: 'February', value : '02'},
    {name: 'March', value : '03'},
    {name: 'April', value : '04'},
    {name: 'May', value : '05'},
    {name: 'June', value : '06'},
    {name: 'July', value : '07'},
    {name: 'August', value : '08'},
    {name: 'September', value : '09'},
    {name: 'October', value : '10'},
    {name: 'November', value : '11'},
    {name: 'December', value : '12'},
  ];

  //Array to store the years (last 10 years from current year)
  years = Array.from({length: 10}, (_, i) => new Date().getFullYear() - i);

  //Search filter
  month: string = '';
  year: string = '';

  //Chart view dimensions, legend, and animations settings
  view: [number, number] = [700, 400];
  showLegend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions(): void {
    this.apiService.listAllTransactions().subscribe((data) => {
      this.transactions = data.transactions;
      this.processChartData();
    });
  }

  processChartData(): void {

    //Count the number of transactions by typr
    const typeCounts: {[key: string]: number} = {};
    //Sum the transaction amounts by type
    const amountByType: {[key: string]: number} = {};

    //Loop through each transaction to calculate totals by type
    this.transactions.forEach((transaction) => {
      //Get the transactionType
      const type = transaction.transactionType;
      //Count transaction by type
      typeCounts[type] = (typeCounts[type] || 0) + 1;
      // Sum amounts by type
      amountByType[type] = (amountByType[type] || 0) + transaction.totalPrice;
    });

    //Prepare data for chart displaying number of transactions by type
    this.transactionTypeData = Object.keys(typeCounts).map((type) => ({
      name: type,
      value: typeCounts[type]
    }));

    //Prepare data for chart displaying total transactions amount by type
    this.transactionAmountData = Object.keys(amountByType).map((type) => ({
      name: type,
      value: amountByType[type]
    }));
  }

  //Load transaction data for a specific month and year
  loadMonthlyData(): void {

    //If no month or year is selected, exit the function
    if (!this.month || !this.year) {
      return;
    }

    this.apiService.listByMonthAndYear(Number.parseInt(this.month), Number.parseInt(this.year))
    .subscribe((data) => {
      //Store transactions for the selected month
      this.transactions = data.transactions;
      this.processChartData();
      this.processMonthlyData(data.transactions);
    });
  }

  //Process daily transaction data for the selected month
  processMonthlyData(transaction: Transaction[]): void {

    //Store daily total amounts
    const dailyTotals: {[key: string]: number} = {};

    //Loop through each transactio and accumulate totals for each day
    transaction.forEach((transaction) => {
      //Get the day from transaction date
      const date = new Date(transaction.createdAt).getDate().toString();
      //sum daily totals
      dailyTotals[date] = (dailyTotals[date] || 0) + transaction.totalPrice;
    });

    //Prepare data for chart displaying daily totals for the selected month
    this.monthlyTransactionData = Object.keys(dailyTotals).map((day) => ({
      name: `Day ${day}`,
      value: dailyTotals[day]
    }));
  }
}
