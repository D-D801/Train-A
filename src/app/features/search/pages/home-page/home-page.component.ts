import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchService } from '@features/search/services/search/search.service';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { SearchResultListComponent } from '../../components/search-result-list/search-result-list.component';

@Component({
  selector: 'dd-home-page',
  standalone: true,
  imports: [SearchFormComponent, SearchResultListComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly searchService = inject(SearchService);

  public result = this.searchService.searchResult;
}
