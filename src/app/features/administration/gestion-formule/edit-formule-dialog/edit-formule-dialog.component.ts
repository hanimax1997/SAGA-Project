import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Formules } from '../../../../core/models/formules';
import { FormulesService } from '../../../../core/services/formules.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-formule-dialog',
  templateUrl: 'edit-formule-dialog.component.html',
  styleUrls: ['edit-formule-dialog.component.scss']
})
export class EditFormuleDialogComponent implements OnInit {

  formEditFormule: FormGroup|any;
  formule: Formules|any;
  formuleEditSuccess=false;
  now: Date = new Date();
  idFormule: number | undefined;
  formuleEditError=false;
  messageError: string;
  minDate = null

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private formBuilderAuth: FormBuilder, private formulesService: FormulesService, private router: Router) { }

  ngOnInit(): void {
    this.getFormuleById(this.data.idFormule);

  }
  getFormuleById(idFormule: any) {
    this.formulesService.getFormuleById(idFormule).subscribe((result: any) => {

      this.initFormEditFormule(result);
    })
  }

  initFormEditFormule(infoFormule: any) {
    this.debutDateChange(infoFormule.dateDebut);

    this.formEditFormule = this.formBuilderAuth.group({
      id: [infoFormule.id],
      description: [infoFormule.description, [Validators.required]],
      dateDebut: [infoFormule.dateDebut, [Validators.required]],
      dateFin: [infoFormule.dateFin],
    });
  }
  submitEditFormule(formDirective: any){
    if(this.formEditFormule.valid){
      this.formEditFormule.get("dateDebut").setValue(moment(this.formEditFormule.get("dateDebut").value).format('YYYY-MM-DD'))

      this.formulesService.updateFormule(this.formEditFormule.value,this.data.idFormule).subscribe(
        (data:any) => {
          this.formuleEditSuccess = true;
          this.formuleEditError = false;
          this.idFormule = data.id_formule;
          formDirective.resetForm();
          this.formEditFormule.reset();
        },
      
        error => {
          this.formuleEditError = true;
          this.formuleEditSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        })
    }
  }
  debutDateChange(value: any) {

    this.minDate = value

  }
}
