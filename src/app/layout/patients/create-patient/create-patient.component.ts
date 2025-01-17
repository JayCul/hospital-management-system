import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ButtonModule } from 'primeng/button';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { PatientService } from '../../../services/patient.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-create-patient',
  imports: [MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatDialogClose, ButtonModule,
    InputTextModule, FloatLabel, ReactiveFormsModule, Select,
    FloatLabelModule, InputTextModule, MatSelectModule, MatSlideToggleModule],
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.scss'
})
export class CreatePatientComponent {
  patientDetail! : FormGroup
  constructor(private patientService: PatientService, private toast: HotToastService){
    this.createPatientForm()
  }

  formOptions = {
    gender: [
      {name: 'Male', value: 'male'},
      {name: 'Female', value: 'female'},
      {name: 'Others', value: 'others'},
    ],
    healthStatus: [
      {name: 'Healthy', value: 'stable'},
      {name: 'Unhealthy', value: 'unstable'}
    ]

  }

  createPatientForm(){
      this.patientDetail =  new FormGroup({
        name: new FormControl({value: '', disabled: false}, [Validators.required]),
        age: new FormControl({value: '', disabled: false}, [Validators.required]),
        height: new FormControl({value: '', disabled: false}, [Validators.required]),
        weight: new FormControl({value: '', disabled: false}, [Validators.required]),
        bloodPressure: new FormControl({value: '', disabled: false}, [Validators.required]),
        bloodOxygen: new FormControl({value: '', disabled: false}, [Validators.required]),
        gender: new FormControl({value: '', disabled: false}, [Validators.required]),
        address: new FormControl({value: '', disabled: false}, [Validators.required]),
        contact: new FormControl({value: '', disabled: false}, [Validators.required]),
        healthStatus: new FormControl({value: '', disabled: false}, [Validators.required]),
        complaints: new FormControl({value: '', disabled: false}, [Validators.required]),
      })}

      submit(){
        console.log(this.patientDetail.value)
        this.patientService.addPatient(this.patientDetail.value).subscribe({
          next: (res:any) => {
            console.log(res)
            this.toast.success(res.message)
          }, error: (err:any) => {
            console.log(err)
          }
        })

      }

}
