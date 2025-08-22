

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FamilleProduitService} from '../../../../core/services/famille-produit.service'
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-famille-produit-dialog',
  templateUrl: './edit-famille-produit-dialog.component.html',
  styleUrls: ['./edit-famille-produit-dialog.component.scss']
})
export class EditFamilleProduitDialogComponent implements OnInit {
  formEditFamille: FormGroup;
  iconValue = ''
  FamilleEditSuccess=false
  FamilleEditError=false
  minDate = null
  idFamillePrduit:number=0
  messageError: string | undefined;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private familleProduitService:FamilleProduitService,private formBuilderAuth: FormBuilder) { }

  ngOnInit(): void {
  
    this.getFamilleProduitById(this.data.idFamilleProduit);
  }
  initFormEditFamille(infoFamilleProduit:any) {
    this.debutDateChange(infoFamilleProduit.date_debut);
    this.formEditFamille = this.formBuilderAuth.group({
      description: [infoFamilleProduit.description, [Validators.required]],
      codificationNationale: [infoFamilleProduit.codificationNationale, [Validators.required]],
      codificationMetier: [infoFamilleProduit.codificationMetier, [Validators.required]],
      date_debut: [infoFamilleProduit.date_debut, [Validators.required]],
      date_fin: [infoFamilleProduit.date_fin,],
      auditUser: [infoFamilleProduit.auditUser],
     
    });
  }

  getFamilleProduitById(idFamilleProduit:any){
    this.familleProduitService.getFamilleProduitById(idFamilleProduit).subscribe((result:any) => {
      
      this.initFormEditFamille(result);
    })
  }
  submitEditFamille(formDirective:any) {
    if(this.formEditFamille.valid){
      this.formEditFamille.value.date_debut = moment(this.formEditFamille.value.date_debut).format('YYYY-MM-DD')

      this.familleProduitService.updateFamilleProduit(this.data.idFamilleProduit,this.formEditFamille.value).subscribe(
        (data:any) => {
          this.FamilleEditSuccess = true;
          this.FamilleEditError = false;
          this.idFamillePrduit = data.id_famille;
          formDirective.resetForm();
          this.formEditFamille.reset();
        },
      
        error => {
          this.FamilleEditError = true;
          this.FamilleEditSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        })


    }
  }
  debutDateChange(value: any) {

    this.minDate = value

  }
}
