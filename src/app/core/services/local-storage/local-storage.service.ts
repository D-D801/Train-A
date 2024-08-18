import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '@core/services/tokens/local-storage.token';
import { LocalStorageKey } from '@shared/enums/local-storage-key.enum';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(@Inject(LOCAL_STORAGE) private localStorage: Storage) {}

  setItem(key: LocalStorageKey, value: string) {
    this.localStorage.setItem(key, value);
  }

  getItem(key: LocalStorageKey) {
    return this.localStorage.getItem(key);
  }

  removeItem(key: LocalStorageKey) {
    this.localStorage.removeItem(key);
  }

  clear() {
    this.localStorage.clear();
  }
}
