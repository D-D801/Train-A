export interface Station {
  id: number;
  city: string;
  latitude: number;
  longitude: number;
  connectedTo: ConnectedStation[];
}

export interface ConnectedStation {
  id: number;
  distance: number;
}
