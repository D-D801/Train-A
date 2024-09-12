import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, OnInit } from '@angular/core';
import { DepartureDateWithIds } from '@features/search/interfaces/filter-dates.interface';
import { SearchFilterService } from '@features/search/services/search-filter/search-filter.service';
import { dateConverter2 } from '@shared/utils/date-converter';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { TuiCarouselButtons, TuiCarouselComponent } from '@taiga-ui/kit';
import { fromEvent, Observable, Subscription } from 'rxjs';

const mobileWidth = 520;
const middleWidth = 650;
const tabletWidth = 800;

function getItemsCountFromWidth(width: number) {
  if (width < mobileWidth) {
    return 2;
  }
  if (width < middleWidth) {
    return 3;
  }
  if (width < tabletWidth) {
    return 4;
  }
  return 5;
}

@Component({
  selector: 'dd-search-filter',
  standalone: true,
  imports: [TuiCarouselComponent, TuiLoader, TuiItem, TuiButton, TuiCarouselButtons, NgClass],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFilterComponent implements OnInit {
  public resizeObservable$: Observable<Event> = fromEvent(window, 'resize');

  public resizeSubscription$!: Subscription;

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly searchFilterService = inject(SearchFilterService);

  public readonly filteredDates = input.required<DepartureDateWithIds[]>();

  protected readonly dateConverter2 = dateConverter2;

  protected activeIndex = this.searchFilterService.activeTabIndex;

  protected index = this.searchFilterService.carouselIndex;

  public onItemClick(index: number): void {
    this.searchFilterService.setActiveTabIndex(index);
  }

  public itemsCount = 5;

  public ngOnInit() {
    this.updateItemsCount(window.innerWidth);

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      const target = evt.target as Window | null;
      if (target) {
        this.updateItemsCount(target.innerWidth);
      }
    });
  }

  public setCarouselIndex(index: number) {
    this.searchFilterService.setCarouselIndex(index);
  }

  private updateItemsCount(width: number) {
    this.itemsCount = getItemsCountFromWidth(width);

    this.cdr.detectChanges();
  }
}
