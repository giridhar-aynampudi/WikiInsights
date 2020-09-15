import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { ChartService } from './chart.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private chartService: ChartService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.chartService.userObservable.pipe(
      take(1),
      map(user => {
        const authenticated: boolean = !!user;
        if (!authenticated) {
            this.router.navigate(['/register']);
            return false;
        } else {
          return true;
        }
      })
    );
  }
}
