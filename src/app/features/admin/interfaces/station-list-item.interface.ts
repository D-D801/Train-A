export interface StationListItem {
  id: number;
  city: string;
  latitude: number;
  longitude: number;
  connectedTo: ConnectedStation[];
}

interface ConnectedStation {
  id: number;
  distance: number;
}
