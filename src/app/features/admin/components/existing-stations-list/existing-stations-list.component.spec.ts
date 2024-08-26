import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingStationsListComponent } from './existing-stations-list.component';

describe('ExistingStationsListComponent', () => {
  let component: ExistingStationsListComponent;
  let fixture: ComponentFixture<ExistingStationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistingStationsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExistingStationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
