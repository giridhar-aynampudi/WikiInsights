import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartService } from '../chart.service';

@Component({
  selector: 'app-overall-analytics',
  templateUrl: './overall-analytics.component.html',
  styleUrls: ['./overall-analytics.component.css']
})
export class OverallAnalyticsComponent implements OnInit {
  lists = [];
  lowRevList = [];
  slicedList = [];
  articleList = [];
  articleLowRev = [];
  slicedLowRevList = [];
  lowListLength: number;
  listLength: number;
  changed = false;
  userSelection = 2;
  error = false;
  largeArticleName: string;
  largeArticleUsers: string;
  largeArticleRevisions: number;
  smallArticleName: string;
  smallArticleUsers: string;
  smallArticleRevisions: number;
  longArticleName: Array<string> = [];
  longArticleDuration: Array<string> = [];
  shortArticleName: Array<string> = [];
  shortArticleDuration: Array<string> = [];
  barData: any;
  pieData: any;
  chartChoice = false;

  constructor(private http: HttpClient, private chartService: ChartService) { }

  ngOnInit() {
    this.http.get('/api/overall/top-most', {
      params: {
        sortNum: '-1',
      }
    }).subscribe(data => {
      Object.values(data).forEach(element => {
        this.articleList.push(element['_id']);
      });
      this.listLength = this.articleList.length;
      this.lists = this.articleList.slice(0, 2);
    });
    this.http.get('/api/overall/top-most', {
      params: {
        sortNum: '1',
      }
    }).subscribe(data2 => {
      Object.values(data2).forEach(element => {
        this.articleLowRev.push(element['_id']);
      });
      this.lowRevList = this.articleLowRev.slice(0, 2);
      this.lowListLength = this.articleLowRev.length;
    });
    this.http.get('/api/overall/large-registered-users')
      .subscribe(largeUsers => {
        this.largeArticleName = largeUsers[0]._id;
        this.largeArticleUsers = largeUsers[0].numberOfUsers;
        this.largeArticleRevisions = largeUsers[0].rev;
    });
    this.http.get('/api/overall/small-registered-users')
      .subscribe(smallUsers => {
        this.smallArticleName = smallUsers[0]._id;
        this.smallArticleUsers = smallUsers[0].numberOfUsers;
        this.smallArticleRevisions = smallUsers[0].rev;
    });
    this.http.get('/api/overall/longest-history')
      .subscribe(longHistory => {
        this.longArticleName.push(longHistory[0][0]);
        this.longArticleName.push(longHistory[1][0]);
        this.longArticleDuration.push(longHistory[0][1]);
        this.longArticleDuration.push(longHistory[1][1]);
    });
    this.http.get('/api/overall/smallest-history')
      .subscribe(shortHistory => {
        this.shortArticleName.push(shortHistory[0][0]);
        this.shortArticleDuration.push(shortHistory[0][1]);
        this.shortArticleName.push(shortHistory[1][0]);
        this.shortArticleDuration.push(shortHistory[1][1]);
    });
    this.barData = this.chartService.getOverallBarData();
    this.pieData = this.chartService.getOverallPieData();
  }

  wasFormChanged(value) {
    if (value <= this.listLength) {
      this.slicedList = this.articleList.slice(0, value);
      this.userSelection = value;
      this.slicedLowRevList = this.articleLowRev.slice(0, value);
      this.changed = true;
      this.error = false;
    } else {
      this.error = true;
    }
  }

  chosenValue(event) {
    this.wasFormChanged(event.value);
  }

  barOrPie(chartType) {
    this.chartChoice = chartType.checked;
  }

}
