import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, ChartService } from '../chart.service';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.css']
})
export class UserDropdownComponent implements OnInit {
  user: User;
  isLoggedIn: boolean;

  constructor(private chartService: ChartService) {}

  ngOnInit() {
    this.chartService.userObservable.subscribe(user => {
      this.user = user;
      this.isLoggedIn = !!this.user;
    });
  }

  logout() {
    this.chartService.logout();
  }

}
