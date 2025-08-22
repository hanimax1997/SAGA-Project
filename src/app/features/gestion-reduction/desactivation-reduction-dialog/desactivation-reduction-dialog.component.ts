
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Inject } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-desactivation-reduction-dialog',
  templateUrl: './desactivation-reduction-dialog.component.html',
  styleUrls: ['./desactivation-reduction-dialog.component.scss']
})
export class DesactivationReductionDialogComponent implements OnInit {
  FormDesactiveReduction: FormGroup | any;
  minDate=new Date()
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,public dialogRef: MatDialogRef<DesactivationReductionDialogComponent>) { }

  ngOnInit(): void {
    this.FormDesactiveReduction = this.formBuilder.group({
      dateFin: ['', [Validators.required]],

    });
  }
  submitDateFin(formDirective:any){
    if(this.FormDesactiveReduction.valid){
      this.FormDesactiveReduction.get("dateFin").setValue(moment(this.FormDesactiveReduction.get("dateFin").value).format('YYYY-MM-DD'))

      this.dialogRef.close({ data: this.FormDesactiveReduction.get("dateFin").value })
    }
  }
}