import { ConnectedStation, Station } from '@features/admin/interfaces/station.interface';

export function updateAvailableStations(formControlsPathValue: (number | null)[], stations: Station[]) {
  const allAvailableStations = stations.map((station) => {
    return {
      id: station.id,
    };
  });
  const connectedToStations = formControlsPathValue.map((stationId, index, array) => {
    let availableStations: ConnectedStation[] = [];
    const prevStation = index > 0 ? array[index - 1] : null;
    const nextStation = index < array.length - 1 ? array[index + 1] : null;
    const prevStationConnect = prevStation ? stations[prevStation - 1]?.connectedTo || [] : [];
    const nextStationConnect = nextStation ? stations[nextStation - 1]?.connectedTo || [] : [];

    if (prevStation != null && nextStation != null) {
      availableStations = prevStationConnect.filter((connectStation) =>
        nextStationConnect.some((nextSt) => nextSt.id === connectStation.id && nextSt.id !== stationId)
      );
    } else if (prevStation != null) {
      availableStations = prevStationConnect;
    } else if (nextStation != null) {
      availableStations = nextStationConnect;
    } else if (prevStation === null && nextStation === null) availableStations = allAvailableStations;
    return availableStations;
  });

  return connectedToStations.map((item) => item.map((item2) => stations[item2.id - 1]?.city));
}
