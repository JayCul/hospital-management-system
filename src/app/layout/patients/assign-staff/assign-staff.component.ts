import { Component, inject, signal, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatTabGroup, MatTabsModule} from '@angular/material/tabs';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';
import { UserService } from '../../../services/user.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { ButtonModule } from 'primeng/button';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-assign-staff',
  imports: [MatTabsModule, FloatLabel, FloatLabelModule, ReactiveFormsModule,
    FormsModule, Select, ButtonModule
   ],
  templateUrl: './assign-staff.component.html',
  styleUrl: './assign-staff.component.scss'
})
export class AssignStaffComponent {

  constructor(private userService: UserService, private toast: HotToastService,
    private patientService: PatientService
  ){}
  
  @ViewChild('tabGroup', { static: true }) tabGroup!: MatTabGroup;
  readonly dialogRef = inject(MatDialogRef<AssignStaffComponent>);
    readonly data = inject<any>(MAT_DIALOG_DATA);

    isTab2Disabled = signal(true)
    assignStaff!: FormGroup;
    offices = signal([
      { name: 'Doctor', value: "doctor"},
      { name: 'Nurse', value: "nurse"},
      // { name: 'Pharmacy', value: "pharmacist"},
      { name: 'Medical Laboratory', value: "medLabScientist"},

    ])   
    staff = signal([]) 

    selectedOffice = ""

    goToTab(index: number): void {
      if (this.tabGroup) {
        this.userService.loadUserByRole(this.selectedOffice).subscribe({
          next: (res: any) => {
            if (res.length > 0) {
              console.log(res)
              this.staff.set(res)
              this.isTab2Disabled.set(false)
              this.tabGroup.selectedIndex = index;
              this.assignStaff.reset()
            } else {
              this.isTab2Disabled.set(true)
              this.toast.info(`No active ${this.selectedOffice}`)

            }
          }, error: (err: any) => {
            console.log(err)
            this.toast.success(err.error.message)

          }
        })
      } else {
        console.error('TabGroup is not initialized.');
      }
    }

    placeholderText(): string {
      return `Select a ${this.selectedOffice}`
    }

    assignStaffInit(){
        this.assignStaff =  new FormGroup({
          _id: new FormControl({value: "", disabled: false}, [Validators.required]),
          additionalRemarks: new FormControl({value: "", disabled: false}, [Validators.required]),
        },)
    }

    onSubmit(){
      console.log(this.assignStaff.value);
      switch(this.selectedOffice){
        case "doctor":
          this.patientService.assignDoctor(this.data._id, this.assignStaff.value).subscribe({
            next: (res: any) => {
              console.log(res)
              this.dialogRef.close("success")
              this.toast.success(res.message)
            }, error: (err: any) => {
              console.log(err)
            this.toast.success(err.error.message)

            }
          })
          break;
        case "nurse":
          this.patientService.assignNurse(this.data._id, this.assignStaff.value).subscribe({
            next: (res: any) => {
              console.log(res)
              this.dialogRef.close("success")
              this.toast.success(res.message)
            }, error: (err: any) => {
              console.log(err)
            this.toast.success(err.error.message)

            }
          })
          break;
        case "medLabScientist":
          this.patientService.assignScientist(this.data._id, this.assignStaff.value).subscribe({
            next: (res: any) => {
              console.log(res)
              this.dialogRef.close("success")
              this.toast.success(res.message)
            }, error: (err: any) => {
              console.log(err)
            this.toast.success(err.error.message)

            }
          })
          break;
        // case "pharmacist":
        //   this.patientService.assignDoctor(this.data._id, this.assignStaff.value)
        //   break;

        
      }
    }

    close(){
      this.dialogRef.close()
    }


    ngOnInit() {
      this.assignStaffInit()
      console.log(this.data)
    }
}
