import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SinistresService } from 'src/app/core/services/sinistres.service';

@Component({
  selector: 'app-withdrawal-sinistre-dialog',
  templateUrl: './withdrawal-sinistre-dialog.component.html',
  styleUrls: ['./withdrawal-sinistre-dialog.component.scss']
})
export class WithdrawalSinistreDialogComponent implements OnInit {
  clotureSinistre = {
    "statut": false,
    "reponse": false
  }
  desistementReponse = false
  natureDommage = ''
  idSinistre:any
  constructor(private sinistresService: SinistresService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<WithdrawalSinistreDialogComponent>) { }

  ngOnInit(): void {
    // this.natureDommage =this.data.natureDommage
    // this.idSinistre =this.data.idSinistre

  }

  desistement(reponse: any) {

    // if (reponse == 0) {
    //   if (this.natureDommage == 'C' || this.natureDommage == 'MC')
    //     this.clotureSinistre.statut = true
    //   this.desistementReponse = true
    // }
    // else {
    //   this.desistementReponse = false
    //   this.clotureSinistre.statut = false
    // }
  }
  cloturerSinistre(reponse: any) {
    // if (reponse == 0)
    //   this.clotureSinistre.reponse = true
    // else
    //   this.clotureSinistre.reponse = false

  }
  // submit() {
  //   this.dialogRef.close({ data: { "data": true, "desistement": this.desistementReponse,  "idSinistre": this.idSinistre } })

  // }
}
