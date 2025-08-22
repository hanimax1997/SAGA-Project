import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { GenericService } from 'src/app/core/services/generic.service';

@Component({
  selector: 'app-delete-personne-dialog',
  templateUrl: './delete-personne-dialog.component.html',
  styleUrls: ['./delete-personne-dialog.component.scss']
})
export class DeletePersonneDialogComponent implements OnInit {
  minDate = new Date()
  formMotif: FormGroup | any;
  motifsArray: any = []
  sousMotifsArray: any = []
  motifCloture: any
  constructor(private genericService: GenericService, private formBuilder: FormBuilder, public dialogRef: MatDialogRef<DeletePersonneDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
    this.formMotif = this.formBuilder.group({
      motif: ["", [Validators.required]],
      sousMotif: [null],
      description: [""],
    });
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C76").idCategorie).subscribe(data => {
      this.motifsArray = data
    })
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C77").idCategorie).subscribe(data => {
      this.sousMotifsArray = data
    })
  }
  submitSupression() {
    this.dialogRef.close({ data: { "data": true, "dateFin": new Date() } })
  }
  submitMotif() {
    if (this.formMotif.valid) {
      let body = {
        "motif": { "idParam": this.formMotif.get("motif").value.idParam, "code": this.formMotif.get("motif").value.code },
        "sousMotif": null || {},
        "description": this.formMotif.get("description").value,
        "motifCode": this.motifCloture,
      }
      if (this.motifCloture == 'CP526')
        body.sousMotif = { "idParam": this.formMotif.get("sousMotif").value.idParam, "code": this.formMotif.get("sousMotif").value.code }

      this.dialogRef.close({ data: { "data": true, "content": body } })

    }
  }
  submitConfirmation() {
    this.dialogRef.close({ data: { "data": true, "content": null } })

  }
  controlMotif(motif: any) {

    this.motifCloture = motif.code
    if (this.motifCloture == 'CP526') {
      this.formMotif.get("sousMotif").setValidators([Validators.required])
      this.formMotif.get("description").setValidators([Validators.required])
    } else {
      this.formMotif.get("sousMotif").setValidators([])
      this.formMotif.get("description").setValidators([])
    }

  }
}
