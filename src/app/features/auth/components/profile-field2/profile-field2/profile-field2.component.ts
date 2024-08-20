import { ChangeDetectionStrategy, Component, contentChild, effect, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { TuiInputComponent } from '@taiga-ui/legacy';

@Component({
  selector: 'dd-profile-field2',
  standalone: true,
  imports: [],
  templateUrl: './profile-field2.component.html',
  styleUrl: './profile-field2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileField2Component {
  public input = contentChild(TuiInputComponent);

  // public value = toSignal(this.control()!.control!.valueChanges);

  public isEditMode = signal(false);

  public constructor() {
    effect(() => console.log(this.input()?.control));
  }

  protected switchEditMode() {
    this.isEditMode.set(true);
  }
}
