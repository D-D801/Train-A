import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiButton, TuiAutoColorPipe } from '@taiga-ui/core';
import { AuthService } from '@features/auth/services/auth.service';
import { TuiAvatar } from '@taiga-ui/kit';
import { ProfileFieldComponent } from './profile-field/profile-field/profile-field.component';

@Component({
  selector: 'dd-profile-page',
  standalone: true,
  imports: [TuiAvatar, TuiAutoColorPipe, ProfileFieldComponent, TuiButton],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
