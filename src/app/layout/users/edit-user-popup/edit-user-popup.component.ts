import { Component, inject, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { Select } from 'primeng/select';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-edit-user-popup',
  imports: [MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatDialogClose, Select,
    InputTextModule, FloatLabel, FormsModule, ReactiveFormsModule,
    FloatLabelModule, InputTextModule, MatSlideToggleModule],
  templateUrl: './edit-user-popup.component.html',
  styleUrl: './edit-user-popup.component.scss'
})
export class EditUserPopupComponent {
  readonly dialogRef = inject(MatDialogRef<EditUserPopupComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly userService = inject(UserService)
  readonly toast = inject(HotToastService)

  constructor(){
    this.formInit()
  }
  // readonly animal = model(this.data.animal);
  userForm!: FormGroup;
  // userRoles = signal(['admin', 'doctor', 'nurse', 'pharmacist', 'medLabScientist', 'user'] )
  userRoles = signal([
    
    {name: 'Admin', value: 'admin'}, 
    {name: 'Doctor', value: 'doctor'}, 
    {name: 'Nurse', value: 'nurse'}, 
    {name: 'Pharmacist', value: 'pharmacist'}, 
    {name: 'Medical Laboratory Scientist', value: 'medLabScientist'}, 
    {name: 'User', value: 'user'}] 
  )

    onNoClick(): void {
    this.dialogRef.close();
  }

  formInit(){
    this.userForm =  new FormGroup({
      username: new FormControl({value: this.data.username, disabled: true}, [Validators.required]),
      email: new FormControl({value: this.data.email, disabled: true}, [Validators.required, Validators.minLength(6)]),
      name: new FormControl({value: this.data.name, disabled: false}, [Validators.required]),
      role: new FormControl({value: this.data.role || 'user', disabled: false}, [Validators.required]),
      isActive: new FormControl({value: this.data.isActive, disabled: false}, [Validators.required]),
    },)
    // console.log('Role value:', this.data.role);
    // { validators: this.passwordMatchValidator.bind(this) })
  }

  onSubmit() {
    const userArray = {
      username: this.userForm.get('username')?.value,
      role: this.userForm.get('role')?.value,
      name: this.userForm.get('name')?.value,
      isActive: this.userForm.get('isActive')?.value
    }
    console.log('Array of dosage forms:', userArray);
    this.userService.updateUser(this.data._id, userArray).subscribe({
      next: (res:any) => {

        console.log(res)
        this.toast.success(res.message);
        this.dialogRef.close("success");
      }, error: (err:any) => {
        console.log('Error', err);
        this.toast.success(err.error.message);
      }
    })
  }

  ngOnInit() {
    
    console.log(this.data)
    // console.log(this.userForm.get('isActive')?.value)
  }
}
