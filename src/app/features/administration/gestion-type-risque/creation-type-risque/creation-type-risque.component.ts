
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {TypeRisqueService} from '../../../../core/services/type-risque.service';
import * as moment from 'moment';

@Component({
  selector: 'app-creation-type-risque',
  templateUrl: './creation-type-risque.component.html',
  styleUrls: ['./creation-type-risque.component.scss']
})
export class CreationTypeRisqueComponent implements OnInit {
  formCreationTypeRisque: FormGroup;
  iconValue = ''
  typeRisqueCreationSuccess=false
  typeRisqueCreationError=false
  messageError: string;
  minDate = new Date()
  idTypeRisque:number
  constructor(private typeRisqueService:TypeRisqueService,private formBuilderAuth: FormBuilder) { }

  ngOnInit(): void {
    this.initFormCreationTaxe()
  }
  initFormCreationTaxe() {
    this.formCreationTypeRisque = this.formBuilderAuth.group({
      description: ['', [Validators.required]],
      codificationNationale: ['', [Validators.required]],
      codificationMetier: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: ['',],
     
    });
  }
  submitCreationTypeRisque(formDirective:any) {
    if(this.formCreationTypeRisque.valid){
      this.formCreationTypeRisque.get("dateDebut")?.setValue(moment(this.formCreationTypeRisque.value.dateDebut).format("YYYY-MM-DDT00:00:00.000+00:00"))

      this.typeRisqueService.createTypeRisque(this.formCreationTypeRisque.value).subscribe(
        (data:any) => {
          this.typeRisqueCreationSuccess = true;
          this.typeRisqueCreationError = false;
          this.idTypeRisque = data.idTypeRisque;
          formDirective.resetForm();
          this.formCreationTypeRisque.reset();
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
