import { Routes } from '@angular/router';

import { privateRoute, publicRoute } from './auth/guards/auth.guard';
import { LoginComponent } from './auth/pages/login/login.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: LoginComponent,
        canActivate: [publicRoute]
    },
    {
        path: 'tournaments',
        loadChildren: () => import('./home/routes/home.routes').then(m => m.routes),
        canActivate: [privateRoute]
    },
    { path: '', redirectTo: '/tournaments', pathMatch: 'full' },
    { path: '**', redirectTo: '/tournaments', pathMatch: 'full' }
];
