import { Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-unauthorized',
  imports: [MatButtonModule],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent {
    constructor(private authService: AuthService, private router: Router,
      private toast: HotToastService
    ) {}
  

  user = computed(() =>{
    return this.authService.user()?.role === 'user'})

  navigateBackTwice(){
    window.history.go(-2)
    
  }
  Logout(){
    this.authService.logout().subscribe({
      next: (response: any) => {
        this.authService.handleLogoutResponse(response)
        this.toast.success(response.message)
        
      }, error: (err: any)=>{
        console.log(err)
        this.toast.success(err.error.message)

      }
    })
  }
}
