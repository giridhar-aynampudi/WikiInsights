import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-author-analytics',
  templateUrl: './author-analytics.component.html',
  styleUrls: ['./author-analytics.component.css']
})
export class AuthorAnalyticsComponent implements OnInit {
  authorCtrl = new FormControl();
  articleList: Array<any> = [];
  expand = false;
  errorMessage: string;
  error = false;
  constructor(private http: HttpClient) {
  }

  ngOnInit() {

  }

  searchFunction() {
    this.articleList.length = 0;
    this.http.get('/api/author/author-details', {
      params: {
        author: this.authorCtrl.value,
      }
    }).subscribe(result => {
      this.error = false;
      Object.values(result).forEach(element => {
        this.articleList.push(element);
      });
    }, (errResponse) => {
        this.error = true;
        this.errorMessage = 'User not found';
    });
  }
}
