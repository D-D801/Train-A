import { Routes } from '@angular/router';
import { adminGuard } from '@features/auth/guards/admin.guard';
import { authGuard } from '@features/auth/guards/auth.guard';
import { authenticatedGuard } from '@features/auth/guards/authenticated.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('@features/TrainA/pages/home-page/home-page.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'registration',
    loadComponent: () =>
      import('@features/auth/pages/registration-page/registration-page.component').then(
        (m) => m.RegistrationPageComponent
      ),
    canMatch: [authenticatedGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@features/auth/pages/login-page/login-page.component').then((m) => m.LoginPageComponent),
    canMatch: [authenticatedGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('@features/auth/pages/profile-page/profile-page.component').then((m) => m.ProfilePageComponent),
    canMatch: [authGuard],
  },

  {
    path: 'orders',
    loadComponent: () =>
      import('@features/TrainA/pages/orders-page/orders-page.component').then((m) => m.OrdersPageComponent),
    canMatch: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('@features/admin/pages/admin-page/admin-page.component').then((m) => m.AdminPageComponent),
    canMatch: [adminGuard],
  },
];
