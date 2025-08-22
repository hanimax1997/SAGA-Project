import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { distinctUntilKeyChanged, map, switchMap } from 'rxjs/operators';
import { AvenantService } from 'src/app/core/services/avenant.service';
import { ContratService } from 'src/app/core/services/contrat.service';
import { PackService } from 'src/app/core/services/pack.service';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2'
import { DevisService } from 'src/app/core/services/devis.service';
import { VehiculeService } from 'src/app/core/services/vehicule.service';
import { GenericService } from 'src/app/core/services/generic.service';
import { MatStepper } from '@angular/material/stepper';
import { ParamRisqueService } from 'src/app/core/services/param-risque.service';
import * as moment from 'moment';
import { DureeService } from 'src/app/core/services/duree.service';
import { AgencesService } from 'src/app/core/services/agences.service';
import { Patterns } from 'src/app/core/validiators/patterns';
import { PersonneService } from 'src/app/core/services/personne.service';
import { SearchPersonneComponent } from '../../gestion-contrat/search-personne/search-personne.component';
import { MatDialog } from '@angular/material/dialog';
import { PersonneContrat } from 'src/app/core/models/personneContrat';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { DataTransferService } from 'src/app/core/services/data-transfer.service';
import { MatPaginator } from '@angular/material/paginator';
import { ParamList, ParamRisqueProduit } from 'src/app/core/models/param-risque-produit';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogRisqueComponent } from '../../gestion-devis/dialog-risque/dialog-risque.component';
import { ConventionService } from 'src/app/core/services/convention.service';
import { ReductionService } from 'src/app/core/services/reduction.service';
import { ReductionFiltreJson } from 'src/app/core/models/reduction';
import { ParamRisque } from 'src/app/core/models/param-risque';
import { ListRisqueDialogComponent } from '../../gestion-devis/creation-devis/list-risque-dialog/list-risque-dialog.component';
import { CryptoService } from 'src/app/core/services/crypto.service';
const todayDate: Date = new Date();
export function ageValidator(control: AbstractControl): { [key: string]: boolean } | null {

  var birthday: Date = new Date(control.value);

  if ((todayDate.getFullYear() - birthday.getFullYear()) < 18) {
    return {
      'ageInf18': true
    };
  } else if((todayDate.getFullYear() - birthday.getFullYear()) > 106){
    return {
      'ageSup107' : true
    }
  }
  return null;
}

export function numberAndSlashValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    const isValid = /^\d+\/?\d*$/.test(value); // Regular expression to validate numbers and optionally one "/"
    return isValid ? null : { 'invalidNumberOrSlash': { value: control.value } };
  };
}
@Component({
  selector: 'app-application-avenant',
  templateUrl: './application-avenant.component.html',
  styleUrls: ['./application-avenant.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('enterAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)',
        }),
        animate(400),
      ]),
    ]),
  ],
})
export class ApplicationAvenantComponent {
  @ViewChild('stepper') private myStepper: MatStepper;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild('fileInput') fileInput: ElementRef;
  sousGarantieTab: any = []
  sousGarantieExist = false
  //FIXME  delete column if column==null
  franchiseExist = false
  plafondExist = false
  formuleExist = false
  maxContenue = 10000000
  displayedColumnsListOfList: string[] = ['idList', 'description', 'action'];
  acctuelPack:any ;
  formCreation: FormGroup | any;
  formApplicationAvenant: FormGroup;
  formParamRisque: FormGroup;
  formReduction: FormGroup;
  formCreationSouscripteur: FormGroup | any;
  formCreationAssure: FormGroup | any;
  formCreationConducteur: FormGroup | any;
  formCreationVehicule: FormGroup | any;
  idTypeAvenant: any;
  primeList: any;
  taxeList: any;
  basicTarif: any = {};
  selection = new SelectionModel<any>(true, []);
  avenantSave = false
  tarifReady = false
  typePersonne: any
  errorHandler = {
    "error": false,
    "msg": ""
  }
  errorTarif = {
    "error": false,
    "msg": "",
  }
  roles: any = []
  risqueSelected = false
  garantieTab: any = []
  garantieAll: any = []
  ancientPack: any = []
  newGaranties: any = []
  valeurVenale: number = 0
  formPackGaranties: FormGroup | any;
  errorPackForm = false
  loadTable: boolean = false;
  garantieSelectedIds: any = [];
  loaderTarif = false
  paraRisqueProduitCategory: any = [];
  marques: any = [];
  modeles: any = [];
  wilayas: any = [];
  agences: any = [];
  durees: any = [];
  communes_sous: any = [];
  communes_assure: any = [];
  communes_cond: any = [];
  genres: any = [];
  situations: any = [];
  professions: any = [];
  warningMessage: any = []
  controleDevis: any = []
  categories: any = ['A', 'B', 'C', 'D', 'E', 'F'];
  idPays: any
  isAssure: boolean = false;
  isConducteur: boolean = false;
  isConducteurAssure: boolean = false;
  dataSourceGroupePack: MatTableDataSource<any>;
  displayedColumnsGroupePack: string[] = ['groupe', 'pack'];
  groupesPacks: any = []
  personne: any;
  sousGarantieSelectedIds: any = [];
  risqueConsult: any = {}
  paramElement: ParamList = {} as any
  idContrat: any;
  contrat: any;
  devis: any = {};
  devisAccess: any = {};
  assure: any = {};
  souscripteur: any = {};
  conducteur: any = {};
  retourApplication: any = {};
  retourCalcul: any = {};
  PrimeTotaleTarif: any
  expandedElement: any
  oneRisqueInfo: any = []
  idProduit: any;
  dataSource: any;
  displayedColumns: string[];
  DisplayedColumnsSousGarantie = ['select', 'garantie', 'plafond', 'franchise', 'formule', 'action', 'more'];
  displayedColumnsParamRisque = ["idRisque", "paramRisque", "action"]
  displayedColumnsRisque = ["idRisque", "paramRisque"]
  displayedColumnsRisqueAdd = ['risqueNum', 'NDImmatriculation', 'groupe', 'action'];
  PrimeTotale = 0;
  Primes: any;
  packs: any = [];
  informationsPack: any = [];
  codeProduit: any
  actualControlGarantie: number;
  selectedGroup: any
  avenant: any;
  jsonAvenant: any = {};
  loaderApplication: boolean = false;
  loaderCalcul: boolean = false;
  loaderpack: boolean = false;
  calcul: boolean = false;
  now = new Date();
  PrimeAfterPruning: any;
  PrimeBonusMalus: any;
  multiRisqueProduct: any = false;
  risquesInvolved: any;
  multiRisqueAvenant: any = false;
  dataSourceParamRisque: MatTableDataSource<any>;
  idRisque: any;
  dataSourceConsultRisque: MatTableDataSource<any>;
  groupArray: any = [];
  dataSourceRisque: any = new MatTableDataSource()
  controleRisque: any = []
  risqueIndexBody = 0
  risqueIndex = 0
  risqueGroupe: any = []
  multiRisqueArray: any = []
  /***reduc + convention */
  conventions: any;
  filterReduction = ReductionFiltreJson
  reductions: any;
  defaultConvention = 'aucuneConvention'
  defaultReduction = 'aucuneReduction'
  reductionExist: any = false;
  returnedTarif: any = {};
  isCourtier = sessionStorage.getItem("roles")?.includes("COURTIER")
  agencePersonne=parseInt(sessionStorage.getItem("agence")||'0');
  groupesInvolved: any;
  risqueEdited = false;
  //file
  formStep = 0
  selectedFile: any;
  fileControle: any;
  fileSuccess = false;
  formRisqueReady: boolean;
  ///////////////// LIST //////////////
  displayedColumnsListParamRisque: any = [];
  list: { idListParamRisque: any; };
  listParamRisque: any = [];
  lengthColumnsListParamRisque: any;
  dataSourceListParamRisque: any = [];
  paramRisqueList: any = [];
  idListParamList: any;
  paraRisqueType: any = [];
  idsListParams: any = [];
  codesListParams: any = [];
  formListParamRisque: FormGroup | any;
  paramList: ParamList[] = []
  dataSourceListOfListes = new MatTableDataSource();
  indexGarantieMrp = 0
  indexSousGarantieMrp = 0
  dateMinRenouv:any;
  typeClients:any;
  typeClient:any;
  calculCapitaleMRP:any;
  isFieldReadOnly:any;
  dateMaxRenouv: Date;
  avenantOrganismeList: any[] = [];
  organismeForm: FormGroup;
  totalMontant: number = 0;
  typePerteOptions: any[] = [];
  carteOrangeRisqueRefference:FormArray ;
  promisesRisques:any=[]
  RisqueGaranties: any;
  newdata:any;
  p:any;
  statusM:any;
  groupeBeforeReduc:any;
  risquesModified:any[]= []
  tkn:string = JSON.parse(sessionStorage.getItem("access_token")||'')?.access_token
  //renouvellement + decote
  nmbVehicule = new FormControl()
  risqueStep = 0
  nbrPages = new FormControl() 
  tailleRisquee:any;
  taillersq:any;
  arantieNull: boolean;
  multiRisque: boolean;
  withFile=false;


  constructor(private cd : ChangeDetectorRef,private conventionService: ConventionService, private cryptoService: CryptoService, private reductionService: ReductionService, private _snackBar: MatSnackBar, private dataTransferService: DataTransferService, public dialog: MatDialog, private personneService: PersonneService, private formBuilder: FormBuilder, private dureeService: DureeService, private agencesService: AgencesService, private paramRisqueService: ParamRisqueService, private route: ActivatedRoute, private avenantService: AvenantService, private formBuilderAuth: FormBuilder, private router: Router, private contratService: ContratService, private packService: PackService, private devisService: DevisService, private vehiculeService: VehiculeService, private genericService: GenericService) {

    // window.onbeforeunload = (e) => {
    //  this.changeAccess();
    // };
    // router.events.subscribe((val) => {
    //   this.changeAccess();
    // });

  }

  getTypeClient() {

    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C24").idCategorie).subscribe({
      next: (data: any) => {

        this.typeClients = data
      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  initFormOrganisme(){
    this.organismeForm = this.formBuilder.group({
      organisme: ['', [Validators.required]],
      classementOrganisme: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      montant: ['', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)(\\.[0-9]+)?$')]],
      typePerte: this.formBuilder.group({
        idParam: ['']
      })
    });
  }

  getAllParamRisque() {
    let existInBoth = false
    let validators: any = []
    this.paramRisqueService.getParamByProduit(this.idProduit).subscribe({
      next: (data: any) => {

       

        this.paramRisqueService.getWorkFlowByProduit(this.idProduit, 45).subscribe({
          next: (dataWorkFlow: any) => {
            data.map((param: any) => {


              let paramRisque: ParamRisqueProduit = {} as any
              let enabled: any = null
              let obligatoire: any = null
              dataWorkFlow.filter((paramWorkFlow: any) => {
                //FIX DELETE 2ND CONDITION
                if (param.paramRisque.idParamRisque == paramWorkFlow.paramRisque.idParamRisque) {
                  existInBoth = true
                  enabled = paramWorkFlow.enabled
                  obligatoire = paramWorkFlow.obligatoire
                }
              })


            
              paramRisque.idParamRisque = param.paramRisque.idParamRisque
              paramRisque.libelle = param.paramRisque.libelle


              paramRisque.formName = param.paramRisque.libelle.split(' ').map((word: any) => word.charAt(0).toUpperCase() + word.substring(1)).join('').replace(/[°']/g, '')

              paramRisque.orderChamp = param.paramRisque.orderChamp
              paramRisque.position = param.paramRisque.position
              paramRisque.typeChamp = param.paramRisque.typeChamp
              paramRisque.sizeChamp = param.paramRisque.sizeChamp
              paramRisque.codeParam = param.paramRisque.codeParam

              paramRisque.reponses = param.paramRisque.categorie?.paramDictionnaires
              paramRisque.typeValeur = param.iddictionnaire
              paramRisque.defaultValue = param.valeur
              paramRisque.obligatoire = obligatoire
              paramRisque.enable = enabled
              paramRisque.category = param.paramRisque.categorieParamRisque?.description
              paramRisque.parent = param.paramRisque.paramRisqueParent
              paramRisque.isParent = param.paramRisque.isParent
              param?.iddictionnaire?.description == 'valeur minimum' ? paramRisque.valeurMin = param.valeur : ''
              param?.iddictionnaire?.description == 'valeur maximum' ? paramRisque.valeurMax = param.valeur : ''

              this.paraRisqueType.push(paramRisque)

            })


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

  getTypePerte() {

    this.genericService.getParam('178').subscribe((data: any[]) => {
      this.typePerteOptions = data; // Store the data for dropdown options
    });

    this.initFormOrganisme()
  }


 
  getListParamRisque(idListParam: any, idGarantie: any) {
    //get param risque by list param
    this.paramRisqueService.getListParamRisque(idListParam).subscribe((detailRisqueList: ParamRisque[]) => {

      this.listParamRisque = []
      this.displayedColumnsListParamRisque = []
      this.idsListParams = []
      this.codesListParams = []
      this.formListParamRisque = this.formBuilder.group({});
      detailRisqueList.map((detail: any) => {
        //this.idListParamList = detail.idListParamRisque.idListParamRisque;

        this.listParamRisque.push(this.paraRisqueType.find((param: any) => param.idParamRisque == detail.idParamRisqueFils.idParamRisque))

      })

      this.listParamRisque.map((paramRisque: any) => {
        if (paramRisque.sizeChamp != 0 && paramRisque.sizeChamp != null)
          this.formListParamRisque.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required, Validators.minLength(paramRisque.sizeChamp), Validators.maxLength(paramRisque.sizeChamp)]));
        else
          if (paramRisque.obligatoire)
            this.formListParamRisque.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required]));
          else
            this.formListParamRisque.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required]));

        if (paramRisque.typeChamp.code == "L08" && paramRisque.paramRisqueParent == null) {
          //EXP EN ATTENTE NOM TABLE EN RETOUR 
          this.paramRisqueService.getTableParamParent(paramRisque.idParamRisque).subscribe({
            next: (data: any) => {
              if (paramRisque.codeParam == "P279")
                paramRisque.reponses = data.filter((activite: any) => activite.is_professionnel == true)
              else
                paramRisque.reponses = data
            },
            error: (error) => {

              console.log(error);

            }
          })
        }

        this.displayedColumnsListParamRisque.push(paramRisque.formName);
        this.idsListParams.push(paramRisque.idParamRisque);
        this.codesListParams.push(paramRisque.codeParam);

      })

      this.lengthColumnsListParamRisque = this.displayedColumnsListParamRisque.length
      this.openDialogList(idGarantie,this.listParamRisque,this.idsListParams,this.codesListParams)

    })
  }

  openDialogList(idGarantie: any,listParamRisque:any,idsListParams:any,codesListParams:any) {
    const listRsq= JSON.parse(JSON.stringify(this.listParamRisque));
    let dialogRef = this.dialog.open(ListRisqueDialogComponent, {
      width: '60%',
      data: {
        displayedColumnsListParamRisque: this.displayedColumnsListParamRisque,
        idListParamList: this.idListParamList,
        listParamRisque: listParamRisque,
        formListParamRisque: this.formListParamRisque,
        garantie: this.garantieAll.find((g: any) => g.idGarantie == idGarantie),
        dataSourceListParamRisque: this.dataSourceListParamRisque,
        numberEffective: this.formParamRisque?.get("P132")?.value
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {

      if (result) {
        const data = JSON.parse(JSON.stringify(result.data));
        this.dataSourceListParamRisque = data
        const ids = idsListParams;
        const codes = codesListParams;

        this.displayedColumnsListParamRisque.splice(-1, 1);

        this.paramList = data.filter((value: any) => {
          return result.listAtt.some((cle: any) => value.hasOwnProperty(cle));
        }).map((item: { [x: string]: any; }) => {
          let result3 = [];
          let keys = Object.keys(item);
          let idreponse = null
          let description = "debase"


          for (let i = 0; i < keys.length; i++) {
            if (listRsq.find((p: any) => p.formName == keys[i])?.typeChamp?.description == 'Liste of values') {
              idreponse = item[keys[i]].idParam
              description = item[keys[i]].code

            } else {

              idreponse = null
              if (listRsq.find((p: any) => p.formName == keys[i])?.typeChamp?.description == 'From Table') {

                description = item[keys[i]].code

              } else if (listRsq.find((p: any) => p.formName == keys[i])?.typeChamp?.description != 'date') {

                if (listRsq.find((p: any) => p.formName == keys[i])?.idParamRisque == 34)
                  description = String(Number(item[keys[i]]))
                else
                  if (keys[i] == 'Marque' || keys[i] == 'Modèle') {

                    idreponse = item[keys[i]]
                    description = ''
                  } else {
                    description = item[keys[i]]
                  }



              } else {
                description = item[keys[i]]
              }
            }

            result3.push({
              idParam: ids[i],
              codeParam: codes[i],
              reponse: {
                "idReponse": idreponse,
                "description": description
              }
            });

          }
          return result3;
        });

        const list = {
          idListParamRisque: this.idListParamList,
          idGarantie: idGarantie,
          paramList: []
        } as any;

        this.paramList.map(param => {
          list.paramList.push({
            prime: '',
            paramListsValues: param
          })
        })

        let description:string=""
        const codeGarantie = this.garantieAll.find((g:any)=>g.idGarantie == idGarantie)?.codeGarantie
        if(codeGarantie=='G53'){
          list.idListParamRisque=1
          description =  "Effectifs"
        }else{
          list.idListParamRisque=2
          description =  "Matériel informatique"
        }
        let devisExist = this.devis.list.findIndex((l: any) => l.idListParamRisque == list.idListParamRisque)
        if (devisExist != -1) {
          this.devis.list[devisExist] = list
          if(this.dataSourceListOfListes.data.find((el:any)=>el.idListParamRisque==list.idListParamRisque)==undefined){
            const newData = [...this.dataSourceListOfListes.data, { idListParamRisque: list.idListParamRisque, idGarantie: idGarantie, description: description }];
            this.dataSourceListOfListes.data=newData
            this.cd.detectChanges();
          }
        }
        else {
          this.devis.list.push(list);
          const newData = [...this.dataSourceListOfListes.data, { idListParamRisque: list.idListParamRisque, idGarantie: idGarantie, description: description }];
          this.dataSourceListOfListes.data = newData
        }

        this.formListParamRisque.reset();
        if (idGarantie != '') {
          this.garantieAll.findIndex((g: any) => g.idGarantie == idGarantie) == -1 ? this.indexSousGarantieMrp++ : '';
          this.checkListSousGaranties(this.garantieAll[this.indexGarantieMrp].sousGarantieList, this.formPackGaranties.controls.find((g: any) => g.controls.idPackComplet.value == this.garantieAll[this.indexGarantieMrp].idPackComplet)?.controls?.souGarantieArray)
        }
      }
      else {
        let devisExist = this.devis.list.findIndex((l: any) => l.idListParamRisque == this.idListParamList)
        if (devisExist != -1)
          this.devis.list[devisExist].idGarantie = idGarantie
        if (idGarantie != '') {
          this.garantieAll.findIndex((g: any) => g.idGarantie == idGarantie) == -1 ? this.indexSousGarantieMrp++ : '';
          this.checkListSousGaranties(this.garantieAll[this.indexGarantieMrp]?.sousGarantieList, this.formPackGaranties.controls.find((g: any) => g.controls.idPackComplet.value == this.garantieAll[this.indexGarantieMrp]?.idPackComplet)?.controls?.souGarantieArray)
        }
      }
    });
  }

  getMedical(){
    this.paramRisqueService.getTableParamParent(133).subscribe({
      next: (data: any) => {
        this.newdata=data
  }
  });

  }

   getpro(description:any){
      for (let i = 0; i < this.newdata.length; i++) {
        if (this.newdata[i].description === description){
            return this.newdata[i];

        }
    }
    }
    getisProfession(x:any,codeRisque:any){
    for (let i = 0; i < x.length; i++) {
      if (x[i].codeRisque === codeRisque) {
          return x[i].reponse.description;
      }
    }
    return null;
    }



  openDialogMRP() {
    this.indexSousGarantieMrp = 0
    this.p=this.getisProfession(this.oneRisqueInfo,'P129');
    this.statusM=this.getpro(this.p);

    if (this.indexGarantieMrp < this.garantieAll.length) {
      if (this.formPackGaranties.controls.find((g: any) => g.controls.idPackComplet.value == this.garantieAll[this.indexGarantieMrp].idPackComplet)?.controls.checked.value) {
        if (this.garantieAll[this.indexGarantieMrp].list) {
          if (this.garantieAll[this.indexGarantieMrp].codeGarantie == "G53" && !this.statusM.is_medical) {
            this.indexSousGarantieMrp = 0;
            this.checkListSousGaranties(this.garantieAll[this.indexGarantieMrp].sousGarantieList, this.formPackGaranties.controls.find((g: any) => g.controls.idPackComplet.value == this.garantieAll[this.indexGarantieMrp].idPackComplet)?.controls?.souGarantieArray)
          }
          else {
            this.getListParamRisque(this.garantieAll[this.indexGarantieMrp].idListParamRisque, this.garantieAll[this.indexGarantieMrp].idGarantie)
          }
        }
        else {
          this.indexSousGarantieMrp = 0;
          this.checkListSousGaranties(this.garantieAll[this.indexGarantieMrp].sousGarantieList, this.formPackGaranties.controls.find((g: any) => g.controls.idPackComplet.value == this.garantieAll[this.indexGarantieMrp].idPackComplet)?.controls?.souGarantieArray)
        }
      }
    }
  }

  checkListSousGaranties(sousGarantie: any, formSousGarantie: any) {

    if (this.indexSousGarantieMrp < sousGarantie?.length) {
      if (sousGarantie[this.indexSousGarantieMrp].list && formSousGarantie.controls.find((g: any) => g.controls.idPackComplet.value == sousGarantie[this.indexSousGarantieMrp].idPackComplet)?.controls.checked.value) {
        this.getListParamRisque(sousGarantie[this.indexSousGarantieMrp].idListParamRisque, sousGarantie[this.indexSousGarantieMrp].idSousGarantie)
      }
      else {
        this.indexSousGarantieMrp++;
        this.checkListSousGaranties(sousGarantie, formSousGarantie)
      }
    }
    else {
      this.indexGarantieMrp++;
      //this.openDialogMRP()
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.dataSource.data.forEach((row: any) => this.selection.select(row));
  // }

  getSousGarantieControl(index: number, controlName: string): FormControl {

    let mainFormGroup = this.formPackGaranties.at(this.actualControlGarantie) as FormGroup;
    let souGarantieArray = mainFormGroup.get('souGarantieArray') as FormArray;

    return (souGarantieArray.at(index) as FormGroup).get(controlName) as FormControl;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: any) => {
        this.formPackGaranties.controls.map((garantie: any) => {
          garantie.value.idPackComplet == row.idPackComplet ? garantie.controls.checked.value = true : "";
        })
        this.selection.select(row)
      });
  }

  getControl(index: number, controlName: string): FormControl {
    this.actualControlGarantie = index
    return (this.formPackGaranties.at(index) as FormGroup).get(controlName) as FormControl;
  }

  changeCheckBox(index: number, controlName: string,row:any){
    // Get the FormGroup at the specified index
    const formGroup = this.formPackGaranties.at(index) as FormGroup;

    // Get the FormControl by name
    const control = formGroup.get(controlName) as FormControl;
    control.setValue(!control.value);
}
changeAllGarentierState(formGroupe: FormArray, items: any) {
  let arrayOfEllementTodelete :any[] = []
  formGroupe.controls.forEach((control: AbstractControl) => {

    // Type casting to FormGroup
    const group = control as FormGroup;
   const index =  items.garantie.findIndex((garen:any)=> {
      return   group.value.idPackComplet == garen.idPackComplet

    })
    //get the garantie
    const garantie = items.garantie[index] ;

    // Safely access the 'checked' FormControl

    const checkedControl = group.get('checked') as FormControl;
 
    if (checkedControl) {
      if(garantie.obligatoire ){
        checkedControl.disable();
        checkedControl.setValue(true);
      }else if ( this.RisqueGaranties.garantieList?.find((cat: any) => cat.idGarantie == garantie.idGarantie) != undefined) {
        checkedControl.enable();
        checkedControl.setValue(true);
      }
      else{
        if(!this.avenant.optional){
          if(garantie.active){
            checkedControl.enable();
            checkedControl.setValue(false);

          }else {
            checkedControl.disable();
            checkedControl.setValue(false);
            const index = formGroupe.controls.indexOf(group);
            arrayOfEllementTodelete.push(index)
          }
        }else {
          checkedControl.enable();
          checkedControl.setValue(false);
        }

      }
      if(this.codeProduit=="95" && this.avenant.code !="A07"){
        garantie.obligatoire? checkedControl.disable():checkedControl.enable();
        checkedControl.setValue(true);
      }

    }
  });
  arrayOfEllementTodelete.forEach((index:any)=> {
    if (index !== -1) {
      formGroupe.removeAt(index);
     this.dataSource.data.splice(index , 1);

      this.dataSource._updateChangeSubscription();
    }
  })
}


  changeAccess() {
    let devisAccess = {
      idDevisAccess: this.devisAccess?.idDevisAccess,
      devis: this.devisAccess.devis,
      accessContrat: 1,
      accessAvenant: 1
    }

    this.devisService.updateAccessDevis(devisAccess).subscribe({
      next: (data: any) => { },
      error: (error) => {

        console.log(error);

      }
    });
  }

  redirectConsultation() {
    // this.changeAccess();
    this.router.navigate(['consultation-avenants/' + this.codeProduit + '/' + this.idContrat]);
  }

  checkAccess() {
    this.devisService.getAccessByDevis(this.contrat?.idDevis).subscribe({
      next: (data: any) => {
        this.devisAccess = data;
        if (data?.accessAvenant) {
          let devisAccess = {
            idDevisAccess: data?.idDevisAccess,
            devis: data?.devis,
            accessContrat: 1,
            accessAvenant: 0
          }

          this.devisService.updateAccessDevis(devisAccess).subscribe({
            next: (data: any) => { },
            error: (error) => {

              console.log(error);

            }
          });
        }
        else {
          Swal.fire({
            title: "Une personne est en train de faire un avenant sur cette police.",
            icon: 'warning',
            allowOutsideClick: false,
            confirmButtonText: `Ok`,
            width: 400
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['consultation-avenants/' + this.codeProduit + '/' + this.idContrat]);

            }
          })
        }
      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  
  addOrganisme() {
    console.log("this.contrat", this.contrat);
    console.log("this.avenant", this.avenant);

    if (this.organismeForm.valid) {
      const formValue = this.organismeForm.value;

      // Check for duplicate classement
      const existingOrganisme = this.avenantOrganismeList.find(
        (organisme) => organisme.classementOrganisme === formValue.classementOrganisme
      );

      if (existingOrganisme) {
        this.organismeForm.get('classementOrganisme')?.setErrors({ duplicate: true });
        return;
      } else {
        this.organismeForm.get('classementOrganisme')?.setErrors(null);
      }

      // Fetch `valeurVenale` before proceeding
      this.contratService
        .getParamContratByIdRisque(
          this.contrat.idContrat,
          this.contrat.groupeList[0].idGroupe,
          this.contrat.groupeList[0].risques[0].idRisque
        )
        .subscribe({
          next: (data) => {
            // Use find to get the specific object
            this.valeurVenale = data.find((item: any) => item.libelle === "Valeur Vénal")?.reponse?.valeur;

            console.log('Valeur Venal:', this.valeurVenale);

            // Perform montant control after fetching valeurVenale
            const newTotal = this.totalMontant + Number(formValue.montant);

            console.log("New total montant:", newTotal);

            if (newTotal > this.valeurVenale) {
              Swal.fire({
                title: 'La somme des montants dépasse la Valeur Vénale',
                text: `Le montant total (${newTotal}) dépasse la valeur vénale (${this.valeurVenale}).`,
                icon: 'error',
                confirmButtonText: 'Ok',
              });
              return;
            } else {
              // console.log("Before updating totalMontant:", this.totalMontant);
              this.totalMontant = newTotal;
              // console.log("After updating totalMontant:", this.totalMontant);

              // Process the addition
              const selectedTypePerte = this.typePerteOptions.find(
                (option) => option.idParam === formValue.typePerte.idParam
              );

              const organismeEntry = {
                ...formValue,
                typePerte: {
                  idParam: selectedTypePerte.idParam,
                  description: selectedTypePerte.description,
                },
              };

              // Update lists
              this.avenantOrganismeList = [...this.avenantOrganismeList, organismeEntry];

              if (!Array.isArray(this.jsonAvenant.avenantOrganismeList)) {
                this.jsonAvenant.avenantOrganismeList = [];
              }

              const jsonEntry = {
                ...formValue,
                typePerte: { idParam: selectedTypePerte.idParam },
              };
              this.jsonAvenant.avenantOrganismeList.push(jsonEntry);

              this.organismeForm.reset();
            }
          },
          error: (err) => {
            console.error('Error fetching data:', err);
          },
        });
    }
  }





  removeOrganisme(index: number) {
    // Log the list before removal for debugging
    // console.log("before : ", this.avenantOrganismeList);

    // Check if the index exists in the list
    if (index >= 0 && index < this.avenantOrganismeList.length) {
      // Subtract the montant of the organisme being removed
      const montantToRemove = Number(this.avenantOrganismeList[index].montant);
      this.totalMontant -= montantToRemove;

      // console.log("Montant to remove:", montantToRemove);
      // console.log("New totalMontant:", this.totalMontant);

      // Remove from avenantOrganismeList
      this.avenantOrganismeList = [                                             
        ...this.avenantOrganismeList.slice(0, index),
        ...this.avenantOrganismeList.slice(index + 1)
      ];

      // Also remove from jsonAvenant.avenantOrganismeList
      if (Array.isArray(this.jsonAvenant.avenantOrganismeList)) {
        this.jsonAvenant.avenantOrganismeList = [
          ...this.jsonAvenant.avenantOrganismeList.slice(0, index),
          ...this.jsonAvenant.avenantOrganismeList.slice(index + 1)
        ];
      }
    } else {
      console.error("Invalid index provided for removal:", index);
    }

    // Log the list after removal for debugging
    console.log("after : ", this.avenantOrganismeList);
    console.log("after json : ", this.jsonAvenant.avenantOrganismeList);
  }



  ngOnInit(): void {
    this.getMedical();
    this.risquesInvolved = this.dataTransferService.getDataRisquesArray()
    // if(this.risquesInvolved){
    //   this.risquesModified = this.risquesInvolved?.map((rsq:any)=>{
    //     return {
    //       id:rsq.idRisque,
    //       modified:false
    //     }
    //   })
    // }

    
    if (this.risquesInvolved) {
      // console.log('hello', this.risquesInvolved);
    
      const risquesInvolvedArray = Array.isArray(this.risquesInvolved)
        ? this.risquesInvolved
        : [this.risquesInvolved]; // transformer en tableau si c'est un objet unique
    
      this.risquesModified = risquesInvolvedArray.map((rsq: any) => ({
        id: rsq.idRisque,
        modified: false
      }));
    }
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')
    this.idTypeAvenant = this.route.snapshot.paramMap.get('idTypeAvenant');
    this.idContrat = this.route.snapshot.paramMap.get('idContrat');
    this.idProduit = JSON.parse(sessionStorage.getItem('products') || '{}').find((parametre: any) => parametre.codeProduit == this.codeProduit).idProduit
    this.getInfoProduit()
    this.formApplicationAvenant = this.formBuilderAuth.group({
      idTypeAvenant: [this.idTypeAvenant],
      idContrat: [this.idContrat],
      dateAvenant: [{ value: new Date(), disabled: true }],
      motif: ['', [Validators.required]],
      commentaire: [''],
      agence: [this.isCourtier? this.agencePersonne:'', [Validators.required]],
    });
    this.formListParamRisque = this.formBuilder.group({});
    this.formParamRisque = this.formBuilderAuth.group({});
    this.formReduction = this.formBuilder.group({
      reduction: ['aucuneReduction'],
      convention: ['aucuneConvention'],
    });
    this.getTypeClient();
    this.getAgence();
    this.getDuree();
    this.getGenre();
    this.getSituation();
    this.getProfession();
    this.getIdPays("DZA");
    this.getMarque();
    this.getAllPack();
    this.getRoles()
    this.getAllParamRisque()
    if (this.codeProduit == '45A') { this.getTypePerte() }
    
    if (this.isCourtier) {
      this.formApplicationAvenant.get('agence')?.disable();
    } else {
      this.formApplicationAvenant.get('agence')?.enable();
    }

  }

  changeTypeClient(value: any) {
    
    this.typeClient = this.typeClients.find((type:any) => type.idParam == value)?.description
  
    //personne moral
    if (this.typeClient == "personne morale") {

      this.formCreationAssure.get("nom")?.setValidators([])
      this.formCreationAssure.get("prenom")?.setValidators([])
      this.formCreationAssure.get("dateNaissance")?.setValidators([])
      this.formCreationAssure.get("nom").disable();
      this.formCreationAssure.get("prenom").disable();
      this.formCreationAssure.get("dateNaissance").disable();
      this.formCreationAssure.get("raisonSocial")?.setValidators([Validators.required, Validators.maxLength(40)])
      this.formCreationAssure.get("raisonSocial").enable()
      this.formCreationAssure.get("nif")?.setValidators([Validators.required, Validators.pattern(Patterns.NIF)])
      this.formCreationAssure.get("nif").enable()
      this.formCreationAssure.get("email")?.setValidators([Validators.required, Validators.pattern(Patterns.email)])
      this.formCreationAssure?.get("nom")?.setValue(null)
      this.formCreationAssure?.get("prenom")?.setValue(null)
      this.formCreationAssure?.get("dateNaissance")?.setValue(null)

    } else {
      this.formCreationAssure.get("nom")?.setValidators([Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)])
      this.formCreationAssure.get("prenom")?.setValidators([Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)])
      this.formCreationAssure.get("dateNaissance")?.setValidators([Validators.required, ageValidator])
      this.formCreationAssure.get("nom").enable();
      this.formCreationAssure.get("prenom").enable();
      this.formCreationAssure.get("dateNaissance").enable();
      this.formCreationAssure.get("email")?.setValidators([Validators.pattern(Patterns.email)])
      this.formCreationAssure.get("raisonSocial")?.setValidators([])
      this.formCreationAssure.get("raisonSocial").disable()
      this.formCreationAssure?.get("raisonSocial")?.setValue(null)
      this.formCreationAssure.get("nif")?.setValidators([])
      this.formCreationAssure.get("nif").disable()
      this.formCreationAssure?.get("nif")?.setValue(null)
    }
    this.formCreationAssure.get('nif').updateValueAndValidity();
    this.formCreationAssure.get('raisonSocial').updateValueAndValidity();
    this.formCreationAssure.get('nom').updateValueAndValidity();
    this.formCreationAssure.get('prenom').updateValueAndValidity();
    this.formCreationAssure.get('dateNaissance').updateValueAndValidity();
    this.formCreationAssure.get('email').updateValueAndValidity();
  }

  getInfoProduit() {
    this.genericService.getPorduitById(this.idProduit).subscribe({
      next: (data: any) => {
        this.multiRisqueProduct = data.param_Produit_Reponses.filter((element: any) => element.idParamProduit.libelle == "multirisque")[0].reponse.description == "Oui" ? true : false

        //    this.multiRisque = data.param_Produit_Reponses.filter((element: any) => element.idParamProduit.libelle == "multirisque")[0].reponse.description == "Oui" ? true : false
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getAgence() {
    this.agencesService.getAllAgence().subscribe({
      next: (data: any) => {
        this.agences = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getDuree() {
    this.dureeService.getAllDuree().subscribe({
      next: (data: any) => {
        this.durees = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getRelation(typeChamp: any, isParent: boolean, idParamRisque: number, idReponse: number) {

    if (isParent == true)
      if (typeChamp == 'Liste of values') {
        this.paramRisqueService.getParamRelation(idParamRisque, idReponse).subscribe({
          next: (data: any) => {
            this.paraRisqueProduitCategory[0].filter((param: any) => {
              if (param.paramRisque.idParamRisque == data[0].idParamRisque) {

                param.paramRisque.categorie.paramDictionnaires = data[0].categorie.paramDictionnaires

              }
            })

          },
          error: (error) => {

            console.log(error);

          }
        })
      } else {

        let idRisqueChild = this.avenant.paramRisque.find((rs: any) => rs.parent?.idParamRisque == idParamRisque)?.idParamRisque


        if (idRisqueChild)
          this.paramRisqueService.getTableParamChild(idRisqueChild, idReponse).subscribe({
            next: (data: any) => {
              this.avenant.paramRisque.filter((param: any) => {
                if (param.idParamRisque == idRisqueChild) {
                  param.reponses = data
                  this.formParamRisque.controls[param.formName].enable()
                }

              })
              // this.paraRisqueProduit.filter((param: any) => {
              //   if (param.idParamRisque == data[0].idParamRisque) {

              //     param.reponses = data[0].categorie.paramDictionnaires
              //     this.formParamRisque.controls[param.formName].enable()

              //   }
              // })

            },
            error: (error) => {

              console.log(error);

            }
          })
      }

  }

  getAllPack() {
    this.packService.getPackByProduit(this.idProduit).subscribe({
      next: (data: any) => {
        this.packs = data
        this.getContrat();
      },
      error: (error) => {
        console.log(error);
      }
    });

  }

  getAllPackByProduit(step: any) {


    // console.log("formCreationSouscripteur------>")
    // console.log(this.formCreationSouscripteur)
    // console.log("formCreationAssure------>")
    // console.log(this.formCreationAssure)
  
    // Check if the form is invalid
// if (this.formCreationAssure.invalid) {
//   // Loop through each form control
//   Object.keys(this.formCreationAssure.controls).forEach(key => {
//     const controlErrors = this.formCreationAssure.get(key).errors;
//     if (controlErrors != null) {
//       Object.keys(controlErrors).forEach(keyError => {
//         console.log('Control ' + key + ' has error ' + keyError + ' with value ' + controlErrors[keyError]);
//       });
//     }
//   });
// }

   const formSousIsDisableorValid=this.formCreationSouscripteur.valid || this.formCreationSouscripteur.status === "DISABLED"  
   const formAssuIsDisableorValid=this.formCreationAssure.valid || this.formCreationAssure.status === "DISABLED" 


   
   const NotrecherAssure= this.formCreationAssure.get("nom")?.dirty|| this.formCreationAssure.get("prenom")?.dirty || this.formCreationAssure.get("dateNaissance")?.dirty
   const NotrecherSous= this.formCreationSouscripteur.get("nom")?.dirty|| this.formCreationSouscripteur.get("prenom")?.dirty || this.formCreationSouscripteur.get("dateNaissance")?.dirty
   const notCommuneOrPhoneAssure = this.formCreationAssure?.controls?.telephone?.status==='INVALID' || this.formCreationAssure?.controls?.commune?.status==='INVALID'
   const notCommuneOrPhoneSous =this.formCreationSouscripteur?.controls?.telephone?.status==='INVALID' || this.formCreationSouscripteur?.controls?.commune?.status==='INVALID'

   if(NotrecherAssure){
    Swal.fire(
      `Vous devez cliquer sur le button Rechercher pour l'assuré`,
      '',
      'error'
    )
    return
   }
   if(NotrecherSous){
    Swal.fire(
      `Vous devez cliquer sur le button Rechercher pour le souscripteur`,
      '',
      'error'
    )
    return 
   }
   if(notCommuneOrPhoneAssure){
    Swal.fire(
      `Veuillez verifier et corriger la commune et le numero de telephone de l'assuré avec l'identifiant : `+this.formCreationAssure?.controls?.codeClient?.value,
      '',
      'error'
    )
    
   }
   if(notCommuneOrPhoneSous){
    Swal.fire(
      `Veuillez verifier et corriger la commune et le numero de telephone du souscripteur avec l'identifiant : `+this.formCreationSouscripteur?.controls?.codeClient?.value,
      '',
      'error'
    )
    
   }



    // console.log('010101')
      // console.log('hello getallpackbyproduit',this.codeProduit == '45A', this.avenant.code==="A22"  , formAssuIsDisableorValid , formSousIsDisableorValid ,this.isAssure, this.formApplicationAvenant.valid)
console.log('formassure',formAssuIsDisableorValid,this.formCreationAssure)
    if (this.codeProduit =='45A' && (this.avenant.code==="A22"  || (formAssuIsDisableorValid && (formSousIsDisableorValid||this.isAssure) && this.formApplicationAvenant.valid))) {
    //  console.log('hjgjhgh')
      let paramBody = {};
      let getParamContratObservable;
      let getPackObservable: any
      if (this.avenant?.code == 'A13' || this.avenant?.code == 'A18') {
      
        // console.log("111111111")
        paramBody = {
          "dateMiseEnCirculation": moment(this.formParamRisque.get("P28")?.value).format('YYYY-MM-DD'),
          "duree": this.formApplicationAvenant.get("duree")?.value
        };
        getPackObservable = this.packService.getPackByProduitParam(this.idProduit, paramBody);

      } else if (step == 2) {
        
        // console.log("2222222222")
        paramBody = {
          "dateMiseEnCirculation": moment(this.formParamRisque.get("P28")?.value).format('YYYY-MM-DD'),
          "duree": this.contrat?.duree?.id_duree
        };
        getPackObservable = this.packService.getPackByProduitParam(this.idProduit, paramBody);
      } else {
      
    
        getParamContratObservable = this.contratService.getParamContratByIdRisque(this.contrat.idContrat, this.contrat.groupeList?.[0]?.idGroupe, this.contrat.groupeList?.[0]?.risques?.[0]?.idRisque);
        getPackObservable = forkJoin([getParamContratObservable]).pipe(
          switchMap(([getParamContratData]: any) => {
            if (getParamContratData) {
              paramBody = {
                "dateMiseEnCirculation": moment(getParamContratData.find((risque: any) => risque.codeRisque == "P28")?.reponse.valeur).format('YYYY-MM-DD'),
                "duree": this.contrat?.duree?.id_duree
              };
            }
            console.log("33333333333333")
            return this.packService.getPackByProduitParam(this.idProduit, paramBody);
          })
        );
      }



      if(this.avenant.code !="A17" && this.avenant.code !="A18" && this.avenant.code !="A07"){

        getPackObservable.subscribe({
        
                next: (data: any) => {
        
                  this.packs = []
        
                  data.map((pack: any) => {
        
                    this.packs.push(pack)
        
                  })
        
         console.log('blabla',this.packs)
        
         console.log('moncontat',this.contrat)
        
                  if (this.packs.some((item: any) => item.idPack0 == this.contrat.groupeList[0].pack.idPack0) || this.contrat.groupeList[0].pack.idPack0===5) {
        
                    if(this.contrat.groupeList[0].pack.idPack0===5){
        
                      if(this.avenant?.code == 'A13'){
        
                        this.contrat.groupeList[0].pack.idPack0=4
        
                      }else{
        
                        this.packs.push({description:this.contrat.groupeList[0].pack.description,idPack0:this.contrat.groupeList[0].pack.idPack0})
        
        
        
                      }
        
        
        
                    }

                    this.myStepper.next()
                  }
                  else if (step == 2 && this.codeProduit!='95' && this.packs.length != 0  ) {
                    this.avenant?.code != 'A26'? Swal.fire(
                      `L'age de véhicule ne permet pas les packs tout en 1 et tout en 1 limité`,
                      '',
                      'error'
                    ):'';
                    this.getPack(this.contrat.groupeList[0].pack.idPack0, false, false)
                    this.avenant?.code == 'A13' || this.avenant?.code == 'A18' || this.avenant?.code == 'A26' ? this.myStepper.next() : '';
                  }
                  else
                    this.myStepper.next()
                },
                error: (error: any) => {
                  console.log(error);
                }

              });
              }else{
                this.myStepper.next()
        
              }
      // let paramBody = {}
      // if (this.avenant?.code == 'A13' || this.avenant?.code == 'A18') {
      //   paramBody =
      //   {
      //     "dateMiseEnCirculation": moment(this.formParamRisque.get("P28")?.value).format('YYYY-MM-DD'),
      //     "duree": this.formApplicationAvenant.get("duree")?.value
      //   }
      // }
      // else if (step == 2) {
      //   console.log("step == 2")
      //   paramBody =
      //   {
      //     "dateMiseEnCirculation": moment(this.formParamRisque.get("P28")?.value).format('YYYY-MM-DD'),
      //     "duree": this.contrat?.duree?.id_duree
      //   }
      // }
      // else {


      //   this.contratService.getParamContratByIdRisque(this.contrat.idContrat,this.contrat.groupeList[0].idGroupe,this.contrat.groupeList[0].risques[0].idRisque).subscribe({
      //     next: (data: any) => {
      //       paramBody =
      //       {
      //         "dateMiseEnCirculation": moment(data.find((risque: any) => risque.codeRisque == "P28")?.reponse.valeur).format('YYYY-MM-DD'),
      //         "duree": this.contrat?.duree?.id_duree
      //       }
      //       },
      //       error: (error) => {

      //       }
      //     })


      // }

      // this.packService.getPackByProduitParam(this.idProduit, paramBody).subscribe({
      //   next: (data: any) => {
      //     this.packs = []
      //     data.map((pack: any) => {
      //       this.packs.push(pack)
      //     })
      //     if (this.packs.some((item: any) => item.idPack0 == this.contrat?.pack?.idPack0))
      //       this.myStepper.next()
      //     else if (step == 2) {
      //       Swal.fire(
      //         `L'age de véhicule ne permet pas les packs tout en 1 et tout en 1 limité`,
      //         '',
      //         'error'
      //       )
      //       this.getPack(this.contrat?.pack?.idPack0, false)
      //       this.avenant?.code == 'A13' || this.avenant?.code == 'A18' ? this.myStepper.next() : '';
      //     }
      //     else
      //       this.myStepper.next()
      //   },
      //   error: (error) => {
      //     console.log(error);
      //   }
      // });

    }
    else if (this.codeProduit != '45A') {

      this.myStepper.next()
    }
    if(this.isConducteur){
      this.changeRoleClient(true,"Conducteur")

    }
    if(this.isConducteurAssure){
      this.changeRoleClient(true,"ConducteurAssure")
    }
   /* if(this.avenant.code==="A22"){
      this.myStepper.next()
    }*/
  }

  getPack(idPack: any, calcul: boolean, changeRisque: any,firstLoad:boolean=false) {
    this.tarifReady = false
    this.calcul=true
    this.PrimeAfterPruning= null
    this.PrimeBonusMalus= null
    this.PrimeTotaleTarif= null
    this.loaderpack = true
    this.errorHandler.error = false
    this.errorHandler.msg = ""
    this.devis.pack = idPack
    this.devis.idPack = idPack
    this.newGaranties = []
    // console.log("reponse.valeur")
    // console.log(this.oneRisqueInfo)

    this.packService.getPackById(idPack).subscribe({
      next: (data: any) => {
        this.acctuelPack = data ; 
        this.garantieTab = []
        this.garantieAll = data.garantie

        this.valeurVenale = this.formParamRisque.value?.P40 != undefined ? this.formParamRisque.value?.P40 : this.oneRisqueInfo?.find((risque: any) => risque.codeRisque == "P40")?.reponse.valeur;
        this.DisplayedColumnsSousGarantie = ['select', 'garantie', 'plafond', 'franchise', 'formule', 'action', 'more'];
        this.franchiseExist = false
        this.plafondExist = false
        this.formuleExist = false
        if(this.avenant?.code == "A26" && (this.codeProduit == "45F" || this.codeProduit == "45L")) {
          this.groupesPacks = [{
            group: this.contrat?.groupeList?.find((group: any) => group?.pack?.idPack0 == idPack)?.idGroupe, pack: data
          }]
        } else {
          this.groupesPacks = [{
            group: this.contrat.groupeList[0].idGroupe, pack: data
          }]
        }


        this.risqueGroupe[0].idPack = idPack
        this.contratService.getPackIdRisque(this.idContrat, (this.avenant?.code == "A26" && (this.codeProduit == "45F" || this.codeProduit == "45L")) ? this.contrat.groupeList.find((group: any) => group?.pack?.idPack0 == idPack).risques[0].idRisque : this.contrat.groupeList[0].risques[0].idRisque).subscribe({
          next: (dataGarantieRisque: any) => {
            this.p=this.getisProfession(this.oneRisqueInfo,'P129');
            this.statusM=this.getpro(this.p);
            this.RisqueGaranties=dataGarantieRisque

            if (this.route.snapshot.paramMap.get('codeProduit') == "95" && this.statusM.is_professionnel) {

              let index = this.garantieAll.map((g: any) => g.codeGarantie).indexOf('G45')
              if (index !== -1) {
                this.garantieAll.splice(index, 1);
              }
            }
            else {

              let index = this.garantieAll.map((g: any) => g.codeGarantie).indexOf('G53')
              if (index !== -1) {
                this.garantieAll.splice(index, 1);
              }

            }

            if (!dataGarantieRisque.garantieList.some((item: any) => item.codeGarantie === 'G51')) {
              let index = this.garantieAll.map((g: any) => g.codeGarantie).indexOf('G51')
              if (index !== -1) {
                this.garantieAll.splice(index, 1);
              }
            }


            this.garantieAll.filter((garantie: any) => {
              let plafond: any = []
              let formule: any = []
              let franchise: any = []

              garantie.sousGarantieList?.filter((sousGarantie: any) => {
                this.sousGarantieExist = true
                let sousPlafond: any = []
                let sousFormule: any = []
                let sousFranchise: any = []
                //exp categorie sous garantie
                sousGarantie.categorieList.filter((category: any) => {

                  switch (category.description) {
                    case "plafond":

                      if (category.descriptionvVal == 'input valeur venale' && this.route.snapshot.paramMap.get('codeProduit') == "45A") { category.valeur = this.valeurVenale }

                      sousPlafond.push(category)
                      this.plafondExist = true
                      break;
                    case "formule":
                      sousFormule.push(category)
                      this.formuleExist = true
                      break;
                    case "franchise":
                      sousFranchise.push(category)
                      this.franchiseExist = true
                      break;
                  }
                })

                this.sousGarantieTab.push(
                  {
                    "idSousGarantie": sousGarantie.idSousGarantie,
                    "codeSousGarantie": sousGarantie.codeSousGarantie,
                    "idListParamRisque": sousGarantie.idListParamRisque,
                    "idPackComplet": sousGarantie.idPackComplet,
                    "description": sousGarantie.description,
                    "obligatoire": sousGarantie.obligatoire,
                    "prime": "",
                    "plafond": sousPlafond,
                    "formule": sousFormule,
                    "franchise": sousFranchise,
                  }
                )
              })

          

              garantie.categorieList.filter((category: any) => {

                switch (category.description) {
                  case "plafond":

                    if (category.descriptionvVal == 'input valeur venale' && this.route.snapshot.paramMap.get('codeProduit') == "45A") {


                      category.valeur = this.valeurVenale
                    }

                    plafond.push(category)
                    break;
                  case "formule":
                    formule.push(category)
                    break;
                  case "franchise":

                    franchise.push(category)
                    this.franchiseExist = true
                    break;
                }
              })

              let garantieContrat = dataGarantieRisque.garantieList?.find((cat: any) => cat.idGarantie == garantie.idGarantie);

              this.garantieTab.push(
                {
                  "idGarantie": garantie.idGarantie,
                  "idPackComplet": garantie.idPackComplet,
                  "codeGarantie": garantie.codeGarantie,
                  "idListParamRisque": garantie.idListParamRisque,
                  "description": garantie.description,
                  "obligatoire": garantie.obligatoire,
                  "primePre": calcul ? Number(garantieContrat?.prime).toFixed(2) : "",
                  "prime": "",
                  "bonus": "",
                  "plafond": plafond,
                  "formule": formule,
                  "franchise": franchise,
                  "sousGarantieList": new MatTableDataSource(this.sousGarantieTab)
                }
              )
    
       
              this.sousGarantieTab = []

            })
            this.garantieTab.sort((a: any, b: any) => Number(b.obligatoire) - Number(a.obligatoire));

          
            this.dataSource = new MatTableDataSource(this.garantieTab)
            this.formPackGaranties = new FormArray(
              this.dataSource.data.map(
                (x: any) => {
                  let garantieContrat = dataGarantieRisque.garantieList?.find((cat: any) => cat.idGarantie == x.idGarantie);

                  if (calcul) {
                    return new FormGroup({
                      idPackComplet: new FormControl(x.idPackComplet),
                      franchise: new FormControl({ value: garantieContrat?.categorieList?.find((cat: any) => cat.idCategorie == 18)?.valeur, disabled: (!this.avenant?.garantieAffecte ) }),
                      idfranchise: new FormControl({ value: x.franchise, disabled: x.franchise.descriptionvVal != 'input' ? true : false },),
                      plafond: new FormControl({ value: garantieContrat?.categorieList?.find((cat: any) => cat.idCategorie == 7)?.valeur, disabled: (!this.avenant?.garantieAffecte) }),
                      idplafond: new FormControl({ value: x.plafond, disabled: true },),
                      formule: new FormControl({ value: garantieContrat?.categorieList?.find((cat: any) => cat.idCategorie == 19)?.valeur, disabled: (!this.avenant?.garantieAffecte ) }),
                      idformule: new FormControl({ value: x.formule, disabled: true },),
                      checked: new FormControl({ value: (x.obligatoire ||garantieContrat!= undefined ), disabled: (x.obligatoire || !this.avenant?.garantieAffecte || this.avenant?.code == 'A21' || this.avenant?.code == 'A22' ) }),
                      souGarantieArray: new FormArray(
                        x.sousGarantieList.data.map(
                          (sous: any) => {
                            let sousGarantieContrat = garantieContrat?.sousGarantieList?.find((cat: any) => cat.idSousGarantie == sous.idSousGarantie);

                            return new FormGroup({
                              idPackComplet: new FormControl(sous.idPackComplet),
                              franchise: new FormControl({ value: sousGarantieContrat?.categorieList?.find((cat: any) => cat.idCategorie == 18)?.valeur, disabled: (!this.avenant?.garantieAffecte ) }),
                              idfranchise: new FormControl({ value: sous.franchise, disabled: sous.franchise.descriptionvVal != 'input' ? true : false },),
                              plafond: new FormControl({ value: sousGarantieContrat?.categorieList?.find((cat: any) => cat.idCategorie == 7)?.valeur, disabled: (!this.avenant?.garantieAffecte ) }),
                              idplafond: new FormControl({ value: sous.plafond, disabled: true },),
                              formule: new FormControl({ value: sousGarantieContrat?.categorieList?.find((cat: any) => cat.idCategorie == 19)?.valeur, disabled: (!this.avenant?.garantieAffecte ) }),
                              idformule: new FormControl({ value: sous.formule, disabled: true },),
                              checked: new FormControl({ value: (sous.obligatoire || sousGarantieContrat != undefined), disabled: (sous.obligatoire || !this.avenant?.garantieAffecte || this.avenant?.code == 'A21' || this.avenant?.code == 'A22' || ( this.avenant.code != "A18") ) }),

                            })
                          }
                        ))
                    })
                  }
                  else {
                    return new FormGroup({
                      idPackComplet: new FormControl(x.idPackComplet),
                      franchise: new FormControl({ value: "", disabled: false }),
                      idfranchise: new FormControl({ value: x.franchise, disabled: x.franchise.descriptionvVal != 'input' ? true : false },),
                      plafond: new FormControl({ value: "", disabled: false }),
                      idplafond: new FormControl({ value: x.plafond, disabled: true },),
                      formule: new FormControl({ value: "", disabled: false }),
                      idformule: new FormControl({ value: x.formule, disabled: true },),
                      checked: new FormControl({ value:  (x.obligatoire ||garantieContrat!= undefined ) , disabled: (x.obligatoire  || this.avenant?.code == 'A21' || this.avenant?.code == 'A22') }),
                      souGarantieArray: new FormArray(
                        x.sousGarantieList.data.map(
                          (sous: any) =>

                            new FormGroup({
                              idPackComplet: new FormControl(sous.idPackComplet),
                              franchise: new FormControl({ value: "", disabled: false }),
                              idfranchise: new FormControl({ value: sous.franchise, disabled: sous.franchise.descriptionvVal != 'input' ? true : false },),
                              plafond: new FormControl({ value: "", disabled: false}),
                              idplafond: new FormControl({ value: sous.plafond, disabled: true },),
                              formule: new FormControl({ value: "", disabled:false}),
                              idformule: new FormControl({ value: sous.formule, disabled: true },),
                              checked: new FormControl({ value: true, disabled: (sous.obligatoire || this.avenant?.code == 'A21' || this.avenant?.code == 'A22') }),

                            })

                        ))
                    })
                  }
                }
              )
            );

            this.formPackGaranties.valueChanges.subscribe(() => {
              this.errorPackForm = false
            });
            this.changeAllGarentierState(this.formPackGaranties, this.acctuelPack)

            this.loadTable = true
            this.loaderpack = false

            if (changeRisque)
              this.objectDevis(true);
          },
          error: (error: any) => {
            this.loaderTarif = false
            this.handleError(error)

          }
        });



        //FIXME  delete column if column==null
        // if (!this.franchiseExist && this.displayedColumns.indexOf("franchise") !== -1) {
        //   this.displayedColumns.splice(this.displayedColumns.indexOf("franchise"), 1);
        //   this.DisplayedColumnsSousGarantie.splice(this.DisplayedColumnsSousGarantie.indexOf("franchise"), 1);
        // }
        // if (!this.plafondExist && this.displayedColumns.indexOf("plafond") !== -1) {
        //   this.displayedColumns.splice(this.displayedColumns.indexOf("plafond"), 1);
        //   this.DisplayedColumnsSousGarantie.splice(this.DisplayedColumnsSousGarantie.indexOf("plafond"), 1);
        // }
        // if (!this.formuleExist && this.displayedColumns.indexOf("formule") !== -1) {
        //   this.displayedColumns.splice(this.displayedColumns.indexOf("formule"), 1);
        //   this.DisplayedColumnsSousGarantie.splice(this.DisplayedColumnsSousGarantie.indexOf("formule"), 1);
        // }
        // if (!this.sousGarantieExist) {
        //   this.displayedColumns.splice(this.displayedColumns.indexOf("sousGarantie"), 1);
        //   this.DisplayedColumnsSousGarantie.splice(this.DisplayedColumnsSousGarantie.indexOf("sousGarantie"), 1);
        // }

        //   this.objectDevis(true)



      },
      error: (error) => {

        console.log(error);

      }
    });
    if(!firstLoad){
      const garResCiv = this.dataSource?.data?.find((gar:any)=>gar.codeGarantie=="G53")
          if(garResCiv?.obligatoire){
            this.handleClick(garResCiv)
            this.checkAlertVol(garResCiv, true)
          }

          const garResMat = this.dataSource?.data?.find((gar:any)=>gar.codeGarantie=="G50")
    
          if(garResMat?.obligatoire || this.contrat.groupeList[0].garantieList.find((gar:any)=>gar.codeGarantie=="G50")!=undefined ){
            this.handleClick(garResMat)
            this.checkAlertVol(garResMat, true)
          }

    }

  }
  handleClick(row: any): void {
    // Add row id to selected ids
    this.garantieSelectedIds.push(row.idGarantie);
  }
  getContrat() {
    this.jsonAvenant.packCompletList = []
    this.contratService.getContratById(this.idContrat).subscribe({
      next: (datas: any) => {
        this.contrat = datas;
        this.typeClient = this.contrat?.typeClient?.description
       
        if (this.contrat.statue.code == "S09") {
          this.redirectConsultation()
        }
        if (this.contrat.convention != null)
          this.getReductionByConvention(this.contrat.convention)
        if (this.multiRisqueProduct) {

          this.contrat.groupeList.map((item: any) => {
            if (this.groupArray.length === 0 || !this.groupArray.some((gr: any) => gr.idGroupe === item.idGroupe))
              this.groupArray.push({
                description: item.description,
                idGroupe: item.idGroupe,
                idPack: item.pack?.idPack0,
                descriptionPack: item.pack?.description,
                new: 0
              })

          });
        } else {
          // let pack = 0
          // let groupeList: any = []
          // groupeList.push({ "risque": { "idRisque": this.contrat.groupeList[0].risques[0].idRisque } })
          // this.risqueGroupe.push({
          //   "idGroupe": this.contrat.groupeList[0].idGroupe,
          //   "description": "",
          //   "idPack": this.contrat.groupeList[0].pack.idPack0,
          //   "groupeList": groupeList,
          // })

        }
        // this.checkAccess();
        // this.dataSourceListParamRisque = []
        let dataList: any;

        var result0 = this.contrat.paramsRisqueContratList?.reduce((hash: any, obj: any) => {
          let key = obj.idListParamRisque.idListParamRisque;
          if (hash.hasOwnProperty(key))
            hash[key].push(obj);
          else {
            hash[key] = [obj];
          }
          return hash;
        }, {});
        result0 = Object.values(result0)


        var result: any = [];
        result0.map((res: any) => {
          result.push(res.reduce((hash: any, obj: any) => {
            let key = obj.paramGrp;
            if (hash.hasOwnProperty(key))
              hash[key].push(obj);
            else {
              hash[key] = [obj];
            }
            return hash;
          }, []));
        })

        result = Object.values(result)


        let list2 = [] as any

        result.map((lis: any) => {
          let liste = {
            idListParamRisque: '',
            paramList: []
          } as any

          let param: any

          lis.map((l: any) => {
            param = {
              prime: "",
              paramListsValues: []
            } as any

            liste.idListParamRisque = l[0].idListParamRisque.idListParamRisque
            let listparam: any = {}
            l.forEach((element: any) => {
              let formName = element.risque.libelle.split(' ').map((word: any) => word.charAt(0).toUpperCase() + word.substring(1)).join('')
              if (element?.risque?.typeChamp?.description === 'Liste of values') {
                let paramChoix = this.paraRisqueType.find((param: any) => param.codeParam == element?.risque.codeParam)?.reponses;
                listparam = {
                  ...listparam,
                  [formName]: paramChoix.find((p: any) => p.idParam == element.response.idReponse)
                };

              } else {

                if (element?.risque?.typeChamp?.description == 'From Table') {
                  listparam = {
                    ...listparam,
                    [formName]: element.response.description
                  };

                } else if (element?.risque?.typeChamp?.description != 'date') {

                  if (element.risque.idParamRisque == 34) {
                    listparam = {
                      ...listparam,
                      [formName]: element.response.description
                    };
                  }
                  else
                    if (element?.risque?.libelle == 'Marque' || element?.risque?.libelle == 'Modèle') {
                      let paramChoix = this.paraRisqueType.find((param: any) => param.codeParam == element?.risque.codeParam)?.reponses;

                      listparam = {
                        ...listparam,
                        [formName]: paramChoix.find((p: any) => p.idParam == element.response.idReponse)
                      };
                    } else {
                      listparam = {
                        ...listparam,
                        [formName]: element.response.description
                      };
                    }



                } else {
                  listparam = {
                    ...listparam,
                    [formName]: element.response.description
                  };
                }
              }

              param.paramListsValues.push({
                idParam: element.risque.idParamRisque,
                reponse: element.response
              })
            });
            this.dataSourceListParamRisque.push(listparam)
            param.prime = this.contrat.listPrimes?.find((prime: any) => prime.idListParamRisque == l[0].idListParamRisque.idListParamRisque && prime.paramGrp == l[0].paramGrp)?.prime
            liste.paramList.push(param)

          })
          list2.push(liste);
        })

        this.getParamAvenant();
        this.devis.list = list2
        this.PrimeTotale = this.contrat?.primeList?.find((p: any) => p.typePrime?.idParam == 101)?.prime;

        this.ancientPack = this.contrat.groupeList

        this.getAllConventions()
        this.getAllReductions()

        if (datas.convention) {
          this.defaultConvention = datas.convention
          this.formReduction?.get("convention")?.setValue(datas.convention)

        }
        if (datas.reduction) {
          this.defaultReduction = datas.reduction
          this.formReduction?.get("reduction")?.setValue(datas.reduction)
        }


        // this.route.snapshot.paramMap.get('codeProduit') == "95" ? this.openDialogMRP() : "";

      }

      ,
      error: (error: any) => {

        console.log(error);

      }
    });
  }

  getIdPays(codePays: string) {
    this.genericService.getPays().subscribe({
      next: (data: any) => {

        this.idPays = data.find((pays: any) => pays.codePays == codePays).idPays
        this.getWilaya();
      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  getWilaya() {
    this.genericService.getAllWilayas(this.idPays).subscribe({
      next: (data: any) => {
        this.wilayas = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getCommune(idWilaya: any, type: any) {
    this.genericService.getAllCommuneByWilaya(idWilaya).subscribe({
      next: (data: any) => {
        switch (type) {
          case 'Souscripteur':
            this.communes_sous = data
            break;
          case 'Assure':
            this.communes_assure = data
            break;
          case 'Conducteur':
            this.communes_cond = data
            break;

          default:
            break;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getGenre() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C6").idCategorie).subscribe({
      next: (data: any) => {
        this.genres = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getSituation() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C1").idCategorie).subscribe({
      next: (data: any) => {
        this.situations = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getProfession() {
    this.genericService.getProfession().subscribe({
      next: (data: any) => {
        this.professions = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getMarque() {
    this.vehiculeService.getAllMarque().subscribe({
      next: (data: any) => {
        this.marques = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getModeleByMarque(marque: any) {
    this.vehiculeService.getModelByMarque(marque).subscribe({
      next: (data: any) => {
        this.modeles = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  changeRoleClient(val: any, role: string) {
    if (val) {
      switch (role) {
        case 'Souscripteur':
          this.isAssure = true;
          // you can use this line under but this would also cause the formCreationAssure to be disabled when we disable the formSouscripteur
          //this.formCreationSouscripteur = this.formCreationAssure
          this.getCommune(this.formCreationAssure.value.wilaya, 'Souscripteur')
          this.formCreationSouscripteur = this.formBuilder.group({
            codeClient: [this.formCreationAssure?.value.idClient == '' ? null : this.formCreationAssure?.value.idClient],
            nom: [this.formCreationAssure?.controls?.nom?.value, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
            prenom: [this.formCreationAssure?.controls?.prenom?.value, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
            dateNaissance: [this.formCreationAssure?.controls?.dateNaissance?.value, [Validators.required, ageValidator]],
            nin: [{ value: this.formCreationAssure?.value.nin, disabled: false }, [Validators.pattern(Patterns.NIN)]],
            telephone: [{ value:this.formCreationAssure.value.telephone, disabled: false }, [Validators.required, Validators.pattern(Patterns.mobile)]],
            email: [{ value: this.formCreationAssure.value.email, disabled: false }, [Validators.pattern(Patterns.email)]],
            adresse: [{ value: this.formCreationAssure.value.adresse, disabled: false }, [Validators.required, Validators.maxLength(60)]],
            wilaya: [{ value: this.formCreationAssure.value.wilaya, disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
            commune: [{ value: this.formCreationAssure.value.commune, disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
            genre: [{ value: this.formCreationAssure.value.genre, disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
            situation: [{ value: this.formCreationAssure.value.situation, disabled: false }],
            profession: [{ value: this.formCreationAssure?.value?.profession, disabled: false }]
          });
          this.formCreationSouscripteur.disable()

          break;
        case 'Conducteur':
          console.log("conducteur===>",this.formCreationSouscripteur)
          this.isConducteur = true;
          this.isConducteurAssure = false;
          this.formCreationConducteur = this.formBuilder.group({
            codeClient: [this.formCreationSouscripteur?.value?.codeClient == '' ? null : { value: this.formCreationSouscripteur?.value?.codeClient, disabled: true }],
            nom: [this.formCreationSouscripteur?.controls?.nom?.value == '' ? null : { value: this.formCreationSouscripteur?.value?.nom, disabled: (this.avenant.code != 'A21' && this.avenant.code != 'A17') ? true : this.avenant.code==="A21" }, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
            prenom: [this.formCreationSouscripteur?.controls?.prenom?.value == '' ? null : { value: this.formCreationSouscripteur?.value?.prenom, disabled: (this.avenant.code != 'A21' && this.avenant.code != 'A17') ? true : this.avenant.code==="A21" }, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
            dateNaissance: [this.formCreationSouscripteur?.controls?.dateNaissance?.value == '' ? null : { value: this.formCreationSouscripteur?.value?.dateNaissance, disabled: this.avenant.code != 'A21' ? true : this.avenant.code==="A21" }],
            telephone: [{ value: this.formCreationSouscripteur?.value?.telephone, disabled: this.avenant.code==="A21" }, [Validators.required, Validators.minLength(this.formCreationSouscripteur?.value?.telephone?.length), Validators.maxLength(this.formCreationSouscripteur?.value?.telephone?.length)]],
            email: [{ value: this.formCreationSouscripteur?.value?.email, disabled: this.avenant.code==="A21" }, [Validators.pattern(Patterns.email)]],
            adresse: [{ value: this.formCreationSouscripteur?.value?.adresse, disabled: this.avenant.code==="A21" }, [Validators.required, Validators.maxLength(60)]],
            wilaya: [{ value: this.formCreationSouscripteur?.value?.wilaya, disabled: this.avenant.code == 'A17' ? true : this.avenant.code==="A21" }, [Validators.required]],
            commune: [{ value: this.formCreationSouscripteur?.value?.commune, disabled: this.avenant.code == 'A17' ? true : this.avenant.code==="A21" }, [Validators.required]],
            situation: [{ value: this.formCreationSouscripteur?.value?.situation, disabled: this.avenant.code==="A21" }],
            profession: [{ value: this.formCreationSouscripteur?.value?.profession, disabled: this.avenant.code==="A21" }, [Validators.required]],
            numeroPermis: [{ value: '', disabled: this.avenant.code != 'A21' ? true : false}, [Validators.required]],
            categoriePermis: [{ value: '', disabled: false }, [Validators.required]],
          });
          this.getCommune(this.formCreationConducteur.value.wilaya, 'Conducteur')
          this.formCreationConducteur.updateValueAndValidity()

          break;
        case 'ConducteurAssure':
          this.isConducteurAssure = true;
          this.isConducteur = false;
          this.formCreationConducteur = this.formBuilder.group({
            codeClient: [this.formCreationAssure?.get('codeClient')?.value == '' ? null : { value: this.formCreationAssure?.get('codeClient')?.value, disabled: true }],
            nom: [this.formCreationAssure?.controls?.nom?.value == '' ? null : { value: this.formCreationAssure?.get('nom')?.value, disabled: this.avenant.code != 'A17' ? true : false }, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
            prenom: [this.formCreationAssure?.controls?.prenom?.value == '' ? null : { value: this.formCreationAssure?.get('prenom')?.value, disabled:  this.avenant.code != 'A17'? true : false }, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
            dateNaissance: [this.formCreationAssure?.controls?.dateNaissance?.value == '' ? null : { value: this.formCreationAssure?.get('dateNaissance')?.value, disabled: true  }],
            telephone: [{ value: this.formCreationAssure?.get('telephone')?.value, disabled: this.avenant.code==="A21"? true: false }, [Validators.required, Validators.minLength(this.formCreationAssure?.get('telephone')?.value?.length), Validators.maxLength(this.formCreationAssure?.get('telephone')?.value?.length)]],
            email: [{ value: this.formCreationAssure?.get('email')?.value, disabled: this.avenant.code==="A21"? true: false }, [Validators.pattern(Patterns.email)]],
            adresse: [{ value: this.formCreationAssure?.get('adresse')?.value, disabled: this.avenant.code==="A21"? true: false }, [Validators.required, Validators.maxLength(60)]],
            wilaya: [{ value: this.formCreationAssure?.get('wilaya')?.value, disabled: this.avenant.code == 'A17' || this.avenant.code==="A21" ? true : false }, [Validators.required]],
            commune: [{ value: this.formCreationAssure?.get('commune')?.value, disabled: this.avenant.code == 'A17' || this.avenant.code==="A21" ? true : false }, [Validators.required]],
            situation: [{ value: this.formCreationAssure?.get('situation')?.value, disabled: this.avenant.code==="A21" ? true : false }],
            profession: [{ value: this.formCreationAssure?.get('profession')?.value, disabled: this.avenant.code==="A21" ? true : false }],
            numeroPermis: [{ value: '', disabled: this.avenant.code != 'A21' ? true : false }, [Validators.required]],
            categoriePermis: [{ value: '', disabled: false }, [Validators.required]],
          });
          this.getCommune(this.formCreationConducteur.value.wilaya, 'Conducteur')
          this.formCreationConducteur.updateValueAndValidity()
          break;

        default:
          this.isConducteurAssure = false;
          this.isConducteur = false;
          this.formCreationConducteur = this.formBuilder.group({
            codeClient: [this.conducteur?.idClient == '' || this.avenant.code == 'A21'|| this.avenant.code=='A13' ? null : { value: this.conducteur?.idClient, disabled: true }],
            nom: [{ value: this.avenant.code == 'A21'|| this.avenant.code=='A13' ? '' : this.conducteur?.nom, disabled: (this.avenant.code != 'A21' && this.avenant.code != 'A17' && this.avenant.code!="A13") ? true : false }, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
            prenom: [{ value: this.avenant.code == 'A21'|| this.avenant.code=='A13' ? '' : this.conducteur?.prenom1, disabled: (this.avenant.code != 'A21' && this.avenant.code != 'A17' && this.avenant.code!="A13") ? true : false }, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
            dateNaissance: [{ value: this.avenant.code == 'A21'|| this.avenant.code=='A13' ? '' : this.conducteur?.dateNaissance, disabled: this.avenant.code != 'A21'&& this.avenant.code!="A13" ? true : false }, [Validators.required, ageValidator]],
            telephone: [{ value: this.avenant.code == 'A21'|| this.avenant.code=='A13' ? '' : this.conducteur?.contactList?.find((contact: any) => contact?.typeContact?.code == 'CNT1')?.description, disabled: false }, [Validators.required, Validators.pattern(Patterns.mobile)]],
            email: [{ value: this.avenant.code == 'A21'|| this.avenant.code=='A13' ? '' : this.conducteur?.contactList?.find((contact: any) => contact?.typeContact?.icode == 'CNT2')?.description, disabled: false }, [Validators.pattern(Patterns.email)]],
            adresse: [{ value: this.avenant.code == 'A21'|| this.avenant.code=='A13' ? '' : this.conducteur?.adressesList?.length != 0 ? this.conducteur?.adressesList?.[0]?.description : '', disabled: false }, [Validators.required, Validators.maxLength(60)]],
            wilaya: [{ value: this.avenant.code == 'A21'|| this.avenant.code=='A13' ? '' : this.conducteur?.adressesList?.length != 0 ? this.conducteur?.adressesList?.[0]?.wilaya?.idWilaya : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
            commune: [{ value: this.avenant.code == 'A21'|| this.avenant.code=='A13' ? '' : this.conducteur?.adressesList?.length != 0 ? this.conducteur?.adressesList?.[0]?.commune?.idCommune : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
            situation: [{ value: this.avenant.code == 'A21'|| this.avenant.code=='A13' ? '' : this.conducteur?.situationFamiliale?.idParam, disabled: false }],
            profession: [{ value: this.avenant.code == 'A21'|| this.avenant.code=='A13' ? '' : this.conducteur?.adressesList?.length != 0 ? this.conducteur?.professionSecteurList?.[0]?.profession?.idProfession : '', disabled: false }],
            numeroPermis: [{ value: this.avenant.code == 'A21'|| this.avenant.code=='A13' ? '' : this.conducteur?.documentList.find((doc: any) => doc?.typeDocument?.code == "D02")?.description, disabled: this.avenant.code != 'A21' ? true : false }, [Validators.required]],
            categoriePermis: [{ value: this.avenant.code == 'A21'|| this.avenant.code=='A13' ? '' : this.conducteur?.documentList.find((doc: any) => doc?.typeDocument?.code == "D02")?.sousCategorie, disabled: false }, [Validators.required]],
          });
          break;
      }
    }
    else {
      switch (role) {
        case 'Souscripteur':
          this.isAssure = false;
          this.formCreationSouscripteur = this.formBuilder.group({
            codeClient: [this.souscripteur?.idClient == '' || this.avenant.code == 'A21' ? null : this.souscripteur?.idClient],
            nom: [this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.souscripteur?.nom, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
            prenom: [this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.souscripteur?.prenom1, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
            dateNaissance: [this.avenant.code == 'A21'|| this.avenant.code=="A13" ? null : this.souscripteur?.dateNaissance, [Validators.required, ageValidator]],
            nin: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.souscripteur?.nin, disabled: false }, [Validators.pattern(Patterns.NIN)]],
            telephone: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.souscripteur?.contactList?.find((contact: any) => contact?.typeContact?.code == 'CNT1')?.description, disabled: false }, [Validators.required, Validators.pattern(Patterns.mobile)]],
            email: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.souscripteur?.contactList?.find((contact: any) => contact?.typeContact?.code == "CNT2")?.description, disabled: false }, [Validators.pattern(Patterns.email)]],
            adresse: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.souscripteur?.adressesList?.length != 0 ? this.souscripteur?.adressesList?.[0]?.description : '', disabled: false }, [Validators.required, Validators.maxLength(60)]],
            wilaya: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.souscripteur?.adressesList?.length != 0 ? this.souscripteur?.adressesList?.[0]?.wilaya?.idWilaya : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
            commune: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.souscripteur?.adressesList?.length != 0 ? this.souscripteur?.adressesList?.[0]?.commune?.idCommune : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
            genre: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.souscripteur?.sexe?.idParam, disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
            situation: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.souscripteur?.situationFamiliale?.idParam, disabled: false }],
            profession: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.souscripteur?.professionSecteurList?.length != 0 && this.souscripteur?.professionSecteurList ? this.souscripteur?.professionSecteurList[0]?.profession?.idProfession : '', disabled: false }]
          });
          break;
        case 'Conducteur':
          this.isConducteur = false;
          this.formCreationConducteur = this.formBuilder.group({
            codeClient: [this.conducteur?.idClient == '' || this.avenant.code == 'A21'|| this.avenant.code=="A13" ? null : { value: this.conducteur?.idClient, disabled: true }],
            nom: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.conducteur?.nom, disabled: (this.avenant.code != 'A21' && this.avenant.code != 'A17') ? true : false }, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
            prenom: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.conducteur?.prenom1, disabled: (this.avenant.code != 'A21' && this.avenant.code != 'A17') ? true : false }, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
            dateNaissance: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.conducteur?.dateNaissance, disabled: this.avenant.code != 'A21' ? true : false }, [Validators.required, ageValidator]],
            telephone: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.conducteur?.contactList?.find((contact: any) => contact?.typeContact?.code == 'CNT1')?.description, disabled: false }, [Validators.required, Validators.pattern(Patterns.mobile)]],
            email: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.conducteur?.contactList?.find((contact: any) => contact?.typeContact?.icode == 'CNT2')?.description, disabled: false }, [Validators.pattern(Patterns.email)]],
            adresse: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.conducteur?.adressesList?.length != 0 ? this.conducteur?.adressesList?.[0]?.description : '', disabled: false }, [Validators.required, Validators.maxLength(60)]],
            wilaya: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.conducteur?.adressesList?.length != 0 ? this.conducteur?.adressesList?.[0]?.wilaya?.idWilaya : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
            commune: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.conducteur?.adressesList?.length != 0 ? this.conducteur?.adressesList?.[0]?.commune?.idCommune : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
            situation: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.conducteur?.situationFamiliale?.idParam, disabled: false }],
            profession: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.conducteur?.adressesList?.length != 0 ? this.conducteur?.professionSecteurList[0].profession?.idProfession : '', disabled: false }],
            numeroPermis: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.conducteur?.documentList.find((doc: any) => doc?.typeDocument?.code == "D02")?.description, disabled: this.avenant.code != 'A21' ? true : false }, [Validators.required]],
            categoriePermis: [{ value: this.avenant.code == 'A21'|| this.avenant.code=="A13" ? '' : this.conducteur?.documentList.find((doc: any) => doc?.typeDocument?.code == "D02")?.sousCategorie, disabled: false }, [Validators.required]],
          });
          break;
        case 'ConducteurAssure':
          this.isConducteurAssure = false;
          this.formCreationConducteur = this.formBuilder.group({
            codeClient: [this.conducteur?.idClient == '' || this.avenant.code == 'A21' || this.avenant.code == 'A13' ? null : { value: this.conducteur?.idClient, disabled: true }],
            nom: [{ value: this.avenant.code == 'A21' || this.avenant.code == 'A13' ? '' : this.conducteur?.nom, disabled: (this.avenant.code != 'A21' && this.avenant.code != 'A17') ? true : false }, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
            prenom: [{ value: this.avenant.code == 'A21' || this.avenant.code == 'A13' ? '' : this.conducteur?.prenom1, disabled: (this.avenant.code != 'A21' && this.avenant.code != 'A17') ? true : false }, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
            dateNaissance: [{ value: this.avenant.code == 'A21' || this.avenant.code == 'A13' ? '' : this.conducteur?.dateNaissance, disabled: this.avenant.code != 'A21' ? true : false }, [Validators.required, ageValidator]],
            telephone: [{ value: this.avenant.code == 'A21' || this.avenant.code == 'A13' ? '' : this.conducteur?.contactList?.find((contact: any) => contact?.typeContact?.code == 'CNT1')?.description, disabled: false }, [Validators.required, Validators.pattern(Patterns.mobile)]],
            email: [{ value: this.avenant.code == 'A21' || this.avenant.code == 'A13' ? '' : this.conducteur?.contactList?.find((contact: any) => contact?.typeContact?.code == 'CNT2')?.description, disabled: false }, [Validators.pattern(Patterns.email)]],
            adresse: [{ value: this.avenant.code == 'A21' || this.avenant.code == 'A13' ? '' : this.conducteur?.adressesList?.length != 0 ? this.conducteur?.adressesList?.[0]?.description : '', disabled: false }, [Validators.required, Validators.maxLength(60)]],
            wilaya: [{ value: this.avenant.code == 'A21' || this.avenant.code == 'A13' ? '' : this.conducteur?.adressesList?.length != 0 ? this.conducteur?.adressesList?.[0]?.wilaya?.idWilaya : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
            commune: [{ value: this.avenant.code == 'A21' || this.avenant.code == 'A13' ? '' : this.conducteur?.adressesList?.length != 0 ? this.conducteur?.adressesList?.[0]?.commune?.idCommune : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
            situation: [{ value: this.avenant.code == 'A21' || this.avenant.code == 'A13' ? '' : this.conducteur?.situationFamiliale?.idParam, disabled: false }],
            profession: [{ value: this.avenant.code == 'A21' || this.avenant.code == 'A13' ? '' : this.conducteur?.adressesList?.length != 0 ? this.conducteur?.professionSecteurList[0].profession?.idProfession : '', disabled: false }],
            numeroPermis: [{ value: this.avenant.code == 'A21' || this.avenant.code == 'A13' ? '' : this.conducteur?.documentList.find((doc: any) => doc?.typeDocument?.code == "D02")?.description, disabled: this.avenant.code != 'A21' ? true : false }, [Validators.required]],
            categoriePermis: [{ value: this.avenant.code == 'A21' || this.avenant.code == 'A13' ? '' : this.conducteur?.documentList.find((doc: any) => doc?.typeDocument?.code == "D02")?.sousCategorie, disabled: false }, [Validators.required]],
          });
          break;

        default:
          break;
      }
    }
  }



  showButtonSuivantRisque(): boolean {
  
    if (this.avenant.code == 'A26') {
      return !this.risquesModified.some((el: any) => el?.modified == false);
    }
    return true;
  }



  getParamAvenant() {

    this.avenantService.getAvenantById(this.idTypeAvenant).subscribe({
      next: (data: any) => {
        this.avenant = data
        
        // if(this.avenant?.duree)
        //   this.formApplicationAvenant.addControl("duree", new FormControl('', [Validators.required]))
        
        if (this.avenant.dateOuverte)
          this.formApplicationAvenant?.get("dateAvenant")?.enable()

        if (this.avenant?.code != 'A18' && this.avenant?.code != 'A13') {
           if(this.avenant?.code != 'A21' && this.avenant?.code!='A168')
           {
            this.formReduction?.get("convention")?.disable()
            this.formReduction?.get("reduction")?.disable()
          }
          else
          {
            this.formReduction?.get("convention")?.enable()
            this.formReduction?.get("reduction")?.enable()
            if(this.avenant?.code=='A168'){
              // let defaultDate = new Date() > new Date(new Date(this.contrat.dateExpiration).getTime() + 24 * 60 * 60 * 1000) ? new Date() : new Date(new Date(this.contrat.dateExpiration).getTime() + 24 * 60 * 60 * 1000);
              let defaultDate = new Date() > new Date(new Date(this.contrat.dateExpiration).getTime() + 24 * 60 * 60 * 1000) ? new Date() : new Date(new Date(this.contrat.dateExpiration).getTime() + 24 * 60 * 60 * 1000);

              this.dateMinRenouv=defaultDate
              let maxDate = new Date(defaultDate);
              maxDate.setMonth(maxDate.getMonth() + 1);
              this.dateMaxRenouv = maxDate;
              this.formApplicationAvenant?.get("dateAvenant")?.setValue(defaultDate)
              this.formApplicationAvenant?.get("dateAvenant")?.enable()

              this.getDateExpiration(this.contrat?.duree?.id_duree)

              
            }
          }
        } else {
          let defaultDate = new Date() > new Date(new Date(this.contrat.dateExpiration).getTime() + 24 * 60 * 60 * 1000) ? new Date() : new Date(new Date(this.contrat.dateExpiration).getTime() + 24 * 60 * 60 * 1000);
          this.dateMinRenouv=defaultDate
          let maxDate = new Date(defaultDate);
          maxDate.setMonth(maxDate.getMonth() + 1);
          this.dateMaxRenouv = maxDate;
          this.formApplicationAvenant?.get("dateAvenant")?.setValue(defaultDate)
          this.formApplicationAvenant?.get("dateAvenant")?.enable()

          this.getDateExpiration(this.contrat?.duree?.id_duree)
          
          this.formReduction?.get("convention")?.enable()
          this.formReduction?.get("reduction")?.enable()
        }

        this.reductionExist = data.reduction
        this.multiRisqueAvenant = this.avenant.multirisque
        if (this.multiRisqueAvenant) {
          if (this.avenant.code == 'A11') {
            this.risquesInvolved = [this.risquesInvolved]
          }
          if (this.risquesInvolved.length > 1)
            this.dataSourceConsultRisque = new MatTableDataSource(this.risquesInvolved)
          else {
            this.dataSourceConsultRisque = new MatTableDataSource<any>()
            this.dataSourceConsultRisque.data = []
            this.dataSourceConsultRisque.data.push(this.risquesInvolved[0])

          }
        } else if (!this.multiRisqueProduct) {
          this.risquesInvolved = [{
            idGroupe: this.contrat.groupeList[0].idGroupe,
            description: this.contrat.groupeList[0].description,
            idRisque: this.contrat.groupeList[0].risques[0].idRisque,
          }]
          this.groupesPacks = [{
            group: this.contrat.groupeList[0].idGroupe, pack: this.contrat.groupeList[0].pack
          }]
        }
        this.displayedColumns = this.avenant?.code == "A13" && this.codeProduit == '45A' ? ['select', 'garantie', 'plafond', 'franchise', 'formule', 'prime', 'bonus', 'action', 'sousGarantie'] : ['select', 'garantie', 'plafond', 'franchise', 'formule', 'action', 'sousGarantie'];

        this.formApplicationAvenant.addControl("agence", new FormControl("", [Validators.required]));
        this.avenant?.duree ? this.formApplicationAvenant.addControl("duree", new FormControl(this.contrat?.duree.id_duree, [Validators.required])) : this.formApplicationAvenant.addControl("duree", new FormControl(this.contrat?.duree.id_duree))

        

        if (this.avenant?.code == 'A18' || this.avenant?.code == 'A21')
          this.formApplicationAvenant.get("duree")?.disable()
        
        
        

        if ((this.avenant?.paramRisque?.length != 0 && this.avenant?.code != 'A08') || this.avenant?.packAffecte || this.avenant?.garantieAffecte) {
          this.calcul = true

        }

        if (this.multiRisqueProduct && this.avenant?.paramRisque?.length != 0) {
          this.dataSourceParamRisque = new MatTableDataSource(this.risquesInvolved)
          this.dataSourceParamRisque.paginator = this.paginator
        }
        this.avenant?.attestation && this.codeProduit != '45L' &&   this.avenant?.code != 'A22' ? this.formApplicationAvenant.addControl("attestation", new FormControl('', [Validators.required])) : "";
        if (this.avenant?.code === 'A22' && this.codeProduit!='45F') {
          this.formApplicationAvenant.addControl("attestation", new FormControl('', [Validators.required, Validators.pattern('[0-9/]*')]));
        }

        if(this.avenant?.code === 'A22' && !this.avenant?.attestation && this.codeProduit !='45A' || this.avenant?.code === 'A26'){
          if(this.avenant?.code === 'A22' && this.codeProduit=='45L')
          {
            // this.formApplicationAvenant.addControl("attestation", new FormControl('', [Validators.required, Validators.pattern('[0-9/]*')]));

            // this.formApplicationAvenant.get("attestation")?.disable();
            this.formApplicationAvenant.get("attestation")?.clearValidators();
            this.formApplicationAvenant.get("attestation")?.updateValueAndValidity();
console.log('formApplicationAvenant',this.formApplicationAvenant)
            // hfkjh
          }
          this.displayedColumnsRisque.push('refference')
          this.displayedColumnsParamRisque.splice(this.displayedColumnsParamRisque.length - 1, 0, 'refference');
          const risqueList = new FormArray(
            this.risquesInvolved.map((risk:any) => new FormGroup({
              idRisque: new FormControl(risk.idRisque),
              idGroupe: new FormControl(risk.idGroupe),
              codeParam: new FormControl(risk.codeParam),
              description: new FormControl(risk.description),
              reference: new FormControl("")
            }))
          );
          console.log("hello");

          this.carteOrangeRisqueRefference = risqueList ;

        }
       
        // // Ajouter le contrôle 'attestation' avec le validateur conditionnel
        //   if (this.avenant?.attestation && this.codeProduit != '45L') {
        //     const validators = [Validators.required];
          
        //     if (this.avenant?.code == 'A22') {
        //       validators.push(numberAndSlashValidator())
        //     }
          
        //     this.formApplicationAvenant.addControl("attestation", new FormControl('', validators));
        //   }

        this.avenant.attributs.forEach((att: any) => {
          let defaultDate;

          if ((this.avenant.code == "A13" || this.avenant.code == "A18") && att.idAtrribut.nomBdd == 'dateEffet')


            defaultDate = new Date() > new Date(new Date(this.contrat.dateExpiration).getTime() + 24 * 60 * 60 * 1000) ? new Date() : new Date(new Date(this.contrat.dateExpiration).getTime() + 24 * 60 * 60 * 1000);
          else
            defaultDate = new Date();

          //EXP case= renouvellement A13 default value date debut = date expiration contrat + 1 jr   this.avenant

          att?.idAtrribut?.type?.description == 'date' ? this.formApplicationAvenant.addControl(att.idAtrribut.nomBdd, new FormControl({ value: defaultDate, disabled: att.idAtrribut.figee })) : this.formApplicationAvenant.addControl(att.idAtrribut.nomBdd, new FormControl({ value: '', disabled: att.idAtrribut.figee }));

          if ((this.avenant.code == "A13" || this.avenant.code == "A18") && att.idAtrribut.nomBdd == 'dateEffet') {

            this.getDateExpiration(this.contrat?.duree?.id_duree)
          }
        });

        this.avenant.attributs.reverse()
        //param risques
        if (!this.multiRisqueProduct || (this.avenant.code==="A22" && this.avenant.multirisque)) {
          this.contratService.getParamContratByIdRisque(this.contrat.idContrat, this.contrat.groupeList[0].idGroupe, this.contrat.groupeList[0].risques[0].idRisque).subscribe({
            next: (data: any) => {

              this.oneRisqueInfo = data

              let valeurParamRisque: any

              this.avenant.paramRisque.forEach((param: any) => {
                valeurParamRisque = data.find((risque: any) => risque?.codeRisque == param?.paramRisque?.codeParam)

                if (valeurParamRisque?.typeChamp == "Liste of values") {
                  this.formParamRisque.addControl(param?.paramRisque?.codeParam, new FormControl({ value: valeurParamRisque?.reponse?.idParamReponse.idParam, disabled: param.grise }, [Validators.required]))
                  this.getRelation(param?.paramRisque?.typeChamp, param.paramRisque.isParent, param.paramRisque.idParamRisque, valeurParamRisque?.reponse?.idParamReponse?.idParam)
                }
                else {
                  if (valeurParamRisque?.typeChamp == "From Table") {
                    // this.formParamRisque.addControl(param?.paramRisque?.codeParam, new FormControl({ value: valeurParamRisque?.valeur?.idReponse, disabled: param.grise }, [Validators.required]))
                    // this.getRelation(param?.paramRisque?.typeChamp?.code, param.paramRisque.isParent, param.paramRisque.idParamRisque, valeurParamRisque?.idParamReponse?.idParam)
                    //FIXME PARAM VALEUR

                    if (param.paramRisque.paramRisqueParent == null) {
                      //EXP EN ATTENTE NOM TABLE EN RETOUR 
                      this.paramRisqueService.getTableParamParent(param.paramRisque.idParamRisque).subscribe({
                        next: (data: any) => {
                          if (param.paramRisque.codeParam == "P279")
                            param.paramRisque.reponses = data.filter((activite: any) => activite.is_professionnel == true)
                          else
                            param.paramRisque.reponses = data

                          //this.formParamRisque.addControl(param?.paramRisque?.codeParam, new FormControl({ value:Number(valeurParamRisque?.reponse?.valeur), disabled: param.grise }, [Validators.required]))

                        },

                        error: (error) => {

                          console.log(error);

                        }
                      })
                    }

                    // this.getRelation(param?.paramRisque?.typeChamp?.code,param.paramRisque.isParent, param.paramRisque.idParamRisque, param?.idParamReponse?.idParam)

                  }
                  console.log("valpara",param)
                  if (valeurParamRisque?.codeRisque == 'P25') {

                    this.getModeleByMarque(valeurParamRisque?.reponse?.idParamReponse.idParam)
                    this.formParamRisque.addControl(param?.paramRisque?.codeParam, new FormControl({ value: "" + valeurParamRisque?.reponse?.idParamReponse.idParam, disabled: param.grise }, [Validators.required]))
                  }
                  else if (valeurParamRisque?.codeRisque == 'P26')
                    this.formParamRisque.addControl(param?.paramRisque?.codeParam, new FormControl({ value: "" + valeurParamRisque?.reponse?.idParamReponse.idParam, disabled: param.grise }, [Validators.required]))
                  else if (this.codeProduit == '96' && this.avenant?.code == 'A07')
                    this.formParamRisque.addControl(param?.paramRisque?.codeParam, new FormControl({ value: valeurParamRisque?.reponse.valeur, disabled: param.grise }, [Validators.required, Validators.min(valeurParamRisque?.reponse.valeur)]))
                  else {

                    this.formParamRisque.addControl(param?.paramRisque?.codeParam, new FormControl({ value: valeurParamRisque?.reponse.valeur, disabled: param.grise }, [Validators.required]))
                  }
                }
                //addcontrol 
                this.paraRisqueType.map((rs: any) => {

                  // console.log("rs================>")
                  // console.log(rs)

                  if (this.formParamRisque.get(rs.codeParam)) {

                    if (rs.valeurMin)
                      this.formParamRisque.get(rs.codeParam)?.addValidators([Validators.min(rs?.valeurMin)])
                    if (rs.valeurMax)
                      this.formParamRisque.get(rs.codeParam)?.addValidators([Validators.max(rs?.valeurMax)])
                    if (rs.sizeChamp != 0 && rs.sizeChamp != null)
                      this.formParamRisque.get(rs.codeParam)?.addValidators([Validators.minLength(rs.sizeChamp), Validators.maxLength(rs.sizeChamp)])
                    else
                      if (rs.obligatoire)
                        this.formParamRisque.get(rs.codeParam)?.addValidators([Validators.required])

                  }

                })
              });

              this.formRisqueReady = true
            },
            error: (error) => {

              console.log(error);

            }
          })
        } else {
          //param risques
          let valeurParamRisque: any
          this.avenant.paramRisque.forEach((param: any) => {
            //   this.contrat.groupeList.map((gr:any)=>{
            //     valeurParamRisque= gr.risques.find((risque: any) => risque?.paramRisque?.codeParam == param?.paramRisque?.codeParam)
            //   })
            // //  let valeurParamRisque = this.contrat?.risqueList?.find((risque: any) => risque?.paramRisque?.codeParam == param?.paramRisque?.codeParam)

            if (param?.paramRisque?.typeChamp?.description == "Liste of values") {
              this.formParamRisque.addControl(param?.paramRisque?.codeParam, new FormControl({ value: valeurParamRisque?.idParamReponse?.idParam, disabled:  param.grise }, [Validators.required]))
              // this.getRelation(param.paramRisque.isParent, param.paramRisque.idParamRisque, valeurParamRisque?.idParamReponse?.idParam)
            }
            else {
              if (param?.paramRisque?.typeChamp?.description == "From Table") {
                // this.formParamRisque.addControl(param?.paramRisque?.codeParam, new FormControl({ value: valeurParamRisque?.valeur?.idReponse, disabled: param.grise }, [Validators.required]))
                // this.getRelation(param?.paramRisque?.typeChamp?.code, param.paramRisque.isParent, param.paramRisque.idParamRisque, valeurParamRisque?.idParamReponse?.idParam)
                //FIXME PARAM VALEUR

                if (param.paramRisque.paramRisqueParent == null) {
                  //EXP EN ATTENTE NOM TABLE EN RETOUR 
                  this.paramRisqueService.getTableParamParent(param.paramRisque.idParamRisque).subscribe({
                    next: (data: any) => {

                      if (param.paramRisque.codeParam == "P279")
                        param.paramRisque.reponses = data.filter((activite: any) => activite.is_professionnel == true)
                      else
                        param.paramRisque.reponses = data

                      //this.formParamRisque.addControl(param?.paramRisque?.codeParam, new FormControl({ value:Number(valeurParamRisque?.reponse?.valeur), disabled: param.grise }, [Validators.required]))

                    },

                    error: (error) => {

                      console.log(error);

                    }
                  })
                }

                // this.getRelation(param?.paramRisque?.typeChamp?.code,param.paramRisque.isParent, param.paramRisque.idParamRisque, param?.idParamReponse?.idParam)

              }
              if (valeurParamRisque?.paramRisque?.codeParam == 'P25') {
                this.getModeleByMarque(valeurParamRisque?.idParamReponse?.idParam)
                this.formParamRisque.addControl(param?.paramRisque?.codeParam, new FormControl({ value: "" + valeurParamRisque?.idParamReponse?.idParam, disabled: param.grise }, [Validators.required]))
              }
              else if (valeurParamRisque?.paramRisque?.codeParam == 'P26')
                this.formParamRisque.addControl(param?.paramRisque?.codeParam, new FormControl({ value: "" + valeurParamRisque?.idParamReponse?.idParam, disabled: param.grise }, [Validators.required]))
              else
                this.formParamRisque.addControl(param?.paramRisque?.codeParam, new FormControl({ value: valeurParamRisque?.valeur, disabled: param.grise }, [Validators.required]))
            }

          });
          this.formParamRisque.addControl("groupe", new FormControl('', []));
          this.formParamRisque.addControl("newGroupe", new FormControl('', []));
          this.formRisqueReady = true
        }

        this.paraRisqueProduitCategory = this.avenant.paramRisque.reduce((x: any, y: any) => {

          (x[y.paramRisque.categorieParamRisque.description] = x[y.paramRisque.categorieParamRisque.description] || []).push(y);

          return x;

        }, {});
        this.paraRisqueProduitCategory = Object.values(this.paraRisqueProduitCategory)

        this.paraRisqueProduitCategory.map((risqueCategory: any) => {
          risqueCategory.sort((a: any, b: any) => (a.paramRisque.orderChamp < b.paramRisque.orderChamp ? -1 : 1));

        })
      
        this.initForm();

        if (!this.multiRisqueProduct) {
          console.log("this.getPack ",this.contrat?.groupeList )
          this.getPack(this.contrat?.groupeList[0]?.pack?.idPack0, true, false,true)

        }
        if (this.risquesInvolved.length > 1) {
          this.groupesInvolved = this.risquesInvolved.reduce((acc: any, objet: any) => {
            if (!acc[objet.idGroupe]) {
              acc[objet.idGroupe] = [];
            }

            acc[objet.idGroupe].push(objet);

            return acc;
          }, {});

        }

        let groupeList: any = []
        if (this.risquesInvolved.length > 1 && this.multiRisqueAvenant) {
          let dataSourcePackGroupe: any = []
          let pack = 0
          Object.keys(this.groupesInvolved).map((groupe: any) => {
            this.contrat.groupeList.map((item: any) => {
              if (groupe == item.idGroupe) {
                dataSourcePackGroupe.push({
                  idGroupe: item.idGroupe, descriptionGroupe: item.description, pack: item.pack.idPack0, newGroupe: 1

                })
                this.groupesInvolved[groupe].pack = item.pack.idPack0

                //groupe.pack = item.pack.idPack0
              }
            });


          })

          this.dataSourceGroupePack = new MatTableDataSource(dataSourcePackGroupe)
          // if (this.avenant.paramRisque.length == 0 && this.multiRisqueProduct) {
          //   this.risqueGroupe.push({
          //     description: "",
          //     idGroupe: idGroupe,
          //     idPack: idPack,
          //     groupeList: [],
          //   });

          // }


          Object.keys(this.groupesInvolved).map((groupe: any) => {

            this.groupesInvolved[groupe].map((rs: any) => {

              groupeList.push({ "risque": { "idRisque": rs.idRisque } })
            })

            this.risqueGroupe.push({
              "idGroupe": groupe,
              "description": "",
              "idPack": this.groupesInvolved[groupe].pack,
              "groupeList": groupeList,
            })
            groupeList = []
          })

        }
        else if (this.risquesInvolved.length == 1) {
          let pack = 0
          let dataSourcePackGroupe: any = []
          this.contrat.groupeList.map((item: any) => {
            if (this.risquesInvolved[0].idGroupe == item.idGroupe) {
              dataSourcePackGroupe.push({
                idGroupe: item.idGroupe, descriptionGroupe: item.description, pack: item.pack.idPack0, newGroupe: 1

              })
              pack = item.pack.idPack0
            }
          });

          this.dataSourceGroupePack = new MatTableDataSource(dataSourcePackGroupe)
          groupeList.push({ "risque": { "idRisque": this.risquesInvolved[0].idRisque } })
          this.risqueGroupe.push({
            "idGroupe": this.risquesInvolved[0].idGroupe,
            "description": "",
            "idPack": pack,
            "groupeList": groupeList,
          })

        }



      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getReferenceControl(index: number): FormControl {
    const control = this.carteOrangeRisqueRefference?.at(index).get('reference') as FormControl;

    if (control instanceof FormControl) {
        // Apply required validator directly (no checking)
        control.setValidators([Validators.required, ...control.validator ? [control.validator] : []]);
        control.updateValueAndValidity(); // Trigger revalidation
        if (this.avenant?.code === 'A22'&& this.codeProduit=='45L') {
          control.setValidators ([Validators.required, Validators.pattern('[a-zA-Z0-9/]*')]);



        }
        
        return control;


    }
    return new FormControl('', Validators.required);
}

  initForm() {
    this.contrat?.personnesList?.forEach((element: any) => {
      element.personne?.contactList?.forEach((contact: any) => {
        if (contact?.typeContact?.code == 'CNT1' && contact?.description?.startsWith("0"))
          contact.description = contact.description.substring(1)
      });


      switch (element?.role?.code) {
        case 'CP233':
          this.conducteur = element?.personne
          this.getCommune(this.conducteur?.adressesList?.[0]?.wilaya?.idWilaya, 'Conducteur')
          break;
        case 'CP234':
          this.souscripteur = element?.personne
          this.getCommune(this.souscripteur?.adressesList?.[0]?.wilaya?.idWilaya, 'Souscripteur')
          break;
        case 'CP235':
          this.assure = element?.personne
          this.getCommune(this.assure?.adressesList?.[0]?.wilaya?.idWilaya, 'Assure')
          break;
        case 'CP236':
          this.souscripteur = element?.personne
          this.assure = element?.personne
          this.isAssure = true
          this.getCommune(this.souscripteur?.adressesList?.[0]?.wilaya?.idWilaya, 'Souscripteur')
          this.getCommune(this.assure?.adressesList?.[0]?.wilaya?.idWilaya, 'Assure')
          break;
        case 'CP237':
          this.souscripteur = element?.personne
          this.conducteur = element?.personne
          this.isConducteur = true
          this.getCommune(this.conducteur?.adressesList?.[0]?.wilaya?.idWilaya, 'Conducteur')
          this.getCommune(this.souscripteur?.adressesList?.[0]?.wilaya?.idWilaya, 'Souscripteur')
          break;
        case 'CP240':
          this.assure = element?.personne
          this.conducteur = element?.personne
          this.isConducteurAssure = true
          this.getCommune(this.conducteur?.adressesList?.[0]?.wilaya?.idWilaya, 'Conducteur')
          this.getCommune(this.assure?.adressesList?.[0]?.wilaya?.idWilaya, 'Assure')
          break;
        case 'CP238':
          this.souscripteur = element?.personne
          this.assure = element?.personne
          this.conducteur = element?.personne
          this.isAssure = true
          this.isConducteurAssure = true
          this.getCommune(this.conducteur?.adressesList?.[0]?.wilaya?.idWilaya, 'Conducteur')
          this.getCommune(this.souscripteur?.adressesList?.[0]?.wilaya?.idWilaya, 'Souscripteur')
          this.getCommune(this.assure?.adressesList?.[0]?.wilaya?.idWilaya, 'Assure')
          break;

        default:
          break;
      }
    });

    this.typeClient == this.contrat?.typeClient?.description

    this.formCreationSouscripteur = this.formBuilder.group({
      codeClient: [this.souscripteur?.idClient == '' ? null : this.souscripteur?.idClient],
      nom: [this.souscripteur?.nom, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
      prenom: [this.souscripteur?.prenom1, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
      dateNaissance: [this.souscripteur?.dateNaissance, [Validators.required, ageValidator]],
      nin: [{ value: this.souscripteur?.nin, disabled: false }, [Validators.pattern(Patterns.NIN)]],
      telephone: [{ value: this.souscripteur?.contactList?.find((contact: any) => contact?.typeContact?.code == 'CNT1')?.description, disabled: false }, [Validators.required, Validators.pattern(Patterns.mobile)]],
      email: [{ value: this.souscripteur?.contactList?.find((contact: any) => contact?.typeContact?.code == "CNT2")?.description, disabled: false }, [Validators.pattern(Patterns.email)]],
      adresse: [{ value: this.souscripteur?.adressesList?.length != 0 ? this.souscripteur?.adressesList?.[0]?.description : '', disabled: false }, [Validators.required, Validators.maxLength(60)]],
      wilaya: [{ value: this.souscripteur?.adressesList?.length != 0 ? this.souscripteur?.adressesList?.[0]?.wilaya?.idWilaya : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
      commune: [{ value: this.souscripteur?.adressesList?.length != 0 ? this.souscripteur?.adressesList?.[0]?.commune?.idCommune : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
      genre: [{ value: this.souscripteur?.sexe?.idParam, disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
      situation: [{ value: this.souscripteur?.situationFamiliale?.idParam, disabled: false }],
      profession: [{ value: this.souscripteur?.professionSecteurList?.length != 0 && this.souscripteur?.professionSecteurList ? this.souscripteur?.professionSecteurList[0]?.profession?.idProfession : '', disabled: false }]
    });
    if(this.typeClient =='personne physique'){
      this.formCreationSouscripteur.disable()
    }
    if (this.avenant.code == 'A17') {
      this.formCreationAssure = this.formBuilder.group({
        codeClient: [this.assure?.idClient == '' ? null : this.assure?.idClient],
        raisonSocial: [{ value: this.assure?.raisonSocial, disabled: true }, this.typeClient == "personne physique" ? [] : [Validators.required]],
        nom: [{ value: this.assure?.nom, disabled: true }, this.typeClient == "personne physique" ? [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)] : []],
        prenom: [{ value: this.assure?.prenom1, disabled: true }, this.typeClient == "personne physique" ? [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)] : []],
        dateOuverture: [{ value: this.assure?.dateOuverture, disabled: true }],
        dateNaissance: [{ value: this.assure?.dateNaissance, disabled: true }, [Validators.required, ageValidator]],
        nin: [{ value: this.assure?.nin, disabled: true }, [Validators.pattern(Patterns.NIN)]],
        nif: [{ value: this.assure?.nif, disabled: true }, this.typeClient == "personne physique" ? [Validators.pattern(Patterns.NIF)] : [Validators.required, Validators.pattern(Patterns.NIF)]],
        telephone: [{ value: this.assure?.contactList?.find((contact: any) => contact?.typeContact?.code == 'CNT1')?.description, disabled: true }, [Validators.required, Validators.pattern(Patterns.mobile)]],
        email: [{ value: this.assure?.contactList?.find((contact: any) => contact?.typeContact?.code == "CNT2")?.description, disabled: true }, [Validators.pattern(Patterns.email)]],
        adresse: [{ value: this.assure?.adressesList?.length != 0 ? this.assure?.adressesList?.[0]?.description : '', disabled: true }, [Validators.required, Validators.maxLength(60)]],
        wilaya: [{ value: this.assure?.adressesList?.length != 0 ? this.assure?.adressesList?.[0]?.wilaya?.idWilaya : '', disabled: true }, [Validators.required]],
        commune: [{ value: this.assure?.adressesList?.length != 0 ? this.assure?.adressesList?.[0]?.commune?.idCommune : '', disabled: true }, [Validators.required]],
        genre: [{ value: this.assure?.sexe?.idParam, disabled: true }, [Validators.required]],
        situation: [{ value: this.assure?.situationFamiliale?.idParam, disabled: true }],
        rib: [{ value: this.assure?.adressesList?.length != 0 ? this.assure?.payment[0]?.donneBancaire?.description : '', disabled: true }, [Validators.pattern(Patterns.RIB)]]
      });
    }
    else {
      this.formCreationAssure = this.formBuilder.group({
        codeClient: [this.assure?.idClient == '' ? null : this.assure?.idClient],
        typeClient: [this.contrat?.typeClient.idParam],
        raisonSocial: [{ value: this.assure?.raisonSocial, disabled: true }, this.typeClient == "personne physique" ? [] : [Validators.required]],
        nom: [{ value: this.assure?.nom, disabled: this.avenant.code != 'A21' ? true : false }, this.typeClient == "personne physique" ? [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)] : []],
        prenom: [{ value: this.assure?.prenom1, disabled: this.avenant.code != 'A21' ? true : false }, this.typeClient == "personne physique" ? [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)] : []],
        dateOuverture: [{ value: this.assure?.dateOuverture, disabled: this.avenant.code != 'A21' ? true : false }],
        dateNaissance: [{ value: this.assure?.dateNaissance, disabled: this.avenant.code != 'A21' ? true : false }, [Validators.required, ageValidator]],
        nin: [{ value: this.assure?.nin, disabled: this.avenant.code != 'A21' ? true : false }, [Validators.pattern(Patterns.NIN)]],
        nif: [{ value: this.assure?.nif, disabled: this.avenant.code != 'A21' ? true : false }, this.typeClient == "personne physique" ? [Validators.pattern(Patterns.NIF)] : [Validators.required, Validators.pattern(Patterns.NIF)]],
        telephone: [{ value: this.assure?.contactList?.find((contact: any) => contact?.typeContact?.code == 'CNT1')?.description, disabled: false }, [Validators.required, Validators.pattern(Patterns.mobile)]],
        email: [{ value: this.assure?.contactList?.find((contact: any) => contact?.typeContact?.code == 'CNT2')?.description, disabled: false }, [Validators.pattern(Patterns.email)]],
        adresse: [{ value: this.assure?.adressesList?.length != 0 ? this.assure?.adressesList?.[0]?.description : '', disabled: false }, [Validators.required, Validators.maxLength(60)]],
        wilaya: [{ value: this.assure?.adressesList?.length != 0 ? this.assure?.adressesList?.[0]?.wilaya?.idWilaya : '', disabled: false }, [Validators.required]],
        commune: [{ value: this.assure?.adressesList?.length != 0 ? this.assure?.adressesList?.[0]?.commune?.idCommune : '', disabled: false }, [Validators.required]],
        genre: [{ value: this.assure?.sexe?.idParam, disabled: this.avenant.code != 'A21' ? true : false }, [Validators.required]],
        situation: [{ value: this.assure?.situationFamiliale?.idParam, disabled: false }],
        rib: [{ value: this.assure?.adressesList?.length != 0 ? this.assure?.payment[0]?.donneBancaire?.description : '', disabled: false }, [Validators.pattern(Patterns.RIB)]]
      });


    }

    this.typeClient == "personne physique" ? this.formCreationAssure.addControl("profession", new FormControl({ value: this.assure?.professionSecteurList?.length != 0 ? this.assure?.professionSecteurList[0].profession?.idProfession : '', disabled: this.avenant.code == 'A17' ? true : false })) : ''

    if (this.codeProduit == '45A')
      this.formCreationConducteur = this.formBuilder.group({
        codeClient: [this.conducteur?.idClient == '' ? null : { value: this.conducteur?.idClient, disabled: true }],
        nom: [{ value: this.conducteur?.nom, disabled: (this.avenant.code != 'A21' && this.avenant.code != 'A17') ? true : false }, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
        prenom: [{ value: this.conducteur?.prenom1, disabled: (this.avenant.code != 'A21' && this.avenant.code != 'A17') ? true : false }, [Validators.required, Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
        dateNaissance: [{ value: this.conducteur?.dateNaissance, disabled: this.avenant.code != 'A21' ? true : false }, [Validators.required, ageValidator]],
        telephone: [{ value: this.conducteur?.contactList?.find((contact: any) => contact?.typeContact?.code == 'CNT1')?.description, disabled: false }, [Validators.required, Validators.pattern(Patterns.mobile)]],
        email: [{ value: this.conducteur?.contactList?.find((contact: any) => contact?.typeContact?.code == 'CNT2')?.description, disabled: false }, [Validators.pattern(Patterns.email)]],
        adresse: [{ value: this.conducteur?.adressesList?.length != 0 ? this.conducteur?.adressesList[0]?.description : '', disabled: false }, [Validators.required, Validators.maxLength(60)]],
        wilaya: [{ value: this.conducteur?.adressesList?.length != 0 ? this.conducteur?.adressesList?.[0]?.wilaya?.idWilaya : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
        commune: [{ value: this.conducteur?.adressesList?.length != 0 ? this.conducteur?.adressesList?.[0]?.commune?.idCommune : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
        situation: [{ value: this.conducteur?.situationFamiliale?.idParam, disabled: false }],
        profession: [{ value: this.conducteur?.professionSecteurList ? (this.conducteur?.professionSecteurList?.length != 0 ? this.conducteur?.professionSecteurList[0]?.profession?.idProfession : ''):'', disabled: false }],
        numeroPermis: [{ value: this.conducteur?.documentList.filter((doc: any) => doc?.typeDocument?.code == "D02")[this.conducteur?.documentList?.length == 0 ? this.conducteur?.documentList?.length : this.conducteur?.documentList?.length - 1]?.description, disabled: this.avenant.code != 'A21' ? true : false }, [Validators.required]],
        categoriePermis: [{ value: this.conducteur?.documentList.filter((doc: any) => doc?.typeDocument?.code == "D02")[this.conducteur?.documentList?.length == 0 ? this.conducteur?.documentList?.length : this.conducteur?.documentList?.length - 1]?.sousCategorie, disabled: false }, [Validators.required]],
      });
  }

  onChangeValueFormAssure(field:string,newAddress: string) {
    if(!this.isAssure){
      return
    }
    this.formCreationSouscripteur.get(field).setValue(newAddress);
  }

  recherchePersonne(type: any) {


    let filtre: any;
    switch (type) {
      case 'souscripteur':
        this.formCreationSouscripteur.get("nom")?.markAsPristine();
        this.formCreationSouscripteur.get("prenom")?.markAsPristine();
        this.formCreationSouscripteur.get("dateNaissance")?.markAsPristine();

        if(this.avenant.code !== 'A17'){
        this.formCreationSouscripteur.get("codeClient").setValue(null)
        }
        this.formCreationSouscripteur.get("dateNaissance").setValue(moment.utc(this.formCreationSouscripteur.get("dateNaissance").value).add(1,"hour").toISOString())
        filtre = this.formCreationSouscripteur.value;
        break;
      case 'assure':  
      this.formCreationAssure.get("nom")?.markAsPristine();
      this.formCreationAssure.get("prenom")?.markAsPristine();
      this.formCreationAssure.get("dateNaissance")?.markAsPristine();   
      if(this.avenant.code !== 'A17'){
        this.formCreationAssure.get("codeClient").setValue(null)

      }
        if (this.typeClient == "personne physique") {
          //this.formCreationAssure.get("dateNaissance").setValue(moment(this.formCreationAssure.get("dateNaissance").value).format("YYYY-MM-DDT00:00:00.000+00:00"));
          this.formCreationAssure.value.dateNaissance= moment.utc(this.formCreationAssure.value.dateNaissance).add(1,"hour").toISOString()

        }
          if(this.avenant.code == 'A17' || this.avenant.code==='A21'){
            if(this.typeClient == "personne physique" )  {
              this.formCreationAssure.value.nom = this.formCreationAssure.get("nom")?.disabled? this.assure?.nom : this.formCreationAssure.value.nom
              this.formCreationAssure.value.prenom = this.formCreationAssure.get("prenom")?.disabled? this.assure?.prenom1 :this.formCreationAssure.value.prenom
              this.formCreationAssure.value.dateNaissance = this.formCreationAssure.get("dateNaissance")?.disabled? this.assure?.dateNaissance:this.formCreationAssure.value.dateNaissance
            }else{
              this.formCreationAssure.value.raisonSocial =  this.formCreationAssure.value.raisonSocial?? this.assure?.raisonSocial
            }    
         }
         this.formCreationAssure.enable()
          filtre = this.formCreationAssure.value
        break;
      case 'Conducteur':
        this.formCreationConducteur.get("nom")?.markAsPristine();
      this.formCreationConducteur.get("prenom")?.markAsPristine();
      this.formCreationConducteur.get("dateNaissance")?.markAsPristine(); 
        if(this.avenant.code !== 'A17'){
        this.formCreationConducteur.get("codeClient").setValue(null)

          }
        console.log("date nais before",this.formCreationConducteur.get("dateNaissance"))

        this.formCreationConducteur.get("dateNaissance").setValue(moment.utc(this.formCreationConducteur.get("dateNaissance").value).add(1,"hour").toISOString())
        console.log("date nais",this.formCreationConducteur.get("dateNaissance"))
        filtre = this.formCreationConducteur.value
        break;

      default:
        break;
    }
   

    this.personneService.filterPersonne(filtre).subscribe(personne => {
      if (personne.length == 0) {
        Swal.fire(
          `Cette personne n'existe pas`,
          '',
          'info'
        )


        switch (type) {
          case 'souscripteur':
            if(this.avenant.code!=="A17"){
            this.formCreationSouscripteur.get("codeClient")?.setValue(null)
            }
            if(!this.isAssure){
              this.formCreationSouscripteur.enable();
            }
            break;
          case 'assure':
       
            if(this.avenant.code!=="A17"){
    

              this.formCreationAssure.get("codeClient")?.setValue(null)
              }
            console.log("after",this.formCreationAssure,this.formCreationSouscripteur)

            this.formCreationAssure.enable();
            this.avenant.code == 'A17' ? this.formCreationAssure.get("dateNaissance").disable() :''
            break;
          case 'Conducteur':
            if(this.avenant.code!=="A17"){
              this.formCreationConducteur.get("codeClient")?.setValue(null)
            }
            this.formCreationConducteur.enable();
            this.avenant.paramRisque.map((param: any) => {
              if (param.category == "Conducteur") {
                this.formParamRisque.get(param.paramRisque?.codeParam)?.enable();
              }
            })
            break;

          default:
            break;
        }
      }
      else {

        const dialogRef = this.dialog.open(SearchPersonneComponent, {
          width: '60%',
          disableClose: true,
          data: {
            personneList: personne
          }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
          this.personne = result
          if(this.avenant.code!=="A13"){
            this.formCreationAssure.enable();

          }
          switch (type) {
            case"assure":
            if(this.personne.idClient === this.formCreationConducteur?.controls?.codeClient?.value){
              this.isConducteurAssure=true;
            }
            if(this.personne.idClient === this.formCreationSouscripteur?.controls?.codeClient?.value){
              this.isAssure=true;
              if(this.isConducteur){
                this.isConducteurAssure=true
                this.isConducteur=false

              }
            }
            break
            case "souscripteur":
              console.log("condu",this.personne.idClient,this.formCreationConducteur)
              if(this.personne.idClient === this.formCreationAssure?.controls?.codeClient?.value){
                this.isAssure=true;
          
              }
              if(this.personne.idClient === this.formCreationConducteur?.controls?.codeClient?.value){
                this.isConducteur=true;
          
              }
              break;
              case "conducteur":
              if(this.personne.idClient === this.formCreationAssure?.controls?.codeClient?.value){
                this.isConducteurAssure=true;
       
              }
              if(this.personne.idClient === this.formCreationSouscripteur?.controls?.codeClient?.value){
                this.isConducteur=true;

              }
              break;
          
            default:
              break;
          }
          this.initFormPersonne(type);
        });
      }
    })
    if(this.avenant.code==="A13"){
      this.formCreationAssure?.get("nif")?.disable()
      this.formCreationAssure?.get("raisonSocial")?.disable()
      this.formCreationAssure?.get("nom")?.disable()
      this.formCreationAssure?.get("prenom")?.disable()
      this.formCreationAssure?.get("dateNaissance")?.disable()   
      this.formCreationAssure?.get("nin")?.disable()    
      this.formCreationAssure?.get("genre")?.disable()    
      this.formCreationAssure.updateValueAndValidity()

    }
  }

  onInput(value: any, codeParam: any) {



    if (this.codeProduit == '95' && codeParam == "P128") {
     
      console.log("paraRisqueProduitCategory")
      console.log(this.paraRisqueProduitCategory[0])

      this.paraRisqueProduitCategory[0].filter((param: any) => {
        if (param.paramRisque?.codeParam == "P198") {

        //  console.log("check param superficie")
        //  console.log(param.paramRisque?.codeParam)
          this.formParamRisque.controls[param.paramRisque?.codeParam].setValue(value * this.calculCapitaleMRP)
          this.isFieldReadOnly = true
        }
      })
    }
  }

  initFormPersonne(type: any) {
    this.formCreation = this.formBuilder.group({
      codeClient: [this.personne?.idClient == '' ? null : this.personne?.idClient, [Validators.maxLength(40)]],
      raisonSocial: [this.personne?.raisonSocial == '' ? null : this.personne?.raisonSocial],
      nom: [{ value: this.personne?.nom == '' ? null : this.personne?.nom, disabled: (this.avenant.code != 'A21' && this.avenant.code != 'A17'&& this.avenant.code != 'A13') ? true : false }, [Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
      prenom: [{ value: this.personne?.prenom1 == '' ? null : this.personne?.prenom1, disabled: (this.avenant.code != 'A21' && this.avenant.code != 'A17'&& this.avenant.code != 'A13') ? true : false }, [Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
      dateNaissance: [this.personne?.dateNaissance == '' ? null : this.personne?.dateNaissance],
      nin: [this.personne?.nin == '' ? null : this.personne?.nin],
      idTelephone: [null],
      telephone: [null, [Validators.required, Validators.pattern(Patterns.mobile)]],
      idEmail: [null],
      email: [null, [Validators.pattern(Patterns.email)]],
      idAdresse: [this.personne?.adressesList[0] ? this.personne?.adressesList?.[0]?.idAdresse : 0],
      adresse: [this.personne?.adressesList[0] ? this.personne?.adressesList?.[0]?.description : '', [Validators.required, Validators.maxLength(60)]],
      wilaya: [{ value: this.personne?.adressesList[0] ? this.personne?.adressesList?.[0].wilaya?.idWilaya : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
      commune: [{ value: this.personne?.adressesList[0] ? this.personne?.adressesList?.[0].commune?.idCommune : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
      genre: [{ value: this.personne?.sexe?.idParam, disabled: this.avenant.code == 'A17' ? true : false }],
      situation: [this.personne?.situationFamiliale?.idParam],
      rib: ['', [Validators.pattern(Patterns.RIB)]]
    });
    console.log("personne",this.personne)
    this.personne?.contactList?.forEach((contact: any) => {
      switch (contact.typeContact?.description) {
        case 'mobile':
          this.formCreation.get("idTelephone").value = contact.idContact
          this.formCreation.get("telephone").value = contact.description
          break;
        case 'email':
          this.formCreation.get("idEmail").value = contact.idContact
          this.formCreation.get("email").value = contact.description
          break;

        default:
          break;
      }
    });



    switch (type) {
      case 'souscripteur':
        this.getCommune(this.formCreation.value.wilaya, 'Souscripteur')
        this.formCreation.get("dateNaissance").setValue(moment.utc(this.formCreation.get("dateNaissance").value).add(1,"hour").toISOString())
        this.formCreationSouscripteur = this.formCreation
        this.formCreationSouscripteur.get("dateNaissance")?.setValidators([Validators.required])
        this.formCreationSouscripteur.get("genre")?.setValidators([Validators.required])
        this.formCreationSouscripteur.addControl("nif", new FormControl(this.personne?.nif, Validators.pattern(Patterns.NIF)));
        this.formCreationSouscripteur.addControl("idProfession", new FormControl(this.personne?.professionSecteurList[0] ? this.personne?.professionSecteurList[0].id : ''));
        this.formCreationSouscripteur.addControl("profession", new FormControl(this.personne?.professionSecteurList[0] ? this.personne?.professionSecteurList[0].profession?.idProfession : ''));
        this.formCreationSouscripteur.get('dateNaissance').updateValueAndValidity();
        this.formCreationSouscripteur.get('genre').updateValueAndValidity();
       /*if(this.isAssure){
          this.formCreationSouscripteur.disable();
        }*/
        
        break;
      case 'assure':
        this.getCommune(this.formCreation.value.wilaya, 'Assure')
        if (this.typeClient == "personne physique") 
        {
          this.formCreation.get("dateNaissance").setValue(moment.utc(this.formCreation.get("dateNaissance").value).add(1,"hour").toISOString())
          if(this.avenant.code==="A17"){
            this.formCreation.get("dateNaissance").disable()
          }
        }

        console.log("this.personne  iniiiiiiiiiiit")
        console.log(this.personne)
        this.formCreationAssure = this.formCreation
        this.formCreationAssure.addControl("nif", new FormControl(this.personne?.nif, Validators.pattern(Patterns.NIF)));
        if(this.avenant.code==="A13"){
          this.formCreationAssure?.get("nif")?.disable()
          this.formCreationAssure?.get("raisonSocial")?.disable()
          this.formCreationAssure?.get("nom")?.disable()
          this.formCreationAssure?.get("prenom")?.disable()
          this.formCreationAssure?.get("dateNaissance")?.disable()   
          this.formCreationAssure?.get("nin")?.disable()    
          this.formCreationAssure?.get("genre")?.disable()    
          this.formCreationAssure.updateValueAndValidity()

        }
        this.formCreationAssure.addControl("codeClient", new FormControl(this.personne?.idClient));

        if (this.typeClient == "personne physique") {
          this.formCreationAssure.addControl("idProfession", new FormControl(this.personne?.professionSecteurList[0] ? this.personne?.professionSecteurList[0].id : ''));
          this.formCreationAssure.addControl("profession", new FormControl(this.personne?.professionSecteurList[0] ? this.personne?.professionSecteurList[0].profession?.idProfession : ''));
          this.formCreationAssure.get("dateNaissance")?.setValidators([Validators.required])
          this.formCreationAssure.get('dateNaissance').updateValueAndValidity();
          this.formCreationAssure.get("genre")?.setValidators([Validators.required])
          this.formCreationAssure.get('genre').updateValueAndValidity();
        }
        break;
      case 'Conducteur':
        this.getCommune(this.formCreation.value.wilaya, 'Conducteur')
        this.formCreation.get("dateNaissance").setValue(moment.utc(this.formCreation.get("dateNaissance").value).add(1,"hour").toISOString())
        this.formCreationConducteur = this.formCreation
        this.formCreationConducteur.addControl("idProfession", new FormControl(this.personne?.professionSecteurList[0] ? { value: this.personne?.professionSecteurList[0].id, disabled: false } : { value: '', disabled: false }));
        this.formCreationConducteur.addControl("profession", new FormControl(this.personne?.professionSecteurList[0] ? { value: this.personne?.professionSecteurList[0].profession?.idProfession, disabled: false } : { value: '', disabled: false }));
        this.formCreationConducteur.addControl("numeroPermis", new FormControl({ value: '', disabled: this.avenant.code != 'A21' ? true : false }, [Validators.required]));
        this.formCreationConducteur.addControl("categoriePermis", new FormControl({ value: '', disabled: false }, [Validators.required]));
        this.avenant.paramRisque.map((param: any) => {
          if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
            let valeur = this.contrat?.risqueList?.find((risque: any) => risque.libelle == param.paramRisque.libelle && risque.categorieParamRisque.description == param.paramRisque.categorieParamRisque.description)

            if (valeur != undefined)
              this.formParamRisque.get(param.paramRisque.codeParam)?.setValue({ value: valeur.reponse.valeur != null ? valeur.reponse.valeur : valeur.reponse.idParamReponse?.idParam, disabled: true })
          }
        });
        this.formCreationConducteur.get("dateNaissance")?.setValidators([Validators.required, ageValidator])
        this.formCreationConducteur.get('dateNaissance').updateValueAndValidity();
        if(this.avenant.code==="A17"){
          this.formCreationConducteur.get("dateNaissance").disable()
          

        }
        break;

      default:
        break;
    }
  }
  getRoles() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C33").idCategorie).subscribe({
      next: (data: any) => {
        this.roles = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  objectDevis(withRemplissage: boolean) {

    //this.devis.typeClient = this.typeClients.find(type => type.idParam == this.formCreationAssure.get('typeClient')?.value)?.code
    this.devis.typeClient = this.formCreationAssure.get('typeClient')?.value
    this.devis.typeClient = this.typeClients.find((typeClient: any) => typeClient.description === this.typeClient)?.idParam
    this.devis.dateAssure = this.avenant?.code == 'A21' ? this.formCreationAssure.get("dateNaissance")?.value : this.contrat?.dateAssure
    let sousGarantieObligatoire = false

    if (this.avenant?.code == 'A13' || this.avenant?.code == 'A18' || this.avenant?.code == 'A22') {
      if (this.contrat.reduction)
        this.devis.idReduction = this.contrat.reduction
      else
        this.devis.idReduction = 0

      this.devis.dateAvenant = moment.utc(this.formApplicationAvenant.get("dateAvenant")?.value).add(1,"hour").toISOString()
      this.devis.motif = {}
      this.devis.motif.idMotif = this.formApplicationAvenant.value.motif.idMotif.idMotif
      this.devis.motif.commentaire = this.formApplicationAvenant.value.commentaire
      this.devis.idTypeAvenant = this.formApplicationAvenant.value.idTypeAvenant
      this.devis.idContrat = this.formApplicationAvenant.value.idContrat
      this.devis.produit = this.contrat?.produit?.idCodeProduit // auto static

    }
    else {
      this.devis.idReduction = 0
      this.devis.produit = this.contrat?.produit?.idCodeProduit // auto static
      console.log("this.contrat?.canal?.idParam ", this.contrat?.canal?.idParam)
      this.devis.canal = this.contrat?.canal != null ? this.contrat?.canal?.idParam : null; // auto static

      if (this.typeClient != 'personne physique') {
        let personne = this.contrat?.personnesList?.find((personne: any) => personne.role.code == 'CP235');
        this.devis.raisonSocial = personne?.personne?.raisonSocial
        this.devis.prenom = ""
        this.devis.nom = ""
        this.devis.telephone = personne?.personne?.contactList?.find((contact: any) => contact?.typeContact?.code == 'CNT1')?.description
        this.devis.email = personne?.personne?.contactList?.find((contact: any) => contact?.typeContact?.code == 'CNT2')?.description
      }
      else {
        let personne = this.contrat?.personnesList?.find((personne: any) => personne?.role?.code == 'CP234' || personne?.role?.code == 'CP236' || personne?.role?.code == 'CP238');
        this.devis.prenom = personne?.personne?.prenom1
        this.devis.nom = personne?.personne?.nom
        this.devis.raisonSocial = ''
        this.devis.telephone = personne?.personne?.contactList?.find((contact: any) => contact?.typeContact?.code == 'CNT1')?.description
        this.devis.email = personne?.personne?.contactList?.find((contact: any) => contact?.typeContact?.code == 'CNT2')?.description
      }
    }

    this.devis.duree = this.formApplicationAvenant.get("duree")?.value != undefined ? this.formApplicationAvenant.get("duree")?.value : this.contrat?.duree?.id_duree
    this.devis.agence = this.formApplicationAvenant.get("agence")?.value
    if (this.avenant?.code === 'A168' && this.codeProduit!='45F') { 
      this.devis.tailleRisque = this.taillersq
    }else{
      this.devis.tailleRisque = this.dataSourceRisque.data.length 
    }

    // this.devis.paramList = []
    let paramLists: any = []

    if (this.avenant?.paramRisque?.length != 0 && this.avenant.tarifaire && this.formStep != 2) {
      if (this.avenant.code != "A20" && this.avenant.code != "A27") {
        this.avenant.paramRisque.forEach((param: any) => {
          let paramRisque = {}

          if (param.paramRisque?.typeChamp?.description == 'Liste of values') {
            paramRisque = {
              idParam: param.paramRisque.idParamRisque,
              reponse: {
                idReponse: this.formParamRisque.get(param.paramRisque.codeParam)?.value,
                description: ''
              }
            }
          }
          else {
            if (param.paramRisque.codeParam == 'P56' || param.paramRisque.codeParam == 'P98' || param.paramRisque.codeParam == 'P25' || param.paramRisque.codeParam == 'P26') {
              paramRisque = {
                idParam: param.paramRisque.idParamRisque,
                reponse: {
                  idReponse: this.formParamRisque.get(param.paramRisque.codeParam)?.value,
                  description: ''
                }
              }
            }
            else {
              if(param.paramRisque.idParamRisque=="54")
                console.log("le paramrisque",param)
              paramRisque = {
                idParam: param.paramRisque.idParamRisque,
                reponse: {
                  idReponse: '',
                  description: this.formParamRisque.get(param.paramRisque.codeParam)?.value
                }
              }
            }
          }

          paramLists.push(paramRisque)
        });
        //this.risqueGroupe[0].groupeList[0].risque.paramList = this.oneRisqueInfo
        this.risqueGroupe[0].groupeList[0].risque.paramList = []
        console.log("this.oneRisqueInfo ", this.oneRisqueInfo);
        this.oneRisqueInfo.map((risque: any) => {
          let paramElement: any = {}
          paramElement.idParam = risque?.idParamRisque
          paramElement.reponse = {
            idReponse: null,
            description: ""
          }
         

          if (risque?.typeChamp == "Liste of values") {
            paramElement.reponse.idReponse = this.formParamRisque.get(risque.codeRisque)?.value != undefined ? this.formParamRisque.get(risque.codeRisque)?.value : risque?.reponse.idParamReponse?.idParam
          }
          else {
            if (risque.codeRisque == 'P25' || risque.codeRisque == 'P26')

              paramElement.reponse.idReponse = this.formParamRisque.get(risque.codeRisque)?.value != undefined ? this.formParamRisque.get(risque.codeRisque)?.value : risque?.reponse.idParamReponse.idParam
            else if(risque.codeRisque == 'P55')
              paramElement.reponse.description = moment.utc(this.formCreationConducteur?.controls["dateNaissance"]?.value).add(1,"hour").toISOString()
            else
              paramElement.reponse.description = this.formParamRisque.get(risque.codeRisque)?.value != undefined ? this.formParamRisque.get(risque.codeRisque)?.value : risque?.reponse.valeur
          }

          //  paramElement.reponse.description != null ? this.devis.paramList.push(paramElement) : '';
          this.risqueGroupe[0].groupeList[0].risque.paramList.push(paramElement)
        });

        console.log("this.risqueGroupe 2 ", this.risqueGroupe)
        this.devis.groupes = this.risqueGroupe
        this.jsonAvenant.groupes = this.risqueGroupe
      }
    }

    //FIX pourquoi faire ça alors que normalement si avenant.risque null on envoie meme pas paramList
    else {
      //file 
      if (this.formStep == 2) {
        this.devis.tailleRisque = this.fileControle.length

        this.generateTarif()
      }
    }

    let garantieObligatoire = false
    let packCompletOne: any = []
    let categoryOfGaranti: any = []
    let sousCategorieList = null
    console.log("this.multiRisqueProduct ", !this.multiRisqueProduct)
    if (!this.multiRisqueProduct) {
      this.garantieAll.map((garantie: any) => {

        this.formPackGaranties.controls.map((row: any) => {
          if (garantie.idPackComplet == row.value.idPackComplet) {

            const garantieupdated = this.dataSource.data.find((g: any) => g.idPackComplet == garantie.idPackComplet)
            // packCompletOne.idPackComplet = garantie.idPackComplet

            if (row.controls.checked.value || ((this.route.snapshot.paramMap.get('codeProduit') == "96" || this.route.snapshot.paramMap.get('codeProduit') == "95") && withRemplissage)) {
              garantieObligatoire = true
              if (row.controls.idformule.value.length != 0) {

                // list of value
                if (row.controls.idformule.value.length > 1) {
                  sousCategorieList = null

                  this.gestionErreurPack(row.value.idPackComplet, "formule", this.formPackGaranties)
                  if (!this.errorPackForm) {
                    if (row.controls.formule?.value?.sousCategorieList?.length != undefined && row.controls.formule?.value?.sousCategorieList?.length != 0)
                      sousCategorieList = {
                        "idSousCategoriePackComplet": row.controls.formule.value.sousCategorieList[0]?.idParamSCPackComplet,
                        "valeur": row.controls.formule.value.valeur
                      }
                    categoryOfGaranti.push(
                      {
                        "idCategoriePackComplet": row.controls.idformule.value.find((formule: any) => formule.valeur == row.controls.formule.value)?.idParamPackComplet,
                        "valeur": garantieupdated.formule.find((form: any) => form.idParamPackComplet == row.controls.idformule.value.find((formule: any) => formule.valeur == row.controls.formule.value)?.idParamPackComplet)?.valeur,
                        "sousCategorieList": sousCategorieList
                      }
                    )
                  }


                } else {
                  //input
                  if (row.controls.formule.value != null) {
                    sousCategorieList = null
                    if (row.controls.idformule.value[0].sousCategorieList?.length != undefined && row.controls.idformule.value[0].sousCategorieList?.length != 0)
                      sousCategorieList = {
                        "idSousCategoriePackComplet": row.controls.idformule.value[0].sousCategorieList[0]?.idParamSCPackComplet,
                        "valeur": row.controls.formule.value
                      }
                    categoryOfGaranti.push(
                      {
                        "idCategoriePackComplet": row.controls.idformule.value[0].idParamPackComplet,
                        "valeur": row.controls.formule.value,
                        "sousCategorieList": sousCategorieList
                      }
                    )
                  } else {
                    //input non saisie
                    if (row.controls.idformule.value[0].descriptionvVal == "input") {

                      this.errorPackForm = true
                    }
                    //valeur ou non saisie
                    sousCategorieList = null
                    if (row.controls.idformule.value[0].sousCategorieList?.length != undefined && row.idformule?.value[0].sousCategorieList?.length != 0)
                      sousCategorieList = {
                        "idSousCategoriePackComplet": row.controls.idformule.value[0].sousCategorieList[0]?.idParamSCPackComplet,
                        "valeur": row.controls.idformule.value[0].valeur
                      }
                    categoryOfGaranti.push(
                      {
                        "idCategoriePackComplet": row.controls.idformule.value[0].idParamPackComplet,
                        "valeur": row.controls.idformule.value[0].valeur,
                        "sousCategorieList": sousCategorieList
                      }
                    )
                  }

                }
              } if (row.controls.idfranchise.value.length != 0) {
                // list of value
                if (row.controls.idfranchise.value.length > 1) {

                  sousCategorieList = null
                  if (row.controls.franchise?.value?.sousCategorieList?.length != undefined && row.controls.franchise?.value?.sousCategorieList?.length != 0)
                    sousCategorieList = {
                      "idSousCategoriePackComplet": row.controls.franchise.value.sousCategorieList[0]?.idParamSCPackComplet,
                      "valeur": row.controls.franchise.value.valeur
                    }
                  categoryOfGaranti.push(
                    {
                      "idCategoriePackComplet": row.controls.idfranchise.value.find((franchise: any) => franchise.valeur == row.controls.franchise.value)?.idParamPackComplet,
                      "valeur": garantieupdated.franchise.find((form: any) => form.idParamPackComplet == row.controls.idfranchise.value.find((franchise: any) => franchise.valeur == row.controls.franchise.value)?.idParamPackComplet)?.valeur,
                      "sousCategorieList": sousCategorieList
                    }
                  )

                } else {
                  if (row.controls.franchise.value != null) {
                    sousCategorieList = null
                    if (row.controls.idfranchise.value[0].sousCategorieList?.length != undefined && row.controls.idfranchise.value[0].sousCategorieList?.length != 0)
                      sousCategorieList = {
                        "idSousCategoriePackComplet": row.controls.idfranchise.value[0].sousCategorieList[0]?.idParamSCPackComplet,
                        "valeur": row.controls.franchise.value
                      }
                    categoryOfGaranti.push(
                      {
                        "idCategoriePackComplet": row.controls.idfranchise.value[0].idParamPackComplet,
                        "valeur": row.controls.franchise.value,
                        "sousCategorieList": sousCategorieList
                      }
                    )
                  } else {
                    //input non saisie
                    if (row.controls.idfranchise.value[0].descriptionvVal == "input") {

                      this.errorPackForm = true
                    }
                    //valeur
                    sousCategorieList = null
                    if (row.controls.idfranchise.value[0].sousCategorieList?.length != undefined && row.controls.idfranchise.value[0].sousCategorieList?.length != 0)
                      sousCategorieList = {
                        "idSousCategoriePackComplet": row.controls.idfranchise.value[0].sousCategorieList[0]?.idParamSCPackComplet,
                        "valeur": row.controls.idfranchise.value[0].valeur
                      }
                    categoryOfGaranti.push(
                      {
                        "idCategoriePackComplet": row.controls.idfranchise.value[0].idParamPackComplet,
                        "valeur": row.controls.idfranchise.value[0].valeur,
                        "sousCategorieList": sousCategorieList
                      }
                    )
                  }
                }///////////////////////////////////////////////////////////////////////////////////////////////////////////////
              } if (row.controls.idplafond.value.length != 0) {
                if (row.controls.idplafond.value.length > 1) {

                  sousCategorieList = null
                  if (row.controls.plafond?.value?.sousCategorieList?.length != undefined && row.controls.plafond?.value?.sousCategorieList?.length != 0)
                    sousCategorieList = {
                      "idSousCategoriePackComplet": row.controls.plafond.value.sousCategorieList[0]?.idParamSCPackComplet,
                      "valeur": row.controls.plafond.value.valeur
                    }
                  categoryOfGaranti.push(
                    {
                      "idCategoriePackComplet": row.controls.idplafond.value.find((plafond: any) => plafond.valeur == row.controls.plafond.value)?.idParamPackComplet,
                      "valeur": garantieupdated.plafond.find((form: any) => form.idParamPackComplet == row.controls.idplafond.value.find((plafond: any) => plafond.valeur == row.controls.plafond.value)?.idParamPackComplet)?.valeur,
                      "sousCategorieList": sousCategorieList
                    }
                  )

                } else {
                  if (row.controls.plafond.value != null) {

                    sousCategorieList = null
                    if (row.controls.idplafond.value[0].sousCategorieList?.length != undefined && row.controls.idplafond.value[0].sousCategorieList?.length != 0)
                      sousCategorieList = {
                        "idSousCategoriePackComplet": row.controls.idplafond.value[0].sousCategorieList[0]?.idParamSCPackComplet,
                        "valeur": garantieupdated.plafond[0]?.valeur != "0" ? garantieupdated.plafond[0]?.valeur : row.controls.plafond.value,
                      }
                    categoryOfGaranti.push(
                      {
                        "idCategoriePackComplet": row.controls.idplafond.value[0].idParamPackComplet,
                        "valeur": garantieupdated.plafond[0]?.valeur != "0" ? garantieupdated.plafond[0]?.valeur : row.controls.plafond.value,
                        "sousCategorieList": sousCategorieList
                      }
                    )
                  } else {

                    //input non saisie
                    if (row.controls.idplafond.value[0].descriptionvVal == "input") {

                      this.errorPackForm = true
                    }
                    //valeur
                    sousCategorieList = null

                    if (row.controls.idplafond.value[0].sousCategorieList?.length != undefined && row.controls.idplafond.value[0].sousCategorieList?.length != 0) {
                      sousCategorieList = {
                        "idSousCategoriePackComplet": row.controls.idplafond.value[0].sousCategorieList[0]?.idParamSCPackComplet,
                        "valeur": row.controls.idplafond.value[0].valeur
                      }
                    }
                    categoryOfGaranti.push(
                      {
                        "idCategoriePackComplet": row.controls.idplafond.value[0].idParamPackComplet,
                        "valeur": row.controls.idplafond.value[0].valeur,
                        "sousCategorieList": sousCategorieList
                      }
                    )
                  }
                }
              }
              if (garantieObligatoire && !this.errorPackForm) {
                packCompletOne.push({
                  "idPackComplet": garantie.idPackComplet,
                  "prime": "",
                  "primePrecedent": garantieupdated.primePre != "NaN" ? garantieupdated.primePre : null,
                  "categorieList": categoryOfGaranti,
                  "codeGarantie": garantie.codeGarantie
                })
                categoryOfGaranti = []


              }

              //EXP SOUS GARANTIE :
              garantie.sousGarantieList.forEach((sousGarantie: any) => {
                const sousGarantieupdated = garantieupdated.sousGarantieList.data.find((sg: any) => sg.idPackComplet == sousGarantie.idPackComplet)

                row.get('souGarantieArray').controls.forEach((sousGarantieRow: any) => {

                  if (sousGarantie.idPackComplet == sousGarantieRow.value.idPackComplet) {
                    if (sousGarantieRow.controls.checked.value || ((this.route.snapshot.paramMap.get('codeProduit') == "96" || this.route.snapshot.paramMap.get('codeProduit') == "95") && withRemplissage)) {

                      sousGarantieObligatoire = true

                      if (sousGarantieRow.controls.idformule.value.length != 0) {

                        // list of value
                        if (sousGarantieRow.controls.idformule.value.length > 1) {
                          sousCategorieList = null

                          this.gestionErreurPack(sousGarantieRow.value.idPackComplet, "formule", row.get('souGarantieArray'))
                          if (!this.errorPackForm) {
                            if (sousGarantieRow.value.formule?.sousCategorieList?.length != undefined && sousGarantieRow.value.formule?.sousCategorieList?.length != 0)
                              sousCategorieList = {
                                "idSousCategoriePackComplet": sousGarantieRow.value.formule.sousCategorieList[0]?.idParamSCPackComplet,
                                "valeur": sousGarantieRow.value.formule.valeur
                              }
                            categoryOfGaranti.push(
                              {
                                // "idCategoriePackComplet": sousGarantieRow.value.formule.idParamPackComplet,
                                "idCategoriePackComplet": sousGarantieRow.controls.idformule.value.find((formule: any) => formule.valeur == sousGarantieRow.controls.formule.value)?.idParamPackComplet,
                                // "valeur": sousGarantieRow.value.formule.valeur,
                                "valeur": sousGarantieupdated.formule.find((form: any) => form.idParamPackComplet == sousGarantieRow.controls.idformule.value.find((formule: any) => formule.valeur == sousGarantieRow.controls.formule.value)?.idParamPackComplet)?.valeur,
                                "sousCategorieList": sousCategorieList
                              }
                            )
                          }


                        } else {
                          //input
                          if (sousGarantieRow.value.formule != null) {
                            sousCategorieList = null
                            if (sousGarantieRow.controls.idformule.value[0].sousCategorieList?.length != undefined && sousGarantieRow.controls.idformule.value[0].sousCategorieList?.length != 0)
                              sousCategorieList = {
                                "idSousCategoriePackComplet": sousGarantieRow.controls.idformule.value[0].sousCategorieList[0]?.idParamSCPackComplet,
                                "valeur": sousGarantieRow.value.formule
                              }
                            categoryOfGaranti.push(
                              {
                                "idCategoriePackComplet": sousGarantieRow.controls.idformule.value[0].idParamPackComplet,
                                "valeur": sousGarantieRow.value.formule,
                                "sousCategorieList": sousCategorieList
                              }
                            )
                          } else {
                            //input non saisie
                            if (sousGarantieRow.controls.idformule.value[0].descriptionvVal == "input") {

                              this.errorPackForm = true
                            }
                            //valeur ou non saisie
                            sousCategorieList = null
                            if (row.controls.idformule.value[0].sousCategorieList?.length != undefined && sousGarantieRow.idformule?.value[0].sousCategorieList?.length != 0)
                              sousGarantieRow = {
                                "idSousCategoriePackComplet": sousGarantieRow.controls.idformule.value[0].sousCategorieList[0]?.idParamSCPackComplet,
                                "valeur": sousGarantieRow.controls.idformule.value[0].valeur
                              }
                            categoryOfGaranti.push(
                              {
                                "idCategoriePackComplet": sousGarantieRow.controls.idformule.value[0].idParamPackComplet,
                                "valeur": sousGarantieRow.controls.idformule.value[0].valeur,
                                "sousCategorieList": sousCategorieList
                              }
                            )
                          }

                        }
                      } if (sousGarantieRow.controls.idfranchise.value.length != 0) {
                        // list of value
                        if (sousGarantieRow.controls.idfranchise.value.length > 1) {
                          sousCategorieList = null
                          if (sousGarantieRow.value?.franchise?.sousCategorieList?.length != undefined && row.value?.franchise?.sousCategorieList?.length != 0)
                            sousCategorieList = {
                              "idSousCategoriePackComplet": sousGarantieRow.value.franchise.sousCategorieList[0]?.idParamSCPackComplet,
                              "valeur": sousGarantieRow.value.franchise.valeur
                            }
                          categoryOfGaranti.push(
                            {
                              // "idCategoriePackComplet": sousGarantieRow.value.franchise.idParamPackComplet,
                              "idCategoriePackComplet": sousGarantieRow.controls.idfranchise.value.find((franchise: any) => franchise.valeur == sousGarantieRow.controls.franchise.value)?.idParamPackComplet,
                              // "valeur": sousGarantieRow.value.franchise.valeur,
                              "valeur": sousGarantieupdated.franchise.find((form: any) => form.idParamPackComplet == sousGarantieRow.controls.idfranchise.value.find((franchise: any) => franchise.valeur == sousGarantieRow.controls.franchise.value)?.idParamPackComplet)?.valeur,
                              "sousCategorieList": sousCategorieList
                            }
                          )

                        } else {
                          if (sousGarantieRow.value.franchise != null) {
                            sousCategorieList = null
                            if (sousGarantieRow.controls.idfranchise.value[0].sousCategorieList?.length != undefined && sousGarantieRow.controls.idfranchise.value[0].sousCategorieList?.length != 0)
                              sousCategorieList = {
                                "idSousCategoriePackComplet": sousGarantieRow.controls.idfranchise.value[0].sousCategorieList[0]?.idParamSCPackComplet,
                                "valeur": sousGarantieRow.value.franchise
                              }
                            categoryOfGaranti.push(
                              {
                                "idCategoriePackComplet": sousGarantieRow.controls.idfranchise.value[0].idParamPackComplet,
                                "valeur": sousGarantieRow.value.franchise,
                                "sousCategorieList": sousCategorieList
                              }
                            )
                          } else {
                            //input non saisie
                            if (sousGarantieRow.controls.idfranchise.value[0].descriptionvVal == "input") {

                              this.errorPackForm = true
                            }
                            //valeur
                            sousCategorieList = null
                            if (sousGarantieRow.controls.idfranchise.value[0].sousCategorieList?.length != undefined && sousGarantieRow.controls.idfranchise.value[0].sousCategorieList?.length != 0)
                              sousCategorieList = {
                                "idSousCategoriePackComplet": sousGarantieRow.controls.idfranchise.value[0].sousCategorieList[0]?.idParamSCPackComplet,
                                "valeur": sousGarantieRow.controls.idfranchise.value[0].valeur
                              }
                            categoryOfGaranti.push(
                              {
                                "idCategoriePackComplet": sousGarantieRow.controls.idfranchise.value[0].idParamPackComplet,
                                "valeur": sousGarantieRow.controls.idfranchise.value[0].valeur,
                                "sousCategorieList": sousCategorieList
                              }
                            )
                          }
                        }///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                      } if (sousGarantieRow.controls.idplafond.value.length != 0) {

                        if (sousGarantieRow.controls.idplafond.value.length > 1) {
                          sousCategorieList = null
                          if (sousGarantieRow.value?.plafond?.sousCategorieList?.length != undefined && sousGarantieRow.value?.plafond?.sousCategorieList?.length != 0)
                            sousCategorieList = {
                              "idSousCategoriePackComplet": sousGarantieRow.value.plafond.sousCategorieList[0]?.idParamSCPackComplet,
                              "valeur": sousGarantieRow.value.plafond.valeur
                            }
                          categoryOfGaranti.push(
                            {
                              // "idCategoriePackComplet": sousGarantieRow.value.plafond.idParamPackComplet,
                              "idCategoriePackComplet": sousGarantieRow.controls.idplafond.value.find((plafond: any) => plafond.valeur == sousGarantieRow.controls.plafond.value)?.idParamPackComplet,
                              // "valeur": sousGarantieRow.value.plafond.valeur,
                              "valeur": sousGarantieupdated.plafond.find((form: any) => form.idParamPackComplet == sousGarantieRow.controls.idplafond.value.find((plafond: any) => plafond.valeur == sousGarantieRow.controls.plafond.value)?.idParamPackComplet)?.valeur,
                              "sousCategorieList": sousCategorieList
                            }
                          )

                        } else {

                          if (sousGarantieRow.value.plafond != null) {

                            sousCategorieList = null
                            if (sousGarantieRow.controls.idplafond.value[0].sousCategorieList?.length != undefined && sousGarantieRow.controls.idplafond.value[0].sousCategorieList?.length != 0)
                              sousCategorieList = {
                                "idSousCategoriePackComplet": sousGarantieRow.controls.idplafond.value[0].sousCategorieList[0]?.idParamSCPackComplet,
                                "valeur": sousGarantieupdated.plafond[0]?.valeur != "0" ? sousGarantieupdated.plafond[0]?.valeur : sousGarantieRow.controls.plafond.value,
                                // "valeur": sousGarantieRow.value.plafond
                              }
                            categoryOfGaranti.push(
                              {
                                "idCategoriePackComplet": sousGarantieRow.controls.idplafond.value[0].idParamPackComplet,
                                "valeur": sousGarantieupdated.plafond[0]?.valeur != "0" ? sousGarantieupdated.plafond[0]?.valeur : sousGarantieRow.controls.plafond.value,
                                // "valeur": sousGarantieRow.value.plafond,
                                "sousCategorieList": sousCategorieList
                              }
                            )

                          } else {

                            //input non saisie
                            if (sousGarantieRow.controls.idplafond.value[0].descriptionvVal == "input") {

                              this.errorPackForm = true
                            }
                            //valeur
                            sousCategorieList = null

                            if (sousGarantieRow.controls.idplafond.value[0].sousCategorieList?.length != undefined && sousGarantieRow.controls.idplafond.value[0].sousCategorieList?.length != 0) {
                              sousCategorieList = {
                                "idSousCategoriePackComplet": sousGarantieRow.controls.idplafond.value[0].sousCategorieList[0]?.idParamSCPackComplet,
                                "valeur": sousGarantieRow.controls.idplafond.value[0].valeur
                              }
                            }
                            categoryOfGaranti.push(
                              {
                                "idCategoriePackComplet": sousGarantieRow.controls.idplafond.value[0].idParamPackComplet,
                                "valeur": sousGarantieRow.controls.idplafond.value[0].valeur,
                                "sousCategorieList": sousCategorieList
                              }
                            )
                          }
                        }

                      }
                      sousCategorieList = null

                      let sousGarantieExist = packCompletOne.some((packComplet: any) => packComplet.idPackComplet === sousGarantie.idPackComplet)

                      if (sousGarantieObligatoire && !this.errorPackForm && !sousGarantieExist) {

                        packCompletOne.push({
                          "idPackComplet": sousGarantie.idPackComplet,
                          "prime": "",
                          "categorieList": categoryOfGaranti
                        })

                        categoryOfGaranti = []

                      }
                    }

                  }



                })

              });

            }


          }

        })

        categoryOfGaranti = []
        garantieObligatoire = false
      })
      if (!this.errorPackForm)
        this.devis.packCompletList = packCompletOne

      this.risqueGroupe[0].groupeList[0].risque.packCompletList = packCompletOne
      this.risqueGroupe[0].groupeList[0].risque.primeList = []
      this.risqueGroupe[0].groupeList[0].risque.taxeList = []
      this.devis.groupes = this.risqueGroupe
      this.jsonAvenant.groupes = this.risqueGroupe
      if (this.avenant?.paramRisque?.length == 0 && this.formStep != 2) {

        this.risqueGroupe[0].groupeList[0].risque.paramList = []
        this.contratService.getParamContratByIdRisque(this.contrat.idContrat, this.contrat.groupeList[0].idGroupe, this.contrat.groupeList[0].risques[0].idRisque).subscribe({
          next: (data: any) => {

            let paramLists: any = []
            data.forEach((risque: any) => {
              let paramElement: any = {}

              paramElement.idParam = risque?.idParamRisque
              paramElement.reponse = {
                idReponse: null,
                description: ""
              }

              if (risque?.typeChamp == "Liste of values" || risque?.typeChamp == 'Boolean') {
                paramElement.reponse.idReponse = this.formParamRisque.get(risque.codeRisque)?.value != undefined ? this.formParamRisque.get(risque.codeRisque)?.value : risque?.reponse.idParamReponse?.idParam
              } else if (risque.codeRisque == 'P25' || risque.codeRisque == 'P26') {

                paramElement.reponse.idReponse = this.formParamRisque.get(risque.codeRisque)?.value != undefined ? this.formParamRisque.get(risque.codeRisque)?.value : risque?.reponse.idParamReponse?.idParam

              }
              else if(risque.codeRisque == 'P55')
                paramElement.reponse.description = this.formCreationConducteur?.controls["dateNaissance"]?.value
              else
                paramElement.reponse.description = this.formParamRisque.get(risque.codeRisque)?.value != undefined ? this.formParamRisque.get(risque.codeRisque)?.value : risque?.reponse?.valeur
              
              paramLists.push(paramElement)
            });
            this.risqueGroupe[0].groupeList[0].risque.paramList = paramLists

            if (this.loaderTarif) {

              this.generateTarif()
            }
          },
          error: (error) => {

          }
        })
      } else {

        if (this.loaderTarif) {


          this.generateTarif()
        }
      }

    } else {

      let observables: any = []
      let packCompletOneArray: any = []
      this.groupesPacks.forEach((gp: any, index2: number) => {
       
        packCompletOne = []
        gp.pack.garantie.map((garantie: any) => {

          garantie.categorieList?.map((categorie: any) => {
            sousCategorieList = null
            if (garantie.sousCategorieList?.length != undefined && garantie.sousCategorieList?.length != 0) {
              sousCategorieList = {
                "idSousCategoriePackComplet": categorie.sousCategorieList[0].idParamSCPackComplet,
                "valeur": categorie.sousCategorieList[0].valeur,
              }
            }

            categoryOfGaranti.push({
              "idCategoriePackComplet": categorie.idParamPackComplet,
              "valeur": categorie.valeur,
              "sousCategorieList": sousCategorieList
            })

          })

          packCompletOne.push({
            "idPackComplet": garantie.idPackComplet,
            "prime": "",
            "categorieList": categoryOfGaranti,
            "codeGarantie": garantie.codeGarantie,
          })
          categoryOfGaranti = []
        })
        console.log("this.risqueGroupe 222222220", this.risqueGroupe)
        console.log("gp 222222220", gp)
        this.risqueGroupe.map((groupe: any, index: number) => {
          if (groupe.idGroupe == gp.group) {
            groupe.groupeList.forEach((array: any) => {
              this.devis.tailleRisque = this.devis.tailleRisque + 1

              let groupeListeContrat = this.contrat.groupeList.find((groupeContrat: any) => groupeContrat.idGroupe == groupe.idGroupe)
              let idRisque = array.numRisque
              if (array.risque.hasOwnProperty('idRisque'))
                idRisque = groupeListeContrat?.risques.find((rsContrat: any) => rsContrat.idRisque == array.risque.idRisque).idRisque
              else
                idRisque = array.numRisque
              packCompletOneArray.push({ "idRisque": idRisque, "packCompletOne": packCompletOne })
              console.log("this.avenant?.paramRisque ", this.avenant?.paramRisque)
              if (this.avenant?.paramRisque?.length == 0) {

                observables.push(this.contratService.getParamContratByIdRisque(this.contrat.idContrat, groupe.idGroupe, idRisque).pipe(
                  map((response: any) => ({ idRisque, response })) // Attach idRisque to the response
                ));
              } else {
                if (!array.risque.hasOwnProperty('idRisque')) {
                  array.risque.packCompletList = packCompletOneArray.find((item: any) => item.idRisque == array.numRisque).packCompletOne
                }
                if (array.risque.idRisque == idRisque) {
                  array.risque.packCompletList = packCompletOneArray.find((item: any) => item.idRisque == array.risque.idRisque).packCompletOne
                  packCompletOne = []
                  array.risque.primeList = []

                  array.risque.taxeList = []
                  this.devis.packCompletOne = []
                   console.log("this.risqueGroupe 4", this.risqueGroupe)
                  this.devis.groupes = this.risqueGroupe
                  this.jsonAvenant.groupes = this.risqueGroupe

                }
              }

            })
          }

          if (index === this.risqueGroupe.length - 1) {
            this.generateTarif()
          }
        })
      }

      );


      forkJoin(observables).subscribe((result: any) => {
        result.map((res: any, index: any) => {
          if (this.avenant?.paramRisque?.length == 0) {

            let paramRisques: any = []
            res.response.forEach((param: any) => {
              let paramRisque = {}
              if (param.typeChamp == 'Liste of values' || param.typeChamp == 'Boolean') {
                paramRisque = {
                  idParam: param.idParamRisque,
                  reponse: {
                    idReponse: param.reponse.idParamReponse.idParam,
                    description: ''
                  }
                }
              }
              else {
                if (param.codeRisque == 'P56' || param.codeRisque == 'P25' || param.codeRisque == 'P26') {

                  paramRisque = {
                    idParam: param.idParamRisque,
                    reponse: {
                      idReponse: param.reponse.idParamReponse.idParam,
                      description: ''
                    }
                  }
                }
                else {
                  paramRisque = {
                    idParam: param.idParamRisque,
                    reponse: {
                      idReponse: null,
                      description: param.reponse.valeur
                    }
                  }
                }
              }

              paramRisques.push(paramRisque)

            });
            this.risqueGroupe.map((groupe: any) => {
              groupe.groupeList.map((array: any) => {
                if (array.risque.idRisque == res.idRisque) {
                  array.risque.paramList = paramRisques

                  array.risque.packCompletList = packCompletOneArray.find((item: any) => item.idRisque == array.risque.idRisque).packCompletOne
                  array.risque.taxeList = []
                  this.devis.packCompletOne = []
                   console.log("this.risqueGroupe 5 ", this.risqueGroupe)
                  this.devis.groupes = this.risqueGroupe
                  this.jsonAvenant.groupes = this.risqueGroupe

                }
              })

            })


            // this.populateRisqueGroupe(res.idRisque, paramRisques,res.packCompletOne)

          } else {

            this.risqueGroupe.map((groupe: any) => {
              groupe.groupeList.map((array: any) => {

                if (res.idRisque == 0 && !array.risque.hasOwnProperty('idRisque')) {
                }
                if (array.risque.idRisque == res.idRisque) {
                  array.risque.packCompletList = packCompletOneArray.find((item: any) => item.idRisque == array.risque.idRisque).packCompletOne
                  packCompletOne = []
                  array.risque.primeList = []

                  array.risque.taxeList = []
                  this.devis.packCompletOne = []
                  this.devis.groupes = this.risqueGroupe
                  this.jsonAvenant.groupes = this.risqueGroupe
                }
              })

            })

          }


          if (index === result.length - 1) {

            this.generateTarif()
          }

        })
      })




    }

    if ((this.route.snapshot.paramMap.get('codeProduit') == "96" || this.route.snapshot.paramMap.get('codeProduit') == "95") && withRemplissage) {
      this.remplissageTarif()
      this.route.snapshot.paramMap.get('codeProduit') == "95" ? this.openDialogMRP() : "";
    }
    if (this.avenant.code==="A22" && this.avenant.multirisque) {
      this.risqueGroupe.forEach((grp: any) => { 
        grp.groupeList.forEach((rsq: any) => {
        const garantieList= this.contrat?.groupeList?.find((glst:any)=>glst.idGroupe == grp.idGroupe)?.garantieList
        const packCompletList= [{"idPackComplet":garantieList.find((gnt:any)=>gnt.codeGarantie === "G00").id ,}]
          const promise = new Promise((resolve, reject) => {
            this.contratService.getParamContratByIdRisque(this.contrat.idContrat, grp.idGroupe, rsq.risque.idRisque).subscribe({
              next: (data: any) => {
                let paramLists: any = [];
                data.forEach((risque: any) => {    
                  let paramElement: any = {};      
                  paramElement.idParam = risque?.idParamRisque;     
                  paramElement.reponse = {     
                    idReponse: null,    
                    description: ""   
                  };     
                  if (risque?.typeChamp == "Liste of values" || risque?.typeChamp == 'Boolean') { 
                    paramElement.reponse.idReponse = this.formParamRisque.get(risque.codeRisque)?.value != undefined ? this.formParamRisque.get(risque.codeRisque)?.value : risque?.reponse.idParamReponse?.idParam;     
                  } else if (risque.codeRisque == 'P25' || risque.codeRisque == 'P26') {
      
                    paramElement.reponse.idReponse = this.formParamRisque.get(risque.codeRisque)?.value != undefined ? this.formParamRisque.get(risque.codeRisque)?.value : risque?.reponse.idParamReponse?.idParam;
      
                  } else if(risque.codeRisque == 'P55') {
      
                    paramElement.reponse.description = this.formCreationConducteur?.controls["dateNaissance"]?.value;
      
                  } else {
      
                    paramElement.reponse.description = this.formParamRisque.get(risque.codeRisque)?.value != undefined ? this.formParamRisque.get(risque.codeRisque)?.value : risque?.reponse?.valeur;
      
                  }
      
                  paramLists.push(paramElement);
      
                });
      
                rsq.risque.paramList = paramLists
                rsq.risque.packCompletList= packCompletList
                resolve(true);
              },
              error: (error) => {
                reject(error);
              }
            });    
          });  
          this.promisesRisques.push(promise); 
        });
      });
            this.generateTarif()  
          }
    }
  


  remplissageTarif() {

    this.devisService.remplissageDevis(this.devis).subscribe({
      next: (data: any) => {
        this.garantieTab.map((garantie: any) => {
          garantie.prime = null
          data.groupes[0].groupeList[0].risque.packCompletList.map((garantieData: any) => {
            // garanties
            if (garantie.idPackComplet == garantieData.idPackComplet) {
              garantie.plafond.forEach((plafondElement: any) => {
                garantieData.categorieList.forEach((elementCategory: any) => {

                  if (plafondElement.idParamPackComplet === elementCategory.idCategoriePackComplet) {
                    plafondElement.valeur = elementCategory.valeur
                  }
                });
              });

            }
            // sousgaranties

            garantie.sousGarantieList.data?.map((sousGarantie: any) => {

              if (sousGarantie.idPackComplet == garantieData.idPackComplet) {
                sousGarantie.plafond.forEach((plafondElement: any) => {
                  garantieData.categorieList.forEach((elementCategory: any) => {

                    if (plafondElement.idParamPackComplet === elementCategory.idCategoriePackComplet) {
                      plafondElement.valeur = elementCategory.valeur
                    }
                  });
                });

              }
            })

          })
        })


      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  generateCalcul() {

    // if(this.formPackGaranties.valid){

    this.loaderTarif = true
    this.objectDevis(false)

  }
  async generateTarif() {
    if (this.avenant?.code=='A168' && this.codeProduit == '45F') {
      this.devis.nbrPages = this.nbrPages.value;

      this.devis.tailleRisque = this.taillersq
      this.devis.agence = this.formApplicationAvenant.get("agence")?.value
      if (this.contrat.reduction)
        this.devis.idReduction = this.contrat.reduction
      else
        this.devis.idReduction = 0

      // this.devis.dateAvenant = moment.utc(this.formApplicationAvenant.get("dateAvenant")?.value).add(1,"hour").toISOString()
      this.devis.motif = {}
      this.devis.motif.idMotif = this.formApplicationAvenant.value.motif.idMotif.idMotif
      this.devis.motif.commentaire = this.formApplicationAvenant.value.commentaire
      this.devis.idTypeAvenant = this.formApplicationAvenant.value.idTypeAvenant
      this.devis.idContrat = this.formApplicationAvenant.value.idContrat
      this.devis.duree=this.formApplicationAvenant.value.duree

      this.devis.produit = this.contrat?.produit?.idCodeProduit // auto static
    }

    if(this.avenant?.code == 'A168' && this.codeProduit=='45F'){
     if(this.nmbVehicule.value!=this.taillersq){
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: `Le nombre de lignes ne correspond pas au nombre de risque indiqué, nombre de ligne= ` + this.taillersq + `, nombre indiqué= ` + this.nmbVehicule.value + `. veuillez resaisir le fichier ou modifié le nombre de risque`,
        confirmButtonText: 'OK'
      }).then(() => {
        this.myStepper.previous();
        this.myStepper.previous();
      });
     }
    }
    if (this.avenant?.code == 'A13' || this.avenant?.code == 'A18' || this.avenant?.code =='A168') {
      if(this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L') {
        this.devis.dateEffetAvenant = moment.utc(this.formApplicationAvenant?.get("dateAvenant")?.value).add(1,"hour").toISOString()
      }
    }

    if (!this.errorPackForm) {
      this.loaderTarif = true
      if (this.avenant?.code == 'A13' || this.avenant?.code == 'A18' || this.avenant?.code =='A168') {
        // if((this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L') && (this.avenant?.code!='A168' && this.codeProduit != '45F')) {
        //   this.devis.dateEffetAvenant = moment.utc(this.formApplicationAvenant?.get("dateAvenant")?.value).add(1,"hour").toISOString()
        // }

        const hmac = await this.cryptoService.generateHmac(this.tkn, this.devis);
        const stringifiedAvenant = JSON.stringify(this.devis);
        const dataAvenant = {
          stringJson:stringifiedAvenant,
          signature: hmac
        }

        this.avenantService.generateTarif(dataAvenant).subscribe({
          next: (data: any) => {
            this.primeList = data.primeList
            this.taxeList = data.taxeList
            this.retourCalcul = data
            this.returnedTarif = data
            this.errorHandler.error = false
            this.errorHandler.msg = ""
            this.tarifReady = true
            this.calcul = false
            this.loaderTarif = false
            this.garantieTab.map((garantie: any) => {
              garantie.prime = null
              data.groupes[0].groupeList[0].risque.packCompletList.map((garantieData: any) => {
                if (garantie.idPackComplet == garantieData.idPackComplet) {
                  garantie.prime = garantieData.prime
                  garantie.primeBonus = garantieData.coefBonusMalus
                }

              })
              if (this.codeProduit == "95") {
                garantie.sousGarantieList.data.map((sousGarantie: any) => {
                  sousGarantie.prime = null
                  data.groupes[0].groupeList[0].risque.packCompletList.map((sousGarantieData: any) => {
                    if (sousGarantie.idPackComplet == sousGarantieData.idPackComplet) {
                      sousGarantie.prime = sousGarantieData.prime
                      sousGarantie.primeBonus = sousGarantieData.coefBonusMalus
                    }

                  })
                })
              }
            })

            this.PrimeTotaleTarif = data.primeList?.find((p: any) => p.idPrime == 101)?.prime
            this.PrimeTotale = data.primeList?.find((p: any) => p.idPrime == 101)?.prime
            this.PrimeAfterPruning = data.primeAfterPruning != null ? data.primeAfterPruning : 0
            this.PrimeBonusMalus = data.montantBonusMalus != null ? data.montantBonusMalus : 0
            this.dataSource = new MatTableDataSource(this.garantieTab)

            this.jsonAvenant.agence = this.formApplicationAvenant.get("agence")?.value
            this.jsonAvenant.duree = this.formApplicationAvenant.get("duree")?.value
            this.jsonAvenant.pack = data.pack,
              this.jsonAvenant.packCompletList = data.packCompletList,

              this.jsonAvenant.primeList = data.primeList,
              this.jsonAvenant.taxeList = data.taxeList
            this.jsonAvenant.idTypeAvenant = this.formApplicationAvenant.get("idTypeAvenant")?.value
            this.jsonAvenant.idContrat = this.formApplicationAvenant.get("idContrat")?.value

            this.jsonAvenant.dateAvenant = moment.utc(this.formApplicationAvenant.get("dateAvenant")?.value).add(1,"hour").toISOString()
            this.avenant?.attestation ? this.jsonAvenant.numAttestation = this.formApplicationAvenant.get("attestation")?.value : ""

            this.jsonAvenant.motif = {}
            this.jsonAvenant.motif.idMotif = this.formApplicationAvenant.get("motif")?.value.idMotif.idMotif
            this.jsonAvenant.motif.commentaire = this.formApplicationAvenant.get("commentaire")?.value

            this.jsonAvenant.list = data.list
            this.jsonAvenant.attributList = []
            this.avenant.attributs.forEach((att: any) => {
              this.jsonAvenant.attributList.push({
                idAttribut: att.idAtrribut.idAttribut,
                valeur: this.formApplicationAvenant.get(att.idAtrribut.nomBdd)?.value
              })
            });
            //FIX CHANGER TO GROUPE ICI
            this.jsonAvenant.paramList = []
            this.avenant.paramRisque.forEach((param: any) => {
              let paramRisque = {}
              if (param.paramRisque?.typeChamp?.description == 'Liste of values' || param.paramRisque.codeParam == 'P25' || param.paramRisque.codeParam == 'P26') {
                paramRisque = {
                  idParam: param.paramRisque.idParamRisque,
                  reponse: {
                    idReponse: this.formParamRisque.get(param.paramRisque.codeParam)?.value,
                    description: ''
                  }
                }
              }
              else {
                if (param.paramRisque?.typeChamp.code == 'L08') {
                  paramRisque = {
                    idParam: param.paramRisque.idParamRisque,
                    reponse: {
                      idReponse: '',
                      description: this.formParamRisque.get(param.paramRisque.codeParam)?.value
                    }
                  }
                } else if (param.paramRisque?.typeChamp?.description != 'date') {

                  if (param.paramRisque?.idParamRisque == 34) {
                    paramRisque = {
                      idParam: param.paramRisque.idParamRisque,
                      reponse: {
                        idReponse: '',
                        description: String(Number(this.formParamRisque.get(param.paramRisque.codeParam)?.value))
                      }
                    }
                  }
                  else {
                    paramRisque = {
                      idParam: param.paramRisque.idParamRisque,
                      reponse: {
                        idReponse: '',
                        description: this.formParamRisque.get(param.paramRisque.codeParam)?.value
                      }
                    }
                  }
                } else {
                  //this.formParamRisque.get(param.paramRisque.codeParam)?.setValue(moment(this.formParamRisque.get(param.paramRisque.codeParam)?.value).format('YYYY-MM-DD[T]HH:mm:ss.000Z'))
                  paramRisque = {
                    idParam: param.paramRisque.idParamRisque,
                    reponse: {
                      idReponse: null,
                      description: this.formParamRisque.get(param.paramRisque.codeParam)?.value
                    }
                  }
                }
              }

              this.jsonAvenant.paramList.push(paramRisque)
            });

            this.jsonAvenant.personnes = []
            if (this.isAssure && this.isConducteur) {
              console.log("quake1")
              this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"
              let personne: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP238') || {}).idParam,
                typeClient: this.typePersonne,
                risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
                idClient: this.formCreationAssure?.controls['codeClient']?.value,
                nom: this.formCreationSouscripteur?.controls["nom"]?.value != "" ? this.formCreationSouscripteur?.controls["nom"]?.value : null,
                prenom: this.formCreationSouscripteur?.controls["prenom"]?.value != "" ? this.formCreationSouscripteur?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationSouscripteur?.controls["raisonSocial"]?.value != "" ? this.formCreationSouscripteur?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
                nif: this.formCreationSouscripteur?.controls["nif"]?.value != "" ? this.formCreationSouscripteur?.controls["nif"]?.value : null,
                nin: this.formCreationSouscripteur?.controls["nin"]?.value != "" ? this.formCreationSouscripteur?.controls["nin"]?.value : null,
                telephone: {
                  idContact: this.formCreationAssure?.controls["idTelephone"]?.value,
                  description: this.formCreationSouscripteur?.controls["telephone"]?.value
                },
                email: {
                  idContact: this.formCreationAssure?.controls["idEmail"]?.value,
                  description: this.formCreationSouscripteur?.controls["email"]?.value
                },
                adresse: {
                  idAdresse: this.formCreationAssure?.controls["idAdresse"]?.value,
                  description: this.formCreationSouscripteur?.controls["adresse"]?.value,
                  wilaya: this.formCreationSouscripteur?.controls["wilaya"]?.value,
                  commune: this.formCreationSouscripteur?.controls["commune"]?.value
                },
                genre: this.formCreationSouscripteur?.controls["genre"]?.value,
                situation: this.formCreationSouscripteur?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationAssure?.controls["idProfession"],
                  idProfession: this.formCreationSouscripteur?.controlst["profession"]?.value,
                },
                rib: {
                  idRib: 0,
                  description: this.formCreationAssure?.controls["rib"]?.value
                },
                permis: {
                  idDocument: 0,
                  description: this.formCreationConducteur?.controlst["numeroPermis"]?.value,
                  categorie: this.formCreationConducteur?.controlst["categoriePermis"]?.value,
                  dateDelivrance: '',
                  wilayaDelivrance: 0
                }
              };

              this.avenant.paramRisque.map((param: any) => {
                if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
                  switch (param.paramRisque.codeParam) {
                    case "P56":
                      personne.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                      break;
                    case "P54":
                      personne.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                      break;

                    default:
                      break;
                  }
                }
              })
              console.log(personne)

              this.jsonAvenant.personnes.push(personne)
            }
            else if (this.isAssure && this.isConducteurAssure) {
              {
              console.log("quake2")

                this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"
                let personne: PersonneContrat = {
                  role: (this.roles.find((role: any) => role.code === 'CP238') || {}).idParam,
                  risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
                  typeClient: this.typePersonne,
                  idClient: this.formCreationAssure?.controls["codeClient"]?.value,
                  nom: this.formCreationSouscripteur?.controls["nom"]?.value != "" ? this.formCreationSouscripteur?.controls["nom"]?.value : null,
                  prenom: this.formCreationSouscripteur?.controls["prenom"]?.value != "" ? this.formCreationSouscripteur?.controls["prenom"]?.value : null,
                  raisonSocial: this.formCreationSouscripteur?.controls["raisonSocial"]?.value != "" ? this.formCreationSouscripteur?.controls["raisonSocial"]?.value : null,
                  dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
                  nif: this.formCreationSouscripteur?.controls["nif"]?.value != "" ? this.formCreationSouscripteur?.controls["nif"]?.value : null,
                  nin: this.formCreationSouscripteur?.controls["nin"]?.value != "" ? this.formCreationSouscripteur?.controls["nin"]?.value : null,
                  telephone: {
                    idContact: !this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idTelephone"]?.value,
                    description: this.formCreationSouscripteur?.controls["telephone"]?.value
                  },
                  email: {
                    idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 :  this.formCreationAssure?.controls["idEmail"]?.value,
                    description: this.formCreationSouscripteur?.controls["email"]?.value
                  },
                  adresse: {
                    idAdresse:!this.formCreationAssure?.controls["codeClient"]?.value? 0 :  this.formCreationAssure?.controls["idAdresse"]?.value,
                    description: this.formCreationSouscripteur?.controls["adresse"]?.value,
                    wilaya: this.formCreationSouscripteur?.controls["wilaya"]?.value,
                    commune: this.formCreationSouscripteur?.controls["commune"]?.value
                  },
                  genre: this.formCreationSouscripteur?.controls["genre"]?.value,
                  situation: this.formCreationSouscripteur?.controls["situation"]?.value,
                  profession: {
                    id: this.formCreationAssure?.controls["idProfession"]?.value,
                    idProfession: this.formCreationSouscripteur?.controls["profession"]?.value,
                  },
                  rib: {
                    idRib: 0,
                    description: this.formCreationAssure?.controls["rib"]?.value
                  },
                  permis: {
                    idDocument: 0,
                    description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
                    categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
                    dateDelivrance: '',
                    wilayaDelivrance: 0
                  }
                };

                this.avenant.paramRisque.map((param: any) => {
                  if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
                    switch (param.paramRisque.codeParam) {
                      case "P56":
                        personne.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;
                      case "P54":
                        personne.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;

                      default:
                        break;
                    }
                  }
                })

                this.jsonAvenant.personnes.push(personne)
              }
            }
            else if (this.isAssure) {
              this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"
              let personne: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP236') || {}).idParam,
                idClient: this.formCreationAssure?.controls["codeClient"]?.value,
                nom: this.formCreationAssure?.controls["nom"]?.value != "" ? this.formCreationAssure?.controls["nom"]?.value : null,
                prenom: this.formCreationAssure?.controls["prenom"]?.value != "" ? this.formCreationAssure?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationAssure?.controls["raisonSocial"]?.value != "" ? this.formCreationAssure?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationAssure?.controls["dateNaissance"]?.value,
                nif: this.formCreationAssure?.controls["nif"]?.value != "" ? this.formCreationAssure?.controls["nif"]?.value : null,
                nin: this.formCreationAssure?.controls["nin"]?.value != "" ? this.formCreationAssure?.controls["nin"]?.value : null,
                risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
                typeClient: this.typePersonne,

                telephone: {
                  idContact: !this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idTelephone"]?.value,
                  description: this.formCreationAssure?.controls["telephone"]?.value
                },
                email: {
                  idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 :  this.formCreationAssure?.controls["idEmail"]?.value,
                  description: this.formCreationAssure?.controls["email"]?.value
                },
                adresse: {
                  idAdresse:!this.formCreationAssure?.controls["codeClient"]?.value? 0 :  this.formCreationAssure?.controls["idAdresse"]?.value,
                  description: this.formCreationAssure?.controls["adresse"]?.value,
                  wilaya: this.formCreationAssure?.controls["wilaya"]?.value,
                  commune: this.formCreationAssure?.controls["commune"]?.value
                },
                genre: this.formCreationAssure?.controls["genre"]?.value,
                situation: this.formCreationAssure?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationAssure?.controls["idProfession"]?.value,
                  idProfession: this.formCreationAssure?.controls["profession"]?.value,
                },
                rib: {
                  idRib: 0,
                  description: this.formCreationAssure?.controls["rib"]?.value
                },
                permis: {}
              };

              this.jsonAvenant.personnes.push(personne)

              if (this.codeProduit == '45A') {
                this.typePersonne = this.formCreationConducteur?.controls['raisonSocial']?.value == null || this.formCreationConducteur?.controls['raisonSocial']?.value == "" ? "PH" : "PM"
                let personne2: PersonneContrat = {
                  role: (this.roles.find((role: any) => role.code === 'CP233') || {}).idParam,
                  typeClient: this.typePersonne,
                  risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                  idClient: this.formCreationConducteur?.controls["codeClient"]?.value,
                  nom: this.formCreationConducteur?.controls["nom"]?.value != "" ? this.formCreationConducteur?.controls["nom"]?.value : null,
                  prenom: this.formCreationConducteur?.controls["prenom"]?.value != "" ? this.formCreationConducteur?.controls["prenom"]?.value : null,
                  raisonSocial: null,
                  dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
                  nif: null,
                  nin: '',
                  telephone: {
                    idContact: !this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idTelephone"]?.value,
                    description:  this.formCreationConducteur?.controls["telephone"]?.value
                  },
                  email: {
                    idContact: !this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idEmail"]?.value,
                    description: this.formCreationConducteur?.controls["email"]?.value
                  },
                  adresse: {
                    idAdresse: !this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idAdresse"]?.value,
                    description: this.formCreationConducteur?.controls["adresse"]?.value,
                    wilaya: this.formCreationConducteur?.controls["wilaya"]?.value,
                    commune: this.formCreationConducteur?.controls["commune"]?.value
                  },
                  genre: this.avenant?.code == 'A17' ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P24")?.reponse?.idParamReponse?.idParam : 0,
                  situation: this.formCreationConducteur?.controls["situation"]?.value,
                  profession: {
                    id: this.formCreationConducteur?.controls["idProfession"]?.value,
                    idProfession: this.formCreationConducteur?.controls["profession"]?.value,
                  },
                  rib: {},
                  permis: {
                    idDocument: 0,
                    description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
                    categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
                    dateDelivrance: this.avenant?.code == 'A17' ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P54")?.reponse?.valeur : '',
                    wilayaDelivrance: this.avenant?.code == 'A17' ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P56")?.reponse?.valeur : 0
                  }
                };
               
                this.avenant.paramRisque.map((param: any) => {
                  if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
                    switch (param.paramRisque.codeParam) {
                      case "P56":
                        personne2.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;
                      case "P54":
                        personne2.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;
                      case "P24":
                        personne2.genre = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;
                      default:
                        break;
                    }
                  }
                })

                this.jsonAvenant.personnes.push(personne2)
              }


            }
            else if (this.isConducteur) {
              this.typePersonne = this.formCreationSouscripteur?.controls['raisonSocial']?.value == null || this.formCreationSouscripteur?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

              let personne: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP237') || {}).idParam,
                risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                typeClient: this.typePersonne,
                idClient: this.formCreationSouscripteur?.controls["codeClient"]?.value,
                nom: this.formCreationSouscripteur?.controls["nom"]?.value != "" ? this.formCreationSouscripteur?.controls["nom"]?.value : null,
                prenom: this.formCreationSouscripteur?.controls["prenom"]?.value != "" ? this.formCreationSouscripteur?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationSouscripteur?.controls["raisonSocial"]?.value != "" ? this.formCreationSouscripteur?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
                nif: this.formCreationSouscripteur?.controls["nif"]?.value != "" ? this.formCreationSouscripteur?.controls["nif"]?.value : null,
                nin: this.formCreationSouscripteur?.controls["nin"]?.value != "" ? this.formCreationSouscripteur?.controls["nin"]?.value : null,
                telephone: {
                  idContact: !this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idTelephone"]?.value,
                  description: this.formCreationSouscripteur?.controls["telephone"]?.value
                },
                email: {
                  idContact:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idEmail"]?.value,
                  description: this.formCreationSouscripteur?.controls["email"]?.value
                },
                adresse: {
                  idAdresse:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idAdresse"]?.value,
                  description: this.formCreationSouscripteur?.controls["adresse"]?.value,
                  wilaya: this.formCreationSouscripteur?.controls["wilaya"]?.value,
                  commune: this.formCreationSouscripteur?.controls["commune"]?.value
                },
                genre: this.formCreationSouscripteur?.controls["genre"]?.value,
                situation: this.formCreationSouscripteur?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationSouscripteur?.controls["idProfession"]?.value,
                  idProfession: this.formCreationSouscripteur?.controls["profession"]?.value,
                },
                rib: {},
                permis: {
                  idDocument: 0,
                  description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
                  categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
                  dateDelivrance: '',
                  wilayaDelivrance: 0
                }
              };

              this.avenant.paramRisque.map((param: any) => {
                if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
                  switch (param.paramRisque.codeParam) {
                    case "P56":
                      personne.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                      break;
                    case "P54":
                      personne.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                      break;

                    default:
                      break;
                  }
                }
              })

              this.jsonAvenant.personnes.push(personne)
              this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

              let personne1: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP235') || {}).idParam,
                risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                typeClient: this.typePersonne,
                idClient: this.formCreationAssure?.controls["codeClient"]?.value,
                nom: this.formCreationAssure?.controls["nom"]?.value != "" ? this.formCreationAssure?.controls["nom"]?.value : null,
                prenom: this.formCreationAssure?.controls["prenom"]?.value != "" ? this.formCreationAssure?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationAssure?.controls["raisonSocial"]?.value != "" ? this.formCreationAssure?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationAssure?.controls["dateNaissance"]?.value,
                nif: this.formCreationAssure?.controls["nif"]?.value != "" ? this.formCreationAssure?.controls["nif"]?.value : null,
                nin: this.formCreationAssure?.controls["nin"]?.value != "" ? this.formCreationAssure?.controls["nin"]?.value : null,
                telephone: {
                  idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idTelephone"]?.value,
                  description: this.formCreationAssure?.controls["telephone"]?.value
                },
                email: {
                  idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idEmail"]?.value,
                  description: this.formCreationAssure?.controls["email"]?.value
                },
                adresse: {
                  idAdresse:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idAdresse"]?.value,
                  description: this.formCreationAssure?.controls["adresse"]?.value,
                  wilaya: this.formCreationAssure?.controls["wilaya"]?.value,
                  commune: this.formCreationAssure?.controls["commune"]?.value
                },
                genre: this.formCreationAssure?.controls["genre"]?.value,
                situation: this.formCreationAssure?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationAssure?.controls["idProfession"]?.value,
                  idProfession: this.formCreationAssure?.controls["profession"]?.value,
                },
                rib: {
                  idRib: 0,
                  description: this.formCreationAssure?.controls["rib"]?.value
                },
                permis: {}
              };

              this.jsonAvenant.personnes.push(personne1)
            }
            else if (this.isConducteurAssure) {
              this.typePersonne = this.formCreationSouscripteur?.controls['raisonSocial']?.value == null || this.formCreationSouscripteur?.controls['raisonSocial']?.value == "" ? "PH" : "PM"
              let personne: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP234') || {}).idParam,
                risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                typeClient: this.typePersonne,
                idClient: this.formCreationSouscripteur?.controls["codeClient"]?.value,
                nom: this.formCreationSouscripteur?.controls["nom"]?.value != "" ? this.formCreationSouscripteur?.controls["nom"]?.value : null,
                prenom: this.formCreationSouscripteur?.controls["prenom"]?.value != "" ? this.formCreationSouscripteur?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationSouscripteur?.controls["raisonSocial"]?.value != "" ? this.formCreationSouscripteur?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationSouscripteur?.controls["dateNaissance"]?.value,
                nif: this.formCreationSouscripteur?.controls["nif"]?.value != "" ? this.formCreationSouscripteur?.controls["nif"]?.value : null,
                nin: this.formCreationSouscripteur?.controls["nin"]?.value != "" ? this.formCreationSouscripteur?.controls["nin"]?.value : null,
                telephone: {
                  idContact: !this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idTelephone"]?.value,
                  description: this.formCreationSouscripteur?.controls["telephone"]?.value
                },
                email: {
                  idContact:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idEmail"]?.value,
                  description: this.formCreationSouscripteur?.controls["email"]?.value
                },
                adresse: {
                  idAdresse:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idAdresse"]?.value,
                  description: this.formCreationSouscripteur?.controls["adresse"]?.value,
                  wilaya: this.formCreationSouscripteur?.controls["wilaya"]?.value,
                  commune: this.formCreationSouscripteur?.controls["commune"]?.value
                },
                genre: this.formCreationSouscripteur?.controls["genre"]?.value,
                situation: this.formCreationSouscripteur?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationSouscripteur?.controls["idProfession"]?.value,
                  idProfession: this.formCreationSouscripteur?.controls["profession"]?.value,
                },
                rib: {},
                permis: {}
              };

              this.jsonAvenant.personnes.push(personne)
              this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"
              let personne1: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP240') || {}).idParam,
                typeClient: this.typePersonne,
                risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                idClient: this.formCreationAssure?.controls["codeClient"]?.value,
                nom: this.formCreationAssure?.controls["nom"]?.value != "" ? this.formCreationAssure?.controls["nom"]?.value : null,
                prenom: this.formCreationAssure?.controls["prenom"]?.value != "" ? this.formCreationAssure?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationAssure?.controls["raisonSocial"]?.value != "" ? this.formCreationAssure?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
                nif: this.formCreationAssure?.controls["nif"]?.value != "" ? this.formCreationAssure?.controls["nif"]?.value : null,
                nin: this.formCreationAssure?.controls["nin"]?.value != "" ? this.formCreationAssure?.controls["nin"]?.value : null,
                telephone: {
                  idContact: !this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idTelephone"]?.value,
                  description: this.formCreationAssure?.controls["telephone"]?.value
                },
                email: {
                  idContact: !this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idEmail"]?.value,
                  description: this.formCreationAssure?.controls["email"]?.value
                },
                adresse: {
                  idAdresse: !this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idAdresse"]?.value,
                  description: this.formCreationAssure?.controls["adresse"]?.value,
                  wilaya: this.formCreationAssure?.controls["wilaya"]?.value,
                  commune: this.formCreationAssure?.controls["commune"]?.value
                },
                genre: this.formCreationAssure?.controls["genre"]?.value,
                situation: this.formCreationAssure?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationAssure?.controls["idProfession"]?.value,
                  idProfession: this.formCreationAssure?.controls["profession"]?.value,
                },
                rib: {
                  idRib: 0,
                  description: this.formCreationAssure?.controls["rib"]?.value
                },
                permis: {
                  idDocument: 0,
                  description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
                  categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
                  dateDelivrance: '',
                  wilayaDelivrance: 0
                }
              };

              this.avenant.paramRisque.map((param: any) => {
                if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
                  switch (param.paramRisque.codeParam) {
                    case "P56":
                      personne1.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                      break;
                    case "P54":
                      personne1.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                      break;
                    case "P24":
                      personne1.genre = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                      break;
                    default:
                      break;
                  }
                }
              })

              this.jsonAvenant.personnes.push(personne1)
            }
            else {
              this.typePersonne = this.formCreationSouscripteur?.controls['raisonSocial']?.value == null || this.formCreationSouscripteur?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

              let personne: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP234') || {}).idParam,
                typeClient: this.typePersonne,
                risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                idClient: this.formCreationSouscripteur?.controls["codeClient"]?.value,
                nom: this.formCreationSouscripteur?.controls["nom"]?.value != "" ? this.formCreationSouscripteur?.controls["nom"]?.value : null,
                prenom: this.formCreationSouscripteur?.controls["prenom"]?.value != "" ? this.formCreationSouscripteur?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationSouscripteur?.controls["raisonSocial"]?.value != "" ? this.formCreationSouscripteur?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationSouscripteur?.controls["dateNaissance"]?.value,
                nif: this.formCreationSouscripteur?.controls["nif"]?.value != "" ? this.formCreationSouscripteur?.controls["nif"]?.value : null,
                nin: this.formCreationSouscripteur?.controls["nin"]?.value != "" ? this.formCreationSouscripteur?.controls["nin"]?.value : null,
                telephone: {
                  idContact: !this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idTelephone"]?.value,
                  description: this.formCreationSouscripteur?.controls["telephone"]?.value
                },
                email: {
                  idContact:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idEmail"]?.value,
                  description: this.formCreationSouscripteur?.controls["email"]?.value
                },
                adresse: {
                  idAdresse:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idAdresse"]?.value,
                  description: this.formCreationSouscripteur?.controls["adresse"]?.value,
                  wilaya: this.formCreationSouscripteur?.controls["wilaya"]?.value,
                  commune: this.formCreationSouscripteur?.controls["commune"]?.value
                },
                genre: this.formCreationSouscripteur?.controls["genre"]?.value,
                situation: this.formCreationSouscripteur?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationSouscripteur?.controls["idProfession"]?.value,
                  idProfession: this.formCreationSouscripteur?.controls["profession"]?.value,
                },
                rib: {},
                permis: {}
              };

              this.jsonAvenant.personnes.push(personne)
              this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

              let personne1: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP235') || {}).idParam,
                typeClient: this.typePersonne,
                risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                idClient: this.formCreationAssure?.controls["codeClient"]?.value,
                nom: this.formCreationAssure?.controls["nom"]?.value != "" ? this.formCreationAssure?.controls["nom"]?.value : null,
                prenom: this.formCreationAssure?.controls["prenom"]?.value != "" ? this.formCreationAssure?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationAssure?.controls["raisonSocial"]?.value != "" ? this.formCreationAssure?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationAssure?.controls["dateNaissance"]?.value,
                nif: this.formCreationAssure?.controls["nif"]?.value != "" ? this.formCreationAssure?.controls["nif"]?.value : null,
                nin: this.formCreationAssure?.controls["nin"]?.value != "" ? this.formCreationAssure?.controls["nin"]?.value : null,
                telephone: {
                  idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idTelephone"]?.value,
                  description: this.formCreationAssure?.controls["telephone"]?.value
                },
                email: {
                  idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idEmail"]?.value,
                  description: this.formCreationAssure?.controls["email"]?.value
                },
                adresse: {
                  idAdresse:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idAdresse"]?.value,
                  description: this.formCreationAssure?.controls["adresse"]?.value,
                  wilaya: this.formCreationAssure?.controls["wilaya"]?.value,
                  commune: this.formCreationAssure?.controls["commune"]?.value
                },
                genre: this.formCreationAssure?.controls["genre"]?.value,
                situation: this.formCreationAssure?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationAssure?.controls["idProfession"]?.value,
                  idProfession: this.formCreationAssure?.controls["profession"]?.value,
                },
                rib: {
                  idRib: 0,
                  description: this.formCreationAssure?.controls["rib"]?.value
                },
                permis: {}
              };

              this.jsonAvenant.personnes.push(personne1)

              if (this.codeProduit == '45A') {
                this.typePersonne = this.formCreationConducteur?.controls['raisonSocial']?.value == null || this.formCreationConducteur?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

                let personne2: PersonneContrat = {
                  role: (this.roles.find((role: any) => role.code === 'CP233') || {}).idParam,
                  typeClient: this.typePersonne,
                  risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                  idClient: this.formCreationConducteur?.controls["codeClient"]?.value,
                  nom: this.formCreationConducteur?.controls["nom"]?.value != "" ? this.formCreationConducteur?.controls["nom"]?.value : null,
                  prenom: this.formCreationConducteur?.controls["prenom"]?.value != "" ? this.formCreationConducteur?.controls["prenom"]?.value : null,
                  raisonSocial: null,
                  dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
                  nif: null,
                  nin: '',
                  telephone: {
                    idContact:!this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idTelephone"]?.value,
                    description: this.formCreationConducteur?.controls["telephone"]?.value
                  },
                  email: {
                    idContact:!this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idEmail"]?.value,
                    description: this.formCreationConducteur?.controls["email"]?.value
                  },
                  adresse: {
                    idAdresse:!this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idAdresse"]?.value,
                    description: this.formCreationConducteur?.controls["adresse"]?.value,
                    wilaya: this.formCreationConducteur?.controls["wilaya"]?.value,
                    commune: this.formCreationConducteur?.controls["commune"]?.value
                  },
                  genre: this.avenant?.code == 'A17' ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P24")?.reponse?.idParamReponse?.idParam : 0,
                  situation: this.formCreationConducteur?.controls["situation"]?.value,
                  profession: {
                    id: this.formCreationConducteur?.controls["idProfession"]?.value,
                    idProfession: this.formCreationConducteur?.controls["profession"]?.value,
                  },
                  rib: {},
                  permis: {
                    idDocument: 0,
                    description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
                    categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
                    dateDelivrance: this.avenant?.code == 'A17' ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P54")?.reponse?.valeur : '',
                    wilayaDelivrance: this.avenant?.code == 'A17' ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P56")?.reponse?.valeur : 0
                  }
                };

                this.avenant.paramRisque.map((param: any) => {
                  if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
                    switch (param.paramRisque.codeParam) {
                      case "P56":
                        personne2.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;
                      case "P54":
                        personne2.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;
                      case "P24":
                        personne2.genre = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;
                      default:
                        break;
                    }
                  }
                })

                this.jsonAvenant.personnes.push(personne2)
              }
            }

            if (this.multiRisqueAvenant || !this.multiRisqueProduct) {
              data.groupes.map((groupeData: any) => {
                groupeData.groupeList.map((rsData: any) => {
                  rsData.risque.packCompletList.map((garantieData: any) => {
                    this.groupesPacks.map((gp: any) => {
                      if (gp.group == groupeData.idGroupe) {
                        gp.pack.garantie.map((gr: any) => {
                          if (gr.idPackComplet == garantieData.idPackComplet)
                            garantieData.codeGarantie = gr.codeGarantie
                        })
                      }
                    })


                  })
                })
              })

              let selectedRisquesGarantie: any = []
              let newGroupes = data.groupes.map((gr: any) => ({
                ...gr,
                groupeList: gr.groupeList.map((rs: any) => ({
                  ...rs,
                  risque: {
                    ...rs.risque,
                    packCompletList: []
                  }
                }))
              }));
              let allRisques: any = []
              this.risquesInvolved.map((element: any) => {
                allRisques.push(element.idRisque)
              });

              this.contratService.getPackIdRisques(this.contrat.idContrat, allRisques).subscribe({
                next: (dataPack: any) => {
                  //    Object.assign(data, { idGroupe: rsInv.idGroupe });

                  //FIXME TEMP 
                  dataPack.map((dataRs: any) => {
                    this.risquesInvolved.map((invRs: any) => {

                      if (invRs.idRisque == dataRs.risque)
                        dataRs.idGroupe = invRs.idGroupe
                    })
                  })

                  selectedRisquesGarantie = dataPack
                  data.groupes.map((groupeNewData: any) => {
                    selectedRisquesGarantie.map((oldRsGarantie: any) => {
                      if (groupeNewData.idGroupe == oldRsGarantie.idGroupe) {
                        groupeNewData.groupeList.map((rsNewData: any) => {
                          let garantiesNewGroupes: any = []
                          if (rsNewData.risque.idRisque == oldRsGarantie.risque) {
                            rsNewData.risque.packCompletList.map((newGarantie: any) => {
                              garantiesNewGroupes.push({
                                "codeGarantie": newGarantie.codeGarantie,
                                "categorieList": newGarantie.categorieList,
                                "idPackComplet": newGarantie.idPackComplet,
                                "prime": newGarantie.prime,
                                "primeProrata": newGarantie.primeProrata,
                                "primeReduction": null,
                                "nouveau": true,
                                "coefBonusMalus": null,
                                "coefButoir": null,
                                "description": newGarantie.description,
                              })



                            })


                            oldRsGarantie.garantieList.map((oldGarantie: any) => {
                              // Ajouter les valeurs présentes uniquement dans array2 avec nouveau=false
                              const isInFinalArray = garantiesNewGroupes.some((item: any) => item.codeGarantie === oldGarantie.codeGarantie);

                              if (!isInFinalArray && (this.avenant?.code != "A13" && this.avenant?.code != "A18")) {

                                garantiesNewGroupes.push({
                                  "codeGarantie": oldGarantie.codeGarantie,
                                  "categorieList": oldGarantie.categorieList,
                                  "idPackComplet": oldGarantie.id,
                                  "prime": oldGarantie.prime,
                                  "primeProrata": oldGarantie.primeProrata,
                                  "primeReduction": null,
                                  "nouveau": false,
                                  "coefBonusMalus": null,
                                  "coefButoir": null,
                                  "description": oldGarantie.description,
                                });

                              }

                            })


                            newGroupes.map((gr: any) => {
                              gr.groupeList.map((rs: any) => {
                                if (rs.risque.idRisque == oldRsGarantie.risque)
                                  rs.risque.packCompletList = garantiesNewGroupes
                              })
                            });
                          }


                        })
                      }

                    })
                  })

                  this.jsonAvenant.groupes = newGroupes
                  this.jsonAvenant.primeList = data.primeList,
                    this.jsonAvenant.taxeList = data.taxeList
                  this.returnedTarif.groupes = this.jsonAvenant.groupes
                  if (this.multiRisqueProduct)
                    this.calculPrime()
                },
                error: (error) => {
                  console.log(error);

                }
              });
            } else {
              // QUAND CA CONCERNE PAS UN ANCIEN RISQUE 
              data.groupes.map((gr: any) => {
                gr.groupeList.map((rs: any) => {
                  rs.risque.packCompletList.map((garantie: any) => {
                    garantie.nouveau = true
                  })
                })
              })
              this.jsonAvenant.groupes = data.groupes
              this.jsonAvenant.primeList = data.primeList,
                this.jsonAvenant.taxeList = data.taxeList
              if (this.multiRisqueProduct)
                this.calculPrime()
            }

            
            if (this.multiRisqueProduct && (this.avenant.code!='A168' && this.codeProduit=='45F'))
              this.myStepper.next();

          },
          error: (error: any) => {
            this.loaderTarif = false
            this.handleError(error)

          }
        });
      }
      else if(this.avenant?.code == 'A22') {
        if(this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L') {
          this.devis.dateEffetAvenant = moment.utc(this.formApplicationAvenant?.get("dateAvenant")?.value).add(1,"hour").toISOString()
        }
        console.log("this.risqueGroupe ", this.risqueGroupe)
        Promise.all(this.promisesRisques).then(async () => {
        this.devis.groupes=this.risqueGroupe
        const hmac = await this.cryptoService.generateHmac(this.tkn, this.devis);
        const stringifiedAvenant = JSON.stringify(this.devis);
        const dataAvenant = {
          stringJson:stringifiedAvenant,
          signature: hmac
        }

        this.avenantService.generateTarifProprietaire(dataAvenant).subscribe({
          next: (data: any) => {
            this.retourCalcul = data
            this.returnedTarif = data
            this.errorHandler.error = false
            this.errorHandler.msg = ""
            this.tarifReady = true
            this.calcul = false
            this.loaderTarif = false
            this.garantieTab.map((garantie: any) => {
              garantie.prime = null
              data.groupes[0].groupeList[0].risque.packCompletList.map((garantieData: any) => {
                if (garantie.idPackComplet == garantieData.idPackComplet) {
                  garantie.prime = garantieData.prime
                  garantie.primeBonus = garantieData.coefBonusMalus
                }

              })
              if (this.codeProduit == "95") {
                garantie.sousGarantieList.data.map((sousGarantie: any) => {
                  sousGarantie.prime = null
                  data.groupes[0].groupeList[0].risque.packCompletList.map((sousGarantieData: any) => {
                    if (sousGarantie.idPackComplet == sousGarantieData.idPackComplet) {
                      sousGarantie.prime = sousGarantieData.prime
                      sousGarantie.primeBonus = sousGarantieData.coefBonusMalus
                    }

                  })
                })
              }
            })

            this.PrimeTotaleTarif = data.primeList?.find((p: any) => p.idPrime == 101)?.prime
            this.PrimeTotale = data.primeList?.find((p: any) => p.idPrime == 101)?.prime
            this.PrimeAfterPruning = data.primeAfterPruning != null ? data.primeAfterPruning : 0
            this.PrimeBonusMalus = data.montantBonusMalus != null ? data.montantBonusMalus : 0
            this.dataSource = new MatTableDataSource(this.garantieTab)

            this.jsonAvenant.agence = this.formApplicationAvenant.get("agence")?.value
            this.jsonAvenant.duree = this.formApplicationAvenant.get("duree")?.value
            this.jsonAvenant.pack = data.pack,
              this.jsonAvenant.packCompletList = data.packCompletList,

              this.jsonAvenant.primeList = data.primeList,
              this.jsonAvenant.taxeList = data.taxeList
            this.jsonAvenant.idTypeAvenant = this.formApplicationAvenant.get("idTypeAvenant")?.value
            this.jsonAvenant.idContrat = this.formApplicationAvenant.get("idContrat")?.value

            this.jsonAvenant.dateAvenant = this.formApplicationAvenant.get("dateAvenant")?.value
            this.avenant?.attestation ? this.jsonAvenant.numAttestation = this.formApplicationAvenant.get("attestation")?.value : ""

            this.jsonAvenant.motif = {}
            this.jsonAvenant.motif.idMotif = this.formApplicationAvenant.get("motif")?.value.idMotif.idMotif
            this.jsonAvenant.motif.commentaire = this.formApplicationAvenant.get("commentaire")?.value

            this.jsonAvenant.list = data.list
            this.jsonAvenant.attributList = []
            this.avenant.attributs.forEach((att: any) => {
              this.jsonAvenant.attributList.push({
                idAttribut: att.idAtrribut.idAttribut,
                valeur: this.formApplicationAvenant.get(att.idAtrribut.nomBdd)?.value
              })
            });
            //FIX CHANGER TO GROUPE ICI
            this.jsonAvenant.paramList = []
            this.avenant.paramRisque.forEach((param: any) => {
              let paramRisque = {}
              if (param.paramRisque?.typeChamp?.description == 'Liste of values' || param.paramRisque.codeParam == 'P25' || param.paramRisque.codeParam == 'P26') {
                paramRisque = {
                  idParam: param.paramRisque.idParamRisque,
                  reponse: {
                    idReponse: this.formParamRisque.get(param.paramRisque.codeParam)?.value,
                    description: ''
                  }
                }
              }
              else {
                if (param.paramRisque?.typeChamp.code == 'L08') {
                  paramRisque = {
                    idParam: param.paramRisque.idParamRisque,
                    reponse: {
                      idReponse: '',
                      description: this.formParamRisque.get(param.paramRisque.codeParam)?.value
                    }
                  }
                } else if (param.paramRisque?.typeChamp?.description != 'date') {

                  if (param.paramRisque?.idParamRisque == 34) {
                    paramRisque = {
                      idParam: param.paramRisque.idParamRisque,
                      reponse: {
                        idReponse: '',
                        description: String(Number(this.formParamRisque.get(param.paramRisque.codeParam)?.value))
                      }
                    }
                  }
                  else {
                    paramRisque = {
                      idParam: param.paramRisque.idParamRisque,
                      reponse: {
                        idReponse: '',
                        description: this.formParamRisque.get(param.paramRisque.codeParam)?.value
                      }
                    }
                  }
                } else {
                  //this.formParamRisque.get(param.paramRisque.codeParam)?.setValue(moment(this.formParamRisque.get(param.paramRisque.codeParam)?.value).format('YYYY-MM-DD[T]HH:mm:ss.000Z'))
                  paramRisque = {
                    idParam: param.paramRisque.idParamRisque,
                    reponse: {
                      idReponse: null,
                      description: this.formParamRisque.get(param.paramRisque.codeParam)?.value
                    }
                  }
                }
              }

              this.jsonAvenant.paramList.push(paramRisque)
            });

            this.jsonAvenant.personnes = []
            if (this.isAssure && this.isConducteur) {
              console.log("quake3")

              this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"
              let personne: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP238') || {}).idParam,
                typeClient: this.typePersonne,
                risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
                idClient: this.formCreationAssure?.controls['codeClient']?.value,
                nom: this.formCreationSouscripteur?.controls["nom"]?.value != "" ? this.formCreationSouscripteur?.controls["nom"]?.value : null,
                prenom: this.formCreationSouscripteur?.controls["prenom"]?.value != "" ? this.formCreationSouscripteur?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationSouscripteur?.controls["raisonSocial"]?.value != "" ? this.formCreationSouscripteur?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
                nif: this.formCreationSouscripteur?.controls["nif"]?.value != "" ? this.formCreationSouscripteur?.controls["nif"]?.value : null,
                nin: this.formCreationSouscripteur?.controls["nin"]?.value != "" ? this.formCreationSouscripteur?.controls["nin"]?.value : null,
                telephone: {
                  idContact: this.formCreationAssure?.controls["idTelephone"]?.value,
                  description: this.formCreationSouscripteur?.controls["telephone"]?.value
                },
                email: {
                  idContact: this.formCreationAssure?.controls["idEmail"]?.value,
                  description: this.formCreationSouscripteur?.controls["email"]?.value
                },
                adresse: {
                  idAdresse: this.formCreationAssure?.controls["idAdresse"]?.value,
                  description: this.formCreationSouscripteur?.controls["adresse"]?.value,
                  wilaya: this.formCreationSouscripteur?.controls["wilaya"]?.value,
                  commune: this.formCreationSouscripteur?.controls["commune"]?.value
                },
                genre: this.formCreationSouscripteur?.controls["genre"]?.value,
                situation: this.formCreationSouscripteur?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationAssure?.controls["idProfession"],
                  idProfession: this.formCreationSouscripteur?.controlst["profession"]?.value,
                },
                rib: {
                  idRib: 0,
                  description: this.formCreationAssure?.controls["rib"]?.value
                },
                permis: {
                  idDocument: 0,
                  description: this.formCreationConducteur?.controlst["numeroPermis"]?.value,
                  categorie: this.formCreationConducteur?.controlst["categoriePermis"]?.value,
                  dateDelivrance: '',
                  wilayaDelivrance: 0
                }
              };

              this.avenant.paramRisque.map((param: any) => {
                if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
                  switch (param.paramRisque.codeParam) {
                    case "P56":
                      personne.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                      break;
                    case "P54":
                      personne.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                      break;

                    default:
                      break;
                  }
                }
              })

              this.jsonAvenant.personnes.push(personne)
            }
            else if (this.isAssure && this.isConducteurAssure) {
              {
              console.log("quake4")

                this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"
                let personne: PersonneContrat = {
                  role: (this.roles.find((role: any) => role.code === 'CP238') || {}).idParam,
                  risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
                  typeClient: this.typePersonne,
                  idClient: this.formCreationAssure?.controls["codeClient"]?.value,
                  nom: this.formCreationSouscripteur?.controls["nom"]?.value != "" ? this.formCreationSouscripteur?.controls["nom"]?.value : null,
                  prenom: this.formCreationSouscripteur?.controls["prenom"]?.value != "" ? this.formCreationSouscripteur?.controls["prenom"]?.value : null,
                  raisonSocial: this.formCreationSouscripteur?.controls["raisonSocial"]?.value != "" ? this.formCreationSouscripteur?.controls["raisonSocial"]?.value : null,
                  dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
                  nif: this.formCreationSouscripteur?.controls["nif"]?.value != "" ? this.formCreationSouscripteur?.controls["nif"]?.value : null,
                  nin: this.formCreationSouscripteur?.controls["nin"]?.value != "" ? this.formCreationSouscripteur?.controls["nin"]?.value : null,
                  telephone: {
                    idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idTelephone"]?.value,
                    description: this.formCreationSouscripteur?.controls["telephone"]?.value
                  },
                  email: {
                    idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idEmail"]?.value,
                    description: this.formCreationSouscripteur?.controls["email"]?.value
                  },
                  adresse: {
                    idAdresse:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idAdresse"]?.value,
                    description: this.formCreationSouscripteur?.controls["adresse"]?.value,
                    wilaya: this.formCreationSouscripteur?.controls["wilaya"]?.value,
                    commune: this.formCreationSouscripteur?.controls["commune"]?.value
                  },
                  genre: this.formCreationSouscripteur?.controls["genre"]?.value,
                  situation: this.formCreationSouscripteur?.controls["situation"]?.value,
                  profession: {
                    id: this.formCreationAssure?.controls["idProfession"]?.value,
                    idProfession: this.formCreationSouscripteur?.controls["profession"]?.value,
                  },
                  rib: {
                    idRib: 0,
                    description: this.formCreationAssure?.controls["rib"]?.value
                  },
                  permis: {
                    idDocument: 0,
                    description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
                    categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
                    dateDelivrance: '',
                    wilayaDelivrance: 0
                  }
                };

                this.avenant.paramRisque.map((param: any) => {
                  if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
                    switch (param.paramRisque.codeParam) {
                      case "P56":
                        personne.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;
                      case "P54":
                        personne.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;

                      default:
                        break;
                    }
                  }
                })

                this.jsonAvenant.personnes.push(personne)
              }
            }
            else if (this.isAssure) {
              this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"
              let personne: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP236') || {}).idParam,
                idClient: this.formCreationAssure?.controls["codeClient"]?.value,
                nom: this.formCreationAssure?.controls["nom"]?.value != "" ? this.formCreationAssure?.controls["nom"]?.value : null,
                prenom: this.formCreationAssure?.controls["prenom"]?.value != "" ? this.formCreationAssure?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationAssure?.controls["raisonSocial"]?.value != "" ? this.formCreationAssure?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationAssure?.controls["dateNaissance"]?.value,
                nif: this.formCreationAssure?.controls["nif"]?.value != "" ? this.formCreationAssure?.controls["nif"]?.value : null,
                nin: this.formCreationAssure?.controls["nin"]?.value != "" ? this.formCreationAssure?.controls["nin"]?.value : null,
                risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
                typeClient: this.typePersonne,

                telephone: {
                  idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idTelephone"]?.value,
                  description: this.formCreationAssure?.controls["telephone"]?.value
                },
                email: {
                  idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idEmail"]?.value,
                  description: this.formCreationAssure?.controls["email"]?.value
                },
                adresse: {
                  idAdresse:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idAdresse"]?.value,
                  description: this.formCreationAssure?.controls["adresse"]?.value,
                  wilaya: this.formCreationAssure?.controls["wilaya"]?.value,
                  commune: this.formCreationAssure?.controls["commune"]?.value
                },
                genre: this.formCreationAssure?.controls["genre"]?.value,
                situation: this.formCreationAssure?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationAssure?.controls["idProfession"]?.value,
                  idProfession: this.formCreationAssure?.controls["profession"]?.value,
                },
                rib: {
                  idRib: 0,
                  description: this.formCreationAssure?.controls["rib"]?.value
                },
                permis: {}
              };

              this.jsonAvenant.personnes.push(personne)

              if (this.codeProduit == '45A') {
                this.typePersonne = this.formCreationConducteur?.controls['raisonSocial']?.value == null || this.formCreationConducteur?.controls['raisonSocial']?.value == "" ? "PH" : "PM"
                let personne2: PersonneContrat = {
                  role: (this.roles.find((role: any) => role.code === 'CP233') || {}).idParam,
                  typeClient: this.typePersonne,
                  risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                  idClient: this.formCreationConducteur?.controls["codeClient"]?.value,
                  nom: this.formCreationConducteur?.controls["nom"]?.value != "" ? this.formCreationConducteur?.controls["nom"]?.value : null,
                  prenom: this.formCreationConducteur?.controls["prenom"]?.value != "" ? this.formCreationConducteur?.controls["prenom"]?.value : null,
                  raisonSocial: null,
                  dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
                  nif: null,
                  nin: '',
                  telephone: {
                    idContact:!this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idTelephone"]?.value,
                    description: this.formCreationConducteur?.controls["telephone"]?.value
                  },
                  email: {
                    idContact:!this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idEmail"]?.value,
                    description: this.formCreationConducteur?.controls["email"]?.value
                  },
                  adresse: {
                    idAdresse:!this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idAdresse"]?.value,
                    description: this.formCreationConducteur?.controls["adresse"]?.value,
                    wilaya: this.formCreationConducteur?.controls["wilaya"]?.value,
                    commune: this.formCreationConducteur?.controls["commune"]?.value
                  },
                  genre: this.avenant?.code == 'A17' ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P24")?.reponse?.idParamReponse?.idParam : 0,
                  situation: this.formCreationConducteur?.controls["situation"]?.value,
                  profession: {
                    id: this.formCreationConducteur?.controls["idProfession"]?.value,
                    idProfession: this.formCreationConducteur?.controls["profession"]?.value,
                  },
                  rib: {},
                  permis: {
                    idDocument: 0,
                    description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
                    categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
                    dateDelivrance: this.avenant?.code == 'A17' ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P54")?.reponse?.valeur : '',
                    wilayaDelivrance: this.avenant?.code == 'A17' ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P56")?.reponse?.valeur : 0
                  }
                };

                this.avenant.paramRisque.map((param: any) => {
                  if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
                    switch (param.paramRisque.codeParam) {
                      case "P56":
                        personne2.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;
                      case "P54":
                        personne2.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;
                      case "P24":
                        personne2.genre = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;
                      default:
                        break;
                    }
                  }
                })

                this.jsonAvenant.personnes.push(personne2)
              }


            }
            else if (this.isConducteur) {
              this.typePersonne = this.formCreationSouscripteur?.controls['raisonSocial']?.value == null || this.formCreationSouscripteur?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

              let personne: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP237') || {}).idParam,
                risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                typeClient: this.typePersonne,
                idClient: this.formCreationSouscripteur?.controls["codeClient"]?.value,
                nom: this.formCreationSouscripteur?.controls["nom"]?.value != "" ? this.formCreationSouscripteur?.controls["nom"]?.value : null,
                prenom: this.formCreationSouscripteur?.controls["prenom"]?.value != "" ? this.formCreationSouscripteur?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationSouscripteur?.controls["raisonSocial"]?.value != "" ? this.formCreationSouscripteur?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
                nif: this.formCreationSouscripteur?.controls["nif"]?.value != "" ? this.formCreationSouscripteur?.controls["nif"]?.value : null,
                nin: this.formCreationSouscripteur?.controls["nin"]?.value != "" ? this.formCreationSouscripteur?.controls["nin"]?.value : null,
                telephone: {
                  idContact:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idTelephone"]?.value,
                  description: this.formCreationSouscripteur?.controls["telephone"]?.value
                },
                email: {
                  idContact:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idEmail"]?.value,
                  description: this.formCreationSouscripteur?.controls["email"]?.value
                },
                adresse: {
                  idAdresse:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idAdresse"]?.value,
                  description: this.formCreationSouscripteur?.controls["adresse"]?.value,
                  wilaya: this.formCreationSouscripteur?.controls["wilaya"]?.value,
                  commune: this.formCreationSouscripteur?.controls["commune"]?.value
                },
                genre: this.formCreationSouscripteur?.controls["genre"]?.value,
                situation: this.formCreationSouscripteur?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationSouscripteur?.controls["idProfession"]?.value,
                  idProfession: this.formCreationSouscripteur?.controls["profession"]?.value,
                },
                rib: {},
                permis: {
                  idDocument: 0,
                  description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
                  categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
                  dateDelivrance: '',
                  wilayaDelivrance: 0
                }
              };

              this.avenant.paramRisque.map((param: any) => {
                if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
                  switch (param.paramRisque.codeParam) {
                    case "P56":
                      personne.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                      break;
                    case "P54":
                      personne.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                      break;

                    default:
                      break;
                  }
                }
              })

              this.jsonAvenant.personnes.push(personne)
              this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

              let personne1: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP235') || {}).idParam,
                risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                typeClient: this.typePersonne,
                idClient: this.formCreationAssure?.controls["codeClient"]?.value,
                nom: this.formCreationAssure?.controls["nom"]?.value != "" ? this.formCreationAssure?.controls["nom"]?.value : null,
                prenom: this.formCreationAssure?.controls["prenom"]?.value != "" ? this.formCreationAssure?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationAssure?.controls["raisonSocial"]?.value != "" ? this.formCreationAssure?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationAssure?.controls["dateNaissance"]?.value,
                nif: this.formCreationAssure?.controls["nif"]?.value != "" ? this.formCreationAssure?.controls["nif"]?.value : null,
                nin: this.formCreationAssure?.controls["nin"]?.value != "" ? this.formCreationAssure?.controls["nin"]?.value : null,
                telephone: {
                  idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idTelephone"]?.value,
                  description: this.formCreationAssure?.controls["telephone"]?.value
                },
                email: {
                  idContact: !this.formCreationAssure?.controls["codeClient"]?.value? 0 :this.formCreationAssure?.controls["idEmail"]?.value,
                  description: this.formCreationAssure?.controls["email"]?.value
                },
                adresse: {
                  idAdresse:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idAdresse"]?.value,
                  description: this.formCreationAssure?.controls["adresse"]?.value,
                  wilaya: this.formCreationAssure?.controls["wilaya"]?.value,
                  commune: this.formCreationAssure?.controls["commune"]?.value
                },
                genre: this.formCreationAssure?.controls["genre"]?.value,
                situation: this.formCreationAssure?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationAssure?.controls["idProfession"]?.value,
                  idProfession: this.formCreationAssure?.controls["profession"]?.value,
                },
                rib: {
                  idRib: 0,
                  description: this.formCreationAssure?.controls["rib"]?.value
                },
                permis: {}
              };

              this.jsonAvenant.personnes.push(personne1)
            }
            else if (this.isConducteurAssure) {
              this.typePersonne = this.formCreationSouscripteur?.controls['raisonSocial']?.value == null || this.formCreationSouscripteur?.controls['raisonSocial']?.value == "" ? "PH" : "PM"
              let personne: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP234') || {}).idParam,
                risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                typeClient: this.typePersonne,
                idClient: this.formCreationSouscripteur?.controls["codeClient"]?.value,
                nom: this.formCreationSouscripteur?.controls["nom"]?.value != "" ? this.formCreationSouscripteur?.controls["nom"]?.value : null,
                prenom: this.formCreationSouscripteur?.controls["prenom"]?.value != "" ? this.formCreationSouscripteur?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationSouscripteur?.controls["raisonSocial"]?.value != "" ? this.formCreationSouscripteur?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationSouscripteur?.controls["dateNaissance"]?.value,
                nif: this.formCreationSouscripteur?.controls["nif"]?.value != "" ? this.formCreationSouscripteur?.controls["nif"]?.value : null,
                nin: this.formCreationSouscripteur?.controls["nin"]?.value != "" ? this.formCreationSouscripteur?.controls["nin"]?.value : null,
                telephone: {
                  idContact:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idTelephone"]?.value,
                  description: this.formCreationSouscripteur?.controls["telephone"]?.value
                },
                email: {
                  idContact:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idEmail"]?.value,
                  description: this.formCreationSouscripteur?.controls["email"]?.value
                },
                adresse: {
                  idAdresse:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idAdresse"]?.value,
                  description: this.formCreationSouscripteur?.controls["adresse"]?.value,
                  wilaya: this.formCreationSouscripteur?.controls["wilaya"]?.value,
                  commune: this.formCreationSouscripteur?.controls["commune"]?.value
                },
                genre: this.formCreationSouscripteur?.controls["genre"]?.value,
                situation: this.formCreationSouscripteur?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationSouscripteur?.controls["idProfession"]?.value,
                  idProfession: this.formCreationSouscripteur?.controls["profession"]?.value,
                },
                rib: {},
                permis: {}
              };

              this.jsonAvenant.personnes.push(personne)
              this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"
              let personne1: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP240') || {}).idParam,
                typeClient: this.typePersonne,
                risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                idClient: this.formCreationAssure?.controls["codeClient"]?.value,
                nom: this.formCreationAssure?.controls["nom"]?.value != "" ? this.formCreationAssure?.controls["nom"]?.value : null,
                prenom: this.formCreationAssure?.controls["prenom"]?.value != "" ? this.formCreationAssure?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationAssure?.controls["raisonSocial"]?.value != "" ? this.formCreationAssure?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
                nif: this.formCreationAssure?.controls["nif"]?.value != "" ? this.formCreationAssure?.controls["nif"]?.value : null,
                nin: this.formCreationAssure?.controls["nin"]?.value != "" ? this.formCreationAssure?.controls["nin"]?.value : null,
                telephone: {
                  idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idTelephone"]?.value,
                  description: this.formCreationAssure?.controls["telephone"]?.value
                },
                email: {
                  idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idEmail"]?.value,
                  description: this.formCreationAssure?.controls["email"]?.value
                },
                adresse: {
                  idAdresse:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idAdresse"]?.value,
                  description: this.formCreationAssure?.controls["adresse"]?.value,
                  wilaya: this.formCreationAssure?.controls["wilaya"]?.value,
                  commune: this.formCreationAssure?.controls["commune"]?.value
                },
                genre: this.formCreationAssure?.controls["genre"]?.value,
                situation: this.formCreationAssure?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationAssure?.controls["idProfession"]?.value,
                  idProfession: this.formCreationAssure?.controls["profession"]?.value,
                },
                rib: {
                  idRib: 0,
                  description: this.formCreationAssure?.controls["rib"]?.value
                },
                permis: {
                  idDocument: 0,
                  description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
                  categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
                  dateDelivrance: '',
                  wilayaDelivrance: 0
                }
              };

              this.avenant.paramRisque.map((param: any) => {
                if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
                  switch (param.paramRisque.codeParam) {
                    case "P56":
                      personne1.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                      break;
                    case "P54":
                      personne1.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                      break;
                    case "P24":
                      personne1.genre = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                      break;
                    default:
                      break;
                  }
                }
              })

              this.jsonAvenant.personnes.push(personne1)
            }
            else {
              this.typePersonne = this.formCreationSouscripteur?.controls['raisonSocial']?.value == null || this.formCreationSouscripteur?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

              let personne: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP234') || {}).idParam,
                typeClient: this.typePersonne,
                risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                idClient: this.formCreationSouscripteur?.controls["codeClient"]?.value,
                nom: this.formCreationSouscripteur?.controls["nom"]?.value != "" ? this.formCreationSouscripteur?.controls["nom"]?.value : null,
                prenom: this.formCreationSouscripteur?.controls["prenom"]?.value != "" ? this.formCreationSouscripteur?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationSouscripteur?.controls["raisonSocial"]?.value != "" ? this.formCreationSouscripteur?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationSouscripteur?.controls["dateNaissance"]?.value,
                nif: this.formCreationSouscripteur?.controls["nif"]?.value != "" ? this.formCreationSouscripteur?.controls["nif"]?.value : null,
                nin: this.formCreationSouscripteur?.controls["nin"]?.value != "" ? this.formCreationSouscripteur?.controls["nin"]?.value : null,
                telephone: {
                  idContact:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idTelephone"]?.value,
                  description: this.formCreationSouscripteur?.controls["telephone"]?.value
                },
                email: {
                  idContact: !this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 :this.formCreationSouscripteur?.controls["idEmail"]?.value,
                  description: this.formCreationSouscripteur?.controls["email"]?.value
                },
                adresse: {
                  idAdresse:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idAdresse"]?.value,
                  description: this.formCreationSouscripteur?.controls["adresse"]?.value,
                  wilaya: this.formCreationSouscripteur?.controls["wilaya"]?.value,
                  commune: this.formCreationSouscripteur?.controls["commune"]?.value
                },
                genre: this.formCreationSouscripteur?.controls["genre"]?.value,
                situation: this.formCreationSouscripteur?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationSouscripteur?.controls["idProfession"]?.value,
                  idProfession: this.formCreationSouscripteur?.controls["profession"]?.value,
                },
                rib: {},
                permis: {}
              };

              this.jsonAvenant.personnes.push(personne)
              this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

              let personne1: PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP235') || {}).idParam,
                typeClient: this.typePersonne,
                risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                idClient: this.formCreationAssure?.controls["codeClient"]?.value,
                nom: this.formCreationAssure?.controls["nom"]?.value != "" ? this.formCreationAssure?.controls["nom"]?.value : null,
                prenom: this.formCreationAssure?.controls["prenom"]?.value != "" ? this.formCreationAssure?.controls["prenom"]?.value : null,
                raisonSocial: this.formCreationAssure?.controls["raisonSocial"]?.value != "" ? this.formCreationAssure?.controls["raisonSocial"]?.value : null,
                dateNaissance: this.formCreationAssure?.controls["dateNaissance"]?.value,
                nif: this.formCreationAssure?.controls["nif"]?.value != "" ? this.formCreationAssure?.controls["nif"]?.value : null,
                nin: this.formCreationAssure?.controls["nin"]?.value != "" ? this.formCreationAssure?.controls["nin"]?.value : null,
                telephone: {
                  idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idTelephone"]?.value,
                  description: this.formCreationAssure?.controls["telephone"]?.value
                },
                email: {
                  idContact: !this.formCreationAssure?.controls["codeClient"]?.value? 0 :this.formCreationAssure?.controls["idEmail"]?.value,
                  description: this.formCreationAssure?.controls["email"]?.value
                },
                adresse: {
                  idAdresse:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idAdresse"]?.value,
                  description: this.formCreationAssure?.controls["adresse"]?.value,
                  wilaya: this.formCreationAssure?.controls["wilaya"]?.value,
                  commune: this.formCreationAssure?.controls["commune"]?.value
                },
                genre: this.formCreationAssure?.controls["genre"]?.value,
                situation: this.formCreationAssure?.controls["situation"]?.value,
                profession: {
                  id: this.formCreationAssure?.controls["idProfession"]?.value,
                  idProfession: this.formCreationAssure?.controls["profession"]?.value,
                },
                rib: {
                  idRib: 0,
                  description: this.formCreationAssure?.controls["rib"]?.value
                },
                permis: {}
              };

              this.jsonAvenant.personnes.push(personne1)

              if (this.codeProduit == '45A') {
                this.typePersonne = this.formCreationConducteur?.controls['raisonSocial']?.value == null || this.formCreationConducteur?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

                let personne2: PersonneContrat = {
                  role: (this.roles.find((role: any) => role.code === 'CP233') || {}).idParam,
                  typeClient: this.typePersonne,
                  risqueList: [this.contrat.groupeList[0].risques[0].idRisque],
                  idClient: this.formCreationConducteur?.controls["codeClient"]?.value,
                  nom: this.formCreationConducteur?.controls["nom"]?.value != "" ? this.formCreationConducteur?.controls["nom"]?.value : null,
                  prenom: this.formCreationConducteur?.controls["prenom"]?.value != "" ? this.formCreationConducteur?.controls["prenom"]?.value : null,
                  raisonSocial: null,
                  dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
                  nif: null,
                  nin: '',
                  telephone: {
                    idContact:!this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idTelephone"]?.value,
                    description: this.formCreationConducteur?.controls["telephone"]?.value
                  },
                  email: {
                    idContact:!this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idEmail"]?.value,
                    description: this.formCreationConducteur?.controls["email"]?.value
                  },
                  adresse: {
                    idAdresse:!this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idAdresse"]?.value,
                    description: this.formCreationConducteur?.controls["adresse"]?.value,
                    wilaya: this.formCreationConducteur?.controls["wilaya"]?.value,
                    commune: this.formCreationConducteur?.controls["commune"]?.value
                  },
                  genre: this.avenant?.code == 'A17' ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P24")?.reponse?.idParamReponse?.idParam : 0,
                  situation: this.formCreationConducteur?.controls["situation"]?.value,
                  profession: {
                    id: this.formCreationConducteur?.controls["idProfession"]?.value,
                    idProfession: this.formCreationConducteur?.controls["profession"]?.value,
                  },
                  rib: {},
                  permis: {
                    idDocument: 0,
                    description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
                    categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
                    dateDelivrance: this.avenant?.code == 'A17' ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P54")?.reponse?.valeur : '',
                    wilayaDelivrance: this.avenant?.code == 'A17' ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P56")?.reponse?.valeur : 0
                  }
                };

                this.avenant.paramRisque.map((param: any) => {
                  if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
                    switch (param.paramRisque.codeParam) {
                      case "P56":
                        personne2.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;
                      case "P54":
                        personne2.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;
                      case "P24":
                        personne2.genre = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                        break;
                      default:
                        break;
                    }
                  }
                })

                this.jsonAvenant.personnes.push(personne2)
              }
            }

            if (this.multiRisqueAvenant || !this.multiRisqueProduct) {
              data.groupes.map((groupeData: any) => {
                groupeData.groupeList.map((rsData: any) => {
                  rsData.risque.packCompletList.map((garantieData: any) => {
                    this.groupesPacks.map((gp: any) => {
                      if (gp.group == groupeData.idGroupe) {
                        gp.pack.garantie.map((gr: any) => {
                          if (gr.idPackComplet == garantieData.idPackComplet)
                            garantieData.codeGarantie = gr.codeGarantie
                        })
                      }
                    })


                  })
                })
              })

              let selectedRisquesGarantie: any = []
              let newGroupes = data.groupes.map((gr: any) => ({
                ...gr,
                groupeList: gr.groupeList.map((rs: any) => ({
                  ...rs,
                  risque: {
                    ...rs.risque,
                    packCompletList: []
                  }
                }))
              }));
              let allRisques: any = []
              this.risquesInvolved.map((element: any) => {
                allRisques.push(element.idRisque)
              });

              this.contratService.getPackIdRisques(this.contrat.idContrat, allRisques).subscribe({
                next: (dataPack: any) => {
                  //    Object.assign(data, { idGroupe: rsInv.idGroupe });

                  //FIXME TEMP 
                  dataPack.map((dataRs: any) => {
                    this.risquesInvolved.map((invRs: any) => {

                      if (invRs.idRisque == dataRs.risque)
                        dataRs.idGroupe = invRs.idGroupe
                    })
                  })

                  selectedRisquesGarantie = dataPack
                  data.groupes.map((groupeNewData: any) => {
                    selectedRisquesGarantie.map((oldRsGarantie: any) => {
                      if (groupeNewData.idGroupe == oldRsGarantie.idGroupe) {
                        groupeNewData.groupeList.map((rsNewData: any) => {
                          let garantiesNewGroupes: any = []
                          if (rsNewData.risque.idRisque == oldRsGarantie.risque) {
                            rsNewData.risque.packCompletList.map((newGarantie: any) => {
                              garantiesNewGroupes.push({
                                "codeGarantie": newGarantie.codeGarantie,
                                "categorieList": newGarantie.categorieList,
                                "idPackComplet": newGarantie.idPackComplet,
                                "prime": newGarantie.prime,
                                "primeProrata": newGarantie.primeProrata,
                                "primeReduction": null,
                                "nouveau": true,
                                "coefBonusMalus": null,
                                "coefButoir": null,
                                "description": newGarantie.description,
                              })



                            })


                            oldRsGarantie.garantieList.map((oldGarantie: any) => {
                              // Ajouter les valeurs présentes uniquement dans array2 avec nouveau=false
                              const isInFinalArray = garantiesNewGroupes.some((item: any) => item.codeGarantie === oldGarantie.codeGarantie);

                              if (!isInFinalArray && (this.avenant?.code != "A13" && this.avenant?.code != "A18" && this.avenant?.code != "A22")) {

                                garantiesNewGroupes.push({
                                  "codeGarantie": oldGarantie.codeGarantie,
                                  "categorieList": oldGarantie.categorieList,
                                  "idPackComplet": oldGarantie.id,
                                  "prime": oldGarantie.prime,
                                  "primeProrata": oldGarantie.primeProrata,
                                  "primeReduction": null,
                                  "nouveau": false,
                                  "coefBonusMalus": null,
                                  "coefButoir": null,
                                  "description": oldGarantie.description,
                                });

                              }

                            })


                            newGroupes.map((gr: any) => {
                              gr.groupeList.map((rs: any) => {
                                if (rs.risque.idRisque == oldRsGarantie.risque)
                                  rs.risque.packCompletList = garantiesNewGroupes
                              })
                            });
                          }


                        })
                      }

                    })
                  })

                  this.jsonAvenant.groupes = newGroupes
                  this.jsonAvenant.primeList = data.primeList,
                    this.jsonAvenant.taxeList = data.taxeList
                  this.returnedTarif.groupes = this.jsonAvenant.groupes
                  if (this.multiRisqueProduct)
                    this.calculPrime()
                },
                error: (error) => {
                  console.log(error);

                }
              });
            } else {
              // QUAND CA CONCERNE PAS UN ANCIEN RISQUE 
              data.groupes.map((gr: any) => {
                gr.groupeList.map((rs: any) => {
                  rs.risque.packCompletList.map((garantie: any) => {
                    garantie.nouveau = true
                  })
                })
              })
              this.jsonAvenant.groupes = data.groupes
              this.jsonAvenant.primeList = data.primeList,
                this.jsonAvenant.taxeList = data.taxeList
              if (this.multiRisqueProduct)
                this.calculPrime()
            }

            if (this.multiRisqueProduct)
              this.myStepper.next();

          },
          error: (error: any) => {
            this.loaderTarif = false
            this.handleError(error)

          }
        });
        }).catch((error) => {
          console.error("An error occurred:", error);
        });
        
      }
      else {
        if(this.avenant.code==="A26"){
          console.log("this.devis.groupes ", this.devis.groupes)
          this.devis.groupes.forEach((groupe:any)=>{
            groupe.groupeList.forEach((rsq:any)=>{

                rsq.risque.packCompletList=[]

            })
          })
        }
        if(this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L') {
          this.devis.dateEffetAvenant = moment.utc(this.formApplicationAvenant?.get("dateAvenant")?.value).add(1,"hour").toISOString()
        }

        if(this.codeProduit == '45L' && this.avenant?.code == 'A27') {
          this.decote(this.devis);
        } else {
          this.generateTarifNotRenouvellement(this.devis);
        }

      }
    }
  }

  async decote(devis: any) {
    const hmac = await this.cryptoService.generateHmac(this.tkn, devis);
    const stringifiedAvenant = JSON.stringify(devis);
    const dataAvenant = {
      stringJson:stringifiedAvenant,
      signature: hmac
    }

    this.devisService.generateDecote(dataAvenant).subscribe({
      next: (data: any) => {
        data.file = null;
        this.generateTarifNotRenouvellement(data);
      },
      error: (error: any) => {
        this.loaderTarif = false
        this.handleError(error)
      }
    });
  }


  async generateTarifNotRenouvellement(devis: any) {
    const hmac = await this.cryptoService.generateHmac(this.tkn, devis);
        const stringifiedAvenant = JSON.stringify(devis);
        const dataAvenant = {
          stringJson:stringifiedAvenant,
          signature: hmac
        }

        this.devisService.generateTarif(dataAvenant).subscribe({
          next: (data: any) => {
            console.log("tariiiiiiiiiiiiiiiiiiiiiif")
            this.returnedTarif = data
            if (this.formStep != 2) {
              this.errorHandler.error = false
              this.errorHandler.msg = ""
              this.tarifReady = true
              this.calcul = false
              this.loaderTarif = false
              this.garantieTab.map((garantie: any) => {
                garantie.prime = null
                data.groupes[0].groupeList[0].risque.packCompletList.map((garantieData: any) => {
                  if (garantie.idPackComplet == garantieData.idPackComplet)
                    garantie.prime = garantieData.prime

                })
                if (this.codeProduit == "95") {
                  garantie.sousGarantieList.data.map((sousGarantie: any) => {
                    sousGarantie.prime = null
                    data.groupes[0].groupeList[0].risque.packCompletList.map((sousGarantieData: any) => {
                      if (sousGarantie.idPackComplet == sousGarantieData.idPackComplet)
                        sousGarantie.prime = sousGarantieData.prime
                    })
                  })
                }
              })

              this.PrimeTotaleTarif = data.primeList?.find((p: any) => p.idPrime == 101)?.prime

              this.dataSource = new MatTableDataSource(this.garantieTab)
              let garantieExit = false
              this.jsonAvenant = data
              //  if (this.avenant?.code == 'A06')
              // this.ancientPack.map((garantie: any) => {
              //   //change name idCategorie
              //   garantie.categorieList.map((category: any) => {
              //     category.idCategoriePackComplet = category.id

              //     if (category.sousCategorieList != null)
              //       category.sousCategorieList.idSousCategoriePackComplet = category.sousCategorieList.id
              //   });

              //   this.jsonAvenant.packCompletList.push({
              //     "categorieList": garantie.categorieList,
              //     "idPackComplet": garantie.id,
              //     "prime": garantie.prime,
              //     "primeProrata": garantie.primeProrata,
              //     "primeReduction": null,
              //     "nouveau": false,
              //     "coefBonusMalus": null,
              //     "coefButoir": false,
              //     "description": garantie.description,
              //   })
              // })
              /******************** */
              // let packCompletListAncient = []

              // this.ancientPack.map((groupe: any) => {

              //   groupe.garantieList.map((garantie: any) => {
              //     garantie.categorieList.map((category: any) => {
              //       category.idCategoriePackComplet = category.id

              //       if (category.sousCategorieList != null)
              //         category.sousCategorieList.idSousCategoriePackComplet = category.sousCategorieList.id
              //     });
              //     datasPackComplet.groupes.map((groupeData: any) => {
              //       if (groupeData.idGroupe == groupe.idGroupe) {
              //         groupeData.groupeList.map((rs: any) => {
              //           rs.risque.packCompletList.push({
              //             "categorieList": garantie.categorieList,
              //             "idPackComplet": garantie.id,
              //             "prime": garantie.prime,
              //             "primeProrata": garantie.primeProrata,
              //             "primeReduction": null,
              //             "nouveau": false,
              //             "coefBonusMalus": null,
              //             "coefButoir": false,
              //             "description": garantie.description,
              //           })
              //         })
              //       }

              //     })

              //   })


              // })

              // data.groupes.map((groupeData: any) => {
              //   //equivalent a ca this.garantieAll.map((selectedGarantie: any)
              //   this.groupesPacks.map((groupePack: any) => {
              //     if (groupePack.group == groupeData.idGroupe) {
              //       groupeData.groupeList.map((rs: any) => {
              //         rs.risque.packCompletList.map((newGarantie: any) => {
              //           garantieExit = false
              //           groupePack.pack.garantie.map((selectedGarantie: any) => {
              //             if (newGarantie.idPackComplet == selectedGarantie.idPackComplet) {
              //               newGarantie.description = selectedGarantie.description
              //               newGarantie.nouveau = true
              //             }
              //           })


              //           if (newGarantie.description == groupePack.description) {
              //             groupePack.categorieList = newGarantie.categorieList
              //             groupePack.prime = newGarantie.prime
              //             garantieExit = true
              //             groupePack.nouveau = true
              //           }
              //           else if (newGarantie.description == undefined)
              //             garantieExit = true

              //         })
              //       })
              //     }
              //   })
              //   datasPackComplet.groupes.map((groupeDatasPack: any) => {
              //     if (groupeData.idGroupe == groupeDatasPack.idGroupe) {
              //       groupeDatasPack.groupeList.map((rs: any) =>{
              //         rs.risque.packCompletList.map((garantie:any)=>{
              //           if (garantie.description == garantie.description) {
              //             garantie.categorieList = newGarantie.categorieList
              //             garantie.prime = newGarantie.prime
              //             garantieExit = true
              //             garantie.nouveau = true
              //           }
              //         })
              //       })
              //       if (newGarantie.description == garantie.description) {
              //         garantie.categorieList = newGarantie.categorieList
              //         garantie.prime = newGarantie.prime
              //         garantieExit = true
              //         garantie.nouveau = true
              //       }
              //       else if (newGarantie.description == undefined)
              //         garantieExit = true
              //     }

              //   })
              // })

              // let datasPackComplet: any = []
              // datasPackComplet.groupes = data.groupes
              // datasPackComplet.groupes.map((groupe: any) => {
              //   groupe.groupeList.map((rs: any) => {
              //     rs.risque.packCompletList = []
              //   })
              // })

              // data.groupes.map((groupeData: any) => {
              //   groupeData.groupeList.map((rsData: any) => {

              //     this.ancientPack.map((groupeAncient: any) => {
              //       groupeAncient.garantieList.map((garantiesAncien: any) => {
              //         rsData.risque.packCompletList.map((garantieData: any) => {
              //           //case 1 same garantie 

              //         })


              //       })
              //     })
              //   })
              // })


              if (this.multiRisqueAvenant || !this.multiRisqueProduct) {
                data.groupes.map((groupeData: any) => {
                  groupeData.groupeList.map((rsData: any) => {
                    rsData.risque.packCompletList.map((garantieData: any) => {
                      this.groupesPacks.map((gp: any) => {
                        if (gp.group == groupeData.idGroupe) {
                          gp.pack.garantie.map((gr: any) => {
                            if (gr.idPackComplet == garantieData.idPackComplet)
                              garantieData.codeGarantie = gr.codeGarantie
                          })
                        }
                      })


                    })
                  })
                })

                let selectedRisquesGarantie: any = []
                let newGroupes = data.groupes.map((gr: any) => ({
                  ...gr,
                  groupeList: gr.groupeList.map((rs: any) => ({
                    ...rs,
                    risque: {
                      ...rs.risque,
                      packCompletList: []
                    }
                  }))
                }));
                let allRisques: any = []
                this.risquesInvolved.map((element: any) => {
                  allRisques.push(element.idRisque)
                });

                this.contratService.getPackIdRisques(this.contrat.idContrat, allRisques).subscribe({
                  next: (dataPack: any) => {
                    //    Object.assign(data, { idGroupe: rsInv.idGroupe });

                    //FIXME TEMP 
                    dataPack.map((dataRs: any) => {
                      this.risquesInvolved.map((invRs: any) => {

                        if (invRs.idRisque == dataRs.risque)
                          dataRs.idGroupe = invRs.idGroupe
                      })
                    })


                    selectedRisquesGarantie = dataPack
                    data.groupes.map((groupeNewData: any) => {
                      selectedRisquesGarantie.map((oldRsGarantie: any) => {
                        if (groupeNewData.idGroupe == oldRsGarantie.idGroupe) {
                          groupeNewData.groupeList.map((rsNewData: any) => {
                            let garantiesNewGroupes: any = []

                            if (rsNewData.risque.idRisque == oldRsGarantie.risque) {
                              rsNewData.risque.packCompletList.map((newGarantie: any) => {
                                garantiesNewGroupes.push({
                                  "codeGarantie": newGarantie.codeGarantie,
                                  "categorieList": newGarantie.categorieList,
                                  "idPackComplet": newGarantie.idPackComplet,
                                  "prime": newGarantie.prime,
                                  "primeProrata": newGarantie.primeProrata,
                                  "primeReduction": null,
                                  "nouveau": true,
                                  "coefBonusMalus": null,
                                  "coefButoir": null,
                                  "description": newGarantie.description,
                                })



                              })


                              oldRsGarantie.garantieList.map((oldGarantie: any) => {
                                // Ajouter les valeurs présentes uniquement dans array2 avec nouveau=false
                                const isInFinalArray = garantiesNewGroupes.some((item: any) => item.codeGarantie === oldGarantie.codeGarantie);

                                if (!isInFinalArray && (this.avenant?.code != "A13" && this.avenant?.code != "A18" && this.avenant?.code != "A22")) {

                                  garantiesNewGroupes.push({
                                    "codeGarantie": oldGarantie.codeGarantie,
                                    "categorieList": oldGarantie.categorieList,
                                    "idPackComplet": oldGarantie.id,
                                    "prime": oldGarantie.prime,
                                    "primeProrata": oldGarantie.primeProrata,
                                    "primeReduction": null,
                                    "nouveau": false,
                                    "coefBonusMalus": null,
                                    "coefButoir": null,
                                    "description": oldGarantie.description,
                                  });

                                }

                              })


                              newGroupes.map((gr: any) => {
                                gr.groupeList.map((rs: any) => {
                                  if (rs.risque.idRisque == oldRsGarantie.risque)
                                    rs.risque.packCompletList = garantiesNewGroupes
                                })
                              });
                            }


                          })
                        }

                      })
                    })

                    this.jsonAvenant.groupes = newGroupes
                    this.jsonAvenant.primeList = data.primeList,
                      this.jsonAvenant.taxeList = data.taxeList

                    if (this.multiRisqueProduct)
                      this.calculPrime()
                  },
                  error: (error) => {
                    console.log(error);

                  }
                });
              } else {
                // QUAND CA CONCERNE PAS UN ANCIEN RISQUE 
                data.groupes.map((gr: any) => {
                  gr.groupeList.map((rs: any) => {
                    rs.risque.packCompletList.map((garantie: any) => {
                      garantie.nouveau = true
                    })
                  })
                })
                this.jsonAvenant.groupes = data.groupes
                this.jsonAvenant.primeList = data.primeList,
                  this.jsonAvenant.taxeList = data.taxeList
                if (this.multiRisqueProduct)
                  this.calculPrime()
              }



              //*****************************************************************
              // data.packCompletList.map((newGarantie: any) => {
              //   garantieExit = false
              //   this.garantieAll.map((selectedGarantie: any) => {
              //     if (newGarantie.idPackComplet == selectedGarantie.idPackComplet) {
              //       newGarantie.description = selectedGarantie.description
              //       newGarantie.nouveau = true
              //     }
              //   })
              //   this.jsonAvenant.packCompletList.map((garantie: any) => {
              //     if (newGarantie.description == garantie.description) {
              //       garantie.categorieList = newGarantie.categorieList
              //       garantie.prime = newGarantie.prime
              //       garantieExit = true
              //       garantie.nouveau = true
              //     }
              //     else if (newGarantie.description == undefined)
              //       garantieExit = true
              //   })

              //   if (!garantieExit) {
              //     this.jsonAvenant.packCompletList.push(newGarantie)
              //   }
              // })
              //*****************************************************************


            } else {

              data.groupes.map((gr: any) => {
                gr.groupeList.map((rs: any) => {
                  rs.risque.packCompletList.map((garantie: any) => {
                    garantie.nouveau = true
                  })
                })
              })
              this.jsonAvenant = data
              this.calculPrime()
            }


          },
          error: (error: any) => {
            this.loaderTarif = false
            this.handleError(error)

          }
        });
  }
  gestionErreurPack(idPackComplet: any, typeCategory: any, typeGarantieForm: any) {
    typeGarantieForm.controls.forEach((garantie: FormGroup) => {
      if (garantie.value.idPackComplet == idPackComplet && typeCategory == "formule") {
        if (garantie.value.formule == null && !garantie.controls.formule.disabled) {

          this.errorPackForm = true
        }

      } else if (garantie.value.idPackComplet == idPackComplet && typeCategory == "plafond") {
        if (garantie.value.plafond == null && !garantie.controls.plafond.disabled) {

          this.errorPackForm = true
        }
      } else if (garantie.value.idPackComplet == idPackComplet && typeCategory == "franchise") {
        if (garantie.value.franchise == null && !garantie.controls.franchise.disabled) {

          this.errorPackForm = true
        }
      }

    })

  }

  // download(type: any) {
  //   switch (type) {
  //     case 'attestation':
  //       this.contratService.outputAttestation(this.contrat)
  //       break;
  //     case 'quittance':
  //       this.contratService.outputQuittance(this.contrat)
  //       break;

  //     default:
  //       break;
  //   }
  // }

  changePersonne(typePersonne: any) {

  

    switch (typePersonne) {
      case "Souscripteur":
        if(this.isConducteur){
          this.formCreationConducteur.get("nom").enable()
          this.formCreationConducteur.get("prenom").enable()
          this.formCreationConducteur.get("dateNaissance").enable()
          this.formCreationConducteur.get("nom").setValue("")
          this.formCreationConducteur.get("prenom").setValue("")
          this.formCreationConducteur.get("dateNaissance").setValue(null)
          this.formCreationConducteur.updateValueAndValidity()
        }
        this.isConducteur = false
        this.isAssure = false
        /*this.formCreationSouscripteur = this.formBuilder.group({
          codeClient: [null],
          nom: [this.formCreationSouscripteur.value?.nom, [Validators.required, Validators.pattern(Patterns.nom)]],
          prenom: [this.formCreationSouscripteur.value?.prenom, [Validators.required, Validators.pattern(Patterns.nom)]],
          dateNaissance: [this.formCreationSouscripteur.value?.dateNaissance, [Validators.required, ageValidator]],
          nin: ['', [Validators.pattern(Patterns.NIN)]],
          telephone: ['', [Validators.required, Validators.pattern(Patterns.mobile)]],
          email: ['', [Validators.pattern(Patterns.email)]],
          adresse: ['', [Validators.required]],
          wilaya: [{ value : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
          commune: [{ value : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
          genre: [{ value: '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
          situation: [''],
          profession: ['']
        });*/
        //  this.formCreationSouscripteur.disable();
        this.formCreationSouscripteur.get("nom").enable()
        this.formCreationSouscripteur.get("prenom").enable()
        this.formCreationSouscripteur.get("dateNaissance").enable()
        break;
      case "Conducteur":
        this.isConducteur = false
        this.isConducteurAssure = false
        /*this.formCreationConducteur = this.formBuilder.group({
          codeClient: [null],
          nom: [{ value: this.formCreationConducteur.value?.nom, disabled: this.avenant.code != 'A21' && this.avenant.code != 'A17' ? true : false }, [Validators.required, Validators.pattern(Patterns.nom)]],
          prenom: [{ value: this.formCreationConducteur.value?.prenom, disabled: this.avenant.code != 'A21' && this.avenant.code != 'A17' ? true : false }, [Validators.required, Validators.pattern(Patterns.nom)]],
          dateNaissance: [this.formCreationConducteur.value?.dateNaissance, [Validators.required, ageValidator]],
          telephone: ['', [Validators.required, Validators.pattern(Patterns.mobile)]],
          email: ['', [Validators.pattern(Patterns.email)]],
          adresse: ['', [Validators.required]],
          wilaya: [{ value : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
          commune: [{ value : '', disabled: this.avenant.code == 'A17' ? true : false }, [Validators.required]],
          situation: [''],
          profession: [''],
          numeroPermis: ['', [Validators.required]],
          categoriePermis: ['', [Validators.required]],
        });*/
        //  this.formCreationConducteur.disable();
        this.formCreationConducteur.get("nom").enable()
        this.formCreationConducteur.get("prenom").enable()
        this.formCreationConducteur.get("dateNaissance").enable()
        break;
        case "Assure":
        
        if(this.isAssure){
        this.formCreationSouscripteur.get("nom").enable()
        this.formCreationSouscripteur.get("prenom").enable()
        this.formCreationSouscripteur.get("dateNaissance").enable()
        this.formCreationSouscripteur.get("nom").setValue("")
        this.formCreationSouscripteur.get("prenom").setValue("")
        this.formCreationSouscripteur.get("dateNaissance").setValue(null)
        this.formCreationSouscripteur.updateValueAndValidity()
        }
        if(this.isConducteurAssure){
        this.formCreationConducteur.get("nom").enable()
        this.formCreationConducteur.get("prenom").enable()
        this.formCreationConducteur.get("dateNaissance").enable()
        this.formCreationConducteur.get("nom").setValue("")
        this.formCreationConducteur.get("prenom").setValue("")
        this.formCreationConducteur.get("dateNaissance").setValue(null)
        this.formCreationConducteur.updateValueAndValidity()
        }
        this.isAssure=false;
        this.isConducteurAssure = false
        break;
      default:
        break;
    }
  }


  backk(){
    this.myStepper.selectedIndex = 1;
  }
  stepnext(){
    this.myStepper.next();
  }

  async calculPrime() {

    const nonvide = this.avenantOrganismeList.length>=1
    if(this.codeProduit=='45A'&& this.avenant.code=='A172'&& !nonvide){
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'La liste des Organismes ne peut pas etre vide .',
        confirmButtonText: 'OK'
      }).then(() => {
        // Revenir à l'étape précédente dans le stepper
        // window.history.back();
        this.myStepper.previous();


        
      });
      
    }
    
    if (this.avenant?.code == 'A20') {
      this.formParamRisque.get("groupe")?.setValidators([Validators.required])
    }



    if (this.formParamRisque.valid || this.formStep == 2) {
      
      this.loaderCalcul = true;
      this.jsonAvenant.idTypeAvenant = this.formApplicationAvenant.get("idTypeAvenant")?.value
      this.jsonAvenant.idContrat = this.formApplicationAvenant.get("idContrat")?.value
      this.jsonAvenant.dateAvenant = this.formApplicationAvenant.get("dateAvenant")?.value
      this.jsonAvenant.agence = this.formApplicationAvenant.get("agence")?.value
      this.avenant?.attestation ? this.jsonAvenant.numAttestation = this.formApplicationAvenant.value.attestation : ""

      this.jsonAvenant.motif = {}
      this.jsonAvenant.motif.idMotif = this.formApplicationAvenant.value.motif.idMotif.idMotif
      this.jsonAvenant.motif.commentaire = this.formApplicationAvenant.value.commentaire

      this.jsonAvenant.attributList = []
      this.avenant.attributs.forEach((att: any) => {
        this.jsonAvenant.attributList.push({
          idAttribut: att.idAtrribut.idAttribut,
          valeur: this.formApplicationAvenant.get(att.idAtrribut.nomBdd)?.value
        })
      });
      //******multirisque */
     if (this.multiRisqueAvenant && this.multiRisqueProduct) {
        //this.jsonAvenant.groupes = []
        let risque: any = {}
        let groupeList: any = []


        // if (this.risquesInvolved.length > 1) {

        //   Object.keys(this.groupesInvolved).map((groupe: any) => {

        //     this.groupesInvolved[groupe].map((rs: any) => {

        //       groupeList.push({ "risque": { "idRisque": rs.idRisque } })
        //     })

        //     this.jsonAvenant.groupes.push({
        //       "idGroupe": groupe,
        //       "description": "",
        //       "idPack": "",
        //       "groupeList": groupeList,
        //     })
        //     groupeList = []
        //   })
        // } else {

        //   groupeList.push({ "risque": { "idRisque": this.risquesInvolved[0].idRisque } })
        //   this.jsonAvenant.groupes.push({
        //     "idGroupe": this.risquesInvolved[0].idGroupe,
        //     "description": "",
        //     "idPack": "",
        //     "groupeList": groupeList,
        //   })
        // }

        //FIXME DELETED 19/11
        // this.jsonAvenant.groupes.map((groupe: any) => {
        //   groupe.groupeList.map((rs: any) => {

        //     rs.risque.paramList = []

        //     this.risquesInvolved.map((rsIn: any) => {

        //       if (rsIn.idRisque == rs.risque.idRisque) {

        //         this.avenant.paramRisque.forEach((param: any) => {
        //           let paramRisque = {}
        //           paramRisque = {
        //             idParam: param.paramRisque.idParamRisque,
        //             reponse: {
        //               idReponse: null,
        //               description: rsIn.description
        //             }
        //           }


        //           rs.risque.paramList.push(paramRisque)
        //         })
        //       }



        //     })

        //   })


        // })
        //**************multirisque */
      }

      if (!this.avenant.tarifaire) {

        // this.jsonAvenant.paramList = []
        this.jsonAvenant.groupes = this.risqueGroupe

      }

      if (!this.multiRisqueProduct) {
        if (!this.avenant.tarifaire) {
          this.jsonAvenant.groupes[0].groupeList[0].risque.paramList = []
          this.avenant.paramRisque.forEach((param: any) => {
            let paramRisque = {}
            if (param.paramRisque?.typeChamp?.description == 'Liste of values') {
              paramRisque = {
                idParam: param.paramRisque.idParamRisque,
                reponse: {
                  idReponse: null,
                  description: this.formParamRisque.get(param.paramRisque.codeParam)?.value
                }
              }

            } else if (param.paramRisque?.typeChamp?.description != 'date') {

              if (param.paramRisque?.idParamRisque == 34) {
                paramRisque = {
                  idParam: param.paramRisque.idParamRisque,
                  reponse: {
                    idReponse: null,
                    description: String(Number(this.formParamRisque.get(param.paramRisque.codeParam)?.value))
                  }
                }
              }
              else {
                if (param.paramRisque.codeParam == 'P56' || param.paramRisque.codeParam == 'P98' || param.paramRisque.codeParam == 'P25' || param.paramRisque.codeParam == 'P26') {
                  paramRisque = {
                    idParam: param.paramRisque.idParamRisque,
                    reponse: {
                      idReponse: this.formParamRisque.get(param.paramRisque.codeParam)?.value,
                      description: ''
                    }
                  }
                }
                else {
                  paramRisque = {
                    idParam: param.paramRisque.idParamRisque,
                    reponse: {
                      idReponse: null,
                      description: this.formParamRisque.get(param.paramRisque.codeParam)?.value
                    }
                  }
                }
              }
            } else {
              this.formParamRisque.get(param.paramRisque.codeParam)?.setValue(this.formParamRisque.get(param.paramRisque.codeParam)?.value)
              paramRisque = {
                idParam: param.paramRisque.idParamRisque,
                reponse: {
                  idReponse: null,
                  description: this.formParamRisque.get(param.paramRisque.codeParam)?.value

                }
              }
            }

            this.jsonAvenant.groupes[0].groupeList[0].risque.paramList.push(paramRisque)
            //this.jsonAvenant.paramList.push(paramRisque)

          });
        }
      }

      this.jsonAvenant.personnes = []

      if (this.isAssure && this.isConducteur) {
        console.log("quake5")

        this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"
        let personne: PersonneContrat = {
          role: (this.roles.find((role: any) => role.code === 'CP238') || {}).idParam,
          risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
          typeClient: this.typePersonne,
          idClient: this.formCreationAssure?.controls["codeClient"]?.value,
          nom: this.formCreationSouscripteur?.controls["nom"]?.value != "" ? this.formCreationSouscripteur?.controls["nom"]?.value : null,
          prenom: this.formCreationSouscripteur?.controls["prenom"]?.value != "" ? this.formCreationSouscripteur?.controls["prenom"]?.value : null,
          raisonSocial: this.formCreationSouscripteur?.controls["raisonSocial"]?.value != "" ? this.formCreationSouscripteur?.controls["raisonSocial"]?.value : null,
          dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
          nif: this.formCreationSouscripteur?.controls["nif"]?.value != "" ? this.formCreationSouscripteur?.controls["nif"]?.value : null,
          nin: this.formCreationSouscripteur?.controls["nin"]?.value != "" ? this.formCreationSouscripteur?.controls["nin"]?.value : null,
          telephone: {
            idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idTelephone"]?.value,
            description: this.formCreationSouscripteur?.controls["telephone"]?.value
          },
          email: {
            idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idEmail"]?.value,
            description: this.formCreationSouscripteur?.controls["email"]?.value
          },
          adresse: {
            idAdresse:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idAdresse"]?.value,
            description: this.formCreationSouscripteur?.controls["adresse"]?.value,
            wilaya: this.formCreationSouscripteur?.controls["wilaya"]?.value,
            commune: this.formCreationSouscripteur?.controls["commune"]?.value
          },
          genre: this.formCreationSouscripteur?.controls["genre"]?.value,
          situation: this.formCreationSouscripteur?.controls["situation"]?.value,
          profession: {
            id: this.formCreationAssure?.controls["idProfession"]?.value,
            idProfession: this.formCreationSouscripteur?.controls["profession"]?.value,
          },
          rib: {
            idRib: 0,
            description: this.formCreationAssure?.controls["rib"]?.value
          },
          permis: {
            idDocument: 0,
            description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
            categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
            dateDelivrance: '',
            wilayaDelivrance: 0
          }
        };

        this.avenant.paramRisque.map((param: any) => {
          if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
            switch (param.paramRisque.codeParam) {
              case "P56":
                personne.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                break;
              case "P54":
                personne.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                break;

              default:
                break;
            }
          }
        })

        this.jsonAvenant.personnes.push(personne)
      }
      else if (this.isAssure && this.isConducteurAssure) {
        console.log("quake7")

        this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"
        {
          let personne: PersonneContrat = {
            role: (this.roles.find((role: any) => role.code === 'CP238') || {}).idParam,
            risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
            typeClient: this.typePersonne,
            idClient: this.formCreationAssure?.controls["codeClient"]?.value,
            nom: this.formCreationAssure?.controls["nom"]?.value != "" ? this.formCreationAssure?.controls["nom"]?.value : null,
            prenom: this.formCreationAssure?.controls["prenom"]?.value != "" ? this.formCreationAssure?.controls["prenom"]?.value : null,
            raisonSocial: this.formCreationAssure?.controls["raisonSocial"]?.value != "" ? this.formCreationAssure?.controls["raisonSocial"]?.value : null,
            dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
            nif: this.formCreationAssure?.controls["nif"]?.value != "" ? this.formCreationAssure?.controls["nif"]?.value : null,
            nin: this.formCreationAssure?.controls["nin"]?.value != "" ? this.formCreationAssure?.controls["nin"]?.value : null,
            telephone: {
              idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idTelephone"]?.value,
              description: this.formCreationAssure?.controls["telephone"]?.value
            },
            email: {
              idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idEmail"]?.value,
              description: this.formCreationAssure?.controls["email"]?.value
            },
            adresse: {
              idAdresse:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idAdresse"]?.value,
              description: this.formCreationAssure?.controls["adresse"]?.value,
              wilaya: this.formCreationAssure?.controls["wilaya"]?.value,
              commune: this.formCreationAssure?.controls["commune"]?.value
            },
            genre: this.formCreationAssure?.controls["genre"]?.value,
            situation: this.formCreationAssure?.controls["situation"]?.value,
            profession: {
              id: this.formCreationAssure?.controls["idProfession"]?.value,
              idProfession: this.formCreationAssure?.controls["profession"]?.value,
            },
            rib: {
              idRib: 0,
              description: this.formCreationAssure?.controls["rib"]?.value
            },
            permis: {
              idDocument: 0,
              description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
              categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
              dateDelivrance: '',
              wilayaDelivrance: 0
            }
          };

          this.avenant.paramRisque.map((param: any) => {
            if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
              switch (param.paramRisque.codeParam) {
                case "P56":
                  personne.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                  break;
                case "P54":
                  personne.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                  break;

                default:
                  break;
              }
            }
          })

          this.jsonAvenant.personnes.push(personne)
        }
      }
      else if (this.isAssure) {
        this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

        let personne: PersonneContrat = {
          role: (this.roles.find((role: any) => role.code === 'CP236') || {}).idParam,
          idClient: this.formCreationAssure?.controls["codeClient"]?.value,
          nom: this.formCreationAssure?.controls["nom"]?.value != "" ? this.formCreationAssure?.controls["nom"]?.value : null,
          prenom: this.formCreationAssure?.controls["prenom"]?.value != "" ? this.formCreationAssure?.controls["prenom"]?.value : null,
          raisonSocial: this.formCreationAssure?.controls["raisonSocial"]?.value != "" ? this.formCreationAssure?.controls["raisonSocial"]?.value : null,
          dateNaissance: this.formCreationAssure?.controls["dateNaissance"]?.value,
          nif: this.formCreationAssure?.controls["nif"]?.value != "" ? this.formCreationAssure?.controls["nif"]?.value : null,
          nin: this.formCreationAssure?.controls["nin"]?.value != "" ? this.formCreationAssure?.controls["nin"]?.value : null,
          risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
          typeClient: this.typePersonne,
          telephone: {
            idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idTelephone"]?.value,
            description: this.formCreationAssure?.controls["telephone"]?.value
          },
          email: {
            idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idEmail"]?.value,
            description: this.formCreationAssure?.controls["email"]?.value
          },
          adresse: {
            idAdresse:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idAdresse"]?.value,
            description: this.formCreationAssure?.controls["adresse"]?.value,
            wilaya: this.formCreationAssure?.controls["wilaya"]?.value,
            commune: this.formCreationAssure?.controls["commune"]?.value
          },
          genre: this.formCreationAssure?.controls["genre"]?.value,
          situation: this.formCreationAssure?.controls["situation"]?.value,
          profession: {
            id: this.formCreationAssure?.controls["idProfession"]?.value,
            idProfession: this.formCreationAssure?.controls["profession"]?.value,
          },
          rib: {
            idRib: 0,
            description: this.formCreationAssure?.controls["rib"]?.value
          },
          permis: {}
        };

        this.jsonAvenant.personnes.push(personne)

        if (this.codeProduit == '45A') {
          this.typePersonne = this.formCreationConducteur?.controls['raisonSocial']?.value == null || this.formCreationConducteur?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

          let personne2: PersonneContrat = {
            role: (this.roles.find((role: any) => role.code === 'CP233') || {}).idParam,
            typeClient: this.typePersonne,
            risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
            idClient: this.formCreationConducteur?.controls["codeClient"]?.value,
            nom: this.formCreationConducteur?.controls["nom"]?.value != "" ? this.formCreationConducteur?.controls["nom"]?.value : null,
            prenom: this.formCreationConducteur?.controls["prenom"]?.value != "" ? this.formCreationConducteur?.controls["prenom"]?.value : null,
            raisonSocial: null,
            dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
            nif: null,
            nin: '',
            telephone: {
              idContact:!this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idTelephone"]?.value,
              description: this.formCreationConducteur?.controls["telephone"]?.value
            },
            email: {
              idContact:!this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idEmail"]?.value,
              description: this.formCreationConducteur?.controls["email"]?.value
            },
            adresse: {
              idAdresse:!this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idAdresse"]?.value,
              description: this.formCreationConducteur?.controls["adresse"]?.value,
              wilaya: this.formCreationConducteur?.controls["wilaya"]?.value,
              commune: this.formCreationConducteur?.controls["commune"]?.value
            },
            genre: this.avenant?.code == 'A17' || this.avenant?.code == "A26" ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P24")?.reponse?.idParamReponse?.idParam : 0,
            situation: this.formCreationConducteur?.controls["situation"]?.value,
            profession: {
              id: this.formCreationConducteur?.controls["idProfession"]?.value,
              idProfession: this.formCreationConducteur?.controls["profession"]?.value,
            },
            rib: {},
            permis: {
              idDocument: 0,
              description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
              categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
              dateDelivrance: this.avenant?.code == 'A17' || this.avenant?.code == "A26" ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P54")?.reponse?.valeur : '',
              wilayaDelivrance: this.avenant?.code == 'A17' || this.avenant?.code == "A26" ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P56")?.reponse?.valeur : 0
            }
          };
          
          
          this.avenant.paramRisque.map((param: any) => {
            if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
              switch (param.paramRisque.codeParam) {
                case "P56":
                  personne2.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                  break;
                case "P54":
                  personne2.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                  break;
                case "P24":
                  personne2.genre = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                  break;
                default:
                  break;
              }
            }
          })

          this.jsonAvenant.personnes.push(personne2)
        }

      }
      else if (this.isConducteur) {
        this.typePersonne = this.formCreationSouscripteur?.controls['raisonSocial']?.value == null || this.formCreationSouscripteur?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

        let personne: PersonneContrat = {
          role: (this.roles.find((role: any) => role.code === 'CP237') || {}).idParam,
          risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
          typeClient: this.typePersonne,
          idClient: this.formCreationSouscripteur?.controls["codeClient"]?.value,
          nom: this.formCreationSouscripteur?.controls["nom"]?.value != "" ? this.formCreationSouscripteur?.controls["nom"]?.value : null,
          prenom: this.formCreationSouscripteur?.controls["prenom"]?.value != "" ? this.formCreationSouscripteur?.controls["prenom"]?.value : null,
          raisonSocial: this.formCreationSouscripteur?.controls["raisonSocial"]?.value != "" ? this.formCreationSouscripteur?.controls["raisonSocial"]?.value : null,
          dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
          nif: this.formCreationSouscripteur?.controls["nif"]?.value != "" ? this.formCreationSouscripteur?.controls["nif"]?.value : null,
          nin: this.formCreationSouscripteur?.controls["nin"]?.value != "" ? this.formCreationSouscripteur?.controls["nin"]?.value : null,
          telephone: {
            idContact:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idTelephone"]?.value,
            description: this.formCreationSouscripteur?.controls["telephone"]?.value
          },
          email: {
            idContact:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idEmail"]?.value,
            description: this.formCreationSouscripteur?.controls["email"]?.value
          },
          adresse: {
            idAdresse: !this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 :this.formCreationSouscripteur?.controls["idAdresse"]?.value,
            description: this.formCreationSouscripteur?.controls["adresse"]?.value,
            wilaya: this.formCreationSouscripteur?.controls["wilaya"]?.value,
            commune: this.formCreationSouscripteur?.controls["commune"]?.value
          },
          genre: this.formCreationSouscripteur?.controls["genre"]?.value,
          situation: this.formCreationSouscripteur?.controls["situation"]?.value,
          profession: {
            id: this.formCreationSouscripteur?.controls["idProfession"]?.value,
            idProfession: this.formCreationSouscripteur?.controls["profession"]?.value,
          },
          rib: {},
          permis: {
            idDocument: 0,
            description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
            categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
            dateDelivrance: '',
            wilayaDelivrance: 0
          }
        };

        this.avenant.paramRisque.map((param: any) => {
          if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
            switch (param.paramRisque.codeParam) {
              case "P56":
                personne.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                break;
              case "P54":
                personne.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                break;

              default:
                break;
            }
          }
        })

        this.jsonAvenant.personnes.push(personne)
        this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

        let personne1: PersonneContrat = {
          role: (this.roles.find((role: any) => role.code === 'CP235') || {}).idParam,
          risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
          typeClient: this.typePersonne,
          idClient: this.formCreationAssure?.controls["codeClient"]?.value,
          nom: this.formCreationAssure?.controls["nom"]?.value != "" ? this.formCreationAssure?.controls["nom"]?.value : null,
          prenom: this.formCreationAssure?.controls["prenom"]?.value != "" ? this.formCreationAssure?.controls["prenom"]?.value : null,
          raisonSocial: this.formCreationAssure?.controls["raisonSocial"]?.value != "" ? this.formCreationAssure?.controls["raisonSocial"]?.value : null,
          dateNaissance: this.formCreationAssure?.controls["dateNaissance"]?.value,
          nif: this.formCreationAssure?.controls["nif"]?.value != "" ? this.formCreationAssure?.controls["nif"]?.value : null,
          nin: this.formCreationAssure?.controls["nin"]?.value != "" ? this.formCreationAssure?.controls["nin"]?.value : null,
          telephone: {
            idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 :this.formCreationAssure?.controls["codeClient"]?.value? this.formCreationAssure?.controls["idTelephone"]?.value:0,
            description: this.formCreationAssure?.controls["telephone"]?.value
          },
          email: {
            idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 :this.formCreationAssure?.controls["codeClient"]?.value? this.formCreationAssure?.controls["idEmail"]?.value:0,
            description: this.formCreationAssure?.controls["email"]?.value
          },
          adresse: {
            idAdresse:!this.formCreationAssure?.controls["codeClient"]?.value? 0 :this.formCreationAssure?.controls["codeClient"]?.value? this.formCreationAssure?.controls["idAdresse"]?.value:0,
            description: this.formCreationAssure?.controls["adresse"]?.value,
            wilaya: this.formCreationAssure?.controls["wilaya"]?.value,
            commune: this.formCreationAssure?.controls["commune"]?.value
          },
          genre: this.formCreationAssure?.controls["genre"]?.value,
          situation: this.formCreationAssure?.controls["situation"]?.value,
          profession: {
            id: this.formCreationAssure?.controls["idProfession"]?.value,
            idProfession: this.formCreationAssure?.controls["profession"]?.value,
          },
          rib: {
            idRib: 0,
            description: this.formCreationAssure?.controls["rib"]?.value
          },
          permis: {}
        };

        this.jsonAvenant.personnes.push(personne1)
      }
      else if (this.isConducteurAssure) {
        this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"
        console.log("quake9")

        let personne: PersonneContrat = {
          role: (this.roles.find((role: any) => role.code === 'CP234') || {}).idParam,
          typeClient: this.typePersonne,
          risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
          idClient: this.formCreationSouscripteur?.controls["codeClient"]?.value,
          nom: this.formCreationSouscripteur?.controls["nom"]?.value != "" ? this.formCreationSouscripteur?.controls["nom"]?.value : null,
          prenom: this.formCreationSouscripteur?.controls["prenom"]?.value != "" ? this.formCreationSouscripteur?.controls["prenom"]?.value : null,
          raisonSocial: this.formCreationSouscripteur?.controls["raisonSocial"]?.value != "" ? this.formCreationSouscripteur?.controls["raisonSocial"]?.value : null,
          dateNaissance: this.formCreationSouscripteur?.controls["dateNaissance"]?.value,
          nif: this.formCreationSouscripteur?.controls["nif"]?.value != "" ? this.formCreationSouscripteur?.controls["nif"]?.value : null,
          nin: this.formCreationSouscripteur?.controls["nin"]?.value != "" ? this.formCreationSouscripteur?.controls["nin"]?.value : null,
          telephone: {
            idContact:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idTelephone"]?.value,
            description: this.formCreationSouscripteur?.controls["telephone"]?.value
          },
          email: {
            idContact:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idEmail"]?.value,
            description: this.formCreationSouscripteur?.controls["email"]?.value
          },
          adresse: {
            idAdresse:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idAdresse"]?.value,
            description: this.formCreationSouscripteur?.controls["adresse"]?.value,
            wilaya: this.formCreationSouscripteur?.controls["wilaya"]?.value,
            commune: this.formCreationSouscripteur?.controls["commune"]?.value
          },
          genre: this.formCreationSouscripteur?.controls["genre"]?.value,
          situation: this.formCreationSouscripteur?.controls["situation"]?.value,
          profession: {
            id: this.formCreationSouscripteur?.controls["idProfession"]?.value,
            idProfession: this.formCreationSouscripteur?.controls["profession"]?.value,
          },
          rib: {},
          permis: {}
        };

        this.jsonAvenant.personnes.push(personne)
        this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

        let personne1: PersonneContrat = {
          role: (this.roles.find((role: any) => role.code === 'CP240') || {}).idParam,
          risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
          typeClient: this.typePersonne,
          idClient: this.formCreationAssure?.controls["codeClient"]?.value,
          nom: this.formCreationAssure?.controls["nom"]?.value != "" ? this.formCreationAssure?.controls["nom"]?.value : null,
          prenom: this.formCreationAssure?.controls["prenom"]?.value != "" ? this.formCreationAssure?.controls["prenom"]?.value : null,
          raisonSocial: this.formCreationAssure?.controls["raisonSocial"]?.value != "" ? this.formCreationAssure?.controls["raisonSocial"]?.value : null,
          dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
          nif: this.formCreationAssure?.controls["nif"]?.value != "" ? this.formCreationAssure?.controls["nif"]?.value : null,
          nin: this.formCreationAssure?.controls["nin"]?.value != "" ? this.formCreationAssure?.controls["nin"]?.value : null,
          telephone: {
            idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idTelephone"]?.value,
            description: this.formCreationAssure?.controls["telephone"]?.value
          },
          email: {
            idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idEmail"]?.value,
            description: this.formCreationAssure?.controls["email"]?.value
          },
          adresse: {
            idAdresse:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idAdresse"]?.value,
            description: this.formCreationAssure?.controls["adresse"]?.value,
            wilaya: this.formCreationAssure?.controls["wilaya"]?.value,
            commune: this.formCreationAssure?.controls["commune"]?.value
          },
          genre: this.formCreationAssure?.controls["genre"]?.value,
          situation: this.formCreationAssure?.controls["situation"]?.value,
          profession: {
            id: this.formCreationAssure?.controls["idProfession"]?.value,
            idProfession: this.formCreationAssure?.controls["profession"]?.value,
          },
          rib: {
            idRib: 0,
            description: this.formCreationAssure?.controls["rib"]?.value
          },
          permis: {
            idDocument: 0,
            description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
            categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
            dateDelivrance: '',
            wilayaDelivrance: 0
          }
        };

        this.avenant.paramRisque.map((param: any) => {
          if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
            switch (param.paramRisque.codeParam) {
              case "P56":
                personne1.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                break;
              case "P54":
                personne1.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                break;
              case "P24":
                personne1.genre = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                break;
              default:
                break;
            }
          }
        })

        this.jsonAvenant.personnes.push(personne1)
      }
      else {
        this.typePersonne = this.formCreationSouscripteur?.controls['raisonSocial']?.value == null || this.formCreationSouscripteur?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

        let personne: PersonneContrat = {
          role: (this.roles.find((role: any) => role.code === 'CP234') || {}).idParam,
          risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
          typeClient: this.typePersonne,
          idClient: this.formCreationSouscripteur?.controls["codeClient"]?.value,
          nom: this.formCreationSouscripteur?.controls["nom"]?.value != "" ? this.formCreationSouscripteur?.controls["nom"]?.value : null,
          prenom: this.formCreationSouscripteur?.controls["prenom"]?.value != "" ? this.formCreationSouscripteur?.controls["prenom"]?.value : null,
          raisonSocial: this.formCreationSouscripteur?.controls["raisonSocial"]?.value != "" ? this.formCreationSouscripteur?.controls["raisonSocial"]?.value : null,
          dateNaissance: this.formCreationSouscripteur?.controls["dateNaissance"]?.value,
          nif: this.formCreationSouscripteur?.controls["nif"]?.value != "" ? this.formCreationSouscripteur?.controls["nif"]?.value : null,
          nin: this.formCreationSouscripteur?.controls["nin"]?.value != "" ? this.formCreationSouscripteur?.controls["nin"]?.value : null,
          telephone: {
            idContact:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idTelephone"]?.value,
            description: this.formCreationSouscripteur?.controls["telephone"]?.value
          },
          email: {
            idContact:!this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 : this.formCreationSouscripteur?.controls["idEmail"]?.value,
            description: this.formCreationSouscripteur?.controls["email"]?.value
          },
          adresse: {
            idAdresse: !this.formCreationSouscripteur?.controls["codeClient"]?.value? 0 :this.formCreationSouscripteur?.controls["idAdresse"]?.value,
            description: this.formCreationSouscripteur?.controls["adresse"]?.value,
            wilaya: this.formCreationSouscripteur?.controls["wilaya"]?.value,
            commune: this.formCreationSouscripteur?.controls["commune"]?.value
          },
          genre: this.formCreationSouscripteur?.controls["genre"]?.value,
          situation: this.formCreationSouscripteur?.controls["situation"]?.value,
          profession: {
            id: this.formCreationSouscripteur?.controls["idProfession"]?.value,
            idProfession: this.formCreationSouscripteur?.controls["profession"]?.value,
          },
          rib: {},
          permis: {}
        };

        this.jsonAvenant.personnes.push(personne)
        this.typePersonne = this.formCreationAssure?.controls['raisonSocial']?.value == null || this.formCreationAssure?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

        let personne1: PersonneContrat = {
          role: (this.roles.find((role: any) => role.code === 'CP235') || {}).idParam,
          risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
          typeClient: this.typePersonne,
          idClient: this.formCreationAssure?.controls["codeClient"]?.value,
          nom: this.formCreationAssure?.controls["nom"]?.value != "" ? this.formCreationAssure?.controls["nom"]?.value : null,
          prenom: this.formCreationAssure?.controls["prenom"]?.value != "" ? this.formCreationAssure?.controls["prenom"]?.value : null,
          raisonSocial: this.formCreationAssure?.controls["raisonSocial"]?.value != "" ? this.formCreationAssure?.controls["raisonSocial"]?.value : null,
          dateNaissance: this.formCreationAssure?.controls["dateNaissance"]?.value,
          nif: this.formCreationAssure?.controls["nif"]?.value != "" ? this.formCreationAssure?.controls["nif"]?.value : null,
          nin: this.formCreationAssure?.controls["nin"]?.value != "" ? this.formCreationAssure?.controls["nin"]?.value : null,
          telephone: {
            idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idTelephone"]?.value,
            description: this.formCreationAssure?.controls["telephone"]?.value
          },
          email: {
            idContact:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idEmail"]?.value,
            description: this.formCreationAssure?.controls["email"]?.value
          },
          adresse: {
            idAdresse:!this.formCreationAssure?.controls["codeClient"]?.value? 0 : this.formCreationAssure?.controls["idAdresse"]?.value,
            description: this.formCreationAssure?.controls["adresse"]?.value,
            wilaya: this.formCreationAssure?.controls["wilaya"]?.value,
            commune: this.formCreationAssure?.controls["commune"]?.value
          },
          genre: this.formCreationAssure?.controls["genre"]?.value,
          situation: this.formCreationAssure?.controls["situation"]?.value,
          profession: {
            id: this.formCreationAssure?.controls["idProfession"]?.value,
            idProfession: this.formCreationAssure?.controls["profession"]?.value,
          },
          rib: {
            idRib: 0,
            description: this.formCreationAssure?.controls["rib"]?.value
          },
          permis: {}
        };

        this.jsonAvenant.personnes.push(personne1)

        if (this.codeProduit == '45A') {
          this.typePersonne = this.formCreationConducteur?.controls['raisonSocial']?.value == null || this.formCreationConducteur?.controls['raisonSocial']?.value == "" ? "PH" : "PM"

          let personne2: PersonneContrat = {
            role: (this.roles.find((role: any) => role.code === 'CP233') || {}).idParam,
            typeClient: this.typePersonne,
            risqueList: this.contrat?.groupeList ? [this.contrat?.groupeList[0]?.risques[0].idRisque] : [],
            idClient: this.formCreationConducteur?.controls["codeClient"]?.value,
            nom: this.formCreationConducteur?.controls["nom"]?.value != "" ? this.formCreationConducteur?.controls["nom"]?.value : null,
            prenom: this.formCreationConducteur?.controls["prenom"]?.value != "" ? this.formCreationConducteur?.controls["prenom"]?.value : null,
            raisonSocial: null,
            dateNaissance: this.formCreationConducteur?.controls["dateNaissance"]?.value,
            nif: null,
            nin: '',
            telephone: {
              idContact:!this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idTelephone"]?.value,
              description: this.formCreationConducteur?.controls["telephone"]?.value
            },
            email: {
              idContact:!this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idEmail"]?.value,
              description: this.formCreationConducteur?.controls["email"]?.value
            },
            adresse: {
              idAdresse:!this.formCreationConducteur?.controls["codeClient"]?.value? 0 : this.formCreationConducteur?.controls["idAdresse"]?.value,
              description: this.formCreationConducteur?.controls["adresse"]?.value,
              wilaya: this.formCreationConducteur?.controls["wilaya"]?.value,
              commune: this.formCreationConducteur?.controls["commune"]?.value
            },
            genre: this.avenant?.code == 'A17' || this.avenant?.code == "A26" ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P24")?.reponse?.idParamReponse?.idParam : 0,
            situation: this.formCreationConducteur?.controls["situation"]?.value,
            profession: {
              id: this.formCreationConducteur?.controls["idProfession"]?.value,
              idProfession: this.formCreationConducteur?.controls["profession"]?.value,
            },
            rib: {},
            permis: {
              idDocument: 0,
              description: this.formCreationConducteur?.controls["numeroPermis"]?.value,
              categorie: this.formCreationConducteur?.controls["categoriePermis"]?.value,
              dateDelivrance: this.avenant?.code == 'A17' || this.avenant?.code == "A26" ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P54")?.reponse?.valeur : '',
              wilayaDelivrance: this.avenant?.code == 'A17' || this.avenant?.code == "A26" ? this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P56")?.reponse?.valeur : 0
            }
          };

          this.avenant.paramRisque.map((param: any) => {
            if (param.paramRisque.categorieParamRisque.description == "Conducteur") {
              switch (param.paramRisque.codeParam) {
                case "P56":
                  personne2.permis.wilayaDelivrance = +this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                  break;
                case "P54":
                  personne2.permis.dateDelivrance = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                  break;
                case "P24":
                  personne2.genre = this.formParamRisque?.get(param.paramRisque.codeParam)?.value
                  break;
                default:
                  break;
              }
            }
          })

          this.jsonAvenant.personnes.push(personne2)

        }
      }

      if(this.avenant.code !== "A22" && this.avenant.code!="A168"){
        const hmac = await this.cryptoService.generateHmac(this.tkn, this.jsonAvenant);
        const stringifiedAvenant = JSON.stringify(this.jsonAvenant);
        const dataAvenant = {
          stringJson:stringifiedAvenant,
          signature: hmac
        }

        this.avenantService.calculAvenant(dataAvenant).subscribe({
          next: (data: any) => {
          
            this.loaderCalcul = false;
            this.retourCalcul = data
            this.jsonAvenant.groupes = data.groupes
            // data.packCompletList.map((newGarantie: any) => {
  
  
  
            // this.jsonAvenant.packCompletList = data.packCompletList
            // data.packCompletList.map((newGarantie: any) => {
  
            //   this.jsonAvenant.packCompletList.map((garantie: any) => {
            //     if (newGarantie.idPackComplet == garantie.idPackComplet && !garantie.isNew)
            //       garantie.isNew = true
  
            //   })
            //   this.jsonAvenant.packCompletList.push(newGarantie)
            // })
            // this.garantieAll.map((newGarantie: any) => {
            this.jsonAvenant.primeList = data.primeList
            this.PrimeTotale = data.primeList?.find((p: any) => p.idPrime == 101)?.prime
            this.jsonAvenant.taxeList = data.taxeList
  
            this.myStepper.next()
           
          },
          error: (error) => {
            this.loaderCalcul = false;
            Swal.fire(
              error.message != undefined ? error.message : `Une erreur s'est produite lors du calcul`,
              '',
              'error'
            )
          }
        })
      }else{
        this.myStepper.next()

      }

      
    } else {
      const invalid = [];
      const controls = this.formParamRisque.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }


    }
  }
  checkAlertVol(row: any, checked: any) {
    this.selection.toggle(row);
    if (row.idGarantie == 77 && checked) {
      Swal.fire(
        ` ATTENTION la GARANTIE "Vol Objets de Valeur" EST SOUMISE A LA DEROGATION DU  BO`,
        '',
        'warning'
      )
    }
    this.checkGarantie(row, checked);
  }

  checkGarantie(row: any, checked: any) {
    this.selection.toggle(row);
    if (checked && row.codeGarantie == "G50"  ) {

      this.getListParamRisque(row.sousGarantieList.data.find((sg: any) => sg.codeSousGarantie == "SG91").idListParamRisque, row.sousGarantieList.data.find((sg: any) => sg.codeSousGarantie == "SG91").idSousGarantie)
    }
    if (checked && row.codeGarantie == "G53" ) {

      this.getListParamRisque(row.sousGarantieList.data.find((sg: any) => sg.codeSousGarantie == "SG107").idListParamRisque, row.idGarantie)
    }
  }


  changeVehicule() {

    const NotrecherCondu= this.formCreationConducteur?.get("nom")?.dirty|| this.formCreationConducteur?.get("prenom")?.dirty || this.formCreationConducteur?.get("dateNaissance")?.dirty
    if(NotrecherCondu){
      Swal.fire(
        `Vous devez cliquer sur le button Rechercher pour le conducteur`,
        '',
        'error'
      )
      return 
    }
    if(this.avenant.code==="A21"&& !this.formCreationConducteur.valid && !this.isConducteur && !this.isConducteurAssure ){
      this.formCreationConducteur.updateValueAndValidity();
      return
    }
    this.carteOrangeRisqueRefference?.markAllAsTouched();
    const invalidRefs = this.carteOrangeRisqueRefference?.controls?.some(control => control.invalid);

    if (this.formParamRisque.valid && (this.avenant.code=="A26" ? !invalidRefs: true)) {
      if (this.formParamRisque.get("P30")?.value == this.oneRisqueInfo.find((risque: any) => risque.codeRisque == "P30")?.reponse?.valeur && this.avenant?.code != "A13" && this.codeProduit == "45A") {
        Swal.fire(
          `Veuillez changer le véhicule pour pouvoir continuer`,
          '',
          'info'
        )
      }
      else if (this.avenant?.controle) {
        this.controleDevis = []
        this.warningMessage = []
        this.controleParam();
        this.devisService.controleDevis([this.controleDevis], this.codeProduit).subscribe({
          next: async (data: any) => {

            data.map((paramData: any) => {
              this.paraRisqueProduitCategory[0].map((param: any) => {
                if (param.paramRisque.idParamRisque == paramData.idParam) {

                  if (paramData.message != null) {
                    this.warningMessage.push({
                      "idParam": param.idParamRisque,
                      "msg": paramData.message
                    })

                    if (param.codeParam == "P116" && this.formParamRisque.controls[param.formName].value > this.maxContenue)
                      this.devis.statue = 1
                  }
                  else {
                    if (param.codeParam == "P40" || param.codeParam == "P116")
                      this.devis.statue = 0
                  }
                }
              })
            })

            if (this.warningMessage.length != 0)
              await Swal.fire(
                this.warningMessage[0].msg,
                '',
                'warning'
              )
            // ({
            //               title: this.warningMessage[0].msg,
            //               'warning'
            //             })

            if (data?.[0]?.filter((paramData: any) => paramData.bloquant === true).length == 0) {
              this.getAllPackByProduit(2);

              if ((this.route.snapshot.paramMap.get('codeProduit') == "96" || this.route.snapshot.paramMap.get('codeProduit') == "95")) {
                this.getPack(this.contrat?.groupeList[0]?.pack?.idPack0, true, true)
                // this.objectDevis(true);
              } else {
                console.log("this.getPack 2 ",this.contrat?.groupeList )
                this.getPack(this.contrat?.groupeList[0]?.pack?.idPack0, true, false)
              }
              let idPackComplet = this.garantieAll.find((g: any) => g.idGarantie == 77)?.idPackComplet

              if (this.codeProduit == "96" && this.formPackGaranties.controls.find((garantie: any) => garantie.value.idPackComplet = idPackComplet)?.controls?.checked?.value)
                await Swal.fire(
                  ` ATTENTION la GARANTIE "Vol Objets de Valeur" EST SOUMISE A LA DEROGATION DU  BO`,
                  '',
                  'warning'
                )
            }

          },
          error: (error) => {
            this.handleError(error)
            console.log(error);

          }
        });


      }
      else {
console.log("this.getPack 3",this.dataSourceGroupePack.data[0].pack )
console.log("this.getPack 3",this.contrat?.groupeList )
        this.getAllPackByProduit(2);
        if(this.avenant?.code == "A26" && (this.codeProduit == "45F" || this.codeProduit == "45L"))
          this.getPack(this.dataSourceGroupePack.data[0].pack, true, true);
        else
          this.getPack(this.contrat?.groupeList[0]?.pack?.idPack0, true, true);


      }
    }
  }
  getPackMulti(idPack: any, idGroupe: any) {

    this.devis.groupes = this.risqueGroupe
    this.devis.groupes.map((groupe: any) => {
      if (groupe.idGroupe == idGroupe)
        groupe.idPack = idPack
    })
    this.risqueGroupe.map((groupe: any) => {
      if (groupe.idGroupe == idGroupe)
        groupe.idPack = idPack
    })

    this.packService.getPackById(idPack).subscribe({
      next: (pack: any) => {

        const foundGroup = this.groupesPacks.find((gr: any) => gr.group == idGroupe)

        if (!foundGroup)
          this.groupesPacks.push({
            group: idGroupe, pack: pack
          })
        else {
          this.groupesPacks.find((gr: any) => gr.group == idGroupe).pack = pack
        }
        // let groupeList: any = []
        // // groupeList.push({
        // //   risque:
        // // })
        // this.groupesInvolved[groupe].map((rs: any) => {
        //   groupeList.push({
        //     risque: {
        //       idRisque: rs.idRisque,
        //     }
        //   })
        // })

        // this.risqueGroupe.push({
        //   description: item.description,
        //   idGroupe: item.idGroupe,
        //   idPack: item.pack.idPack0,
        //   groupeList: groupeList,
        // });


      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  checkDoublons(numChassis: any, matricule: any) {


    const chassisExistsData = this.multiRisqueArray.some((risque: any) =>
      risque.P30 == numChassis
    );
    const chassisExists = this.contrat.groupeList.some((groupe: any) =>
      groupe.risques.some((rs: any) =>

        rs.risque.find((colonne: any) =>
          colonne.colonne.includes("Châssis")
        )?.valeur == numChassis
      )
    );

    const matriculeExists = this.contrat.groupeList.some((groupe: any) =>
      groupe.risques.some((rs: any) =>

        rs.risque.find((colonne: any) =>
          colonne.colonne.includes("N° d'Immatriculation")
        )?.valeur == matricule
      )
    );
    const matriculeExistsData = this.multiRisqueArray.some((risque: any) =>
      risque.P38 == matricule
    );


    if ((matriculeExists || matriculeExistsData) && (chassisExists || chassisExistsData)) {
      return "both";
    } else if (matriculeExists || matriculeExistsData) {
      return "P38";
    } else if (chassisExists || chassisExistsData) {
      return "P30";
    } else {
      return false;
    }
  }
  submitRisques() {
    this.controleRisque = []
    this.warningMessage = []
    let doublonsExist: any
    if (this.codeProduit == '45F' || this.codeProduit == '45L') {
      let formNameChassis = this.avenant?.paramRisque?.find((param: any) => param.paramRisque.codeParam == "P30").paramRisque.codeParam
      let formNameMatricule = this.avenant?.paramRisque?.find((param: any) => param.paramRisque.codeParam == "P38").paramRisque.codeParam

      doublonsExist = this.checkDoublons(this.formParamRisque?.get(formNameChassis)?.value, this.formParamRisque?.get(formNameMatricule)?.value)

    }
    if (this.formParamRisque.valid && !doublonsExist) {

      //FIX ME CEST QUOI CA
      // if (this.idPack != 0)
      //   this.getPack(this.idPack)

      let idparam
      let idreponse
      let description = "debase"
      let controlElement: any
      //  this.devis.paramList = []
      //************* param risque

      let risque: any = {}
      risque.paramList = []
      let groupeList: any = []
      this.avenant.paramRisque.map((param: any) => {
        Object.keys(this.formParamRisque.value).map((paramFormCode: any) => {

          if (paramFormCode == param.paramRisque.codeParam) {

            idparam = param.paramRisque.idParamRisque

            if (param.paramRisque.typeChamp?.description == 'Liste of values') {

              idreponse = this.formParamRisque.get(paramFormCode)?.value
              description = ''
              controlElement = {
                "idParam": idparam,
                "valeur": idreponse
              }
              Object.assign(this.risqueConsult, { [param.paramRisque.libelle]: this.formParamRisque.get(paramFormCode)?.value });

            } else {

              idreponse = null
              if (param.paramRisque.typeChamp?.description == 'From Table') {

                description = this.formParamRisque.get(paramFormCode)?.value
                Object.assign(this.risqueConsult, { [param.libelle]: this.formParamRisque.get(paramFormCode)?.value });

              } else if (param.paramRisque.typeChamp?.description != 'date') {


                if (param.paramRisque.idParamRisque == 34)
                  description = String(Number(this.formParamRisque.get(paramFormCode)?.value))
                else
                  if (paramFormCode == 'P25' || paramFormCode == 'P26') {

                    idreponse = this.formParamRisque.get(paramFormCode)?.value
                    description = ''
                    if (paramFormCode == 'P25') {
                      Object.assign(this.risqueConsult, { [param.paramRisque.libelle]: this.formParamRisque.get(paramFormCode)?.value.marque });
                    } else
                      Object.assign(this.risqueConsult, { [param.paramRisque.libelle]: this.formParamRisque.get(paramFormCode)?.value.modele });

                  } else {
                    description = this.formParamRisque.get(paramFormCode)?.value
                    Object.assign(this.risqueConsult, { [param.paramRisque.libelle]: description });
                  }



              } else {

                this.formParamRisque.get(paramFormCode)?.setValue(this.formParamRisque.get(paramFormCode)?.value)
                description = this.formParamRisque.get(paramFormCode)?.value
                Object.assign(this.risqueConsult, { [param.paramRisque.libelle]: description });

              }

              controlElement = {
                "idParam": idparam,
                "valeur": description

              }

            }
            this.paramElement = {
              "idParam": idparam,             
              "reponse": {
                "idReponse": idreponse,
                "description": description
              }
            }

          }
        })


        risque.paramList.push(this.paramElement)
        this.controleRisque.push(controlElement)

      })
      this.risqueIndexBody = this.risqueIndexBody + 1
      groupeList.push({
        "numRisque": this.risqueIndexBody,
        "risque": risque
      })
      if (this.multiRisqueProduct) {
        if (this.formParamRisque.get('groupe')?.value == 'new') {
          //ADD CREATE GROUPE HERE
          this.contratService.addGroupe(this.formParamRisque.get('newGroupe')?.value).subscribe({
            next: (datas: any) => {
              this.formParamRisque.get('groupe')?.setValue(
                {
                  description: datas.description,
                  idGroupe: datas.idGroupe,
                  idPack: 0,
                  descriptionPack: '',
                  new: 1
                })

              this.groupArray.push({
                'description': datas.description,
                'idGroupe': datas.idGroupe,
                "new": 1
              })
              let data: any = !this.dataSourceGroupePack ? [] : this.dataSourceGroupePack.data
              data.push({
                idGroupe: datas.idGroupe, descriptionGroupe: datas.description, pack: 0, newGroupe: 0
              })
              this.dataSourceGroupePack = new MatTableDataSource(data);

              const description = this.formParamRisque.get('groupe')?.value.description

              const existingGroup = this.risqueGroupe.find((groupe: any) => groupe.description === description);
              const existingGroupContrat = this.contrat.groupeList.find((groupe: any) => groupe.description === description);

              let idPack = existingGroupContrat ? this.contrat.groupeList.filter((groupe: any) => groupe.description == description)[0].pack.idPack0 : 0
              if (idPack != 0)
                this.getPackMulti(idPack, this.formParamRisque.get('groupe')?.value.idGroupe)


              if (existingGroup) {
                existingGroup.groupeList.push({
                  "numRisque": this.risqueIndexBody,
                  "risque": risque
                });

              } else {
                this.risqueGroupe.push({
                  description: description,
                  idGroupe: this.formParamRisque.get('groupe')?.value.idGroupe,
                  idPack: existingGroupContrat ? this.contrat.groupeList.filter((groupe: any) => groupe.description == description)[0].pack.idPack0 : 0,
                  groupeList: groupeList,
                });

              }

            },
            error: (error: any) => {

              console.log(error);

            }
          });



        } else {

          let groupExist = this.dataSourceGroupePack?.data?.find((grP: any) => grP.idGroupe == this.formParamRisque.get('groupe')?.value.idGroupe);
          if (!groupExist) {
            let data: any = !this.dataSourceGroupePack ? [] : this.dataSourceGroupePack.data
            data.push({
              idGroupe: this.formParamRisque.get('groupe')?.value.idGroupe, descriptionGroupe: this.formParamRisque.get('groupe')?.value.description, pack: this.formParamRisque.get('groupe')?.value.idPack, newGroupe: 1
            })
            this.dataSourceGroupePack = new MatTableDataSource(data);
          }


          const existingGroup = this.risqueGroupe.find((groupe: any) => groupe.idGroupe === this.formParamRisque.get('groupe')?.value.idGroupe);
          const existingGroupContrat = this.contrat.groupeList.find((groupe: any) => groupe.idGroupe === this.formParamRisque.get('groupe')?.value.idGroupe);

          let idPack = existingGroupContrat ? this.contrat.groupeList.filter((groupe: any) => groupe.idGroupe == this.formParamRisque.get('groupe')?.value.idGroupe)[0].pack.idPack0 : 0
          if (idPack != 0)
            this.getPackMulti(idPack, this.formParamRisque.get('groupe')?.value.idGroupe)


          if (existingGroup) {
            existingGroup.groupeList.push({
              "numRisque": this.risqueIndexBody,
              "risque": risque
            });

          } else {
            this.risqueGroupe.push({
              description: this.formParamRisque.get('groupe')?.value.description,
              idGroupe: this.formParamRisque.get('groupe')?.value.idGroupe,
              idPack: existingGroupContrat ? this.contrat.groupeList.filter((groupe: any) => groupe.idGroupe == this.formParamRisque.get('groupe')?.value.idGroupe)[0].pack.idPack0 : 0,
              groupeList: groupeList,
            });

          }

        }
        //   let risque: any = {}
        //   risque.paramList = []

      } else {
        this.risqueGroupe = [{
          "description": "mono",
          "groupeList": groupeList,
        }]
      }

      this.devisService.controleDevis([this.controleRisque], this.codeProduit).subscribe({
        next: (data: any) => {

          data.map((paramData: any) => {
            this.avenant.paramRisque.map((param: any) => {


              if (param.idParamRisque == paramData.idParam) {
                if (paramData.bloquant) {

                  this.formParamRisque.controls[param.formName].addValidators([customParam(paramData.bloquant, paramData.message)])
                  this.formParamRisque.controls[param.formName].updateValueAndValidity();
                } else if (paramData.message != null) {
                  this.warningMessage.push({
                    "idParam": param.idParamRisque,
                    "msg": paramData.message
                  })

                  if (param.codeParam == "P40" || param.codeParam == "P116")
                    this.devis.statue = 1
                } else
                  if (param.codeParam == "P40" || param.codeParam == "P116")
                    this.devis.statue = 0

              }
            })
          })

          if (this.warningMessage.length != 0)
            this._snackBar.open(this.warningMessage[0].msg, 'fermer', {
              horizontalPosition: "end",
              panelClass: ['warning-snackbar']
            })

          if (data?.[0]?.filter((paramData: any) => paramData.bloquant === true).length == 0) {
            this.devis.groupes = this.risqueGroupe
            if (this.multiRisqueProduct) {
              {
                this.multiRisqueTab(this.paramElement)
                // this.createGroupe()
              }

            }
            else
              this.myStepper.next();
            this.getAllPack()

          }


        },
        error: (error) => {
          this.handleError(error)
          console.log(error);


        }
      });
    } else {
      if (doublonsExist) {
        let msg = ""
        switch (doublonsExist) {
          case 'P30':
            msg = "Numéro de Châssis doit etre unique."
            break;
          case 'P38':
            msg = "Le N° d'Immatriculation doit etre unique."
            break;
          case 'both':
            msg = "Le N° d'Immatriculation ainsi que le numéro de Châssis doivent etre uniques."
            break;
          default:
            break;
        }
        Swal.fire(
          msg,
          ``,
          `error`,

        )
      }

    }
  }
  multiRisqueTab(paramElement: any) {

    let objectParam = this.formParamRisque.value

    Object.keys(this.formParamRisque.value).map((element: any) => {

      if (typeof this.formParamRisque.controls[element].value === "object") {
        if (element == "Marque")
          objectParam[element] = this.formParamRisque.controls[element].value?.marque
        else if (element == "Modèle")
          objectParam[element] = this.formParamRisque.controls[element].value?.modele
        else

          objectParam[element] = this.formParamRisque.controls[element].value?.description
      } else {
        // if (element == "Wilaya")
        //   objectParam[element] = this.wilayas.filter((wilaya: any) => wilaya.idWilaya == this.formParamRisque.controls[element].value)[0].description
        // else if (element == "Commune")
        //   objectParam[element] = this.communes.filter((commune: any) => commune.idCommune == this.formParamRisque.controls[element].value)[0].description
        // else
        objectParam[element] = this.formParamRisque.controls[element].value
      }

    });

    Object.assign(objectParam, { risqueNum: this.risqueIndex = this.risqueIndex + 1 });

    this.multiRisqueArray.push(objectParam)

    this.dataSourceRisque = new MatTableDataSource(this.multiRisqueArray)
    //formParamRisque.resetForm()
    //add validator
    // this.avenant.paramRisque.map((paramRisque: any) => {
    //   if (paramRisque.paramRisque.sizeChamp != 0 && paramRisque.paramRisque.sizeChamp != undefined)
    //     this.formParamRisque.get(paramRisque.paramRisque.codeParam)?.setValidators([Validators.required, Validators.minLength(paramRisque.paramRisque.sizeChamp), Validators.maxLength(paramRisque.paramRisque.sizeChamp)])
    //   else
    //     if (paramRisque.obligatoire)
    //       //  this.formParamRisque.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required]));
    //       this.formParamRisque.get(paramRisque.paramRisque.codeParam)?.setValidators([Validators.required])
    //     else
    //       //  this.formParamRisque.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue));
    //       this.formParamRisque.get(paramRisque.paramRisque.codeParam)?.setValidators([])

    // })

  }

  controleParam() {

    let idparam
    let idreponse
    let description = "debase"
    let controlElement: any

    this.paraRisqueProduitCategory[0].map((param: any) => {
      Object.keys(this.formParamRisque.value).map((paramFormName: any) => {
        if (paramFormName == param.paramRisque.codeParam) {

          idparam = param.paramRisque.idParamRisque

          if (param.paramRisque?.typeChamp?.description == 'Liste of values') {
            idreponse = this.formParamRisque.get(paramFormName)?.value
            description = ''
            controlElement = {
              "idParam": idparam,
              "valeur": idreponse
            }

          } else {

            idreponse = ''
            if (param.paramRisque?.typeChamp?.description == 'From Table') {

              description = this.formParamRisque.get(paramFormName)?.value


            } else if (param.paramRisque?.typeChamp?.description != 'date') {

              if (param.paramRisque?.idParamRisque == 34)
                description = String(Number(this.formParamRisque.get(paramFormName)?.value))
              else
                description = this.formParamRisque.get(paramFormName)?.value


            } else {

              this.formParamRisque.get(paramFormName)?.setValue(this.formParamRisque.get(paramFormName)?.value)
              description = this.formParamRisque.get(paramFormName)?.value
            }

            controlElement = {
              "idParam": idparam,
              "valeur": description

            }

          }

          this.controleDevis.push(controlElement)
        }
      })
    })
  }

  openDialog(risqueNum: any) {

    const updatedJson: Record<string, any> = {};
    this.multiRisqueArray.map((risque: any) => {
      if (risque.risqueNum == risqueNum) {
        for (const [oldKey, value] of Object.entries(risque)) {

          const newKey = this.avenant.paramRisque.find((rsAvenant: any) => rsAvenant.paramRisque.codeParam == oldKey)?.paramRisque.libelle

          // const newKey = keyMapping[oldKey] || oldKey;
          if (newKey)
            updatedJson[newKey] = value;
        }
      }
    })


    let dialogRef = this.dialog.open(DialogRisqueComponent, {
      width: '60%',
      data: {
        risque: updatedJson
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {

    });
  }
  deleteRisque(idRisque: any) {

    this.multiRisqueArray = this.multiRisqueArray.filter((risque: any) => risque.risqueNum != idRisque)

    this.dataSourceRisque.data = this.multiRisqueArray
    let idGroupe: any
    let multipleOccurance = false

    this.risqueGroupe.map((groupe: any) => {

      groupe.groupeList = groupe.groupeList.filter((risque: any) => {
        if (risque.numRisque == idRisque) {
          idGroupe = groupe.idGroupe
        }
        multipleOccurance = groupe.idGroupe == idGroupe && groupe.groupeList.length > 1 ? true : false
        return risque.numRisque != idRisque
      })

    })

    if (!multipleOccurance) {
      this.groupArray = this.groupArray.filter((groupe: any) => {
        if (groupe.new != 0)
          return groupe.idGroupe != idGroupe
        else return this.groupArray
      })


    }

    // this.dataSourceGroupePack.data = this.dataSourceGroupePack.data.filter((groupPack: any) => {
    //   if (groupPack.group != descriptionGroup) {
    //     this.risqueGroupe.map((groupe: any) => {
    //       if (groupe.description == groupPack.group && groupe.groupeList.length == 0)
    //         return this.dataSourceGroupePack.data.filter((groupPack: any) => groupPack.group != descriptionGroup)
    //     })
    //   }
    // })

    this.dataSourceGroupePack.data = this.dataSourceGroupePack.data.filter((groupPack: any) => {


      return groupPack.idGroupe != idGroupe ||
        !this.risqueGroupe.some((groupe: any) => groupe.idGroupe === groupPack.idGroupe && groupe.groupeList.length === 0);
    });

    this.jsonAvenant.groupes = this.risqueGroupe
    this.devis.groupes = this.risqueGroupe

  }
  editRisque(idRisque: any, paramRisque: any) {
    this.risqueSelected = true
    if(this.avenant.code==="A26"){
      const targetedRisque= this.risquesInvolved.find((el:any)=>el.idRisque==idRisque)

      this.contratService.getParamContratByIdRisque(this.contrat.idContrat, targetedRisque.idGroupe, targetedRisque.idRisque).subscribe({
        next: async (data: any) => {
          for (let i = 0; i < data.length; i++) {
            const param = data[i];
            let value;
            if (param.reponse?.idParamReponse) {
              value = param.reponse.idParamReponse.idParam;
            } else {
              value = param?.reponse?.valeur;
            }
            if (param?.codeRisque === 'P25') {
             await  this.getModeleByMarque(param.reponse?.idParamReponse.idParam);
            }


            if (this.formParamRisque?.controls[param.codeRisque]) {
              this.formParamRisque?.controls[param.codeRisque]?.setValue(value);
            }
          }

        }})
        this.formParamRisque.updateValueAndValidity()
        this.idRisque = idRisque

    }
    else{
      this.risquesInvolved.map((rsInv: any) => {

        if (idRisque == rsInv.idRisque) {
          this.idRisque = idRisque
          this.formParamRisque?.controls[rsInv.codeParam]?.setValue(rsInv.description)

        }

      })
    }


  }
  editMatricule() {

    const targetRisque = this.risquesInvolved.find((rsInv: any) => rsInv.idRisque === this.idRisque);
    this.risquesModified.find((el:any)=>el.id==this.idRisque).modified=true

    if (targetRisque) targetRisque.description = this.formParamRisque.get(targetRisque.codeParam)?.value;
    this.dataSourceParamRisque.data = this.risquesInvolved
    let paramRisques: any = []
    this.avenant?.paramRisque.forEach((param: any) => {
      let paramRisque = {}
      if (param.paramRisque?.typeChamp?.description == 'Liste of values') {
        paramRisque = {
          idParam: param.paramRisque.idParamRisque,
          reponse: {
            idReponse: this.formParamRisque.get(param.paramRisque.codeParam)?.value,
            description: ''
          }
        }
      }
      else {
        if (param.paramRisque.codeParam == 'P56' || param.paramRisque.codeParam == 'P98' || param.paramRisque.codeParam == 'P25' || param.paramRisque.codeParam == 'P26') {
          paramRisque = {
            idParam: param.paramRisque.idParamRisque,
            reponse: {
              idReponse: this.formParamRisque.get(param.paramRisque.codeParam)?.value,
              description: ''
            }
          }
        }
        else {
          paramRisque = {
            idParam: param.paramRisque.idParamRisque,
            reponse: {
              idReponse: null,
              description: this.formParamRisque.get(param.paramRisque.codeParam)?.value
            }
          }
        }
      }
      paramRisques.push(paramRisque)
    })
    this.risqueGroupe.map((groupe: any) => {
      if (targetRisque.idGroupe == groupe.idGroupe) {
        groupe.groupeList.map((item: any) => {
          if (item.risque.idRisque == targetRisque.idRisque) {
            item.risque.paramList = paramRisques
          }
        })
      }

    })
    this.risqueEdited = true
    setTimeout(() => {
      this.risqueEdited = false

    }, 10000);
  }
  async submitApplicationAvenant() {

    if (this.formApplicationAvenant.valid) {
      this.loaderApplication = true;

      // this.devis.packCompletList.map((garantie: any) => {
      //   garantie.prime = this.garantieTab.find((g: any) => g.idPackComplet == garantie.idPackComplet)?.prime
      // })

      // this.jsonAvenant.pack = {
      //   packCompletList: this.devis.packCompletList
      //   primeList: [],
      //   taxeList: []
      // }
      if(this.avenant?.code === 'A22' && !this.avenant?.attestation && this.codeProduit !='45A' || this.avenant?.code === 'A26'){
        const risques = this.carteOrangeRisqueRefference.value ;

            // Update references based on risques
          this.jsonAvenant.groupes?.forEach((group: any) => {
            group.groupeList.forEach((risque: any) => {
                const index = risques.findIndex((res: any) => {

                    return res.idRisque === risque.risque.idRisque;
                });


                if (index > -1) {
                    risque.risque.reference = risques[index].reference;
                }
            });
        });

        // Replace null categorieList with empty arrays
        const groupes = this.jsonAvenant.groupes;
        if (groupes && groupes.length > 0) {
            const groupeList = groupes[0].groupeList;
            // Check modifications

            if (groupeList && groupeList.length > 0) {
                groupeList.forEach((groupe: any) => {
                    const packCompletList = groupe.risque.packCompletList;
                    if (packCompletList && packCompletList.length > 0) {
                        for (const pack of packCompletList) {
                            if (pack.categorieList === null) {
                                pack.categorieList = [];  // Replace null with empty array
                            }
                        }
                    }
                });
            }
        }

      }
      this.jsonAvenant.auditUser = sessionStorage.getItem('userId');

      const hmac = await this.cryptoService.generateHmac(this.tkn, this.jsonAvenant);
      const stringifiedAvenant = JSON.stringify(this.jsonAvenant);
      const dataAvenant = {
        stringJson:stringifiedAvenant,
        signature: hmac
      }


      this.avenantService.submitAvenant(dataAvenant).subscribe({
        next: (data: any) => {
          // this.formApplicationAvenant.reset();
          this.loaderApplication = false;
          this.avenantSave = true;
          Swal.fire(
            `Avenant appliqué avec succés`,
            '',
            'success'
          )
          this.retourApplication = data
          this.redirectConsultation();
          // this.router.navigate(['/consultation-avenants/' + this.idContrat]);
        },
        error: (error) => {
          this.loaderApplication = false;
          Swal.fire(
            error.message != undefined ? error.message : `Une erreur s'est produite lors de l'application`,
            '',
            'error'
          )
        }
      })
    }
  }
  getDateExpiration(idDuree: any) {
    let fieldName = ""

    let body = {
      "dateEffet": moment.utc(this.formApplicationAvenant.get("dateAvenant")?.value).add(1,"hour").toISOString(),
      "jour": 0,
      "duree": this.durees.filter((duree: any) => duree.id_duree == idDuree)[0]
    }

    this.avenantService.getDateExpiration(body).subscribe({
      next: (data: any) => {
        fieldName = this.avenant.attributs.filter((att: any) => att.idAtrribut.nomBdd == 'dateExpiration')[0].idAtrribut.nomBdd
        this.formApplicationAvenant.get(fieldName)?.setValue(data)
      },
      error: (error) => {

      }
    })
  }
  // reduction
  getAllConventions() {
    this.conventionService.getAllConventions().subscribe({
      next: (data: any) => {

        this.conventions = data

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getAllReductions() {

    this.filterReduction.typeReduction = 262
    this.filterReduction.produit = this.idProduit

    this.reductionService.reductionFiltre(this.filterReduction).subscribe({
      next: (data: any) => {

        this.reductions = data




      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getReductionByConvention(idConvention: any) {

    if (idConvention != 'aucuneConvention') {

      this.formReduction.get("reduction")?.setValidators([Validators.required])
      this.reductionService.getReductionByConvention(idConvention).subscribe({
        next: (data: any) => {
          if (data.length != 0) {
            this.reductions = data.filter((reduc: any) => reduc.produit == JSON.parse(sessionStorage.getItem('products') || '{}').find((parametre: any) => parametre.codeProduit == this.route.snapshot.paramMap.get('codeProduit')).description)
            this.errorHandler.error = false

            this.errorHandler.msg = ""
          } else {
            this.errorHandler.error = true

            this.errorHandler.msg = "cette convention n'a aucune rÃ©duction."
          }



        },
        error: (error) => {

          console.log(error);

        }
      });
    } else {
      this.errorHandler.error = false

      this.errorHandler.msg = ""
      this.formReduction.get("reduction")?.setValidators([])
      this.getAllReductions()
    }

  }
  handleError(error: any) {

    switch (error.status) {
      case 500: //
        this.errorHandler.error = true
        this.errorHandler.msg = "Erreur système, veuillez contacter l'administrateur."
        break;
      case 402: // actif
        this.errorHandler.error = true
        this.errorHandler.msg = "Erreur lors de la validation du devis, veuillez contacter l'administrateur."
        break;
      case 404: // actif
        this.errorHandler.error = true
        this.errorHandler.msg = error.message
        break;
    }

  }
  nextPrime() {
    if (this.reductionExist)
      this.myStepper.next()
    else
      this.calculPrime()
  }

  goBackReduc() {
    this.returnedTarif.groupes=this.groupeBeforeReduc
    this.retourCalcul.primeList = this.primeList
    this.retourCalcul.taxeList = this.taxeList
    this.jsonAvenant.primeList = this.primeList
    this.jsonAvenant.taxeList = this.taxeList
    this.PrimeTotale = this.primeList?.find((elt: any) => elt.idPrime = 101)?.primeProrata;
    this.myStepper.previous();
  }

  async submitReduction() {

    this.formReduction?.get("convention")?.enable()
    this.formReduction?.get("reduction")?.enable()

    //  if (this.formReduction.get("convention")?.value != 'aucuneConvention' && this.formReduction.get("reduction")?.value != 0) {
    // Object.assign(this.returnedTarif, {idReduction: this.formReduction.get("reduction").value});

    if (this.formReduction.valid) {
      if (this.formReduction?.get("reduction")?.value != 'aucuneReduction') {

        this.groupeBeforeReduc= this.returnedTarif.groupes
        this.returnedTarif.idConvention = this.formReduction.get("convention")?.value
        this.returnedTarif.idReduction = this.formReduction.get("reduction")?.value
        this.returnedTarif.typeAvenant = this.idTypeAvenant

        const hmac = await this.cryptoService.generateHmac(this.tkn, this.returnedTarif);
        const stringifiedAvenant = JSON.stringify(this.returnedTarif);
        const dataAvenant = {
          stringJson:stringifiedAvenant,
          signature: hmac
        }

        this.reductionService.applyReduction(dataAvenant).subscribe({
          next: (data: any) => {
            this.jsonAvenant.groupes = data.groupes
            this.jsonAvenant.primeList = data.primeList

            this.jsonAvenant.taxeList = data.taxeList
            if (this.avenant?.code == 'A13' || this.avenant?.code == 'A18' || this.avenant?.code == "A22") {

              this.formReduction?.get("convention")?.enable()
              this.formReduction?.get("reduction")?.enable()
              this.myStepper.next()
            } else {

              this.formReduction?.get("convention")?.disable()
              this.formReduction?.get("reduction")?.disable()
              this.calculPrime()
            }
            this.retourCalcul.primeList = data.primeList
            this.retourCalcul.taxeList = data.taxeList


            this.PrimeTotale = this.retourCalcul.primeList.find((elt: any) => elt.idPrime = 101).primeProrata;

            // if (this.avenant?.code == 'A13' || this.avenant?.code == 'A18') {
            //   this.retourCalcul.primeList = data.primeList
            //   this.retourCalcul.taxeList = data.taxeList
            //   this.calculPrime()
            // }
            // else {
            //   this.retourCalcul.primeList = data.primeList
            //   this.retourCalcul.taxeList = data.taxeList
            //   // this.PrimeTotale = data.primeList.find((p: any) => p.idPrime == 101)?.prime
            //   // this.myStepper.next()
            // }

          },
          error: (error) => {
            console.log(error)
            this.handleError(error)

            if (this.avenant?.code != 'A13' && this.avenant?.code != 'A18' && this.avenant?.code != 'A21') {
              this.formReduction?.get("convention")?.disable()
              this.formReduction?.get("reduction")?.disable()
            }
            if (error.status == 400) {
              Swal.fire(
                `l'assuré ne bénéficie plus de la réduction.`,
                '',
                'info'
              )

              if (this.avenant?.code != 'A13' && this.avenant?.code != 'A18' && this.avenant?.code != "A22")
                this.calculPrime()
              else
                this.myStepper.next()

            }

          }
        });
      }
      else {
        if (this.avenant?.code != 'A13' && this.avenant?.code != 'A18' && this.avenant?.code != "A22"||(this.avenant?.code=='A168' && this.codeProduit=='45F')) {
          this.calculPrime()

          this.formReduction?.get("convention")?.disable()
          this.formReduction?.get("reduction")?.disable()

        }
        else
          this.myStepper.next()
      }

    } else {
      this.formReduction?.get("convention")?.disable()
      this.formReduction?.get("reduction")?.disable()

      if (this.avenant?.code != 'A13' && this.avenant?.code != 'A18' && this.avenant?.code != "A22")
        this.calculPrime()
      else
        this.myStepper.next()
    }
    // else if (this.formReduction?.get("convention")?.value == 'aucuneConvention' && this.formReduction.valid) {
    //   if (this.formReduction?.get("reduction")?.value == 'aucuneReduction') {

    //     this.myStepper.next();
    //     this.errorHandler.error = false
    //     this.errorHandler.msg = ""
    //   } else {
    //     this.returnedTarif.idConvention = this.formReduction.get("convention")?.value
    //     this.returnedTarif.idReduction = this.formReduction.get("reduction")?.value
    //     this.reductionService.applyReduction(this.returnedTarif).subscribe({
    //       next: (data: any) => {
    //         this.jsonAvenant.packCompletList = data.packCompletList
    //         this.jsonAvenant.primeList = data.primeList
    //         this.jsonAvenant.taxeList = data.taxeList
    //         if (this.avenant?.code != 'A13' || this.avenant?.code != 'A18') {
    //           this.formReduction?.get("convention")?.enable()
    //           this.formReduction?.get("reduction")?.enable()
    //         }
    //         this.calculPrime()

    //       },
    //       error: (error) => {
    //         console.log(error)
    //         this.handleError(JSON.parse(error))

    //       }
    //     });
    //   }
    // }
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    this.uploadExcelFile()
  }
  uploadExcelFile() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target != null) {
          let base64String = event.target.result as string;
          const parts = base64String?.split(',');

          if (parts.length === 2)
            base64String = parts[1];
          this.sendToAPI(base64String);
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  sendToAPI(base64: any) {
    let body = {
      "file": base64
    }
    this.devisService.controleDevisMulti(body, this.codeProduit).subscribe({
      next: (data: any) => {
        this.fileControle = data
        const erroFile = this.fileControle.some((lignes: any) => lignes.description.some((desc: any) => desc.length !== 0));
        this.taillersq=data.length
        
        if (erroFile) {
          this.fileInput.nativeElement.value = null;
          this.fileSuccess = false
        }



        if (this.fileControle.length > 50 && (sessionStorage.getItem('roles')?.includes("DA") || sessionStorage.getItem('roles')?.includes("CDC"))) {
          Swal.fire(
            `Vous n’avez pas le privilège pour faire ce devis veuillez voir avec le BO`,
            ``,
            `error`,

          )
          this.fileSuccess = false
          this.fileInput.nativeElement.value = null;
        }
        else {
          this.devis.file = base64
          this.fileSuccess = true
        }

      },
      error: (error) => {

        Swal.fire(
          error,
          ``,
          `error`,

        )
        this.fileInput.nativeElement.value = null;
      }
    });
  }

  //Renouvellement
  goToNextStep() {
    this.formStep++;
  }

  goToPreviousStep() {
    
      this.formStep--;
    
  }

  // adding nmb vehicule renouvellement
  submitNumberVehicule() {
    
    this.tailleRisquee = this.nmbVehicule.value;
    console.log('555555555555555',  this.devis.tailleRisque)
    console.log('eee',this.nmbVehicule.value)
    this.myStepper.next();
    // Retrieve roles from session storage
    

  
    console.log('3endiiiiiii')

    // Continue with the rest of the logic if the condition is not met
    this.withFile = true;
    this.devis.file = null;

  }

  // fin adding nmb vehicule test
  checkVehiculeNumber() {

  
    console.log("aaaa",this.nmbVehicule)
    console.log("bbbbb",this.multiRisqueArray)
  

    if ((this.nmbVehicule.value !== this.multiRisqueArray.length && this.devis.sousProduit!='10'&& this.codeProduit!='97') 
    ) {
      Swal.fire(
        " le nombre de véhicules ajoutés ne correspond pas au nombre de véhicules indiqué",
        `error`
      )
      
    } else 
    

    // REVIENS LA POUR LE MESSAGE SMP >50000
      this.myStepper.next();

  }


}
function customParam(bloquant: boolean, message: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // return { 'bloquant': bloquant,'msg': message };
    return {
      "bloquant": bloquant,
      "msg": message
    }

  };
}