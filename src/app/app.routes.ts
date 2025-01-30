import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { UnauthorizedComponent } from './auth/unauthorized/unauthorized.component';
import { NotFoundComponent } from './auth/not-found/not-found.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: AuthComponent},
    {path: 'unauthorized', component: UnauthorizedComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule) },
    {path: '**', redirectTo: 'not-found'},
];
