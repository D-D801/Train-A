import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchFilterService {
  private readonly _carouselIndex = signal<number>(0);

  public carouselIndex = this._carouselIndex.asReadonly();

  private readonly _activeTabIndex = signal<number | null>(null);

  public activeTabIndex = this._activeTabIndex.asReadonly();

  public setCarouselIndex(result: number) {
    this._carouselIndex.set(result);
  }

  public setActiveTabIndex(result: number | null) {
    this._activeTabIndex.set(result);
  }
}
