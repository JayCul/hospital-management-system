import { Component, effect, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDrawer, MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
// import { BodyComponent } from "../body/body.component";
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-layout',
  imports: [MatSidenavModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatToolbarModule, MatIcon, CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  username!: string
  role!: string
  title!: string
  img = signal("")

  constructor(private router: Router, private authService: AuthService, 
    private toast: HotToastService, private userService: UserService
  ){
    
    this.username = this.authService.user().username
    this.role = this.authService.user().role
    this.title = this.userService.getRoleName(this.authService.user())



    effect(() => {
      const hour = new Date().getHours();

      if (0 <= hour && hour < 12) {
        this.img.set('/assets/images/morning.png');
      } else if (12 <= hour && hour < 18) {
        this.img.set('/assets/images/daytime.png');
      } else if (18 <= hour && hour <= 24) {
        this.img.set('/assets/images/night.png');
      }
    });

    switch (this.role) {
      case 'admin':
        this.navItems = [
          {name: 'Dashboard', class: 'pi-inbox', route: '/dashboard'},
          {name: 'Patients', class: 'pi-users', route: '/patients'},
          {name: 'Prescriptions', class: 'pi-eraser', route: '/prescriptions'},
          {name: 'Users', class: 'pi-user', route: '/users'},
          {name: 'Drugs DB', class: 'pi-database', route: '/drug-database'},
        ]
        break;
        case 'doctor':
          this.navItems = [
            {name: 'Dashboard', class: 'pi-inbox', route: '/dashboard'},
            {name: 'Patients', class: 'pi-users', route: '/patients'},
            {name: 'Prescriptions', class: 'pi-eraser', route: '/prescriptions'},
            {name: 'Drugs DB', class: 'pi-database', route: '/drug-database'},
        ]
        break;
        case 'nurse':
          this.navItems = [
            {name: 'Dashboard', class: 'pi-inbox', route: '/dashboard'},
            {name: 'Patients', class: 'pi-users', route: '/patients'},
            {name: 'Prescriptions', class: 'pi-eraser', route: '/prescriptions'},
            {name: 'Drugs DB', class: 'pi-database', route: '/drug-database'},
        ]
        break;
        case 'pharmacist':
          this.navItems = [
            {name: 'Dashboard', class: 'pi-inbox', route: '/dashboard'},
            {name: 'Patients', class: 'pi-users', route: '/patients'},
            {name: 'Prescriptions', class: 'pi-eraser', route: '/prescriptions'},
            {name: 'Drugs DB', class: 'pi-database', route: '/drug-database'},
        ]
        break;
        case 'medLabScientist':
          this.navItems = [
            {name: 'Dashboard', class: 'pi-inbox', route: '/dashboard'},
            {name: 'Patients', class: 'pi-users', route: '/patients'},
        ]
        break;
        case 'user':
          this.navItems = []
        break;
        case 'guest':
          this.navItems = []
          break;
        default:
          this.navItems = []
          break;
          
    } 


  }
  

  
  isDrawerOpen(drawer: MatDrawer): boolean {
    return drawer.opened;
  }

  navItems: any = [
    // {name: 'Dashboard', class: 'pi-inbox', route: '/dashboard'},
    // {name: 'Patients', class: 'pi-users', route: '/patients'},
    // {name: 'Prescriptions', class: 'pi-eraser', route: '/prescriptions'},
    // {name: 'Users', class: 'pi-user', route: '/users'},
    // {name: 'Drugs DB', class: 'pi-database', route: '/drug-database'},
  ]

  routeToPage(route: string){
    this.router.navigate([route])
  }

  logout(){
    this.authService.logout().subscribe({
      next: (response: any) => {
        this.authService.handleLogoutResponse(response)
        this.toast.success(response.message)
        
      }, error: (err: any)=>{
        this.toast.success(err.error.message)


      }
    });
  }


  getActiveClass(route:string){
    return this.router.url.includes(route) ? "active" : ""
  }

  getGreeting(): string {
    const hour = new Date().getHours()

    if (0 <= hour && hour < 12){
      return "Good Morning"
    } else if (12 <= hour && hour < 18){
      return "Good Afternoon"
    } else if (18 <= hour && hour <= 24){
      return "Good Evening"
    }

    return "Greetings"
  }

  ngOnInit(){
    const user = localStorage.getItem('user');
    if (user) {
      this.authService.user.set(JSON.parse(user));
      this.authService.isAuthenticated.set(true);
      console.log(this.authService.user())
    }
    console.log(new Date().getHours())
  }
}


