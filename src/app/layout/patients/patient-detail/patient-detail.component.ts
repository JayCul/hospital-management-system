import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-patient-detail',
  imports: [FloatLabel, FormsModule, Select, ButtonModule, ReactiveFormsModule, MultiSelectModule,
    FloatLabelModule, InputTextModule,],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.scss'
})
export class PatientDetailComponent implements OnInit {
  patientForm: FormGroup;
  patientId: string = '';
  formOptions = {
    gender: [
      { name: 'Male', value: 'male' },
      { name: 'Female', value: 'female' },
      { name: 'Other', value: 'other' },
    ],
    healthStatus: [
      { name: 'Stable', value: 'Stable' },
      { name: 'Critical', value: 'Critical' },
      { name: 'Under Observation', value: 'Under Observation' },
    ],
    alerts: [
      { name: 'Requires Surgery', value: 'Requires Surgery' },
      { name: 'Critical Vitals', value: 'Critical' },
      { name: 'Emergency Room', value: 'Emergency Room' },
    ],
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private patientService: PatientService
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
      alerts: [['']],
      // alerts: this.fb.control([]),
      complaints: [''],
      additionalRemarks: [''],
    });
  }

  // ngOnInit(): void {
  //   this.patientId = this.route.snapshot.paramMap.get('id') || '';
  //   this.loadPatientDetails();
  // }

  loadPatientDetails(): void {
    this.patientService.getPatientById(this.patientId).subscribe((data: any) => {
      console.log(data);
      this.patientForm.patchValue(data);
    });
  }

  saveChanges(): void {
    if (this.patientForm.valid) {
      this.patientService.updatePatient(this.patientId, this.patientForm.value).subscribe(() => {
        alert('Patient details updated successfully!');
      });
    } else {
      alert('Please fill out the required fields.');
    }
  }


  ngOnInit(): void {
    // Retrieve the `id` parameter from the route
    this.route.params.subscribe(params => {
      this.patientId = params['id'];
      console.log('Patient ID:', this.patientId);
      this.loadPatientDetails()
      // Fetch patient details using this.patientId
    });
  }
}