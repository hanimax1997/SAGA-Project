import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Garanties } from '../../../../core/models/garanties';
import { GarantiesService } from '../../../../core/services/garanties.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import * as moment from 'moment';
import { GenericService } from 'src/app/core/services/generic.service';

@Component({
  selector: 'app-edit-garantie-dialog',
  templateUrl: 'edit-garantie-dialog.component.html',
  styleUrls: ['edit-garantie-dialog.component.scss']
})

export class EditGarantieDialogComponent implements OnInit {
  formEditGarantie: FormGroup|any;
  garantie: Garanties|any;
  garantieEditSuccess=false;
  minDate = null
  idGarantie:number;
  garantieEditError=false;
  messageError: string;
  categorieGarantieArray: any = [];

  constructor(private genericService:GenericService,public dialogRef: MatDialogRef<EditGarantieDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private formBuilderAuth: FormBuilder, private garantiesService: GarantiesService, private router: Router) { }

  ngOnInit(): void {

    this.getGarantieById(this.data.idGarantie)


  }
  getCategorieGarantie(){

    this.genericService
    .getParam(
      JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find(
        (parametre: any) => parametre.code == 'C80'
      ).idCategorie
    )
    .subscribe((data) => {
      this.categorieGarantieArray = data

    });
  }
  getGarantieById(idGarantie:any){
    this.garantiesService.getGarantieById(idGarantie).subscribe((result:any) => {
      this.getCategorieGarantie()
      this.iniEdittGarantie(result);
    })
  }
  iniEdittGarantie(infoGarantie:any){
    this.debutDateChange(infoGarantie.dateDebut);
    this.formEditGarantie = this.formBuilderAuth.group({
      idGarantie: [infoGarantie.idGarantie],
      idNationnal: [infoGarantie.idNationnal],
      codeGarantie: [infoGarantie.codeGarantie],
      description: [infoGarantie.description, [Validators.required]],
      valeurEnvloppe: [infoGarantie.valeurEnvloppe],
      categorieGarantie: [infoGarantie.categorieGarantie, [Validators.required]],
      withTaxe: [infoGarantie.withTaxe ? 1:0,[Validators.required]],
      dateDebut: [infoGarantie.dateDebut, [Validators.required]],
      dateFin: [infoGarantie.dateFin],
      auditUser: [infoGarantie.auditUser],
    });
  }
  submitEditGarantie(formDirective: any){
    if(this.formEditGarantie.valid){
      this.formEditGarantie.get("dateDebut").setValue(moment(this.formEditGarantie.get("dateDebut").value).format('YYYY-MM-DD'))
      let bodyGarantie=this.formEditGarantie.value
      bodyGarantie.categorieGarantie={"idParam":this.formEditGarantie.get("categorieGarantie").value}
      this.garantiesService.updateGarantie(this.data.idGarantie,bodyGarantie).subscribe(
        (data:any) => {
          this.garantieEditSuccess = true;
          this.garantieEditError = false;
          this.idGarantie = data.idGarantie;
          this.dialogRef.close();
        },
      
        error => {
          this.garantieEditError = true;
          this.garantieEditSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        })
    }
  }

  debutDateChange(value: any) {

    this.minDate = value

  }

}
