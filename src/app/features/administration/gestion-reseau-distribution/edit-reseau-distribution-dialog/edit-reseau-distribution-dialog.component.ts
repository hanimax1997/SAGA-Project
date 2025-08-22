import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReseauDistribution } from 'src/app/core/models/reseau-distribution';
import { ReseauDistributionService } from 'src/app/core/services/reseau-distribution.service'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-reseau-distribution-dialog',
  templateUrl: './edit-reseau-distribution-dialog.component.html',
  styleUrls: ['./edit-reseau-distribution-dialog.component.scss']
})
export class EditReseauDistributionDialogComponent implements OnInit {

  formEditReseauDistribution: FormGroup|any;
  reseauDistribution: ReseauDistribution|any;
  reseauDistributionEditSuccess=false;
  minDate = null
  idReseau:number;
  reseauDistributionEditError=false;
  messageError: string;

  constructor(public dialogRef: MatDialogRef<EditReseauDistributionDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private formBuilderAuth: FormBuilder, private reseauDistributionService: ReseauDistributionService, private router: Router) { }

  ngOnInit(): void {

    this.getReseauDistributionById(this.data.idReseau)

  }

  getReseauDistributionById(idReseau:any){
    this.reseauDistributionService.getReseauDistributionById(idReseau).subscribe((result:any) => {
      
      this.iniEdittReseauDistribution(result);
    })
  }
  iniEdittReseauDistribution(infoReseauDistribution:any){
    this.debutDateChange(infoReseauDistribution.dateDebut);
    this.formEditReseauDistribution = this.formBuilderAuth.group({
      idReseau: [infoReseauDistribution.idReseau],
      description: [infoReseauDistribution.description, [Validators.required]],
      dateDebut: [infoReseauDistribution.dateDebut, [Validators.required]],
      dateFin: [infoReseauDistribution.dateFin],
    });
  }
  submitEditReseauDistribution(formDirective: any){
    if(this.formEditReseauDistribution.valid){
      this.formEditReseauDistribution.get("dateDebut").setValue(moment(this.formEditReseauDistribution.get("dateDebut").value).format('YYYY-MM-DD'))

      this.reseauDistributionService.updateReseauDistribution(this.formEditReseauDistribution.value, this.data.idReseau).subscribe(
        (data:any) => {
          this.reseauDistributionEditSuccess = true;
          this.reseauDistributionEditError = false;
          this.idReseau = data.idReseau;
          this.dialogRef.close();
        },
      
        error => {
          this.reseauDistributionEditError = true;
          this.reseauDistributionEditSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        })
    }
  }

  debutDateChange(value: any) {

    this.minDate = value

  }

}
