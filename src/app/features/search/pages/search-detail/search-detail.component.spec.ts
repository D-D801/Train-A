import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { SearchDetailComponent } from './search-detail.component';

describe('SearchDetailComponent', () => {
  let component: SearchDetailComponent;
  let fixture: ComponentFixture<SearchDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchDetailComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
