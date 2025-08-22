
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Inject } from '@angular/core';
import * as moment from 'moment';
import { ConventionService } from 'src/app/core/services/convention.service';

@Component({
  selector: 'app-edit-convention-dialog',
  templateUrl: './edit-convention-dialog.component.html',
  styleUrls: ['./edit-convention-dialog.component.scss']
})
export class EditConventionDialogComponent {
  formEditConvention: FormGroup | any;
  minDate = new Date()
  formReady=false
  convention:any=[]
 
  constructor(private conventionService: ConventionService, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditConventionDialogComponent>) { }

  ngOnInit(): void {
    this.conventionService.getOneConvention(this.data.idConvention).subscribe({
      next: (data: any) => {
        this.convention = data
       
        this.formReady=true
        console.log('init data',data)
        this.formEditConvention = this.formBuilder.group({
          nomConvention: [this.convention?.nomConvention, [Validators.required]],
         dateDebut  : [this.convention?.dateDebut],
          
          dateFin: [this.convention?.dateFin],
    
        });  
         this.formEditConvention.get('dateDebut').disable()
       
        this.formEditConvention.value.dateDebut=this.convention?.dateDebut
      console.log("sqss", this.formEditConvention)

        //  console.log('tryyy',this.formEditConvention.get('dateDebut').setValue(this.convention?.dateDebut))
    // this.formEditConvention.get('dateDebut')?.value(this.convention?.dateDebut)


        
      },
     
      error: (error) => {

        console.log(error);

      }
    }); 
   
   

  } 
 

  submitDateFin(formDirective: any) {
    if (this.formEditConvention.valid) {
      console.log('hghghghg',this.formEditConvention)
      this.formEditConvention.get("dateFin").setValue(moment(this.formEditConvention.get("dateFin").value).format('YYYY-MM-DD'))
      // this.formEditConvention.value.dateDebut=(moment(this.convention.dateDebut).format('YYYY-MM-DD'))


      this.dialogRef.close({ data: this.formEditConvention})
    }
  }
}
