import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';

import { trigger, style, animate, transition } from '@angular/animations';
//services 
import { GarantiesService } from '../../../../core/services/garanties.service'
import { SousGarantiesService } from '../../../../core/services/sous-garanties.service'
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
import { GenericService } from 'src/app/core/services/generic.service';
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
  selector: 'app-edit-pack',
  templateUrl: './edit-pack.component.html',
  styleUrls: ['./edit-pack.component.scss'],
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

export class EditPackComponent implements OnInit {

  @ViewChild('stepper') private stepper: MatStepper;
  @ViewChild(GestionCategorieComponent, { static: false }) childC: GestionCategorieComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('paginatorPackGarantie') set paginatorPackGarantie(value: MatPaginator) {
    if (this.dataGarantiePack) {
      this.dataGarantiePack.paginator = value;
    }
  }
  @ViewChild('paginatorGarantieCategory') set paginatorGarantieCategory(value: MatPaginator) {
    if (this.dataSourceGarantieCategory) {
      this.dataSourceGarantieCategory.paginator = value;
    }
  }
  @ViewChild('paginatorSousGarantiePack') set paginatorSousGarantiePack(value: MatPaginator) {
    if (this.dataSousGarantiePack) {
      this.dataSousGarantiePack.paginator = value;
    }
  }
  @ViewChild('paginatorSousGarantieCategory') set paginatorSousGarantieCategory(value: MatPaginator) {
    if (this.dataSourceSousGarantieCategory) {
      this.dataSourceSousGarantieCategory.paginator = value;
    }
  }
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
  constructor(private genericService: GenericService, private router: Router, private route: ActivatedRoute, private packService: PackService, private _snackBar: MatSnackBar, private sousGarantiesService: SousGarantiesService, private garantiesService: GarantiesService, private dialog: MatDialog, private formBuilder: FormBuilder,) { }
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
  idPackCaract = 1
  idGarantieCaract = 1
  idSousGarantieCaract = 1
  CategoryPackForm: FormGroup;
  CategoryGarantieForm: FormGroup;
  onePack: any
  successEdit = false
  idPack: any
  // public filteredList1 = this.variables.slice();
  ngOnInit(): void {
    this.idPack = this.route.snapshot.paramMap.get('idPack')

    // init form category 
    this.CategoryPackForm = this.formBuilder.group({
      VORows: this.formBuilder.array([])
    });
    this.CategoryGarantieForm = this.formBuilder.group({
      VORows: this.formBuilder.array([])
    });

    this.packService.getPackById(this.idPack).subscribe({
      next: (data: any) => {
        this.onePack = data
        this.initTables()
        this.getAllCategories();
        this.getTypeValeur()
        this.initFormCreationStepOne()
        this.initFormCreationStepTwo()
        this.initFormCreationStepThree()
        this.getAllGaranties();
      },
      error: (error) => {

        console.log(error);

      }
    });


  }
  initTables() {

    //***************************** init  category for pack 

    this.packCategory = this.onePack.categorieList

    let index = 0
    this.packCategory.filter((category: any) => {
      index = index + 1
      category.idcaracteristique = index

      // this.packCategory.push({
      //   "idcaracteristique": index,
      //   "idtypevaleur": category.idtypevaleur,
      //   "idcategorie": category.idcategorie,
      //   "sousCategorieList": [
      //     {
      //       "idsouscategorie": category.sousCategorieList[0].idsouscategorie,
      //       "idtypevaleur": category.idtypevaleur,
      //       "valeur": category.valeur
      //     }
      //   ],
      //   "valeur": category.valeur
      // })

      this.packCategoryTab.push({
        "typeValeur": {
          "idParam": category.idtypevaleur,
          "description": category.descriptionvVal,
        },
        "categorieValeur": {
          "idCategorie": category.idcategorie,
          "description": category.description,
        },
        "sousCategorieList": {
          "idParamSCPackComplet": category.sousCategorieList[0].idParamSCPackComplet,
          "idSousCategorie": category.sousCategorieList[0].idsouscategorie,
          "description": category.sousCategorieList[0].description
        },
        "valeur": category.valeur,
        "idcaracteristique": index,
        "idParamPackComplet": category.idParamPackComplet,
      })
    })

    this.initategoryPackTab()
    // //*********************************** init  garanties for pack 
    if (this.onePack.garantie == null)
      this.onePack.garantie = []
    this.garantiePack = this.onePack.garantie
    index = 0
    this.onePack.garantie?.filter((garantie: any) => {

      garantie["categorieList"].filter((category: any) => {
        index = index + 1
        category.idcaracteristique = index

        this.sousCategorieValeur.push({
          "idSousCategorie": category.sousCategorieList[0]?.idsouscategorie,
          "description": category.sousCategorieList[0]?.description
        })
      })

      this.garantiesTab.push({
        "id": garantie.idGarantie,
        "description": garantie.description,
        "obligatoire": garantie.obligatoire,

      })

    })

    this.initTabPackGarantie(this.garantiesTab)
    // //*********************************** init sous garanties for pack 
    // this.sousGarantiePack=this.onePack.garantie.
    index = 0
    this.onePack.garantie?.filter((garantie: any) => {

      if (garantie.sousGarantieList.length != 0) {


        garantie.sousGarantieList.filter((sousGarantie: any) => {
          sousGarantie["categorieList"].filter((category: any) => {
            index = index + 1
            category.idcaracteristique = index
            if (category.sousCategorieList.length != 0)
              this.sousCategorieValeur.push({
                "idSousCategorie": category.sousCategorieList[0].idsouscategorie,
                "description": category.sousCategorieList[0].description
              })
          })

          this.sousGarantiePack.push(sousGarantie)
          this.sousgarantiesTab.push({
            "id": sousGarantie.idSousGarantie,
            "description": sousGarantie.description,
            "obligatoire": sousGarantie.obligatoire,
            "idGarantie": sousGarantie.idGarantie,
          })
        })
      }

    })
  }
  initFormCreationStepOne() {
    this.creationPackStepOne = this.formBuilder.group({
      description: [this.onePack.description, [Validators.required]],
      dateDebut: [this.onePack.dateDebut, [Validators.required]],
      dateFin: [this.onePack.dateFin],
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
      sousGarantie: ['', [Validators.required]],
    });
  }
  initTabPackGarantie(data: any) {
    this.dataGarantiePack = new MatTableDataSource(data);

  }

  initTabPackSousGarantie(data: any) {
    this.dataSousGarantiePack = new MatTableDataSource(data);
    // this.dataSousGarantiePack.paginator = this.paginatorSousGarantiePack;
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
            "sousCategorieList": {
              "idSousCategorie": category.sousCategorieList[0].idsouscategorie,
              "idParamSCPackComplet": category.sousCategorieList[0].idParamSCPackComplet,
              "value": this.sousCategorieValeur.filter(sousCategorieValeur => { return sousCategorieValeur.idSousCategorie == category.sousCategorieList[0].idsouscategorie })[0].description,
            },
            "valeur": category.valeur,
            "idcaracteristique": category.idcaracteristique,
            "idSousGarantie": tab.idSousGarantie,
            "idParamPackComplet": category.idParamPackComplet,

          })
        })

      }
    }
    )
    this.dataSourceSousGarantieCategory = new MatTableDataSource(this.tabSousGarantieCategories);
    // this.dataSourceSousGarantieCategory.paginator = this.paginatorSousGarantieCategory;
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
            "sousCategorieList": {
              "idSousCategorie": category.sousCategorieList[0]?.idsouscategorie,
              "idParamSCPackComplet": category.sousCategorieList[0]?.idParamSCPackComplet,
              "value": this.sousCategorieValeur.filter(sousCategorieValeur => { return sousCategorieValeur?.idSousCategorie == category.sousCategorieList[0]?.idsouscategorie })[0]?.description,
            },
            "valeur": category.valeur,
            "idcaracteristique": category.idcaracteristique,
            "idGarantie": tab.idGarantie,
            "idParamPackComplet": category.idParamPackComplet,
          })
        })

      }
    }
    )
    this.dataSourceGarantieCategory = new MatTableDataSource(this.tabGarantieCategories);
    // this.dataSourceGarantieCategory.paginator = this.paginatorGarantieCategory;
    this.stepGarantieCategory = false



  }

  initategoryPackTab() {

    this.dataSourcePackCategory = new MatTableDataSource(this.packCategoryTab);
    this.dataSourcePackCategory.paginator = this.paginator;

  }
  navigateToListPack() {
    this.router.navigate(['gestion-referentiels/gestion-pack']);

  }
  submitPack() {
    if (this.creationPackStepOne.valid) {
      this.creationPackStepOne.get("dateDebut").setValue(moment(this.creationPackStepOne.get("dateDebut").value).format('YYYY-MM-DD'))

      this.bigPack = {
        "description": this.creationPackStepOne.get("description").value,
        "dateDebut": this.creationPackStepOne.get("dateDebut").value,
        "dateFin": this.creationPackStepOne.get("dateFin").value,
        "categorieList": this.packCategory,
        "garantie": this.garantiePack

      }

      this.packService.editPack(this.bigPack, this.idPack).subscribe({
        next: (data: any) => {
          if (data == "Modification effectuée")
            this.successEdit = true
        },
        error: (error) => {

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
            "idPackComplet": 0,
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
        this.garantiePack[this.garantiePack.findIndex(garantie => garantie.idGarantie === id)].obligatoire = result.data.obligatoire

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
        // this.garantiePack[this.garantiePack.findIndex((garantie) => garantie.idGarantie == idGarantie)]["sousGarantieList"].obligatoire = result.data.obligatoire

        let indexGarantie = this.garantiePack.findIndex(garantie => garantie.idGarantie === idGarantie)
        let SousGarantie = this.garantiePack[indexGarantie]["sousGarantieList"]

        SousGarantie.filter((sousGarantie: any) => {
          if (sousGarantie.idSousGarantie == idSousGarantie)
            sousGarantie.obligatoire = result.data.obligatoire

        })
        this.initTabPackSousGarantie(this.sousgarantiesTab)


      }

    });

  }
  deleteGarantie(id: any, desc: any, categoryOf: string) {

    let dialogRef = this.dialog.open(SupressionPackGarantieComponent, {
      width: '30%',
      data: {
        desc: desc,
        categoryOf: categoryOf,
        type: "put"
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data) {
        if (categoryOf == "garantie") {
          this.garantiePack.filter(garantie => {

            if (garantie.idGarantie == id) {
              garantie.dateFin = result.data.dateFin
            }
          })
          this.initTabPackGarantie(this.garantiesTab)
        }


      }

    });
  }
  deleteSousGarantie(id: any, desc: any, categoryOf: string, idGarantie: any) {

    let dialogRef = this.dialog.open(SupressionPackGarantieComponent, {
      width: '30%',
      data: {
        desc: desc,
        categoryOf: categoryOf,
        type: "put"
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {

      if (result.data) {
        let indexGarantie = this.garantiePack.findIndex(garantie => garantie.idGarantie === idGarantie)
        let SousGarantie = this.garantiePack[indexGarantie]["sousGarantieList"]

        SousGarantie.filter((sousGarantie: any) => {
          if (sousGarantie.idSousGarantie == id)
            sousGarantie.dateFin = result.data.dateFin

        })
        this.initTabPackSousGarantie(this.sousgarantiesTab.filter((obj: any) => { return obj.idGarantie == idGarantie }))

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
            "idPackComplet": 0,
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
        type: "edit",
        idGarantie: this.idGarantie
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        result.data.filter((obj: any) => {
          //add category to garantie

          this.sousCategorieValeur.push(obj.sousCategorieList)

          this.garantiePack.filter(
            (objGarantie: any) => {
              if (objGarantie.idGarantie == this.idGarantie) {
                let length = objGarantie["categorieList"].length + 1
                let tempGarantieCategory = {
                  "idParamPackComplet": 0,
                  "idcaracteristique": length,
                  "idtypevaleur": obj.typeValeur.idParam,
                  "idcategorie": obj.categorieValeur.idCategorie,
                  "sousCategorieList":
                    [
                      {
                        "idParamSCPackComplet": 0,
                        "idsouscategorie": obj.sousCategorieList.idSousCategorie,
                        "idtypevaleur": obj.typeValeur.idParam,
                        "valeur": obj.valeur
                      }
                    ],
                  "valeur": obj.valeur
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
        type: "edit",
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
            "idParamPackComplet": 0,
            "idcaracteristique": this.idPackCaract,
            "idtypevaleur": obj.typeValeur.idParam,
            "idcategorie": obj.categorieValeur.idCategorie,
            "sousCategorieList": [
              {
                "idParamSCPackComplet": 0,
                "idsouscategorie": obj.souscategories.idSousCategorie,
                "idtypevaleur": obj.typeValeur.idParam,
                "valeur": obj.valeur
              }
            ],
            "valeur": obj.valeur
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
        type: "edit",
        idGarantie: this.idSousGarantie,
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      let lengthTab = 0
      if (result.data != undefined) {

        result.data.filter((obj: any) => {
          this.sousCategorieValeur.push(obj.sousCategorieList)

          this.sousGarantiePack.filter(
            (objSousGarantie: any) => {
              if (objSousGarantie.idSousGarantie == this.idSousGarantie) {
                let length = objSousGarantie["categorieList"].length + 1

                let tempSousGarantieCategory = {
                  "idParamPackComplet": 0,
                  "idcaracteristique": length,
                  "idtypevaleur": obj.typeValeur.idParam,
                  "idcategorie": obj.categorieValeur.idCategorie,
                  "sousCategorieList":
                    [
                      {
                        "idParamSCPackComplet": 0,
                        "idsouscategorie": obj.sousCategorieList.idSousCategorie,
                        "idtypevaleur": obj.typeValeur.idParam,
                        "valeur": obj.valeur
                      }
                    ],
                  "valeur": obj.valeur
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
  goToSousGarantie(stepper: MatStepper, idGarantie: any) {


    this.stepSousGarantieCategory = true

    this.initTabPackSousGarantie(this.sousgarantiesTab.filter((obj: any) => { return obj.idGarantie == idGarantie }))
    stepper.next();
    this.idGarantie = idGarantie
    this.sousGaranties = []
    this.getSousGarantieByGarantie(idGarantie)

  }

  EditPackCategory(categoryObject: any) {

    let dialogRef = this.dialog.open(EditCategorieDialogComponent, {
      width: '60%',
      data: {
        category: categoryObject,
        type: "edit"
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        result.data.filter((obj: any) => {

          // edit CATEGORY to pack

          this.packCategoryTab[this.packCategoryTab.findIndex(category => category.idcaracteristique === obj.idcaracteristique)] = obj

          this.packCategory[this.packCategory.findIndex(category => category.idcaracteristique === obj.idcaracteristique)] = {

            "idParamPackComplet": obj.idParamPackComplet,
            "idcaracteristique": obj.idcaracteristique,
            "idtypevaleur": obj.typeValeur.idParam,
            "idcategorie": obj.categorieValeur.idCategorie,
            "valeur": obj.valeur,
            "sousCategorieList": [
              {
                "idParamSCPackComplet": obj.idParamSCPackComplet,
                "idsouscategorie": obj.sousCategorieList.idSousCategorie,
                "idtypevaleur": obj.typeValeur.idParam,
                "valeur": obj.valeur
              }
            ],

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
        type: "edit"
      }

    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        result.data.filter((obj: any) => {

          this.sousCategorieValeur.push(obj.sousCategorieList)
          this.garantiePack.filter(
            (objGarantie: any) => {
              if (objGarantie.idGarantie == category.idGarantie) {
                let index = objGarantie["categorieList"].findIndex((category: any) => category.idcaracteristique === obj.idcaracteristique)
                objGarantie["categorieList"][index] = {
                  "idParamPackComplet": obj.idParamPackComplet,
                  "idcaracteristique": obj.idcaracteristique,
                  "idtypevaleur": obj.typeValeur.idParam,
                  "idcategorie": obj.categorieValeur.idCategorie,
                  "sousCategorieList":
                    [
                      {
                        "idParamSCPackComplet": obj.idParamSCPackComplet,
                        "idsouscategorie": obj.sousCategorieList.idSousCategorie,
                        "idtypevaleur": obj.typeValeur.idParam,
                        "valeur": obj.valeur
                      }
                    ],
                  "valeur": obj.valeur

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
        type: "edit"
      }

    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        result.data.filter((obj: any) => {
          this.sousCategorieValeur.push(obj.sousCategorieList)

          this.sousGarantiePack.filter(
            (objSousGarantie: any) => {


              if (objSousGarantie.idSousGarantie == caract.idSousGarantie) {
                let index = objSousGarantie["categorieList"].findIndex((category: any) => category.idcaracteristique === caract.idcaracteristique)

                objSousGarantie["categorieList"][index] = {
                  "idParamPackComplet": obj.idParamPackComplet,
                  "idcaracteristique": obj.idcaracteristique,
                  "idtypevaleur": obj.typeValeur.idParam,
                  "idcategorie": obj.categorieValeur.idCategorie,
                  "sousCategorieList":
                    [
                      {
                        "idParamSCPackComplet": obj.idParamSCPackComplet,
                        "idsouscategorie": obj.sousCategorieList.idSousCategorie,
                        "idtypevaleur": obj.typeValeur.idParam,
                        "valeur": obj.valeur
                      }
                    ],
                  "valeur": obj.valeur

                }


              }

            }
          )


          this.initTabSousGarantieCategory(caract.idSousGarantie);

        })
      }

    });
  }
  // delete category from pack 
  deletePackCategory(idCaract: any) {
    let dialogRef = this.dialog.open(SupressionPackGarantieComponent, {
      width: '30%',
      data: {
        categoryOf: "categoryPack",
        type: "put"
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data) {

        this.packCategory.filter(category => {

          if (category.idcaracteristique == idCaract) {
            category.dateFin = result.data.dateFin
          }
        })
        this.initategoryPackTab()
      }
    });
  }
  // delete category from garantie 
  deleteCategoryGarantie(idCaract: any, idGarantie: any) {

    let dialogRef = this.dialog.open(SupressionPackGarantieComponent, {
      width: '30%',
      data: {
        categoryOf: "categoryGarantie",
        type: "put"
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data) {

        this.garantiePack.filter(garantie => {
          if (garantie.idGarantie == idGarantie)
            garantie["categorieList"].filter((category: any) => {
              if (category.idcaracteristique == idCaract) {
                category.dateFin = result.data.dateFin
              }
            })

        })

        this.initGarantieCategoryTab(idGarantie)

      }
    });
  }
  // delete category from sous garantie 
  deleteCategorySousGarantie(idCaract: any, idSousGarantie: any) {

    let dialogRef = this.dialog.open(SupressionPackGarantieComponent, {
      width: '30%',
      data: {
        categoryOf: "categorySousGarantie",
        type: "put"
      }

    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data) {
        this.sousGarantiePack.filter(sousGarantie => {
          if (sousGarantie.idSousGarantie == idSousGarantie)
            sousGarantie["categorieList"].filter((category: any) => {
              if (category.idcaracteristique == idCaract) {
                category.dateFin = result.data.dateFin
              }
            })

        })

        this.initTabSousGarantieCategory(idSousGarantie)

      }
    });
  }
  goBack() {
    this.stepper.previous();
  }
  @ViewChild(MatPaginator, { static: false })
  set paginatorGarantie(value: MatPaginator) {
    if (this.dataSousGarantiePack) {
      this.dataSousGarantiePack.paginator = value;
    }
  }
}
