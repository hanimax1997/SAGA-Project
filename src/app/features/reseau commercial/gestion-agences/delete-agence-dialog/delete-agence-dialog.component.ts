import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { AgencesService } from '../../../../core/services/agences.service'
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-delete-agence-dialog',
  templateUrl: './delete-agence-dialog.component.html',
  styleUrls: ['./delete-agence-dialog.component.scss']
})
export class DeleteAgenceDialogComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private agencesService: AgencesService, public dialogRef: MatDialogRef<DeleteAgenceDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  description = this.data.desc //AD. variable inutilisable
  newAgences: any = []
  formDesactivateAgence: FormGroup | any;
  minDate = new Date()
  ngOnInit(): void {
    
    this.getAllAgence()
    this.formDesactivateAgence = this.formBuilder.group({
      dateFin: ['', [Validators.required]],
      newAgence: [null, []],
    });
  }
  // get all agence
  getAllAgence() {
    this.agencesService.getAllAgence().subscribe({
      next: (data: any) => {
        this.newAgences = data
        this.newAgences=this.newAgences.filter((agence:any) => !(agence.idAgence == this.data.idAgence));
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  submitDesactAgence() {

    if (this.formDesactivateAgence.valid) {
      let desacForm={
        "newAgence": this.formDesactivateAgence.get("newAgence").value,
        "dateFermeture": moment(this.formDesactivateAgence.get("dateFin").value).format('YYYY-MM-DD'),
      }
      this.dialogRef.close({data:desacForm})
    }
  }
}
