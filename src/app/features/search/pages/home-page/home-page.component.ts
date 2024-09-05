import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SearchFilterComponent } from '@features/search/components/search-filter/search-filter.component';
import { SearchFilterService } from '@features/search/services/search-filter/search-filter.service';
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

  private readonly searchFilterService = inject(SearchFilterService);

  protected filterDates = this.searchService.filterDates;

  protected from = this.searchService.departureStation;

  protected to = this.searchService.arrivalStation;

  protected rides = computed(() => {
    const index = this.searchFilterService.activeTabIndex();
    if (index == null) return [];
    return this.filterDates()[index]?.rideIds ?? [];
  });

  protected searchResultParams = computed(() => {
    const from = this.from();
    const to = this.to();
    if (!from || !this.rides() || !to) return null;

    return {
      from,
      routes: this.rides(),
      to,
    };
  });
}
