import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationsPageComponent } from './stations-page.component';

describe('StationsPageComponent', () => {
  let component: StationsPageComponent;
  let fixture: ComponentFixture<StationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
