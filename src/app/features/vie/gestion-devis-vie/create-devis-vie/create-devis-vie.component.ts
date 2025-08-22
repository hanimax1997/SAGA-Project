import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren,OnChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Patterns } from '../../../../core/validiators/patterns'
import * as pdfMake from 'pdfmake/build/pdfmake';
//models
import { ParamRisqueProduit } from 'src/app/core/models/param-risque-produit';
import { Devis } from 'src/app/core/models/devis';
import { returnJson } from 'src/app/core/models/devis';
import { DevisJson } from 'src/app/core/models/devis';
import { ParamList } from 'src/app/core/models/param-risque-produit';
import { ParamRisque } from 'src/app/core/models/param-risque';
//service
import { GenericService } from '../../../../core/services/generic.service'
import { ParamRisqueService } from '../../../../core/services/param-risque.service'
import { DureeService } from 'src/app/core/services/duree.service';
import { PersonneService } from 'src/app/core/services/personne.service';
import { AgencesService } from 'src/app/core/services/agences.service';
import { PackService } from 'src/app/core/services/pack.service';
import { DevisService } from 'src/app/core/services/devis.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ReductionService } from 'src/app/core/services/reduction.service';
import { ConventionService } from 'src/app/core/services/convention.service';
import { ReductionFiltreJson } from 'src/app/core/models/reduction';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProductCodes } from 'src/app/core/config/produits';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { VehiculeService } from 'src/app/core/services/vehicule.service';
import * as XLSX from 'xlsx';
import { Observable, ReplaySubject } from 'rxjs';
import { N } from '@angular/cdk/keycodes';
import { DialogRisqueComponent } from 'src/app/features/gestion-devis/dialog-risque/dialog-risque.component';
import { ListRisqueDialogComponent } from 'src/app/features/gestion-devis/creation-devis/list-risque-dialog/list-risque-dialog.component';
import { CryptoService } from 'src/app/core/services/crypto.service';

const todayDate: Date = new Date;

export function ageInf18Validator(control: AbstractControl): { [key: string]: boolean } | null {
  var birthday: Date = new Date(control.value);

  if ((todayDate.getFullYear() - birthday.getFullYear()) < 18) {
    return {
      'ageInf18': true
    };
  }
  return null;
}

export function ageSup107Validator(control: AbstractControl): { [key: string]: boolean } | null {
  var birthday: Date = new Date(control.value);

  if ((todayDate.getFullYear() - birthday.getFullYear()) > 106) {
    return {
      'ageSup107': true
    };
  }
  return null;
}

@Component({
  selector: 'app-create-devis-vie',
  templateUrl: './create-devis-vie.component.html',
  styleUrls: ['./create-devis-vie.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})



export class CreateDevisVieComponent implements OnInit {
  load: boolean = false;
  loadTable: boolean = false; idDevis: string;
  actualControlGarantie: number;
  codeProduit: string | null;
  basicTarif: any;
  groupArray: any = [];
  @ViewChild('stepper') private myStepper: MatStepper;
  @ViewChild('fileInput') fileInput: ElementRef;

  selectedPacks: any[];
  groupesPacks: any = [];
  isFieldReadOnly: boolean = false; 
  selectedFile: any;
  base64String: string;
  fileControle: any;
  fileSuccess = false;
  maxDateRetour: any;
  tkn:string = JSON.parse(sessionStorage.getItem("access_token")||'')?.access_token



  constructor(     
    private dialog: MatDialog, private cd: ChangeDetectorRef, private cryptoService: CryptoService,
    private route: ActivatedRoute, 
    private router: Router, 
    private _snackBar: MatSnackBar,
    private conventionService: ConventionService,
    private devisService: DevisService,
    private reductionService: ReductionService,
    private packService: PackService, private agencesService: AgencesService,
    private personneService: PersonneService, private dureeService: DureeService,
    private paramRisqueService: ParamRisqueService,
    private genericService: GenericService, private formBuilder: FormBuilder) { }


  displayedColumns: string[] = ['select', 'garantie', 'plafond', 'franchise', 'formule', 'action', 'sousGarantie'];
  originalDisplayedColumns: string[] = ['select', 'garantie', 'plafond', 'franchise', 'formule', 'action', 'sousGarantie'];
  displayedColumnsListOfList: string[] = ['idList', 'description', 'action'];
  displayedColumnsRisque: any[] = [];
  innerColumnsRisque: any[] = [];


  produitInfo: any = {}
  dataSource = new MatTableDataSource();
  dataSourceSousGarantie = new MatTableDataSource(); 
  selection = new SelectionModel<any>(true, []);

  formInfoSouscripteur: FormGroup | any;
  formParamRisque: FormGroup | any;
  formPackGaranties: FormGroup | any;
  formPackSousGaranties: FormGroup | any;
  formReduction: FormGroup | any;
  plafondGav: any[]=[];
  tarifReady = false
  errorPackForm = false
  sousGarantieExist = false
  loaderControles = false
  successDevis = false
  saveDevis = true
  loaderTarif = false
  loaderDevis = false
  franchiseExist = false
  plafondExist = false
  formuleExist = false
  multiRisque = false
  risqueArrayReady = false
  withFile=false
  garantieNull=false
  today=new Date();
  expandedElement: any
  franchises: any = []
  idProduit = 0
  PrimeTotale = 0
  valeurVenale: number = 0

  idDevisWorkFlow = 45 
  risqueIndex = 0
  risqueIndexBody = 0
  idPack: number = 0
  returnedDevis: any
  paraRisqueProduit: ParamRisqueProduit[] = [];
  devis: any = {}
  devisGroupe: any = []
  paramList: ParamList[] = []
  paramElement: ParamList = {} as any
  garantieSelected: any = [];
  garantieSelectedIds: any = [];
  sousGarantieSelectedIds: any = [];
  paramProduit: ParamRisqueProduit
  garantieTab: any = []
  sousGarantieTab: any = []
  garantieAll: any = []
  conventions: any = []
  communes: any = []
  filterReduction = ReductionFiltreJson
  controleDevis: any = []
  reductions: any = []
  
  //FIXME  delete column if column==null
  
  maxContenue = 10000000
  multiRisqueArray: any = []
  risqueConsult: any = {}
  calculCapitaleMRP = 50000
  DisplayedColumnsSousGarantie = ['select', 'garantie', 'plafond', 'franchise', 'formule', 'action', 'more'];
  //***************************** *LISTE 
 
  list: { idListParamRisque: any; };
  listParamRisque: any = [];
  lengthColumnsListParamRisque: any;


  idListParamList: any;
  paraRisqueType: any = []; 
  codesListParams: any = [];
  /***************************** */
  duree: any
  dateMiseCirculation: any
  idPays = 0
  errorTarif = {
    "error": false,
    "msg": "",
  }

  //tableau resumé 
  displayedColumnsGarantie: string[] = ['garantie', 'plafond', 'formule', 'franchise', 'prime'];
  dataSourceGarantie: any
  dataSourceRisque: any = new MatTableDataSource()
  dataSourceGroupePack: MatTableDataSource<any>;
  displayedColumnsGroupePack: string[] = ['groupe', 'pack'];
  dataReturned = returnJson
  resumeTable: any = []
  returnedTarif: any = []
  
  formListParamRisque: FormGroup | any;
  defaultConvention = 'aucuneConvention'
  typesContact = ["fixe", "mobile"]
  wilayas: any[] = []
  durees: any[] = []
  typeClients: any[] = []
  agences: any[] = []
  warningMessage: any = []
  packs: any[] = []
  typeClient: any
  labelNom: string = "Nom"
  errorHandler = {
    "error": false,
    "msg": ""
  }
  autditUser: string | undefined | null = ""
  paraRisqueProduitCategory: any[] = []
  tableauxParCategorie: any = [];
  tableauxParCategorieAssure: any = [];

  groupControl: any
  produit: any 
  nbrAssure = new FormControl()
  //nbrAssure = new FormControl(null, [Validators.required, Validators.min(2)]); // Define FormControl with required and max validation

  risqueStep = 0
  devisOutput: any; 
 
  now: any; 
  month = new Date();
  minDate = new Date();  
  maxDate = new Date();
 

  selectedValue: any = [];
  isAssure: boolean = false;
  isCheckboxDisabled: boolean = false;
  displayFormRisque: boolean = true;
  erreurFormRisque: boolean = false;
  idPackComplet:any;
  garantiesNew: any = [];
  duration : any = 0;
  isCourtier = sessionStorage.getItem('roles')?.includes('COURTIER');
  isBEA = sessionStorage.getItem('roles')?.includes('CDC_BEA');

  agencePersonne = parseInt(sessionStorage.getItem('agence') || '0');


 
 

  @ViewChildren('innerTables') innerTables: QueryList<MatTable<any>>;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  ngOnInit(): void {
    this.maxDate.setDate(this.maxDate.getDate() + 181);

    if (sessionStorage.getItem("roles")?.includes("BO")){     
      this.minDate.setDate(this.minDate.getDate() - 365)
    }
    
    if (sessionStorage.getItem("roles")?.includes("CDC") || sessionStorage.getItem("roles")?.includes("DA")) {
      this.now = new Date()      
      this.month.setMonth(this.now.getMonth() + 1);
    }
    else {   
      this.now = new Date()
      this.month.setMonth(this.now.getMonth() + 1);      
    }  

    this.devis.list=[]
    if (this.codeProduit !== null) {
      this.codeProduit = this.route.snapshot.paramMap.get('codeProduit');
      this.produit = this.route.snapshot.paramMap.get('produit');
    }

    this.devis.groupes = [] 
    this.autditUser = sessionStorage.getItem("userId")
    this.autditUser = this.autditUser?.replace(/^"(.+)"$/, '$1')

    this.dataSource.data = []
    this.getProductId()
    this.getIdPays("DZA")
 
    this.getAllParamRisque()
    this.getDureeByProduit()
    this.getTypeClient()
    this.getAllAgences()
    //FIXME DELETE THIS

    this.getAllConventions()
    this.getAllReductions()
    //CHANGE DATA RETURN 
    let garantiesResume: any = []
    let formule = {}
    let franchise = {}
    let plafond = {}
    this.dataReturned.paramDevisList.map((garantie: any) => {
      garantie.categorieList.map((category: any) => {

        if (category.description == 'forumule') {
          formule = {
            "idCategorie": category.idCategorie,
            "description": category.description,
            "valeur": category.valeur,
            "sousCategorieList": {
              "idSousCategorie": category.sousCategorieList.idSousCategorie,
              "description": category.sousCategorieList.description,
              "valeur": category.sousCategorieList.valeur
            }
          }
        }
        else {
          if (category.description == 'plafond') {
            plafond = {
              "idCategorie": category.idCategorie,
              "description": category.description,
              "valeur": category.valeur,
              "sousCategorieList": {
                "idSousCategorie": category.sousCategorieList.idSousCategorie,
                "description": category.sousCategorieList.description,
                "valeur": category.sousCategorieList.valeur
              }
            }
          } else if (category.description == 'franchise') {
            franchise = {
              "idCategorie": category.idCategorie,
              "description": category.description,
              "valeur": category.valeur,
              "sousCategorieList": {
                "idSousCategorie": category.sousCategorieList.idSousCategorie,
                "description": category.sousCategorieList.description,
                "valeur": category.sousCategorieList.valeur
              }
            }
          }

        }

      })
      
      garantiesResume.push({
        "idGarantie": garantie.idGarantie, // 2 
        "description": garantie.description, // VOL 
        "prime": garantie.prime,
        "plafond": plafond,
        "formule": formule,
        "franchise": franchise,
      })
      formule = {}
      franchise = {}
      plafond = {}
    })

    this.dataSourceGarantie = new MatTableDataSource(garantiesResume)
    this.formInfoSouscripteur = this.formBuilder.group({
      typeClient: ['', [Validators.required]],
      typeContact: ['', [Validators.required]],
      nom: ['', this.typeClient != 'personne physique' ? [Validators.required, Validators.maxLength(50)] : [Validators.required, Validators.maxLength(50), Validators.pattern(Patterns.nom)]],
      prenom: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(Patterns.nom)]],
      dateNaissance: ['', [Validators.required, ageInf18Validator,ageSup107Validator]],
      tel: ['', [Validators.required, Validators.pattern(Patterns.mobile)]],
      email: ['', [Validators.pattern(Patterns.email)]], 
      // agence: ['', [Validators.required]],
      agence: [
        this.isCourtier || this.isBEA ? this.agencePersonne : '',
        [Validators.required],
      ],
    });
    this.formInfoSouscripteur.valueChanges.subscribe(() => {
      this.tarifReady = false
    });
    this.formListParamRisque = this.formBuilder.group({});
    this.formParamRisque = this.formBuilder.group({});
    this.formParamRisque.valueChanges.subscribe(() => {
      this.tarifReady = false
    });
    this.formPackGaranties = this.formBuilder.group({

      franchiseFormArray: this.formBuilder.array([]),
    });
    this.formReduction = this.formBuilder.group({

      reduction: [0],
      convention: [0],
    });
    this.formReduction.get('convention').setValue('aucuneConvention');
    this.formReduction.get('reduction').setValue('aucuneReduction');
    if (this.isCourtier ||this.isBEA) {
      this.formInfoSouscripteur.get('agence')?.disable();
    } else {
      this.formInfoSouscripteur .get('agence')?.enable();
    }
  }


  getIdPays(codePays: string) {
    this.genericService.getPays().subscribe({
      next: (data: any) => {
        this.idPays = data.find((pays: any) => pays.codePays == codePays).idPays
        this.getWilayas()
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  getProductId() {
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')
    this.idProduit = JSON.parse(sessionStorage.getItem('products') || '{}').find((parametre: any) => parametre.codeProduit == this.codeProduit)?.idProduit

    this.getInfoProduit()
  }
  getInfoProduit() {
    this.genericService.getPorduitById(this.idProduit).subscribe({
      next: (data: any) => {

        this.produitInfo = data
        this.multiRisque = data.param_Produit_Reponses.filter((element: any) => element.idParamProduit.libelle == "multirisque")[0].reponse.description == "Oui" ? true : false

      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  get franchi(): FormArray {
    return this.formPackGaranties.get("franchiseFormArray") as FormArray
  }
  newFranchises(): FormGroup {
    return this.formBuilder.group({
      idGarantie: '',
      valeurFranchise: '',
    })
  }
  addfranchi() {
    this.franchi.push(this.newFranchises());
  }
  getWilayas() {
    this.genericService.getAllWilayas(this.idPays).subscribe({
      next: (data: any) => {
        this.wilayas = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getCommune(idWilaya: any) {
    this.genericService.getAllCommuneByWilaya(idWilaya).subscribe({
      next: (data: any) => {
        this.communes = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  getDureeByProduit() {
    this.dureeService.getDureeByIdProduit(this.idProduit).subscribe({
      next: (data: any) => {
        this.durees = data
      },
      error: (error) => {
        console.log(error);
      }
    });
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
  getPackVoyageOrGAV() {

    // this.packService.getPackByProduit(this.idProduit).subscribe({

    //   next: (data: any) => {

    //     this.packs = []

    //     data.map((pack: any) => {

    //       this.packs.push(pack)

    //     })

    //   },

    //   error: (error) => {

    //   console.log(error);

    //   }

    // });



    // if (this.formParamRisque.valid){

    //   let body : any;

    //   body = {

    //     "destination": this.formParamRisque.get("Destination").value.id ,

    //     "zone": this.formParamRisque.get("Zone").value.description



    //   }

    let body={}

    //console.log"gsh",this.formParamRisque)

    if(this.codeProduit=="20A"){

      body=

        {

          "destination": this.formParamRisque.get("Destination").value.id ,

          //"zone": this.formParamRisque.get("Zone").value.description



          }



    }else{



      //console.log"ds: ",this.devis)

      body=

      {

        "classeProfession": this.devis?.groupes?.[0]?.groupeList?.[0]?.risque?.paramList?.find((el:any)=>el.idParam==191)?.reponse?.idReponse ,

        //"zone": this.formParamRisque.get("Zone").value.description



        }

    }

    if(this.codeProduit=="20G"){



      this.dataSourceGroupePack?.data?.forEach((el:any)=>{

        const groupe = this.devis?.groupes?.find((grp:any)=>grp.description==el.group)

        body=

      {

        "classeProfession": groupe?.groupeList?.[0]?.risque?.paramList?.find((el:any)=>el.idParam==191)?.reponse?.idReponse ,

        //"zone": this.formParamRisque.get("Zone").value.description



        }

        this.packService.getPackVoyage(body).subscribe({

          next: (data: any) => {



            this.packs[el.group] = data



          },

          error: (error) => {

            console.log(error);

          }

        });

      })

    }else{

      this.packService.getPackVoyage(body).subscribe({

        next: (data: any) => {



          this.packs = data



        },

        error: (error) => {

          console.log(error);

        }

      });

    }





     //console.log"groupePacks",this.packs)

     }
  

  getPack(idPack: any, groupe:any) {

    this.tarifReady = false
    this.errorHandler.error = false
    this.errorHandler.msg = ""
    this.idPack = idPack
   

    this.packService.getPackById(idPack).subscribe({
      next: (data: any) => {        
          this.displayedColumns = ['select', 'garantie', 'plafond', 'franchise', 'formule', 'action', 'sousGarantie'];
          this.DisplayedColumnsSousGarantie = ['select', 'garantie', 'plafond', 'franchise', 'formule', 'action', 'more'];
          this.franchiseExist = false
          this.plafondExist = false
          this.formuleExist = false

          this.devis.pack = idPack
          this.garantieTab = []
          this.garantieAll = data.garantie

          this.groupesPacks.push({ group: groupe, pack: data })
          this.garantieNull = false;


          this.garantieAll.filter((garantie: any) => {
            let plafond: any = []
            let formule: any = []
            let franchise: any = []
            //exp sous garantie
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
                  "idPackComplet": sousGarantie.idPackComplet,
                  "idListParamRisque": sousGarantie.idListParamRisque,
                  "description": sousGarantie.description,
                  "obligatoire": sousGarantie.obligatoire,
                  "prime": "",
                  "plafond": sousPlafond,
                  "formule": sousFormule,
                  "franchise": sousFranchise,
                  "valeur": sousGarantie.valeurGarantie,
                }
              )
            })

            //exp categorie garantie 
            garantie.categorieList.filter((category: any) => {

              switch (category.description) {
                case "plafond":

                  if (category.descriptionvVal == 'input valeur venale' && this.route.snapshot.paramMap.get('codeProduit') == "45A") { category.valeur = this.valeurVenale }

                  plafond.push(category)
                  this.plafondExist = true
                  break;
                case "formule":
                  formule.push(category)
                  this.formuleExist = true
                  break;
                case "franchise":
                  franchise.push(category)
                  this.franchiseExist = true
                  break;
              }
            })

            this.garantieTab.push(
              {
                "idGarantie": garantie.idGarantie,
                "idPackComplet": garantie.idPackComplet,
                "codeGarantie": garantie.codeGarantie,
                "idListParamRisque": garantie.idListParamRisque,
                "description": garantie.description,
                "obligatoire": garantie.obligatoire,
                "prime": "",
                "plafond": plafond,
                "formule": formule,
                "franchise": franchise,
                "sousGarantieList": new MatTableDataSource(this.sousGarantieTab)
              }
            )

         

          //   this.sousGarantieTab = []
          // })
          // //FIXME  delete column if column==null
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
          // this.garantieTab.sort(function (x: any, y: any) {

          //   // true values first
          //   //  return (x.obligatoire === y.obligatoire) ? 0 : x ? -1 : 1;
          //   // false values first
          //   // return (x === y)? 0 : x? 1 : -1;
           });

          this.garantieTab.sort((a: any, b: any) => Number(b.obligatoire) - Number(a.obligatoire));

          this.dataSource = new MatTableDataSource(this.garantieTab)

          this.formPackGaranties = new FormArray(
            this.dataSource.data.map(
              (x: any) =>
                new FormGroup({
                  idPackComplet: new FormControl(x.idPackComplet),
                  franchise: new FormControl(),
                  idfranchise: new FormControl({ value: x.franchise, disabled: x.franchise.descriptionvVal != 'input' ? true : false },),
                  plafond: new FormControl(),
                  idplafond: new FormControl({ value: x.plafond, disabled: true },),
                  formule: new FormControl(),
                  idformule: new FormControl({ value: x.formule, disabled: true },),
                  checked: new FormControl({ value: true, disabled: x.obligatoire }),
                  souGarantieArray: new FormArray(
                    x.sousGarantieList.data.map(
                      (sous: any) =>

                        new FormGroup({
                          idPackComplet: new FormControl(sous.idPackComplet),
                          franchise: new FormControl(),
                          idfranchise: new FormControl({ value: sous.franchise, disabled: sous.franchise.descriptionvVal != 'input' ? true : false },),
                          plafond: new FormControl(),
                          idplafond: new FormControl({ value: sous.plafond, disabled: true },),
                          formule: new FormControl(),
                          idformule: new FormControl({ value: sous.formule, disabled: true },),
                          checked: new FormControl({ value: true, disabled: sous.obligatoire }),
                          valeur: new FormControl((this.codeProduit == '95' && sous.valeurGarantie != null) ? sous.valeurGarantie : ''),
                        })

                    ))
                })

            )
          );


         
          this.formPackGaranties.valueChanges.subscribe(() => {
            this.errorPackForm = false
          });

          this.loadTable = true

          this.objectDevis(true)
        
      },
      error: (error) => {
        console.log(error);
      }
    });

  }
  getPackMulti(idPack: any, groupe: any) {

    this.packService.getPackById(idPack).subscribe({

      next: (data: any) => {

        

        this.idPackComplet=data.idPackComplet;

        this.garantiesNew=data.garantie;

        ;

        this.devis.pack = idPack
        this.devis.groupes.find((grp:any)=>grp.description==groupe).idPack=idPack
        this.groupesPacks.push({ group: groupe, pack: data })
        this.garantieNull = false;
        if(this.dataSourceGroupePack?.data?.length == this.groupesPacks?.length){
          this.tarifReady=true
        }

      },

      error: (error) => {



        console.log(error);



      }

    });

  }
 
  getControl(index: number, controlName: string): FormControl {
    this.actualControlGarantie = index
    return (this.formPackGaranties.at(index) as FormGroup).get(controlName) as FormControl;
  }
  getSousGarantieControl(index: number, controlName: string): FormControl {

    let mainFormGroup = this.formPackGaranties.at(this.actualControlGarantie) as FormGroup;
    let souGarantieArray = mainFormGroup.get('souGarantieArray') as FormArray;

    return (souGarantieArray.at(index) as FormGroup).get(controlName) as FormControl;
  }
  plafondChange(value:any,element:number){

    const obj= {
      idPackComplet:element,
      categorieList:{
      idCategoriePackComplet: value.idParamPackComplet,
      sousCategorieList: null,
      valeur: value.valeur
      }
    }

    if(this.plafondGav?.find((el:any)=>el.idPackComplet==element)){
      this.plafondGav.find((el:any)=>el.idPackComplet==element).categorieList=obj.categorieList
    }else{
      this.plafondGav.push(obj)
    }

  }


  changeTypeClient(value: any) {

    this.typeClient = value.description
    //personne moral
    if (this.typeClient == "personne morale") {

      this.formInfoSouscripteur.get("prenom")?.setValidators([])
      this.formInfoSouscripteur.get("dateNaissance")?.setValidators([])
      this.formInfoSouscripteur.get("email")?.setValidators([Validators.required, Validators.pattern(Patterns.email)])
      this.labelNom = "Raison Social"
    } else {
      this.labelNom = "Nom"
      this.formInfoSouscripteur.get("prenom")?.setValidators([Validators.required, Validators.pattern(Patterns.nom)])
      this.formInfoSouscripteur.get("email")?.setValidators([Validators.pattern(Patterns.email)])
      this.formInfoSouscripteur.get("dateNaissance")?.setValidators([Validators.required, ageInf18Validator,ageSup107Validator])
    }
    this.formInfoSouscripteur.get('prenom').updateValueAndValidity();
    this.formInfoSouscripteur.get('dateNaissance').updateValueAndValidity();
    this.formInfoSouscripteur.get('email').updateValueAndValidity();
  }
  goBack() {
    this.myStepper.previous();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  diselectAll() {
    this.selection.clear();
    this.dataSource.data.forEach((row: any) => {
      this.formPackGaranties.controls.map((garantie: any) => {
        if (!row.obligatoire)
          garantie.value.idPackComplet == row.idPackComplet ? garantie.controls.checked.value = false : "";
      })
    });

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

    this.isAllSelected() ?
      this.diselectAll() :
      this.dataSource.data.forEach((row: any) => {
        this.formPackGaranties.controls.map((garantie: any) => {

          garantie.value.idPackComplet == row.idPackComplet ? garantie.controls.checked.value = true : "";
        })
        this.selection.select(row)
      });
  }  

  getAllParamRisque() {
    let existInBoth = false
    let validators: any = []
   
    this.paramRisqueService.getParamByProduit(this.idProduit).subscribe({
      next: (data: any) => {

        this.paramRisqueService.getWorkFlowByProduit(this.idProduit, this.idDevisWorkFlow).subscribe({
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
              this.paraRisqueType.push(paramRisque)

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
              paramRisque.codeCategory = param.paramRisque.categorieParamRisque?.code
              paramRisque.parent = param.paramRisque.paramRisqueParent
              paramRisque.isParent = param.paramRisque.isParent
              param?.iddictionnaire?.description == 'valeur minimum' ? paramRisque.valeurMin = param.valeur : ''
              param?.iddictionnaire?.description == 'valeur maximum' ? paramRisque.valeurMax = param.valeur : ''


           

              if (this.paraRisqueProduit.find(o => param.paramRisque.idParamRisque === o.idParamRisque) == undefined && existInBoth) {                
                
                if (paramRisque.sizeChamp != 0 && paramRisque.sizeChamp != undefined)
                  this.formParamRisque.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required, Validators.minLength(paramRisque.sizeChamp), Validators.maxLength(paramRisque.sizeChamp)]));
                else
                  if (paramRisque.obligatoire)
                    this.formParamRisque.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required]));
                  else
                    this.formParamRisque.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue));
                      if (paramRisque.parent != null) {
                      
                        this.formParamRisque.get(paramRisque.formName).disable();
                      }

                this.paraRisqueProduit.push(paramRisque)
                if (this.multiRisque) {
                  this.innerColumnsRisque.push({
                    "formName": paramRisque.formName,
                    "libelle": paramRisque.libelle,
                  })

                  // this.displayedColumnsRisque = this.innerColumnsRisque.map((col: any) => col.formName);
                  this.displayedColumnsRisque = ['risqueNum','nom' , 'groupe', 'action'];
                }
              
               
                //parent
                if (param.paramRisque.typeChamp.code == "L08" && param.paramRisque.paramRisqueParent == null) {
                 // if (param.paramRisque.typeChamp.code == "L08" ) {
                  //EXP EN ATTENTE NOM TABLE EN RETOUR 
                  this.paramRisqueService.getTableParamParent(paramRisque.idParamRisque).subscribe({
                    next: (data: any) => {
                      paramRisque.reponses = data
                    },
                    error: (error) => {

                      console.log(error);

                    }
                  })
                }
              }
              else if (existInBoth) {
                if (param?.iddictionnaire?.description == 'valeur minimum') {
                  this.formParamRisque.get(paramRisque.formName).addValidators([Validators.min(paramRisque.valeurMin)])
                  this.formParamRisque.get(paramRisque.formName).updateValueAndValidity();
                }
                else if (param?.iddictionnaire?.description == 'valeur maximum') {
                  this.formParamRisque.get(paramRisque.formName).addValidators([Validators.max(paramRisque.valeurMax)])
                  this.formParamRisque.get(paramRisque.formName).updateValueAndValidity();
                }
              }
              existInBoth = false
              validators = []
            })

            if (this.multiRisque) {
              
              this.formParamRisque.addControl("newGroupe", new FormControl('', []));
              this.formParamRisque.addControl("groupe", new FormControl({ value: this.codeProduit=="20G"? "GAV":"voyage", disabled: this.codeProduit=="20A" }, []));
            }



            this.paraRisqueProduit.filter((element:any)=>{

              if(this.codeProduit=="20G"){
                if (element.codeCategory == "P13878") {
                  this.tableauxParCategorie.push(element)
                }
              }else{
                if (element.codeCategory == "CP540") {
                  this.tableauxParCategorie.push(element)
                }
              }
              if (element.codeCategory == "CP541") {
                this.tableauxParCategorieAssure.push(element)
              }
            })
            console.log('hello je suis le conteu de tableau categorie', this.tableauxParCategorie)

            this.paraRisqueProduitCategory = this.paraRisqueProduit.reduce((x: any, y: any) => {
              (x[y.category] = x[y.category] || []).push(y);
              return x;
            }, {});
            this.paraRisqueProduitCategory = Object.values(this.paraRisqueProduitCategory)
console.log('try to find out whats risqueArrayReady', this.paraRisqueProduitCategory)

            this.paraRisqueProduitCategory.map(risqueCategory => {
              risqueCategory.sort((a: any, b: any) => (a.orderChamp < b.orderChamp ? -1 : 1));
            })
            this.risqueArrayReady = true
            console.log('this.risqueArrayReady',this.risqueArrayReady)
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
  changeRoleClient(val: any, role: string) {    

    if (val) {
     this.formParamRisque.get('Nom')?.setValue(this.formInfoSouscripteur?.value?.nom);
     this.formParamRisque.get('Prénom')?.setValue(this.formInfoSouscripteur?.value?.prenom);
     this.formParamRisque.get('DateDeNaissance')?.setValue(this.formInfoSouscripteur?.value?.dateNaissance);    
     this.isAssure= true
    }
   
  }

  submitInfosSouscripteur() {
    
    if (this.formInfoSouscripteur.valid) {
      this.myStepper.next();
      //this.duree = this.formInfoSouscripteur.get("duree").value
      //************* info assure
      this.devis.typeClient = this.formInfoSouscripteur.get('typeClient').value.idParam
      this.devis.produit = this.idProduit // auto static
      if (this.typeClient != 'personne physique') {
        this.devis.raisonSocial = this.formInfoSouscripteur.get('nom').value
        this.devis.prenom = ""
        this.devis.nom = ""
        this.devis.dateAssure = ""

      }
      else {
        this.devis.prenom = this.formInfoSouscripteur.get('prenom').value
        this.devis.nom = this.formInfoSouscripteur.get('nom').value
        this.devis.dateAssure = moment(this.formInfoSouscripteur.get("dateNaissance").value).format('YYYY-MM-DD[T]HH:mm:ss.000Z')

        this.devis.raisonSocial = ''
      }

      this.devis.telephone = this.formInfoSouscripteur.get('tel').value
      this.devis.email = this.formInfoSouscripteur.get('email').value  
      this.devis.agence = this.formInfoSouscripteur.get('agence').value
      this.devis.duree = 5
    } else {
      const invalid = [];
      const controls = this.formInfoSouscripteur.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }

    }

  }

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
      this.formReduction.get("reduction").setValidators([Validators.required])
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
      this.formReduction.get("reduction").setValidators([])
      this.getAllReductions()
    }

  }
  async submitReduction() {

    // if (this.formReduction.get("reduction").value == 'aucuneReduction') {

    //   this.myStepper.next();
    //   this.errorHandler.error = false
    //   this.errorHandler.msg = ""
    // } else 
    if (this.formReduction.valid && this.formReduction.get("convention").value != 'aucuneConvention') {
      // Object.assign(this.returnedTarif, {idReduction: this.formReduction.get("reduction").value});
      if (this.formReduction.get("reduction").value != 'aucuneReduction') {
        this.basicTarif.idConvention = this.formReduction.get("convention").value
        this.basicTarif.idReduction = this.formReduction.get("reduction").value
        this.basicTarif.auditUser = this.autditUser
        this.basicTarif.canal = 100
        this.basicTarif.tailleRisque = this.nbrAssure.value;

        const hmac = await this.cryptoService.generateHmac(this.tkn, this.basicTarif);
        const stringifiedDevis = JSON.stringify(this.basicTarif);
        const dataDevis = {
          stringJson:stringifiedDevis,
          signature: hmac
        }

        this.reductionService.applyReduction(dataDevis).subscribe({
          next: (data: any) => {

            this.returnedTarif = data

            this.errorHandler.error = false
            this.errorHandler.msg = ""
            this.myStepper.next();

          },
          error: (error) => {
            console.log(error)
            this.handleError(error)

          }
        });
      }

    } else if (this.formReduction.get("convention").value == 'aucuneConvention' && this.formReduction.valid) {
      if (this.formReduction.get("reduction").value == 'aucuneReduction') {

        this.myStepper.next();
        this.errorHandler.error = false
        this.errorHandler.msg = ""
        this.basicTarif.idConvention = 0
        this.basicTarif.idReduction = 0
      } else {
        this.basicTarif.idConvention = this.formReduction.get("convention").value
        this.basicTarif.idReduction = this.formReduction.get("reduction").value
        this.basicTarif.auditUser = this.autditUser
        this.basicTarif.canal = 100

        const hmac = await this.cryptoService.generateHmac(this.tkn, this.basicTarif);
        const stringifiedDevis = JSON.stringify(this.basicTarif);
        const dataDevis = {
          stringJson:stringifiedDevis,
          signature: hmac
        }

        this.reductionService.applyReduction(dataDevis).subscribe({
          next: (data: any) => {
            this.returnedTarif = data


            this.errorHandler.error = false
            this.errorHandler.msg = ""
            this.myStepper.next();

          },
          error: (error) => {
            console.log(error)
            this.handleError(error)

          }
        });
      }
    }
  }
  changeTypeContact(value: any) {
    if (value == 'fixe')
      this.formInfoSouscripteur.get("tel").setValidators([Validators.pattern(Patterns.fixe), Validators.required])
    else
      this.formInfoSouscripteur.get("tel").setValidators([Validators.pattern(Patterns.mobile), Validators.required])

    this.formInfoSouscripteur.get("tel").updateValueAndValidity();
  }
  clearValidators(paramFormName: string) {
    this.paraRisqueProduit.map((param: any) => {
      if (paramFormName == param.formName) {
        // if (param.obligatoire)
        //   this.formParamRisque.controls[param.formName].setValidators([Validators.required])
        // else
        //   this.formParamRisque.controls[param.formName].setValidators([])



        this.formParamRisque.controls[param.formName].updateValueAndValidity();

      }

    })
  }

  submitParamRisque(formParamRisque?: any) {
  //   Object.keys(this.formParamRisque.controls).forEach(controlName => {
  //     this.formParamRisque.get(controlName)?.setErrors(null);
  // });
    this.loaderControles = true
    this.erreurFormRisque = false
    this.controleDevis = []
    this.warningMessage = []
    this.isAssure =false
    this.isCheckboxDisabled = true;
    const prmRsqFrm= _.cloneDeep(this.formParamRisque)

    // this.formParamRisque.controls.nom.clearValidators();

    // this.formParamRisque.controls.nom.updateValueAndValidity();

    if(this.codeProduit=="20G"){
      //console.log'formparmrisque',this.formParamRisque)
      if(this.formParamRisque.value.SportProfessionnel.code=="CT111"){
        Swal.fire(
          "les sports professionnels sont exclus du tarif",
          "",
          `error`
        )
        return
    }

    const currentGroupe=this.formParamRisque.get("groupe").value
    //console.log'current group',currentGroupe)
    if(currentGroupe!= "new" && this.selectedValue.code !="F01"){
      const grpdev= this.devis.groupes.find((grp:any)=>grp.description==currentGroupe)
      if(grpdev?.groupeList?.[0]?.risque?.paramList?.find((el:any)=>el.idParam==191)?.reponse?.idReponse!= this.formParamRisque.get("ClasseDeProfession").value.idParam && grpdev != undefined){
        Swal.fire(
          "les risques du meme groupe ne peuvent pas avoir des classes d'activité differentes",
          "",
         `error`
        )
        return
      }
     
    }
    }

    const invalid = [];
    const controls = this.formParamRisque.controls;
     for (const name in controls) {
      if (controls[name].status == "INVALID" && controls[name].errors.bloquant ) {     
    //console.log"inside bloquand conditon")  
         
       // this.clearValidators(name)
      }    }
      console.log("this.nbrAssure ", this.nbrAssure)
    if(this.selectedValue.code != "F01" && this.nbrAssure.status=="INVALID"){
      Swal.fire(
        `Le nombre de risque ne correpond pas avec la formule`,
        ``,
        `error`,
      )
      return
    } else if (this.selectedValue.code != "F01" && this.multiRisqueArray.length == this.nbrAssure.value ) {
    //console.log"inside pop up condtion")  

      Swal.fire(
        "le nombre de risque a atteint le nombre de risques indiqué",
        `error`
      )
      if ((this.selectedValue.code=='F02'||this.selectedValue.code=='F02') && this.nbrAssure.value<2){
        Swal.fire(
          "le nombre de risque ne ",
          `error`
        )
      }
    }  else {
      //console.log"prmRsqFrm.valid ", prmRsqFrm)
      if(prmRsqFrm.valid){
        Object.keys(this.formParamRisque.controls).forEach(key => {
          this.formParamRisque.get(key)?.setErrors(null);
        });
      }
     
     //console.log"this.formParamRisque.valid ", this.formParamRisque)
     //console.log"this.formParamRisque.valid ", this.formParamRisque.valid)
     if (this.formParamRisque.valid) {
        //console.log"this.formParamRisque.valid 222", this.formParamRisque)
       
        let idparam       
        let idreponse
        let description = "debase"
        let controlElement: any
        //  this.devis.paramList = []
        //************* param risque

        let risque: any = {}
        risque.paramList = []
        let groupeList: any = []

        // this.devisGroupe = [{
        //   "description": "voyage",         
        //   "groupeList": [],
        // }]

        this.paraRisqueProduit.map((param: any) => {
          Object.keys(this.formParamRisque.value).map((paramFormName: any) => {
  
            if (paramFormName == param.formName) {

              idparam = param.idParamRisque
              if (param.typeChamp?.code == 'L01' || param.typeChamp?.code == 'L04') {
                idreponse = this.formParamRisque.get(paramFormName).value.idParam
                description = ''
                controlElement = {
                  "idParam": idparam,
                  "valeur": idreponse
                }
                Object.assign(this.risqueConsult, { [param.libelle]: this.formParamRisque.get(paramFormName).value.description });
              } else {

                idreponse = null
                if (param.typeChamp?.code == 'L08') {

                  description = this.formParamRisque.get(paramFormName).value.id
                  Object.assign(this.risqueConsult, { [param.libelle]: this.formParamRisque.get(paramFormName).value.description });

                } else if (param.typeChamp?.code != 'L06') {                  
                  description = this.formParamRisque.get(paramFormName).value
                  Object.assign(this.risqueConsult, { [param.libelle]: description });

                } else {
                
                  description = moment(this.formParamRisque.get(paramFormName).value).format('YYYY-MM-DD[T]HH:mm:ss.000Z');
                  Object.assign(this.risqueConsult, { [param.libelle]: description });

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
          this.controleDevis.push(controlElement)


        })

       

        risque.paramList = risque.paramList.filter((o: any, index: any, arr: any) =>
          arr.findIndex((item: any) => {
            return item.idParam === o.idParam
          }) === index
        )
        //console.log"controlle happening here group",this.formParamRisque?.get('groupe')?.value)
        //it needs to be an array of 1 element since we are using the same api for the multi risque controle
        this.devisService.controleDevis([this.controleDevis], this.codeProduit).subscribe({
          next: (data: any) => {
            this.loaderControles = false
            let exitFunc=false
            data[0].map((paramData: any) => {
              this.paraRisqueProduit.map((param: any) => {
               
             
                if (param.idParamRisque == paramData.idParam) {    

                  if (paramData.bloquant) {  
                      this.formParamRisque.controls[param.formName].addValidators([customParam(paramData.bloquant, paramData.message)])
                      this.formParamRisque.controls[param.formName].updateValueAndValidity();
                      exitFunc=true
                  } else if (paramData.message != null) {
                    this.warningMessage.push({
                      "idParam": param.idParamRisque,
                      "msg": paramData.message
                    })
                  } 
  
                }
              })
            })
            if(exitFunc){
              return
            }
            if (this.warningMessage.length != 0)
              Swal.fire(
                this.warningMessage[0].msg,
                '',
                'warning'
              )
             
            if (data.filter((paramData: any) => paramData.bloquant === true).length == 0) {
           
              this.devis.groupes = this.devisGroupe
              if (this.multiRisque) {
               
                this.multiRisqueTab(prmRsqFrm)  
              }
              else {
                  this.myStepper.next();
              }
              this.risqueIndexBody = this.risqueIndexBody + 1

              groupeList.push({
                "numRisque": this.risqueIndexBody,
                "risque": risque
              })
              if (this.multiRisque) {
                let groupExsit = false
                this.devisGroupe.map((groupe: any) => {
                  if ( groupe.description == this.formParamRisque.get('groupe').value)
                    groupExsit = true
                })
  
                if (!groupExsit){
                  this.devisGroupe.push({
                    "description": this.formParamRisque.get('groupe').value=='new'? this.formParamRisque.get('newGroupe').value : this.formParamRisque.get('groupe').value,
                    "idPack": this.idPack,
                    "groupeList": groupeList,
                  })
  
                }else {
                  this.devisGroupe.filter((groupe: any) => groupe.description == this.formParamRisque.get('groupe').value)[0]?.groupeList.push({
                    "risque": risque,numRisque: this.risqueIndexBody
                  })
                }
                if (this.multiRisque) {
                  if (this.formParamRisque.get('groupe')?.value == 'new') {
                    this.formParamRisque.get('groupe')?.setValue(this.formParamRisque.get('newGroupe')?.value)
                    this.groupArray.push(this.formParamRisque.get('newGroupe')?.value)
                    let data = this.groupArray.length == 1 ? [] : this.dataSourceGroupePack?.data
                    data.push({
                      group: this.formParamRisque.get('newGroupe')?.value, pack: this.packs[0]
                    })
                    this.dataSourceGroupePack = new MatTableDataSource(data);
                  }
                }
              }
              this.getPackVoyageOrGAV()
              }
  
          },
          error: (error) => {
           // this.handleError(error)
            console.log(error);
  
  
          }
        });  
    

       
      }    

      
    }   

  }

  multiRisqueTab(formprmRsq:any) {

    if(formprmRsq.valid){
    
      let objectParam = formprmRsq.value
    
      Object.keys(formprmRsq.value).map((element: any) => {
    
    
    
        if (typeof formprmRsq.controls[element].value === "object") {
    
            objectParam[element] = formprmRsq.controls[element].value?.description
    
        } else {
    
          objectParam[element] = formprmRsq.controls[element].value
    
        }
    
        if(this.codeProduit=="20A"){
    
          objectParam['DateExpiration'] = formprmRsq.get('DateExpiration')?.value?.format('YYYY-MM-DD');
    
          objectParam['DateDépart'] = formprmRsq.get('DateDépart')?.value?.format('YYYY-MM-DD');
    
          objectParam['DateRetour'] = formprmRsq.get('DateRetour')?.value?.format('YYYY-MM-DD');
    
        }else{
    
          objectParam['DateDébut'] = formprmRsq.get('DateDébut')?.value?.format('YYYY-MM-DD');
    
          objectParam['DateFin'] = formprmRsq.get('DateFin')?.value?.format('YYYY-MM-DD');
    
    
    
        }
    
    
    
        objectParam['DateDeNaissance'] = formprmRsq.get('DateDeNaissance')?.value?.format('YYYY-MM-DD');
    
    
    
      });
    
      switch (this.codeProduit) {
    
        case "20G":
    
          if(this.selectedValue.code=="F01"){
    
            objectParam.groupe = "GAV"
    
          }else{
    
            formprmRsq.get("newGroupe").value
    
          }
    
          break;
    
          case "20A":
    
          objectParam.groupe = "voyage"
    
          break;
    
        default:
    
          objectParam.groupe = formprmRsq.get("newGroupe").value
    
          break;
    
      }
    
     
    
    
    
      Object.assign(objectParam, { risqueNum: this.risqueIndex = this.risqueIndex + 1 });
    
      //console.log"objectparam:",objectParam,this.formParamRisque)
    
    
    
      this.multiRisqueArray.push(objectParam)

    
      this.dataSourceRisque = new MatTableDataSource(this.multiRisqueArray)
    
          console.log('je suis dataspourcerisQUE',this.dataSourceRisque)

    
     //vider les infos de l'assurer affin de pas avoir de doublons
    
      //this.formParamRisque.reset()
    
    
    
      this.formParamRisque.get('Nom').setValue(null );
    
    
    
    
    
      this.formParamRisque.get('Prénom')?.setValue( null);
    
      this.formParamRisque.get('DateDeNaissance')?.setValue(null );
    
      this.formParamRisque.get('DateExpiration')?.setValue(null );
    
      this.formParamRisque.get('Genre')?.setValue(null );
    
      this.formParamRisque.get('NuméroDePasseport')?.setValue(null );
    
      this.formParamRisque.get('Nationalité')?.setValue( null);
    
      this.formParamRisque.get("ActivitéARisque")?.setValue("")
    
      this.formParamRisque.get("SportProfessionnel")?.setValue("")
    
      this.formParamRisque.get("ClasseDeProfession")?.setValue("")
    
      this.formParamRisque.get("SportÀRisque")?.setValue("")
    
      this.formParamRisque.updateValueAndValidity()
    
    
    
      //add validator
    
      this.paraRisqueProduit.map((paramRisque: any) => {
    
        if (paramRisque.sizeChamp != 0 && paramRisque.sizeChamp != undefined)
    
          this.formParamRisque.get(paramRisque.formName).setValidators([Validators.required, Validators.minLength(paramRisque.sizeChamp), Validators.maxLength(paramRisque.sizeChamp)])
    
        else
    
          if (paramRisque.obligatoire)
    
            this.formParamRisque.get(paramRisque.formName).setValidators([Validators.required])
    
          else
    
            this.formParamRisque.get(paramRisque.formName).setValidators([])
    
    
    
      })
    
    }

      }

  getRelation(typeChamp: any, isParent: boolean, idParamRisque: number, idReponse: number, formName: any,responses:any=[],codeParam:string='') {

    if(formName == 'Formule'){
      this.selectedValue = this.formParamRisque.get(formName).value
      switch(this.selectedValue.code){
        case 'F01':
          this.nbrAssure.setValue(1);     
          this.risqueStep = 1;
          if(this.codeProduit=="20G"){
            this.groupArray.push("GAV")
            this.formParamRisque.get('groupe').value="GAV"
            this.formParamRisque.get('groupe').disable()
            this.formParamRisque.get('groupe').updateValueAndValidity()
          }          
        break;
        case 'F02':
          this.nbrAssure.setValue(2);     
          //this.nbrAssure.setValidators([Validators.required, Validators.min(2),  Validators.max(9)]); // Add min 2 validator
          this.nbrAssure.setValidators([Validators.required, Validators.min(2)]); // Add min 2 validator
          this.formParamRisque.get('groupe').enable()
          this.formParamRisque.get('groupe').updateValueAndValidity()
          if(this.codeProduit=="20A"){
          this.nbrAssure.setValidators([Validators.required, Validators.max(9), Validators.min(2)]);
          } 
        break;
        case 'F03':
          if(this.codeProduit=="20A"){
            this.nbrAssure.setValue(10);
            this.nbrAssure.setValidators([Validators.required, Validators.min(10)]); // Add min 2 validator
          }else{
            this.nbrAssure.setValue(2);
            this.nbrAssure.setValidators([Validators.required, Validators.min(2)]);
          }
          if(this.codeProduit=='20G'){
 this.formParamRisque.get("groupe").setValidators([Validators.required])
 this.formParamRisque.get("newGroupe").setValidators([Validators.required])

          this.formParamRisque.get('newGroupe').updateValueAndValidity()

          this.formParamRisque.get('groupe').enable()
          this.formParamRisque.get('groupe').updateValueAndValidity()
          }else {
            this.formParamRisque.get('groupe').enable()
          this.formParamRisque.get('groupe').updateValueAndValidity()
          }
       
        break;

      }
      // if(this.selectedValue.code=='F01' ){
      //   this.nbrAssure.setValue(1);     
      //   this.risqueStep = 1;
      // }else{
      //   this.nbrAssure.setValidators([Validators.required, Validators.min(2)]); // Add min 2 validator
      //   //this.isMin2ValidatorAdded = true; // Set flag
      // }
    }

    if(codeParam == 'P182'){

      this.multiRisqueArray?.forEach((rsq:any) => {
        rsq.Destination= responses.find((rs:any)=>rs.id==idReponse).description
      });
      this.devis?.groupes?.[0]?.groupeList?.forEach((el: any) => {
        el?.risque?.paramList?.forEach((param: any) => {
          
          if (param?.idParam === idParamRisque) {
       
  
            param.reponse = {
              idReponse: null,
              description: idReponse
            };
          }
        });
      });
    }
 
    if (isParent == true)
      if (typeChamp == 'L01') {

        this.paramRisqueService.getParamRelation(idParamRisque, idReponse).subscribe({
          next: (data: any) => {

            this.paraRisqueProduit.filter((param: any) => {
              if (param.idParamRisque == data[0].idParamRisque) {

                param.reponses = data[0].categorie.paramDictionnaires
                this.formParamRisque.controls[param.formName].enable()
              }
            })
          },
          error: (error) => {
            console.log(error);
          }
        })
      } else {
        let idRisqueChild = this.paraRisqueProduit.find((rs: any) => rs.parent?.idParamRisque == idParamRisque)?.idParamRisque
        if (idRisqueChild)
          this.paramRisqueService.getTableParamChild(idRisqueChild, idReponse).subscribe({
            next: (data: any) => {
              this.paraRisqueProduit.filter((param: any) => {
                if (param.idParamRisque == idRisqueChild) {
                  param.reponses = data
                  this.formParamRisque.controls[param.formName].enable()
                }
              })            

            },
            error: (error) => {

              console.log(error);

            }
          })
      }
   
  }
  objectDevis(withRemplissage: boolean) {
    
    
    let garantieObligatoire = false
    let sousGarantieObligatoire = false
    let packCompletOne: any = []
    let categoryOfGaranti: any = []
    let sousCategorieList = null   

      this.groupesPacks.map((gp: any) => {
        //let packInfo: any =  this.getPack(gp.pack)
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
            "categorieList": categoryOfGaranti
          })
          categoryOfGaranti = []
        })

        this.devisGroupe.map((groupe: any) => {
       
          if(groupe.description==gp.group){
       
            groupe.groupeList.map((array: any) => {

              array.risque.packCompletList = packCompletOne
              array.risque.primeList = []
              array.risque.taxeList = []
            })
          }
        })

        packCompletOne = []

      })

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

  async submitDevis() {

    this.returnedTarif.auditUser = this.autditUser

    this.loaderDevis = true

    const hmac = await this.cryptoService.generateHmac(this.tkn, this.returnedTarif);
    const stringifiedDevis = JSON.stringify(this.returnedTarif);
    const dataDevis = {
      stringJson:stringifiedDevis,
      signature: hmac
    }

    this.devisService.createDevis(dataDevis).subscribe({
      next: (data: any) => {
        this.successDevis = true
        this.returnedDevis = data
        this.errorHandler.error = false
        this.errorHandler.msg = ""

        this.saveDevis = false
        this.idDevis = data.idDevis
        this.loaderDevis = false
        this.idDevis = data.idDevis
        Swal.fire(
          `Le devis N° ${data.idDevis} a été créer avec succés.`,
          ``,
          `success`,

        )
        this.myStepper.next();
        // this.dataSourceGarantie = new MatTableDataSource(data)
      },
      error: (error) => {
        this.loaderDevis = false
        this.handleError(error)
        console.log(error);

      }
    });





  }

  async generateCalcul() {
    
    // if(this.formPackGaranties.valid){
    //if ((this.multiRisque && this.nmbVehicule.value > 10 && this.fileSuccess) || (this.multiRisque && this.nmbVehicule.value < 10) || !this.multiRisque) {
      this.objectDevis(false)

      if (!this.errorPackForm) {
        this.loaderTarif = true
        const hmac = await this.cryptoService.generateHmac(this.tkn, this.devis);
        const stringifiedDevis = JSON.stringify(this.devis);
        const dataDevis = {
          stringJson:stringifiedDevis,
          signature: hmac
        }
        this.devisService.generateTarif(dataDevis).subscribe({
          next: (data: any) => {
            this.errorHandler.error = false
            this.errorHandler.msg = ""
            this.returnedTarif = data
            this.basicTarif = data
            this.tarifReady = true
            this.loaderTarif = false
            this.saveDevis = true
            this.loaderDevis = false

            //uncomment this if you want warning to show up when the a prime is null 
            /*if(this.multiRisque)
            {
              const hasNullPrime = data.groupes.some((group: any) => {
                return group.groupeList.some((risque: any) => {
                    return risque.risque.packCompletList.some((garantie: any) => garantie.prime === 0);
                });
              });
              
              if (hasNullPrime) {
                this.garantieNull = true
                Swal.fire(
                    "Vous ne pouvez pas continuer. les primes des garanties ne peuvent pas être nul",
                    '',
                    'error'
                );
              }
            }*/
            
            this.garantieTab.forEach((garantie: any, idx: any) => {
              let garantieData = data.groupes[0].groupeList[0].risque.packCompletList.find((garantieData: any) => garantie.idPackComplet === garantieData.idPackComplet);

            

              if (garantieData) {              
                if(garantieData.prime == 0)
                {
                  this.garantieNull = true
                  /*Swal.fire(
                    "Vous ne pouvez pas continuer. les primes des garanties ne peuvent pas etre nul",
                    '',
                    'error'
                  )*/
                }
                else
                {
                  this.garantieNull = false
                  garantie.prime = garantieData.prime;
                }

              }
              garantie.sousGarantieList?.data?.forEach((sousgarantie: any, idx: any) => {
                let sousGarantieData = data.groupes[0].groupeList[0].risque.packCompletList.find((sousgarantieData: any) => sousgarantie.idPackComplet === sousgarantieData.idPackComplet);

                if (sousGarantieData) {
                  sousgarantie.prime = sousGarantieData.prime;
                  if (sousGarantieData?.categorieList.length != 0) {
                    sousGarantieData?.categorieList.map((categorie: any) => {
                      let formule: any = sousgarantie.formule.find((cat: any) => cat.idParamPackComplet == categorie.idCategoriePackComplet)
                      let franchise: any = sousgarantie.franchise.find((cat: any) => cat.idParamPackComplet == categorie.idCategoriePackComplet)
                      let plafond: any = sousgarantie.plafond.find((cat: any) => cat.idParamPackComplet == categorie.idCategoriePackComplet)
                      formule ? formule.valeur = categorie.valeur : ''
                      franchise ? franchise.valeur = categorie.valeur : ''
                      plafond ? plafond.valeur = categorie.valeur : ''
                    })
                  }
                }
              });
            });

            // this.returnedTarif.primeList.map(primeReturned())
            // this.devis.primeList.map((prime:any)=>{
            //   if(prime.typePrime==)
            // })


            this.PrimeTotale = data.primeList.find((prime: any) => prime.description == 'Prime nette')?.prime

            this.dataSource = new MatTableDataSource(this.garantieTab)
             if (!this.garantieNull)
               this.myStepper.next();

          },
          error: (error) => {
            this.loaderTarif = false
            this.handleError(error)

          }
        });
      }
      
  }
  goBackReduc() {
    this.returnedTarif = this.basicTarif
    this.myStepper.previous();
  }
  buildTableBody(data: any, columns: any) {
    var body = [];

    if (columns.includes("text1"))
      body.push(["", "", ""])
    else {
      if (columns.includes("prime")) {
        columns = columns.map((col: any) => {
          col.text = col
          col.style = "headerTable"
        })
        body.push(columns);
      }
      else
        body.push(columns);
    }

    data.forEach(function (row: any) {
      const dataRow: any = [];

      columns.forEach(function (column: any) {
        dataRow.push(row[column]);
      })

      body.push(dataRow);
    });

    return body;
  }

  table(data: any, columns: any) {
    let pourcentage = 100 / columns.length;
    let width: any = []
    columns.map((col: any) => {
      width.push(pourcentage + "%")
    })

    return [{
      layout: columns.includes("text1") ? 'noBorders' : '',
      style: "table",
      table: {
        headerRows: 1,
        widths: width,
        margin: [5, 5, 5, 5],
        body: this.buildTableBody(data, columns)
      }
    }];
  }

  downloadDevis(devis: any) {
    this.devisService.getDevisById(devis.idDevis).subscribe({
      next: (datas: any) => {
        this.devisOutput = datas;
        this.consultRisque(datas.groupes[0].risques[0].idRisque, datas.groupes[0].idGroupe)

      }, error: (error: any) => {
        this.handleError(error)

      }
    });

  }

  consultRisque(idRisque: any, idGroupe: any) {
    //EXP call get param risque by devis, groupe & id risque
    this.devisService.getParamDevisByIdRisque(this.devisOutput.idDevis, idGroupe, idRisque).subscribe({
      next: async (dataParam: any) => {
        this.devisOutput.risqueList = await Object.values(dataParam)
      
          //EXP call get pack/garanties risque by devis, groupe & id risque
          await this.devisService.getPackIdRisque(this.devisOutput.idDevis, idRisque).subscribe({
            next: async (dataPack: any) => {
              this.devisOutput.paramDevisList = dataPack.garantieList
              this.devisOutput.pack = dataPack.pack

              await this.devisService.generatePdf(this.devisOutput)
            },
            error: (error: any) => {
              console.log(error);
            }
          });      

      },
      error: (error: any) => {
        console.log(error);
      }
    });

  }

  goToResume() {
    if (!this.multiRisque)
      this.myStepper.next();
    else {

      this.generateCalcul()
    }
  }
  // //validation 
  // custom(bloquant:boolean): ValidatorFn {
  //   return { 'bloquant': bloquant };
  // }
  gestionErreurPack(idPackComplet: any, typeCategory: any, typeGarantieForm: any, withRemplissage: boolean) {
    if (!withRemplissage)
      typeGarantieForm.controls.forEach((garantie: FormGroup) => {
        if (garantie.value.idPackComplet == idPackComplet) {
          if (
            (typeCategory == "formule" && garantie.value.formule == null) ||
            (typeCategory == "plafond" && garantie.value.plafond == null) ||
            (typeCategory == "franchise" && garantie.value.franchise == null)
          ) {

            this.errorPackForm = true;
          }
        }
      });
  }
  convertToContract() {
    if( this.devis.statue == 1 ){
      if(sessionStorage.getItem('roles')?.includes("BO")){
        this.router.navigateByUrl("creation-contrat/vie/" + this.route.snapshot.paramMap.get('codeProduit') + '/' + this.route.snapshot.paramMap.get('nomProduit') + '/' + this.idDevis);

      }else {
        Swal.fire({
          title: `Vous n'avez pas les droits pour approver le devis`,
          icon: `error`,
          showCancelButton: false,
          confirmButtonText: 'OK'
        },
        ).then((result) => {
          if (result.isConfirmed) {
            this.router.navigateByUrl("consultation-police/vie"+ this.route.snapshot.paramMap.get('codeProduit') + '/'+ this.route.snapshot.paramMap.get('nomProduit')); 
          }
        });
      }
    }else{
      this.router.navigateByUrl("creation-contrat/vie/" + this.route.snapshot.paramMap.get('codeProduit') + '/' + this.route.snapshot.paramMap.get('nomProduit') + '/' + this.idDevis);

    }
     
   

  }
  openDialog(risqueNum: any) {
    let dialogRef = this.dialog.open(DialogRisqueComponent, {
      width: '60%',
      data: {
        risque: this.multiRisqueArray.filter((risque: any) => risque.risqueNum == risqueNum)[0]
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {

    });
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
      case 400: // actif
        this.errorHandler.error = true
        this.errorHandler.msg = error.message
        break;
      case "other": // actif
        this.errorHandler.error = true
        this.errorHandler.msg = error
        break;
    }
    if (this.errorHandler.error)
      Swal.fire(
        this.errorHandler.msg,
        '',
        'error'
      )
  }
  submitInfoVoyage() {

    this.devis.tailleRisque = this.nbrAssure.value;
    //dev   
    // if (this.nbrAssure.value > 10 && this.selectedValue.code=='F02') {
    //   Swal.fire(
    //     `Le maximum de personne en formule famille est de 10`,
    //     ``,
    //     `error`,

    //   )
    //   this.risqueStep = 0;
    // } 
    // else if (this.nmbVehicule.value > 10)
    //   this.risqueStep = 2
    // else
    //   this.risqueStep = 1

    this.withFile=true

    this.devis.file = null;

  }

  calculateDuration(){
    const startDate = this.formParamRisque.get('DateDépart')?.value;
    const endDate = this.formParamRisque.get('DateRetour')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      this.duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      //console.log"el durassionne", this.duration)
    } else {
      this.duration = 0;
    }
  }


  checkAssureNumber() {
    if(this.risqueStep==2){      
      if(this.selectedFile){  
        this.uploadExcelFile();
      }else{
        Swal.fire(
          "Veuillez selectionner un fichier",
          `error`
        )
      }
      return
    }
  
   
    let bodyPack : any;

    if (this.nbrAssure.value !== this.multiRisqueArray.length) {
      Swal.fire(
        " le nombre d'assurés ajoutés ne correspond pas au nombre d'assurés  indiqué",
        `error`
      )
      // this._snackBar.open(" le nombre de véhicules ajoutés ne correspond pas au nombre de véhicules indiqué", 'fermer', {
      //   horizontalPosition: "end",
      //   panelClass: ['danger-snackbar']
      // })
    } else{
      this.displayFormRisque=false
      this.erreurFormRisque = true 
      
        //Validation BO                  
        if (this.formParamRisque?.get("Destination")?.value?.black_list){
          this.devis.statue = 1
        Swal.fire(
          "le pays de destination choisi nécessite une validation du BackOffice",
          `warning`)     
        }else {
          this.devis.statue = 0
        }
    
      
        this.multiRisqueArray.map((elt:any)=>{
       
          elt.DateDépart =this.formParamRisque?.get('DateDépart')?.value?.format('YYYY-MM-DD');
          elt.DateRetour=this.formParamRisque?.get('DateRetour')?.value?.format('YYYY-MM-DD');
          elt.Formule=this.formParamRisque?.get('Formule')?.value;
          elt.Destination=this.formParamRisque?.get('Destination')?.value;
        //  elt.Zone=this.formParamRisque.get('Zone').value;
        
        })
        this.dataSourceRisque = new MatTableDataSource(this.multiRisqueArray)

     

   
    this.getPackVoyageOrGAV()
    
      this.myStepper.next();
  }
}
  next(){
    this.generateCalcul()
  }
  
 
  deleteRisque(idRisque: any) {

    this.multiRisqueArray = this.multiRisqueArray.filter((risque: any) => risque.risqueNum != idRisque)

    this.dataSourceRisque.data = this.multiRisqueArray
    let descriptionGroup: any
    this.devisGroupe.map((groupe: any) => {
      groupe.groupeList = groupe.groupeList.filter((risque: any) => {
        if (risque.numRisque == idRisque) {
          if(groupe.groupeList.length==1){
            descriptionGroup = groupe.description
          }else{
            descriptionGroup=""
          }
        }
        return risque.numRisque != idRisque
      })
    })

    this.groupArray = this.groupArray.filter((groupe: any) => groupe != descriptionGroup)
    this.devisGroupe = this.devisGroupe.filter((groupe: any) => {
      return groupe.description != descriptionGroup
    })
    this.dataSourceGroupePack.data = this.dataSourceGroupePack?.data?.filter((groupPack: any) => groupPack.group != descriptionGroup)

    this.devis.groupes = this.devisGroupe

  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    this.uploadExcelFile()
  }
  uploadExcelFile() {
   
    if (this.selectedFile) {
      this.controleDevis=[];

      let risque: any = {}
      risque.paramList = []
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target != null) {
          const data = event.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0]; // Assuming there's only one sheet
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
          });
          // Filter out empty rows
          const filteredData : any = jsonData.filter((row: any) => row.length > 0);
          if(this.nbrAssure.status=="INVALID"){
            Swal.fire(
              `Le nombre de risque ne correpond pas avec la formule`,
              ``,
              `error`,

            )
            return
          }else if(this.nbrAssure.status=="VALID" && filteredData.length - 1 != this.nbrAssure.value ) {
            Swal.fire(
              `Le nombre de lignes ne correspond pas au nombre de risque indiqué, nombre de ligne= ` + (filteredData.length -1) + `, nombre indiqué= ` + this.nbrAssure.value + `. veuillez resaisir le fichier ou modifié le nombre de risque`,
              ``,
              `error`,

            )
            return
          }
          this.devisService.paramFichier(this.codeProduit).subscribe({next: (data: any) => {
            const nonFileParams = this.paraRisqueProduit.filter((el:any)=>data.find((d:any)=>d.paramRisque==el.idParamRisque)==undefined)

            let grpList:any[]=[]
            let controlDevEl:any[]=[]
            filteredData.slice(1).map((row:any[],i:number)=>{
              grpList.push({numRisque:i,risque:{paramList:[]}})
              row.map((param:any,idx:number)=>{
                const isDate=  data[idx].paramRisque == 166 || data[idx].paramRisque== 214
                 const paramElement={
                  idParam:parseInt(data[idx].paramRisque),
                  reponse:{
                    idReponse:data[idx].reponseId?param:null,
                    description:data[idx].reponseValeur? isDate? moment(param).format('YYYY-MM-DD[T]HH:mm:ss.000Z'): param :null,
                  }
                }
                const ctrlDevisParam = {
                  idParam:parseInt(data[idx].paramRisque),
                  valeur: isDate? moment(param).format('YYYY-MM-DD[T]HH:mm:ss.000Z'): param
                }
                controlDevEl.push(ctrlDevisParam)
                //console.log"le param fichier",param,paramElement)
                grpList[i].risque.paramList.push(paramElement)
              })
              nonFileParams.map((nfParams:any)=>{
                const name = nfParams.formName;
                let paramElement:any={
                  idParam:nfParams.idParamRisque,
                  reponse:{
                    idReponse:null,
                    description:null,
                  }
                }
                const ctrlDevisParam = {
                  idParam:nfParams.idParamRisque,
                  valeur: ''
                }

                if (nfParams.typeChamp?.code === 'L01' || nfParams.typeChamp?.code === 'L04') {
                  paramElement.reponse.idReponse = this.formParamRisque.get(name).value.idParam;
                  ctrlDevisParam.valeur=this.formParamRisque.get(name).value.idParam
                } else if (nfParams.typeChamp?.code === 'L08') {
                  paramElement.reponse.description = this.formParamRisque.get(name).value.id;
                  ctrlDevisParam.valeur= this.formParamRisque.get(name).value.id

                } else if (nfParams.typeChamp?.code !== 'L06') {
                  paramElement.reponse.description = this.formParamRisque.get(name).value;
                  ctrlDevisParam.valeur= this.formParamRisque.get(name).value;

                } else {
                  paramElement.reponse.description = moment(this.formParamRisque.get(name).value).format('YYYY-MM-DD[T]HH:mm:ss.000Z');
                  ctrlDevisParam.valeur= moment(this.formParamRisque.get(name).value).format('YYYY-MM-DD[T]HH:mm:ss.000Z');
                }
                grpList[i].risque.paramList.push(paramElement)
                controlDevEl.push(ctrlDevisParam)
               
              })
              this.controleDevis.push(controlDevEl)
              
              //console.log"ctrldevis",this.controleDevis)
              controlDevEl=[]
            })
            if (this.multiRisque) {

              let groupExsit = false
              this.devisGroupe.map((groupe: any) => {
                if (groupe.description == "voyage" || groupe.description == this.formParamRisque.get('groupe').value)
                  groupExsit = true
              })

              if (!groupExsit){


                this.devisGroupe.push({
                  "description": this.formParamRisque.get('groupe').value=='new'? this.formParamRisque.get('newGroupe').value : this.formParamRisque.get('groupe').value,
                  "idPack": this.idPack,
                  "groupeList": grpList,
                })
              }else {


                this.devisGroupe.filter((groupe: any) => groupe.description == this.formParamRisque.get('groupe').value)[0]?.groupeList.push({
                  "risque": risque,numRisque: this.risqueIndexBody
                })
              }
              if (this.multiRisque) {

                if (this.formParamRisque.get('groupe')?.value == 'new') {

                  this.formParamRisque.get('groupe')?.setValue(this.formParamRisque.get('newGroupe')?.value)
                  this.groupArray.push(this.formParamRisque.get('newGroupe')?.value)

                  let data = this.groupArray.length == 1 ? [] : this.dataSourceGroupePack.data
                  data.push({
                    group: this.formParamRisque.get('newGroupe')?.value, pack: this.packs[0]
                  })
                  this.dataSourceGroupePack = new MatTableDataSource(data);
                }else if (this.codeProduit=="20A"){
                  this.dataSourceGroupePack = new MatTableDataSource([{group: "voyage", pack: this.packs[0]}]);
                }
              }
            }
            this.devisService.controleDevis(this.controleDevis, this.codeProduit).subscribe({next: (data: any) => {
              //todo fix error
              let isBreak=false
              data.forEach((elt:any)=>{
                elt.forEach((ligne:any)=>{
                 if(ligne.bloquant){
                  Swal.fire(
                    ligne.message,
                    ``,
                    `error`,
              
                  )
                  isBreak = true
                  return
                 }
                 else{
                  this.errorHandler.error=false
                  this.errorHandler.msg=""
                 }
                 if(!ligne.bloquant && ligne.message){
                  Swal.fire(
                    ligne.message,
                    ``,
                    `warning`,
              
                  )
                 }
                })
              })
              if(isBreak)return
              //console.log"return isnt happening ")
              this.myStepper.next();
              this.devis.groupes = this.devisGroupe

              Object.keys(this.formParamRisque.controls).forEach(controlName => {
                this.formParamRisque.get(controlName)?.setErrors(null);
              });
              this.fileSuccess=true
              this.multiRisqueArray.map((elt:any)=>{

                elt.DateDépart =this.formParamRisque.get('DateDépart').value.format('YYYY-MM-DD');
                elt.DateRetour=this.formParamRisque.get('DateRetour').value.format('YYYY-MM-DD');
                elt.Formule=this.formParamRisque.get('Formule').value;
                elt.Destination=this.formParamRisque.get('Destination').value;


              })
              this.dataSourceRisque = new MatTableDataSource(this.multiRisqueArray)




            this.getPackVoyageOrGAV()
              
              },error:(error:any)=>{
                console.log(error)
                Swal.fire(
                  error.error.message,
                  ``,
                  `error`,
              
                )
              }
              })

          },error(err) {
            console.log("error",err)
          },})
       
        }
      };
      reader.readAsBinaryString(this.selectedFile);
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

        if (erroFile) {
          this.fileInput.nativeElement.value = null;
          this.fileSuccess = false
        }


        if (this.fileControle.length == this.nbrAssure.value) {
          this.devis.file = base64
          this.fileSuccess = true
        } else {
          this.fileSuccess = false
          this.fileInput.nativeElement.value = null;
          Swal.fire(
            `Le nombre de lignes ne correspond pas au nombre de risque indiqué, nombre de ligne= ` + this.fileControle.length + `, nombre indiqué= ` + this.nbrAssure.value + `. veuillez resaisir le fichier ou modifié le nombre de risque`,
            ``,
            `error`,

          )
        }
        if (this.fileControle.length > 9 && this.selectedValue.code=='F02') {
          Swal.fire(
            `Vous ne pouvez pas introduir au maximum 9 risques`,
            ``,
            `error`,

          )
        // if (this.fileControle.length > 20 && (sessionStorage.getItem('roles')?.includes("DA") || sessionStorage.getItem('roles')?.includes("CDC"))) {
        //   Swal.fire(
        //     `Vous n’avez pas le privilège pour faire ce devis veuillez voir avec le BO`,
        //     ``,
        //     `error`,

        //   )
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
          `Error: `+error,
          ``,
          `error`,

        )
        this.fileInput.nativeElement.value = null;
      }
    });
  }
  formWay(type:string){
    switch (type) {
      case "form":{
        this.risqueStep=1;
        this.withFile=false 
        this.dataSourceRisque = new MatTableDataSource([])
        this.selectedFile=null;
        this.controleDevis=[]
        this.devis.groupes[0].groupeList=[]
      }
        break;
        case "file":{
        this.risqueStep=2;
        this.withFile=false
        this.selectedFile=null;
        this.dataSourceRisque = new MatTableDataSource([])
        this.controleDevis=[]
        this.devis.groupes[0].groupeList=[]

        }
        break;
      default:
        break;
    }
  }
  onDateChange(event:any,id:any){
   if(this.produitInfo.codeProduit==="20A"  || this.produitInfo.codeProduit==="20G"){
    this.calculateDuration();

    switch (id) {
      case 211:
        this.multiRisqueArray?.forEach((rsq:any) => {
          rsq.DateDépart= moment(event.value).format("YYYY-MM-DD")
        });
        this.maxDateRetour=  moment(event.value).add(365,"days").format("YYYY-MM-DD")
        break;
      case 258:
        this.multiRisqueArray?.forEach((rsq:any) => {
          rsq.DateDébut= moment(event.value).format("YYYY-MM-DD")
        });
        this.maxDateRetour=  moment(event.value).add(365,"days").format("YYYY-MM-DD")
      break;
      case 212:
        this.multiRisqueArray?.forEach((rsq:any) => {
          rsq.DateRetour= moment(event.value).format("YYYY-MM-DD")
        });
      break;
      case 259:
        this.multiRisqueArray?.forEach((rsq:any) => {
          rsq.DateFin= moment(event.value).format("YYYY-MM-DD")
        });
      break;
      default:
        break;
    }
    this.devis?.groupes?.[0]?.groupeList?.forEach((el: any) => {
      el?.risque?.paramList?.forEach((param: any) => {
        
        if (param?.idParam === id) {
     

          param.reponse = {
            idReponse: null,
            description: moment(event.value).format("YYYY-MM-DD[T]HH:mm:ss.000Z")
          };
        }
      });
    });

  }}
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