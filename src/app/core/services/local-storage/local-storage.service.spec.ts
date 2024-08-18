import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { LOCAL_STORAGE } from '@core/tokens/local-storage.token';
import { LocalStorageKey } from '@shared/enums/local-storage-key.enum';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  const mockLocalStorage: Storage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    key: jest.fn(),
    length: 0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService, { provide: LOCAL_STORAGE, useValue: mockLocalStorage }],
    });
    service = TestBed.inject(LocalStorageService);
  });

  it('should retrieve an item from localStorage', () => {
    const testKey = LocalStorageKey.UserToken;
    const testValue = 'testValue';

    const returnValue = jest.spyOn(mockLocalStorage, 'getItem').mockReturnValue(testValue);

    const result = service.getItem(testKey);

    expect(returnValue).toHaveBeenCalled();
    expect(result).toBe(testValue);
  });

  it('should set an item in localStorage', () => {
    const testKey = LocalStorageKey.UserToken;
    const testValue = 'testValue';

    service.setItem(testKey, testValue);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(testKey, testValue);
  });

  it('should remove an item from localStorage', () => {
    const testKey = LocalStorageKey.UserToken;

    service.removeItem(testKey);

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(testKey);
  });
});
