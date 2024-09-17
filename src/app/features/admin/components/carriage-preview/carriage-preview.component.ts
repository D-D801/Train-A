import { NgClass, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { BookSeats } from '@shared/interfaces/book-seats.interface';
import { Carriage } from '@shared/interfaces/carriage.interface';
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
  public options = input<{ isClick: boolean; isShowTitle: boolean; bookSeatWithOrderPanel: boolean }>({
    isClick: false,
    isShowTitle: true,
    bookSeatWithOrderPanel: false,
  });

  public carriage = input.required<Carriage | null>();

  public bookSeats = input<BookSeats[]>();

  public bookSeatsWithOrderPanel = input<BookSeats[]>();

  public seatSelected = output<{ seatNumber: number; carriageType: string }>();

  public seatNumbers = signal<Array<{ leftRow: number[]; rightRow: number[] }>>([]);

  public selectedSeat: number | null = null;

  public reservedSeats: Set<number> = new Set();

  public constructor() {
    effect(
      () => {
        if (this.bookSeats()) {
          this.updateReservedSeats();
        }
        if (this.options().bookSeatWithOrderPanel) {
          this.updateReservedSeats(this.bookSeatsWithOrderPanel());
        }
        if (this.carriage()) {
          this.updateSeatNumbers();
        }
      },
      { allowSignalWrites: true }
    );
  }

  private updateReservedSeats(bookSeat: BookSeats[] = []) {
    this.reservedSeats.clear();
    const bookSeats = bookSeat.length > 0 ? bookSeat : this.bookSeats();
    if (!bookSeats) return;

    bookSeats
      .filter((seat) => seat.carriageType === this.carriage()?.code)
      .forEach((seat) => this.reservedSeats.add(seat.localSeatNumber));
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
    this.selectedSeat = this.isSeatSelected(seatNumber) ? null : seatNumber;
    const carriageType = this.carriage()?.code;
    if (!this.selectedSeat) {
      this.seatSelected.emit({ seatNumber: 0, carriageType: '' });
    }
    if (!carriageType || !this.selectedSeat || this.isSeatReserved(seatNumber)) return;

    this.seatSelected.emit({ seatNumber: this.selectedSeat, carriageType });
  }

  public isSeatSelected(seatNumber: number) {
    return this.selectedSeat === seatNumber;
  }

  public isSeatReserved(seatNumber: number) {
    return this.reservedSeats.has(seatNumber);
  }
}
