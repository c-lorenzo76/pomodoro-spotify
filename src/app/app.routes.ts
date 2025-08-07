import { Routes } from '@angular/router';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';
import {LayoutComponent} from './pages/layout/layout.component';
import {authGuard} from './auth/auth.guard';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {CallbackComponent} from './pages/callback/callback.component';

export const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'callback', component: CallbackComponent},
  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [authGuard],
    children: [
      {path: 'dashboard', component: DashboardComponent},

    ],
  },

];
