import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { StationsService } from '@core/services/stations/stations.service';
import { ModalRideInfo } from '@shared/interfaces/route-info.interface';
import { Segment } from '@shared/interfaces/segment.interface';
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
  segments: Segment[];
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

  private readonly stationsService = inject(StationsService);

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly stations = this.stationsService.stations;

  public from = this.context.data.from;

  public to = this.context.data.to;

  protected stationsInfo: RideInfo[] = [];

  public constructor() {
    effect(() => {
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
        this.cdr.markForCheck();
      }
    });
  }

  private getStationInfo({ cityId, index, pathLength, segments }: StationInfo) {
    if (!segments[index])
      return {
        departureTime: '',
        city: this.stationsService.getStationNameById(cityId),
        stopDuration: 'Last station',
        arrivalTime: '',
      };

    const [departureTime, arrivalTime] = segments[index].time;
    const arrivalTimeToStation =
      index > 0 && index < pathLength ? segments[index - 1].time[1] : segments[index].time[0];

    return {
      departureTime: formatTime(departureTime),
      arrivalTime: formatTime(arrivalTime),
      city: this.stationsService.getStationNameById(cityId),
      stopDuration: index !== 0 ? calculateStopDuration(arrivalTimeToStation, departureTime) : 'First station',
    };
  }
}
