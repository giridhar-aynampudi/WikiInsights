import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @Input() pieData;
  public pieChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels = [];
  public pieChartData = [];
  public pieChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['#80add7', '#ffd740', '#dbb4da', '#d6618f'],
    },
  ];
  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      Object.values(this.pieData).forEach((element) => {
        this.pieChartLabels.push(element[0]._id);
        this.pieChartData.push(element[0].rev);
      });
    });
  }

}
