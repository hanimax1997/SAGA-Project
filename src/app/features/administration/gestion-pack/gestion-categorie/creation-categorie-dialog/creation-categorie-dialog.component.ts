import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PackService } from '../../../../../core/services/pack.service'
import { GenericService } from 'src/app/core/services/generic.service';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-creation-categorie-dialog',
  templateUrl: './creation-categorie-dialog.component.html',
  styleUrls: ['./creation-categorie-dialog.component.scss']
})
export class CreationCategorieDialogComponent implements OnInit {
  FormCreationCategory: FormGroup | any;


  idGarantie: any
  categoryOf: any
  tabParameters: any[] = []
  categorieValeur: any[] = []
  sousCategorieValeur: any[] = []
  typeValeur: any[] = []
  alertSuccess = false
  dangerClosing=false
  constructor(private genericService:GenericService,private packService:PackService,@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, public dialogRef: MatDialogRef<CreationCategorieDialogComponent>) { 
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    
    this.categoryOf = this.data.categoryOf
    this.initFormCreationPGF()
    this.getAllCategories()
    this.getTypeValeur()
  }
  initFormCreationPGF() {
    this.FormCreationCategory = this.formBuilder.group({
      categorieValeur: ['', [Validators.required]],
      souscategories: ['', [Validators.required]],
      typeValeur: ['', [Validators.required]],
      valeur: ['', [Validators.required,Validators.pattern("^[-]?[0-9]\.*$")]],

    });
    if (this.categoryOf != "pack") {
      this.FormCreationCategory.addControl('idGarantie', new FormControl({ value: this.data.idGarantie, disabled: true }, Validators.required));

    }
  }
  submitCreationPGF(formDirective: any) {
    if (this.FormCreationCategory.valid) {
      let tempData
      if(this.data?.type!="edit"){
        tempData = {
          "categorieValeur": this.FormCreationCategory.get("categorieValeur").value,
          "souscategories": this.FormCreationCategory.get("souscategories").value,
          "typeValeur": this.FormCreationCategory.get("typeValeur").value,
          "valeur": this.FormCreationCategory.get("valeur").value,
        }
      }else{
        tempData = {
          "categorieValeur": this.FormCreationCategory.get("categorieValeur").value,
          "sousCategorieList": this.FormCreationCategory.get("souscategories").value,
          "typeValeur": this.FormCreationCategory.get("typeValeur").value,
          "valeur": this.FormCreationCategory.get("valeur").value,
        }
      }


      this.alertSuccess = true


      formDirective.resetForm();
      this.FormCreationCategory.reset();
    
      if (this.categoryOf != "pack") {
        this.FormCreationCategory.get("idGarantie").setValue(this.data.idGarantie);
  
      }
      this.tabParameters.push(tempData)
    }



  }
  saveTabCategory() {
    this.dialogRef.close({ data: this.tabParameters })


  }
  getAllCategories() {
   
    this.packService.getAllCategory().subscribe({
      next: (data: any) => {
        this.categorieValeur=data

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getAllSousCategories(Category:any) {
   
    this.packService.getSousCategory(Category.idCategorie).subscribe({
      next: (data: any) => {
        this.sousCategorieValeur=data

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getTypeValeur(){

    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C17").idCategorie).subscribe({
      next: (data: any) => {
        this.typeValeur=data

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
}
