import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { Carriage } from '@features/admin/interfaces/carriage.interface';

@Component({
  selector: 'dd-carriage-preview',
  standalone: true,
  imports: [NgFor],
  templateUrl: './carriage-preview.component.html',
  styleUrl: './carriage-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagePreviewComponent {
  public carriage = input.required<Carriage | null>();

  public seatNumbers = signal<Array<{ leftRow: number[]; rightRow: number[] }>>([]);

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
}
