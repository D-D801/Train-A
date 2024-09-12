/* eslint-disable class-methods-use-this */
import { computed, inject, Injectable } from '@angular/core';
import { CarriagesService } from '@core/services/carriages/carriages.service';
import { Price, Segment } from '@shared/interfaces/segment.interface';
import { dateConverter } from '@shared/utils/date-converter';

export interface CarriageList {
  [key: string]: {
    index: number;
    carriage: string;
  }[];
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
  carriageName: string;
  carriageType: string;
  localSeatNumber: number;
  carriageIndex: number;
}

export interface FreeSeat {
  [key: number]: { carriageType: string; availableSeats: number };
}
@Injectable({
  providedIn: 'root',
})
export class TripService {
  private readonly carriagesService = inject(CarriagesService);

  public carriages = this.carriagesService.carriages;

  public seatsPerCarriage = computed<SeatsPerCarriage>(() => {
    return this.carriages().reduce((acc, carriage) => {
      const totalSeats = (carriage.leftSeats + carriage.rightSeats) * carriage.rows;
      acc[carriage.code] = totalSeats;
      return acc;
    }, {} as SeatsPerCarriage);
  });

  public groupCarriages(carriages: string[]): CarriageList {
    return carriages.reduce((acc, carriage, index) => {
      if (!acc[carriage]) {
        acc[carriage] = [];
      }
      acc[carriage].push({ index: index + 1, carriage: this.getCarriageByCode(carriage)?.name ?? '' });
      return acc;
    }, {} as CarriageList);
  }

  public setPrices(segments: Segment[]): Price {
    return segments.reduce((acc, segment) => {
      Object.entries(segment.price).forEach(([carriageType, price]) => {
        acc[carriageType] = (acc[carriageType] || 0) + price;
      });
      return acc;
    }, {} as Price);
  }

  public setTimes(segments: Segment[], time: string): string {
    if (!segments.length) return '';
    const date = time === 'start' ? segments[0].time[0] : segments[segments.length - 1].time[1];
    return dateConverter(date);
  }

  public calculateGlobalSeatNumber(carriages: string[], index: number, seatNumber: number | null): number {
    const totalSeatsBeforeCurrentCarriage = carriages.slice(0, index - 1).reduce((acc, type) => {
      return acc + (this.seatsPerCarriage()[type] || 0);
    }, 0);

    return totalSeatsBeforeCurrentCarriage + (seatNumber || 0);
  }

  public getOccupieSeatsInCarriages(globalSeatNumbers: number[], carriages: string[]) {
    return globalSeatNumbers.map((globalSeatNumber) => {
      let totalSeatsBeforeCurrentCarriage = 0;

      for (let i = 0; i < carriages.length; i += 1) {
        const carriageType = carriages[i];
        const carriageName = this.getCarriageByCode(carriages[i])?.name ?? '';
        const seatsInCarriage = this.seatsPerCarriage()[carriageType] || 0;

        if (globalSeatNumber <= totalSeatsBeforeCurrentCarriage + seatsInCarriage) {
          return {
            carriageType,
            carriageName,
            localSeatNumber: globalSeatNumber - totalSeatsBeforeCurrentCarriage,
            carriageIndex: i + 1,
          };
        }

        totalSeatsBeforeCurrentCarriage += seatsInCarriage;
      }

      return {
        carriageType: '',
        carriageName: '',
        localSeatNumber: 0,
        carriageIndex: 0,
      };
    });
  }

  public getAvailableSeats(
    occupiedSeats: BookSeats[],
    carriageList: CarriageList
  ): { [key: number]: { carriageType: string; availableSeats: number } } {
    const occupiedCountByIndex = occupiedSeats.reduce(
      (acc, seat) => {
        const { carriageIndex } = seat;
        acc[carriageIndex] = (acc[carriageIndex] || 0) + 1;
        return acc;
      },
      {} as { [key: number]: number }
    );
    const totalSeatsByIndex = Object.keys(carriageList).reduce((acc, type) => {
      carriageList[type].forEach((carriage) => {
        acc[carriage.index] = { carriageType: type, availableSeats: this.seatsPerCarriage()[type] || 0 };
      });
      return acc;
    }, {} as FreeSeat);

    const availableSeatsByIndex = Object.keys(totalSeatsByIndex).reduce((acc, indexStr) => {
      const index = Number(indexStr);
      const occupiedSeatsCount = occupiedCountByIndex[index] || 0;
      const { carriageType, availableSeats } = totalSeatsByIndex[index];

      acc[index] = {
        carriageType,
        availableSeats: availableSeats - occupiedSeatsCount,
      };

      return acc;
    }, {} as FreeSeat);

    return availableSeatsByIndex;
  }

  public sumSeatsByType(seats: FreeSeat, type: string): number {
    return Object.values(seats).reduce((acc, { carriageType, availableSeats }) => {
      return carriageType === type ? acc + availableSeats : acc;
    }, 0);
  }

  public getCarriageByCode(code: string) {
    return this.carriages().find((carriage) => carriage.code === code) ?? null;
  }
}
