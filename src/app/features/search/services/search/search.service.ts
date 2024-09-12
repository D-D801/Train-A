import { Injectable, signal } from '@angular/core';
import { DepartureDateWithIds } from '@features/search/interfaces/filter-dates.interface';
import { SearchRouteResponse } from '@features/search/interfaces/search-route-response.interface';
import { CityInfo } from '@shared/interfaces/city-info.interface';
import { Station } from '@shared/interfaces/station.interface';

interface SearchFromStation {
  stationId: number;
  city: string;
}

interface SearchToStation {
  stationId: number;
  city: string;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly _cities = signal<CityInfo[]>([]);

  public cities = this._cities.asReadonly();

  private readonly _searchCities = signal<Station[]>([]);

  public searchCities = this._searchCities.asReadonly();

  private readonly _searchResult = signal<SearchRouteResponse | null>(null);

  public searchResult = this._searchResult.asReadonly();

  public readonly filterDates = signal<DepartureDateWithIds[]>([]);

  public readonly departureStation = signal<SearchFromStation | null>(null);

  public readonly arrivalStation = signal<SearchToStation | null>(null);

  public setCities(receivedCities: CityInfo[]) {
    this._cities.set(receivedCities);
  }

  public setSearchCities(receivedCities: Station[]) {
    this._searchCities.set(receivedCities);
  }

  public setSearchResult(result: SearchRouteResponse) {
    this._searchResult.set(result);
  }

  public setfilterDates(result: DepartureDateWithIds[]) {
    this.filterDates.set(result);
  }

  public setDepartureStation(result: SearchFromStation) {
    this.departureStation.set(result);
  }

  public setArrivalStation(result: SearchToStation) {
    this.arrivalStation.set(result);
  }
}
