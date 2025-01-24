import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { HotToastService } from '@ngxpert/hot-toast';
import { environment } from '../../../../environments/environment';
import { AssignStaffComponent } from '../assign-staff/assign-staff.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { PrescribeDrugsComponent } from '../prescribe-drugs/prescribe-drugs.component';
import { SplitButton } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-patient-detail',
  imports: [FloatLabel, FormsModule, Select, ButtonModule, ReactiveFormsModule, MultiSelectModule,
    FloatLabelModule, InputTextModule, CommonModule, SplitButton],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.scss'
})
export class PatientDetailComponent implements OnInit {
  patientForm: FormGroup;
  patientId = signal('')
  patient = signal<any>({})
  items:any[]= [
    {
      label: 'Admit Patient',
      command: () => {
          this.admitPatient();
      }
    },
    {
      label: 'Assign Staff to Patient',
      command: () => {
          this.assignStaff();
      }
    },
    {
        label: 'Prescribe Drug',
        command: () => {
            this.prescribe();
        }
    },
    {
        label: 'Discharge Patient',
        command: () => {
            this.dischargePatient();
        }
    }
  ];
  // assignedDoctor = signal('')
  // assignedNurse = signal('')
  // assignedMLSSession = signal('')
  // assignedPharmacist = signal('')
  formOptions = {
    gender: [
      { name: 'Male', value: 'male' },
      { name: 'Female', value: 'female' },
      { name: 'Other', value: 'other' },
    ],
    healthStatus: [
      { name: 'Stable', value: 'Stable' },
      { name: 'Critical', value: 'Critical' },
      { name: 'Recovered', value: 'Recovered' },
      { name: 'Under Observation', value: 'Under Observation' },
    ],
    alerts: [
      { name: 'Requires Surgery', value: 'Requires Surgery' },
      { name: 'Critical Vitals', value: 'Critical Vitals' },
      { name: 'Emergency Room', value: 'Emergency Room' },
    ],
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private toast: HotToastService,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
  ) {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      address: [''],
      contact: [''],
      height: ['', [Validators.required, Validators.min(0)]],
      weight: ['', [Validators.required, Validators.min(0)]],
      bloodPressure: [''],
      bloodOxygen: ['', Validators.required],
      gender: ['', Validators.required],
      healthStatus: ['', Validators.required],
      alerts: [[]],
      // alerts: this.fb.control([]),
      complaints: [''],
      additionalRemarks: [''],
      assignedDoctor : [{value:{}, disabled: true}],
      assignedNurse : [{value:{}, disabled: true}],
      assignedMLSSession : [{value:{}, disabled: true}],
      assignedPharmacist : [{value:{}, disabled: true}]
    });
  }

 assignStaff(): void {
     const dialogRef = this.dialog.open(AssignStaffComponent, {
       data: this.patient(),
       width: '500px',
       
 
     });
 
     dialogRef.afterClosed().subscribe((result : any) => {
       console.log('The dialog was closed');
       console.log(result);
       if (result === "success") {
         location.reload()
       }
     });
   }
 
   prescribe(): void {
     const dialogRef = this.dialog.open(PrescribeDrugsComponent, {
       data: this.patient(),
       minWidth: '800px',
       
 
     });
 
     dialogRef.afterClosed().subscribe((result : any) => {
       console.log('The dialog was closed');
       console.log(result);
       if (result === "success") {
         location.reload()
       }
     });
   }

  loadPatientDetails(): void {
    this.patientService.getPatientById(this.patientId()).subscribe((data: any) => {
      console.log(data);
      const patchedData = {
        ...data,
        assignedDoctor: (data.assignedDoctor) ? data.assignedDoctor.name: '',
        assignedNurse: (data.assignedNurse) ? data.assignedNurse.name: '',
        assignedMLSSession: (data.assignedMLSSession) ? data.assignedMLSSession.name: '',
        assignedPharmacist: (data.assignedPharmacist) ? data.assignedPharmacist.name: ''
        // assignedNurse: { value: data.assignedNurse.name !== null ? data.assignedNurse.name : '', disabled: true },
        // assignedMLSSession: { value: data.assignedMLSSession.name !== null? data.assignedMLSSession.name : '', disabled: true },
        // assignedPharmacist: { value: data.assignedPharmacist.name !== null ?data.assignedPharmacist.name : '', disabled: true }
      };
      
      this.patientForm.patchValue(patchedData);
      this.patient.set(data);
      // console.log(data.assignedDoctor)
      

    });
  }

  dischargePatient() {
    this.patientService.discharge(this.patientId()).subscribe({
      next: (data: any) => {
        console.log(data)
        this.toast.success(data.message);
      }, error: (err: any) => {
        console.log(err)
        this.toast.success(err.error.message)
        
      }
    })
  }

    routeToPatientList(){
    this.router.navigate(['/patients'])
  }
 
  saveChanges(): void {
    console.log(this.patientForm.value)
    if (this.patientForm.valid) {
      this.patientService.updatePatient(this.patientId(), this.patientForm.value).subscribe({
        next: (res: any) => {
          // console.log(res);
          this.toast.success(res.message)
        }, error: (err: any) => {
          this.toast.success(err.error.message)
          console.log(err);
        }
      });
    } else {
      alert('Please fill out the required fields.');
    }
  }

  // if (this.patient().assignedDoctor !== null){
   
    
  // }
  admitPatient(){
    this.patientService.admitPatient(this.patientId(), this.patientForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.toast.success(res.message);

      }, error: (err: any) => {
        console.log(err);
        this.toast.success(err.error.message)

      }
    })
  }
  



  ngOnInit(): void {
    // Retrieve the `id` parameter from the route
    this.route.params.subscribe(params => {
      this.patientId.set(params['id']);
      console.log('Patient ID:', this.patientId());
      this.loadPatientDetails()
      // Fetch patient details using this.patientId
    });
  }
}