import { filter } from 'rxjs/operators';
import { Component, ViewChild, OnChanges, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationStart,
  NavigationEnd,
  Router,
} from '@angular/router';
import { ChartService } from './chart.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('sideNavDrawer') sideNavDrawer;
  @ViewChild('routerOutletParent') routerOutletEle;
  screenWidth: number;
  mobileWidth = false; // boolean
  isLoggedIn: boolean;
  userIsAdmin: boolean;
  drawerMode: string;
  drawerOpened: boolean;

  siteTheme: string;

  // Scroll position maintainer
  private lastPoppedScrollTop: number;
  private currentRouteId: number;
  private yScrollStack: number[] = [];

  title = 'web-application';
  primaryNavLinks: NavLink[] = [
    {
      routerLink: '/',
      icon: 'home',
      title: 'Home',
    },
  ];

  secondaryNavLinks: NavLink[] = [
    {
      routerLink: '/overall',
      icon: 'create',
      title: 'Overall Analytics',
      isLoggedInRoute: true,
    },
    {
      routerLink: '/individual',
      icon: 'drafts',
      title: 'Individual Analytics',
      isLoggedInRoute: true,
    },
    {
      routerLink: '/author',
      icon: 'person',
      title: 'Author Analytics',
      isLoggedInRoute: true,
    },
  ];

  toggleSideNavDrawer() {
    this.sideNavDrawer.toggle();
  }

  hideSideNavAfterClick() {
    if (this.mobileWidth) {
      this.toggleSideNavDrawer();
    }
  }

  setSideBar() {
    if (this.screenWidth < 768) {
      this.drawerMode = 'over'; // push or over
      this.drawerOpened = false;
      this.mobileWidth = true;
    } else {
      this.drawerMode = 'side';
      this.drawerOpened = true;
      this.mobileWidth = false;
    }
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chartService: ChartService,
  ) {
    // Set side bar mode
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      this.screenWidth = window.innerWidth;
      this.setSideBar();
    };
    router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .forEach((e: NavigationEnd) => {
        this.title = route.root.firstChild.snapshot.data['title'];
      });

    this.chartService.userObservable.subscribe(user => {
      this.isLoggedIn = !!user;
    });
    this.setSideBar(); // set the sidebar values
  }

  ngOnInit() {
    this.setSideBar();

    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationStart) {
        if (this.routerOutletEle.nativeElement) {
          // this has been placed here as a hack since this element is not ready on first load
          const el = this.routerOutletEle.nativeElement;
          this.yScrollStack[this.currentRouteId] = el.scrollTop;
          // Determine if we are going back
          if (
            ev.restoredState &&
            ev.restoredState.navigationId &&
            this.yScrollStack[ev.restoredState.navigationId]
          ) {
            this.lastPoppedScrollTop = this.yScrollStack[
              ev.restoredState.navigationId
            ];
          } else {
            this.lastPoppedScrollTop = 0;
          }
        }
      } else if (ev instanceof NavigationEnd) {
        if (this.routerOutletEle.nativeElement) {
          // this has been placed here as a hack since this element is not ready on first load
          this.currentRouteId = ev.id;
          const el = this.routerOutletEle.nativeElement;
          el.scrollTop = this.lastPoppedScrollTop
            ? this.lastPoppedScrollTop
            : 0;
        }
      }
    });

  }
}

interface NavLink {
  routerLink: string;
  icon: string;
  title: string;
  isAdminRoute?: boolean;
  isLoggedInRoute?: boolean;
}
