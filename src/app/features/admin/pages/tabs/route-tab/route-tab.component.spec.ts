import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteTabComponent } from './route-tab.component';

describe('RouteTabComponent', () => {
  let component: RouteTabComponent;
  let fixture: ComponentFixture<RouteTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient()],
      imports: [RouteTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
