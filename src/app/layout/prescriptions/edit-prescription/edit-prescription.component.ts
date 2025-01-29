import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FormatDatePipe } from '../../../pipes/format-date.pipe';
import { PrescriptionService } from '../../../services/prescription.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-edit-prescription',
  imports: [FormsModule, ToggleSwitch, ButtonModule, FormatDatePipe],
  templateUrl: './edit-prescription.component.html',
  styleUrl: './edit-prescription.component.scss'
})
export class EditPrescriptionComponent {


  readonly dialogRef = inject(MatDialogRef<EditPrescriptionComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  constructor(private prescriptionService: PrescriptionService, private toast: HotToastService){
    console.log(this.data);
  }

  submit(){
    console.log(this.data);
    this.prescriptionService.dispense(this.data._id, this.data.isDispensed).subscribe({
      next: (res: any) => {
        console.log(res);
        this.toast.success(res?.message);
        // this.dialogRef.close("success");
      }, error: (err: any) => {
        console.log(err);
        this.toast.error(err?.error?.message);
      }
    })
  }
}
