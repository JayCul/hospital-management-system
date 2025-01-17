import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [MatButtonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  constructor(private authService: AuthService, private router: Router) {}

  navigateBack(){
    this.router.navigate(['/login'])
  }

  Logout(){
    this.authService.logout()
  }
}
