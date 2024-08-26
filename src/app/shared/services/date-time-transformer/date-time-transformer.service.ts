import { Injectable } from '@angular/core';
import { TuiDay, TuiTime, TuiValueTransformer } from '@taiga-ui/cdk';

@Injectable({
  providedIn: 'root',
})
export class DateTimeTransformerService extends TuiValueTransformer<[TuiDay | null, TuiTime | null], string> {
  private readonly separator = ', ';

  public fromControlValue(controlValue: string | [TuiDay | null, TuiTime | null]): [TuiDay | null, TuiTime | null] {
    if (Array.isArray(controlValue)) {
      return controlValue;
    }

    const [day, time = ''] = controlValue.split(this.separator);

    const parsedDay = day ? TuiDay.normalizeParse(day) : null;
    const parsedTime = time ? TuiTime.fromString(time) : null;

    return [parsedDay, parsedTime];
  }

  public toControlValue([day, time]: [TuiDay | null, TuiTime | null]): string {
    return day ? `${day.toString()}${time ? `${this.separator}${time.toString()}` : ''}` : '';
  }
}
