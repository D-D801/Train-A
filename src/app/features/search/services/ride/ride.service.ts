/* eslint-disable class-methods-use-this */
import { effect, inject, Injectable } from '@angular/core';
import { CarriageService } from '@core/services/carriage/carriage.service';
import { RoadSection } from '@features/search/interfaces/search-route-response.interface';
import { dateConverter } from '@shared/utils/date-converter';

export interface CarriageList {
  [key: string]: {
    index: number;
    carriage: string;
  }[];
}

export interface Price {
  [key: string]: number;
}

export interface SeatsPerCarriage {
  [key: string]: number;
}

@Injectable({
  providedIn: 'root',
})
export class RideService {
  private readonly carriageService = inject(CarriageService);

  public carriages = this.carriageService.carriages;

  public seatsPerCarriage: SeatsPerCarriage = {};

  public constructor() {
    effect(() => {
      if (this.carriages()) {
        this.seatsPerCarriage = this.carriages().reduce((acc, carriage) => {
          const totalSeats = (carriage.leftSeats + carriage.rightSeats) * carriage.rows;
          acc[carriage.name] = totalSeats;
          return acc;
        }, {} as SeatsPerCarriage);
      }
    });
  }

  public groupCarriages(carriages: string[]): CarriageList {
    return carriages.reduce((acc, carriage, index) => {
      if (!acc[carriage]) {
        acc[carriage] = [];
      }
      acc[carriage].push({ index: index + 1, carriage });
      return acc;
    }, {} as CarriageList);
  }

  public setPrices(segments: RoadSection[]): Price {
    return segments.reduce((acc, segment) => {
      Object.entries(segment.price).forEach(([carriageType, price]) => {
        acc[carriageType] = (acc[carriageType] || 0) + price;
      });
      return acc;
    }, {} as Price);
  }

  public setTimes(segments: RoadSection[], time: string): string {
    let date = '';
    if (time === 'start') {
      const [, startDate] = segments[0].time;
      date = startDate;
    } else {
      const [endDate] = segments[segments.length - 1].time;
      date = endDate;
    }
    return dateConverter(date);
  }

  public calculateGlobalSeatNumber(
    rideCarriages: string[],
    carriageType: string,
    index: number,
    seatNumber: number
  ): number {
    let totalSeatsBeforeCurrentCarriage = 0;

    for (let i = 0; i < rideCarriages.length; i += 1) {
      const currentCarriageType = rideCarriages[i];

      if (currentCarriageType === carriageType && i + 1 === index) {
        break;
      }

      const seats = this.seatsPerCarriage[currentCarriageType];
      if (seats) {
        totalSeatsBeforeCurrentCarriage += seats;
      }
    }

    return totalSeatsBeforeCurrentCarriage + seatNumber;
  }
}
