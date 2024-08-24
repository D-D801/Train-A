import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSwitchFormComponent } from './text-switch-form.component';

describe('TextFormComponent', () => {
  let component: TextSwitchFormComponent;
  let fixture: ComponentFixture<TextSwitchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextSwitchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextSwitchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
