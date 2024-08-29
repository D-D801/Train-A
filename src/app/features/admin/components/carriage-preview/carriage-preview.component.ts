import { NgClass, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { Carriage } from '@features/admin/interfaces/carriage.interface';
import { TuiAppearance, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'dd-carriage-preview',
  standalone: true,
  imports: [NgFor, TuiCardLarge, TuiSurface, TuiTitle, TuiHeader, TuiAppearance, NgClass],
  templateUrl: './carriage-preview.component.html',
  styleUrl: './carriage-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagePreviewComponent {
  public options = input<{ isClick: boolean; isShowTitle: boolean }>({
    isClick: false,
    isShowTitle: true,
  });

  public carriage = input.required<Carriage | null>();

  public seatSelected = output<{ seatNumber: number; carriageType: string }>();

  public seatNumbers = signal<Array<{ leftRow: number[]; rightRow: number[] }>>([]);

  public selectedSeat: number | null = null;

  public reservedSeats: Set<number> = new Set();

  public constructor() {
    effect(
      () => {
        if (this.carriage()) {
          this.updateSeatNumbers();
        }
      },
      { allowSignalWrites: true }
    );
  }

  private updateSeatNumbers(): void {
    let currentSeatNumber = 1;

    const setSeatNumber = () => {
      const seatNumber = currentSeatNumber;
      currentSeatNumber += 1;
      return seatNumber;
    };

    const carriage = this.carriage() as Carriage;
    if (!carriage) return;

    this.seatNumbers.set(
      Array.from({ length: carriage.rows }, () => {
        const leftRow = Array.from({ length: carriage.leftSeats }, () => {
          return setSeatNumber();
        });

        const rightRow = Array.from({ length: carriage.rightSeats }, () => {
          return setSeatNumber();
        });

        return { leftRow: leftRow.reverse(), rightRow: rightRow.reverse() };
      })
    );
  }

  public onSeatClick(seatNumber: number) {
    if (!this.options().isClick) return;
    if (this.selectedSeat === seatNumber) {
      this.selectedSeat = null;
    } else {
      this.selectedSeat = seatNumber;
    }
    const carriageType = this.carriage()?.name;
    if (!carriageType || !this.selectedSeat) return;
    this.seatSelected.emit({ seatNumber: this.selectedSeat, carriageType });
  }

  public isSeatSelected(seatNumber: number) {
    return this.selectedSeat === seatNumber;
  }

  public isSeatReserved(seatNumber: number) {
    return this.reservedSeats.has(seatNumber);
  }
}
