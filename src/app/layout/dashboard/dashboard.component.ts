import { Component, computed, signal } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
// import Chart from 'chart.js';
import Chart from 'chart.js/auto';
import { HotToastService } from '@ngxpert/hot-toast';
import { ButtonModule } from 'primeng/button';
import { CreatePatientComponent } from '../patients/create-patient/create-patient.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private dashboardService: DashboardService, private toast: HotToastService,
    private dialog: MatDialog
  ){}
  
  healthStatus: any
  patientAssignment: any
  ageDistribution: any
  alertsByCategory: any
  lineGraphs: any
  healthStatusBreakdown = signal([0, 0, 0, 0])
  lineGraphsData = signal([0, 0, 0])
  alertsByCategoryData = signal([0, 0, 0])
  patientAssignments = signal([0, 0, 0, 0])
  ageDistributionData = signal([0, 0, 0, 0, 0])

  newPatientPopup(){
    const dialogRef = this.dialog.open(CreatePatientComponent, {
      // data: user,
      minWidth: '50vw',
      
  
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
      console.log(result);
      if (result === "success") {
        location.reload()
      }
    });

  }

  fetchDashboardInfo(){
    this.dashboardService.fetchDashboardData().subscribe({
      next: (res: any) => {
        console.log(res);
        this.fetchDashboardStats()
      },error: (err: any) => {
        console.error(err);
        this.toast.error(err.error.message );

    }});
  }
  
  fetchDashboardStats(){
    this.dashboardService.fetchGeneralStatistics().subscribe({
      next: (res: any) => {
        console.log(res);
        this.dashboardStats.set({
          discharged: res.KPIs.dischargedPatients,
          total: res.KPIs.totalPatients,
          admitted: res.KPIs.admittedPatients,
          critical: res.KPIs.criticalAlerts
        })

        this.healthStatusBreakdown.set ([
          res.healthStatusBreakdown[0].count, 
          res.healthStatusBreakdown[1].count,
           res.healthStatusBreakdown[2].count,
           res.healthStatusBreakdown[3].count
          ])

          this.healthStatusChart()
          
          this.patientAssignments.set ([
            res.patientAssignments.doctors, 
            res.patientAssignments.nurses,
            res.patientAssignments.pharmacists,
            res.patientAssignments.mlsSessions
          ])
          this.patientAssigned()
          
          this.ageDistributionData.set ([
            res.ageDistribution[0].count, 
            res.ageDistribution[1].count,
            res.ageDistribution[2].count,
            res.ageDistribution[3].count,
            res.ageDistribution[4].count,
          ])
          console.log(this.ageDistributionData())

          this.ageStatistics()
          this.alertsByCategoryData.set ([
            res.alertsByCategory[0].count, 
            res.alertsByCategory[1].count,
            res.alertsByCategory[2].count,
          ])
          // console.log(this.ageDistributionData())
          
          this.alertStatistics()
          
          this.lineGraphsData.set ([
            res.lineGraphs.dailyAdmissions, 
            res.lineGraphs.weeklyAdmissions,
            res.lineGraphs.monthlyAdmissions,
          ])
          
          this.lineGraph()

      },error: (err: any) => {
        console.error(err);
        this.toast.error(err.error.message );

    }});
  }

  ngOnInit() {
    this.fetchDashboardInfo()

  }

  dashboardStats = signal({
    discharged: 0, total: 0, admitted: 0, critical: 0
  })

  dashboardCards = computed(() =>([
    { title: "Total Patients", icon: "pi pi-users", stat: this.dashboardStats().total , button: undefined },
    { title: "Admitted Patients", icon: "pi pi-ban", stat: this.dashboardStats().admitted, button: false},
    { title: "Discharged Patients", icon: "pi pi-user", stat: this.dashboardStats().discharged, button: true},
    { title: "Critical Alerts", icon: "pi pi-ban", stat: this.dashboardStats().critical, button: false},
  ]))


  healthStatusChart(){
    this.healthStatus = new Chart( "healthStatus", {
      type: "doughnut",
      data: {
        labels: [
          'Stable',
          'Critical',
          'Under observation',
          'Unstable',
        ],
        datasets: [{
          label: 'Patients',
          data: this.healthStatusBreakdown(),
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 0, 0)',
            'rgb(255, 205, 86)',
            'rgb(8,8,8)'
          ],
          hoverOffset: 4
        }]
      }
    });

  }
  
  patientAssigned(){
    this.patientAssignment = new Chart( "patientAssignment", {
      type: "bar",
      data: {
        labels: ['Doctors', 'Nurses', 'Pharmacists','Med Lab Scientists',], 
           datasets: [
          {
            label: "Patients",
            data: this.patientAssignments(),
            backgroundColor: 'orange',
            barPercentage: 0.5,
            minBarLength: 2,
          },
          // {
          //   label: "Profit",
          //   data: ['542', '542', '536', '327', '17',
          //                            '0.00', '538', '541'],
          //   backgroundColor: 'limegreen'
          // }  
        ],
        
      },
      options: {
        aspectRatio:2.2,
        // scales: {
        //   y: {
        //     ticks: {
        //       callback: function(value, index, ticks) {
        //         return '$' + value;
        //       }
        //     }
        //   }
        // }
      }
    });

  }

  ageStatistics(){
    // const labels = Utils.
    const label = ['0-17', '18-34', '35-59', '60 -100', '101-130']
    this.ageDistribution = new Chart("ageDistribution", {
      type: "line",
      data: {
        labels: label,
        datasets: [{
          label: 'Age',
          data: this.ageDistributionData(),
          fill: true,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.3
        }]
      }, options: {
        
        aspectRatio:1.1,
      }
    })
  }
  
  lineGraph(){
    // const labels = Utils.
    const label = ['Daily', 'Weekly', 'Monthly']
    this.lineGraphs = new Chart("lineGraphs", {
      type: "bar",
      data: {
        labels: label,
        datasets: [{
          label: 'Admissions',
          data: this.lineGraphsData(),
          // fill: true,
          borderColor: 'rgb(75, 192, 192)',
          // tension: 0.3
        }]
      }, options: {
        
        aspectRatio:1.1,
      }
    })
  }
  
  alertStatistics(){
    // const labels = Utils.
    const label = ['Emergency Room', 'Critical Vitals', 'Requires Surgery']
    this.alertsByCategory = new Chart("alertsByCategory", {
      type: "polarArea",
      data:  {
        labels: label,
        datasets: [{
          label: 'My First Dataset',
          data: this.alertsByCategoryData(),
          backgroundColor: [
            'yellow',
            'red',
            'grey',
          ]
        }]
      }
    })
  }
  
  
}
