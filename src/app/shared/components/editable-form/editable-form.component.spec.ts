import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiInputDateTimeModule, TuiInputModule, TuiInputNumberModule } from '@taiga-ui/legacy';
import { of } from 'rxjs';
import { TuiButton } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { ComponentRef } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { EditableFormComponent } from './editable-form.component';

describe('EditableFormComponent', () => {
  let component: EditableFormComponent;
  let componentRef: ComponentRef<EditableFormComponent>;
  let fixture: ComponentFixture<EditableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TuiButton,
        TuiInputModule,
        TuiInputNumberModule,
        TuiInputDateTimeModule,
        TuiFieldErrorPipe,
      ],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(EditableFormComponent);
    component = fixture.componentInstance;

    componentRef = fixture.componentRef;
    componentRef.setInput('onSave', jest.fn());
    componentRef.setInput(
      'form',
      jest.fn().mockReturnValue({
        valid: true,
        valueChanges: of({}),
      })
    );

    componentRef.setInput('typeInputs', 'text');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
