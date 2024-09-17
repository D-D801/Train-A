import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnInit } from '@angular/core';
import { DepartureDateWithIds } from '@features/search/interfaces/filter-dates.interface';
import { SearchFilterService } from '@features/search/services/search-filter/search-filter.service';
import { convertToDate } from '@shared/utils/convertToDateWithTime';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { TuiCarouselButtons, TuiCarouselComponent } from '@taiga-ui/kit';
import { fromEvent, Observable, Subscription } from 'rxjs';

const mobileWidth = 520;
const middleWidth = 650;
const tabletWidth = 800;

function getVisibleSlidesCountFromWidth(width: number) {
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
  public readonly filteredDates = input.required<DepartureDateWithIds[]>();

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly searchFilterService = inject(SearchFilterService);

  public resizeObservable$: Observable<Event> = fromEvent(window, 'resize');

  public resizeSubscription$!: Subscription;

  protected readonly dateConverter2 = convertToDate;

  protected activeIndex = this.searchFilterService.activeTabIndex;

  protected index = this.searchFilterService.carouselIndex;

  public onItemClick(index: number): void {
    this.searchFilterService.setActiveTabIndex(index);
  }

  public itemsCount = 5;

  public constructor() {
    effect(() => {
      this.itemsCount = 5;
      this.updateItemsFromDatesCount();
    });
  }

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
    this.itemsCount = getVisibleSlidesCountFromWidth(width);

    this.updateItemsFromDatesCount();

    this.cdr.detectChanges();
  }

  private updateItemsFromDatesCount() {
    if (this.filteredDates().length < this.itemsCount) {
      this.itemsCount = this.filteredDates().length;
    }
  }
}
