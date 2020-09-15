import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable()
export class ChartService {
    overallBarData: Array<string> = [];
    overallPieData: any;
    highestLength: any;
    userLoggedIn = false;
    user: User;
    userObservable: Subject<User> = new ReplaySubject<User>(1);

    constructor(private localStorageService: LocalStorageService, private http: HttpClient, private router: Router) {
    }

    getOverallPieData() {
        if (this.overallPieData) {
            return this.localStorageService.retrieve('overall.pie');
        } else {
            this.http.get('/api/overall/pie-chart')
                .subscribe(pie => {
                    this.overallPieData = pie;
                    this.localStorageService.store('overall.pie', this.overallPieData);
                    return this.overallPieData;
            });
        }
    }

    getOverallBarData() {
        if (Object.keys(this.overallBarData).length !== 0) {
            return this.localStorageService.retrieve('overall.bar');
        } else {
            this.http.get('/api/overall/bar-chart')
                .subscribe(bar => {
                    const convertedAdmin = Object.assign({}, ...bar['Admin'].map(object => ({[object._id]: object})));
                    const convertedBot = Object.assign({}, ...bar['Bot'].map(object => ({[object._id]: object})));
                    const convertedRegular = Object.assign({}, ...bar['Regular'].map(object => ({[object._id]: object})));
                    const convertedAnonymous = Object.assign({}, ...bar['Anonymous'].map(object => ({[object._id]: object})));
                    const lengthList = [bar['Admin'].length, bar['Bot'].length, bar['Regular'].length, bar['Anonymous'].length];
                    let max = 0;
                    for (let i = 0; i < lengthList.length; i++) {
                        const num = lengthList[i];
                        if (num >= max) {
                            max = num;
                        } else {
                            continue;
                        }
                    }
                    if (lengthList.indexOf(max) === 0) {
                        this.highestLength = bar['Admin'];
                    } else if (lengthList.indexOf(max) === 1) {
                        this.highestLength = bar['Bot'];
                    } else if (lengthList.indexOf(max) === 2) {
                        this.highestLength = bar['Regular'];
                    } else if (lengthList.indexOf(max) === 3) {
                        this.highestLength = bar['Anonymous'];
                    }
                    for (let i = 0; i < this.highestLength.length; i++) {
                        if (!(this.highestLength[i]._id in convertedAdmin)) {
                            convertedAdmin[this.highestLength[i]._id] = {_id: this.highestLength[i]._id, rev: 0};
                        }
                        if (!(this.highestLength[i]._id in convertedBot)) {
                            convertedBot[this.highestLength[i]._id] = {_id: this.highestLength[i]._id, rev: 0};
                        }
                        if (!(this.highestLength[i]._id in convertedRegular)) {
                            convertedRegular[this.highestLength[i]._id] = {_id: this.highestLength[i]._id, rev: 0};
                        }
                        if (!(this.highestLength[i]._id in convertedAnonymous)) {
                            convertedAnonymous[this.highestLength[i]._id] = {_id: this.highestLength[i]._id, rev: 0};
                        }
                    }
                    this.overallBarData['Admin'] = convertedAdmin;
                    this.overallBarData['Bot'] =  convertedBot;
                    this.overallBarData['Regular'] = convertedRegular;
                    this.overallBarData['Anonymous'] = convertedAnonymous;
                    this.localStorageService.store('overall.bar', this.overallBarData);
            });
        }
    }

    setUser(user) {
          this.user = user;
          this.localStorageService.store('user-service.user', this.user);
          this.userObservable.next(this.user);
    }

    logout() {
        this.http.post('/api/user/logout', {})
            .subscribe(() => {
                this.localStorageService.clear('user-service.user');
                this.userObservable.next(undefined);
                this.router.navigateByUrl('/');
            });
    }
}

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    isLoggedIn: boolean;
}
