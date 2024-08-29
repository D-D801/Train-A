import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RideService } from '@features/admin/services/ride/ride.service';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { TuiButton, TuiError, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiAccordion, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { TuiInputDateTimeModule, TuiInputNumberModule, TuiInputModule } from '@taiga-ui/legacy';

@Component({
  selector: 'dd-new-ride-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    TuiCardLarge,
    TuiSurface,
    TuiTitle,
    TuiHeader,
    TuiAccordion,
    TuiInputDateTimeModule,
    TuiInputNumberModule,
    TuiButton,
    TuiInputModule,
    TuiError,
    AsyncPipe,
    TuiFieldErrorPipe,
  ],
  templateUrl: './new-ride-form.component.html',
  styleUrl: './new-ride-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewRideFormComponent implements OnInit {
  public path = input.required<number[]>();

  public carriages = input.required<string[]>();

  private readonly rideService = inject(RideService);

  private readonly fb = inject(FormBuilder);

  protected rideForm = this.fb.group({
    segments: this.fb.array([]),
  });

  public ngOnInit(): void {
    const segmentsArray = this.rideForm.get('segments') as FormArray;

    for (let i = 0; i < this.path().length - 1; i += 1) {
      const segmentGroup: FormGroup = this.fb.group({
        departure: this.fb.control<[TuiDay, TuiTime] | null>(null, [Validators.required]),
        arrival: this.fb.control<[TuiDay, TuiTime] | null>(null, [Validators.required]),
      });

      this.carriages().forEach((priceKey) => {
        segmentGroup.addControl(priceKey, this.fb.control(0, [Validators.required]));
      });

      segmentsArray.push(segmentGroup);
    }
  }

  protected onSubmit() {
    if (this.rideForm.valid) {
      console.log(this.rideForm.value);
    } else {
      console.log('Форма невалидна');
    }
    this.rideService.closeNewRideForm();
  }
}
