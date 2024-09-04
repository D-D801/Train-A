import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, OnInit, output } from '@angular/core';
import { DepartureDateWithIds } from '@features/search/interfaces/filter-dates.interface';
import { dateConverter2 } from '@shared/utils/date-converter';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { TuiCarouselButtons, TuiCarouselComponent } from '@taiga-ui/kit';
import { fromEvent, Observable, Subscription } from 'rxjs';

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

  public currentIndex = output<number>();

  public readonly filteredDates = input.required<DepartureDateWithIds[]>();

  protected readonly dateConverter2 = dateConverter2;

  public activeIndex: number = 0;

  protected index = 0;

  public onItemClick(index: number): void {
    this.activeIndex = index;
    this.currentIndex.emit(this.activeIndex);
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

  private updateItemsCount(width: number) {
    if (width < 520) {
      this.itemsCount = 2;
    } else if (width < 650) {
      this.itemsCount = 3;
    } else if (width < 800) {
      this.itemsCount = 4;
    } else {
      this.itemsCount = 5;
    }
    this.cdr.detectChanges();
  }
}
