import { Component, inject, model } from '@angular/core';
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
import { DrugService } from '../../../services/drug.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-popup',
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatDialogClose,
    InputTextModule, FloatLabel, FormsModule, ReactiveFormsModule,
    FloatLabelModule, InputTextModule
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})

export class PopupComponent {
  readonly dialogRef = inject(MatDialogRef<PopupComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly drugService = inject(DrugService)
  readonly toast = inject(HotToastService)
  // readonly animal = model(this.data.animal);
  drugForm!: FormGroup;

  onNoClick(): void {
    this.dialogRef.close();
  }

  formInit(){
    this.drugForm =  new FormGroup({
      name: new FormControl(this.data.name, [Validators.required]),
      brandName: new FormControl(this.data.brandName, [Validators.required, Validators.minLength(6)]),
      dosageForms: new FormControl(
        this.data.dosageForms
        ? this.data.dosageForms.map((item: any) => item).join('\n')
        : '',
      [Validators.required]
      ),
    },)
    // { validators: this.passwordMatchValidator.bind(this) })
  }

  onSubmit() {
    const drugArray = {
      name: this.drugForm.get('name')?.value,
      brandName: this.drugForm.get('brandName')?.value,
      dosageForms: this.drugForm.get('dosageForms')?.value.split('\n')
    }
    console.log('Array of dosage forms:', drugArray);
    this.drugService.updateDrug(this.data._id, drugArray).subscribe({
      next: (res:any) => {
        console.log('Success')
        this.toast.success("Drug updated successfully")
      }, error: (err:any) => {
        console.log('Error', err);
      }
    })
  }

  ngOnInit() {
    this.formInit()
    console.log(this.data)
  }
}
