import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditRisqueDialogComponent } from '../../../gestion-avenant/edit-risque-dialog/edit-risque-dialog.component';


@Component({
  selector: 'app-edit-reserve-dialog',
  templateUrl: './edit-reserve-dialog.component.html',
  styleUrls: ['./edit-reserve-dialog.component.scss']
})
export class EditReserveDialogComponent {

  constructor (
    public dialogRef: MatDialogRef<EditRisqueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  onClose(): void {
    this.dialogRef.close();
  }
  onClick(): void {
    this.dialogRef.close(this.data);
    console.log(this.data); // Retourne les données modifiées
  }
}
