import { ConnectedStation, Station } from '@features/admin/interfaces/station.interface';

function getAvailableStations({
  stations,
  stationId,
  index,
  formControlsPathValue,
  allAvailableStations,
}: {
  stations: Station[];
  stationId: number | null;
  index: number;
  formControlsPathValue: (number | null)[];
  allAvailableStations: { id: number }[];
}) {
  let availableStations: ConnectedStation[] = [];
  const prevStation = index > 0 ? formControlsPathValue[index - 1] : null;
  const nextStation = index < formControlsPathValue.length - 1 ? formControlsPathValue[index + 1] : null;
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
}

export function updateAvailableStations(formControlsPathValue: (number | null)[], stations: Station[]) {
  const allAvailableStations = stations.map((station) => {
    return {
      id: station.id,
    };
  });

  const connectedToStations = formControlsPathValue.map((stationId, index) =>
    getAvailableStations({ stationId, index, allAvailableStations, formControlsPathValue, stations })
  );

  return connectedToStations.map((connectedStations) =>
    connectedStations.map((connectedStation) => stations[connectedStation.id - 1].city)
  );
}
