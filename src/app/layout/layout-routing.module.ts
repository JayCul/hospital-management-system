import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout.component';
import { PatientsComponent } from './patients/patients.component';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';
import { UsersComponent } from './users/users.component';
import { DrugDBComponent } from './drug-db/drug-db.component';
import { roleGuard } from '../guard/role.guard';
import { PatientDetailComponent } from './patients/patient-detail/patient-detail.component';
import { CreatePatientComponent } from './patients/create-patient/create-patient.component';


const routes: Routes = [
    {
      path: '',
      component: LayoutComponent, // Parent component with <router-outlet>
      canActivate: [roleGuard],
      children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'patients', component: PatientsComponent },
        // { path: 'patients/new', component: CreatePatientComponent },
        { path: 'patients/:id', component: PatientDetailComponent },
        { path: 'prescriptions', component: PrescriptionsComponent },
        { path: 'users', component: UsersComponent },
        { path: 'drug-database', component: DrugDBComponent },
      ],
    },
    // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Global redirect
    // { path: '**', redirectTo: '/dashboard' }, // Catch-all redirect
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
