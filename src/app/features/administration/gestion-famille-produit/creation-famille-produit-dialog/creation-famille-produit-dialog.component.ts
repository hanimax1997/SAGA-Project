
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FamilleProduitService} from '../../../../core/services/famille-produit.service';
import * as moment from 'moment';

@Component({
  selector: 'app-creation-famille-produit-dialog',
  templateUrl: './creation-famille-produit-dialog.component.html',
  styleUrls: ['./creation-famille-produit-dialog.component.scss']
})
export class CreationFamilleProduitDialogComponent implements OnInit {
  formCreationFamille: FormGroup;
  iconValue = ''
  FamilleCreationSuccess=false
  FamilleCreationError=false
  minDate = new Date()
  idFamilleProduit:number=0
  messageError: string | undefined;
  constructor(private familleProduitService:FamilleProduitService,private formBuilderAuth: FormBuilder) { }

  ngOnInit(): void {
    this.initFormCreationFamille()
  }
  initFormCreationFamille() {
    this.formCreationFamille = this.formBuilderAuth.group({
      description: ['', [Validators.required]],
      codificationNationale: ['', [Validators.required]],
      codificationMetier: ['', [Validators.required]],
      date_debut: ['', [Validators.required]],
      date_fin: ['',],
     
    });
  }
  submitCreationFamille(formDirective:any) {
    if(this.formCreationFamille.valid){
      this.formCreationFamille.value.date_debut = moment(this.formCreationFamille.value.date_debut).format('YYYY-MM-DD')
      // this.formCreationFamille.get("date_debut").setValue(moment(this.formCreationFamille.get("date_debut").value).format('YYYY-MM-DD'))

      this.familleProduitService.createFamilleProduit(this.formCreationFamille.value).subscribe(
        (data:any) => {
          this.FamilleCreationSuccess = true;
          this.FamilleCreationError = false;
          this.idFamilleProduit = data.id_famille;
          formDirective.resetForm();
          this.formCreationFamille.reset();
        },
      
        error => {
          this.FamilleCreationError = true;
          this.FamilleCreationSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        })


    }
  }
  debutDateChange(value: any) {

    this.minDate = value

  }
}
