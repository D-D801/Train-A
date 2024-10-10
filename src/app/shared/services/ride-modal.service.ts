import { inject, Injectable, INJECTOR } from '@angular/core';
import { ModalRideInfo, WithData } from '@shared/interfaces/route-info.interface';
import { RideInfoComponent } from '@shared/components/ride-info/ride-info.component';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';

@Injectable({
  providedIn: 'root',
})
export class RideModalService {
  private readonly dialogs = inject(TuiDialogService);

  private readonly injector = inject(INJECTOR);

  public showRideInfo(data: ModalRideInfo) {
    const modalOption = {
      data,
      dismissible: true,
      label: `Route ${data.ride.routeId}`,
    };
    return this.dialogs.open<WithData<ModalRideInfo>>(
      new PolymorpheusComponent(RideInfoComponent, this.injector),
      modalOption
    );
  }
}
