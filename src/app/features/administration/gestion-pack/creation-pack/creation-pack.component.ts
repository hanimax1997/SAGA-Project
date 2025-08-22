import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { trigger, style, animate, transition } from '@angular/animations';
//services 
import { GarantiesService } from '../../../../core/services/garanties.service'
import { SousGarantiesService } from '../../../../core/services/sous-garanties.service'
import { GenericService } from 'src/app/core/services/generic.service';
//dialog
import { CreationCategorieDialogComponent } from '../gestion-categorie/creation-categorie-dialog/creation-categorie-dialog.component';
import { EditCategorieDialogComponent } from '../gestion-categorie/edit-categorie-dialog/edit-categorie-dialog.component';
import { CreationGarantieDialogComponent } from '../../gestion-garanties/creation-garantie-dialog/creation-garantie-dialog.component';
import { CreationSousGarantiesDialogComponent } from '../../gestion-sous-garanties/creation-sous-garanties-dialog/creation-sous-garanties-dialog.component';
import { CreationPackGarantieComponent } from '../creation-pack-garantie/creation-pack-garantie.component';
import { SupressionPackGarantieComponent } from '../supression-pack-garantie/supression-pack-garantie.component';
import { GestionCategorieComponent } from '../gestion-categorie/gestion-categorie.component';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { PackService } from '../../../../core/services/pack.service'
import { Router } from '@angular/router';
import * as moment from 'moment';

export interface Garanties {
  id: string;
  libelle: string;
}
const ELEMENT_DATA = [
  { categorieValeur: "plafond", typeValeur: 'pourcentage', valeur: 1000 },
  { categorieValeur: "plafond", typeValeur: 'pourcentage', valeur: 2000 },
];
@Component({
  selector: 'app-creation-pack',
  templateUrl: './creation-pack.component.html',
  styleUrls: ['./creation-pack.component.scss'],
  animations: [

    trigger('enterAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)',
        }),
        animate(400),
      ]),
    ]),
  ]
})

export class CreationPackComponent implements OnInit {
  @ViewChild('stepper') private stepper: MatStepper;
  @ViewChild(GestionCategorieComponent, { static: false }) childC: GestionCategorieComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('paginatorPackGarantie') paginatorPackGarantie: MatPaginator;
  @ViewChild('paginatorGarantieCategory') paginatorGarantieCategory: MatPaginator;
  @ViewChild('paginatorSousGarantiePack') paginatorSousGarantiePack: MatPaginator;
  @ViewChild('paginatorSousGarantieCategory') paginatorSousGarantieCategory: MatPaginator;
  bigPack: any
  creationPackStepOne: FormGroup | any;
  creationPackStepTwo: FormGroup | any;
  creationPackStepThree: FormGroup | any;
  garanties: Garanties[] = []
  sousGaranties: any[] = []
  durationInSeconds = 5;
  garantiePack: any[] = []
  packCategory: any[] = []
  sousGarantiePack: any[] = []
  sousGarantiePackTEST: any[] = []
  garantiesTab: any[] = []
  sousgarantiesTab: any[] = []
  categorieValeur: any[] = []
  sousCategorieValeur: any[] = []
  typeValeur: any[] = []

  dataGarantiePack = new MatTableDataSource<any>();
  dataSousGarantiePack = new MatTableDataSource<any>();
  displayedColumnsGarantiePack: string[] = ['idGarantie', 'description', 'obligatoire', 'action'];
  lengthColumns = this.displayedColumnsGarantiePack.length
  garantieExist: boolean = false;
  sousGarantieExist: boolean = false
  garantiePackCategory: any[] = [];
  tabGarantieCategories: any[] = [];
  tabSousGarantieCategories: any = [];
  tempCategory: any = [];
  idGarantie: Number;
  idSousGarantie: Number
  garantieWithSousGarantie: boolean = false;
  constructor(private genericService: GenericService, private router: Router, private packService: PackService, private _snackBar: MatSnackBar, private sousGarantiesService: SousGarantiesService, private garantiesService: GarantiesService, private dialog: MatDialog, private formBuilder: FormBuilder,) { }
  filteredGaranties: any
  filteredSousGaranties: any
  filteredGarantiesOfPack: any
  // tab category of pack
  packCategoryTab: any[] = [];
  dataSourcePackCategory = new MatTableDataSource<any>();
  displayedColumnsPackCategory: string[] = ['categorieValeur', 'souscategories', 'typeValeur', 'valeur', "action"];
  lengthColumnsPackCategory = this.displayedColumnsPackCategory.length
  //
  displayedColumnsSousGarantieCategory: string[] = ['categorieValeur', 'souscategories', 'typeValeur', 'valeur', "action"];
  displayedColumnsGarantieCategory: string[] = ['categorieValeur', 'souscategories', 'typeValeur', 'valeur', "action"];
  dataSourceGarantieCategory = new MatTableDataSource<any>();
  dataSourceSousGarantieCategory = new MatTableDataSource()
  lengthColumnsGarantieCategory = this.displayedColumnsGarantieCategory.length
  stepGarantieCategory = true
  stepSousGarantieCategory = true
  LoaderSave=false
  idPackCaract = 1
  idGarantieCaract = 1
  idSousGarantieCaract = 1
  CategoryPackForm: FormGroup;
  CategoryGarantieForm: FormGroup;
  successCreation = false
  descriptionPack = ""
  minDate = new Date()
  // public filteredList1 = this.variables.slice();
  ngOnInit(): void {
    // init form category 
    this.CategoryPackForm = this.formBuilder.group({
      VORows: this.formBuilder.array([])
    });
    this.CategoryGarantieForm = this.formBuilder.group({
      VORows: this.formBuilder.array([])
    });

    this.initFormCreationStepOne()
    this.initFormCreationStepTwo()
    this.initFormCreationStepThree()
    this.getAllGaranties();
    this.getAllCategories();
    this.getTypeValeur()


  }

  initFormCreationStepOne() {
    this.creationPackStepOne = this.formBuilder.group({
      description: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: [''],
    });
  }
  initFormCreationStepTwo() {
    this.creationPackStepTwo = this.formBuilder.group({
      garantie: ['',],
      garantiePack: ['',],
      sousGarantie: [''],
      tabPGF: ['',],

    });
  }
  initFormCreationStepThree() {
    this.creationPackStepThree = this.formBuilder.group({
      sousGarantie: [''],
    });
  }
  initTabPackGarantie(data: any) {
    this.dataGarantiePack = new MatTableDataSource(data);
    this.dataGarantiePack.paginator = this.paginatorPackGarantie;
    // this.filteredGarantiesOfPack = this.garantiesTab.slice()

  }

  initTabPackSousGarantie(data: any) {
    this.dataSousGarantiePack = new MatTableDataSource(data);
    this.dataSousGarantiePack.paginator = this.paginatorSousGarantiePack;
    // this.filteredGarantiesOfPack = this.garantiesTab.slice()

  }

  initTabSousGarantieCategory(idSousGarantie: any) {
    this.idSousGarantie = idSousGarantie
    this.tabSousGarantieCategories = []

    this.sousGarantiePack.filter((tab: any) => {

      if (tab.idSousGarantie == idSousGarantie) {
        tab["categorieList"].filter((category: any) => {

          this.tabSousGarantieCategories.push({
            "typeValeur": {
              "idParam": category.idtypevaleur,
              "value": this.typeValeur.filter(typevaleur => { return typevaleur.idParam == category.idtypevaleur })[0].description,
            },
            "categorieValeur": {
              "idCategorie": category.idcategorie,
              "value": this.categorieValeur.filter(categorievaleur => { return categorievaleur.idCategorie == category.idcategorie })[0].description,
            },
            "souscategories": {
              "idSousCategorie": category.souscategories[0].idsouscategorie,
              "value": this.sousCategorieValeur.filter(sousCategorieValeur => { return sousCategorieValeur.idSousCategorie == category.souscategories[0].idsouscategorie })[0].description,
            },
            "valeur": category.valeur,
            "idcaracteristique": category.idcaracteristique,
            "idSousGarantie": tab.idSousGarantie,
          })
        })

      }
    }
    )
    this.dataSourceSousGarantieCategory = new MatTableDataSource(this.tabSousGarantieCategories);
    this.dataSourceSousGarantieCategory.paginator = this.paginatorSousGarantieCategory;
    this.stepSousGarantieCategory = false


  }
  initGarantieCategoryTab(idGarantie: any) {
    this.tabGarantieCategories = []
    this.idGarantie = idGarantie

    this.garantiePack.filter((tab: any) => {

      if (tab.idGarantie == idGarantie) {
        tab["categorieList"].filter((category: any) => {

          this.tabGarantieCategories.push({
            "typeValeur": {
              "idParam": category.idtypevaleur,
              "value": this.typeValeur.filter(typevaleur => { return typevaleur.idParam == category.idtypevaleur })[0].description,
            },
            "categorieValeur": {
              "idCategorie": category.idcategorie,
              "value": this.categorieValeur.filter(categorievaleur => { return categorievaleur.idCategorie == category.idcategorie })[0].description,
            },
            "souscategories": {
              "idSousCategorie": category.souscategories[0].idsouscategorie,
              "value": this.sousCategorieValeur.filter(sousCategorieValeur => { return sousCategorieValeur.idSousCategorie == category.souscategories[0].idsouscategorie })[0].description,
            },
            "valeur": category.valeur,
            "idcaracteristique": category.idcaracteristique,
            "idGarantie": tab.idGarantie,
          })
        })

      }
    }
    )
    this.dataSourceGarantieCategory = new MatTableDataSource(this.tabGarantieCategories);
    this.dataSourceGarantieCategory.paginator = this.paginatorGarantieCategory;
    this.stepGarantieCategory = false



    // this.dataSourceGarantieCategory = new MatTableDataSource(this.tabGarantieCategories);
    // this.stepGarantieCategory = false

  }
  // to delete
  // initSousGarantieCategoryTab(idSousGarantie: any) {
  //   let catgoriesOfSousGarantie = this.tabSousGarantieCategories.filter((obj: any) => {
  //     return (obj.idSousGarantie == idSousGarantie)
  //   })
  //   this.dataSourceSousGarantieCategory = new MatTableDataSource(catgoriesOfSousGarantie);
  //   this.stepSousGarantieCategory = false
  // }
  // // end delete
  initategoryPackTab() {

    this.dataSourcePackCategory = new MatTableDataSource(this.packCategoryTab);
    this.dataSourcePackCategory.paginator = this.paginator;

  }

  submitPack() {
    this.LoaderSave = true
    if (this.creationPackStepOne.valid) {
      this.creationPackStepOne.get("dateDebut").setValue(moment(this.creationPackStepOne.get("dateDebut").value).format('YYYY-MM-DD'))

      this.descriptionPack = this.creationPackStepOne.get("description").value
      this.bigPack = {
        "description": this.creationPackStepOne.get("description").value,
        "dateDebut": this.creationPackStepOne.get("dateDebut").value,
        "dateFin": this.creationPackStepOne.get("dateFin").value,
        "categorieList": this.packCategory,
        "garantie": this.garantiePack

      }
      this.packService.addPack(this.bigPack).subscribe({
        next: (data: any) => {
          if (data == "succes") {
            this.successCreation = true
            this.LoaderSave = false
          }
        },
        error: (error) => {
          this.LoaderSave = false
          console.log(error);

        }
      });
    }
  }
  openCreateGarantie() {
    let dialogRef = this.dialog.open(CreationGarantieDialogComponent, {
      width: '60%',

    });
    dialogRef.afterClosed().subscribe((result: any) => {


      this.getAllGaranties()



    });

  }
  openCreateSousGarantie() {
    let dialogRef = this.dialog.open(CreationSousGarantiesDialogComponent, {
      width: '60%',
      data: {
        idGarantie: this.idGarantie
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {


      this.getSousGarantieByGarantie(this.idGarantie)



    });

  }
  /******* add delete  garantie  ******/
  addGarantiePack(value: any) {

    this.garantieExist = false
    //check if garantie a déja été ajouter 
    this.garantiesTab.filter(garantie => {

      if (value.id == garantie.id) {
        this.garantieExist = true
        setTimeout(() => {
          this.garantieExist = false

        }, 10000);
      }

    });
    if (!this.garantieExist) {
      let dialogRef = this.dialog.open(CreationPackGarantieComponent, {
        width: '40%',
        data: {
          type: "garantie",
          id: value.id,
          description: value.libelle,
        }

      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result.data != undefined) {
          this.garantiesTab.push(result.data)

          let tempData = {
            "idGarantie": result.data.id,
            "obligatoire": result.data.obligatoire,
            "dateDebut": null,
            "dateFin": null,
            "categorieList": [],
            "sousGarantieList": [],
          }
          this.garantiePack.push(tempData)
          this.initTabPackGarantie(this.garantiesTab)
        }

      });
    }
  }
  editGarantiePack(id: any, description: string) {


    let dialogRef = this.dialog.open(CreationPackGarantieComponent, {
      width: '60%',
      data: {
        type: "garantie",
        id: id,
        description: description,

      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        //edit garanties

        this.garantiesTab[this.garantiesTab.findIndex(garantie => garantie.id === id)] = {
          "id": result.data.id,
          "description": result.data.description,
          "obligatoire": result.data.obligatoire
        }
        //edit garantiesPack 
        this.garantiePack[this.garantiePack.findIndex(garantie => garantie.idGarantie === id)] = {
          "idGarantie": result.data.id,
          "obligatoire": result.data.obligatoire,
          "dateDebut": null,
          "dateFin": null,
          "categorieList": [],
          "sousGarantieList": [],
        }

        this.initTabPackGarantie(this.garantiesTab)

      }

    });

  }
  editSousGarantiePack(idSousGarantie: any, description: string, idGarantie: any) {

    let dialogRef = this.dialog.open(CreationPackGarantieComponent, {
      width: '60%',
      data: {
        type: "garantie",
        id: idSousGarantie,
        description: description,

      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        //edit sousgarantiesTab 
        this.sousgarantiesTab[this.sousgarantiesTab.findIndex(sousgarantie => sousgarantie.id === idSousGarantie)].obligatoire = result.data.obligatoire

        //edit sousGarantiePack 
        this.sousGarantiePack[this.sousGarantiePack.findIndex(sousgarantie => sousgarantie.idSousGarantie === idSousGarantie)].obligatoire = result.data.obligatoire
        //edit garantiePack 
        this.garantiePack[this.garantiePack.findIndex((garantie) => garantie.idGarantie == idGarantie)]["sousGarantieList"].obligatoire = result.data.obligatoire

        this.initTabPackSousGarantie(this.sousgarantiesTab)


      }

    });

  }
  deleteGarantie(id: any, desc: any, categoryOf: string) {

    let dialogRef = this.dialog.open(SupressionPackGarantieComponent, {
      width: '30%',
      data: {
        desc: desc,
        categoryOf: categoryOf
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (categoryOf == "garantie") {
          this.garantiesTab.splice(this.garantiesTab.findIndex(garantie => garantie.id === id), 1)
          //delete from garantie Pack
          this.garantiePack.splice(this.garantiePack.findIndex(garantie => garantie.idGarantie === id), 1)



          this.initTabPackGarantie(this.garantiesTab)
        } else {
          this.sousgarantiesTab.splice(this.sousgarantiesTab.findIndex(Sousgarantie => Sousgarantie.id === id), 1)
          this.sousGarantiePack.splice(this.sousGarantiePack.findIndex(Sousgarantie => Sousgarantie.idSousGarantie === id), 1)
          // this.garantiePack.splice(this.garantiePack.findIndex(garantie => garantie.idGarantie === id), 1)
          this.initTabPackSousGarantie(this.sousgarantiesTab)

        }


      }

    });
  }
  deleteSousGarantie(id: any, desc: any, categoryOf: string, idGarantie: any) {

    let dialogRef = this.dialog.open(SupressionPackGarantieComponent, {
      width: '30%',
      data: {
        desc: desc,
        categoryOf: categoryOf
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {

        this.sousgarantiesTab.splice(this.sousgarantiesTab.findIndex(Sousgarantie => Sousgarantie.id === id), 1)
        this.sousGarantiePack.splice(this.sousGarantiePack.findIndex(Sousgarantie => Sousgarantie.idSousGarantie === id), 1)

        let indexGarantie = this.garantiePack.findIndex(garantie => garantie.idGarantie === idGarantie)
        let SousGarantie = this.garantiePack[indexGarantie]["sousGarantieList"]
        let indexSousGarantie = SousGarantie.findIndex((sousgarantie: any) => sousgarantie.idSousGarantie === id)
        this.garantiePack[indexGarantie]["sousGarantieList"].splice(indexSousGarantie, 1)
        this.initTabPackSousGarantie(this.sousgarantiesTab)




      }

    });
  }
  /******* add delete sous garantie  ******/

  addSousGarantiePack(value: any) {
    this.sousGarantieExist = false

    //check if sous garantie a déja été ajouter 
    this.sousgarantiesTab.filter(sousgarantie => {

      if (value.id == sousgarantie.id) {
        this.sousGarantieExist = true
        setTimeout(() => {
          this.sousGarantieExist = false

        }, 10000);
      }
    });
    if (!this.sousGarantieExist) {

      let dialogRef = this.dialog.open(CreationPackGarantieComponent, {
        width: '30%',
        data: {
          type: "sousGarantie",
          id: value.id,
          description: value.libelle
        }

      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result.data != undefined) {

          Object.assign(result.data, { idGarantie: value.idGarantie });
          this.sousgarantiesTab.push(result.data)


          let tempSousGarantie = {
            "idSousGarantie": result.data.id,
            "idGarantie": result.data.idGarantie,
            "obligatoire": result.data.obligatoire,
            "dateDebut": null,
            "dateFin": null,
            "categorieList": [],
          }

          this.sousGarantiePack.push(tempSousGarantie)

          this.addSousGarantieToGarantie(tempSousGarantie)
          this.initTabPackSousGarantie(this.sousgarantiesTab.filter((obj: any) => {
            return obj.idGarantie == value.idGarantie
          }))
        }

      });
    }
  }

  addCategorieToGarantie() {
    let dialogRef = this.dialog.open(CreationCategorieDialogComponent, {
      width: '60%',
      data: {
        categoryOf: "garantie",
        type: "ajout",
        idGarantie: this.idGarantie
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        result.data.filter((obj: any) => {
          //add category to garantie

          this.sousCategorieValeur.push(obj.souscategories)
          this.garantiePack.filter(
            (objGarantie: any) => {
              if (objGarantie.idGarantie == this.idGarantie) {
                let length = objGarantie["categorieList"].length + 1
                let tempGarantieCategory = {
                  "idcaracteristique": length,
                  "idtypevaleur": obj.typeValeur.idParam,
                  "idcategorie": obj.categorieValeur.idCategorie,
                  "souscategories":
                    [
                      {
                        "idsouscategorie": obj.souscategories.idSousCategorie,
                        "idtypevaleur": obj.typeValeur.idParam,
                        "valeur": obj.valeur
                      }
                    ],
                  "valeur": obj.valeur,

                  "dateDebut": null,
                  "dateFin": null,
                }
                objGarantie["categorieList"].push(tempGarantieCategory)


              }

            }
          )

          this.initGarantieCategoryTab(this.idGarantie)



        })



      }

    });
  }
  addCategorieToPack() {
    let dialogRef = this.dialog.open(CreationCategorieDialogComponent, {
      width: '60%',
      data: {
        categoryOf: "pack",
        type: "ajout",
        idGarantie: null
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        result.data.filter((obj: any) => {
          // add garantie to pack

          Object.assign(obj, { idcaracteristique: this.idPackCaract });
          this.packCategoryTab.push(obj)
          this.initategoryPackTab();


          let tempPackCategory = {
            "idcaracteristique": this.idPackCaract,
            "idtypevaleur": obj.typeValeur.idParam,
            "idcategorie": obj.categorieValeur.idCategorie,
            "souscategories": [
              {
                "idsouscategorie": obj.souscategories.idSousCategorie,
                "idtypevaleur": obj.typeValeur.idParam,
                "valeur": obj.valeur
              }
            ],
            "valeur": obj.valeur,
            "dateDebut": null,
            "dateFin": null,
          }


          this.packCategory.push(tempPackCategory)

          this.idPackCaract++




        })



      }

    });
  }
  addSousGarantieCategorie() {

    let dialogRef = this.dialog.open(CreationCategorieDialogComponent, {
      width: '60%',
      data: {
        categoryOf: 'sousGarantie',
        type: "ajout",
        idGarantie: this.idSousGarantie,
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      let lengthTab = 0
      if (result.data != undefined) {

        result.data.filter((obj: any) => {
          this.sousCategorieValeur.push(obj.souscategories)

          this.sousGarantiePack.filter(
            (objSousGarantie: any) => {
              if (objSousGarantie.idSousGarantie == this.idSousGarantie) {
                let length = objSousGarantie["categorieList"].length + 1

                let tempSousGarantieCategory = {
                  "idcaracteristique": length,
                  "idtypevaleur": obj.typeValeur.idParam,
                  "idcategorie": obj.categorieValeur.idCategorie,
                  "souscategories":
                    [
                      {
                        "idsouscategorie": obj.souscategories.idSousCategorie,
                        "idtypevaleur": obj.typeValeur.idParam,
                        "valeur": obj.valeur
                      }
                    ],
                  "valeur": obj.valeur,

                  "dateDebut": null,
                  "dateFin": null,
                }
                objSousGarantie["categorieList"].push(tempSousGarantieCategory)


              }

            }
          )
        })
        this.initTabSousGarantieCategory(this.idSousGarantie)

      }

    });
  }
  addSousGarantieToGarantie(sousGarantie: any) {
    this.garantiePack.filter((obj: any) => {

      if (obj.idGarantie == sousGarantie.idGarantie) {
        obj["sousGarantieList"].push(sousGarantie)
      }



    })

  }

  getAllGaranties() {
    this.garanties = []
    this.garantiesService.getAllGaranties().subscribe({
      next: (data: any) => {

        data.filter((obj: any) => {
          let tempGarantie = {
            "id": obj.idGarantie,
            "libelle": obj.description,
          }

          this.garanties.push(tempGarantie)
        })
        this.filteredGaranties = this.garanties.slice()
        

      },
      error: (error) => {

        console.log(error);

      }
    });


    this.filteredGaranties = this.garanties.slice()
  }

  getAllCategories() {

    this.packService.getAllCategory().subscribe({
      next: (data: any) => {
        this.categorieValeur = data

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getAllSousCategories(CategoryId: any) {


    this.packService.getSousCategory(CategoryId).subscribe({
      next: (data: any) => {
        this.sousCategorieValeur = data

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
  getSousGarantieByGarantie(idGarantie: any) {
    this.idGarantie = idGarantie
    this.sousGaranties = []
    this.sousGarantiesService.getSousGarantiesByGarantie(idGarantie).subscribe({
      next: (data: any) => {
        if (data.length == 0)
          this.garantieWithSousGarantie = true
        else {
          this.garantieWithSousGarantie = false
          data.filter((obj: any) => {
            let tempSousGarantie = {
              "id": obj.idSousGarantie,
              "idGarantie": idGarantie,
              "libelle": obj.description,
            }


            this.sousGaranties.push(tempSousGarantie)

          })
          this.filteredSousGaranties = this.sousGaranties.slice()
        }

      },
      error: (error) => {

        console.log(error);

      }
    });

    // this.sousGarantiesService.getSousGarantiesByGarantie(idGarantie).filter((obj: any) => {
    //   let tempSousGarantie = {
    //     "id": obj.idSousGarantie,
    //     "idGarantie": obj.idGarantie,
    //     "libelle": obj.description,
    //   }

    //   this.sousGaranties.push(tempSousGarantie)
    // });
    this.filteredSousGaranties = this.sousGaranties.slice()
  }
  openCreateCategoryDialog() {
    let dialogRef = this.dialog.open(CreationCategorieDialogComponent, {
      width: '60%',
      data: {
        categoryOf: 'pack',
        idGarantie: 0
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        this.packCategoryTab.push(result.data)
        this.dataSourcePackCategory = new MatTableDataSource(this.packCategoryTab)
      }

    });
  }
  goToSousGarantie(idGarantie: any) {


    // if (this.sousgarantiesTab.length == 0)
    //   this.openSnackBar("Cette garantie ne contient pas de sous garanties", "x")
    this.stepSousGarantieCategory = true

    this.initTabPackSousGarantie(this.sousgarantiesTab.filter((obj: any) => { return obj.idGarantie == idGarantie }))
    this.stepper.next();
    this.idGarantie = idGarantie
    this.sousGaranties = []
    this.getSousGarantieByGarantie(idGarantie)

  }

  EditPackCategory(caract: any) {
    let dialogRef = this.dialog.open(EditCategorieDialogComponent, {
      width: '60%',
      data: {
        category: caract,
        type: "create"
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        result.data.filter((obj: any) => {

          // edit CATEGORY to pack
          this.packCategoryTab[this.packCategoryTab.findIndex(category => category.idcaracteristique === obj.idcaracteristique)] = obj

          this.packCategory[this.packCategory.findIndex(category => category.idcaracteristique === obj.idcaracteristique)] = {
            "idcaracteristique": obj.idcaracteristique,
            "idtypevaleur": obj.typeValeur.idParam,
            "idcategorie": obj.categorieValeur.idCategorie,
            "souscategories":
            [
              {
                "idsouscategorie": obj.souscategories.idSousCategorie,
                "idtypevaleur": obj.typeValeur.idParam,
                "valeur": obj.valeur
              }
            ],
            "dateDebut": null,
            "dateFin": null,
            "valeur": obj.valeur
          }
          this.initategoryPackTab();

        })
      }

    });
  }
  EditGarantieCategory(category: any) {

    let dialogRef = this.dialog.open(EditCategorieDialogComponent, {
      width: '60%',
      data: {
        category: category,
        type: "create"
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        result.data.filter((obj: any) => {
          this.sousCategorieValeur.push(obj.souscategories)
          this.garantiePack.filter(
            (objGarantie: any) => {
              if (objGarantie.idGarantie == category.idGarantie) {
                let index = objGarantie["categorieList"].findIndex((category: any) => category.idcaracteristique === obj.idcaracteristique)
                objGarantie["categorieList"][index] = {
                  "idcaracteristique": obj.idcaracteristique,
                  "idtypevaleur": obj.typeValeur.idParam,
                  "idcategorie": obj.categorieValeur.idCategorie,
                  "souscategories":
                    [
                      {
                        "idsouscategorie": obj.souscategories.idSousCategorie,
                        "idtypevaleur": obj.typeValeur.idParam,
                        "valeur": obj.valeur
                      }
                    ],
                  "valeur": obj.valeur,

                  "dateDebut": null,
                  "dateFin": null,

                }
              }
            }
          )


        })
        this.initGarantieCategoryTab(category.idGarantie)
      }

    });
  }
  EditSousGarantieCategory(caract: any) {
    let dialogRef = this.dialog.open(EditCategorieDialogComponent, {
      width: '60%',
      data: {
        category: caract,
        type: "create"
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        result.data.filter((obj: any) => {
          this.sousCategorieValeur.push(obj.souscategories)

          this.sousGarantiePack.filter(
            (objSousGarantie: any) => {


              if (objSousGarantie.idSousGarantie == caract.idSousGarantie) {
                let index = objSousGarantie["categorieList"].findIndex((category: any) => category.idcaracteristique === caract.idcaracteristique)

                objSousGarantie["categorieList"][index] = {
                  "idcaracteristique": obj.idcaracteristique,
                  "idtypevaleur": obj.typeValeur.idParam,
                  "idcategorie": obj.categorieValeur.idCategorie,
                  "souscategories":
                    [
                      {
                        "idsouscategorie": obj.souscategories.idSousCategorie,
                        "idtypevaleur": obj.typeValeur.idParam,
                        "valeur": obj.valeur
                      }
                    ],
                  "valeur": obj.valeur,

                  "dateDebut": null,
                  "dateFin": null,

                }


              }

            }
          )


          this.initTabSousGarantieCategory(caract.idSousGarantie);

        })
      }

    });
  }
  deletePackCategory(idCaract: any) {
    let dialogRef = this.dialog.open(SupressionPackGarantieComponent, {
      width: '30%',
      data: {
        categoryOf: "categoryPack",
        type: "post"
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        let index = this.packCategory.findIndex(category => category.idcaracteristique === idCaract)
        this.packCategory.splice(index, 1)
        while (index < this.packCategory.length) {
          this.packCategory[index].idcaracteristique--;
          index++;
        }

        index = this.packCategoryTab.findIndex(category => category.idcaracteristique === idCaract)

        this.packCategoryTab.splice(index, 1)
        while (index < this.packCategoryTab.length) {
          this.packCategoryTab[index].idcaracteristique--;
          index++;
        }
        this.initategoryPackTab()
      }
    });
  }
  deleteCategoryGarantie(idCategory: any, idGarantie: any) {

    let dialogRef = this.dialog.open(SupressionPackGarantieComponent, {
      width: '30%',
      data: {
        categoryOf: "categoryGarantie",
        type: "post"
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        let index

        this.garantiePack.filter(
          (objGarantie: any) => {
            index = objGarantie["categorieList"].findIndex((category: any) => category.idcaracteristique === idCategory)

            objGarantie["categorieList"].splice(index, 1)

            while (index < objGarantie["categorieList"].length) {
              objGarantie["categorieList"][index].idcaracteristique--;
              index++;
            }
          }
        )
        this.initGarantieCategoryTab(idGarantie)

      }
    });
  }
  deleteCategorySousGarantie(idCategory: any, idSousGarantie: any) {

    let dialogRef = this.dialog.open(SupressionPackGarantieComponent, {
      width: '30%',
      data: {
        categoryOf: "categoryGarantie",
        type: "post"
      }

    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        let index


        this.sousGarantiePack.filter(
          (objSousGarantie: any) => {
            index = objSousGarantie["categorieList"].findIndex((category: any) => category.idcaracteristique === idCategory)
            objSousGarantie["categorieList"].splice(index, 1)
            while (index < objSousGarantie["categorieList"].length) {
              objSousGarantie["categorieList"][index].idcaracteristique--;
              index++;
            }
          }
        )

        this.initTabSousGarantieCategory(idSousGarantie)

      }
    });
  }
  // openSnackBar(message: string, action: string) {
  //   this._snackBar.open(message, action, {
  //     horizontalPosition: "right",
  //     panelClass: ['danger-snackbar'],
  //     duration: 10000,
  //   });
  // }
  goBack() {
    this.stepper.previous()
  }
  navigateToListPack() {
    this.router.navigate(['gestion-referentiels/gestion-pack']);

  }
  @ViewChild(MatPaginator, { static: false })
  set paginatorGarantie(value: MatPaginator) {
    if (this.dataSousGarantiePack) {
      this.dataSousGarantiePack.paginator = value;
    }
  }
}
