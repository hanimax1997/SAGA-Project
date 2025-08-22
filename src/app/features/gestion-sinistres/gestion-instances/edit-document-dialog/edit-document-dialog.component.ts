import { Component,Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { GenericService } from 'src/app/core/services/generic.service';

@Component({
  selector: 'app-edit-document-dialog',
  templateUrl: './edit-document-dialog.component.html',
  styleUrls: ['./edit-document-dialog.component.scss']
})
export class EditDocumentDialogComponent implements OnInit {
  constructor( 
    public dialogRef: MatDialogRef<EditDocumentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, 
        private formBuilder: FormBuilder,
        private genericService: GenericService){}

  docInfo : any ={};      
  statuDocumentArray : any =[]
  formEditDoc: FormGroup | any;
  info :any
  ngOnInit(): void {
 
  this.getDictionnaire();  
  this.docInfo =this.data.documentInfo;
  this.info =this.docInfo.description;

  this.initEditForm( this.docInfo);
  }

  getDictionnaire() {
    // get statut documents
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C71").idCategorie).subscribe(data => {
      this.statuDocumentArray = data;
    })
  }

  initEditForm(docInfo : any){
 
    this.formEditDoc = this.formBuilder.group({
      typeDoc: ['', [Validators.required, Validators.maxLength(15)]],
      statutDoc: [ { value:docInfo.statutDocument.idParam, disabled: false }, [Validators.required, Validators.maxLength(15)]],
      description: [{ value:docInfo.description, disabled: false }, [Validators.required]],     
    });

  }

  submitEdit(){
    let body:any={}
    body.statutDocument={ "idParam": this.formEditDoc.get("statutDoc").value}
    body.description=this.formEditDoc.get("description").value    
    this.dialogRef.close({ data: body });
   
  }
 
}
