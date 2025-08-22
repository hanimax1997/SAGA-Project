import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { GenericService } from 'src/app/core/services/generic.service';

@Component({
  selector: 'app-edit-assistance-dialog',
  templateUrl: './edit-assistance-dialog.component.html',
  styleUrls: ['./edit-assistance-dialog.component.scss']
})
export class EditAssistanceDialogComponent {
  constructor(private genericService: GenericService, private formBuilder: FormBuilder, private sinistresService: SinistresService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditAssistanceDialogComponent>) { }
  formAssistance: FormGroup | any;
  listAssisteurExist = false
  futurAssisteurExist = false
  assisteurs: any = []

  ngOnInit(): void {

    this.formAssistance = this.formBuilder.group({

      assisteur: ["", Validators.required],
      futurAssisteur: ["", Validators.required],
      idAssistance: ["", Validators.required],
    });
    //ASSISTEURS
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C55").idCategorie).subscribe(data => {
      this.assisteurs = data;
    })
    this.initForm()

  }
  initForm() {
    if (this.data.assistanceInfo.length != 0) {
      // assisteur exist
      if (this.data.assistanceInfo[0].existeAssistance != null) {
        this.formAssistance.get("assisteur").setValue("true")
        this.withAssisteur("true", 1)
        this.formAssistance.get("idAssistance").setValue(this.data.assistanceInfo[0].assisteur.idParam)
      } else {
        // futur assistance oui 
        this.formAssistance.get("assisteur").setValue("false")
        this.withAssisteur("false", 1)
        this.formAssistance.get("futurAssisteur").setValue("true")
        this.withAssisteur("true", 2)
        this.formAssistance.get("idAssistance").setValue(this.data.assistanceInfo[0].assisteur.idParam)
      }
    }
    if (this.data.statutSinistre == 'CP355' || this.data.statutSinistre == 'CP415'||this.data.statutSinistre == 'CP524' || this.data.statutSinistre =='CP525'|| this.data.statutSinistre =='CP526')
      this.formAssistance.disable()
    else this.formAssistance.enable()
  }
  withAssisteur(idReponse: any, time: number) {
    if (idReponse == "false") { // non je n'ai pas fait appel a un assiteur && time == 1

      this.formAssistance.get("futurAssisteur").setValidators([Validators.required])
      this.formAssistance.get("futurAssisteur").updateValueAndValidity()
      this.futurAssisteurExist = true

      this.listAssisteurExist = false
    } else if (idReponse == "true") { // oui 
      this.formAssistance.get("idAssistance").setValidators([Validators.required])
      this.formAssistance.get("idAssistance").updateValueAndValidity()
      if (time == 1) {
        this.formAssistance.get("futurAssisteur").setValidators([])
        this.formAssistance.get("futurAssisteur").updateValueAndValidity()
        this.futurAssisteurExist = false
      }
      this.listAssisteurExist = true

    }
  }
  submitAssistance() {
    if (this.formAssistance.valid) {
      let bodyAssistance: any = {}

      if (this.formAssistance.get("assisteur").value == 'true') {

        bodyAssistance.existeAssistance = this.formAssistance.get("assisteur").value
        bodyAssistance.assisteur = {
          "idParam": this.formAssistance.get("idAssistance").value
        }
        bodyAssistance.appelAssistance = null

      } else {

        if (this.formAssistance.get("futurAssisteur").value == 'true') {
          bodyAssistance.existeAssistance = null
          bodyAssistance.appelAssistance = this.formAssistance.get("futurAssisteur").value
          bodyAssistance.assisteur = {
            "idParam": this.formAssistance.get("idAssistance").value
          }

        } else
          bodyAssistance = null
 
      }
      this.dialogRef.close({ data: { "data": true, "bodyAssistance": bodyAssistance } })
    }

  }
}
