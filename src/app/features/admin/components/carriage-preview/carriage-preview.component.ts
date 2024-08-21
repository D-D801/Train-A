import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Carriage } from '@features/admin/interfaces/carriage.interface';

@Component({
  selector: 'dd-carriage-preview',
  standalone: true,
  imports: [NgFor],
  templateUrl: './carriage-preview.component.html',
  styleUrl: './carriage-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagePreviewComponent implements OnChanges {
  @Input({ required: true }) public carriage!: Carriage;

  public seatNumbers: Array<{ leftRow: number[]; rightRow: number[] }> = [];

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['carriage']) {
      this.updateSeatNumbers();
    }
  }

  private updateSeatNumbers(): void {
    let currentSeatNumber = 1;

    this.seatNumbers = Array.from({ length: this.carriage.rows }, () => {
      const leftRow = Array.from({ length: this.carriage.leftSeats }, () => {
        const seatNumber = currentSeatNumber;
        currentSeatNumber += 1;
        return seatNumber;
      });

      const rightRow = Array.from({ length: this.carriage.rightSeats }, () => {
        const seatNumber = currentSeatNumber;
        currentSeatNumber += 1;
        return seatNumber;
      });

      return { leftRow: leftRow.reverse(), rightRow: rightRow.reverse() };
    });
  }
}
