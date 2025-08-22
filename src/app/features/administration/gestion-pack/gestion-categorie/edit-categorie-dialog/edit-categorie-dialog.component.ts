import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericService } from 'src/app/core/services/generic.service';
import { Inject } from '@angular/core';
import { PackService } from '../../../../../core/services/pack.service'

@Component({
  selector: 'app-edit-categorie-dialog',
  templateUrl: './edit-categorie-dialog.component.html',
  styleUrls: ['./edit-categorie-dialog.component.scss']
})
export class EditCategorieDialogComponent implements OnInit {

  FormCreationCategory: FormGroup | any;


  idGarantie: any
  catagorySelected: any
  tabParameters: any[] = []
  categorieValeur: any[] = []
  typeValeur: any[] = []
  sousCategorieValeur: any[] = []
  defaultRole: any
  alertSuccess = false
  formReady = false
  constructor(private genericService:GenericService,private packService: PackService, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditCategorieDialogComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {

    this.getAllCategories();
    this.getTypeValeur()

  }
  initFormCreationPGF() {
    this.FormCreationCategory = this.formBuilder.group({
      categorieValeur: ["", [Validators.required]],
      souscategories: ["", [Validators.required]],
      typeValeur: ['', [Validators.required]],
      valeur: ['', [Validators.required,Validators.pattern("^[-]?[0-9]\.*$")]],

    });
    if (this.data.category.idGarantie != null) {
      this.FormCreationCategory.addControl('idGarantie', new FormControl({ value: this.data.category.idGarantie, disabled: true }, Validators.required));

    }
  }
  initcategory() {
    this.FormCreationCategory.get('categorieValeur').setValue(this.data.category.categorieValeur.idCategorie);
    this.getAllSousCategories(this.data.category.categorieValeur.idCategorie)


    // this.FormCreationCategory.get('souscategories').setValue(this.categorieValeur[this.categorieValeur.findIndex(categorievaleur => categorievaleur.id === this.data.category.categorieValeur.id)]);
    this.FormCreationCategory.get('typeValeur').setValue(this.data.category.typeValeur.idParam);
   
    this.FormCreationCategory.get('valeur').setValue(this.data.category.valeur);

  }
  submitCreationPGF(formDirective: any) {



    if (this.FormCreationCategory.valid) {
      let tempData
  
      if(this.data.type=="edit"){
  
        if (this.data.category.hasOwnProperty('souscategories')) {

          tempData = {
            "categorieValeur": this.categorieValeur[this.categorieValeur.findIndex(categorievaleur => categorievaleur.idCategorie === this.FormCreationCategory.get('categorieValeur').value)],
            "sousCategorieList": this.sousCategorieValeur[this.sousCategorieValeur.findIndex(sousCategory => sousCategory.idSousCategorie === this.FormCreationCategory.get('souscategories').value)],
            "typeValeur": this.typeValeur[this.typeValeur.findIndex(typeValeur => typeValeur.idParam === this.FormCreationCategory.get('typeValeur').value)],
            "valeur": this.FormCreationCategory.get('valeur').value,
            "idcaracteristique": this.data.category.idcaracteristique,
            "idParamSCPackComplet": this.data.category.sousCategorieList.idParamSCPackComplet,
  
  
          }
        } else {
          tempData = {
            "categorieValeur": this.categorieValeur[this.categorieValeur.findIndex(categorievaleur => categorievaleur.idCategorie === this.FormCreationCategory.get('categorieValeur').value)],
            "sousCategorieList": this.sousCategorieValeur[this.sousCategorieValeur.findIndex(sousCategory => sousCategory.idSousCategorie === this.FormCreationCategory.get('souscategories').value)],
            "typeValeur": this.typeValeur[this.typeValeur.findIndex(typeValeur => typeValeur.idParam === this.FormCreationCategory.get('typeValeur').value)],
            "valeur": this.FormCreationCategory.get('valeur').value,
            "idcaracteristique": this.data.category.idcaracteristique,
            "idParamPackComplet": this.data.category.idParamPackComplet,
            "idParamSCPackComplet": this.data.category.sousCategorieList.idParamSCPackComplet,
  
          }
        }
      }else {
        tempData = {
          "categorieValeur": this.categorieValeur[this.categorieValeur.findIndex(categorievaleur => categorievaleur.idCategorie === this.FormCreationCategory.get('categorieValeur').value)],
          "souscategories": this.sousCategorieValeur[this.sousCategorieValeur.findIndex(sousCategory => sousCategory.idSousCategorie === this.FormCreationCategory.get('souscategories').value)],
          "typeValeur": this.typeValeur[this.typeValeur.findIndex(typeValeur => typeValeur.idParam === this.FormCreationCategory.get('typeValeur').value)],
          "valeur": this.FormCreationCategory.get('valeur').value,
          "idcaracteristique": this.data.category.idcaracteristique,


        }

    
      }

      if (this.data.category.idGarantie != null)
        Object.assign(tempData, { idGarantie: this.data.category.idGarantie });

      this.alertSuccess = true


      formDirective.resetForm();
      this.FormCreationCategory.reset();


      this.tabParameters.push(tempData)
      this.dialogRef.close({ data: this.tabParameters })
    }



  }
  getAllCategories() {

    this.packService.getAllCategory().subscribe({
      next: (data: any) => {
        this.categorieValeur = data

        this.initFormCreationPGF()
        this.initcategory()
       
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getAllSousCategories(Category: any) {
  

    this.packService.getSousCategory(Category).subscribe({
      next: (data: any) => {
        this.sousCategorieValeur = data
  
        
        this.formReady = true
        if (this.data.category.hasOwnProperty('souscategories')){
          this.FormCreationCategory.get('souscategories').setValue(this.data.category.souscategories.idSousCategorie);
        }
      else{
       this.FormCreationCategory.get('souscategories').setValue(this.data.category.sousCategorieList.idSousCategorie);
 
      }
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getTypeValeur() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C17").idCategorie).subscribe({
      next: (data: any) => {
        this.typeValeur = data

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
}

