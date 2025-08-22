
import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, ValidatorFn, AbstractControl, ValidationErrors,ReactiveFormsModule} from '@angular/forms';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


import { DialogRisqueComponent } from 'src/app/features/gestion-devis/dialog-risque/dialog-risque.component';
import { ListRisqueDialogComponent } from 'src/app/features/gestion-devis/creation-devis/list-risque-dialog/list-risque-dialog.component';
import { VehiculeService } from 'src/app/core/services/vehicule.service';
import * as XLSX from 'xlsx';
import { Observable, ReplaySubject } from 'rxjs';
import { N } from '@angular/cdk/keycodes';
// import { CryptoService } from 'src/app/core/services/crypto.service';
// import { moneyPipe } from "../../../core/pipes/moneyPipe";
 import { moneyPipe } from "../../../../core/pipes/moneyPipe"
import { CryptoService } from 'src/app/core/services/crypto.service';
import * as _ from 'lodash';


const todayDate: Date = new Date;
export function ageValidator(control: AbstractControl): { [key: string]: boolean } | null {

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
  selector: 'app-create-devis-commercial-line',
  templateUrl: './create-devis-commercial-line.component.html',
  styleUrls: ['./create-devis-commercial-line.component.scss'],

  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})

export class CreateDevisCommercialLineComponent implements OnInit {
  load: boolean = false;
  loadTable: boolean = false; idDevis: string;
  actualControlGarantie: number;
  codeProduit: string | null;
  basicTarif: any;
  groupArray: any = [];
  @ViewChild('stepper') private myStepper: MatStepper;
  @ViewChild('fileInput') fileInput: ElementRef;

 
  selectedPacks: any[];
  selectedSousProduit: any | null = null;
  groupesPacks: any = [];
  isFieldReadOnly: boolean = false;
  PMflotte: any;
  selectedFile: any;
  base64String: string;
  fileControle: any;
  fileSuccess = false;
  acctuelPack: any;

  
  indexGarantieMrp = 0
  indexSousGarantieMrp = 0
  valAss: any;
  typePolice: any;
  rcVoiturier: any;
  listPolice: any[];
  listDuree: any[];
  selectedTypePolice: any;
  risqueArray: any[];
  erreurFormRisque: boolean;
  isAssure: boolean;
  isCheckboxDisabled: boolean;
  
  constructor(private vehiculeService: VehiculeService, private dialog: MatDialog, private cd: ChangeDetectorRef, private route: ActivatedRoute, private router: Router, private _snackBar: MatSnackBar,
    private conventionService: ConventionService, private cryptoService: CryptoService,
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
  marques: any = [];
  modeles: any = [];
  produitInfo: any = {}
  dataSource = new MatTableDataSource();
  dataSourceSousGarantie = new MatTableDataSource();
  dataSourceListOfListes = new MatTableDataSource();
  selection = new SelectionModel<any>(true, []);
  formInfosAssure: FormGroup | any;
  // formGroupPack: FormGroup | any;
  formParamRisque: FormGroup | any;
  formPackGaranties: FormGroup | any;
  formPackSousGaranties: FormGroup | any;
  formReduction: FormGroup | any;
  tarifReady = false
  errorPackForm = false
  sousGarantieExist = false
  PrimeTotale = 0
  formules: any = []
  plafondSlected: any = []
  franchises: any = []
  idProduit = 0
  loaderControles = false
  idDevisWorkFlow = 45
  valeurVenale: number = 0 // JUSTE TEST
  risqueIndex = 0
  risqueIndexBody = 0
  idPack: number = 0
  returnedDevis: any
  paraRisqueProduit: ParamRisqueProduit[] = [];
  devis: any = {};
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
  ines=true
  taillersq: number
  // d la
  // wilayas: any = []; je lai retireer psk elle xiste ailleur
  communes_sous: any = [];
  // communes: any = []
  communes_assure: any = [];
  //a la c'est un supp pour ajouter wilaya et cpommune a assurée de catnat
  filterReduction = ReductionFiltreJson
  controleDevis: any = []
  reductions: any = []
  successDevis = false
  saveDevis = true
  loaderTarif = false
  loaderDevis = false
  //FIXME  delete column if column==null
  tauxExiste=false //ajj
  franchiseExist = false
  plafondExist = false
  formuleExist = false
  // nbrPages=0 // 24/09
  expandedElement: any
  multiRisque = false
  risqueArrayReady = false
  maxContenue = 10000000
  multiRisqueArray: any = []
  risqueConsult: any = {}
  calculCapitaleMRP = 50000
  DisplayedColumnsSousGarantie = ['select', 'garantie', 'plafond', 'franchise', 'formule', 'action', 'more'];
  //***************************** *LISTE
  displayedColumnsListParamRisque: any = [];
  list: { idListParamRisque: any; };
  listParamRisque: any = [];
  lengthColumnsListParamRisque: any;
  dataSourceListParamRisque = [];
  paramRisqueList: any = [];
  idPackComplet:any;
  garantiesNew: any = [];
  idListParamList: any;
  paraRisqueType: any = [];
  idsListParams: any = [];
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
  listExemple = [
    {
      id: 1,
      value: 'exemple 1 ',
    },
    {
      id: 2,
      value: 'exemple 2 ',
    },
    {
      id: 3,
      value: 'exemple 3 ',
    },
  ]
  formListParamRisque: FormGroup | any;
  defaultConvention = 'aucuneConvention'
  typesContact = ["fixe", "mobile"]
  wilayas: any[] = []
  durees: any[] = []
  idSousProduits= new FormControl() ///01
  IDSOUSPROD= null// a envoyer

  // idSousProduits:any[]
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
  groupControl: any
  produit: any
  multirisqueParam: any = []
  nmbVehicule = new FormControl()
  checkedTVA = new FormControl(false)
// checkedTVA: boolean=false
  nbrPages = new FormControl() 
  risqueStep = 0
  isListParam: boolean = false;
  devisOutput: any;
  withFile=false
  garantieNull=false
  Smp:any;
  TOTALE:any;
  sousProduits:any;
  isBOUser:boolean=false;
  zone_sis:any;
  latitude: any;
  longitude: any;
    displayFormRisque: boolean = false;
      tableauxParCategorie: any = [];
      tableauxParCategorieRisque:any =[]


  // IDSOUSPROD= new FormControl// a envoyer

  // idSousProduits:any
  // TO MERGE 
;
  isCourtier = sessionStorage.getItem("roles")?.includes("COURTIER")
  agencePersonne=parseInt(sessionStorage.getItem("agence")||'0');
  tkn:string = JSON.parse(sessionStorage.getItem("access_token")||'')?.access_token


  contenu:any;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<any>>;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  ngOnInit(): void {
    this.devis.list=[]
    if (this.codeProduit !== null) {
      this.codeProduit = this.route.snapshot.paramMap.get('codeProduit');
      this.produit = this.route.snapshot.paramMap.get('produit');
    }

    this.devis.groupes = []
    // if (this.route.snapshot.paramMap.get('codeProduit') != "45A")
    //   this.router.navigate(["/"])
    this.autditUser = sessionStorage.getItem("userId")

    this.autditUser = this.autditUser?.replace(/^"(.+)"$/, '$1')

    this.dataSource.data = []
    this.getProductId()
    this.getIdPays("DZA")
    this.getParamRisque()

    if(this.codeProduit!='T'){
      this.getAllParamRisque()
    this.getDureeByProduit()


    }
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
    let taux={}
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
          else if (category.description=='taux'){
            taux = {
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
        "taux":taux,
      })
      formule = {}
      franchise = {}
      plafond = {}
      taux={}
    })

    this.dataSourceGarantie = new MatTableDataSource(garantiesResume)


   

  
  
    // this.dataSourceGarantie = new MatTableDataSource(garantiesResume)
    this.formInfosAssure = this.formBuilder.group({
      typeClient: ['', [Validators.required]],
      typeContact: ['', [Validators.required]],
      nom: ['', this.typeClient != 'personne physique' ? [Validators.required, Validators.maxLength(50)] : [Validators.required, Validators.maxLength(50), Validators.pattern(Patterns.nom)]],
      prenom: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(Patterns.nom)]],
      dateNaissance: ['', [Validators.required, ageValidator, ageSup107Validator]],
      tel: ['', [Validators.required, Validators.pattern(Patterns.mobile)]],
      email: ['', [Validators.pattern(Patterns.email)]],
      duree: ['', [Validators.required]],
      //ADD ines
      agence: [this.isCourtier? this.agencePersonne:'', [Validators.required]],
      idSousProduits: [null, Validators.required],
      typePolice: [null, Validators.required],
     chiffreA: [{value:null,disabled:true},'']

    
  
  
  
  
    });
  
  
  





    this.formInfosAssure.valueChanges.subscribe(() => {
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
    // if (this.isCourtier) {
    //   this.formInfosAssure.get('agence')?.disable();
    // } else {
    //   this.formInfosAssure.get('agence')?.enable();
    // }

    const roles = sessionStorage.getItem('roles') || '';
this.isBOUser = roles.includes("BO");

if (this.codeProduit == '97' && this.isBOUser == false) {
  this.nbrPages.setValue(2);
  //console.log('je met la valeur de nbrpage a 2',this.nbrPages)
  // 
  // if (this.codeProduit === '97' && this.selectedSousProduit === '10' && !this.isBOUser) {
      
}
if (this.isCourtier) {
  this.formInfosAssure.get('agence')?.disable();
} else {
  this.formInfosAssure.get('agence')?.enable();
}


  }

applyTVA(){
  console.log("Checkbox cochée ?", this.checkedTVA.value); // true ou false
if(this.checkedTVA.value==true)
  this.devis.withTVA=false;else
this.devis.withTVA=true




}
  getIdPays(codePays: string) {
    this.genericService.getPays().subscribe({
      next: (data: any) => {

        this.idPays = data.find((pays: any) => pays.codePays == codePays).idPays

        this.getWilayas()
      },
      error: (error) => {

        //console.log(error);

      }
    });
  }
  getProductId() {
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')

    this.idProduit = JSON.parse(sessionStorage.getItem('products') || '{}').find((parametre: any) => parametre.codeProduit == this.codeProduit).idProduit

    this.getInfoProduit()
  }
  getInfoProduit() {
    this.genericService.getPorduitById(this.idProduit).subscribe({
      next: (data: any) => {
        //console.log('jesuis le contenaire sous produit ',data)
 
        this.produitInfo = data
        this.multiRisque = data.param_Produit_Reponses.filter((element: any) => element.idParamProduit.libelle == "multirisque")[0]
        .reponse.description == "Oui" ? true : false
        this.sousProduits = data.sousProduits;
        //console.log('contenu sousProduit',this.sousProduits)
        //souspr
        // if (this.multiRisque) {
        //   this.formGroupPack = this.formBuilder.group({
        //     groupes: this.formBuilder.array([])

        //   });


        // }
      },
      error: (error) => {

        //console.log(error);

      }
    });
  }
  // get groupes(): FormArray {
  //   return this.formGroupPack.get("groupes") as FormArray
  // }
  // newGroupes(): FormGroup {
  //   return this.formBuilder.group({
  //     groupe: ['', [Validators.required]],
  //     pack: ['', [Validators.required]],
  //   })
  // }
  // addGroupes() {
  //   this.groupes.push(this.newGroupes());
  // }
  // removeGroupes(i: number) {
  //   this.groupes.removeAt(i);
  // }
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

        //console.log(error);


      }
    });
  }

  getCommune(idWilaya: any) {
    this.genericService.getAllCommuneByWilaya(idWilaya).subscribe({
      next: (data: any) => {
        this.communes = data
      },
      error: (error) => {
        //console.log(error);
      }
    });
  }
  getDureeByProduit() {
    this.dureeService.getDureeByIdProduit(this.idProduit).subscribe({
      next: (data: any) => {

        this.durees = data
        //console.log(' la diréee du produit',this.durees)
      },
      error: (error) => {

        //console.log(error);

      }
    });
  }



  onContenatChange(){
    // Calculer la somme de deux autres champs (param1FormName et param2FormName)
    this.paraRisqueProduit.map((param: any) => {
      Object.keys(this.formParamRisque.value).map((paramFormName: any) => {
        if (paramFormName == param.formName) {
         
          // Récupérer les valeurs des deux paramètres à additionner
          let ValeurMatérielEtÉquipement = this.formParamRisque.get('ValeurMatérielEtÉquipement').value;
          let ValeurDeLaMarchandise = this.formParamRisque.get('ValeurDeLaMarchandise').value;
 
          // Vérifier si les deux valeurs sont numériques avant de faire la somme
          if (!isNaN(ValeurDeLaMarchandise) && !isNaN(ValeurMatérielEtÉquipement)) {
            const sum = Number(ValeurMatérielEtÉquipement) + Number(ValeurDeLaMarchandise);
 
            // Affecter la somme au champ param3FormName
            this.formParamRisque.get('ValeurContenant').setValue(sum);
          }
        }
        if(this.codeProduit=='97'&& this.formParamRisque.codeParam=='P268' && this.selectedSousProduit=="CTI"){
          this.formParamRisque.get('SMP').setValue(this.Smp*0.5);
        } 
        else{

          if(this.codeProduit=='97'&& this.formParamRisque.codeParam=='P268'){
            this.formParamRisque.get('SMP').setValue(this.Smp);
          }}
        


      });
    });
}
  getParamRisque() {
    //get param risque by type risque
    this.paramRisqueService.getParamRisqueList().subscribe((detailRisqueList: ParamRisque[]) => {
      this.paramRisqueList = detailRisqueList
    })
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
        this.idListParamList = detail.idListParamRisque.idListParamRisque;

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

              //console.log(error);

            }
          })
        }

        this.displayedColumnsListParamRisque.push(paramRisque.formName);
        this.idsListParams.push(paramRisque.idParamRisque);
        this.codesListParams.push(paramRisque.codeParam);

      })

      this.lengthColumnsListParamRisque = this.displayedColumnsListParamRisque.length
      this.openDialogList(idGarantie)

    })
  }
  // ajouterParam() {
  //   const newData = [...this.dataSourceListParamRisque.data, this.formListParamRisque.value];

  //   this.dataSourceListParamRisque.data = newData;

  // }
  getTypeClient() {

    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C24").idCategorie).subscribe({
      next: (data: any) => {

        this.typeClients = data
        if (this.multiRisque)
          this.PMflotte = this.typeClients.find((type: any) => type.code === "PM");
      },
      error: (error) => {

        //console.log(error);

      }
    });
  }


getTypePolice(sousproduit: any) {
  console.log('sousProduit le voila', sousproduit);

  this.genericService.getParam(
    JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find(
      (parametre: any) => parametre.code == "C179"
    ).idCategorie
  ).subscribe({
    next: (data: any) => {
      console.log('la liste intial de type police', data);

      switch (sousproduit) {
        case '48':
          this.listPolice = []; 

          data.map((el: any) => {
            console.log('on est les element du coup type police', el, this.listPolice);

            if (el.code == "TP01" || el.code == "TP04" || el.code == "TP05") {
            
              this.listPolice.push(el);
            }
          });
          break;

          case '57':
          this.listPolice = []; 

          data.map((el: any) => {
            console.log('on est les element du coup type police', el, this.listPolice);

            if (el.code == "TP01" || el.code == "TP02"|| el.code == "TP03") {
            
              this.listPolice.push(el);
            }
          });
          break;

        default:
          this.listPolice = data;
          break;
      }

      console.log('la voila apres le filtre', this.listPolice);
      this.typePolice = this.listPolice;
    },
    error: (error) => {
      console.log(error);
    }
  });
}

// getdureeTransport(typePolice: any) {
//   console.log('sousProduit le voila', typePolice);

//  this.dureeService.getDureeByIdProduit(this.idProduit).subscribe({
//       next: (data: any) => {

//         // this.durees = data
      
//       console.log('la liste intial duree', data);

//       switch (typePolice && this.selectedSousProduit) {
//         case ('TP01 && this.selectedSousProduit=="48"') :
//           this.listDuree = []; 

//           data.map((el: any) => {
//             console.log('on est les element du coup type police', el, this.listDuree);

//             if (el.code == "D04" ) {
            
//               this.listDuree.push(el);
//             }
//           });
//           break;
//           case ('TP02 && this.selectedSousProduit=="48"'):
//           this.listDuree = []; 

//           data.map((el: any) => {
//             console.log('on est les element du coup type police', el, this.listDuree);

//             if (el.code == "D04" ) {
            
//               this.listDuree.push(el);
//             }
//           });
//           break;
//           case ('TP03&& this.selectedSousProduit=="48"'):
//           this.listDuree = []; 

//           data.map((el: any) => {
//             console.log('on est les element du coup type police', el, this.listDuree);

//             if (el.code == "D04" ) {
            
//               this.listDuree.push(el);
//             }
//           });
//           break;
//           case ('TP04&& this.selectedSousProduit=="48"'):
//           this.listDuree = []; 

//           data.map((el: any) => {
//             console.log('on est les element du coup type police', el, this.listDuree);

//             if (el.code == "D1" ) {
            
//               this.listDuree.push(el);
//             }
//           });
//           break;

//           case ('TP05&& this.selectedSousProduit=="48"'):
//           this.listDuree = []; 

//           data.map((el: any) => {
//             console.log('on est les element du coup type police', el, this.listDuree);

//             if (el.code == "D1" ) {
            
//               this.listDuree.push(el);
//             }
//           });
//           break;



          


//         default:
//           this.listDuree = data;
//           break;
//       }

//       console.log('la voila apres le filtre duree', this.listDuree);
//       this.durees = this.listDuree;
//     },
//     error: (error) => {
//       console.log(error);
//     }
//   });
// }

getdureeTransport(typePolice: any) {
  console.log('sousProduit le voilà', typePolice);

  this.dureeService.getDureeByIdProduit(this.idProduit).subscribe({
    next: (data: any) => {
      console.log('la liste initiale de durée', data);

      this.listDuree = [];

      const sousProduit = this.selectedSousProduit;

      if (
        ['TP01', 'TP02', 'TP03'].includes(typePolice.code) &&
        sousProduit === '48'
      ) {
        this.listDuree = data.filter((el: any) => el.duree.code === 'D04');
      } 
      else if (
        ['TP04', 'TP05'].includes(typePolice.code) &&
        sousProduit === '48'
      ) {
        this.listDuree = data.filter((el: any) => el.duree.code === 'D1');
      } 
      else if (
        ['TP01', 'TP02'].includes(typePolice.code) &&
        sousProduit === '57'
      ) {
        this.listDuree = data.filter((el: any) => el.duree.code === 'D1');
      } 
      else if (typePolice.code === 'TP03' && sousProduit === '57') {
        this.listDuree = data.filter((el:any) => el.duree.code === 'D04');
      } 
      else {
        this.listDuree = data; // cas par défaut
      }

      console.log('la liste après filtre durée', this.listDuree);
      this.durees = this.listDuree;
    },
    error: (error) => {
      console.error('Erreur lors de la récupération des durées', error);
    }
  });
}




  getAllAgences() {
    this.agencesService.getAllAgence().subscribe({
      next: (data: any) => {

        this.agences = data
      },
      error: (error) => {

        //console.log(error);

      }
    });
  }
  getAllPack() {
    if (this.route.snapshot.paramMap.get('codeProduit') == '45A') {
      let paramBody =
      {
        //FIX ME DELETE THIS
        "dateMiseEnCirculation": this.dateMiseCirculation,

        "duree": this.duree
        // "dateMiseEnCirculation": "2012-07-11",

        // "duree": 3
      }

      this.packService.getPackByProduitParam(this.idProduit, paramBody).subscribe({
        next: (data: any) => {
          this.packs = []
          data.map((pack: any) => {

            this.packs.push(pack)

          })
        },
        error: (error) => {

          //console.log(error);

        }
      });
    } else {
      this.packService.getPackByProduit(this.idProduit).subscribe({
        next: (data: any) => {
          this.packs = []
          data.map((pack: any) => {

            this.packs.push(pack)

          })
        },
        error: (error) => {

          //console.log(error);

        }
      });
    }

  }

  getPack(idPack: any) {


    this.tarifReady = false
    this.errorHandler.error = false
    this.errorHandler.msg = ""
    this.idPack = idPack
    this.indexGarantieMrp = 0
    this.indexSousGarantieMrp = 0

    this.packService.getPackById(idPack).subscribe({
      next: (data: any) => {
       

          this.acctuelPack = data ;
          console.log('je suis this.acctuelpack de getpack()',this.acctuelPack)
        if (!this.multiRisque ||  this.codeProduit=='T') {
          this.displayedColumns = ['select', 'garantie', 'plafond', 'franchise', 'formule', 'action', 'sousGarantie'];
          this.DisplayedColumnsSousGarantie = ['select', 'garantie', 'plafond', 'franchise', 'formule', 'action', 'more'];

          if (this.codeProduit == '97') {
            this.displayedColumns.push('taux'); // Ajout de la colonne "taux"
            this.DisplayedColumnsSousGarantie.push('taux'); // Ajout de la colonne "taux" pour les sous-garanties
            //console.log('je rentre dasn le codeproduit97')
          }

          this.franchiseExist = false
          this.plafondExist = false
          this.formuleExist = false

          this.devis.pack = idPack
          this.garantieTab = []
          this.garantieAll = data.garantie

          if (this.route.snapshot.paramMap.get('codeProduit') == "95" && this.formParamRisque.get("ActivitéProfessionnelle")?.value?.is_professionnel) {

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


          if (!this.formParamRisque.get("ActivitéProfessionnelle")?.value?.is_perte_exploitation || this.formParamRisque.get("ChiffreDaffaire")?.value > 5000000) {
            let index = this.garantieAll.map((g: any) => g.codeGarantie).indexOf('G51')
            if (index !== -1) {
              this.garantieAll.splice(index, 1);
            }
          }


          this.garantieAll.filter((garantie: any) => {
            let plafond: any = []
            let formule: any = []
            let franchise: any = []
            let taux: any = []; // Ajout du tableau pour taux
            //exp sous garantie
            garantie.sousGarantieList?.filter((sousGarantie: any) => {
              this.sousGarantieExist = true
              let sousPlafond: any = []
              let sousFormule: any = []
              let sousFranchise: any = []
              let soustaux: any = [];  // Ajout pour sous-garanties
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

                    case "taux":  // Ajout de la gestion pour "taux"
                  soustaux.push(category);
                  this.tauxExiste = true
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
                  "taux": soustaux || '',
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
                  case "taux":
                  taux.push(category)
                  this.tauxExiste = true
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
                "taux": taux || '',  // Ajout du taux dans garantie

                "sousGarantieList": new MatTableDataSource(this.sousGarantieTab)
              }
            )

            this.sousGarantieTab = []
          })
          //FIXME  delete column if column==null
          if (!this.franchiseExist && this.displayedColumns.indexOf("franchise") !== -1) {
            this.displayedColumns.splice(this.displayedColumns.indexOf("franchise"), 1);
            this.DisplayedColumnsSousGarantie.splice(this.DisplayedColumnsSousGarantie.indexOf("franchise"), 1);
          }
          if (!this.plafondExist && this.displayedColumns.indexOf("plafond") !== -1) {
            this.displayedColumns.splice(this.displayedColumns.indexOf("plafond"), 1);
            this.DisplayedColumnsSousGarantie.splice(this.DisplayedColumnsSousGarantie.indexOf("plafond"), 1);
          }
          if (!this.formuleExist && this.displayedColumns.indexOf("formule") !== -1) {
            this.displayedColumns.splice(this.displayedColumns.indexOf("formule"), 1);
            this.DisplayedColumnsSousGarantie.splice(this.DisplayedColumnsSousGarantie.indexOf("formule"), 1);
          }
          if (!this.tauxExiste && this.displayedColumns.indexOf("taux") !== -1) {
            this.displayedColumns.splice(this.displayedColumns.indexOf("taux"), 1);
            this.DisplayedColumnsSousGarantie.splice(this.DisplayedColumnsSousGarantie.indexOf("taux"), 1); //ajj
          }
          if (!this.sousGarantieExist) {
            this.displayedColumns.splice(this.displayedColumns.indexOf("sousGarantie"), 1);
            this.DisplayedColumnsSousGarantie.splice(this.DisplayedColumnsSousGarantie.indexOf("sousGarantie"), 1);
          }
          this.garantieTab.sort(function (x: any, y: any) {

            // true values first
            //  return (x.obligatoire === y.obligatoire) ? 0 : x ? -1 : 1;
            // false values first
            // return (x === y)? 0 : x? 1 : -1;
          });

          this.garantieTab.sort((a: any, b: any) => Number(b.obligatoire) - Number(a.obligatoire));


          this.dataSource = new MatTableDataSource(this.garantieTab)

        
          this.Smp = this.devis.groupes?.[0]?.groupeList?.[0]?.risque?.paramList?.find((el:any)=>el.idParam==245)?.reponse?.description

          console.log("his.dataSource======>", this.dataSource)

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
                  taux: new FormControl({ value: "", disabled:false  }),  // Ajout du champ taux dans le formulaire,
                  idtaux: new FormControl({ value: x.taux, disabled:false }), //this.formParamRisque.get("ChiffreDaffaire")?.value > 5000000 this.Smp < 5000000000 


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
                          taux: new FormControl(sous.taux || ''),  // Ajout du champ taux pour les sous-garanties
                          idtaux: new FormControl({ value: sous.taux, disabled: true },),
                             idSousProduits: new FormControl(),
                          checked: new FormControl({ value: true, disabled: sous.obligatoire }),
                          valeur: new FormControl((this.codeProduit == '95' && sous.valeurGarantie != null) ? sous.valeurGarantie : ''),
                        })

                    ))
                })

            )
          );


          // this.changeAllGarentierState(this.formPackGaranties, this.acctuelPack)

          this.formPackGaranties.valueChanges.subscribe(() => {
            this.errorPackForm = false
          });

          this.loadTable = true

          this.objectDevis(true)

        }
      },
      error: (error) => {

        //console.log(error);

      }
    });

  }
  
  // changeAllGarentierState(formGroupe: FormArray, items: any) {
  //   let arrayOfEllementTodelete :any[] = []
  //   formGroupe.controls.forEach((control: AbstractControl) => {

  //     // Type casting to FormGroup
  //     const group = control as FormGroup;
  //    const index =  items.garantie.findIndex((garen:any)=> {
  //       return   group.value.idPackComplet == garen.idPackComplet

  //     })
  //     //get the garantie
  //     const garantie = items.garantie[index] ;

  //     // Safely access the 'checked' FormControl

  //     const checkedControl = group.get('checked') as FormControl;

  //     if (checkedControl) {
  //       if(garantie.obligatoire){
  //         checkedControl.disable();
  //         checkedControl.setValue(true);
  //       }else {
  //         if(!this.devis.optional){
  //           if(garantie.active){
  //             checkedControl.enable();
  //             checkedControl.setValue(false);

  //           }else {
  //             checkedControl.disable();
  //             checkedControl.setValue(false);
  //             const index = formGroupe.controls.indexOf(group);
  //             arrayOfEllementTodelete.push(index)
  //           }
  //         }else {
  //           checkedControl.enable();
  //           checkedControl.setValue(false);
  //         }

  //       }
  //       if(this.codeProduit=="95"){
  //         checkedControl.setValue(true);
  //       }

  //     }
  //   });
  //   arrayOfEllementTodelete.forEach((index:any)=> {
  //     if (index !== -1) {
  //       formGroupe.removeAt(index);
  //      this.dataSource.data.splice(index , 1);

  //       this.dataSource._updateChangeSubscription();
  //     }
  //   })
  // }
  getPackMulti(idPack: any, groupe: any) {
    this.packService.getPackById(idPack).subscribe({
      next: (data: any) => {

        
        this.idPackComplet=data.idPackComplet;
        this.garantiesNew=data.garantie;
       
        this.groupesPacks.push({ group: groupe, pack: data })
        this.garantieNull = false;

      },
      error: (error) => {

        //console.log(error);

      }
    });
  }

  // getpackCompletByid(){

  //   this.packService.getPackCById(this.idPackComplet).subscribe({
  //     next: (data: any) => {

  //      //console.log("dataNew");
  //     //console.log(data);
  //     },
  //     error: (error) => {

  //       //console.log(error);

  //     }
  //   });
  // }
  getControl(index: number, controlName: string): FormControl {
    this.actualControlGarantie = index
    return (this.formPackGaranties.at(index) as FormGroup).get(controlName) as FormControl;
  }
  getSousGarantieControl(index: number, controlName: string): FormControl {

    let mainFormGroup = this.formPackGaranties.at(this.actualControlGarantie) as FormGroup;
    let souGarantieArray = mainFormGroup.get('souGarantieArray') as FormArray;

    return (souGarantieArray.at(index) as FormGroup).get(controlName) as FormControl;
  }
  changeTypeClient(value: any) {

    this.typeClient = value.description
    //personne moral
    if (this.typeClient == "personne morale") {

      this.formInfosAssure.get("prenom")?.setValidators([])
      this.formInfosAssure.get("dateNaissance")?.setValidators([])
      this.formInfosAssure.get("email")?.setValidators([Validators.required, Validators.pattern(Patterns.email)])
      this.labelNom = "Raison Social"
    } else {
      this.labelNom = "Nom"
      this.formInfosAssure.get("prenom")?.setValidators([Validators.required, Validators.pattern(Patterns.nom)])
      this.formInfosAssure.get("email")?.setValidators([Validators.pattern(Patterns.email)])
      this.formInfosAssure.get("dateNaissance")?.setValidators([Validators.required, ageValidator, ageSup107Validator])
    }
    this.formInfosAssure.get('prenom').updateValueAndValidity();
    this.formInfosAssure.get('dateNaissance').updateValueAndValidity();
    this.formInfosAssure.get('email').updateValueAndValidity();
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

  checkGarantie(row: any, value: any) {
    this.tarifReady = false
    this.selection.toggle(row);
    if (value.checked && row.codeGarantie == "G50") {
      this.getListParamRisque(row.sousGarantieList.data.find((sg: any) => sg.codeSousGarantie == "SG91").idListParamRisque, row.sousGarantieList.data.find((sg: any) => sg.codeSousGarantie == "SG91").idSousGarantie)
    }
  }

  getAllParamRisque() {
    let existInBoth = false
    let validators: any = []
    let realData: any = [];//no
    let enabled: any = null;///no
    
    this.paramRisqueService.getParamByProduit(this.idProduit).subscribe({
      next: (data: any) => {

        realData = data;
       

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


console.log('cherche param',param)

              // if (param.paramRisque.idParamRisque == 50) {

              // }


              paramRisque.sousProduit = param.sousProduit;
              paramRisque.idParamRisque = param.paramRisque.idParamRisque
              paramRisque.libelle = param.paramRisque.libelle


              paramRisque.formName = param.paramRisque.libelle.split(' ').map((word: any) => word.charAt(0).toUpperCase() + word.substring(1)).join('').replace(/[°']/g, '')

              paramRisque.orderChamp = param.paramRisque.orderChamp
              paramRisque.position = param.paramRisque.position
              paramRisque.typeChamp = param.paramRisque.typeChamp
              paramRisque.sizeChamp = param.paramRisque.sizeChamp
              paramRisque.codeParam = param.paramRisque.codeParam



            // console.log('2i wanna die sousProduit', param.sousProduit);
          console.log('i wanna dieparamRisque ', paramRisque);
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

// console.log('yaaaaaaaaaaaaaaaaaaaaaaaaa param.paramRisque?.sousproduit?.code , this.selectedSousProduit , param.paramRisque?.sousproduit '
//                                             ,paramRisque.sousProduit , this.selectedSousProduit , param.sousProduit?.code)
console.log('yaaaaaaaaaaaaaaaaaaaaaaaaa',paramRisque.sousProduit ,  this.selectedSousProduit ,  param.sousProduit
                                            )

              // if (this.paraRisqueProduit.find(o => param.paramRisque.idParamRisque === o.idParamRisque) == undefined && existInBoth && 
              // (paramRisque?.sousProduit?.idSousProduit == this.selectedSousProduit || param?.sousProduit == null)) {

              if (this.paraRisqueProduit.find(o => param.paramRisque.idParamRisque === o.idParamRisque) == undefined && existInBoth && 
              (paramRisque.sousProduit?.code == this.selectedSousProduit || param?.sousProduit== null)) {
                console.log('oooooooooooooooooooooooooo',paramRisque)
                if (paramRisque.codeParam == 'P25') {
              
                  this.getMarque();
                }
                if (paramRisque.sizeChamp != 0 && paramRisque.sizeChamp != undefined && (param.paramRisque?.sousproduit?.idSousProduit == this.selectedSousProduit || param.paramRisque?.sousproduit == null))
                  this.formParamRisque.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required, Validators.minLength(paramRisque.sizeChamp), Validators.maxLength(paramRisque.sizeChamp)]));
                else
                  if (paramRisque.obligatoire)
                    this.formParamRisque.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required]));
                  else
                    this.formParamRisque.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue));


              this.paraRisqueProduit.push(paramRisque);


                // if (paramRisque.parent != null) {

                //   this.formParamRisque.get(paramRisque.formName).disable();
                // }

                // this.paraRisqueProduit.push(paramRisque)
                // if (this.multiRisque) {
                //   this.innerColumnsRisque.push({
                //     "formName": paramRisque.formName,
                //     "libelle": paramRisque.libelle,
                //   })

                //   // this.displayedColumnsRisque = this.innerColumnsRisque.map((col: any) => col.formName);
                this.displayedColumnsRisque = ['risqueNum', 'groupe', 'action'];

                // }
                //parent




                if (param.paramRisque.typeChamp.code == "L08" && param.paramRisque.paramRisqueParent == null) {

                  //EXP EN ATTENTE NOM TABLE EN RETOUR 
                  this.paramRisqueService.getTableParamParent(paramRisque.idParamRisque).subscribe({
                    next: (data: any) => {
                      paramRisque.reponses = data

                    },
                    error: (error) => {

                      //console.log(error);

                    }
                  })
                }
              }
              else if (existInBoth) {
                console.log('je suis le paramrisque et son fromnam',this.formParamRisque,paramRisque.formName)
                const control = this.formParamRisque.get(paramRisque.formName); // Vérification que le contrôle existe avant d'ajouter des validateurs
                console.log('jesuis le controle',control)
                if (control) {
                  if (param?.iddictionnaire?.description == 'valeur minimum') {
                    control.addValidators([Validators.min(paramRisque.valeurMin)]);
                    control.updateValueAndValidity();
                  } else if (param?.iddictionnaire?.description == 'valeur maximum') {
                    control.addValidators([Validators.max(paramRisque.valeurMax)]);
                    control.updateValueAndValidity();
                  }
                } else {
                  // console.error(`Contrôle de formulaire ${paramRisque.formName} non trouvé`);
                }
              }
              existInBoth = false
              validators = []
            })
            if (this.multiRisque) {
            
              
               this.formParamRisque.addControl("groupe", new FormControl(this.codeProduit=="T"? "Transport":"", []));
              this.formParamRisque.addControl("newGroupe", new FormControl('', []));


            }

            this.paraRisqueProduitCategory = this.paraRisqueProduit.reduce((x: any, y: any) => {

              (x[y.category] = x[y.category] || []).push(y);

              return x;

            }, {});

            this.paraRisqueProduitCategory = Object.values(this.paraRisqueProduitCategory)

            this.paraRisqueProduitCategory.map(risqueCategory => {
              risqueCategory.sort((a: any, b: any) => (a.orderChamp < b.orderChamp ? -1 : 1));
            })



this.tableauxParCategorie=this.paraRisqueProduitCategory[0]
this.tableauxParCategorieRisque=this.paraRisqueProduitCategory[1]
          console.log("inessssss", this.paraRisqueProduitCategory,this.risqueArray);

            this.risqueArrayReady = true

          },
          error: (error) => {

            //console.log(error);

          }
        })


      },
      error: (error) => {

        //console.log(error);

      }
    });


  }

  submitInfosAssure() {

    //console.log("cond",this.risqueArrayReady , ((this.multiRisque && this.risqueStep==1) || !this.multiRisque))
console.log("cond",this.formInfosAssure)
    if (this.formInfosAssure.valid) {
      console.log('blble',this.myStepper)
      this.myStepper.next();
      this.duree = this.formInfosAssure.get("duree").value
      //************* info assure
      this.devis.typeClient = this.formInfosAssure.get('typeClient').value.idParam
      this.devis.produit = this.idProduit // auto static
      if (this.typeClient != 'personne physique') {
        this.devis.raisonSocial = this.formInfosAssure.get('nom').value
        this.devis.prenom = ""
        this.devis.nom = ""
        this.devis.dateAssure = ""


      }
      else {
        this.devis.prenom = this.formInfosAssure.get('prenom').value
        this.devis.nom = this.formInfosAssure.get('nom').value
        this.devis.dateAssure = moment(this.formInfosAssure.get("dateNaissance").value).format('YYYY-MM-DD[T]HH:mm:ss.000Z')

        this.devis.raisonSocial = ''
      }

console.log('this.devis',this.devis)

      this.devis.telephone = this.formInfosAssure.getRawValue()?.['tel']
      this.devis.email = this.formInfosAssure.getRawValue()?.['email']
      this.devis.duree = this.formInfosAssure.getRawValue()?.['duree']
      this.devis.agence = this.formInfosAssure.getRawValue()?.['agence']
      this.devis.typePolice=this.formInfosAssure.getRawValue()?.['typePolice']

    this.devis.ChiffreAffaire = this.formInfosAssure.getRawValue()?.["chiffreA"]

      


      // this.devis.ChiffreAffaire=null
      // this.devis.sousProduit=this.formInfosAssure.get('idSousProduits').value /
        this.devis.sousProduit=this.IDSOUSPROD
  


      console.log("aqli da",this.formInfosAssure.get('chiffreA'))
      //get('idSousProduits').value

    } else {
      const invalid = [];
      const controls = this.formInfosAssure.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }

    }



    // trying to controlnbrVhehicule case not Bo cl catnat
    const roles = sessionStorage.getItem('roles') || '';
    this.isBOUser = roles.includes("BO");
  
    if ( this.codeProduit=='97'&& this.selectedSousProduit=="CTI" && !this.isBOUser) {

    this.devis.tailleRisque= 1;
    }

  }

  getAllConventions() {
    this.conventionService.getAllConventions().subscribe({
      next: (data: any) => {

        this.conventions = data


      },
      error: (error) => {

        //console.log(error);

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
        //console.log(error);
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

          //console.log(error);

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
        this.basicTarif.nbrPages = this.nbrPages.value;

        this.basicTarif.auditUser = this.autditUser
        this.basicTarif.canal = 100

        const hmac = await this.cryptoService.generateHmac(this.tkn, this.basicTarif);
        const stringifiedDevis1 = JSON.stringify(this.basicTarif);
        const dataDevis1 = {
          stringJson:stringifiedDevis1,
          signature: hmac
        }
        this.reductionService.applyReduction(dataDevis1).subscribe({
          next: (data: any) => {

            this.returnedTarif = data

            this.errorHandler.error = false
            this.errorHandler.msg = ""
            this.myStepper.next();

          },
          error: (error) => {
            //console.log(error)
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
        this.basicTarif.nbrPages = this.nbrPages.value;

      } else {
        this.basicTarif.idConvention = this.formReduction.get("convention").value
        this.basicTarif.idReduction = this.formReduction.get("reduction").value
        this.basicTarif.auditUser = this.autditUser
        this.basicTarif.canal = 100

        const hmac = await this.cryptoService.generateHmac(this.tkn, this.basicTarif);
        const stringifiedDevis2 = JSON.stringify(this.basicTarif);
        const dataDevis2 = {
          stringJson:stringifiedDevis2,
          signature: hmac
        }

        this.reductionService.applyReduction(dataDevis2).subscribe({
          next: (data: any) => {
            this.returnedTarif = data


            this.errorHandler.error = false
            this.errorHandler.msg = ""
            this.myStepper.next();

          },
          error: (error) => {
            //console.log(error)
            this.handleError(error)

          }
        });
      }
    }
  }
  changeTypeContact(value: any) {
    if (value == 'fixe')
      this.formInfosAssure.get("tel").setValidators([Validators.pattern(Patterns.fixe), Validators.required])
    else
      this.formInfosAssure.get("tel").setValidators([Validators.pattern(Patterns.mobile), Validators.required])

    this.formInfosAssure.get("tel").updateValueAndValidity();
  }
  clearValidators(paramFormName: string) {
    this.paraRisqueProduit.map((param: any) => {
      if (paramFormName == param.formName) {
        if (param.obligatoire)
          this.formParamRisque.controls[param.formName].setValidators([Validators.required])
        else
          this.formParamRisque.controls[param.formName].setValidators([])
        this.formParamRisque.controls[param.formName].updateValueAndValidity();

      }

    })
  }
  getMarque() {
    this.vehiculeService.getAllMarque().subscribe({
      next: (data: any) => {
        this.marques = data
      },
      error: (error) => {
        //console.log(error);
      }
    });
  }
  getModeleByMarque(marque: any) {
    this.vehiculeService.getModelByMarque(marque.idParam).subscribe({
      next: (data: any) => {
        this.modeles = data
      },
      error: (error) => {
        //console.log(error);
      }
    });


  }
  submitParamRisque(formParamRisque?: any) {
    
     this.loaderControles = true
        this.erreurFormRisque = false
        this.controleDevis = []
        this.warningMessage = []
        this.isAssure =false
        this.isCheckboxDisabled = true;
        const prmRsqFrm= _.cloneDeep(this.formParamRisque)
    
  
  
    console.log('jerentre 01');
    console.log('formParamRisque', this.formParamRisque);
    


    const invalid = [];
    const controls = this.formParamRisque.controls;
    // for (const name in controls) {

    //   if (controls[name].status == "INVALID" && controls[name].errors.bloquant) {
    //     this.clearValidators(name)
    //   }
    // }


    if (this.multiRisqueArray.length == this.nmbVehicule.value ) {
      //console.log('jerentre 04');
      Swal.fire(
        "le nombre de risque a atteint le nombre de risques indiqué",
        `error`
      )
      // this._snackBar.open("le nombre de risque a atteint le nombre de risques indiqué", 'fermer', {
      //   horizontalPosition: "end",
      //   panelClass: ['danger-snackbar']
      // })
    } else {
      if (this.formParamRisque.valid ) {
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
              Object.keys(this.formParamRisque.getRawValue()).map((paramFormName: any) => {
      
                if (paramFormName == param.formName) {
    
                  idparam = param.idParamRisque
                  if (param.typeChamp?.code == 'L01' || param.typeChamp?.code == 'L04') {
                    idreponse = this.formParamRisque.getRawValue()?.[paramFormName].idParam
                    description = ''
                    controlElement = {
                      "idParam": idparam,
                      "valeur": idreponse
                    }
                    Object.assign(this.risqueConsult, { [param.libelle]: this.formParamRisque.getRawValue()?.[paramFormName]?.description });
                  } else {
    
                    idreponse = null
                    if (param.typeChamp?.code == 'L08') {
    
                      description = this.formParamRisque.getRawValue()?.[paramFormName]?.id
                      Object.assign(this.risqueConsult, { [param.libelle]: this.formParamRisque.getRawValue()?.[paramFormName]?.description });
    
                    } else if (param.typeChamp?.code != 'L06') {                  
                      description = this.formParamRisque.getRawValue()?.[paramFormName]
                      Object.assign(this.risqueConsult, { [param.libelle]: description });
    
                    } else {
                    
                      description = moment(this.formParamRisque.getRawValue()?.[paramFormName]).format('YYYY-MM-DD[T]HH:mm:ss.000Z');
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
                  this. getAllPack()
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


  removeDuplicateParams(paramList: any[]): any[] {
    // Suppression des doublons basés sur l'idParam
    const uniqueParams = new Map();
    for (const param of paramList) {
      uniqueParams.set(param.idParam, param);
    }
    return Array.from(uniqueParams.values());
  }
  checkDoublons(numChassis: any, matricule: any) {
    const chassisExists = this.devis.groupes.some((groupe: any) =>
      groupe.groupeList.some((rs: any) =>
        rs.risque.paramList.some((param: any) =>
          param.reponse.description === numChassis
        )
      )
    );
    const matriculeExists = this.devis.groupes.some((groupe: any) =>
      groupe.groupeList.some((rs: any) =>
        rs.risque.paramList.some((param: any) =>
          param.reponse.description === matricule
        )
      )
    );
    if (matriculeExists && chassisExists) {
      return "both";
    } else if (matriculeExists) {
      return "P38";
    } else if (chassisExists) {
      return "P30";
    } else {
      return false;
    }
  }
  multiNext() {
    if (this.multiRisqueArray.length != 0) {
      this.myStepper.next();
      this.getAllPack()
    }
  }
 multiRisqueTab(formprmRsq:any) {
console.log('hghghg depuis multirisUETAVLE',formprmRsq)
    if(formprmRsq.valid){
    
      let objectParam = formprmRsq.value
    
      Object.keys(formprmRsq.value).map((element: any) => {
    
    
    
        if (typeof formprmRsq.controls[element].value === "object") {
    
            objectParam[element] = formprmRsq.controls[element].value?.description
    
        } else {
    
          objectParam[element] = formprmRsq.controls[element].value
    
        }    
      });
    
      switch (this.codeProduit) {
    
        case "T":
    
       
    
            formprmRsq.get("newGroupe").value
    
        
    
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
    
      // this.formParamRisque.reset()
    
    
    
      // this.formParamRisque.get('Nom').setValue(null );
    
      // this.formParamRisque.get('Prénom')?.setValue( null);
    
      // this.formParamRisque.get('DateDeNaissance')?.setValue(null );
    
      // this.formParamRisque.get('DateExpiration')?.setValue(null );
    
      // this.formParamRisque.get('Genre')?.setValue(null );
    
      // this.formParamRisque.get('NuméroDePasseport')?.setValue(null );
    
      // this.formParamRisque.get('Nationalité')?.setValue( null);
    
      // this.formParamRisque.get("ActivitéARisque")?.setValue("")
    
      // this.formParamRisque.get("SportProfessionnel")?.setValue("")
    
      // this.formParamRisque.get("ClasseDeProfession")?.setValue("")
    
      // this.formParamRisque.get("SportÀRisque")?.setValue("")
    
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

  // getRelation(typeChamp: any, isParent: boolean, idParamRisque: number, idReponse: number, formName: any) {
  //   if (isParent == true)
  //     if (typeChamp == 'L01') {

  //       this.paramRisqueService.getParamRelation(idParamRisque, idReponse).subscribe({
  //         next: (data: any) => {

  //           this.paraRisqueProduit.filter((param: any) => {
  //             if (param.idParamRisque == data[0].idParamRisque) {

  //               param.reponses = data[0].categorie.paramDictionnaires
  //               this.formParamRisque.controls[param.formName].enable()

  //             }
  //           })

  //         },
  //         error: (error) => {

  //           //console.log(error);

  //         }
  //       })
  //     } else {

  //       let idRisqueChild = this.paraRisqueProduit.find((rs: any) => rs.parent?.idParamRisque == idParamRisque)?.idParamRisque

  //       if (idRisqueChild)
  //         this.paramRisqueService.getTableParamChild(idRisqueChild, idReponse).subscribe({
  //           next: (data: any) => {
  //             this.paraRisqueProduit.filter((param: any) => {
  //               if (param.idParamRisque == idRisqueChild) {
  //                 param.reponses = data
  //                 this.formParamRisque.controls[param.formName].enable()
  //               }

  //             })
  //             // this.paraRisqueProduit.filter((param: any) => {
  //             //   if (param.idParamRisque == data[0].idParamRisque) {

  //             //     param.reponses = data[0].categorie.paramDictionnaires
  //             //     this.formParamRisque.controls[param.formName].enable()

  //             //   }
  //             // })

  //           },
  //           error: (error) => {

  //             //console.log(error);

  //           }
  //         })
  //     }

  //   // if (this.formParamRisque.get(formName)?.value?.is_medical) {
  //   //   this.isListParam = true;
  //   //   let idListparam = this.paramRisqueList.find((p: any) => p.idParamRisquePere?.idParamRisque == idParamRisque)?.idListParamRisque

  //   //   this.getListParamRisque(idListparam, "");
  //   // }
  // }

  getRelation(typeChamp: any, isParent: boolean, idParamRisque: number, idReponse: number, formName: any,codeParam:any) {
    console.log("prinatge22.0",this.formParamRisque)
    // const ZoneSis=this.formListParamRisque.FormGroup.controls.commune.value.zone_sis
    // //console.log("je suis la zone-siisi",this.formListParamRisque.FormGroup.controls.commune.value.zone_sis)
      console.log('response',formName , codeParam,idReponse)


if (this.selectedSousProduit === '48' && codeParam === 'T002') {
  // Réinitialiser tous les champs (réactivation + validateurs si nécessaire)
  const champsNational = [
    "PointDeDépart",
    "PointDarrivée",
    "WilayaDeDépart",
    "CommuneDeDépart",
    "WilayaDarrivée",
    "CommuneDarrivée",
    "PaysDarrivée",
    "Provenance(paysDeDépart)",
  ];
    champsNational.forEach(champsNational => {
    this.formParamRisque.get(champsNational)?.enable({ emitEvent: false });
    this.formParamRisque.get(champsNational)?.setValidators(Validators.required);
    this.formParamRisque.get(champsNational)?.updateValueAndValidity({ emitEvent: false });
  });
    const champsAB = [
    "PaysDarrivée",
    "Provenance(paysDeDépart)",
  ];
    champsAB.forEach(champsAB => {
    this.formParamRisque.get(champsAB)?.enable({ emitEvent: false });
    this.formParamRisque.get(champsAB)?.setValidators(Validators.required);
    this.formParamRisque.get(champsAB)?.updateValueAndValidity({ emitEvent: false });
  });

    const champsInternational = [
  
    "WilayaDeDépart",
    "CommuneDeDépart",
    "WilayaDarrivée",
    "CommuneDarrivée",
  ];
    champsInternational.forEach(champsInternational => {
    this.formParamRisque.get(champsInternational)?.enable({ emitEvent: false });
    this.formParamRisque.get(champsInternational)?.setValidators(Validators.required);
    this.formParamRisque.get(champsInternational)?.updateValueAndValidity({ emitEvent: false });
  });





  // Désactivation selon la réponse
  //17323 national
//17324 AB 
//17325 international

  switch (idReponse) {
    case 17323:
      // Cas trajet national
      champsNational.forEach(champ => {
        this.formParamRisque.get(champ)?.disable({ emitEvent: false });
        this.formParamRisque.get(champ)?.clearValidators();
        this.formParamRisque.get(champ)?.updateValueAndValidity({ emitEvent: false });
      });
      break;

    case 17324:
      // Cas trajet ab
     champsAB.forEach(champ => {
        this.formParamRisque.get(champ)?.disable({ emitEvent: false });
        this.formParamRisque.get(champ)?.clearValidators();
        this.formParamRisque.get(champ)?.updateValueAndValidity({ emitEvent: false });
      });
      break;

    case 17325:
      // Cas international 
         champsInternational.forEach(champ => {
        this.formParamRisque.get(champ)?.disable({ emitEvent: false });
        this.formParamRisque.get(champ)?.clearValidators();
        this.formParamRisque.get(champ)?.updateValueAndValidity({ emitEvent: false });
      });
      break;

    default:
      // Aucun cas spécifique : tout reste activé
      break;
  }
}

//     if( this.selectedSousProduit=='48'&& codeParam=='T002'  ){
//       if(idReponse==17323){
//         // cas transport et sous produit rc voiturier et le param trajet == national
//     console.log("prinatge22.0",this.formParamRisque)
//     this.formParamRisque.get("PointDeDépart").disable()
//     this.formParamRisque.get("PointDeDépart").clearValidators()
//     this.formParamRisque.get("PointDeDépart").updateValueAndValidity()
 
//     this.formParamRisque.get("PointDarrivée").disable()
//     this.formParamRisque.get("PointDarrivée").clearValidators()
//     this.formParamRisque.get("PointDarrivée").updateValueAndValidity()
//       }
//    else{

//     this.formParamRisque.get("PointDeDépart").enable()
//     this.formParamRisque.get("PointDeDépart").updateValueAndValidity()
 
//     this.formParamRisque.get("PointDarrivée").enable()
//     this.formParamRisque.get("PointDarrivée").updateValueAndValidity()

//  if(idReponse==17324){
//     this.formParamRisque.get("WilayaDeDépart").disable()
//     this.formParamRisque.get("WilayaDeDépart").clearValidators()
//     this.formParamRisque.get("WilayaDeDépart").updateValueAndValidity()
//      this.formParamRisque.get("CommuneDeDépart").disable()
//     this.formParamRisque.get("CommuneDeDépart").clearValidators()
//     this.formParamRisque.get("CommuneDeDépart").updateValueAndValidity()




//      this.formParamRisque.get("WilayaDarrivée").disable()
//     this.formParamRisque.get("WilayaDeDépart").clearValidators()
//     this.formParamRisque.get("WilayaDarrivée").updateValueAndValidity()
//      this.formParamRisque.get("CommuneDarrivée").disable()
//     this.formParamRisque.get("CommuneDarrivée").clearValidators()
//     this.formParamRisque.get("CommuneDarrivée").updateValueAndValidity()

//  } else{

//  }
// }



// }
    //console.log("dddd",codeParam);
  
  
  

  

    // fin test me 

    if(this.codeProduit== '97' && codeParam=='P261'){
      // //console.log("a ines",this.formParamRisque.get(formName).value)
      this.devis.groupes[0]?.groupeList?.map((rsq:any)=>{
        rsq.risque.paramList.find((param:any)=>param.idParam==idParamRisque).reponse.idParam = this.formParamRisque.get(formName).value.idParam
      })

      this.dataSourceRisque.data.map((rsqs:any)=>rsqs["ActivitéExercéeDevrait-elleÊtreEnregistréeAuCNRC	"]=this.formParamRisque.get(formName).value.description)
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

            //console.log(error);

          }
        })
      } else {
        let idRisqueChild = this.paraRisqueProduit.find((rs: any) => rs.parent?.idParamRisque == idParamRisque)?.idParamRisque
        if (idRisqueChild)
          this.paramRisqueService.getTableParamChild(idRisqueChild, idReponse).subscribe({
            next: (data: any) => {
              //console.log('Résultat de getTableParamChild:', data);

              // zone sis tu sera ici 
              this.paraRisqueProduit.filter((param: any) => {
                if (param.idParamRisque == idRisqueChild) {
                  param.reponses = data


                  // on vas cree uune function qui vas recuperer zonsisi sellon l'id param


                  








                  this.formParamRisque.controls[param.formName].enable()
                  //console.log("zone sis",this.formParamRisque)


                  // alert(this.formListParamRisque.FormGroup.controls.commune.value.zone_sis)
                
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

              //console.log(error);

            }
          })
      }


      //ActivitéEst-elleEnregistréeAuCNRC?

      // ajouter cnrc qst






    // if (this.formParamRisque.get(formName)?.value?.is_medical) {
    //   this.isListParam = true;
    //   let idListparam = this.paramRisqueList.find((p: any) => p.idParamRisquePere?.idParamRisque == idParamRisque)?.idListParamRisque

    //   this.getListParamRisque(idListparam, "");
    // }
  }



  objectDevis(withRemplissage: boolean) {
    const smp=this.formParamRisque.get("SMP")?.value;
    console.log('withRemplissage ',withRemplissage)

    let garantieObligatoire = false
    let sousGarantieObligatoire = false
    let packCompletOne: any = []
    let categoryOfGaranti: any = []
    let sousCategorieList = null

    if (!this.multiRisque || this.codeProduit=="T") {
      //DEBUT RECHERCHE
      this.garantieAll.map((garantie: any) => {
        Object.values(this.formPackGaranties.controls).map((row: any) => {

          //EXP ajout des sous garantie de la garantie

          //EXP garantie
          if (garantie.idPackComplet == row.value.idPackComplet) {
            console.log(" cond01 je suis 1951")


            if (row.controls.checked.value || ((this.route.snapshot.paramMap.get('codeProduit') == "96" || this.route.snapshot.paramMap.get('codeProduit') == "95") && 
            withRemplissage)) {
            //console.log(" cond02 je suis 1955")

              garantieObligatoire = true

     // taux

    //  //console.log(this.pa)
     if (row.controls.idtaux.value.length != 0) {
   //console.log("row taux",row)

  // list of value
  if (row.controls.idtaux.value.length > 1) {
    //console.log("row taux2",row)


    sousCategorieList = null

    this.gestionErreurPack(row.value.idPackComplet, "taux", this.formPackGaranties, withRemplissage)
    if (!this.errorPackForm) {

      if (row.value.taux?.sousCategorieList?.length != undefined && row.value.taux?.sousCategorieList?.length != 0)


        sousCategorieList = {


          "idSousCategoriePackComplet": row.value.taux?.sousCategorieList[0]?.idParamSCPackComplet,
          "valeur": row.value.taux.valeur
        }
      categoryOfGaranti.push(
        {
          "idCategoriePackComplet": row.value?.taux?.idParamPackComplet,
          "valeur": withRemplissage ? null : row.value.taux.valeur,
          "sousCategorieList": sousCategorieList
        }
      )
    }


  } 
  else {
    //input


    // //console.log(" bahou " ,row)

    // //console.log(" bahou 99 "+row)

    console.log("vvv", row.value)
    // //console.log("00000000000000000000000", this.paraRisqueProduitCategory[0])
    // //console.log("yaaaaaaaaaaaa",this.paraRisqueProduit)
//bed


    if (row.value.taux != null) {

      //console.log(" bahou 12 "+row.controls.idtaux.value[0].sousCategorieList )


      sousCategorieList = null



     // if (row.controls.idtaux.value[0].sousCategorieList?.length != undefined && row.controls.idtaux.value[0].sousCategorieList?.length != 0)
        if (row.controls.idtaux.value[0].sousCategorieList?.length != 0){
           //console.log(" bahou 13 ")

        }




        sousCategorieList = {
          "idSousCategoriePackComplet": row.controls.idtaux.value[0].sousCategorieList[0]?.idParamSCPackComplet,
          "valeur": row.controls.idtaux.value[0].valeur,
        }
      categoryOfGaranti.push(
        {
          "idCategoriePackComplet": row.controls.idtaux?.value[0]?.idParamPackComplet,
          "valeur": row.value.taux,

          //"valeur": withRemplissage ? null : row.controls.idtaux.value[0].valeur,
          "sousCategorieList": sousCategorieList
        }
      )

      if (row.controls.idtaux.value[0].sousCategorieList?.length != undefined && row.controls.idtaux.value[0].sousCategorieList?.length != 0)

        sousCategorieList = {
          "idSousCategoriePackComplet": row.controls.idtaux?.value[0]?.sousCategorieList[0]?.idParamSCPackComplet,
          "valeur": row.controls.idtaux.value[0].valeur
        }
      categoryOfGaranti.push(
        {
          "idCategoriePackComplet": row.controls.idtaux?.value[0]?.idParamPackComplet,
          "valeur": withRemplissage ? null : row.controls.idtaux.value[0].valeur,
          "sousCategorieList": sousCategorieList
        }
      )
    }

  }




} else
console.log('his.formPackGaranties',this.formPackGaranties)
              if (row.controls.idformule.value.length != 0) {
            //console.log(" cond03 je suis 1959")


                // list of value
                if (row.controls.idformule.value.length > 1) {
            //console.log(" cond04 je suis 1964")

                  sousCategorieList = null

                  this.gestionErreurPack(row.value.idPackComplet, "formule", this.formPackGaranties, withRemplissage)
                  if (!this.errorPackForm) {
            //console.log(" cond05 je suis 1970")

                    if (row.value.formule?.sousCategorieList?.length != undefined && row.value.formule?.sousCategorieList?.length != 0)
            //console.log(" cond06 je suis 1973")

                      sousCategorieList = {


                        "idSousCategoriePackComplet": row.value.formule?.sousCategorieList[0]?.idParamSCPackComplet,
                        "valeur": row.value.formule.valeur
                      }
                    categoryOfGaranti.push(
                      {
                        "idCategoriePackComplet": row.value?.formule?.idParamPackComplet,
                        "valeur": withRemplissage ? null : row.value.formule.valeur,
                        "sousCategorieList": sousCategorieList
                      }
                    )
                  }


                } else {
                  //input
            //console.log(" cond07 je suis 1993")

                  if (row.value.formule != null) {
            //console.log(" cond08 je suis 1993")

                    sousCategorieList = null
                    if (row.controls.idformule.value[0].sousCategorieList?.length != undefined && row.controls.idformule.value[0].sousCategorieList?.length != 0)
            //console.log(" cond09")

                      sousCategorieList = {
                        "idSousCategoriePackComplet": row.controls.idformule.value[0].sousCategorieList[0]?.idParamSCPackComplet,
                        "valeur": row.value.formule
                      }
                    categoryOfGaranti.push(
                      {
                        "idCategoriePackComplet": row.controls.idformule?.value[0]?.idParamPackComplet,
                        "valeur": withRemplissage ? null : row.value.formule,
                        "sousCategorieList": sousCategorieList
                      }
                    )
                  } else {
                    //input non saisie


                    if (row.controls.idformule.value[0].descriptionvVal == "input" && !withRemplissage) {

                      this.errorPackForm = true
                    }
                    //valeur ou non saisie
                    sousCategorieList = null

                    if (row.controls.idformule.value[0].sousCategorieList?.length != undefined && row.controls.idformule.value[0].sousCategorieList?.length != 0)
            //console.log(" cond12")

                      sousCategorieList = {
                        "idSousCategoriePackComplet": row.controls.idformule?.value[0]?.sousCategorieList[0]?.idParamSCPackComplet,
                        "valeur": row.controls.idformule.value[0].valeur
                      }
                    categoryOfGaranti.push(
                      {
                        "idCategoriePackComplet": row.controls.idformule?.value[0]?.idParamPackComplet,
                        "valeur": withRemplissage ? null : row.controls.idformule.value[0].valeur,
                        "sousCategorieList": sousCategorieList
                      }
                    )
                  }

                }
              } if (row.controls.idfranchise.value.length != 0) {
            console.log(" cond13",row)

                // list of value
                if (row.controls.idfranchise.value.length > 1) {
            console.log(" cond14",row)

                  sousCategorieList = null

                  if (row.value.franchise?.sousCategorieList?.length != undefined && row.value.franchise.sousCategorieList?.length != 0)
            //console.log(" cond15")

                    sousCategorieList = {
                      "idSousCategoriePackComplet": row.value.franchise?.sousCategorieList[0]?.idParamSCPackComplet,
                      "valeur": row.value.franchise.valeur
                    }

                  categoryOfGaranti.push(
                    {
                      "idCategoriePackComplet": row.value?.franchise?.idParamPackComplet,
                      "valeur": withRemplissage ? null : row.value.franchise?.valeur,
                      "sousCategorieList": sousCategorieList
                    }
                  )
                  console.log('categoryOfGaranti',categoryOfGaranti)

                } else {
            //console.log(" cond16")

                  if (row.value.franchise != null) {
            //console.log(" cond17")

                    sousCategorieList = null
                    if (row.controls.idfranchise.value[0].sousCategorieList?.length != undefined && row.controls.idfranchise.value[0].sousCategorieList?.length != 0)
            //console.log(" cond18")

                      sousCategorieList = {
                        "idSousCategoriePackComplet": row.controls.idfranchise?.value[0]?.sousCategorieList[0]?.idParamSCPackComplet,
                        "valeur": row.value.franchise
                      }
                    categoryOfGaranti.push(
                      {
                        "idCategoriePackComplet": row.controls.idfranchise?.value[0]?.idParamPackComplet,
                        "valeur": withRemplissage ? null : row.value.franchise,
                        "sousCategorieList": sousCategorieList
                      }
                    )
                  } else {
            //console.log(" cond19")

                    //input non saisie
                    if (row.controls.idfranchise.value[0].descriptionvVal == "input" && !withRemplissage) {
            //console.log(" cond20")
                      this.errorPackForm = true
                    }
                    //valeur
                    sousCategorieList = null
                    if (row.controls.idfranchise.value[0].sousCategorieList?.length != undefined && row.controls.idfranchise.value[0].sousCategorieList?.length != 0)
            //console.log(" cond21")

                      sousCategorieList = {
                        "idSousCategoriePackComplet": row.controls.idfranchise?.value[0]?.sousCategorieList[0]?.idParamSCPackComplet,
                        "valeur": row.controls.idfranchise.value[0].valeur
                      }
                    categoryOfGaranti.push(
                      {
                        "idCategoriePackComplet": row.controls.idfranchise?.value[0]?.idParamPackComplet,
                        "valeur": withRemplissage ? null : row.controls.idfranchise.value[0].valeur,
                        "sousCategorieList": sousCategorieList
                      }
                    )
                  }
                }///////////////////////////////////////////////////////////////////////////////////////////////////////////////
              } if (row.controls.idplafond.value.length != 0) {

                //console.log(" cond22")



                if (row.controls.idplafond.value.length > 1) {
                  //console.log(" cond23")


                  sousCategorieList = null
                  if (row.value.plafond?.sousCategorieList?.length != undefined && row.value.plafond?.sousCategorieList?.length != 0)
                    //console.log(" cond24")

                    sousCategorieList = {
                      "idSousCategoriePackComplet": row.value.plafond?.sousCategorieList[0]?.idParamSCPackComplet,
                      "valeur": row.value?.plafond?.valeur
                    }
                  categoryOfGaranti.push(
                    {
                      "idCategoriePackComplet": row.value?.plafond?.idParamPackComplet,
                      "valeur": withRemplissage ? null : row.value.plafond.valeur,
                      "sousCategorieList": sousCategorieList
                    }
                  )

                } else {
                  //console.log(" cond25")


                  if (row.value.plafond != null) {
                    //console.log(" cond26")


                    sousCategorieList = null
                    if (row.controls.idplafond.value[0].sousCategorieList?.length != undefined && row.controls.idplafond.value[0].sousCategorieList?.length != 0)
                      //console.log(" cond27")

                      sousCategorieList = {
                        "idSousCategoriePackComplet": row.controls.idplafond?.value[0]?.sousCategorieList[0]?.idParamSCPackComplet,
                        "valeur": row.value.plafond
                      }
                    categoryOfGaranti.push(
                      {
                        "idCategoriePackComplet": row.controls.idplafond?.value[0]?.idParamPackComplet,
                        "valeur": withRemplissage ? null : row.value.plafond,
                        "sousCategorieList": sousCategorieList
                      }
                    )
                  } else {
                    //console.log(" cond28")


                    //input non saisie
                    if (row.controls.idplafond.value[0].descriptionvVal == "input" && !withRemplissage) {
                      //console.log(" cond29")

                      this.errorPackForm = true

                    }
                    //valeur
                    sousCategorieList = null

                    if (row.controls.idplafond.value[0].sousCategorieList?.length != undefined && row.controls.idplafond.value[0].sousCategorieList?.length != 0) {
                      //console.log(" cond30")

                      sousCategorieList = {
                        "idSousCategoriePackComplet": row.controls.idplafond?.value[0]?.sousCategorieList[0]?.idParamSCPackComplet,
                        "valeur": row.controls.idplafond.value[0].valeur
                      }
                    }
                    categoryOfGaranti.push(
                      {
                        "idCategoriePackComplet": row.controls.idplafond?.value[0]?.idParamPackComplet,
                        "valeur": withRemplissage ? null : row.controls.idplafond.value[0].valeur,
                        "sousCategorieList": sousCategorieList
                      }
                    )
                  }

                }
              }
              //console.log('valeur recherché',row.controls.idtaux.value)
              //console.log('valeur recherché',row.value.taux.valeur)








              // fin taux

              if (garantieObligatoire && !this.errorPackForm) {
                //console.log(" cond31")

                packCompletOne.push({
                  "idPackComplet": garantie.idPackComplet,
                  "prime": "",
                  "categorieList": categoryOfGaranti
                })
                categoryOfGaranti = []


              }
              //EXP SOUS GARANTIE :
              garantie.sousGarantieList.forEach((sousGarantie: any) => {

                row.get('souGarantieArray').controls.forEach((sousGarantieRow: any) => {

                  if (sousGarantie.idPackComplet == sousGarantieRow.value.idPackComplet) {
                    //console.log(" cond32")

                    if (sousGarantieRow.controls.checked.value || ((this.route.snapshot.paramMap.get('codeProduit') == "96" || this.route.snapshot.paramMap.get('codeProduit') == "95") && withRemplissage)) {

                    //console.log(" cond33")


                      sousGarantieObligatoire = true

                      if (sousGarantieRow.controls.idformule.value.length != 0) {
                    //console.log(" cond34")


                        // list of value
                        if (sousGarantieRow.controls.idformule.value.length > 1) {
                    //console.log(" cond35")

                          sousCategorieList = null

                          this.gestionErreurPack(sousGarantieRow.value.idPackComplet, "formule", row.get('souGarantieArray'), withRemplissage)
                          if (!this.errorPackForm) {
                    //console.log(" cond36")


                            if (sousGarantieRow.value.formule?.sousCategorieList?.length != undefined && sousGarantieRow.value.formule?.sousCategorieList?.length != 0)
                    //console.log(" cond37")


                              sousCategorieList = {
                                "idSousCategoriePackComplet": sousGarantieRow.value?.formule?.sousCategorieList[0]?.idParamSCPackComplet,
                                "valeur": sousGarantieRow?.value?.formule?.valeur
                              }
                            categoryOfGaranti.push(
                              {
                                "idCategoriePackComplet": sousGarantieRow.value?.formule?.idParamPackComplet,
                                "valeur": withRemplissage ? null : sousGarantieRow.value.formule.valeur,
                                "sousCategorieList": sousCategorieList
                              }

                            )

                          }


                        } else {
                    //console.log(" cond38")

                          //input
                          if (sousGarantieRow.value.formule != null) {
                    //console.log(" cond39")

                            sousCategorieList = null
                            if (sousGarantieRow.controls.idformule.value[0].sousCategorieList?.length != undefined && sousGarantieRow.controls.idformule.value[0].sousCategorieList?.length != 0)
                    //console.log(" cond40")

                              sousCategorieList = {
                                "idSousCategoriePackComplet": sousGarantieRow.controls.idformule?.value[0]?.sousCategorieList[0]?.idParamSCPackComplet,
                                "valeur": sousGarantieRow.value.formule
                              }
                            categoryOfGaranti.push(
                              {
                                "idCategoriePackComplet": sousGarantieRow.controls.idformule?.value[0]?.idParamPackComplet,
                                "valeur": withRemplissage ? null : sousGarantieRow.value.formule,
                                "sousCategorieList": sousCategorieList
                              }
                            )
                          } else {
                    //console.log(" cond41")

                            //input non saisie
                            if (sousGarantieRow.controls.idformule.value[0].descriptionvVal == "input" && !withRemplissage) {
                    //console.log(" cond42")

                              this.errorPackForm = true
                            }
                            //valeur ou non saisie
                            sousCategorieList = null
                            if (row.controls.idformule.value[0].sousCategorieList?.length != undefined && sousGarantieRow.idformule.value[0].sousCategorieList?.length != 0)
                    //console.log(" cond43")


                              sousGarantieRow = {
                                "idSousCategoriePackComplet": sousGarantieRow.controls.idformule?.value[0]?.sousCategorieList[0]?.idParamSCPackComplet,
                                "valeur": withRemplissage ? null : sousGarantieRow.controls.idformule.value[0].valeur
                              }
                            categoryOfGaranti.push(
                              {
                                "idCategoriePackComplet": sousGarantieRow.controls.idformule?.value[0]?.idParamPackComplet,
                                "valeur": withRemplissage ? null : sousGarantieRow.controls.idformule.value[0].valeur,
                                "sousCategorieList": sousCategorieList
                              }
                            )
                          }

                        }
                      } if (sousGarantieRow.controls.idfranchise.value.length != 0) {
                    //console.log(" cond44")

                        // list of value
                        if (sousGarantieRow.controls.idfranchise.value.length > 1) {
                    //console.log(" cond45")

                          sousCategorieList = null
                          if (sousGarantieRow.value.franchise.sousCategorieList?.length != undefined && row.value.franchise.sousCategorieList?.length != 0)
                    //console.log(" cond46")

                            sousCategorieList = {
                              "idSousCategoriePackComplet": sousGarantieRow.value.franchise.sousCategorieList[0]?.idParamSCPackComplet,
                              "valeur": sousGarantieRow.value.franchise.valeur
                            }
                          categoryOfGaranti.push(
                            {
                              "idCategoriePackComplet": sousGarantieRow.value.franchise.idParamPackComplet,
                              "valeur": sousGarantieRow.value.franchise.valeur,
                              "sousCategorieList": sousCategorieList
                            }
                          )

                        } else {
                    //console.log(" cond47")

                          if (sousGarantieRow.value.franchise != null) {
                            sousCategorieList = null
                    //console.log(" cond48")

                            if (sousGarantieRow.controls.idfranchise.value[0].sousCategorieList?.length != undefined && sousGarantieRow.controls.idfranchise.value[0].sousCategorieList?.length != 0)
                    //console.log(" cond49")

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
                    //console.log(" cond50")

                            //input non saisie
                            if (sousGarantieRow.controls.idfranchise.value[0].descriptionvVal == "input" && !withRemplissage) {
                    //console.log(" cond51")

                              this.errorPackForm = true
                            }
                            //valeur
                            sousCategorieList = null
                            if (sousGarantieRow.controls.idfranchise.value[0].sousCategorieList?.length != undefined && sousGarantieRow.controls.idfranchise.value[0].sousCategorieList?.length != 0)
                    //console.log(" cond52")

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
                    //console.log(" cond53")


                        if (sousGarantieRow.controls.idplafond.value.length > 1) {

                    //console.log(" cond54")

                          sousCategorieList = null
                          if (sousGarantieRow.value.plafond.sousCategorieList?.length != undefined && sousGarantieRow.value.plafond.sousCategorieList?.length != 0)
                    //console.log(" cond55")

                            sousCategorieList = {
                              "idSousCategoriePackComplet": sousGarantieRow.value.plafond.sousCategorieList[0]?.idParamSCPackComplet,
                              "valeur": sousGarantieRow.value.plafond.valeur
                            }
                          categoryOfGaranti.push(
                            {
                              "idCategoriePackComplet": sousGarantieRow.value.plafond.idParamPackComplet,
                              "valeur": sousGarantieRow.value.plafond.valeur,
                              "sousCategorieList": sousCategorieList
                            }
                          )

                        } else {

                    //console.log(" cond56")

                          if (sousGarantieRow.value.plafond != null) {
                    //console.log(" cond57")


                            sousCategorieList = null
                            if (sousGarantieRow.controls.idplafond.value[0].sousCategorieList?.length != undefined && sousGarantieRow.controls.idplafond.value[0].sousCategorieList?.length != 0)
                    //console.log(" cond58")

                              sousCategorieList = {
                                "idSousCategoriePackComplet": sousGarantieRow.controls.idplafond.value[0].sousCategorieList[0]?.idParamSCPackComplet,
                                "valeur": sousGarantieRow.value.plafond
                              }
                            categoryOfGaranti.push(
                              {
                                "idCategoriePackComplet": sousGarantieRow.controls.idplafond.value[0].idParamPackComplet,
                                "valeur": sousGarantieRow.value.plafond,
                                "sousCategorieList": sousCategorieList
                              }
                            )

                          } else {
                    //console.log(" cond59")


                            //input non saisie
                            if (sousGarantieRow.controls.idplafond.value[0].descriptionvVal == "input" && !withRemplissage) {
                    //console.log(" cond60")

                              this.errorPackForm = true

                            }
                            //valeur
                            sousCategorieList = null

                            if (sousGarantieRow.controls.idplafond.value[0].sousCategorieList?.length != undefined && sousGarantieRow.controls.idplafond.value[0].sousCategorieList?.length != 0) {
                    //console.log(" cond61")

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

                    //console.log(" cond62")

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
      if (!this.errorPackForm  ) {
        //console.log("555",this.devisGroupe[0].groupeList[0]?.risque)
        //console.log("666",packCompletOne)

        //[0].categorieList[1]
       if(this.codeProduit=='97'){
        packCompletOne.find((el:any)=>el.idPackComplet==1541).categorieList?.filter((item:any) =>
          item.idCategoriePackComplet == 2118 && item.valeur == "0"
      );
      //console.log("pckcmp", packCompletOne)

      //mimi

      const pack = packCompletOne.find((el: any) => el.idPackComplet === 1541);

// Check if the pack exists and then filter the categorieList
if (pack && this.codeProduit=='97') {
  pack.categorieList = pack.categorieList.filter((item: any) => {
    if(item.idCategoriePackComplet == 2118 )
    // Return items that do not match the conditions for removal
    return !(item.valeur === "0");
  });
}

// Display the updated packCompletOne
//console.log("le pack apres suppretion ",packCompletOne);

}



// this.devisGroupe[0].groupeList[0].risque.packCompletList = packCompletOne

        // this.devisGroupe[0].groupeList[0].risque.packCompletList = packCompletOne
        if(this.codeProduit=='97'){
        this.devisGroupe[0]?.groupeList?.map((array:any) => {
          array.risque.packCompletList = packCompletOne;
        });
      } else


        this.devisGroupe[0].groupeList[0].risque.packCompletList = packCompletOne
        this.devisGroupe[0].groupeList[0].risque.primeList = []
        this.devisGroupe[0].groupeList[0].risque.taxeList = []
      }


    }

    
    
    
    else {

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

          if (groupe.description == gp.group)
            groupe.groupeList.map((array: any) => {

              array.risque.packCompletList = packCompletOne
              array.risque.primeList = []
              array.risque.taxeList = []
            })
        })


        packCompletOne = []

      })

    }


    // this.devis.primeList = []
    // this.devis.taxeList = []

    if ((this.route.snapshot.paramMap.get('codeProduit') == "96" || this.route.snapshot.paramMap.get('codeProduit') == "95") && withRemplissage) {

      this.remplissageTarif()
      if (this.route.snapshot.paramMap.get('codeProduit') == "95")
        this.openDialogMRP();
    }

  }

  openDialogMRP() {
    this.indexSousGarantieMrp = 0
    if (this.indexGarantieMrp < this.garantieAll.length) {
      if (this.garantieAll[this.indexGarantieMrp].list && this.formPackGaranties.controls.find((g: any) => g.controls.idPackComplet.value == this.garantieAll[this.indexGarantieMrp].idPackComplet)?.controls.checked.value) {
        if (this.garantieAll[this.indexGarantieMrp].codeGarantie == "G53" && !this.formParamRisque.get("ActivitéProfessionnelle")?.value?.is_medical) {
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

  checkListSousGaranties(sousGarantie: any, formSousGarantie: any) {

    if (this.indexSousGarantieMrp < sousGarantie.length) {
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
      this.openDialogMRP()
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

        //console.log(error);

      }
    });
  }

  async submitDevis() {
  if(this.codeProduit=='97'){
      this.formReduction.get('idReduction')?.setValue(0);
          this.formReduction.get('idConvention')?.setValue(0);
          //console.log(" je rentre dans cettepartie ")
          this.returnedTarif.idReduction=0
          // opp retrait partie reduction

    }
    //console.log("dureeeeeeee",this.formInfosAssure)
    this.returnedTarif.duree=this.formInfosAssure.value.duree

    this.returnedTarif.auditUser = this.autditUser

    this.loaderDevis = true
    // const hmac = await this.cryptoService.generateHmac("XVxtWzI6T1RITUFORScYPHxBDww6dA9EUg==", this.returnedTarif);
    // const dataDevis = {
    //   stringJson:JSON.stringify(this.returnedTarif),
    //   // signature: hmac 
    // }
 

  
    const hmac = await this.cryptoService.generateHmac(this.tkn, this.returnedTarif);
    const stringifiedDevis3 = JSON.stringify(this.returnedTarif);
    const dataDevis3 = {
      stringJson:stringifiedDevis3,
      signature: hmac
    }


    this.devisService.createDevis(dataDevis3).subscribe({
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
        //console.log(error);

      }
    });





  }

  async generateCalcul() {

    if (this.codeProduit == 'T') {
      this.devis.nbrPages = this.nbrPages.value;
      // this.devis.checkedTVA=this.checkedTVA.value
      // Vous pouvez décommenter ou ajouter d'autres propriétés si nécessaire
      // this.devis.sousProduit = 11;
      // Test sur nbrPages ou autres opérations spécifiques
    }
    // if(this.formPackGaranties.valid){
    //if ((this.multiRisque && this.nmbVehicule.value > 10 && this.fileSuccess) || (this.multiRisque && this.nmbVehicule.value < 10) || !this.multiRisque) {
      this.objectDevis(false)
      console.log('je suis lobjet devis',this.devis,this.objectDevis)


      if (this.devis.tailleRisque !== 0 && this.devis.groupes.length > 0) {
        for (let j = 0; j < this.devis.groupes?.[0].groupeList?.[0]?.risque?.packCompletList?.length; j++) {
          let exo = this.devis.groupes?.[0].groupeList?.[0]?.risque?.packCompletList?.[j];
    
          for (let i = 0; i < this.devis.groupes?.[0]?.groupeList?.[0]?.risque?.paramList?.length; i++) {
            let element = this.devis.groupes?.[0]?.groupeList?.[0]?.risque?.paramList?.[i];
    
            this.garantiesNew.forEach((garantie: any) => {
              garantie.categorieList.forEach((code: any) => {
                if (code.code === 'C7') {
                  if (garantie.paramRisquePlafond) {
                    if (garantie.paramRisquePlafond.idParamRisque === element.idParam) {
                      exo.categorieList.forEach((d: any) => {
                        if (d.idCategoriePackComplet == code.idParamPackComplet) {
                          d.valeur = element.reponse.description;
                        }
                      });
                    }
                  }
                }
              });
            });
          }
        }
      }
    
      // Mise à jour de la liste des garanties si nécessaire
      const listElement = this.devis.list.find((el: any) => el.idListParamRisque == 1);
      if (listElement) {
        listElement.idGarantie = 87;
      } //addd

      if (!this.errorPackForm) {
        this.loaderTarif = true
        const hmac = await this.cryptoService.generateHmac(this.tkn, this.devis);
        const stringifiedDevis4 = JSON.stringify(this.devis);

        const dataDevis4 = {
          stringJson:stringifiedDevis4,
          signature: hmac
        }
        console.log('ghfghfjgfjgfjhgfjgfjgfjfg',this.devis ,dataDevis4)

        this.devisService.generateTarif(dataDevis4).subscribe({
          next: (data: any) => {
            this.errorHandler.error = false
            this.errorHandler.msg = ""
            this.returnedTarif = data
            this.basicTarif = data
            this.tarifReady = true
            this.loaderTarif = false
            this.saveDevis = true
            this.loaderDevis = false
            this.garantieNull = false;
            //console.log('this.garantieTab')
            //console.log(this.garantieTab)


            //console.log('donne tarif',data)
            // garantie: this.garantieAll.find((g: any) => g.idGarantie == idGarantie),
            const TEMP = data.groupes[0]?.groupeList[0]?.risque?.paramList.find(
              (E: any) => E.codeParam == "P152"
            );
        
            //console.log('nekini temp', TEMP);
             
            this.valAss= TEMP?.reponse?.description
            
            
            if ((this.valAss>=5000000000 && this.isBOUser==false)) {
      
              Swal.fire(
               "La valeur assurée dépasse 5 000 000 000 DA , vous ne pouvez pas continuer ",
               `error`
             )
             this.goBack();
             this.goBack();
       
           }
    
    
           
    
    
    
    
    
    /*
           
     */
    
    
    
    
    
    
    
            //console.log('this.garantieTab');
            //console.log(this.garantieTab);

            

            if(this.multiRisque)
            {
              const hasNullPrime = data.groupes.some((group: any) => {
                return group.groupeList.some((risque: any) => {
                    return risque.risque.packCompletList.some((garantie: any) => garantie.prime === 0);
                });
              });
              
              // if (hasNullPrime) {
              //   this.garantieNull = true
              //   Swal.fire(
              //       "Vous ne pouvez pas continuer. les primes des garanties ne peuvent pas être nul",
              //       '',
              //       'error'
              //   );
              // }


              if (hasNullPrime) {
 //console.log("je sus vamass",this.valAss)
                if ((this.valAss>=5000000000 && this.isBOUser==false)) {
      
                  Swal.fire(
                   "La valeur assurée dépasse 5 000 000 000 DA , vous ne pouvez pas continuer ",
                   `error`
                 )
                 this.goBack();
                 this.goBack();
           
               }else {
                this.garantieNull = true;
                Swal.fire(
                  "Vous ne pouvez pas continuer. Les primes des garanties ne peuvent pas être nulles.",
                  '',
                  'error'
                );}
              }
            }
            
            this.garantieTab.forEach((garantie: any) => {
              let garantieData = data.groupes[0].groupeList[0].risque.packCompletList.find((garantieData: any) => garantie.idPackComplet === garantieData.idPackComplet);

              //console.log("garantieData")
              //console.log(garantieData)

              // if (garantieData) {
              //   //console.log("garantieData.prime")
              //   if(garantieData.prime == 0)
              //   {
              //     this.garantieNull = true
              //     Swal.fire(
              //       "Vous ne pouvez pas continuer. les primes des garanties ne peuvent pas etre nul",
              //       '',
              //       'error'
              //     )
              //   }
              //   else
              //   {
              //     this.garantieNull = false
              //     garantie.prime = garantieData.prime;
              //   }

              // }



              if (garantieData) {
                //console.log("garantieData.prime");
                if (garantieData.prime == 0) {
    
                  if ((this.valAss>=5000000000 && this.isBOUser==false)) {
      
                    Swal.fire(
                     "La valeur assurée dépasse 5 000 000 000 DA , vous ne pouvez pas continuer ",
                     `error`
                   )
                   this.goBack();
                   this.goBack();
             
                 }else{
    
                  this.garantieNull = true;
                  Swal.fire(
                    "Vous ne pouvez pas continuer. Les primes des garanties ne peuvent pas être nulles.",
                    '',
                    'error'
                  );
                }
                } else {
                  garantie.prime = garantieData.prime;
                }
              }
              garantie.sousGarantieList?.data?.forEach((sousgarantie: any, idx: any) => {
                let sousGarantieData = data.groupes[0].groupeList[0].risque.packCompletList.find((sousgarantieData: any) => sousgarantie.idPackComplet === sousgarantieData.idPackComplet);

                if (sousGarantieData) {
                  sousgarantie.prime = sousGarantieData.prime;
                  if (sousGarantieData?.categorieList.length != 0) {
                    sousGarantieData?.categorieList.map((categorie: any) => {
                      let formule: any = sousgarantie.formule.find(
                        (cat: any) => cat.idParamPackComplet == categorie.idCategoriePackComplet)

                      let franchise: any = sousgarantie.franchise.find(
                        (cat: any) => cat.idParamPackComplet == categorie.idCategoriePackComplet)

                      let plafond: any = sousgarantie.plafond.find(
                        (cat: any) => cat.idParamPackComplet == categorie.idCategoriePackComplet)

                        let taux: any = sousgarantie.taux.find(
                          (cat: any) => cat.idParamPackComplet == categorie.idCategoriePackComplet
                        )
                        if (formule) formule.valeur = categorie.valeur;
                        if (franchise) franchise.valeur = categorie.valeur;
                        if (plafond) plafond.valeur = categorie.valeur;
                        if (taux) taux.valeur = categorie.valeur;

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
            if (this.multiRisque && !this.garantieNull)
              this.myStepper.next();

          },
          error: (error) => {
            this.loaderTarif = false
            this.handleError(error)

          }
        });
      }
      // }else{
      //   const invalid = [];
      //   const controls = this.formPackGaranties.controls;
      //   for (const name in controls) {
      //       if (controls[name].invalid) {
      //           invalid.push(name);
      //       }
      //   }

      // }
      if (!this.formPackGaranties.valid) {
        // this.formPackGaranties.controls[0].valueChanges.subscribe(() => { 

        // }
      }
    //}
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
  /*  downloadDevis(devis: any) {
  
  
  
  
  
      //get devis 
      //get paramDevis  
    
           this.devisService.getDevisById(devis.idDevis).subscribe({
            next: async(data: any) => {  
  
              await  this.devisService.getPackIdRisque(devis.idDevis, data.groupes[0].risques[0].idRisque).subscribe({
              next: (dataPack: any) => {      
            data.paramDevisList= dataPack.garantieList
            data.pack = dataPack.pack  
  
          
            this.devisService.generatePdf(data)
             // devis=data
            },
            error: (error: any) => {    
              //console.log(error);    
            }
          });
      },
      error: (error: any) => {    
        //console.log(error);    
      }
    });
      
    }
  */
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

        if (this.devisOutput.produit.codeProduit == "45F") {
          //Auto flotte
          //EXP call get pack/garanties risque by devis, groupe & id risque
          await this.devisService.getPackIdRisque(this.devisOutput.idDevis, idRisque).subscribe({
            next: async (dataPack: any) => {
              this.devisOutput.paramDevisList = dataPack.garantieList
              this.devisOutput.pack = dataPack.pack

              await this.devisService.outputDevisFlotte(this.devisOutput)
            },
            error: (error: any) => {
              //console.log(error);
            }
          });
        } else {
          //EXP call get pack/garanties risque by devis, groupe & id risque
          await this.devisService.getPackIdRisque(this.devisOutput.idDevis, idRisque).subscribe({
            next: async (dataPack: any) => {
              this.devisOutput.paramDevisList = dataPack.garantieList
              this.devisOutput.pack = dataPack.pack

              await this.devisService.generatePdf(this.devisOutput)
            },
            error: (error: any) => {
              //console.log(error);
            }
          });
        }




      },
      error: (error: any) => {
        //console.log(error);
      }
    });

  }

  // addRisqueToGroup(event: any, group: any, risque: any, index: any) {

  //   if (!risque.toGroup) {
  //     this.multiRisqueArray.filter((rs: any) => rs.NDImmatriculation == risque.NDImmatriculation)[0].toGroup = true
  //     this.multiRisqueArray.filter((rs: any) => rs.NDImmatriculation == risque.NDImmatriculation)[0].group = group

  //   } else {

  //   }

  // }
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

  //version de test 
  // convertToContract() {
  //   this.router.navigateByUrl("creation-contrat/dommage/" + this.route.snapshot.paramMap.get('codeProduit') + '/' + this.route.snapshot.paramMap.get('produit') + '/' + this.idDevis);


  // }
  convertToContract() {
    this.router.navigateByUrl("creation-contrat/" + this.route.snapshot.paramMap.get('codeProduit') + '/' + this.route.snapshot.paramMap.get('produit') + '/' + this.idDevis);


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

  
  openDialogList(idGarantie: any) {

    let dialogRef = this.dialog.open(ListRisqueDialogComponent, {
      width: '60%',
      data: {
        displayedColumnsListParamRisque: this.displayedColumnsListParamRisque,
        idListParamList: this.idListParamList,
        listParamRisque: this.listParamRisque,
        formListParamRisque: this.formListParamRisque,
        garantie: this.garantieAll.find((g: any) => g.idGarantie == idGarantie),
        dataSourceListParamRisque: this.dataSourceListParamRisque,
        numberEffective: this.formParamRisque.get("Effectif").value

      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {

      if (result) {
        const data = JSON.parse(JSON.stringify(result.data));
        this.dataSourceListParamRisque = data
        const ids = this.idsListParams;
        const codes = this.codesListParams;
        this.displayedColumnsListParamRisque.splice(-1, 1);

        this.paramList = data.filter((value: any) => { return this.displayedColumnsListParamRisque.every((cle: any) => value.hasOwnProperty(cle)) }).map((item: { [x: string]: any; }) => {
          let result = [];
          let keys = Object.keys(item);
          let idreponse = null
          let description = "debase"

          for (let i = 0; i < keys.length; i++) {
            if (this.listParamRisque.find((p: any) => p.formName == keys[i])?.typeChamp?.description == 'Liste of values') {
              idreponse = item[keys[i]].idParam
              description = item[keys[i]].code

            } else {

              idreponse = null
              if (this.listParamRisque.find((p: any) => p.formName == keys[i])?.typeChamp?.description == 'From Table') {

                description = item[keys[i]].code

              } else if (this.listParamRisque.find((p: any) => p.formName == keys[i])?.typeChamp?.description != 'date') {

                if (this.listParamRisque.find((p: any) => p.formName == keys[i])?.idParamRisque == 34)
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

            result.push({
              idParam: ids[i],
              codeParam: codes[i],
              reponse: {
                "idReponse": idreponse,
                "description": description
              }
            });
          }
          //console.log("result",result);
          //console.log(result);
          return result;
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
      
        let devisExist = this.devis.list.findIndex((l: any) => l.idListParamRisque == list.idListParamRisque)
        let description = this.garantieAll.find((g: any) => g.idGarantie == idGarantie)?.codeGarantie == "G53" ? "Effectifs" : "Matériel informatique"
        if (devisExist != -1) {
          this.devis.list[devisExist] = list
          this.dataSourceListOfListes.data[devisExist] = { idListParamRisque: this.idListParamList, idGarantie: idGarantie, description: description }
        }
        else {
          this.devis.list.push(list);
          const newData = [...this.dataSourceListOfListes.data, { idListParamRisque: this.idListParamList, idGarantie: idGarantie, description: description }];
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
          this.checkListSousGaranties(this.garantieAll[this.indexGarantieMrp].sousGarantieList, this.formPackGaranties.controls.find((g: any) => g.controls.idPackComplet.value == this.garantieAll[this.indexGarantieMrp].idPackComplet)?.controls?.souGarantieArray)
        }
      }
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
  // submitNumberVehicule() {
  //   this.devis.tailleRisque = this.nmbVehicule.value;
  //   //dev 
  //   let hasRights = sessionStorage.getItem('roles')?.includes("DA") || sessionStorage.getItem('roles')?.includes("CDC")
  //   if (this.nmbVehicule.value > 20 && hasRights) {
  //     Swal.fire(
  //       `Vous n’avez pas le privilège pour faire ce devis veuillez voir avec le BO`,
  //       ``,
  //       `error`,

  //     )
  //     this.risqueStep = 0;
  //   } 
  //   // else if (this.nmbVehicule.value > 10)
  //   //   this.risqueStep = 2
  //   // else
  //   //   this.risqueStep = 1

  //   this.withFile=true

  //   this.devis.file = null;

  // }


  submitNumberVehicule() {
   
 
    this.devis.tailleRisque = this.nmbVehicule.value;
    //console.log('555555555555555',  this.devis.tailleRisque)
    //console.log('eee',this.nmbVehicule.value)
    // Retrieve roles from session storage
    const roles = sessionStorage.getItem('roles') || '';
    const hasRights = roles.includes("DA") || roles.includes("CDC");
    //console.log("rights:", hasRights)

    // if (this.nmbVehicule.value > 50 && hasRights) {
    // //console.log('ma3endich rights')
    //   // Display the error alert and handle reset after the alert is closed
    //   Swal.fire(
    //     'Vous n’avez pas le privilège pour faire ce devis veuillez voir avec le BO',
    //     '',
    //     'error'
    //   ).then(() => {
    //     this.risqueStep = 0;
    //     if (this.myStepper) {
    //       this.myStepper.previous();
    //     } else {
    //       console.warn('Stepper instance is not available.');
    //     }
    //   });

    //   // Prevent further execution of the function
    //   return;
    // }
    //console.log('3endiiiiiii')

    // Continue with the rest of the logic if the condition is not met
    this.withFile = true;
    this.devis.file = null;

  }
  // checkVehiculeNumber() {
  //   if (this.nmbVehicule.value !== this.multiRisqueArray.length) {
  //     Swal.fire(
  //       " le nombre de véhicules ajoutés ne correspond pas au nombre de véhicules indiqué",
  //       `error`
  //     )
  //     // this._snackBar.open(" le nombre de véhicules ajoutés ne correspond pas au nombre de véhicules indiqué", 'fermer', {
  //     //   horizontalPosition: "end",
  //     //   panelClass: ['danger-snackbar']
  //     // })
  //   } else
  //     this.myStepper.next();
  // }

  checkVehiculeNumber() {

    const roles = sessionStorage.getItem('roles') || '';
    const hasRights = roles.includes("DA") || roles.includes("CDC");
    
    console.log("aaaa nmbVehicule",this.nmbVehicule)
    console.log("bbbbb multiRisqueArray",this.multiRisqueArray)
  //  



//console.log('dfddddd',this.nmbVehicule.value !== this.multiRisqueArray.length , this.selectedSousProduit!='CTH', this.codeProduit=='97', this.isBOUser==true)






    if (this.nmbVehicule.value !== this.multiRisqueArray.length && this.codeProduit!='T') {
     
        Swal.fire(
        " le nombre de véhicules ajoutés ne correspond pas au nombre de véhicules indiqué",
        `error`
      )
      this.goBack();
   
    } else 
    
      this.myStepper.next();

}

onSousProduitSelected(idSousProduits: any | null) {
  this.selectedSousProduit = idSousProduits; 
  this.getTypePolice(this.selectedSousProduit)
  //console.log('Le sous-produit sélectionné est', this.selectedSousProduit);
  const sousProduitSelectionne = this.sousProduits.find((e: { code: string }) => e.code ==  this.selectedSousProduit);
  
  this.IDSOUSPROD = sousProduitSelectionne.idSousProduit;
console.log(' tab par cate', this.formParamRisque)

this.getAllParamRisque()
}


onTypePoliceSelecteted(idTypePolice: any | null) {
  this.selectedTypePolice = idTypePolice; 
  console.log('voila type police',this.selectedTypePolice)
if(this.selectedTypePolice.code=='TP05'){
  console.log('this.forminforssure avant ',this.formInfosAssure)
  this.formInfosAssure.get("chiffreA").enable()
 this.formInfosAssure.get("chiffreA")?.setValidators(Validators.required);
this.formInfosAssure.get("chiffreA")?.updateValueAndValidity();
  console.log('this.forminforssure apres ',this.formInfosAssure)

}else{
  this.formInfosAssure.get("chiffreA").disable()
   this.formInfosAssure.get("chiffreA").clearValidators()
this.formInfosAssure.get("chiffreA").updateValueAndValidity();
}
  
  console.log("this.forminfoassure",this.formInfosAssure) 
   



  this.getdureeTransport(this.selectedTypePolice)
  



}

isReadonly(): boolean {
  

  const result = !(
      (this.TOTALE > 5000000000 && this.isBOUser) ||
      (this.selectedSousProduit=="CTH" && this.isBOUser)
  );

  //console.log('isReadonly result:', result);

  return result;
} 
 
  onInput(value: any, codeParam: any) {
    let totale: any;

 
  }
  deleteRisque(idRisque: any) {

    this.multiRisqueArray = this.multiRisqueArray.filter((risque: any) => risque.risqueNum != idRisque)

    this.dataSourceRisque.data = this.multiRisqueArray
    let descriptionGroup: any
    this.devisGroupe.map((groupe: any) => {
      groupe.groupeList = groupe.groupeList.filter((risque: any) => {
        if (risque.numRisque == idRisque) {
          descriptionGroup = groupe.description
        }
        return risque.numRisque != idRisque
      })

    })

    this.groupArray = this.groupArray.filter((groupe: any) => groupe != descriptionGroup)
    this.devisGroupe = this.devisGroupe.filter((groupe: any) => {
      return groupe.description != descriptionGroup
    })
    this.dataSourceGroupePack.data = this.dataSourceGroupePack.data.filter((groupPack: any) => groupPack.group != descriptionGroup)

    this.devis.groupes = this.devisGroupe

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

        if (erroFile) {
          this.fileInput.nativeElement.value = null;
          this.fileSuccess = false
        }


        if (this.fileControle.length == this.nmbVehicule.value) {
          this.devis.file = base64
          this.fileSuccess = true
        } else {
          this.fileSuccess = false
          this.fileInput.nativeElement.value = null;
          Swal.fire(
            `Le nombre de lignes ne correspond pas au nombre de risque indiqué, nombre de ligne= ` + this.fileControle.length + `, nombre indiqué= ` + this.nmbVehicule.value + `. veuillez resaisir le fichier ou modifié le nombre de risque`,
            ``,
            `error`,

          )
        }
        if (this.fileControle.length > 20 && (sessionStorage.getItem('roles')?.includes("DA") || sessionStorage.getItem('roles')?.includes("CDC"))) {
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

    formWay(type:string){
      console.log("thisdevus",this.devis)
    switch (type) {
      case "form":{
        this.risqueStep=1;
        this.withFile=false 
        this.dataSourceRisque = new MatTableDataSource([])
        this.selectedFile=null;
        this.controleDevis=[]
        this.devis.groupes.groupeList=[]
      }
        break;
        case "file":{
        this.risqueStep=2;
        this.withFile=false
        this.selectedFile=null;
        this.dataSourceRisque = new MatTableDataSource([])
        this.controleDevis=[]
        this.devis.groupes.groupeList=[]

        }
        break;
      default:
        break;
    }
  }

   


}
// function customParam(control: AbstractControl,bloquant:boolean): { [key: string]: boolean } | null {

//       return { 'bloquant': bloquant };

// }                    

function customParam(bloquant: boolean, message: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // return { 'bloquant': bloquant,'msg': message };
    return {
      "bloquant": bloquant,
      "msg": message
    }

  };
}