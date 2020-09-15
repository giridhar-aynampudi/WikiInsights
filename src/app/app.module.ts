import { AuthGuard } from './auth.guard';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MyBarChartComponent } from './my-bar-chart/my-bar-chart.component';
import { HomeComponent } from './home/home.component';
import { OverallAnalyticsComponent } from './overall-analytics/overall-analytics.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { ChartService } from './chart.service';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { MatBadgeModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import { RegisterComponent } from './register/register.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { IndividualAnalyticsComponent } from './individual-analytics/individual-analytics.component';
import { AuthorAnalyticsComponent } from './author-analytics/author-analytics.component';
import { UserDropdownComponent } from './user-dropdown/user-dropdown.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MyBarChartComponent,
    HomeComponent,
    OverallAnalyticsComponent,
    RegisterComponent,
    PieChartComponent,
    IndividualAnalyticsComponent,
    AuthorAnalyticsComponent,
    UserDropdownComponent
  ],
  imports: [
    NgbModalModule,
    RouterModule.forRoot([
      { path: '',
        component: HomeComponent,
        data: { title: 'Home' },
        pathMatch: 'full',
      },
      { path: 'register',
        component: RegisterComponent,
        data: { title: 'Register' }
      },
      { path: 'login',
        component: LoginComponent,
        data: { title: 'Login' }
      },
      { path: 'overall',
        component: OverallAnalyticsComponent,
        data: { title: 'Overall Analytics' },
        canActivate: [AuthGuard]
      },
      { path: 'individual',
        component: IndividualAnalyticsComponent,
        data: { title: 'Individual Analytics' },
        canActivate: [AuthGuard]
      },
      { path: 'author',
        component: AuthorAnalyticsComponent,
        data: { title: 'Author' },
        canActivate: [AuthGuard]
      },
      { path: '**', component: HomeComponent },
    ]),
    NgxWebstorageModule.forRoot({
      prefix: 'app',
      separator: '.',
      caseSensitive: true,
    }),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ChartsModule,
    MatBadgeModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  providers: [ChartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
