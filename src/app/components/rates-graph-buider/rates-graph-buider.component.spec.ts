import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatesGraphBuiderComponent } from './rates-graph-buider.component';

describe('RatesGraphBuiderComponent', () => {
  let component: RatesGraphBuiderComponent;
  let fixture: ComponentFixture<RatesGraphBuiderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatesGraphBuiderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesGraphBuiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
