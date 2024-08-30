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

export interface SelectedOrder {
  seatNumber: number;
  carriageNumber: number;
  globalSeatNumber: number;
  price: number;
}

export interface BookSeats {
  carriageType: string;
  localSeatNumber: number;
  carriageIndex: number;
}

export interface FreeSeat {
  [key: number]: number;
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
    if (!segments.length) return '';
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
    carriages: string[],
    carriageType: string,
    index: number,
    seatNumber: number | null
  ): number {
    let totalSeatsBeforeCurrentCarriage = 0;

    for (let i = 0; i < carriages.length; i += 1) {
      const currentCarriageType = carriages[i];

      if (currentCarriageType === carriageType && i + 1 === index) {
        break;
      }

      const seats = this.seatsPerCarriage[currentCarriageType];
      if (seats) {
        totalSeatsBeforeCurrentCarriage += seats;
      }
    }

    return totalSeatsBeforeCurrentCarriage + Number(seatNumber);
  }

  public getOccupieSeatsInCarriages(
    globalSeatNumbers: number[],
    carriages: string[]
  ): { carriageType: string; localSeatNumber: number; carriageIndex: number }[] {
    return globalSeatNumbers.map((globalSeatNumber) => {
      let totalSeatsBeforeCurrentCarriage = 0;

      for (let i = 0; i < carriages.length; i += 1) {
        const carriageType = carriages[i];
        const seatsInCarriage = this.seatsPerCarriage[carriageType] || 0;

        if (globalSeatNumber <= totalSeatsBeforeCurrentCarriage + seatsInCarriage) {
          return {
            carriageType,
            localSeatNumber: globalSeatNumber - totalSeatsBeforeCurrentCarriage,
            carriageIndex: i + 1,
          };
        }

        totalSeatsBeforeCurrentCarriage += seatsInCarriage;
      }

      return {
        carriageType: 'Unknown',
        localSeatNumber: 0,
        carriageIndex: 0,
      };
    });
  }

  public getAvailableSeats(occupiedSeats: BookSeats[], carriageList: CarriageList): { [key: number]: number } {
    const occupiedCountByIndex = occupiedSeats.reduce((acc, seat) => {
      const { carriageIndex } = seat;
      acc[carriageIndex] = (acc[carriageIndex] || 0) + 1;
      return acc;
    }, {} as FreeSeat);

    const totalSeatsByIndex = Object.keys(carriageList).reduce((acc, type) => {
      carriageList[type].forEach((carriage) => {
        acc[carriage.index] = this.seatsPerCarriage[type] || 0;
      });
      return acc;
    }, {} as FreeSeat);

    const availableSeatsByIndex = Object.keys(totalSeatsByIndex).reduce((acc, indexStr) => {
      const index = Number(indexStr);
      const occupiedSeatsCount = occupiedCountByIndex[index] || 0;
      const totalSeats = totalSeatsByIndex[index];

      if (occupiedSeatsCount > 0) {
        acc[index] = totalSeats - occupiedSeatsCount;
      } else {
        acc[index] = totalSeats;
      }

      return acc;
    }, {} as FreeSeat);

    return availableSeatsByIndex;
  }
}
