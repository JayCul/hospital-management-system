import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../../src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router){}
  // Signal to track authentication state
  isAuthenticated = signal(this.loadFromLocalStorage('isAuthenticated', false));
  user = signal<any>(this.loadFromLocalStorage('user', null)); // Adjust type as needed

  login(credentials: { username: string; password: string }) {
    return this.http.post(`${environment.authUrl}/login`, credentials)}

  handleLoginResponse(response: any) {
    localStorage.setItem('token', response.access_token);
    this.saveToLocalStorage('isAuthenticated', true);
    this.saveToLocalStorage('user', response.user);

    const returnUrl = this.router.routerState.snapshot.root.queryParams['returnUrl'];
    // Update signals
    this.isAuthenticated.set(true);
    this.user.set(response.user);
    switch(response?.user?.role){
    case 'admin':
    case 'doctor':
    case 'nurse':
    case 'medLabScientist':
    case 'pharmacist':
      this.router.navigate([returnUrl || '/dashboard']); // Navigate to returnUrl or default
      break;

    case 'user':
      this.router.navigate(['/unauthorized']); 
      break;
    }

    
  }
  
  handleLogoutResponse(response: any) {
    console.log(response)
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');

    // Reset signals
    this.isAuthenticated.set(false);
    this.user.set(null);
    this.router.navigate(['/login']); // Navigate on successful login
  }
  
  register(userData: { username: string; email: string; password: string }) {
    return this.http.post(`${environment.authUrl}/create`, userData)
  }
  
  logout() {
    // this.router.navigate(['/login']); // Redirect to login page
    return this.http.get(`${environment.authUrl}/logout`)
  }

  checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticated.set(true);
      // Optionally fetch user details using token
    } else {
      this.isAuthenticated.set(false);
    }
  }

  private saveToLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private loadFromLocalStorage<T>(key: string, defaultValue: T): T {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  }

  
}
