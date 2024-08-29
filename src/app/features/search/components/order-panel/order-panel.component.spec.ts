import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPanelComponent } from './order-panel.component';

describe('OrderPanelComponent', () => {
  let component: OrderPanelComponent;
  let fixture: ComponentFixture<OrderPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
