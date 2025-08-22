

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {TypeRisqueService} from '../../../../core/services/type-risque.service'
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-type-risque-dialog',
  templateUrl: './edit-type-risque-dialog.component.html',
  styleUrls: ['./edit-type-risque-dialog.component.scss']
})
export class EditTypeRisqueDialogComponent implements OnInit {
  formEditTypeRisque: FormGroup;
  iconValue = ''
  typeRisqueCreationSuccess=false
  typeRisqueCreationError=false
  messageError: string;
  minDate = null
  idTypeRisque:number
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private typeRisqueService:TypeRisqueService,private formBuilderAuth: FormBuilder) { }

  ngOnInit(): void {
    this.getTypeRisqueById(this.data.idTypeRisque);
  }
  initFormEditTypeRisque(infoTypeRisque:any) {
    this.debutDateChange(infoTypeRisque.dateDebut);
    this.formEditTypeRisque = this.formBuilderAuth.group({
      description: [infoTypeRisque.description, [Validators.required]],
      codificationNationale: [infoTypeRisque.codificationNationale, [Validators.required]],
      codificationMetier: [infoTypeRisque.codificationMetier, [Validators.required]],
      dateDebut: [infoTypeRisque.dateDebut, [Validators.required]],
      dateFin: [infoTypeRisque.dateFin,],
     
    });
   

  }
  getTypeRisqueById(idTypeRisque:any){
    this.typeRisqueService.getTypeRisqueById(idTypeRisque).subscribe((result:any) => {
      this.initFormEditTypeRisque(result);
    })
  }
  submitEditTypeRisque(formDirective:any) {
    if(this.formEditTypeRisque.valid){
      this.formEditTypeRisque.value.dateDebut.setValue(moment(this.formEditTypeRisque.value.dateDebut).format('YYYY-MM-DD'))

      this.typeRisqueService.updateTypeRisque(this.formEditTypeRisque.value,this.data.idTypeRisque).subscribe(
        (data:any) => {
          this.typeRisqueCreationSuccess = true;
          this.typeRisqueCreationError = false;
          this.idTypeRisque = data.idTypeRisque;
          formDirective.resetForm();
          this.formEditTypeRisque.reset();
        },
      
        error => {
          this.typeRisqueCreationError = true;
          this.typeRisqueCreationSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        })


    }
  }
  debutDateChange(value: any) {

    this.minDate = value

  }
}
