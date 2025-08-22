import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { GenericService } from 'src/app/core/services/generic.service';
@Component({
  selector: 'app-fraude-sinistre-dialog',
  templateUrl: './fraude-sinistre-dialog.component.html',
  styleUrls: ['./fraude-sinistre-dialog.component.scss']
})
export class FraudeSinistreDialogComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private genericService: GenericService, private sinistresService: SinistresService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<FraudeSinistreDialogComponent>) { }
  statutFraude: any
  loadListFraudes = false
  fraudesArray: any = []
  contentieuxArray: any = []
  typeFraudes: any = []
  typeFraude: any
  formFraude: FormGroup | any;

  ngOnInit(): void {
    // get statut fraudes Sinistre
    this.formFraude = this.formBuilder.group({

      fraude: ["", Validators.required],
      contentieux: ["", Validators.required],
    });
    if (this.data.statutSinistre == 'CP355' || this.data.statutSinistre == 'CP415')
      this.formFraude.disable()
    else
      this.formFraude.enable()
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C58").idCategorie).subscribe(data => {
      this.fraudesArray = data

      if (this.data.fraude != undefined) {
        this.formFraude.get("fraude").setValue(this.data.fraude.statutFraude.idParam)
      }else
      this.formFraude.get("fraude").setValue((this.fraudesArray.filter((fraude:any)=>fraude.code=='CP435'))[0].idParam)

    })

    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C73").idCategorie).subscribe(data => {
      this.contentieuxArray = data
      if (this.data.fraude != undefined) {
        this.formFraude.get("contentieux").setValue(this.data.fraude.statutContentieux.idParam)

      }else
      this.formFraude.get("contentieux").setValue((this.contentieuxArray.filter((contentieux:any)=>contentieux.code=='CP483'))[0].idParam)

    })
  }

  submit() {
    this.dialogRef.close({ data: { "data": true, "fraude": this.formFraude.get("fraude").value, "contentieux": this.formFraude.get("contentieux").value } })

  }
}
