import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallAnalyticsComponent } from './overall-analytics.component';

describe('OverallAnalyticsComponent', () => {
  let component: OverallAnalyticsComponent;
  let fixture: ComponentFixture<OverallAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverallAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
