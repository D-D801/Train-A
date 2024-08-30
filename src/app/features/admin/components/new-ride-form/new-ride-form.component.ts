import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewRideService } from '@features/admin/services/new-ride/new-ride.service';
import { getCurrentDateTime } from '@shared/utils/getCurrentDateTime';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';

import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { TuiButton, TuiError, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiAccordion, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import {
  TuiInputDateTimeModule,
  TuiInputNumberModule,
  TuiInputModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';

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
    TuiCurrencyPipe,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './new-ride-form.component.html',
  styleUrl: './new-ride-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewRideFormComponent implements OnInit {
  public path = input.required<number[]>();

  public carriages = input.required<string[]>();

  private readonly newRideService = inject(NewRideService);

  private readonly fb = inject(FormBuilder);

  protected rideForm = this.fb.group({
    segments: this.fb.array([]),
  });

  protected minDate = getCurrentDateTime();

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
    this.newRideService.closeNewRideForm();
  }
}
