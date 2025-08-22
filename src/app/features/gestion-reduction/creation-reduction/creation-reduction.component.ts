import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PackService } from 'src/app/core/services/pack.service';
import { AgencesService } from 'src/app/core/services/agences.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReductionJson } from 'src/app/core/models/reduction';
import { PersonneService } from 'src/app/core/services/personne.service';
import { ReductionService } from 'src/app/core/services/reduction.service';
import { ProduitService } from 'src/app/core/services/produit.service';
import { ParamRisqueService } from '../../../core/services/param-risque.service'
import { ParamRisqueProduit } from 'src/app/core/models/param-risque-produit';
import { VehiculeService } from 'src/app/core/services/vehicule.service';
import { MatStepper } from '@angular/material/stepper';
import { GenericService } from 'src/app/core/services/generic.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
@Component({
  selector: 'app-creation-reduction',
  templateUrl: './creation-reduction.component.html',
  styleUrls: ['./creation-reduction.component.scss']
})
export class CreationReductionComponent implements OnInit {
  @ViewChildren('checkbox') checkboxes!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('stepper') private stepper: MatStepper;

  formInfoGeneral: FormGroup | any;
  infoProduit: FormGroup | any;
  infoVehicule: FormGroup | any;
  infoPack: FormGroup | any;
  VOFormGaranties: FormGroup;
  typeReduction = 0
  loadTablePack = false
  emptyTableReduction = true
  paramReady = false
  step = 0
  idProduit = 0
  idWorkFlow = 263
  garantiePart = false
  minDate = new Date()
  dataSourceGaranties: any = []
  dataSourcePacks = new MatTableDataSource<any>();
  displayedColumns: string[] = ['garantie', 'franchise', 'pourcentage', 'action'];
  displayedPackColumns: string[] = ['id', 'description', 'dateDebut', 'action'];
  displayedColumnsReductions: string[] = ['nomReduction', 'dateDebut', 'typeProduit', 'action'];
  packs: any = []
  personneMorales: any = []
  garantieTab: any = []
  packsTab: any = []
  paraRisqueProduit: ParamRisqueProduit[] = [];
  reductionList: any = []
  paramRisqueType: any = []
  agences: any = []
  dateDebut = new Date()
  dataSourceReduction = new MatTableDataSource(this.reductionList)
  reductionJson = ReductionJson
  typeValeurRisque: any = []
  marques: any = []
  users: any = []
  valeurCategory = ""
  typeProduit: any
  paraRisqueProduitCategory: any[] = []
  mouvements: any[] = []
  typeProduits: any[] = []
  canalDistributions: any[] = []
  dateDebutConvention = new Date()
  errorHandler = {
    "error": false,
    "msg": ""
  }
  codeReduction: any
  dateFinConvention = new Date()
  typeValues = [{ "id": 1, "description": "Valeur" }, { "id": 2, "description": "Intervale" }]
  reductionSuccess: boolean = false;

  isAllCanalDistro: boolean= false;

  isAllUtilisateurs: boolean = false;
  isAllAgences: boolean = false;
  constructor(private route: ActivatedRoute, private genericService: GenericService, private produitService: ProduitService, private agencesService: AgencesService, private vehiculeService: VehiculeService, private paramRisqueService: ParamRisqueService, private reductionService: ReductionService, private personneService: PersonneService, private router: Router, private routerquery: ActivatedRoute, private packService: PackService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // this.getProductId()
    if (this.router.url.includes('/creation-convention')) {
      this.typeReduction = 261
      this.reductionJson.typeReduction = 261
      this.routerquery.queryParams.subscribe((params: any) => {
        this.dateDebutConvention = new Date(params['dateDebut'])
        this.dateFinConvention = new Date(params['dateFin'])
      });

    }
    else {
      this.typeReduction = 262
      this.reductionJson.typeReduction = 262
    }


    //reduction retails



    this.getAllProduits()
    // this.getAllPersonneMorale()
    this.getAllUsers()
    this.getAllAgences()

    this.initFormGeneral()
    this.initInfoVehicule()
    this.initInfoProduit()
    this.initInfoPack()
    this.getMarques()
    this.getMouvements()
    this.canalDistribution()
  }
  canalDistribution() {
    //get types champ
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C22").idCategorie).subscribe(data => {
      this.canalDistributions = data;
    })
  }
  initFormGeneral() {
    //corporate
    if (this.typeReduction == 261) {
      this.formInfoGeneral = this.formBuilder.group({
        nomReduction: ['', Validators.required],
        dateDebut: [{ value: this.dateDebutConvention, disabled: true }, Validators.required],
        dateFin: [{ value: this.dateFinConvention, disabled: true }, Validators.required],
        agences: ['', Validators.required],
        appAutomatique: ['', Validators.required],
        mouvementsPolice: ['', Validators.required],
        canalDistribution: ['', Validators.required],
        utilisateurs: ['', Validators.required]

      });
    }
    else {
      this.formInfoGeneral = this.formBuilder.group({
        nomReduction: ['', Validators.required],
        dateDebut: ["", Validators.required],
        dateFin: [{ value: "", disabled: true }, Validators.required],
        agences: ['', Validators.required],
        typeProduit: ['', Validators.required],
        appAutomatique: ['', Validators.required],
        mouvementsPolice: ['', Validators.required],
        canalDistribution: ['', Validators.required],
        utilisateurs: ['', Validators.required]

      });
    }
  }
  initInfoVehicule() {
    this.infoVehicule = this.formBuilder.group({});
  }
  initInfoProduit() {
    this.infoProduit = this.formBuilder.group({
      agence: ['', Validators.required],
      utilisateur: ['', Validators.required],
      // canalDistribution: ['', Validators.required],
    });
  }
  initInfoPack() {
    this.infoPack = this.formBuilder.group({
      pack: ['', Validators.required],
      VORowsPacks: this.formBuilder.array([]),
    });
  }
  newPack(idPack: any, description: string): FormGroup {
    return this.formBuilder.group({
      idPack: idPack,
      description: description,
      garanties: this.formBuilder.array([])
    })
  }
  newGarantie(garantie: any): FormGroup {
    return this.formBuilder.group({
      idGarantie: new FormControl(garantie.idGarantie),
      idPackComplet: new FormControl(garantie.idPackComplet),
      garantie: new FormControl(garantie.description),
      franchise: new FormControl(garantie.franchise),
      pourcentage: new FormControl(garantie.pourcentage),
      isEditable: new FormControl(false),
      sousGaranties: new FormControl(garantie.sousGaranties),
    });

  }
  getMarques() {
    this.vehiculeService.getAllMarque().subscribe({
      next: (data: any) => {
        this.marques = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  getMouvements() {

    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C35").idCategorie).subscribe({
      next: (data: any) => {
        this.mouvements = data

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getAllUsers() {
    this.genericService.getAllUsers().subscribe({
      next: (data: any) => {
        this.users = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  getAllProduits() {
    this.produitService.getAllProduits().subscribe({
      next: (data: any) => {
        this.typeProduits = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  addPackGaranties(packIndex: number, garantie: any) {

    this.VORowsGaranties(packIndex).push(this.newGarantie(garantie));
  }
  VORowsPacks(): FormArray {
    return this.infoPack.get("VORowsPacks") as FormArray
  }
  VORowsGaranties(packIndex: number): FormArray {
    return this.VORowsPacks().at(packIndex).get("garanties") as FormArray
  }
  getAllPersonneMorale() {
    this.personneService.getAllPersonneMorale().subscribe({
      next: (data: any) => {
        this.personneMorales = data
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  // pack 
  getAllPack() {
    this.packService.getPackByProduit(this.idProduit).subscribe({
      next: (data: any) => {
        data.map((pack: any) => {
          this.packs.push(pack)

        })


      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getPack(idPack: any, packIndex: any) {

    this.packService.getPackById(idPack).subscribe({
      next: (data: any) => {
        this.garantiePart = true
        this.loadTablePack = true
        this.garantieTab = []
        data.garantie.filter((garantie: any) => {
          let franchise: any = "0"
          garantie.categorieList.filter((category: any) => {
            if (category.description == "franchise") {
              franchise = category.valeur
            }
          })
          let oneGarantie = {
            "idGarantie": garantie.idGarantie,
            "idPackComplet": garantie.idPackComplet,
            "description": garantie.description,
            "franchise": franchise,
            "pourcentage": "0",
            "sousGaranties": garantie.sousGarantieList,
          }
          this.garantieTab.push(
            {
              "idGarantie": garantie.idGarantie,
              "idPackComplet": garantie.idPackComplet,
              "description": garantie.description,
              "franchise": franchise,
              "pourcentage": "0",
            }
          )

          this.addPackGaranties(packIndex, oneGarantie)
        })
        this.initFormGarantie(packIndex)
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getAllAgences() {
    this.agencesService.getAllAgence().subscribe({
      next: (data: any) => {
        this.agences = data
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  initFormGarantie(packIndex: any) {

    // this.garantieTab.map((garantie: any) => {
    //   let garantieLigne = this.formBuilder.group({
    //     idGarantie: new FormControl(garantie.idGarantie),
    //     garantie: new FormControl(garantie.description),
    //     franchise: new FormControl(garantie.franchise),
    //     pourcentage: new FormControl(garantie.pourcentage),
    //     isEditable: new FormControl(false),
    //   });
    //   this.VORows.push(garantieLigne);
    // });

    this.dataSourceGaranties[packIndex] = new MatTableDataSource(this.VORowsGaranties(packIndex).controls);
    // this.form.get('albums') as FormArray
    this.dataSourceGaranties.paginator = this.paginator;
  }
  get VORows() {
    return this.infoPack.controls['VORows'] as FormArray;
  }
  EditGarantieLigne(form: any, index: number) {
    form.get('garanties').at(index).get('isEditable').patchValue(true);
  }
  SaveGarantieLigne(form: any, index: number) {
    form.get('garanties').at(index).get('isEditable').patchValue(false);

  }
  submitReduction() {
    if (this.formInfoGeneral.valid && this.infoVehicule.valid && this.infoPack.valid && this.infoPack.value.VORowsPacks.length != 0) {
      this.reductionJson.pack = []
      if (this.typeProduit.codeProduit != "95") {
        this.infoPack.value.VORowsPacks.map((pack: any) => {
          pack.garanties.map((garantie: any) => {
            let objectGarantie: any = {
              "idPackComplet": garantie.idPackComplet,
              "taux": garantie.pourcentage,
              "franchise": garantie.franchise
            }
            this.reductionJson.pack.push(objectGarantie);
          })
        })
      } else {
        this.infoPack.value.VORowsPacks.map((pack: any) => {
          pack.garanties.map((garantie: any) => {

            let tabSousGaranties: any = []
            garantie.sousGaranties.map((sg: any) => {
              tabSousGaranties.push({
                "idPackComplet": sg.idPackComplet
              })
            })

            let objectGarantie: any = {
              "idPackComplet": garantie.idPackComplet,
              "taux": garantie.pourcentage,
              "franchise": garantie.franchise,
              "sousGaranties": tabSousGaranties
            }
            this.reductionJson.pack.push(objectGarantie);
          })
        })
      }

      this.reductionService.addReduction(this.reductionJson).subscribe({
        next: (data: any) => {
          this.reductionSuccess = true
          this.typeProduit = {}
          this.codeReduction = data.codeReduction

          if (this.typeReduction == 261) {
            this.resetForm()
            this.step = 0
          }
          // this.idReduction=
        },
        error: (error) => {
          this.handleError(error)
          console.log(error);

        }
      });
    }


  }
  handleError(error: any) {

    switch (error.status) {
      case 500: // actif
        this.errorHandler.error = true
        this.errorHandler.msg = "Erreur systeme, veuillez contacter l'administrateur."
        break;
    }

  }
  onChangePack(pack: any, checked: any) {

    if (checked.checked && this.packsTab.find((o: any) => o.idPack0 === pack.idPack0) == undefined) {
      this.packsTab.push(pack)
      this.VORowsPacks().push(this.newPack(pack.idPack0, pack.description));
      this.getPack(pack.idPack0, this.VORowsPacks().controls.findIndex((x: any) => x.value.idPack === pack.idPack0))

    }

    else if (!checked.checked && this.packsTab.find((o: any) => o.idPack0 === pack.idPack0) != undefined) {
      this.removePack(this.VORowsPacks().controls.findIndex((x: any) => x.value.idPack === pack.idPack0))
      this.packsTab.splice(this.packsTab.map((item: any) => item.idPack0).indexOf(pack.idPack0), 1);
    }



  }
  // removePack(packIndex: number, skillIndex: number) {
  //   this.VORowsPacks(empIndex).removeAt(skillIndex);
  // }
  removePack(packIndex: number) {
    this.VORowsPacks().removeAt(packIndex);
  }
  // end pack
  //param risque 
  getAllParamRisque() {
    let existInBoth = false
    let validators: any = []

    this.paramRisqueService.getParamByProduit(this.idProduit).subscribe({
      next: (data: any) => {
        this.paramRisqueService.getWorkFlowByProduit(this.idProduit, this.idWorkFlow).subscribe({
          next: (dataWorkFlow: any) => {
            data.map((param: any) => {

              let paramRisque: ParamRisqueProduit = {} as any
              let enabled: any = null
              let obligatoire: any = null
              dataWorkFlow.filter((paramWorkFlow: any) => {

                if (param.paramRisque.idParamRisque == paramWorkFlow.paramRisque.idParamRisque) {
                  existInBoth = true
                  enabled = paramWorkFlow.enabled
                  obligatoire = paramWorkFlow.obligatoire
                }
              })

              if (this.paraRisqueProduit.find(o => param.paramRisque.idParamRisque === o.idParamRisque) == undefined && existInBoth) {

                paramRisque.idParamRisque = param.paramRisque.idParamRisque
                paramRisque.libelle = param.paramRisque.libelle[0].toUpperCase() + param.paramRisque.libelle.slice(1);
                paramRisque.formName = param.paramRisque.libelle.split(' ').map((word: any) => word.charAt(0).toUpperCase() + word.substring(1)).join('')
                paramRisque.orderChamp = param.paramRisque.orderChamp
                paramRisque.position = param.paramRisque.position
                paramRisque.typeChamp = param.paramRisque.typeChamp
                paramRisque.sizeChamp = param.paramRisque.sizeChamp

                paramRisque.reponses = param.paramRisque.categorie?.paramDictionnaires
                paramRisque.typeValeur = param.iddictionnaire
                paramRisque.defaultValue = param.valeur
                paramRisque.obligatoire = obligatoire
                paramRisque.enable = enabled
                paramRisque.category = param.paramRisque.categorieParamRisque?.description

                // this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.idParamRisque));

                if ((paramRisque.typeChamp?.description == 'String' || paramRisque.typeChamp?.description == 'Number') && paramRisque.formName != 'Marque') {
                  this.infoVehicule.addControl(paramRisque.formName, new FormArray([this.newValeur()]));
                  this.infoVehicule.addControl('typeValeur' + paramRisque.formName, new FormControl(1, [Validators.required]));

                } else if (paramRisque.typeChamp?.description == "From Table" && param.paramRisque.paramRisqueParent == null) {

                  //EXP EN ATTENTE NOM TABLE EN RETOUR 
                  this.paramRisqueService.getTableParamParent(paramRisque.idParamRisque).subscribe({
                    next: (data: any) => {
                      paramRisque.reponses = data
                      this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required]));
                    },
                    error: (error) => {

                      console.log(error);

                    }
                  })
                }
                else {
                  this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required]));
                }
                let objValeur = {
                  "type": 1,
                  "idParamRisque": paramRisque.idParamRisque
                }
                this.typeValeurRisque.push(objValeur)


                // if (paramRisque.sizeChamp != 0 && paramRisque.sizeChamp != undefined)
                //   this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required, Validators.maxLength(paramRisque.sizeChamp)]));
                // else
                //   if (paramRisque.obligatoire)
                //     this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required]));
                //   else
                //     this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue));


                this.paraRisqueProduit.push(paramRisque)



              }
              existInBoth = false
              validators = []
            })


            // this.paraRisqueProduitCategory = this.paraRisqueProduit.reduce((x: any, y: any) => {

            //   (x[y.category] = x[y.category] || []).push(y);

            //   return x;

            // }, {});
            // this.paraRisqueProduitCategory = Object.values(this.paraRisqueProduitCategory)

            this.paraRisqueProduit = Object.values(this.paraRisqueProduit)
            this.paraRisqueProduit.map(risqueCategory => {
              // risqueCategory.sort((a: any, b: any) => (a.orderChamp < b.orderChamp ? -1 : 1));

            })
        
            this.paramReady = true
          },
          error: (error) => {

            console.log(error);

          }
        })


      },
      error: (error) => {

        console.log(error);

      }
    });

  }
  submitInfoGenerales() {
    // info generales 

    if (this.formInfoGeneral.valid) {

      this.reductionJson.nomReduction = this.formInfoGeneral.get("nomReduction").value
      this.reductionJson.dateDebut = this.formInfoGeneral.get("dateDebut").value
      this.reductionJson.dateFin = this.formInfoGeneral.get("dateFin").value
      this.reductionJson.idProduit = this.typeProduit.idCodeProduit
      this.reductionJson.agences = this.formInfoGeneral.get("agences").value.filter((element: any) => element !== null);
      this.reductionJson.appAutomatique = this.formInfoGeneral.get("appAutomatique").value
      this.reductionJson.mouvementPolice = this.formInfoGeneral.get("mouvementsPolice").value.filter((element: any) => element !== null);
      this.reductionJson.canalDistributions = this.formInfoGeneral.get("canalDistribution").value.filter((element: any) => element !== null);
      this.reductionJson.utilisateurs = this.formInfoGeneral.get("utilisateurs").value.filter((element: any) => element !== null);
      this.reductionJson.isAllAgences = this.isAllAgences
      this.reductionJson.isAllUtilisateurs =this.isAllUtilisateurs
      this.reductionJson.isAllCanalDistro = this.isAllCanalDistro
      this.stepper.next();
    
    }
  }
  submitInfoProduit() {

  }

  submitParamRisque() {

    if (this.infoVehicule.valid) {
      let idparam = 0
      let paramReducTemp: any = []
      this.paraRisqueProduit.map((param: any) => {
        let idReponse: any = []
        let valMin = 0
        let valMax = 0
        let valeur = 0

        Object.keys(this.infoVehicule.value).map((paramFormName: any) => {
          if (paramFormName == param.formName) {
            idparam = param.idParamRisque

            if ((param.typeChamp?.description == 'String' || param.typeChamp?.description == 'Number') && paramFormName != "Marque") {

              if (this.infoVehicule.get(paramFormName).length == 2) {
                valMin = (this.infoVehicule.get(paramFormName) as FormArray).at(0).value.valeur
                valMax = (this.infoVehicule.get(paramFormName) as FormArray).at(1).value.valeur
              } else if (this.infoVehicule.get(paramFormName).length == 1) {
                valeur = (this.infoVehicule.get(paramFormName) as FormArray).at(0).value.valeur
              }
            } else if (param.typeChamp?.description == "From Table") {
              idReponse = this.infoVehicule.get(paramFormName).value.filter((element: any) => element !== null);
            }
            else {

              idReponse = this.infoVehicule.get(paramFormName).value.filter((element: any) => element !== null);
            }
            paramReducTemp.push({
              "idParam": idparam,
              "valMin": valMin,
              "valMax": valMax,
              "idResponseParam": idReponse,
              "valeur": valeur
            })
          }
        })


      })

      this.reductionJson.param = paramReducTemp

      this.stepper.next()
    }
  }
  changeTypeValeur(type: any, idParamRisque: number) {

    let paramRisque: any
    paramRisque = this.paraRisqueProduit.filter(param => param.idParamRisque == idParamRisque)[0]
    const index = this.typeValeurRisque.findIndex((obj: any) => obj.idParamRisque === idParamRisque)
    let objValeur = {
      "type": type,
      "idParamRisque": idParamRisque
    }


    if (index === -1)
      this.typeValeurRisque.push(objValeur)
    else {
      this.typeValeurRisque[index] = objValeur

    }


    //interval
    if (type == 2) {

      this.addValeur(paramRisque.formName)
    } else if (type == 1) { // valeur unique
      {

        this.removeValeur(0, paramRisque.formName)

      }

    }
  }
  changeTypeProduit(value: any) {

    this.step = 1
    //
    this.typeProduit = value
    this.packs=[]
    this.infoPack.reset()
    this.dataSourceGaranties=[]
    while (this.infoPack.get("VORowsPacks").length !== 0) {
      this.infoPack.get("VORowsPacks").removeAt(0)
    }
    this.idProduit = this.typeProduit?.idCodeProduit
    this.getAllParamRisque()
    this.getAllPack()

    this.typeValeurRisque = []
    this.paraRisqueProduit = []
  }
  resetForm() {
    this.formInfoGeneral.reset()

    //  (this.infoPack.get("VORowsPacks") as FormArray).clear()
    this.infoProduit.reset()
    this.infoVehicule.reset()

    this.infoPack.reset()
    this.infoPack.setControl('VORowsPacks', new FormArray([]));


    this.initFormGeneral()
    // this.dataSourceGaranties.data=[]
    // this.infoProduit.reset()
  }

  valeurs(formName: any): FormArray {

    return this.infoVehicule.get(formName) as FormArray
  }

  newValeur(): FormGroup {
    return this.formBuilder.group({
      valeur: '',
    })
  }

  addValeur(formName: any) {
    this.valeurs(formName).push(this.newValeur());
  }

  removeValeur(paramIndex: number, formName: any) {
    this.valeurs(formName).removeAt(paramIndex);
  }
  setDateDebut(dateDebut: any) {
    this.formInfoGeneral.get("dateFin").enable()
    this.dateDebut = dateDebut
  }

  
  toggleAllSelection(matSelect: MatSelect) {
    const isSelected: boolean = matSelect.options
      // The "Select All" item has the value 0
      .filter((item: MatOption) => item.value === null)
      // Get the selected property (this tells us whether Select All is selected or not)
      .map((item: MatOption) => item.selected)[0];
    // Get the first element (there should only be 1 option with the value 0 in the select)
    console.log('bonjour ines',isSelected ,matSelect.ngControl.name )
    if (isSelected ){
if(matSelect.ngControl.name=="canalDistribution")
      this.isAllCanalDistro=true

if(matSelect.ngControl.name=="utilisateurs")
      this.isAllUtilisateurs=true



if(matSelect.ngControl.name=="agences")
 this.isAllAgences=true
    }
   

    if (isSelected) {
      matSelect.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      matSelect.options.forEach((item: MatOption) => item.deselect());
    }

  }
}