import { inject } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleRoutes } from './role-route';

function isRouteAllowed(role: string, currentPath: string): boolean {
  const allowedRoutes = RoleRoutes[role] || [];
  
  return allowedRoutes.some((route: any) => {
    const regex = new RegExp(
      '^' + route.replace(/:\w+/g, '\\w+') + '$'
    );
    return regex.test(currentPath);
  });
}

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService); // Inject the AuthService
  const router = inject(Router); // Inject the Router

  const userRole = authService.user()?.role; // Get the user's role (e.g., from token)
  const allowedRoutes = RoleRoutes[userRole];


  if (!allowedRoutes) {
    router.navigate(['/unauthorized']); // Redirect to an unauthorized page
    return false;
  }
  
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
  const requestedRoute = state.url;
  
  if (isRouteAllowed(userRole, requestedRoute)) {
    return true;
  }
  
  // if (allowedRoutes.includes(requestedRoute)) {
  //   console.log('requestedRoute' , requestedRoute)
  //   console.log('allowedROutes' , allowedRoutes)
  //   console.log(state)
  //   return true; // Allow access to the route
  // }


  // Redirect to the first allowed route for the role
  router.navigate([allowedRoutes[0]]);
  return false;
};
