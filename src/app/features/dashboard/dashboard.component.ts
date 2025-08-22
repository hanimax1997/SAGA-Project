import { Component, OnInit } from '@angular/core';
import { ChartOptions,ChartConfiguration } from 'chart.js';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Pie

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = ["Voyage", "Santé", 'Auto', 'Entreprises et professionnels', "Habitation", "Prévoyance"];
  public pieChartDatasets = [{
    data: [300, 500, 100, 300, 500, 100],
    backgroundColor: ['#183b66', '#6a4a86', '#b9538a', '#f66a73', '#ff9c4f', '#ffdb38']
  }];


  public pieChartLegend = true;
  public pieChartPlugins = [];
  // bar
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['2006'],
    datasets: [
      { data: [65], label: 'Sinistres en cours' },
      { data: [28], label: 'Sinistres réglés' },
      { data: [28], label: 'Sinistres ' }
    ]
  };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
    maintainAspectRatio: false
  };
  constructor() { }
  valueEnCours=40
  valueRegle=20
  valueOuvert=50
  ngOnInit(): void {
   
  }


}
