import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { Inject } from '@angular/core';
@Component({
  selector: 'app-creation-pack-garantie',
  templateUrl: './creation-pack-garantie.component.html',
  styleUrls: ['./creation-pack-garantie.component.scss']
})
export class CreationPackGarantieComponent implements OnInit {
  FormCreationPackGarantie: FormGroup | any;
  constructor(public dialogRef: MatDialogRef<CreationPackGarantieComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private formBuilder: FormBuilder) {
    dialogRef.disableClose = true;
   }

  ngOnInit(): void {

    this.initFormCreationPackGarantie()
    
  }
  initFormCreationPackGarantie() {
    this.FormCreationPackGarantie = this.formBuilder.group({
      obligatoire: ['', [Validators.required]],

    });
  }
  submitCreationPackGarantie(){
    if(this.FormCreationPackGarantie.valid){
      let garantiePackForm={
        "id": this.data.id,
        "description": this.data.description,
        "obligatoire": this.FormCreationPackGarantie.get("obligatoire").value,
      }
      this.dialogRef.close({ data:garantiePackForm})
    }
  }
}
