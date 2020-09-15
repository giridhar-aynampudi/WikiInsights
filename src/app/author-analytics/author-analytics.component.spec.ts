import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorAnalyticsComponent } from './author-analytics.component';

describe('AuthorAnalyticsComponent', () => {
  let component: AuthorAnalyticsComponent;
  let fixture: ComponentFixture<AuthorAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
