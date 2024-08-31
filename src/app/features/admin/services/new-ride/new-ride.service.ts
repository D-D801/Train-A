import { Injectable, signal } from '@angular/core';

@Injectable()
export class NewRideService {
  private readonly _isOpenNewRideForm = signal(false);

  public isOpenNewRideForm = this._isOpenNewRideForm.asReadonly();

  public toggleNewRideForm() {
    this._isOpenNewRideForm.update((isOpen) => !isOpen);
  }

  public closeNewRideForm() {
    this._isOpenNewRideForm.set(false);
  }
}
