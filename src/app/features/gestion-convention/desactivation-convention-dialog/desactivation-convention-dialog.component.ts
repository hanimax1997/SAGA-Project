
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Inject } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-desactivation-convention-dialog',
  templateUrl: './desactivation-convention-dialog.component.html',
  styleUrls: ['./desactivation-convention-dialog.component.scss']
})
export class DesactivationConventionDialogComponent implements OnInit {

  FormDesactiveConvention: FormGroup | any;
  minDate=new Date()
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,public dialogRef: MatDialogRef<DesactivationConventionDialogComponent>) { }

  ngOnInit(): void {
    this.FormDesactiveConvention = this.formBuilder.group({
      dateFin: ['', [Validators.required]],

    });
  }
  submitDateFin(formDirective:any){
    if(this.FormDesactiveConvention.valid){ 
         console.log('FormDesactiveConvention',this.FormDesactiveConvention)

      this.FormDesactiveConvention.get("dateFin").setValue(moment(this.FormDesactiveConvention.get("dateFin").value).format('YYYY-MM-DD'))

    
       this.dialogRef.close({ data: this.FormDesactiveConvention})
    }
  }
}