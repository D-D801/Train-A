import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TuiAlertService } from '@taiga-ui/core';
import { Subscription } from 'rxjs';

interface Alert {
  message: string | null;
  label?: string;
  appearance?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly alert = inject(TuiAlertService);

  private readonly destroy = inject(DestroyRef);

  open({ message, label, appearance = 'info' }: Alert): Subscription {
    return this.alert.open(message, { label, appearance }).pipe(takeUntilDestroyed(this.destroy)).subscribe();
  }
}
