import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartService } from '../chart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  loginComp = false;
  modalReference = null;
  pieData: any;
  constructor(private modalService: NgbModal, private chartService: ChartService, private router: Router) { }

  ngOnInit() {
    this.chartService.getOverallPieData();
    this.chartService.getOverallBarData();
  }

  login(content) {
    this.modalReference = this.modalService.open(content, {backdropClass: 'light-blue-backdrop', centered: true});
  }

  register() {
    this.router.navigateByUrl('/register');
  }

  ngOnDestroy() {
    if (this.modalReference != null) {
      this.modalReference.close();
    }
  }

}
