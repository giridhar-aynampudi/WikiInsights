import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Form} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-individual-analytics',
  templateUrl: './individual-analytics.component.html',
  styleUrls: ['./individual-analytics.component.css'],
})
export class IndividualAnalyticsComponent implements OnInit {
  date = new FormControl();
  date2 = new FormControl();
  form: FormGroup;
  articleList: Array<string> = [];
  articleCtrl = new FormControl();
  filteredArticle: Observable<any>;
  articleNames: Array<string> = [];
  topFiveUsers: Array<any> = [];
  articleReceived = false;
  articleTitle: string;
  totalRevision: number;
  barData: any;
  pieData: any;
  individualData: any;
  individual: string;
  error = false;
  errorMessage: string;
  filterOn = true;
  yearList: Array<any> = [];
  newList: Array<any> = [];
  overallBar = true;
  pieChart = false;
  individualBar = false;
  waiting = false;
  open = false;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.filteredArticle = this.articleCtrl.valueChanges
      .pipe(
        startWith(''),
        map(article => article ? this._filterArticles(article) : this.articleList.slice())
      );
  }

  private _filterArticles(value: string) {
    const filterValue = value.toLowerCase();
    return this.articleList.filter(state => state['_id'].toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {
    this.http.get('/api/individual/all-articles')
      .subscribe((response) => {
        Object.values(response).forEach((element) => {
          this.articleList.push(element);
        });
      });
  }

  selectedArticle(value) {
    this.articleReceived = false;
    this.topFiveUsers.length = 0;
    this.open = true;
    this.waiting = true;
    this.http.post('/api/individual/article-details', {
      title: value
    }).subscribe((result) => {
      this.waiting = false;
      this.filterOn = false;
      this.articleTitle = value;
      this.totalRevision = result['rev'][2];
      this.snackBar.open(`Data pulled successfully and ${result['rev'][1]} revisions are downloaded`, 'Dismiss', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      this.barData = result['rev'][3];
      this.pieData = result['rev'][4];
      this.individualData = result['rev'][5];
      this.individual = result['rev'][0][0]['user'];
      this.yearList = result['rev'][6].reverse();
      Object.values(result['rev'][0]).forEach((element) => {
        this.topFiveUsers.push(element);
      });
        this.articleReceived = true;
    });
  }

  filterYears() {
    if (this.date.value > this.date2.value) {
      this.error = true;
      this.errorMessage = 'Please choose From: year less than To: year';
    } else if (this.yearList.indexOf(parseInt(this.date.value, 10)) === -1 ||
        this.yearList.indexOf(parseInt(this.date2.value, 10)) === -1) {
      this.error = true;
      this.errorMessage = 'Please choose a year from ' + this.yearList[0] + ' to ' + this.yearList[this.yearList.length - 1];
    } else {
      this.articleReceived = false;
      this.topFiveUsers.length = 0;
      this.error = false;
      const first = this.yearList.indexOf(parseInt(this.date.value, 10));
      const second = this.yearList.indexOf(parseInt(this.date2.value, 10));
      this.newList = this.yearList.slice(first, second + 1);
      this.waiting = true;
      this.http.post('/api/individual/article-details', {
          title: this.articleCtrl.value,
          fromDate: this.date.value,
          toDate: this.date2.value,
          yearList: this.newList,
      }).subscribe((result) => {
        this.waiting = false;
        this.filterOn = false;
        this.articleTitle = this.articleCtrl.value;
        this.totalRevision = result['rev'][7];
        this.snackBar.open(`Data pulled successfully and ${result['rev'][1]} revisions are downloaded`, 'Dismiss', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.barData = result['rev'][3];
        this.pieData = result['rev'][4];
        this.individualData = result['rev'][5];
        this.individual = result['rev'][0][0]['user'];
        this.yearList = result['rev'][6].reverse();
        Object.values(result['rev'][0]).forEach((element) => {
          this.topFiveUsers.push(element);
        });
        this.articleReceived = true;
        this.overallBar = true;
        this.pieChart = false;
        this.individualBar = false;
      });
    }
  }

  chartType(type) {
    if (type === 'pieChart') {
      this.pieChart = true;
      this.overallBar = false;
      this.individualBar = false;
    } else if (type === 'individualBar') {
      this.individualBar = true;
      this.pieChart = false;
      this.overallBar = false;
    } else if (type === 'overallBar') {
      this.overallBar = true;
      this.pieChart = false;
      this.individualBar = false;
    }
  }

}
