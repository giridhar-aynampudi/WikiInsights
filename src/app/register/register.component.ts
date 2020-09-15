import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChartService } from '../chart.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  constructor(private http: HttpClient, private chartService: ChartService, private router: Router) { }

  ngOnInit() {
    this.chartService.getOverallPieData();
    this.chartService.getOverallBarData();
    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('')
    });
  }

  submit(formData) {
    if (this.form.invalid) {
      return;
    }

    this.http.post('/api/user/register', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    }).subscribe(success => {
        this.router.navigateByUrl('/');
    });
  }

}
