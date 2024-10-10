import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '@core/tokens/local-storage.token';
import { LocalStorageKey } from '@shared/enums/local-storage-key.enum';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private constructor(@Inject(LOCAL_STORAGE) private readonly localStorage: Storage) {}

  public setItem(key: LocalStorageKey, value: string) {
    this.localStorage.setItem(key, value);
  }

  public getItem(key: LocalStorageKey) {
    return this.localStorage.getItem(key);
  }

  public removeItem(key: LocalStorageKey) {
    this.localStorage.removeItem(key);
  }

  public clear() {
    this.localStorage.clear();
  }
}
