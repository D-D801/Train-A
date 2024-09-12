import { TrainRoute } from '@shared/interfaces/train-route.interface';
import { CityCoordinates } from './city-coordinates.interface';

export interface SearchRouteResponse {
  from: {
    stationId: number;
    city: string;
    geolocation: CityCoordinates;
  };
  to: {
    stationId: number;
    city: string;
    geolocation: {
      latitude: number;
      longitude: number;
    };
  };
  routes: TrainRoute[];
}
