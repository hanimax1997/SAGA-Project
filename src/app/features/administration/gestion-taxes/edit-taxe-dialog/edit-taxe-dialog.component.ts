

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaxeService } from '../../../../core/services/taxe.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Taxe } from '../../../../core/models/taxe';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-taxe-dialog',
  templateUrl: './edit-taxe-dialog.component.html',
  styleUrls: ['./edit-taxe-dialog.component.scss']
})
export class EditTaxeDialogComponent implements OnInit {
  formCreationTaxe: FormGroup;
  iconValue = ''
  taxeCreationSuccess = false
  taxeCreationError = false
  messageError: string;
  minDate = new Date()
  formTaxe: Taxe = new Taxe()
  idTaxe=0
  typeTaxes = [
    {
      id: 1,
      value: 'valeur fixe',
      icon: ''
    },
    {
      id: 2,
      value: 'valeur par formule',
      icon: ''
    },
    {
      id: 3,
      value: 'pourcentage sur un montant',
      icon: ''
    }
  ]
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private taxeService: TaxeService, private formBuilderAuth: FormBuilder) { }

  ngOnInit(): void {
 
    this.getTaxeById(this.data.idTaxe);
   
  }
  initFormCreationTaxe(infoTaxe:any) {
    this.debutDateChange(infoTaxe.date_debut);
    this.formCreationTaxe = this.formBuilderAuth.group({
      idNational: [infoTaxe.idNational, [Validators.required]],
      description: [infoTaxe.description, [Validators.required]],
      valeurType: [infoTaxe.valeurType, [Validators.required]],
      valeur: [infoTaxe.valeur, [Validators.required]],
      valeurMin: [infoTaxe.valeurMin, [Validators.required]],
      valeurMax: [infoTaxe.valeurMax, [Validators.required]],
      dateDebut: [infoTaxe.dateDebut, [Validators.required]],
      dateFin: [infoTaxe.dateFin],
      auditUser: [infoTaxe.auditUser],
    });
  }
  getTaxeById(idTaxe:any){
    this.taxeService.getTaxeById(idTaxe).subscribe((result:any) => {
      this.initFormCreationTaxe(result);
    })
  }
  submitEditTaxe(formDirective: any) {
    if (this.formCreationTaxe.valid) {
      this.formCreationTaxe.value.dateDebut.setValue(moment(this.formCreationTaxe.value.dateDebut).format('YYYY-MM-DD'))
      
      this.taxeService.updateTaxe(this.formCreationTaxe.value,this.data.idTaxe).subscribe(
        (data:any) => {
          this.taxeCreationSuccess = true;
          this.taxeCreationError = false;
          this.idTaxe = data.idTaxe;
          formDirective.resetForm();
          this.formCreationTaxe.reset();
        },
      
        error => {
          this.taxeCreationError = true;
          this.taxeCreationSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        })

    }
  }

  changeTypeTaxe(value: any) {
    if (value == 2) {

    }
    switch (value) {
      case 2: {
        this.formCreationTaxe.get('valeurTaxe')?.clearValidators();
        this.formCreationTaxe.get('valeurTaxe')?.updateValueAndValidity();
        this.formCreationTaxe.controls.valeurTaxe.disable();
        break;
      }
      case 3: {
        this.formCreationTaxe.controls.valeurTaxe.enable();
        this.iconValue = '%'
        break;
      }
      case 1: {
        this.formCreationTaxe.controls.valeurTaxe.enable();
        this.iconValue = 'DA'
        break;
      }
    }
  }
  debutDateChange(value: any) {

    this.minDate = value

  }
}
