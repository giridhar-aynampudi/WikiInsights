import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChartService } from '../chart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error = false;
  errorMessage: string;

  constructor(private http: HttpClient, private router: Router, private chartService: ChartService) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

  }

  submit(formData) {
    if (this.form.invalid) {
      return;
    }

    this.http.post('/api/user/login', {
      username: formData.username,
      password: formData.password,
    }).subscribe((data) => {
      this.error = false;
      this.chartService.setUser(data);
      this.router.navigateByUrl('overall');
    }, () => {
      this.error = true;
      this.errorMessage = 'Username or password is incorrect';
    });
  }

}
