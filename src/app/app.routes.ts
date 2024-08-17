import { Routes } from '@angular/router';
import { adminGuard } from '@features/auth/guards/admin.guard';
import { authGuard } from '@features/auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('@features/search/pages/search-page/search-page.component').then((m) => m.SearchPageComponent),
  },
  {
    path: 'registration',
    loadComponent: () =>
      import('@features/auth/pages/registration-page/registration-page.component').then(
        (m) => m.RegistrationPageComponent
      ),
    canMatch: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@features/auth/pages/login-page/login-page.component').then((m) => m.LoginPageComponent),
    canMatch: [authGuard],
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
