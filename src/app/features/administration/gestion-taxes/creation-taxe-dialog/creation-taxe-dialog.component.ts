import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaxeService } from '../../../../core/services/taxe.service';

import {MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-creation-taxe-dialog',
  templateUrl: './creation-taxe-dialog.component.html',
  styleUrls: ['./creation-taxe-dialog.component.scss']
})
export class CreationTaxeDialogComponent implements OnInit {
  formCreationTaxe: FormGroup;
  iconValue = ''
  taxeCreationSuccess = false
  taxeCreationError = false
  messageError: string;
  minDate = new Date()
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
  constructor(public dialogRef: MatDialogRef<CreationTaxeDialogComponent>, private taxeService: TaxeService, private formBuilderAuth: FormBuilder) { }

  ngOnInit(): void {
    this.initFormCreationTaxe()
  }
  initFormCreationTaxe() {
    this.formCreationTaxe = this.formBuilderAuth.group({
      description: ['', [Validators.required]],
      idNational: ['', [Validators.required]],
      valeurType: ['', [Validators.required]],
      valeur: ['', [Validators.required]],
      valeurMin: ['', [Validators.required]],
      valeurMax: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: [''],
      auditUser: ['test'],
    });
  }
  submitCreationTaxe(formDirective: any) {
    if (this.formCreationTaxe.valid) {
      this.formCreationTaxe.value.dateDebut.setValue(moment(this.formCreationTaxe.value.dateDebut).format('YYYY-MM-DD'))

      this.taxeService.createTaxe(this.formCreationTaxe.value).subscribe(
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
