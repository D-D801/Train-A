import { Routes } from '@angular/router';
import { stationsResolver } from '@features/admin/resolvers/stations-resolver';
import { adminGuard } from '@features/auth/guards/admin.guard';
import { authGuard } from '@features/auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('@features/search/pages/home-page/home-page.component').then((m) => m.HomePageComponent),
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
    path: 'admin',
    loadComponent: () =>
      import('@features/admin/pages/admin-page/admin-page.component').then((m) => m.AdminPageComponent),
    canMatch: [adminGuard],
  },
  {
    path: 'admin/carriage',
    loadComponent: () =>
      import('@features/admin/pages/carriage-page/carriage-page.component').then((m) => m.CarriagePageComponent),
    canMatch: [adminGuard],
  },
  {
    path: 'admin/stations',
    loadComponent: () =>
      import('@features/admin/pages/stations-page/stations-page.component').then((m) => m.StationsPageComponent),
    canMatch: [adminGuard],
    resolve: { stationsData: stationsResolver },
  },
];
