import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormulesService } from '../../../../core/services/formules.service'; 
import * as moment from 'moment';

@Component({
  selector: 'app-creation-formule-dialog',
  templateUrl: 'creation-formule-dialog.component.html',
  styleUrls: ['creation-formule-dialog.component.scss']
})
export class CreationFormuleDialogComponent implements OnInit {

  formCreationFormule: FormGroup|any;
  formuleCreationSuccess=false;
  now: Date = new Date();
  idFormule: number | undefined;
  formuleCreationError=false;
  messageError: string;
  minDate = new Date()

  constructor(private formBuilderAuth: FormBuilder, private formulesService: FormulesService, private router: Router) { }

  ngOnInit(): void {
    this.formCreationFormule = this.formBuilderAuth.group({
      description: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: [''],
    });
  }

  submitCreationFormule(formDirective: any){
    if(this.formCreationFormule.valid){
      this.formCreationFormule.get("dateDebut").setValue(moment(this.formCreationFormule.get("dateDebut").value).format('YYYY-MM-DD'))

      this.formulesService.addFormule(this.formCreationFormule.value).subscribe(
        (data:any) => {
          this.formuleCreationSuccess = true;
          this.formuleCreationError = false;
          this.idFormule = data.id_formule;
          formDirective.resetForm();
          this.formCreationFormule.reset();
        },
      
        error => {
          this.formuleCreationError = true;
          this.formuleCreationSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        })
    }
  }
  debutDateChange(value: any) {

    this.minDate = value

  }
}
