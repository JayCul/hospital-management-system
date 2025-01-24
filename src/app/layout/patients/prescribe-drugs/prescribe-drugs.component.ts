import { Component, inject, signal, Signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngxpert/hot-toast';
import { ButtonModule } from 'primeng/button';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';
import { PatientService } from '../../../services/patient.service';
import { DrugService } from '../../../services/drug.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
interface Prescription {
  selectedDrug: any;
  selectedDosage: any;
  selectedFrequency: any;
  selectedDuration: any;
}


@Component({
  selector: 'app-prescribe-drugs',
  imports: [FloatLabel, FloatLabelModule, ReactiveFormsModule,
      FormsModule, Select, ButtonModule],
  templateUrl: './prescribe-drugs.component.html',
  styleUrl: './prescribe-drugs.component.scss'
})


export class PrescribeDrugsComponent {
  readonly dialogRef = inject(MatDialogRef<PrescribeDrugsComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  selectedPatient = (!!this.data) ? this.data._id : "" 
  selectedStaff = (!!this.data) ? this.data.assignedPharmacist : "" 
  
  prescription: Prescription = {
    selectedDrug: null,
    selectedDosage: null,
    selectedFrequency: null,
    selectedDuration: null,
  };
  dosageForms: any
  frequencies = [
    {name: "Once a Day"}, {name: "Twice a Day"}, {name: "Thrice a Day"}
  ]
  duration = [
    {name: "1 day"}, {name: "2 days"}, {name: "3 days"}, {name: "4 days"}, {name: "5 days"}, {name: "6 days"}, {name: "7 days / 1 week"}
  ]
  patients = signal<any[]>([]); // Patient list
  assignMedication! : FormGroup 
  
  medication = signal<any>([]) //Patient to give drugs to
  drugs = signal<any[]>([]); // Patient list
  staff = signal([])
  finalPrescription : any = []
  // patient = signal<any>({}) //Patient to give drugs to
  // disabled: boolean = !((this.prescription.selectedDosage !== null) || (this.prescription.selectedDrug !== null) || (this.prescription.selectedDuration !== null) || (this.prescription.selectedFrequency !== null))
  
  prescriptionForm!: FormGroup
  constructor(private toast: HotToastService, private patientService: PatientService, 
    private drugService: DrugService, private fb: FormBuilder, private authService: AuthService,
  private userService: UserService){
    if(!!this.data){
      this.patients.set([{
        name: this.data.name, _id: this.data._id
      }])
      // this.patient.set(this.data)
      this.loadDrugs()
    } else {
      this.loadPatientNames()

    }

    this.prescriptionForm = this.fb.group({
      selectedDrug: [null, Validators.required],
      selectedDosage: [null, Validators.required],
      selectedFrequency: [null, Validators.required],
      selectedDuration: [null, Validators.required],
    });

    this.userService.loadUserByRole("pharmacist").subscribe({
      next: (res: any) => {
        console.log('res', res)
        if (res.length > 0) {
          this.staff.set(res)}
        }, error: (err: any) => {
          console.log(err)
          this.toast.error("Error occured while loading pharmacists")
        }
      })
  }


  loadPatientNames(){
    this.patientService.listAllPatients().subscribe({
      next: (data: any) => {
        console.log(data)
        this.patients.set(data)
      }
    })
  }

  loadDrugs(){
    this.drugService.getDrugs().subscribe({
      next: (data: any) => {
        console.log(data)
        this.drugs.set(data.data)
      }, error: (err: any) => {
        console.log(err)
        this.toast.error("Error occured while loading drugs")

      }
    })
  }

  log(){
    console.log(this.selectedPatient)
    this.loadDrugs();
  }
  
  logPharm(){
    console.log(this.selectedStaff)
  }
  logDosage(){
    console.log(this.prescription.selectedDosage)
  }

  add(){
    this.finalPrescription.push(this.prescriptionForm.value);
    this.prescriptionForm.reset();
    console.log(this.finalPrescription)
  }

  edit(item: any){    // };
    this.prescriptionForm.patchValue(item)
    this.delete(item)
    
  }

  delete(item: any) {
    this.finalPrescription = this.finalPrescription.filter(
      (pres: any) => item.selectedDrug._id !== pres.selectedDrug._id
    );
  }

  submit(){
    const pharmacistId = this.selectedStaff;
    const prescription = {
      patient: this.selectedPatient,
      doctor: this.authService.user()._id,
      isDispensed: false,
      medications: this.finalPrescription.map((item:any) => ({
        drug: item.selectedDrug.name,
        dosage: item.selectedDosage,
        frequency: item.selectedFrequency,
        duration: item.selectedDuration
      }))
    }

    this.patientService.prescribe(pharmacistId, prescription).subscribe({
      next: (res: any) => {
        console.log(res)
      }, error: (err: any) => {
        console.log(err);
        this.toast.error(err.error.message)
      }
    })


  }

  ngOnInit(): void {
    this.prescriptionForm.get('selectedDrug')?.valueChanges.subscribe((value) => {
      console.log('Selected Drug Value:', value);
      if (value && value.dosageForms && Array.isArray(value.dosageForms)) {
        this.dosageForms = value.dosageForms.map((item: string) => ({ name: item.trim() }));
      } else {
        this.dosageForms = [];
      }
    });

  }
}
