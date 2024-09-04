import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SearchFilterComponent } from '@features/search/components/search-filter/search-filter.component';
import { SearchService } from '@features/search/services/search/search.service';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { SearchResultListComponent } from '../../components/search-result-list/search-result-list.component';

@Component({
  selector: 'dd-home-page',
  standalone: true,
  imports: [SearchFormComponent, SearchResultListComponent, TuiBlockStatus, SearchFilterComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly searchService = inject(SearchService);

  public result = this.searchService.searchResult;

  protected filterDates = this.searchService.filterDates;

  protected from = this.searchService.departureStation;

  protected to = this.searchService.arrivalStation;

  private readonly indexSignal = signal<number>(0);

  protected rides = computed(() => this.filterDates()[this.indexSignal()]?.rideIds ?? []);

  protected searchResultParams = computed(() => {
    const from = this.from();
    const to = this.to();
    // const rides = this.rides();
    if (!from || !this.rides() || !to) return null;

    return {
      from,
      routes: this.rides(),
      to,
    };
  });

  public hasResults = computed(() => Array.isArray(this.result()?.routes) && !!this.result()?.routes.length);

  public onFilterSelect(index: number) {
    this.indexSignal.set(index);
    // console.log('filteredRides', index, this.filterDates()[index].rideIds);
  }
}
