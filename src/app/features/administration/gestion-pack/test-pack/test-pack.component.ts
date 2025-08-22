
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { trigger, style, animate, transition } from '@angular/animations';
//services 
import { GarantiesService } from '../../../../core/services/garanties.service'
import { SousGarantiesService } from '../../../../core/services/sous-garanties.service'
import { PackService } from '../../../../core/services/pack.service'
import { Pack } from '../../../../core/models/pack'
//dialog
import { CreationCategorieDialogComponent } from '../gestion-categorie/creation-categorie-dialog/creation-categorie-dialog.component';
import { EditCategorieDialogComponent } from '../gestion-categorie/edit-categorie-dialog/edit-categorie-dialog.component';
import { CreationGarantieDialogComponent } from '../../gestion-garanties/creation-garantie-dialog/creation-garantie-dialog.component';
import { CreationSousGarantiesDialogComponent } from '../../gestion-sous-garanties/creation-sous-garanties-dialog/creation-sous-garanties-dialog.component';
import { CreationPackGarantieComponent } from '../creation-pack-garantie/creation-pack-garantie.component';
import { SupressionPackGarantieComponent } from '../supression-pack-garantie/supression-pack-garantie.component';
import { GestionCategorieComponent } from '../gestion-categorie/gestion-categorie.component';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';

export interface Garanties {
  id: string;
  libelle: string;
}
const ELEMENT_DATA = [
  { categorieValeur: "plafond", typeValeur: 'pourcentage', valeur: 1000 },
  { categorieValeur: "plafond", typeValeur: 'pourcentage', valeur: 2000 },
];
@Component({
  selector: 'app-test-pack',
  templateUrl: './test-pack.component.html',
  styleUrls: ['./test-pack.component.scss'],
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
@Component({
  selector: 'app-test-pack',
  templateUrl: './test-pack.component.html',
  styleUrls: ['./test-pack.component.scss']
})
export class TestPackComponent implements OnInit {
  categorieValeur = [
    {
      id: 0,
      value: 'Formule',
    },
    {
      id: 1,
      value: 'Franchise',
    },
    {
      id: 2,
      value: 'Plafond',
    },
  ]

  typeValeur = [
    {
      id: 0,
      value: 'Valeur',
    },
    {
      id: 1,
      value: 'pourcentage',
    },
    {
      id: 2,
      value: 'Valeur Minimum',
    },
    {
      id: 3,
      value: 'Valeur Maximale',
    },
    {
      id: 4,
      value: 'Formule',
    },
  ]

  @ViewChild(GestionCategorieComponent, { static: false }) childC: GestionCategorieComponent;
  bigPack: any[] = []
  creationPackStepOne: FormGroup | any;
  creationPackStepTwo: FormGroup | any;
  creationPackStepThree: FormGroup | any;
  garanties: Garanties[] = []
  sousGaranties: any[] = []

  garantiePack: any[] = []
  packCategory: any[] = []
  sousGarantiePack: any[] = []
  sousGarantiePackTEST: any[] = []
  garantiesTab: any[] = []
  sousgarantiesTab: any[] = []

  dataGarantiePack = new MatTableDataSource()
  dataSousGarantiePack = new MatTableDataSource()
  displayedColumnsGarantiePack: string[] = ['idGarantie', 'description', 'obligatoire', 'action'];
  lengthColumns = this.displayedColumnsGarantiePack.length
  garantieExist = false;
  sousGarantieExist = false
  garantiePackCategory: any[] = [];
  tabGarantieCategories: any[] = [];
  tabSousGarantieCategories: any = [];
  tempCategory: any = [];
  idGarantie: Number;
  filteredGaranties: any
  filteredSousGaranties: any
  filteredGarantiesOfPack: any
  // tab category of pack
  packCategoryTab: any[] = [];
  dataSourcePackCategory = new MatTableDataSource<any>();
  displayedColumnsPackCategory: string[] = ['categorieValeur', 'typeValeur', 'valeur', "action"];
  lengthColumnsPackCategory = this.displayedColumnsPackCategory.length
  //
  displayedColumnsSousGarantieCategory: string[] = ['categorieValeur', 'typeValeur', 'valeur', "action"];
  displayedColumnsGarantieCategory: string[] = ['categorieValeur', 'typeValeur', 'valeur', "action"];
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
  constructor(private route: ActivatedRoute, private packService: PackService, private sousGarantiesService: SousGarantiesService, private garantiesService: GarantiesService, private dialog: MatDialog, private formBuilder: FormBuilder,) { }

  // public filteredList1 = this.variables.slice();
  ngOnInit(): void {
    // init form category 
    this.CategoryPackForm = this.formBuilder.group({
      VORows: this.formBuilder.array([])
    });
    this.CategoryGarantieForm = this.formBuilder.group({
      VORows: this.formBuilder.array([])
    });

    this.onePack = this.packService.getPackById(this.route.snapshot.paramMap.get('idPack'))
    this.initTables()
    this.initFormCreationStepOne()
    this.initFormCreationStepTwo()
    this.initFormCreationStepThree()
    this.getAllGaranties();


  }
  initTables() {
    //***************************** init  category for pack 
    this.packCategory = this.onePack.categorie

    this.packCategory.filter((category: any) => {

      this.packCategoryTab.push({
        "typeValeur": {
          "id": category.typeValeur,
          "value": this.typeValeur.filter(typevaleur => { return typevaleur.id == category.typeValeur })[0].value,
        },
        "categorieValeur": {
          "id": category.categorieValeur,
          "value": this.categorieValeur.filter(categorievaleur => { return categorievaleur.id == category.categorieValeur })[0].value,
        },
        "valeur": category.valeur,
        "idcaracteristique": category.idcaracteristique,
      })
    })
    this.initatecategoryPackTab()
    //*********************************** init  garanties for pack 
    this.garantiePack = this.onePack.garantie
    this.garantiePack.filter((garantie: any) => {
      this.garantiesTab.push({
        "id": garantie.idGarantie,
        "description": garantie.description,
        "obligatoire": garantie.obligatoire,
      })
    })

    this.initTabPackGarantie(this.garantiesTab)
    //*********************************** init sous garanties for pack 
    // this.sousGarantiePack=this.onePack.garantie.
    this.onePack.garantie.filter((garantie: any) => {

      if(garantie.sousGarantie.length!=0){
      

        garantie.sousGarantie.filter((sousGarantie: any) => {
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
      garantie: ['', [Validators.required]],
      garantiePack: ['', [Validators.required]],
      sousGarantie: [''],
      tabPGF: ['', [Validators.required]],

    });
  }
  initFormCreationStepThree() {
    this.creationPackStepThree = this.formBuilder.group({
      sousGarantie: ['', [Validators.required]],
    });
  }
  initTabPackGarantie(data: any) {
    this.dataGarantiePack = new MatTableDataSource(data);
    // this.filteredGarantiesOfPack = this.garantiesTab.slice()

  }
  initTabPackSousGarantie(data: any) {

    this.dataSousGarantiePack = new MatTableDataSource(data);
    // this.filteredGarantiesOfPack = this.garantiesTab.slice()

  }

  initTabSousGarantieCategory(idSousGarantie: any) {
    this.tabSousGarantieCategories = []

    this.sousGarantiePack.filter((tab: any) => {
      if (tab.idSousGarantie == idSousGarantie) {
        tab["categorie"].filter((category: any) => {
          this.tabSousGarantieCategories.push({
            "typeValeur": {
              "id": category.typeValeur,
              "value": this.typeValeur.filter(typevaleur => { return typevaleur.id == category.typeValeur })[0].value,
            },
            "categorieValeur": {
              "id": category.categorieValeur,
              "value": this.categorieValeur.filter(categorievaleur => { return categorievaleur.id == category.categorieValeur })[0].value,
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

    this.stepSousGarantieCategory = false


  }
  initGarantieCategoryTab(idGarantie: any) {
    this.tabGarantieCategories = []

    this.garantiePack.filter((tab: any) => {
      if (tab.idGarantie == idGarantie) {
        tab["categorie"].filter((category: any) => {
          this.tabGarantieCategories.push({
            "typeValeur": {
              "id": category.typeValeur,
              "value": this.typeValeur.filter(typevaleur => { return typevaleur.id == category.typeValeur })[0].value,
            },
            "categorieValeur": {
              "id": category.categorieValeur,
              "value": this.categorieValeur.filter(categorievaleur => { return categorievaleur.id == category.categorieValeur })[0].value,
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

    this.stepGarantieCategory = false

  }

  initatecategoryPackTab() {

    this.dataSourcePackCategory = new MatTableDataSource(this.packCategoryTab);
  }

  submitPack() {
    this.bigPack = [{
      "description": this.creationPackStepOne.get("description").value,
      "dateDebut": this.creationPackStepOne.get("dateDebut").value,
      "dateFin": this.creationPackStepOne.get("dateFin").value,
      "categorie": this.packCategory,
      "garantie": this.garantiePack

    }]
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

      if (value.id == garantie.id)
        this.garantieExist = true
    });
    if (!this.garantieExist) {
      let dialogRef = this.dialog.open(CreationPackGarantieComponent, {
        width: '60%',
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
            "categorie": [],
            "sousGarantie": [],
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
          "categorie": [],
          "sousGarantie": [],
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
        this.garantiePack[this.garantiePack.findIndex((garantie) => garantie.idGarantie == idGarantie)]["sousGarantie"].obligatoire = result.data.obligatoire

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
        let SousGarantie = this.garantiePack[indexGarantie]["sousGarantie"]
        let indexSousGarantie = SousGarantie.findIndex((sousgarantie: any) => sousgarantie.idSousGarantie === id)
        this.garantiePack[indexGarantie]["sousGarantie"].splice(indexSousGarantie, 1)
        this.initTabPackSousGarantie(this.sousgarantiesTab)




      }

    });
  }
  /******* add delete sous garantie  ******/

  addSousGarantiePack(value: any) {
    this.sousGarantieExist = false
    //check if sous garantie a déja été ajouter 
    this.sousgarantiesTab.filter(sousgarantie => {

      if (value.id == sousgarantie.idSousGarantie)
        this.sousGarantieExist = true
    });
    if (!this.sousGarantieExist) {

      let dialogRef = this.dialog.open(CreationPackGarantieComponent, {
        width: '60%',
        data: {
          type: "sousGarantie",
          id: value.id,
          description: value.libelle
        }

      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result.data != undefined) {
          Object.assign(result.data, { idGarantie: value.idGarantie.idGarantie });
          this.sousgarantiesTab.push(result.data)

          let tempSousGarantie = {
            "idSousGarantie": result.data.id,
            "idGarantie": value.idGarantie.idGarantie,
            "obligatoire": result.data.obligatoire,
            "categorie": [],
          }
          this.sousGarantiePack.push(tempSousGarantie)

          this.addSousGarantieToGarantie(tempSousGarantie)

          this.initTabPackSousGarantie(this.sousgarantiesTab.filter((obj: any) => {
            return obj.idGarantie == value.idGarantie.idGarantie
          }))
        }

      });
    }
  }

  addCategorie(idGarantie: any) {
    let dialogRef = this.dialog.open(CreationCategorieDialogComponent, {
      width: '60%',
      data: {
        idGarantie: idGarantie
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        result.data.filter((obj: any) => {
          //add category to garantie
          if (idGarantie != null) {


            this.garantiePack.filter(
              (objGarantie: any) => {
                if (objGarantie.idGarantie == idGarantie) {
                  let length = objGarantie["categorie"].length + 1
                  let tempGarantieCategory = {
                    "idcaracteristique": length,
                    "typeValeur": obj.typeValeur.id,
                    "categorieValeur": obj.categorieValeur.id,
                    "valeur": obj.valeur
                  }
                  objGarantie["categorie"].push(tempGarantieCategory)


                }

              }
            )
          } else {
            // add garantie to pack

            Object.assign(obj, { idcaracteristique: this.idPackCaract });
            this.packCategoryTab.push(obj)
            this.initatecategoryPackTab();


            let tempPackCategory = {
              "idcaracteristique": this.idPackCaract,
              "typeValeur": obj.typeValeur.id,
              "categorieValeur": obj.categorieValeur.id,
              "valeur": obj.valeur
            }


            this.packCategory.push(tempPackCategory)
            this.idPackCaract++

          }


        })



      }

    });
  }
  addSousGarantieCategorie(value: any, desc: string) {

    let dialogRef = this.dialog.open(CreationCategorieDialogComponent, {
      width: '60%',
      data: {
        categoryOf: 'garantie',
        idGarantie: value,
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {

        result.data.filter((obj: any) => {

          this.sousGarantiePack.filter(
            (objSousGarantie: any) => {
              if (objSousGarantie.idSousGarantie == value) {
                let length = objSousGarantie["categorie"].length + 1

                let tempSousGarantieCategory = {
                  "idcaracteristique": length,
                  "typeValeur": obj.typeValeur.id,
                  "categorieValeur": obj.categorieValeur.id,
                  "valeur": obj.valeur
                }
                objSousGarantie["categorie"].push(tempSousGarantieCategory)


              }

            }
          )
        })


      }

    });
  }
  addSousGarantieToGarantie(sousGarantie: any) {
    this.garantiePack.filter((obj: any) => {

      if (obj.idGarantie == sousGarantie.idGarantie) {
        obj["sousGarantie"].push(sousGarantie)
      }



    })

  }

  getAllGaranties() {
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

    // this.garantiesService.getAllGarantiesTest().filter((obj: any) => {
    //   let tempGarantie = {
    //     "id": obj.idGarantie,
    //     "libelle": obj.description,
    //   }

    //   this.garanties.push(tempGarantie)
    // })
    this.filteredGaranties = this.garanties.slice()
  }
  getSousGarantieByGarantie(idGarantie: any) {
    this.idGarantie = idGarantie
    this.sousGarantiesService.getSousGarantiesByGarantie(idGarantie).subscribe({
      next: (data: any) => {

        data.filter((obj: any) => {
          let tempSousGarantie = {
            "id": obj.idSousGarantie,
            "idGarantie": obj.idGarantie,
            "libelle": obj.description,
          }

          this.sousGaranties.push(tempSousGarantie)
        })
        this.filteredSousGaranties = this.sousGaranties.slice()
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
    // stepper.linear = false;
    this.stepSousGarantieCategory = true
    this.initTabPackSousGarantie(this.sousgarantiesTab.filter((obj: any) => { return obj.idGarantie == idGarantie }))
    stepper.next();
    this.idGarantie = idGarantie
    this.sousGaranties = []
    this.getSousGarantieByGarantie(idGarantie)

  }

  EditPackCategory(caract: any) {
    let dialogRef = this.dialog.open(EditCategorieDialogComponent, {
      width: '60%',
      data: {
        category: caract
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        result.data.filter((obj: any) => {

          // edit CATEGORY to pack
          this.packCategoryTab[this.packCategoryTab.findIndex(category => category.idcaracteristique === obj.idcaracteristique)] = obj

          this.packCategory[this.packCategory.findIndex(category => category.idcaracteristique === obj.idcaracteristique)] = {
            "idcaracteristique": obj.idcaracteristique,
            "typeValeur": obj.typeValeur.id,
            "categorieValeur": obj.categorieValeur.id,
            "valeur": obj.valeur
          }
          this.initatecategoryPackTab();

        })
      }

    });
  }
  EditGarantieCategory(category: any) {

    let dialogRef = this.dialog.open(EditCategorieDialogComponent, {
      width: '60%',
      data: {
        category: category
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        result.data.filter((obj: any) => {
          this.garantiePack.filter(
            (objGarantie: any) => {
              if (objGarantie.idGarantie == category.idGarantie) {
                let index = objGarantie["categorie"].findIndex((category: any) => category.idcaracteristique === obj.idcaracteristique)
                objGarantie["categorie"][index] = {
                  "idcaracteristique": obj.idcaracteristique,
                  "typeValeur": obj.typeValeur.id,
                  "categorieValeur": obj.categorieValeur.id,
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
        category: caract
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.data != undefined) {
        result.data.filter((obj: any) => {

          this.sousGarantiePack.filter(
            (objSousGarantie: any) => {


              if (objSousGarantie.idSousGarantie == caract.idSousGarantie) {
                let index = objSousGarantie["categorie"].findIndex((category: any) => category.idcaracteristique === caract.idcaracteristique)

                objSousGarantie["categorie"][index] = {
                  "idcaracteristique": obj.idcaracteristique,
                  "typeValeur": obj.typeValeur.id,
                  "categorieValeur": obj.categorieValeur.id,
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
  deletePackCategory(idCaract: any) {
    let dialogRef = this.dialog.open(SupressionPackGarantieComponent, {
      width: '30%',
      data: {
        categoryOf: "categoryPack"
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
        this.initatecategoryPackTab()
      }
    });
  }
  deleteCategoryGarantie(idCategory: any, idGarantie: any) {

    let dialogRef = this.dialog.open(SupressionPackGarantieComponent, {
      width: '30%',
      data: {
        categoryOf: "categoryGarantie"
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        let index


        this.garantiePack.filter(
          (objGarantie: any) => {
            index = objGarantie["categorie"].findIndex((category: any) => category.idcaracteristique === idCategory)
            objGarantie["categorie"].splice(index, 1)
            while (index < objGarantie["categorie"].length) {
              objGarantie["categorie"][index].idcaracteristique--;
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
        categoryOf: "categoryGarantie"
      }

    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        let index


        this.sousGarantiePack.filter(
          (objSousGarantie: any) => {
            index = objSousGarantie["categorie"].findIndex((category: any) => category.idcaracteristique === idCategory)
            objSousGarantie["categorie"].splice(index, 1)
            while (index < objSousGarantie["categorie"].length) {
              objSousGarantie["categorie"][index].idcaracteristique--;
              index++;
            }
          }
        )
        this.initTabSousGarantieCategory(idSousGarantie)

      }
    });
  }


}

