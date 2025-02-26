import { Route } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Route[] = [
  { path: 'app', component: AppComponent },
  { path: '', redirectTo: '/app', pathMatch: 'full' },
];