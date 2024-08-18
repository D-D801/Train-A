import { inject, Injectable } from '@angular/core';
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

  public open({ message, label, appearance = 'info' }: Alert): Subscription {
    return this.alert.open(message, { label, appearance }).subscribe();
  }
}
