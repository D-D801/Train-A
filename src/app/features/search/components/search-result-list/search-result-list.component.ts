import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchService } from '@features/search/services/search/search.service';

export function calculateStopDuration(arrival: string, departure: string): string {
  const arrivalDate = new Date(arrival);
  const departureDate = new Date(departure);
  const diffMs = Math.abs(departureDate.getTime() - arrivalDate.getTime());

  const minutes = Math.floor(diffMs / 1000 / 60) % 60;
  const hours = Math.floor(diffMs / 1000 / 60 / 60) % 24;
  const days = Math.floor(diffMs / 1000 / 60 / 60 / 24);

  if (days > 0) {
    return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
  }
  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }
  return `${minutes} min`;
}

@Component({
  selector: 'dd-search-result-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './search-result-list.component.html',
  styleUrl: './search-result-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultListComponent {
  private readonly searchService = inject(SearchService);

  public searchResult = this.searchService.searchResult;

  // eslint-disable-next-line class-methods-use-this
  public getTravelTime(arrival: string, departure: string) {
    return calculateStopDuration(arrival, departure);
  }

  // eslint-disable-next-line class-methods-use-this
  public getUniqueCarriages = (carriages: string[]) => {
    return [...new Set(carriages)];
  };
}
