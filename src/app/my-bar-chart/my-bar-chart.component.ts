import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-my-bar-chart',
  templateUrl: './my-bar-chart.component.html',
  styleUrls: ['./my-bar-chart.component.css']
})
export class MyBarChartComponent implements OnInit {
  @Input() barData;
  @Input() type;
  adminData: Array<string> = [];
  anonData: Array<string> = [];
  botData: Array<string> = [];
  regularData: Array<string> = [];
  testList = {};
  individualData: Array<string> = [];
  testLabel: string;
  test3: Array<string> = [];
  constructor() { }
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  barChartLabels: Array<string> = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData: any;
  ngOnInit() {
    if (!this.type) {
      setTimeout(() => {
        this.testList = {0: 'Admin', 1: 'Bot', 2: 'Anonymous', 3: 'Regular'};
        for (let i = 0; i < 4; i++) {
          Object.values(this.barData[this.testList[i]]).forEach(element => {
            this.test3.push(element['_id']);
          });
          this.datasetCreation(this.barData, this.testList[i], this.test3);
        }
      }, 0);
      this.barChartData = [
        {data: this.adminData, label: 'Administrator'},
        {data: this.anonData, label: 'Anonymous'},
        {data: this.botData, label: 'Bot'},
        {data: this.regularData, label: 'Regular'}];
    } else {
      setTimeout(() => {
        this.barChartLabels = Object.keys(this.barData);
        let count = 0;
        Object.values(this.barData).forEach(element => {
          count += 1;
          this.individualData.push(element['rev']);
          if (count <= 1) {
            this.testLabel = element['_id'];
          }
        });
      });
      this.barChartData = [{
        data: this.individualData, label: this.type
      }];
    }
  }

  datasetCreation(data, userType, yearList) {
    Object.values(data[userType]).forEach(ele => {
      if (userType === 'Admin') {
        this.barChartLabels.push(ele['_id']);
        this.adminData.push(ele['rev']);
      } else if (userType === 'Anonymous') {
        this.anonData.push(ele['rev']);
      } else if (userType === 'Bot') {
        this.botData.push(ele['rev']);
      } else if (userType === 'Regular') {
        this.regularData.push(ele['rev']);
      }
    });
    return;
  }
}
