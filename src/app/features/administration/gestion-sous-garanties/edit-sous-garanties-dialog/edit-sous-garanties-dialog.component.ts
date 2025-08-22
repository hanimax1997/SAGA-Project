import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Garanties } from 'src/app/core/models/garanties';
import { GarantiesService } from 'src/app/core/services/garanties.service';
import { SousGaranties } from '../../../../core/models/sous-garanties';
import { SousGarantiesService } from '../../../../core/services/sous-garanties.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-sous-garanties',
  templateUrl: 'edit-sous-garanties-dialog.component.html',
  styleUrls: [ 'edit-sous-garanties-dialog.component.scss']
})
export class EditSousGarantiesDialogComponent implements OnInit {

  formEditSousGarantie: FormGroup|any;
  garanties: Garanties[] | any;
  sousgarantie: SousGaranties|any;
  sousGarantieEditSuccess=false;
  chosenTaxe=0
  minDate = null
  idSousGarantie: number | undefined;
  sousGarantieEditError=false;
  messageError: string;

  constructor(public dialogRef: MatDialogRef<EditSousGarantiesDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private formBuilderAuth: FormBuilder, private sousgarantiesService: SousGarantiesService, private garantieService: GarantiesService) { }

  ngOnInit(): void {

    this.getSousGarantieById(this.data.idSousGarantie) 

    // this.garantieService.getAllGaranties().subscribe(garantyList => {
    //   this.garanties = garantyList
    // })
    


  }

  getSousGarantieById(idSousGarantie:any){
    this.sousgarantiesService.getSousGarantieById(idSousGarantie).subscribe((result:any) => {
      
      this.iniEditSousGarantie(result);
    })
  }

  iniEditSousGarantie(infoSousGarantie:any){
    this.debutDateChange(infoSousGarantie.dateDebut);
    this.formEditSousGarantie = this.formBuilderAuth.group({
      idSousGarantie: [infoSousGarantie.idSousGarantie],
      idGarantie: [infoSousGarantie.idGarantie, [Validators.required]],
      description: [infoSousGarantie.description, [Validators.required]],
      idNationnal: [infoSousGarantie.idNationnal],
      valeurEnvloppe: [infoSousGarantie.valeurEnvloppe],
      dateDebut: [infoSousGarantie.dateDebut, [Validators.required]],
      dateFin: [infoSousGarantie.dateFin],
      auditUser: [infoSousGarantie.auditUser],

    });
    this.chosenTaxe=infoSousGarantie.withTaxe
  }
  submitEditSousGarantie(formDirective: any){
    if(this.formEditSousGarantie.valid){
      this.formEditSousGarantie.get("dateDebut").setValue(moment(this.formEditSousGarantie.get("dateDebut").value).format('YYYY-MM-DD'))

      this.sousgarantiesService.updateSousGarantie(this.formEditSousGarantie.value,this.data.idSousGarantie).subscribe(
        (data:any) => {
          this.sousGarantieEditSuccess = true;
          this.sousGarantieEditError = false;
          this.idSousGarantie = data.idSousGarantie;
          this.dialogRef.close();
        },
      
        error => {
          this.sousGarantieEditError = true;
          this.sousGarantieEditSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        })
    }
  }
  debutDateChange(value: any) {

    this.minDate = value

  }
}
