import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-supression-pack-garantie',
  templateUrl: './supression-pack-garantie.component.html',
  styleUrls: ['./supression-pack-garantie.component.scss']
})
export class SupressionPackGarantieComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<SupressionPackGarantieComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  description = this.data.desc
  categoryOf = this.data.categoryOf
  typeSupression = this.data.type
  formSupression: FormGroup | any;
  minDate = new Date()
  ngOnInit(): void {
    if (this.typeSupression == "put")
      this.formSupression = this.formBuilder.group({

        dateFin: ["", Validators.required],
      });
  }
  submitSupression() {
    if (this.typeSupression == "put" && this.formSupression.valid) {
      this.formSupression.get("dateFin").setValue(moment(this.formSupression.get("dateFin").value).format('YYYY-MM-DD'))

      this.dialogRef.close({ data: { "data": true, "dateFin": this.formSupression.get("dateFin").value } })
    }
  }
}
