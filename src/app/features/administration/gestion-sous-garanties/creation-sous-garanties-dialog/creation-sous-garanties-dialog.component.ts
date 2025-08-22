import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Garanties } from 'src/app/core/models/garanties'; 
import { SousGarantiesService } from '../../../../core/services/sous-garanties.service';
import { GarantiesService } from 'src/app/core/services/garanties.service'; 
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-creation-sous-garanties',
  templateUrl: 'creation-sous-garanties-dialog.component.html',
  styleUrls: ['creation-sous-garanties-dialog.component.scss'
  ]
})
export class CreationSousGarantiesDialogComponent implements OnInit {

  formCreationSousGarantie: FormGroup|any;
  garanties: Garanties[] | any;
  sousGarantieCreationSuccess= false;
  minDate: Date = new Date();
  idSousGarantie:any
  sousGarantieCreationError=false;
  messageError: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private formBuilderAuth: FormBuilder, private sousgarantiesService: SousGarantiesService, private garantieService: GarantiesService) { 
    
  }

  ngOnInit(): void {
    this.garantieService.getAllGaranties().subscribe(garantyList => {
      this.garanties = garantyList
    
    })

    this.formCreationSousGarantie = this.formBuilderAuth.group({
      description: ['', [Validators.required]],
      valeurEnvloppe: [''],
      withTaxe: [''],
      idNationnal: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: [''],
      auditUser: ['test'],

    });
  }

  submitCreationSousGarantie(formDirective: any){
    if(this.formCreationSousGarantie.valid){
      this.formCreationSousGarantie.get("dateDebut")?.setValue(moment(this.formCreationSousGarantie.get("dateDebut").value).format("YYYY-MM-DDT00:00:00.000+00:00"))

      this.sousgarantiesService.addSousGarantie(this.formCreationSousGarantie.value,this.data.idGarantie).subscribe(
        (data:any) => {
          this.sousGarantieCreationSuccess = true;
          this.sousGarantieCreationError = false;
          this.idSousGarantie = data.idSousGarantie;
          formDirective.resetForm();
          this.formCreationSousGarantie.reset();
        },
      
        error => {
          this.sousGarantieCreationError = true;
          this.sousGarantieCreationSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        })
    }
  }
  debutDateChange(value: any) {

    this.minDate = value

  }
}
