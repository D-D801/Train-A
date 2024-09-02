import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Station } from '@features/admin/interfaces/station.interface';
import { RoadSection } from '@features/search/interfaces/search-route-response.interface';
import { ModalRideInfo } from '@shared/interfaces/route-info.interface';
import { calculateStopDuration } from '@shared/utils/calculate-train-stop-duration';
import { formatTime } from '@shared/utils/format-date';
import { TuiDialogContext, TuiIcon } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';

interface RideInfo {
  departureTime: string;
  arrivalTime: string;
  city: string;
  stopDuration: string;
}

interface StationInfo {
  cityId: number;
  index: number;
  pathLength: number;
  segments: RoadSection[];
}

@Component({
  selector: 'dd-ride-info',
  standalone: true,
  imports: [NgClass, TuiIcon],
  templateUrl: './ride-info.component.html',
  styleUrl: './ride-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RideInfoComponent {
  private readonly context = inject<TuiDialogContext<number, ModalRideInfo>>(POLYMORPHEUS_CONTEXT);

  private readonly http = inject(HttpClient);

  private readonly stations = toSignal(this.http.get<Station[]>('/api/station'));

  public from = this.context.data.from;

  public to = this.context.data.to;

  protected stationsInfo: RideInfo[] = [];

  public constructor(private readonly cdr: ChangeDetectorRef) {
    effect(() => {
      // TODO: refactor this in future - get stations from service
      const allStations = this.stations();
      if (allStations) {
        const {
          ride: {
            path,
            schedule: { segments },
          },
        } = this.context.data;

        this.from = path.indexOf(this.context.data.from);
        this.to = path.indexOf(this.context.data.to);

        this.stationsInfo = path.map((cityId, index, array) =>
          this.getStationInfo({ cityId, index, pathLength: array.length, segments })
        );
        cdr.markForCheck();
      }
    });
  }

  private getStationInfo({ cityId, index, pathLength, segments }: StationInfo) {
    if (!segments[index])
      return {
        departureTime: '',
        city: this.getCityNameById(cityId),
        stopDuration: 'Last station',
        arrivalTime: '',
      };

    const [departureTime, arrivalTime] = segments[index].time;
    const arrivalTimeToStation =
      index > 0 && index < pathLength ? segments[index - 1].time[1] : segments[index].time[0];

    return {
      departureTime: formatTime(departureTime),
      arrivalTime: formatTime(arrivalTime),
      city: this.getCityNameById(cityId),
      stopDuration: index !== 0 ? calculateStopDuration(arrivalTimeToStation, departureTime) : 'First station',
    };
  }

  private getCityNameById(cityId: number) {
    const allStations = this.stations();
    if (!allStations) return '';
    return allStations.find((station) => station.id === cityId)?.city || '';
  }
}
