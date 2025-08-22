import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { keyValue } from 'src/app/core/models/keyValue';
import { produitConsultation } from '../../model-produit';
import { ParamRisqueProduit } from 'src/app/core/models/param_risque_produit';
import { paramDetailProduitNumerique,paramDetailProduitString } from '../../param-risque-detail-produit';
import { GenericService } from 'src/app/core/services/generic.service';


@Component({
  selector: 'app-edit-parm-risque-dialog',
  templateUrl: './edit-parm-risque-dialog.component.html',
  styleUrls: ['./edit-parm-risque-dialog.component.scss']
})
export class EditParmRisqueDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditParmRisqueDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any, private formBuilderAuth: FormBuilder, private router: Router, private genericService: GenericService) { }
  
  formCreationDetailParam: FormGroup|any;
  selectedType: any;
  champObligatoire:any|undefined;
  possibilite: any;
  consultations: produitConsultation[] = this.data.idParam.typeChamp?.idParam==35 ? paramDetailProduitNumerique:paramDetailProduitString;
  elementkeySelectionne : any;
  workflowstatus : keyValue|undefined;
  paramRisqueProduitJson : ParamRisqueProduit|undefined;
  

  ngOnInit(): void {
    // if(this.data.typeChamp?.idParam==35){
    //   this.consultations=paramDetailProduitNumerique
    // }

    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C13").idCategorie).subscribe({
      next: (data: any) => {
        this.possibilite = data;
      },
      error: (error) => {console.log(error);}
    });

    this.formCreationDetailParam = this.formBuilderAuth.group({
      paramRisque: [this.data.idParam, [Validators.required]],
      valeurMin: [''],
      valeurMax: [''],
      defaultValue: [''],
      pourcentage: [''],
      workflows: [[]],
      mondatory: [[]],
    });
  }



  onChangeEventworkflow(event : any){
    this.selectedType=event.value
    this.champObligatoire=[];
    if(this.selectedType){
        for(let i=0;i<this.selectedType.length ;i++)
        {
          this.elementkeySelectionne = this.selectedType[i];
          this.workflowstatus= this.possibilite.find((status: any)=> status.idParam==this.elementkeySelectionne.idParam)
          if(this.workflowstatus) this.champObligatoire.push(this.workflowstatus)
        }
      }
  }

  submit(){
    this.paramRisqueProduitJson=this.formCreationDetailParam.value
    this.dialogRef.close(this.paramRisqueProduitJson);
  }


}
