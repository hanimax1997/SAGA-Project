// import { Component, Inject, OnInit, ViewChild } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
// import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { MatTableDataSource } from '@angular/material/table';
// import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// import { Contrat, contratJson } from 'src/app/core/models/contrat';
// import { ParamRisqueProduit } from 'src/app/core/models/param-risque-produit';
// import { PersonneContrat } from 'src/app/core/models/personneContrat';
// import { AgencesService } from 'src/app/core/services/agences.service';
// import { ContratService } from 'src/app/core/services/contrat.service';
// import { DevisService } from 'src/app/core/services/devis.service';
// import { DureeService } from 'src/app/core/services/duree.service';
// import { GenericService } from 'src/app/core/services/generic.service';
// import { PackService } from 'src/app/core/services/pack.service';
// import { ParamRisqueService } from 'src/app/core/services/param-risque.service';
// import { PersonneService } from 'src/app/core/services/personne.service';
// import { ProduitService } from 'src/app/core/services/produit.service';
// import { VehiculeService } from 'src/app/core/services/vehicule.service';
// import { ReductionService } from 'src/app/core/services/reduction.service';
// import Swal from 'sweetalert2'
// import { SearchPersonneComponent } from '../search-personne/search-personne.component';
// import { SearchVehiculeComponent } from '../search-vehicule/search-vehicule.component';
// import { Patterns } from '../../../core/validiators/patterns'
// import { MatStepper } from '@angular/material/stepper';
// import * as moment from 'moment';
// import { animate, state, style, transition, trigger } from '@angular/animations';
// import { DialogRisqueComponent } from '../../gestion-devis/dialog-risque/dialog-risque.component';
// import { ConventionService } from 'src/app/core/services/convention.service';
// import { ReductionFiltreJson } from 'src/app/core/models/reduction';
// import { MatPaginator } from '@angular/material/paginator';
import { CryptoService } from 'src/app/core/services/crypto.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Contrat, contratJson } from 'src/app/core/models/contrat';
import { ParamRisqueProduit } from 'src/app/core/models/param-risque-produit';
import { PersonneContrat } from 'src/app/core/models/personneContrat';
import { AgencesService } from 'src/app/core/services/agences.service';
import { ContratService } from 'src/app/core/services/contrat.service';
import { DevisService } from 'src/app/core/services/devis.service';
import { DureeService } from 'src/app/core/services/duree.service';
import { GenericService } from 'src/app/core/services/generic.service';
import { PackService } from 'src/app/core/services/pack.service';
import { ParamRisqueService } from 'src/app/core/services/param-risque.service';
import { PersonneService } from 'src/app/core/services/personne.service';
import { ProduitService } from 'src/app/core/services/produit.service';
import { VehiculeService } from 'src/app/core/services/vehicule.service';
import { ReductionService } from 'src/app/core/services/reduction.service';
import Swal from 'sweetalert2'
import { SearchPersonneComponent } from '../search-personne/search-personne.component';
import { SearchVehiculeComponent } from '../search-vehicule/search-vehicule.component';
import { Patterns } from '../../../core/validiators/patterns'
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DialogRisqueComponent } from '../../gestion-devis/dialog-risque/dialog-risque.component';
import { ConventionService } from 'src/app/core/services/convention.service';
import { ReductionFiltreJson } from 'src/app/core/models/reduction';
import { MatPaginator } from '@angular/material/paginator';
import{GestionContratModule} from '../../gestion-contrat/gestion-contrat.module'
import { ThisReceiver } from '@angular/compiler';


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
@Component({
  selector: 'app-creation-contrat',
  templateUrl: './creation-contrat.component.html',
  styleUrls: ['./creation-contrat.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreationContratComponent implements OnInit {
  @ViewChild('stepper') private myStepper: MatStepper;
  linesOfBusiness: any[] = []; // Initialiser un tableau vide pour les lignes de business
  lineOfBusinessList: any[] = [];  // Liste des lignes de métier
  selectedLineOfBusiness: any;  // Valeur sélectionnée


  secteurActiviteList: any[] = [];

  idDevis: any;
  typeClientSous:any;
  devis: any
  devisAccess: any;
  personne: any;
  vehicule: any;
  contrat: any = {};
  isSouscripteur: boolean = false;
  isAssure: boolean = false;
  isConducteur: boolean = false;
  isConducteurAssure: boolean = false;
  valider: boolean = false;
  vehiculeExist: boolean = false;
  now: any;
  month = new Date();
  PrimeTotale = 0;
  PrimeNette = 0;
  agences: any = [];
  produits: any = [];
  produitInfo: any
  durees: any = [];
  wilayas: any = [];
  communes_sous: any = [];
  communes: any = []
  communes_assure: any = [];
  communes_cond: any = [];
  genres: any = [];
  situations: any = [];
  professions: any = [];
  typesVehicule: any = [];
  usages: any = [];
  energies: any = [];
  packs: any = [];
  garanties: any;
  informationsPack: any = [];
  marques: any = [];
  modeles: any = [];
  conventions: any = [];
  reductions: any = [];
  categories: any = ['A', 'B', 'C', 'D', 'E', 'F'];
  idPays: any
  dataSourcePack = new MatTableDataSource();
  displayedColumnsPack: string[] = ['description', 'plafond', 'franchise', 'formule', 'prime', 'sousGaranties'];
  DisplayedColumnsSousGarantie: string[] = ['description', 'plafond', 'franchise', 'formule', 'prime', 'sousGaranties'];
  idProduit: any
  formReduction: FormGroup | any;
  formFilter: FormGroup | any;
  formCreation: FormGroup | any;
  formCreationContrat: FormGroup | any;
  formCreationSouscripteur: FormGroup | any;
  formCreationAssure: FormGroup | any;
  formCreationConducteur: FormGroup | any;
  formCreationRisque: FormGroup | any;
  paraRisqueProduit: any = [];
  paraRisqueProduitCategory: any = [];
  marqueReduction: any = []
  renderGlobal = false
  franchiseExist = false
  plafondExist = false
  formuleExist = false
  sousFranchiseExist = false
  sousFormuleExist = false
  sousPlafondExist = false
  rechercheAssure = false
  rechercheSouscripteur = false
  rechercheConducteur = false
  multiRisque = false
  paramRisqueDevis: any = []
  devisReady = false
  groupPack: any = [];
  contratGroupe: any = []
  roles: any;
  code: any;
  lineOfBusiness= new FormControl()// test
  // typeClient=new FormControl();
  // typeClients: any[] = [];

  SecteurActivite: any;
  occupationList: any[] = [];
  // Occupation: any;
  occupation: any;
  // typeClient: any;
  PMflotte: any;
  isBOUser:boolean=false;
  tkn:string = JSON.parse(sessionStorage.getItem("access_token")||'')?.access_token

  // constructor(private conventionService: ConventionService, private reductionService: ReductionService, 
  //   private router: Router, private contratService: ContratService, 
  //   private packService: PackService, public dialog: MatDialog, private paramRisqueService: ParamRisqueService, 
  //   private genericService: GenericService, private dureeService: DureeService, private produitService: ProduitService, 
  //   private agencesService: AgencesService, private vehiculeService: VehiculeService, private personneService: PersonneService, 
  //   private devisService: DevisService, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    constructor(private cryptoService: CryptoService, private conventionService: ConventionService, private reductionService: ReductionService, private router: Router, private contratService:
       ContratService, private packService: PackService, public dialog: MatDialog, private paramRisqueService: ParamRisqueService, private genericService:
        GenericService, private dureeService: DureeService, private produitService: ProduitService, private agencesService: AgencesService, private vehiculeService: 
        VehiculeService, private personneService: PersonneService, private devisService: DevisService, private route: ActivatedRoute, private formBuilder: FormBuilder) {

      // window.onbeforeunload = (e) => {
      //   this.changeAccess();
      // };
  

    // window.onbeforeunload = (e) => {
    //   this.changeAccess();
    // };
    // router.events.subscribe((val) => {
    //   this.changeAccess();
    // });
  }
  typeClients: any[] = []
  typeClient: any;
  sousGarantieTab: any = []
  sousGarantieExist = false
  expandedElement: any
  codeProduit: any
  filterReduction = ReductionFiltreJson

  ngOnInit(): void {


    const roles = sessionStorage.getItem('roles') || '';
    this.isBOUser = roles.includes("BO");
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')
    //now
    if (sessionStorage.getItem("roles")?.includes("CDC") || sessionStorage.getItem("roles")?.includes("DA")) {

      this.now = new Date()
      this.month.setMonth(this.now.getMonth() + 1);
    }

    else {

      if (this.codeProduit != '45F') {
        this.now = new Date()
        this.month.setMonth(this.now.getMonth() + 1);
      } else
        this.now = null
    }


    this.getProductId();
    // if (this.route.snapshot.paramMap.get('codeProduit') != "45A")
    //   this.router.navigate(["/"])
    this.idDevis = this.route.snapshot.paramMap.get('idDevis');
    this.getDevisInfo();
    this.getAllConventions();
    // this.checkAccess();
    this.getAgence();
    this.getProduit();
    this.getDuree();
    this.getGenre();
    this.getSituation();
    this.getProfession();
    this.getRoles()
    this.getTypeVehicule();
    this.getUsage();
    this.getEnergie();
    this.getAllPack();
    this.getMarque();
    this.getIdPays("DZA");
    this.getCommercialLineValues();
    this.getTypeClient();



  }
  
getTypeClient() {

  this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C24").idCategorie).subscribe({
    next: (data: any) => {

      this.typeClients = data
      if (this.multiRisque)
        this.PMflotte = this.typeClients.find((type: any) => type.code === "PM");
    },
    error: (error) => {

      //////////console.log(error);

    }
  });
}

changeTypeClient(value: any) {
  this.typeClient = value.description;
  if(this.codeProduit=='97'){
    this.typeClientSous=this.typeClient
  } // Récupère la description du type client
  const form = this.formCreationSouscripteur;

  if (this.typeClient === "personne morale") {
    // alert("Personne morale sélectionnée");

    // Désactiver les champs nom et prénom
    form.get("nom")?.clearValidators();
    form.get("nom")?.disable();
    form.get("prenom")?.clearValidators();
    form.get("prenom")?.disable();

    form.get("dateNaissance")?.clearValidators();
    form.get("dateNaissance")?.disable();
    // Activer et rendre obligatoire le champ raison sociale
    form.get("raisonSocial")?.setValidators([Validators.required, Validators.maxLength(40)]);
    form.get("raisonSocial")?.enable();

     // Activer et rendre obligatoire le champ raison sociale
     form.get("telephone")?.setValidators([Validators.required, Validators.maxLength(50)]);
     form.get("telephone")?.enable();
    //  form.get("rib")?.setValidators([Validators.required, Validators.maxLength(50)]);
     form.get("rib")?.enable();
     form.get("adresse")?.setValidators([Validators.required, Validators.maxLength(60)]);
     form.get("adresse")?.enable();
     form.get("wilaya")?.setValidators([Validators.required, Validators.maxLength(50)]);
     form.get("wilaya")?.enable();
     form.get("commune")?.setValidators([Validators.required, Validators.maxLength(50)]);
     form.get("commune")?.enable();
    // Rendre le champ email obligatoire
    form.get("email")?.setValidators([Validators.required, Validators.pattern(Patterns.email)]);
    form.get("email")?.enable();
    form.get("nif")?.enable();
  } else {
    // Activer et rendre obligatoires les champs nom et prénom
    form.get("nom")?.setValidators([Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]);
    form.get("nom")?.enable();
    form.get("prenom")?.setValidators([Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]);
    form.get("prenom")?.enable();

    form.get("dateNaissance")?.setValidators([Validators.required, ageValidator]);
    form.get("dateNaissance")?.enable();

    // Désactiver le champ raison sociale
    form.get("raisonSocial")?.clearValidators();
    form.get("raisonSocial")?.disable();

    // Rendre le champ email optionnel
    form.get("email")?.setValidators([Validators.pattern(Patterns.email)]);
    form.get("email")?.enable();
  }

  // Appliquer les changements pour la validation
  form.get("nom")?.updateValueAndValidity();
  form.get("prenom")?.updateValueAndValidity();
  form.get("dateNaissance")?.updateValueAndValidity();
  form.get("raisonSocial")?.updateValueAndValidity();
  form.get("email")?.updateValueAndValidity();
}

getLB() {
  this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "CLOB")
  .idCategorie).subscribe({
    next: (data: any) => {
      this.lineOfBusinessList = data
      //////////console.log('111',data)
    },
    error: (error) => {
      //////////console.log(error);
    }
  });
}

getActivite() {
  // this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "CSEC").idCategorie).subscribe({
  //   next: (data: any) => {
  //     this.secteurActiviteList = data
  //     //////////console.log('ACTIVITE',data)
  //   },
  //   error: (error) => {
  //     //////////console.log(error);
  //   }

  this.contratService.getByLien(this.selectedLineOfBusiness).subscribe({
    next: (data: any) => {
      this.secteurActiviteList = data
      //////////console.log('ACTIVITE',data)
    },
    error: (error) => {
      //////////console.log(error);
    }



  });
}

getOccu() {
  // blem iici
  // this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "COCC")
  // .idCategorie).subscribe({
  //   next: (data: any) => {
  //     this.occupationList = data
  //     //////////console.log('OCCCCUUPPAAATON',data)
  //   },
  //   error: (error) => {
  //     //////////console.log(error);
  //   }
  // });
  this.contratService.getByLien(this.SecteurActivite).subscribe({
    next: (data: any) => {
      this.occupationList = data
      //////////console.log('occupation',data)
    },
    error: (error) => {
      //////////console.log(error);
    }



  });
}


// getNace() {
//   this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C182")
//   .idCategorie).subscribe({
//     next: (data: any) => {
//       this.NACEList = data
//       //////////console.log('NACE',data)
//     },
//     error: (error) => {
//       //////////console.log(error);
//     }
//   });
// }



getCommercialLineValues(){
  this.getLB();
  // this.getNace();
  // this.getOccu();
  // this.getActivite();



  
  
  }



  
onLineOfBusinessSelected(selectedValue: any): void {
//////////console.log('Ligne de métier sélectionnée:', selectedValue);
this.selectedLineOfBusiness = selectedValue;
this.getActivite()
}

onSecteurActiviteSelected(selectedValue: any): void {
//////////console.log('le secteur dactivite sélectionnée:', selectedValue);
this.SecteurActivite = selectedValue;
this.getOccu() 
}



onOccupationSelected(selectedValue: any): void {
//////////console.log('loccupation sélectionnée:', selectedValue);
this.occupation = selectedValue;
}

// onNACESelected(selectedValue: any): void {
//   //////////console.log('NACE sélectionnée:', selectedValue);
//   this.naceCode = selectedValue;
// }



  getAllConventions() {
    this.conventionService.getAllConventions().subscribe({
      next: (data: any) => {
        this.conventions = data
      },
      error: (error) => {
        //////////console.log(error);
      }
    });
  }

  getReductionByConvention(idConvention: any) {

    if (idConvention != 'aucuneConvention') {

      this.reductionService.getReductionByConvention(idConvention).subscribe({
        next: (data: any) => {
          if (data.length != 0)
            this.reductions = data.filter((reduc: any) => reduc.produit == JSON.parse(sessionStorage.getItem('products') || '{}').find((parametre: any) => parametre.codeProduit == this.route.snapshot.paramMap.get('codeProduit')).description)
        },
        error: (error) => {

          //////////console.log(error);

        }
      });
    } else {
      this.getAllReductions()
    }

  }

  getAllReductions() {
    this.filterReduction.typeReduction = 262
    this.filterReduction.produit = JSON.parse(sessionStorage.getItem('products') || '{}').find((parametre: any) => parametre.codeProduit == this.route.snapshot.paramMap.get('codeProduit'))
    this.reductionService.reductionFiltre(this.filterReduction).subscribe({
      next: (data: any) => {
        this.reductions = data
      },
      error: (error) => {

        //////////console.log(error);

      }
    });
  }

  getDevisInfo() {


    this.devisService.getDevisById(this.idDevis).subscribe((devis: any) => {
      if (devis.produit.codeProduit != this.route.snapshot.paramMap.get('codeProduit')) {
        this.router.navigate(['consultation/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + this.route.snapshot.paramMap.get('produit')]);

      }
      this.devis = devis
      this.typeClient = devis?.typeClient?.description;
      this.typeClientSous= this.codeProduit == '97' ? this.typeClient : 'personne physique'
      // let list = this.devis.paramsRisqueDevisList.reduce((x: any, y: any) => {

      //   ((x[y.idListParamRisque.idListParamRisque] = x[y.idListParamRisque.idListParamRisque] || []) && (x[y.paramGrp] = x[y.paramGrp] || [])).push(y);

      //   return x;

      // }, {});
      //////////console.log("codeProduit", this.codeProduit);
      if (this.devis.produit.codeProduit == '95') {

        var result0 = this.devis.paramsRisqueDevisList.reduce((hash: any, obj: any) => {
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
            l.forEach((element: any) => {
              param.paramListsValues.push({
                idParam: element.risque.idParamRisque,
                reponse: element.response
              })
            });
            param.prime = this.devis.listPrimes?.find((prime: any) => prime.idListParamRisque == l[0].idListParamRisque.idListParamRisque && prime.paramGrp == l[0].paramGrp)?.prime
            liste.paramList.push(param)

          })
          list2.push(liste);
        })

        this.contrat.list = list2
      }
      if (this.devis.produit.codeProduit == '45L' && this.devis?.groupes.length == 0) {
        this.initForm();
      }
      else {
        this.devisService.getParamDevisByIdRisque(this.idDevis, this.devis?.groupes[0]?.idGroupe, this.devis?.groupes[0]?.risques[0]?.idRisque).subscribe({
          next: async (data: any) => {
            this.devisReady = true
            this.paramRisqueDevis = data

            await this.initForm();
          },
          error: (error) => {

            //////////console.log(error);

          }
        });

      }
      if (this.devis.reduction != null)
        this.getReduction(this.devis.reduction.idReduction)
      if (this.devis.statue.code != 'S03') {
        this.router.navigate(['consultation-police/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + this.route.snapshot.paramMap.get('produit')]);
      }
    })
  }
  checkAccess() {
    this.devisService.getAccessByDevis(this.idDevis).subscribe({
      next: (data: any) => {
        this.devisAccess = data;
        if (data?.accessContrat) {
          let devisAccess = {
            idDevisAccess: data?.idDevisAccess,
            devis: data?.devis,
            accessContrat: 0,
            accessAvenant: 1
          }

          this.devisService.updateAccessDevis(devisAccess).subscribe({
            next: (data: any) => { },
            error: (error) => {

              //////////console.log(error);

            }
          });
        }
        else {
          Swal.fire({
            title: "Ce devis est bloqué par un autre utilisateur, veuillez réessayer plus tard",
            icon: 'warning',
            allowOutsideClick: false,
            confirmButtonText: `Ok`,
            width: 400
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['consultation/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + this.route.snapshot.paramMap.get('produit')]);

            }
          })
        }
      },
      error: (error) => {

        //////////console.log(error);

      }
    });
  }

  getProductId() {

    this.idProduit = JSON.parse(sessionStorage.getItem('products') || '{}').find((parametre: any) => parametre.codeProduit == this.codeProduit).idProduit

    this.getInfoProduit()
  }
  getInfoProduit() {
    this.genericService.getPorduitById(this.idProduit).subscribe({
      next: (data: any) => {
        this.renderGlobal = true
        this.produitInfo = data

        this.multiRisque = data.param_Produit_Reponses.filter((element: any) => element.idParamProduit.libelle == "multirisque")[0].reponse.description == "Oui" ? true : false

        //    this.multiRisque = data.param_Produit_Reponses.filter((element: any) => element.idParamProduit.libelle == "multirisque")[0].reponse.description == "Oui" ? true : false
      },
      error: (error) => {

        //////////console.log(error);

      }
    });
  }
  getReduction(idReduction: any) {

    this.reductionService.getReductionById(idReduction).subscribe({
      next: (data: any) => {
        this.marqueReduction = (data.paramList.filter((risque: any) => risque.idParam.codeParam == 'P25'))[0].idParam.reponseList

      },
      error: (error) => {
        //////////console.log(error);
      }
    });
  }
  getAgence() {
    this.agencesService.getAllAgence().subscribe({
      next: (data: any) => {
        this.agences = data
      },
      error: (error) => {
        //////////console.log(error);
      }
    });
  }

  getProduit() {
    this.produitService.getAllProduits().subscribe({
      next: (data: any) => {
        this.produits = data
      },
      error: (error) => {
        //////////console.log(error);
      }
    });
  }

  getDuree() {
    this.dureeService.getAllDuree().subscribe({
      next: (data: any) => {
        this.durees = data
      },
      error: (error) => {
        //////////console.log(error);
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

        //////////console.log(error);

      }
    });
  }
  getWilaya() {
    this.genericService.getAllWilayas(this.idPays).subscribe({
      next: (data: any) => {
        this.wilayas = data
      },
      error: (error) => {
        //////////console.log(error);
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
            this.communes = data

            break;
        }
      },
      error: (error) => {
        //////////console.log(error);
      }
    });
  }

  getGenre() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C6").idCategorie).subscribe({
      next: (data: any) => {
        this.genres = data
      },
      error: (error) => {
        //////////console.log(error);
      }
    });
  }

  getSituation() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C1").idCategorie).subscribe({
      next: (data: any) => {
        this.situations = data
      },
      error: (error) => {
        //////////console.log(error);
      }
    });
  }

  getProfession() {
    this.genericService.getProfession().subscribe({
      next: (data: any) => {
        this.professions = data
      },
      error: (error) => {
        //////////console.log(error);
      }
    });
  }

  getTypeVehicule() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C18").idCategorie).subscribe({
      next: (data: any) => {
        this.typesVehicule = data
      },
      error: (error) => {
        //////////console.log(error);
      }
    });
  }
  getRoles() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C33").idCategorie).subscribe({
      next: (data: any) => {
        this.roles = data
      },
      error: (error) => {
        //////////console.log(error);
      }
    });
  }
  getUsage() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C19").idCategorie).subscribe({
      next: (data: any) => {
        this.usages = data
      },
      error: (error) => {
        //////////console.log(error);
      }
    });
  }

  getEnergie() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C31").idCategorie).subscribe({
      next: (data: any) => {
        this.energies = data
      },
      error: (error) => {
        //////////console.log(error);
      }
    });
  }

  getAllPack() {
    this.packService.getAllPack().subscribe({
      next: (data: any) => {
        data.map((pack: any) => {
          this.packs.push(pack)
        })
      },
      error: (error) => {
        //////////console.log(error);
      }
    });
  }

  getMarque() {
    this.vehiculeService.getAllMarque().subscribe({
      next: (data: any) => {
        this.marques = data
      },
      error: (error) => {
        //////////console.log(error);
      }
    });
  }

  getModeleByMarque(marque: any) {


    if (this.marqueReduction.length !== 0) {
      if (this.marqueReduction.some((marqueDevis: any) => marqueDevis.idParam === Number(marque))) {
        this.vehiculeService.getModelByMarque(marque).subscribe({
          next: (data: any) => {
            this.modeles = data
          },
          error: (error) => {
            //////////console.log(error);
          }
        });
      } else {
        Swal.fire(
          `La marque que vous avez choisie ne correspond pas à celle de la réduction dont vous bénéficiez,
        Veuillez choisir la même marque ou refaire votre devis`,
          '',
          'warning'
        )
      }
    } else {
      this.vehiculeService.getModelByMarque(marque).subscribe({
        next: (data: any) => {
          this.modeles = data
        },
        error: (error) => {
          //////////console.log(error);
        }
      });
    }

  }

  initForm() {
    this.formCreationContrat = this.formBuilder.group({
      // agence: [{ value: this.devis?.agence?.idAgence, disabled: false }, [Validators.required]],
      agence: [{ value: this.devis?.agence?.idAgence, disabled: sessionStorage.getItem("roles")?.includes("COURTIER")|| sessionStorage.getItem("roles")?.includes("CDC_BEA")? true : false }, [Validators.required]],

      produit: [{ value: this.devis?.produit?.idCodeProduit, disabled: true }, [Validators.required]],
      duree: [{ value: this.devis?.duree?.id_duree, disabled: true }, [Validators.required]],
      dateEffet: ['', [Validators.required]],
      dateExpiration: [''],
    });

    this.formCreationSouscripteur = this.formBuilder.group({
      codeClient: [null],
      raisonSocial: [null, [Validators.maxLength(40)]],
      nom: [null, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
      prenom: [null, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
      dateOuverture: [null],
      dateNaissance: [null, [Validators.required, ageValidator]],
      nin: [{ value: null, disabled: true }, [Validators.pattern(Patterns.NIN)]],
      nif: [{ value: null, disabled: true }, [Validators.pattern(Patterns.NIF)]],
      rib: [{ value: null, disabled: true }, [Validators.pattern(Patterns.RIB)]],
      telephone: [{ value: null, disabled: true }, [Validators.required, Validators.pattern(Patterns.mobile)]],
      email: [{ value: null, disabled: true }, [Validators.pattern(Patterns.email)]],
      adresse: [{ value: null, disabled: true }, [Validators.required, Validators.maxLength(60)]],
      wilaya: [{ value: null, disabled: true }, [Validators.required]],
      commune: [{ value: null, disabled: true }, [Validators.required]],
      genre: [{ value: null, disabled: true }, [Validators.required]],
      situation: [{ value: null, disabled: true }],
      profession: [{ value: null, disabled: true }],
      typeClient: [{ value: this.codeProduit == '97' ? null : this.devis?.typeClient, disabled: this.codeProduit == '97' ? false : true },  this.codeProduit == '97' ? [Validators.required]: []],
    });

    this.formCreationAssure = this.formBuilder.group({
      codeClient: [null],
      raisonSocial: this.devis?.typeClient?.description == 'personne morale' ? [this.devis?.raisonSocial, [Validators.required, Validators.maxLength(40)]] : [null, []],
      nom: [this.devis?.typeClient?.description == "personne physique" ? this.devis?.nom : null, this.devis?.typeClient?.description == "personne physique" ? [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)] : []],
      prenom: [this.devis?.typeClient?.description == "personne physique" ? this.devis?.prenom : null, this.devis?.typeClient?.description == "personne physique" ? [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)] : []],
      dateOuverture: [null],
      dateNaissance: [this.devis?.typeClient?.description == "personne physique" ? this.devis?.dateAssure : null, this.devis?.typeClient?.description == "personne physique" ? [Validators.required, ageValidator] : []],
      nin: [{ value: null, disabled: true }, [Validators.pattern(Patterns.NIN)]],
      nif: [{ value: null, disabled: true }, this.devis?.typeClient?.description == "personne physique" ? [Validators.pattern(Patterns.NIF)] : [Validators.required, Validators.pattern(Patterns.NIF)]],
      telephone: [{ value: this.devis?.telephone, disabled: true }, [Validators.required, Validators.minLength(this.devis?.telephone.length), Validators.maxLength(this.devis?.telephone.length)]],
      email: [{ value: this.devis?.email, disabled: true }, [Validators.pattern(Patterns.email)]],
      adresse: [{ value: null, disabled: true }, [Validators.required, Validators.maxLength(60)]],
      wilaya: [{ value: null, disabled: true }, [Validators.required]],
      commune: [{ value: null, disabled: true }, [Validators.required]],
      genre: [{ value: null, disabled: true }, this.devis?.typeClient?.description == "personne physique" ? [Validators.required] : []],
      situation: [{ value: null, disabled: true }],
      profession: [{ value: null, disabled: true }],
      rib: [{ value: null, disabled: true }, [Validators.pattern(Patterns.RIB)]],
    //   lineOfBusiness: [{ value: null, disabled: false }, 
    //     (this.devis?.raisonSocial != '' && this.devis?.codeProduit == '97') 
    //         ? [Validators.required] 
    //         : []],
    // secteurActivite: [{ value: null, disabled: false }, 
    //     (this.devis?.raisonSocial != '' && this.devis?.codeProduit == '97') 
    //         ? [Validators.required] 
    //         : []],
    // occupation: [{ value: null, disabled: false }, 
    //     (this.devis?.raisonSocial != '' && this.devis?.codeProduit == '97') 
    //         ? [Validators.required] 
    //         : []]
    lineOfBusiness: [{ value: null, disabled: false }],

    secteurActivite: [{ value: null, disabled: false }],
    occupation: [{ value: null, disabled: false }],

    });

    //EXP SEUELEMENT DANS L'AUTO
    if (this.codeProduit == '45A')
      this.formCreationConducteur = this.formBuilder.group({
        codeClient: [null],
        nom: [null, [Validators.required, Validators.maxLength(50), Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
        prenom: [null, [Validators.required, Validators.maxLength(50), Validators.pattern(Patterns.nom), Validators.maxLength(40)]],
        dateNaissance: [null],
        telephone: [{ value: null, disabled: true }, [Validators.required, Validators.pattern(Patterns.mobile)]],
        email: [{ value: null, disabled: true }, [Validators.pattern(Patterns.email)]],
        adresse: [{ value: null, disabled: true }, [Validators.required, Validators.maxLength(60)]],
        wilaya: [{ value: null, disabled: true }, [Validators.required]],
        commune: [{ value: null, disabled: true }, [Validators.required]],
        situation: [{ value: null, disabled: true }],
        profession: [{ value: null, disabled: true }, [Validators.required]],
        numeroPermis: [{ value: null, disabled: true }, [Validators.required]],
        categoriePermis: [{ value: null, disabled: true }, [Validators.required]],
      });

    this.formCreationRisque = this.formBuilder.group({
      idRisque: [''],
    });

    this.formReduction = this.formBuilder.group({

      reduction: [{ value: this.devis?.reduction?.nomReduction, disabled: true }],
      convention: [{ value: this.devis?.convention?.idConvention, disabled: true }],
    });

    if (this.devis?.convention) this.getReductionByConvention(this.devis?.convention?.nomConvention);
    this.getAllParamRisque(this.devis?.produit?.idCodeProduit);

  }

  nextStep() {
    
 this.rechercheSouscripteur = true
    if (this.multiRisque && this.codeProduit!='97') {

      this.isAssure = true;
      this.formCreationSouscripteur = this.formCreationAssure
      this.getCommune(this.formCreationAssure.value.wilaya, 'Souscripteur')
    }
    console.log("this.formCreationContrat", this.formCreationContrat)
   console.log("this.formCreationSouscripteur", this.formCreationSouscripteur)
    console.log("this.formCreationAssure", this.formCreationAssure)
    console.log("this.rechercheAssure", this.rechercheAssure)
    console.log("this.rechercheSouscripteur", this.rechercheSouscripteur)
    if (this.formCreationContrat.valid && this.formCreationSouscripteur.valid && this.formCreationAssure.valid) {
      if (this.rechercheAssure && this.rechercheSouscripteur)
        this.myStepper.next();
    }
    else {
      this.formCreationContrat.markAllAsTouched();
      this.formCreationSouscripteur.markAllAsTouched();
      this.formCreationAssure.markAllAsTouched();
    }
  }

  recherchePersonne(type: any) {
    let filtre: any;
    switch (type) {
      case 'souscripteur':
        this.rechercheSouscripteur = true
        this.formCreationSouscripteur.get("dateNaissance").setValue(moment.utc(this.formCreationSouscripteur.get("dateNaissance").value).add(1,"hour").toISOString())
        filtre = this.formCreationSouscripteur.value;
        break;
      case 'assure':
        this.rechercheAssure = true
        if (this.devis?.typeClient?.description == "personne physique") this.formCreationAssure.get("dateNaissance").setValue(moment.utc(this.formCreationAssure.get("dateNaissance").value).add(1,"hour").toISOString())
        filtre = this.formCreationAssure.value

        //   filtre.raisonSocial = null
        break;
      case 'Conducteur':
        this.rechercheConducteur = true
        this.formCreationConducteur.get("dateNaissance").setValue(moment.utc(this.formCreationConducteur.get("DateDeNaissance").value).add(1,"hour").toISOString())
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
            this.formCreationSouscripteur.enable();
            this.formCreationSouscripteur.get("typeClient").disable()
            break;
          case 'assure':
            this.formCreationAssure.enable();
            break;
          case 'Conducteur':
            this.formCreationConducteur.enable();
            this.paraRisqueProduit.map((param: any) => {
              if (param.category == "Conducteur") {
                this.formCreationConducteur.get(param.formName).disable();
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

        dialogRef.afterClosed().subscribe(result => {
          this.personne = result
          this.initFormPersonne(type);
        });
      }
    })
  }



  initFormPersonne(type: any) {
    this.formCreation = this.formBuilder.group({
      codeClient: [this.personne?.idClient == '' ? null : this.personne?.idClient],
      raisonSocial: [this.personne?.raisonSocial == '' ? null : this.personne?.raisonSocial, [Validators.maxLength(40)]],
      nom: [this.personne?.nom == '' ? null : this.personne?.nom, [Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
      prenom: [this.personne?.prenom1 == '' ? null : this.personne?.prenom1, [Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
      dateNaissance: [this.personne?.dateNaissance == '' ? null : this.personne?.dateNaissance],
      nin: [this.personne?.nin == '' ? null : this.personne?.nin],
      idTelephone: [null],
      telephone: [null, [Validators.required, Validators.pattern(Patterns.mobile)]],
      idEmail: [null],
      email: [null, [Validators.pattern(Patterns.email)]],
      idAdresse: [this.personne?.adressesList[0] ? this.personne?.adressesList[0].idAdresse : 0],
      adresse: [this.personne?.adressesList[0] ? this.personne?.adressesList[0].description : '', [Validators.required, Validators.maxLength(60)]],
      wilaya: [this.personne?.adressesList[0] ? this.personne?.adressesList[0].wilaya?.idWilaya : '', [Validators.required]],
      commune: [this.personne?.adressesList[0] ? this.personne?.adressesList[0].commune?.idCommune : '', [Validators.required]],
      genre: [this.personne?.sexe?.idParam],
      situation: [this.personne?.situationFamiliale?.idParam],
      rib: ['', [Validators.pattern(Patterns.RIB)]]
    });

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
        this.formCreationSouscripteur.get("dateNaissance")?.setValidators([Validators.required, ageValidator])
        this.formCreationSouscripteur.get("genre")?.setValidators([Validators.required])
        this.formCreationSouscripteur.addControl("nif", new FormControl(this.personne?.nif, Validators.pattern(Patterns.NIF)));
        this.formCreationSouscripteur.addControl("idProfession", new FormControl(this.personne?.professionSecteurList[0] ? this.personne?.professionSecteurList[0].id : ''));
        this.formCreationSouscripteur.addControl("profession", new FormControl(this.personne?.professionSecteurList[0] ? this.personne?.professionSecteurList[0].profession?.idProfession : ''));
        this.formCreationSouscripteur.get('dateNaissance').updateValueAndValidity();
        this.formCreationSouscripteur.get('genre').updateValueAndValidity();
        break;
      case 'assure':
        this.getCommune(this.formCreation.value.wilaya, 'Assure')
        if (this.devis?.typeClient?.description == "personne physique") this.formCreation.get("dateNaissance").setValue(moment.utc(this.formCreation.get("dateNaissance").value).add(1,"hour").toISOString())

        this.formCreationAssure = this.formCreation
        this.formCreationAssure.addControl("nif", new FormControl(this.personne?.nif, Validators.pattern(Patterns.NIF)));
        if (this.devis?.typeClient?.description == "personne physique") {
          this.formCreationAssure.addControl("idProfession", new FormControl(this.personne?.professionSecteurList[0] ? this.personne?.professionSecteurList[0].id : ''));
          this.formCreationAssure.addControl("profession", new FormControl(this.personne?.professionSecteurList[0] ? this.personne?.professionSecteurList[0].profession?.idProfession : ''));
          this.formCreationAssure.get("dateNaissance")?.setValidators([Validators.required, ageValidator])
          this.formCreationAssure.get('dateNaissance').updateValueAndValidity();
          this.formCreationAssure.get("genre")?.setValidators([Validators.required])
          this.formCreationAssure.get('genre').updateValueAndValidity();
        }
        break;
      case 'Conducteur':
        this.getCommune(this.formCreation.value.wilaya, 'Conducteur')
        this.formCreation.get("dateNaissance").setValue(moment.utc(this.formCreation.get("dateNaissance").value).add(1,"hour").toISOString())
        this.formCreationConducteur = this.formCreation
        this.formCreationConducteur.addControl("idProfession", new FormControl(this.personne?.professionSecteurList[0] ? this.personne?.professionSecteurList[0].id : ''));
        this.formCreationConducteur.addControl("profession", new FormControl(this.personne?.professionSecteurList[0] ? this.personne?.professionSecteurList[0].profession?.idProfession : ''));
        this.formCreationConducteur.addControl("numeroPermis", new FormControl('', [Validators.required]));
        this.formCreationConducteur.addControl("categoriePermis", new FormControl('', [Validators.required]));
        this.paraRisqueProduit.map((param: any) => {
          if (param.category == "Conducteur") {
            let valeur = this.paramRisqueDevis?.find((risque: any) => risque.libelle == param.libelle && risque.categorieParamRisque == param.category)

            if (valeur != undefined)
              this.formCreationConducteur.addControl(param.formName, new FormControl({ value: valeur.reponse.valeur != null ? valeur.reponse.valeur : valeur.reponse.idParamReponse?.idParam, disabled: true }, [Validators.required]));
            else
              this.formCreationConducteur.addControl(param.formName, new FormControl(param.defaultValue, [Validators.required]));
          }
        });



        this.formCreationConducteur.get("DateDeNaissance")?.setValidators([Validators.required, ageValidator])
        this.formCreationConducteur.get('DateDeNaissance').updateValueAndValidity();
        break;

      default:
        break;
    }

  }

  getAllParamRisque(idProduit: any) {

    let existInBoth = false
    let validators: any = []
    this.paramRisqueService.getParamByProduit(idProduit).subscribe({
      next: (data: any) => {

        this.paramRisqueService.getWorkFlowByProduit(idProduit, 46).subscribe({
          next: (dataWorkFlow: any) => {
            data.map((param: any) => {
              let paramRisque: any = {}
              let enabled: any = null
              let obligatoire: any = null
              dataWorkFlow.filter((paramWorkFlow: any) => {
                if (param.paramRisque?.idParamRisque == paramWorkFlow.paramRisque?.idParamRisque && paramWorkFlow.enabled) {
                  existInBoth = true
                  enabled = paramWorkFlow.enabled
                  obligatoire = paramWorkFlow.obligatoire
                }
              })
              param?.iddictionnaire?.description == 'valeur minimum' ? paramRisque.valeurMin = param.valeur : ''
              param?.iddictionnaire?.description == 'valeur maximum' ? paramRisque.valeurMax = param.valeur : ''
              paramRisque.codeParam = param.paramRisque.codeParam
              paramRisque.idParamRisque = param.paramRisque.idParamRisque
              paramRisque.libelle = param.paramRisque.libelle
              paramRisque.formName = param.paramRisque.libelle.split(' ').map((word: any) => word.charAt(0).toUpperCase() + word.substring(1)).join('')
              paramRisque.orderChamp = param.paramRisque.orderChamp
              paramRisque.position = param.paramRisque.position
              paramRisque.typeChamp = param.paramRisque.typeChamp
              paramRisque.sizeChamp = param.paramRisque.sizeChamp
              paramRisque.category = param.paramRisque.categorieParamRisque?.description
              paramRisque.parent = param.paramRisque.paramRisqueParent
              paramRisque.isParent = param.paramRisque.isParent
              paramRisque.reponses = param.paramRisque.categorie?.paramDictionnaires
              paramRisque.typeValeur = param.iddictionnaire
              paramRisque.defaultValue = param.valeur
              paramRisque.obligatoire = obligatoire
              paramRisque.enable = enabled
              paramRisque.readonly = paramRisque.codeParam != "P106" && this.paramRisqueDevis?.find((risque: any) => risque.libelle == paramRisque.libelle && risque.categorieParamRisque == paramRisque.category) != undefined

              if (param?.iddictionnaire?.description == 'valeur minimum') {

              }
              if (this.paraRisqueProduit.find((o: any) => param.paramRisque?.idParamRisque === o.idParamRisque) == undefined && existInBoth) {

                //ancient
                // let valeur = this.devis?.risqueList?.find((risque: any) => risque.libelle == paramRisque.libelle && risque.categorieParamRisque == paramRisque.category)



                let valeur = this.paramRisqueDevis?.find((risque: any) => risque.libelle == paramRisque.libelle && risque.categorieParamRisque == paramRisque.category)

                //parent
                if (param.paramRisque.typeChamp.code == "L08" && param.paramRisque.paramRisqueParent == null) {

                  //EXP EN ATTENTE NOM TABLE EN RETOUR               

                  this.paramRisqueService.getTableParamParent(paramRisque.idParamRisque).subscribe({
                    next: (data: any) => {
                      paramRisque.reponses = data


                      if (valeur != undefined) {
                        this.getChild(paramRisque.idParamRisque, valeur?.reponse?.valeur)
                      }


                    },
                    error: (error) => {

                      //////////console.log(error);

                    }
                  })
                }
                if (valeur != undefined) {


                  switch (paramRisque.category) {

                    case "Conducteur":

                      this.formCreationConducteur.addControl(paramRisque.formName, new FormControl({ value: valeur.reponse.valeur != null ? valeur.reponse.valeur : valeur.reponse.idParamReponse?.idParam, disabled: paramRisque.readonly }, [Validators.required]));
                      break;
                    default:
                      this.formCreationRisque.addControl(paramRisque.formName, new FormControl({ value: valeur.reponse.valeur != null ? valeur.reponse.valeur : valeur.reponse.idParamReponse?.idParam, disabled: paramRisque.readonly }, [Validators.required]));

                      break;
                  }
                }
                else {
                  switch (paramRisque.category) {
                    case "Conducteur":
                      this.formCreationConducteur.addControl(paramRisque.formName, new FormControl({ value: paramRisque.defaultValue, disabled: paramRisque.readonly }, [Validators.required]));
                      break;
                    default:
  
                      if (paramRisque.sizeChamp != 0 && paramRisque.sizeChamp != undefined && paramRisque.typeChamp?.code != 'L01' && paramRisque.typeChamp?.code != 'L08') {
                        this.formCreationRisque.addControl(paramRisque.formName, new FormControl({ value: paramRisque.defaultValue, disabled: paramRisque.readonly }, [Validators.required, Validators.minLength(paramRisque.sizeChamp), Validators.maxLength(paramRisque.sizeChamp)]));

       
                      } else
                        this.formCreationRisque.addControl(paramRisque.formName, new FormControl({ value: paramRisque.defaultValue, disabled: paramRisque.readonly }, [Validators.required]));
                      break;
                  }
                }
                /* if (param.paramRisque.codeParam == "P110") {
 
 
                  
                 
                   this.formCreationRisque.controls[paramRisque.formName].setValidators([Validators.required, Validators.pattern('/^[0-9]+(\.[0-9]{1,2})?$/')])
                  // this.formCreationRisque.controls[paramRisque.formName].formatValue('');
                  // this.formCreationRisque.format("YYYY-MM-DDT00:00:00.000+00:00")
                 }
 */
                // if (paramRisque.codeParam == 'P125')
                //   this.getCommune(valeur.reponse.valeur, paramRisque.formName)

                this.paraRisqueProduit.push(paramRisque)



              } else if (existInBoth) {

                if (param?.iddictionnaire?.description == 'valeur minimum') {

                  this.formCreationRisque.get(paramRisque.formName)?.addValidators([Validators.min(paramRisque.valeurMin)])
                  this.formCreationRisque.get(paramRisque.formName)?.updateValueAndValidity();
                }
                else if (param?.iddictionnaire?.description == 'valeur maximum') {

                  this.formCreationRisque.get(paramRisque.formName)?.addValidators([Validators.max(paramRisque.valeurMax)])
                  this.formCreationRisque.get(paramRisque.formName)?.updateValueAndValidity();
                }
              }
              // else if (existInBoth) {
              //   //////////console.log("paramRisque")
              //   //////////console.log(paramRisque)

              //   if (param?.iddictionnaire?.description == 'valeur minimum') {
              //     this.formCreationRisque.get(paramRisque.formName).addValidators([Validators.min(paramRisque.valeurMin)])
              //     this.formCreationRisque.get(paramRisque.formName).updateValueAndValidity();
              //   }
              //   else if (param?.iddictionnaire?.description == 'valeur maximum') {
              //     this.formCreationRisque.get(paramRisque.formName).addValidators([Validators.max(paramRisque.valeurMax)])
              //     this.formCreationRisque.get(paramRisque.formName).updateValueAndValidity();
              //   }
              // }
              existInBoth = false
              validators = []
            })

            this.paraRisqueProduitCategory = this.paraRisqueProduit.reduce((x: any, y: any) => {

              (x[y.category] = x[y.category] || []).push(y);

              return x;

            }, {});
            this.paraRisqueProduitCategory = Object.values(this.paraRisqueProduitCategory)

            this.paraRisqueProduitCategory.map((risqueCategory: any) => {
              risqueCategory.sort((a: any, b: any) => (a.orderChamp < b.orderChamp ? -1 : 1));
            })


          },
          error: (error) => {

            //////////console.log(error);

          }
        })


      },
      error: (error) => {

        //////////console.log(error);

      }
    });
    //ancient this.devis?.paramDevisList?


    this.devis?.groupes[0]?.garantieList?.map((garantie: any) => {
      let plafond = "-"
      let formule = "-"
      let franchise = "-"
      //EXP sous garanties
      garantie.sousGarantieList?.filter((sousGarantie: any) => {
        this.sousGarantieExist = true
        let sousPlafond: any = "-"
        let sousFormule: any = "-"
        let sousFranchise: any = "-"

        sousGarantie?.categorieList?.map((cateogrie: any) => {
          if (cateogrie.code == "C15") {
            sousFranchise = cateogrie.valeur
            this.sousFranchiseExist = true
          }
          else if (cateogrie.code == "C16") {
            sousFormule = cateogrie.valeur
            this.sousFormuleExist = true
          }
          else if (cateogrie.code == "C7") {
            sousPlafond = cateogrie.valeur
            this.sousPlafondExist = true
          }
        })
        this.sousGarantieTab.push({
          "idGarantie": sousGarantie.idGarantie,
          "description": sousGarantie.description,
          "prime": Number(garantie.prime).toFixed(2),
          "plafond": sousPlafond,
          "formule": sousFormule,
          "franchise": sousFranchise,
        })
      })

      //EXP category garantie 
      garantie?.categorieList?.map((cateogrie: any) => {
        if (cateogrie.code == "C15") {
          franchise = cateogrie.valeur
          this.franchiseExist = true
        }
        else if (cateogrie.code == "C16") {
          formule = cateogrie.valeur
          this.formuleExist = true
        }
        else if (cateogrie.code == "C7") {
          plafond = cateogrie.valeur
          this.plafondExist = true
        }
      })

      this.informationsPack.push({
        "idGarantie": garantie.idGarantie,
        "description": garantie.description,
        "prime": Number(garantie.prime).toFixed(2),
        "plafond": plafond,
        "formule": formule,
        "franchise": franchise,
        "sousGarantieList": new MatTableDataSource(this.sousGarantieTab)

      })
      this.sousGarantieTab = []
    })
    if (!this.franchiseExist && !this.sousFranchiseExist && this.displayedColumnsPack.indexOf("franchise") !== -1) {
      this.displayedColumnsPack.splice(this.displayedColumnsPack.indexOf("franchise"), 1);
    }
    if (!this.plafondExist && !this.sousPlafondExist && this.displayedColumnsPack.indexOf("plafond") !== -1) {
      this.displayedColumnsPack.splice(this.displayedColumnsPack.indexOf("plafond"), 1);
    }
    if (!this.formuleExist && !this.sousFormuleExist && this.displayedColumnsPack.indexOf("formule") !== -1) {
      this.displayedColumnsPack.splice(this.displayedColumnsPack.indexOf("formule"), 1);
    }
    this.PrimeNette = this.devis?.primeList?.find((p: any) => p.typePrime?.code == "CP101")?.prime;
    this.PrimeTotale = this.devis?.primeList?.find((p: any) => p.typePrime?.code == "CP186")?.prime;

    this.dataSourcePack = new MatTableDataSource(this.informationsPack)
  }


  getChild(idParamRisque: any, idReponse: any) {

    let idRisqueChild = this.paraRisqueProduit.filter((rs: any) => rs.parent?.idParamRisque == idParamRisque)[0].idParamRisque
    // let idRisqueChild = this.paraRisqueProduit.filter((rs: any) => rs.idParamRisque == idParamRisque)[0].idParamRisque

    this.paramRisqueService.getTableParamChild(idRisqueChild, idReponse).subscribe({
      next: (data: any) => {
        this.paraRisqueProduit.filter((param: any) => {
          if (param.idParamRisque == idRisqueChild) {
            param.reponses = data
            // this.formCreationRisque.controls[param.formName].enable()
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

        //////////console.log(error);

      }
    })
  }

  changeRoleClient(val: any, role: string) {

    if (val) {
      switch (role) {
        case 'Souscripteur':
          this.rechercheSouscripteur = true
          this.isAssure = true;
          this.formCreationSouscripteur = this.formCreationAssure
          this.getCommune(this.formCreationAssure.value.wilaya, 'Souscripteur')
          break;
        case 'Conducteur':
          this.rechercheConducteur = true
          this.isConducteur = true;
          this.isConducteurAssure = false;
          this.formCreationConducteur = this.formBuilder.group({
            codeClient: [this.formCreationSouscripteur?.value?.codeClient == '' ? null : this.formCreationSouscripteur?.value?.codeClient],
            nom: [this.formCreationSouscripteur?.value?.nom == '' ? null : this.formCreationSouscripteur?.value?.nom, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
            prenom: [this.formCreationSouscripteur?.value?.prenom == '' ? null : this.formCreationSouscripteur?.value?.prenom, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
            dateNaissance: [this.formCreationSouscripteur?.value?.dateNaissance == '' ? null : this.formCreationSouscripteur?.value?.dateNaissance],
            telephone: [this.formCreationSouscripteur?.value?.telephone, [Validators.required, Validators.minLength(this.formCreationSouscripteur?.value?.telephone.length), Validators.maxLength(this.formCreationSouscripteur?.value?.telephone.length)]],
            email: [this.formCreationSouscripteur?.value?.email, [Validators.pattern(Patterns.email)]],
            adresse: [this.formCreationSouscripteur?.value?.adresse, [Validators.required, Validators.maxLength(60)]],
            wilaya: [this.formCreationSouscripteur?.value?.wilaya, [Validators.required]],
            commune: [this.formCreationSouscripteur?.value?.commune, [Validators.required]],
            situation: [this.formCreationSouscripteur?.value?.situation],
            profession: [this.formCreationSouscripteur?.value?.profession, [Validators.required]],
            numeroPermis: ['', [Validators.required]],
            categoriePermis: ['', [Validators.required]],
          });
          this.getCommune(this.formCreationConducteur.value.wilaya, 'Conducteur')

          this.paraRisqueProduit.map((param: any) => {
            if (param.category == "Conducteur") {
              let valeur = this.paramRisqueDevis?.find((risque: any) => risque.libelle == param.libelle && risque.categorieParamRisque == param.category)

              if (valeur != undefined)
                this.formCreationConducteur.addControl(param.formName, new FormControl({ value: valeur.reponse.valeur != null ? valeur.reponse.valeur : valeur.reponse.idParamReponse?.idParam, disabled: param.readonly }, [Validators.required]));
              else
                this.formCreationConducteur.addControl(param.formName, new FormControl(param.defaultValue, [Validators.required]));
            }
          });
          break;
        case 'ConducteurAssure':
          this.rechercheConducteur = true
          this.isConducteurAssure = true;
          this.isConducteur = false;
          this.formCreationConducteur = this.formBuilder.group({
            codeClient: [this.formCreationAssure?.value?.codeClient == '' ? null : this.formCreationAssure?.value?.codeClient],
            nom: [this.formCreationAssure?.value?.nom == '' ? null : this.formCreationAssure?.value?.nom, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
            prenom: [this.formCreationAssure?.value?.prenom == '' ? null : this.formCreationAssure?.value?.prenom, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
            dateNaissance: [this.formCreationAssure?.value?.dateNaissance == '' ? null : this.formCreationAssure?.value?.dateNaissance],
            telephone: [this.formCreationAssure?.value?.telephone, [Validators.required, Validators.minLength(this.formCreationAssure?.value?.telephone.length), Validators.maxLength(this.formCreationAssure?.value?.telephone.length)]],
            email: [this.formCreationAssure?.value?.email, [Validators.pattern(Patterns.email)]],
            adresse: [this.formCreationAssure?.value?.adresse, [Validators.required, Validators.maxLength(60)]],
            wilaya: [this.formCreationAssure?.value?.wilaya, [Validators.required]],
            commune: [this.formCreationAssure?.value?.commune, [Validators.required]],
            situation: [this.formCreationAssure?.value?.situation],
            profession: [this.formCreationAssure?.value?.profession, [Validators.required]],
            numeroPermis: ['', [Validators.required]],
            categoriePermis: ['', [Validators.required]],
          });
          this.getCommune(this.formCreationConducteur.value.wilaya, 'Conducteur')

          this.paraRisqueProduit.map((param: any) => {
            if (param.category == "Conducteur") {
              let valeur = this.paramRisqueDevis?.find((risque: any) => risque.libelle == param.libelle && risque.categorieParamRisque == param.category)

              if (valeur != undefined)
                this.formCreationConducteur.addControl(param.formName, new FormControl({ value: valeur.reponse.valeur != null ? valeur.reponse.valeur : valeur.reponse.idParamReponse?.idParam, disabled: param.readonly }, [Validators.required]));
              else
                this.formCreationConducteur.addControl(param.formName, new FormControl(param.defaultValue, [Validators.required]));
            }
          });
          break;

        default:
          break;
      }
    }
    else {
      switch (role) {
        case 'Souscripteur':
          this.rechercheSouscripteur = false
          this.isAssure = false;
          this.formCreationSouscripteur = this.formBuilder.group({
            codeClient: [null],
            typeClient: [{ value: null, disabled: false }, [Validators.required]],
            raisonSocial: [this.devis?.raisonSocial == '' ? null : this.devis?.raisonSocial, [Validators.maxLength(40)]],
            nom: [null, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
            prenom: [null, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
            dateOuverture: [null],
            dateNaissance: [this.devis?.typeClient?.description == "personne physique" ? this.devis?.dateAssure : null, [Validators.required]],
            nin: [{value: null, disabled: true}, [Validators.pattern(Patterns.NIN)]],
            nif: [null, [Validators.pattern(Patterns.NIF)]],
            telephone: [{value: '', disabled: true}, [Validators.required, Validators.pattern(Patterns.mobile)]],
            email: [{value: '', disabled: true}, [Validators.pattern(Patterns.email)]],
            adresse: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(60)]],
            wilaya: [{value: '', disabled: true}, [Validators.required]],
            commune: [{value: '', disabled: true}, [Validators.required]],
            genre: [{value: '', disabled: true}, [Validators.required]],
            situation: [{value: '', disabled: true}],
            profession: [{value: '', disabled: true}],
            rib: ['', [Validators.pattern(Patterns.RIB)]]
          });
          break;
        case 'Conducteur':
          this.rechercheConducteur = false
          this.isConducteur = false;
          this.formCreationConducteur = this.formBuilder.group({
            codeClient: [null],
            nom: [null, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
            prenom: [null, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
            dateNaissance: [null],
            telephone: [{ value: null, disabled: true }, [Validators.required, Validators.pattern(Patterns.mobile)]],
            email: [{ value: '', disabled: true }, [Validators.pattern(Patterns.email)]],
            adresse: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(60)]],
            wilaya: [{ value: '', disabled: true }, [Validators.required]],
            commune: [{ value: '', disabled: true }, [Validators.required]],
            situation: [{ value: '', disabled: true }],
            profession: [{ value: '', disabled: true }, [Validators.required]],
            numeroPermis: [{ value: '', disabled: true }, [Validators.required]],
            categoriePermis: [{ value: '', disabled: true }, [Validators.required]],
          });


          this.paraRisqueProduit.map((param: any) => {
            if (param.category == "Conducteur") {
              let valeur = this.paramRisqueDevis?.find((risque: any) => risque.libelle == param.libelle && risque.categorieParamRisque == param.category)

              if (valeur != undefined)
                this.formCreationConducteur.addControl(param.formName, new FormControl({ value: valeur.reponse.valeur != null ? valeur.reponse.valeur : valeur.reponse.idParamReponse?.idParam, disabled: true }, [Validators.required]));
              else
                this.formCreationConducteur.addControl(param.formName, new FormControl(param.defaultValue, [Validators.required]));
            }
          });
          break;
        case 'ConducteurAssure':
          this.rechercheConducteur = false
          this.isConducteurAssure = false;
          this.formCreationConducteur = this.formBuilder.group({
            codeClient: [null],
            nom: [null, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
            prenom: [null, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
            dateNaissance: [null],
            telephone: [{ value: null, disabled: true }, [Validators.required, Validators.pattern(Patterns.mobile)]],
            email: [{ value: '', disabled: true }, [Validators.pattern(Patterns.email)]],
            adresse: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(60)]],
            wilaya: [{ value: '', disabled: true }, [Validators.required]],
            commune: [{ value: '', disabled: true }, [Validators.required]],
            situation: [{ value: '', disabled: true }],
            profession: [{ value: '', disabled: true }, [Validators.required]],
            numeroPermis: [{ value: '', disabled: true }, [Validators.required]],
            categoriePermis: [{ value: '', disabled: true }, [Validators.required]],
          });


          this.paraRisqueProduit.map((param: any) => {
            if (param.category == "Conducteur") {
              let valeur = this.paramRisqueDevis?.find((risque: any) => risque.libelle == param.libelle && risque.categorieParamRisque == param.category)

              if (valeur != undefined)
                this.formCreationConducteur.addControl(param.formName, new FormControl({ value: valeur.reponse.valeur != null ? valeur.reponse.valeur : valeur.reponse.idParamReponse?.idParam, disabled: true }, [Validators.required]));
              else
                this.formCreationConducteur.addControl(param.formName, new FormControl(param.defaultValue, [Validators.required]));
            }
          });
          break;

        default:
          break;
      }
    }
  }

//   async submitContrat() {
//     let index = 0
//     const produitVoiture = ["45A","45F","45L"]
//     this.formCreationContrat.enable();
//     this.formCreationSouscripteur.enable();

//     this.formCreationAssure.enable();
//     if (this.codeProduit == '45A')
//       this.formCreationConducteur.enable();

//     this.formCreationRisque.enable();

//     let souscripteur = this.formCreationSouscripteur?.value
//     let assure = this.formCreationAssure?.value
//     let conducteur = this.formCreationConducteur?.value


//         const originalDateEffet = this.formCreationContrat.get("dateEffet").value;
//     const updatedDateEffet = moment(originalDateEffet).add(1, 'hour').format("YYYY-MM-DDTHH:mm:ss.000");  

    
//     this.valider = true;
//     this.contrat.devis = +this.devis?.idDevis;
//     this.contrat.agence = this.formCreationContrat?.get("agence")?.value;
//     // this.formCreationContrat.get("dateEffet").setValue(moment(this.formCreationContrat.get("dateEffet").value).format("YYYY-MM-DDT00:00:00.000"))
//     // this.contrat.dateEffet = this.formCreationContrat.value?.dateEffet;
//     this.formCreationContrat.get("dateEffet").setValue(updatedDateEffet);
// this.contrat.dateEffet = updatedDateEffet;
// // en cas ou on souhaite ajouter une heure de plus a 


//     // this.valider = true;
//     // this.contrat.devis = +this.devis?.idDevis;
//     // this.contrat.agence = this.formCreationContrat?.get("agence")?.value;
//     // this.formCreationContrat.get("dateEffet").setValue(moment(this.formCreationContrat.get("dateEffet").value).format("YYYY-MM-DDT00:00:00.000"))
//     // this.contrat.dateEffet = this.formCreationContrat.value?.dateEffet;
//     this.contrat.dateExpiration = this.formCreationContrat.value?.dateExpiration;
//     let typePersonne
//     this.contrat.personnes = [];

//     if(souscripteur.nom == assure.nom && souscripteur.prenom == assure.prenom && souscripteur.dateNaissance == assure.dateNaissance)
//     {
//       this.isAssure = true;
//       if(souscripteur.nom == conducteur?.nom && souscripteur.prenom == conducteur?.prenom && souscripteur.dateNaissance == conducteur?.dateNaissance)
//       {
//         this.isConducteur = true
//       } else if(assure.nom == conducteur?.nom && assure.prenom == conducteur?.prenom && assure.dateNaissance == conducteur?.dateNaissance)
//       {
//         this.isConducteurAssure = true
//       }
//     } else {
//       if(souscripteur.nom == conducteur?.nom && souscripteur.prenom == conducteur?.prenom && souscripteur.dateNaissance == conducteur?.dateNaissance)
//       {
//         this.isConducteur = true
//       } else if(assure.nom == conducteur?.nom && assure.prenom == conducteur?.prenom && assure.dateNaissance == conducteur?.dateNaissance)
//       {
//         this.isConducteurAssure = true
//       }
//     }
//     if(!produitVoiture.includes(this.codeProduit)){
//       this.isConducteur=false
//       this.isConducteurAssure= false
//     }
   

//     if (this.isAssure && this.isConducteur) { //exp les trois 
//       typePersonne = this.formCreationSouscripteur?.value?.raisonSocial == null ? "PH" : "PM"
//       let personne: PersonneContrat = {
//         role: (this.roles.find((role: any) => role.code === 'CP238') || {}).idParam,
//         typeClient: typePersonne,
//         risqueList: this.devis.produit.codeProduit == "45L" && this.devis.groupes.length ==0 ?this.devis.groupes:  [this.devis.groupes[0].risques[0].idRisque] ,
//         idClient: this.formCreationSouscripteur?.value?.codeClient,
//         nom: this.formCreationSouscripteur?.value?.nom,
//         prenom: this.formCreationSouscripteur?.value?.prenom,
//         raisonSocial: this.formCreationSouscripteur?.value?.raisonSocial,
//         dateNaissance: moment(this.formCreationConducteur?.value?.DateDeNaissance).format("YYYY-MM-DDT00:00:00.000"),
//         nif: this.formCreationSouscripteur?.value?.nif,
//         nin: this.formCreationSouscripteur?.value?.nin,
//         telephone: {
//           idContact: this.formCreationSouscripteur?.value?.idTelephone,
//           description: this.formCreationSouscripteur?.value?.telephone
//         },
//         email: {
//           idContact: this.formCreationSouscripteur?.value?.idEmail,
//           description: this.formCreationSouscripteur?.value?.email
//         },
//         adresse: {
//           idAdresse: this.formCreationSouscripteur?.value?.idAdresse,
//           description: this.formCreationSouscripteur?.value?.adresse,
//           wilaya: this.formCreationSouscripteur?.value?.wilaya,
//           commune: this.formCreationSouscripteur?.value?.commune
//         },
//         genre: this.formCreationSouscripteur?.value?.genre,
//         situation: this.formCreationSouscripteur?.value?.situation,
//         profession: {
//           id: this.formCreationSouscripteur?.value?.idProfession ?this.formCreationSouscripteur?.value?.idProfession : 0 ,
//           idProfession: this.formCreationSouscripteur?.value?.profession,
//         },
//         rib: {
//           idRib: 0,
//           description: this.formCreationAssure?.value?.rib
//         },
//         commercialLineValues:{

//           ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

//           activite: this.formCreationAssure?.value?.secteurActivite,

//           occupation: this.formCreationAssure?.value?.occupation,

//           naceCode:null
      
//         },
//         permis: {
//           idDocument: 0,
//           description: this.formCreationConducteur?.value?.numeroPermis,
//           categorie: this.formCreationConducteur?.value?.categoriePermis,
//           dateDelivrance: '',
//           wilayaDelivrance: 0
//         }
//       };

//       this.paraRisqueProduit.map((param: any) => {
//         if (param.category == "Conducteur") {

//           switch (param.codeParam) {
//             case "P56":
//               personne.permis.wilayaDelivrance = +this.formCreationConducteur?.value[param.formName]
//               break;
//             case "P54":
//               personne.permis.dateDelivrance = moment(this.formCreationConducteur?.value[param.formName]).format("YYYY-MM-DDT00:00:00.000")
//               break;

//             default:
//               break;
//           }
//         }
//       })

//       this.contrat.personnes.push(personne)
//     }
//     else if (this.isAssure && this.isConducteurAssure) { //exp les trois 
//       typePersonne = this.formCreationSouscripteur?.value?.raisonSocial == null ? "PH" : "PM"
//       let personne: PersonneContrat = {
//         role: (this.roles.find((role: any) => role.code === 'CP238') || {}).idParam,
//         typeClient: typePersonne,
//         risqueList: [this.devis.groupes[0].risques[0].idRisque],
//         idClient: this.formCreationSouscripteur?.value?.codeClient,
//         nom: this.formCreationSouscripteur?.value?.nom,
//         prenom: this.formCreationSouscripteur?.value?.prenom,
//         raisonSocial: this.formCreationSouscripteur?.value?.raisonSocial,
//         dateNaissance: moment(this.formCreationConducteur?.value?.DateDeNaissance).format("YYYY-MM-DDT00:00:00.000"),
//         nif: this.formCreationSouscripteur?.value?.nif,
//         nin: this.formCreationSouscripteur?.value?.nin,
//         telephone: {
//           idContact: this.formCreationSouscripteur?.value?.idTelephone,
//           description: this.formCreationSouscripteur?.value?.telephone
//         },
//         email: {
//           idContact: this.formCreationSouscripteur?.value?.idEmail,
//           description: this.formCreationSouscripteur?.value?.email
//         },
//         adresse: {
//           idAdresse: this.formCreationSouscripteur?.value?.idAdresse,
//           description: this.formCreationSouscripteur?.value?.adresse,
//           wilaya: this.formCreationSouscripteur?.value?.wilaya,
//           commune: this.formCreationSouscripteur?.value?.commune
//         },
//         genre: this.formCreationSouscripteur?.value?.genre,
//         situation: this.formCreationSouscripteur?.value?.situation,
//         profession: {
//           id: this.formCreationSouscripteur?.value?.idProfession ? this.formCreationSouscripteur?.value?.idProfession : 0 ,
//           idProfession: this.formCreationSouscripteur?.value?.profession,
//         },
//         rib: {
//           idRib: 0,
//           description: this.formCreationAssure?.value?.rib
//         },
//         commercialLineValues:{
//           ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

//           activite: this.formCreationAssure?.value?.secteurActivite,

//           occupation: this.formCreationAssure?.value?.occupation,

//           naceCode:null
      
//         },
//         permis: {
//           idDocument: 0,
//           description: this.formCreationConducteur?.value?.numeroPermis,
//           categorie: this.formCreationConducteur?.value?.categoriePermis,
//           dateDelivrance: '',
//           wilayaDelivrance: 0
//         }
//       };

//       this.paraRisqueProduit.map((param: any) => {
//         if (param.category == "Conducteur") {
//           switch (param.codeParam) {
//             case "P56":
//               personne.permis.wilayaDelivrance = +this.formCreationConducteur?.value[param.formName]
//               break;
//             case "P54":
//               personne.permis.dateDelivrance = moment(this.formCreationConducteur?.value[param.formName]).format("YYYY-MM-DDT00:00:00.000")
//               break;

//             default:
//               break;
//           }
//         }
//       })

//       this.contrat.personnes.push(personne)
//     }
//     else if (this.isAssure) { //exp assuré + souscripteur 
//       typePersonne = this.formCreationSouscripteur?.value?.raisonSocial == null ? "PH" : "PM"
//       let personne: PersonneContrat = {
//         role: (this.roles.find((role: any) => role.code === 'CP236') || {}).idParam,
//         typeClient: typePersonne,
//         risqueList: [],
//         idClient: this.formCreationSouscripteur?.value?.codeClient,
//         nom: this.formCreationSouscripteur?.value?.nom,
//         prenom: this.formCreationSouscripteur?.value?.prenom,
//         raisonSocial: this.formCreationSouscripteur?.value?.raisonSocial,
//         dateNaissance: this.devis?.typeClient?.description == 'personne physique' ? moment(this.formCreationAssure?.value?.dateNaissance).format("YYYY-MM-DDT00:00:00.000") : '',
//         nif: this.formCreationSouscripteur?.value?.nif,
//         nin: this.formCreationSouscripteur?.value?.nin,
//         telephone: {
//           idContact: this.formCreationSouscripteur?.value?.idTelephone,
//           description: this.formCreationSouscripteur?.value?.telephone
//         },
//         email: {
//           idContact: this.formCreationSouscripteur?.value?.idEmail,
//           description: this.formCreationSouscripteur?.value?.email
//         },
//         adresse: {
//           idAdresse: this.formCreationSouscripteur?.value?.idAdresse,
//           description: this.formCreationSouscripteur?.value?.adresse,
//           wilaya: this.formCreationSouscripteur?.value?.wilaya,
//           commune: this.formCreationSouscripteur?.value?.commune
//         },
//         genre: this.formCreationSouscripteur?.value?.genre,
//         situation: this.formCreationSouscripteur?.value?.situation,
//         profession: {
//           id: this.formCreationSouscripteur?.value?.idProfession ? this.formCreationSouscripteur?.value?.idProfession  : 0 ,
//           idProfession: this.formCreationSouscripteur?.value?.profession,
//         },
//         rib: {
//           idRib: 0,
//           description: this.formCreationAssure?.value?.rib
//         },
//         commercialLineValues:{
//           ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

//           activite: this.formCreationAssure?.value?.secteurActivite,

//           occupation: this.formCreationAssure?.value?.occupation,

//           naceCode:null
      
//         },
//         permis: {}
//       };

//       this.contrat.personnes.push(personne)
//       if (this.codeProduit == '45A') {
//         typePersonne = this.formCreationConducteur?.value?.raisonSocial == null ? "PH" : "PM"
//         let personne2: PersonneContrat = {
//           role: (this.roles.find((role: any) => role.code === 'CP233') || {}).idParam,
//           typeClient: typePersonne,
//           risqueList: [this.devis.groupes[0].risques[0].idRisque],
//           idClient: this.formCreationConducteur?.value?.codeClient,
//           nom: this.formCreationConducteur?.value?.nom,
//           prenom: this.formCreationConducteur?.value?.prenom,
//           raisonSocial: '',
//           dateNaissance: moment(this.formCreationConducteur?.value?.DateDeNaissance).format("YYYY-MM-DDT00:00:00.000"),
//           nif: null,
//           nin: '',
//           telephone: {
//             idContact: this.formCreationConducteur?.value?.idTelephone,
//             description: this.formCreationConducteur?.value?.telephone
//           },
//           email: {
//             idContact: this.formCreationConducteur?.value?.idEmail,
//             description: this.formCreationConducteur?.value?.email
//           },
//           adresse: {
//             idAdresse: this.formCreationConducteur?.value?.idAdresse,
//             description: this.formCreationConducteur?.value?.adresse,
//             wilaya: this.formCreationConducteur?.value?.wilaya,
//             commune: this.formCreationConducteur?.value?.commune
//           },
//           genre: 0,
//           situation: this.formCreationConducteur?.value?.situation,
//           profession: {
//             id: this.formCreationConducteur?.value?.idProfession ?? 0 ,
//             idProfession: this.formCreationConducteur?.value?.profession,
//           },
//           commercialLineValues:{
//             ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,
  
//             activite: this.formCreationAssure?.value?.secteurActivite,
  
//             occupation: this.formCreationAssure?.value?.occupation,
  
//             naceCode:null
        
//           },
//           rib: {},
//           permis: {
//             idDocument: 0,
//             description: this.formCreationConducteur?.value?.numeroPermis,
//             categorie: this.formCreationConducteur?.value?.categoriePermis,
//             dateDelivrance: '',
//             wilayaDelivrance: 0
//           }
//         };

//         this.paraRisqueProduit.map((param: any) => {
//           if (param.category == "Conducteur") {
//             switch (param.codeParam) {
//               case "P56":
//                 personne2.permis.wilayaDelivrance = +this.formCreationConducteur?.value[param.formName]
//                 break;
//               case "P54":
//                 personne2.permis.dateDelivrance = moment(this.formCreationConducteur?.value[param.formName]).format("YYYY-MM-DDT00:00:00.000")
//                 break;
//               case "P24":
//                 personne2.genre = this.formCreationConducteur?.value[param.formName]
//                 break;
//               case "P55":
//                 personne2.dateNaissance = moment(this.formCreationConducteur?.value[param.formName]).format("YYYY-MM-DDT00:00:00.000")
//                 break;

//               default:
//                 break;
//             }
//           }
//         })

//         this.contrat.personnes.push(personne2)
//       }
//     }
//     else if (this.isConducteur) { //exp souscripteur conducteur 
//       typePersonne = this.formCreationSouscripteur?.value?.raisonSocial == null ? "PH" : "PM"
//       let personne: PersonneContrat = {
//         role: (this.roles.find((role: any) => role.code === 'CP237') || {}).idParam,
//         typeClient: typePersonne,
//         risqueList: [this.devis.groupes[0].risques[0].idRisque],
//         idClient: this.formCreationSouscripteur?.value?.codeClient,
//         nom: this.formCreationSouscripteur?.value?.nom,
//         prenom: this.formCreationSouscripteur?.value?.prenom,
//         raisonSocial: this.formCreationSouscripteur?.value?.raisonSocial,
//         dateNaissance: moment(this.formCreationConducteur?.value?.DateDeNaissance).format("YYYY-MM-DDT00:00:00.000"),
//         nif: this.formCreationSouscripteur?.value?.nif,
//         nin: this.formCreationSouscripteur?.value?.nin,
//         telephone: {
//           idContact: this.formCreationSouscripteur?.value?.idTelephone,
//           description: this.formCreationSouscripteur?.value?.telephone
//         },
//         email: {
//           idContact: this.formCreationSouscripteur?.value?.idEmail,
//           description: this.formCreationSouscripteur?.value?.email
//         },
//         adresse: {
//           idAdresse: this.formCreationSouscripteur?.value?.idAdresse,
//           description: this.formCreationSouscripteur?.value?.adresse,
//           wilaya: this.formCreationSouscripteur?.value?.wilaya,
//           commune: this.formCreationSouscripteur?.value?.commune
//         },
//         genre: this.formCreationSouscripteur?.value?.genre,
//         situation: this.formCreationSouscripteur?.value?.situation,
//         profession: {
//           id: this.formCreationSouscripteur?.value?.idProfession ?? 0,
//           idProfession: this.formCreationSouscripteur?.value?.profession,
//         },
//         rib: {},
//         commercialLineValues:{
//           ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

//           activite: this.formCreationAssure?.value?.secteurActivite,

//           occupation: this.formCreationAssure?.value?.occupation,

//           naceCode:null
      
//         },
//         permis: {
//           idDocument: 0,
//           description: this.formCreationConducteur?.value?.numeroPermis,
//           categorie: this.formCreationConducteur?.value?.categoriePermis,
//           dateDelivrance: '',
//           wilayaDelivrance: 0
//         }
//       };

//       this.paraRisqueProduit.map((param: any) => {
//         if (param.category == "Conducteur") {
//           switch (param.codeParam) {
//             case "P56":
//               personne.permis.wilayaDelivrance = +this.formCreationConducteur?.value[param.formName]
//               break;
//             case "P54":
//               personne.permis.dateDelivrance = moment(this.formCreationConducteur?.value[param.formName]).format("YYYY-MM-DDT00:00:00.000")
//               break;

//             default:
//               break;
//           }
//         }
//       })

//       this.contrat.personnes.push(personne)
//       typePersonne = this.formCreationAssure?.value?.raisonSocial == null ? "PH" : "PM"
//       let personne1: PersonneContrat = {
//         role: (this.roles.find((role: any) => role.code === 'CP235') || {}).idParam,
//         risqueList: [],
//         typeClient: typePersonne,
//         idClient: this.formCreationAssure?.value?.codeClient,
//         nom: this.formCreationAssure?.value?.nom,
//         prenom: this.formCreationAssure?.value?.prenom,
//         raisonSocial: this.formCreationAssure?.value?.raisonSocial,
//         dateNaissance: this.devis?.typeClient?.description == 'personne physique' ? moment(this.formCreationAssure?.value?.dateNaissance).format("YYYY-MM-DDT00:00:00.000") : '',
//         nif: this.formCreationAssure?.value?.nif,
//         nin: this.formCreationAssure?.value?.nin,
//         telephone: {
//           idContact: this.formCreationAssure?.value?.idTelephone,
//           description: this.formCreationAssure?.value?.telephone
//         },
//         email: {
//           idContact: this.formCreationAssure?.value?.idEmail,
//           description: this.formCreationAssure?.value?.email
//         },
//         adresse: {
//           idAdresse: this.formCreationAssure?.value?.idAdresse,
//           description: this.formCreationAssure?.value?.adresse,
//           wilaya: this.formCreationAssure?.value?.wilaya,
//           commune: this.formCreationAssure?.value?.commune
//         },
//         genre: this.formCreationAssure?.value?.genre,
//         situation: this.formCreationAssure?.value?.situation,
//         profession: {
//           id: this.formCreationAssure?.value?.idProfession ?? 0,
//           idProfession: this.formCreationAssure?.value?.profession,
//         },
//         commercialLineValues:{
//           ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

//           activite: this.formCreationAssure?.value?.secteurActivite,

//           occupation: this.formCreationAssure?.value?.occupation,

//           naceCode:null
      
//         },
//         rib: {
//           idRib: 0,
//           description: this.formCreationAssure?.value?.rib
//         },
//         permis: {}
//       };

//       this.contrat.personnes.push(personne1)
//     }
//     else if (this.isConducteurAssure) { //exp conducteur assuré
//       typePersonne = this.formCreationSouscripteur?.value?.raisonSocial == null ? "PH" : "PM"
//       let personne: PersonneContrat = {
//         role: (this.roles.find((role: any) => role.code === 'CP234') || {}).idParam,
//         typeClient: typePersonne,
//         risqueList: [],
//         idClient: this.formCreationSouscripteur?.value?.codeClient,
//         nom: this.formCreationSouscripteur?.value?.nom,
//         prenom: this.formCreationSouscripteur?.value?.prenom,
//         raisonSocial: this.formCreationSouscripteur?.value?.raisonSocial,
//         dateNaissance: moment(this.formCreationSouscripteur?.value?.dateNaissance).format("YYYY-MM-DDT00:00:00.000"),
//         nif: this.formCreationSouscripteur?.value?.nif,
//         nin: this.formCreationSouscripteur?.value?.nin,
//         telephone: {
//           idContact: this.formCreationSouscripteur?.value?.idTelephone,
//           description: this.formCreationSouscripteur?.value?.telephone
//         },
//         email: {
//           idContact: this.formCreationSouscripteur?.value?.idEmail,
//           description: this.formCreationSouscripteur?.value?.email
//         },
//         adresse: {
//           idAdresse: this.formCreationSouscripteur?.value?.idAdresse,
//           description: this.formCreationSouscripteur?.value?.adresse,
//           wilaya: this.formCreationSouscripteur?.value?.wilaya,
//           commune: this.formCreationSouscripteur?.value?.commune
//         },
//         genre: this.formCreationSouscripteur?.value?.genre,
//         situation: this.formCreationSouscripteur?.value?.situation,
//         profession: {
//           id: this.formCreationSouscripteur?.value?.idProfession ?? 0,
//           idProfession: this.formCreationSouscripteur?.value?.profession,
//         },
//         commercialLineValues:{
//           ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

//           activite: this.formCreationAssure?.value?.secteurActivite,

//           occupation: this.formCreationAssure?.value?.occupation,

//           naceCode:null
      
//         },
//         rib: {},
//         permis: {}
//       };

//       this.contrat.personnes.push(personne)
//       typePersonne = this.formCreationAssure?.value?.raisonSocial == null ? "PH" : "PM"
//       let personne1: PersonneContrat = {
//         role: (this.roles.find((role: any) => role.code === 'CP240') || {}).idParam,
//         typeClient: typePersonne,
//         idClient: this.formCreationAssure?.value?.codeClient,
//         risqueList: [this.devis.groupes[0].risques[0].idRisque],
//         nom: this.formCreationAssure?.value?.nom,
//         prenom: this.formCreationAssure?.value?.prenom,
//         raisonSocial: this.formCreationAssure?.value?.raisonSocial,
//         dateNaissance: moment(this.formCreationConducteur?.value?.DateDeNaissance).format("YYYY-MM-DDT00:00:00.000"),
//         nif: this.formCreationAssure?.value?.nif,
//         nin: this.formCreationAssure?.value?.nin,
//         telephone: {
//           idContact: this.formCreationAssure?.value?.idTelephone,
//           description: this.formCreationAssure?.value?.telephone
//         },
//         email: {
//           idContact: this.formCreationAssure?.value?.idEmail,
//           description: this.formCreationAssure?.value?.email
//         },
//         adresse: {
//           idAdresse: this.formCreationAssure?.value?.idAdresse,
//           description: this.formCreationAssure?.value?.adresse,
//           wilaya: this.formCreationAssure?.value?.wilaya,
//           commune: this.formCreationAssure?.value?.commune
//         },
//         genre: this.formCreationAssure?.value?.genre,
//         situation: this.formCreationAssure?.value?.situation,
//         profession: {
//           id: this.formCreationAssure?.value?.idProfession ?? 0,
//           idProfession: this.formCreationAssure?.value?.profession,
//         },
//         rib: {
//           idRib: 0,
//           description: this.formCreationAssure?.value?.rib
//         },
//         commercialLineValues:{
//           ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

//           activite: this.formCreationAssure?.value?.secteurActivite,

//           occupation: this.formCreationAssure?.value?.occupation,

//           naceCode:null
      
//         },
//         permis: {
//           idDocument: 0,
//           description: this.formCreationConducteur?.value?.numeroPermis,
//           categorie: this.formCreationConducteur?.value?.categoriePermis,
//           dateDelivrance: '',
//           wilayaDelivrance: 0
//         }
//       };

//       this.paraRisqueProduit.map((param: any) => {
//         if (param.category == "Conducteur") {
//           switch (param.codeParam) {
//             case "P56":
//               personne1.permis.wilayaDelivrance = +this.formCreationConducteur?.value[param.formName]
//               break;
//             case "P54":
//               personne1.permis.dateDelivrance = moment(this.formCreationConducteur?.value[param.formName]).format("YYYY-MM-DDT00:00:00.000")
//               break;
//             case "P24":
//               personne1.genre = this.formCreationConducteur?.value[param.formName]
//               break;
//             case "P55":
//               personne1.dateNaissance = moment(this.formCreationConducteur?.value[param.formName]).format("YYYY-MM-DDT00:00:00.000")
//               break;

//             default:
//               break;
//           }
//         }
//       })

//       this.contrat.personnes.push(personne1)
//     }
//     else { //exp séparé 
//       typePersonne = this.formCreationSouscripteur?.value?.raisonSocial == null ? "PH" : "PM"
//       let personne: PersonneContrat = {
//         role: (this.roles.find((role: any) => role.code === 'CP234') || {}).idParam,
//         typeClient: typePersonne,
//         risqueList: [],
//         idClient: this.formCreationSouscripteur?.value?.codeClient,
//         nom: this.formCreationSouscripteur?.value?.nom,
//         prenom: this.formCreationSouscripteur?.value?.prenom,
//         raisonSocial: this.formCreationSouscripteur?.value?.raisonSocial,
//         dateNaissance: moment(this.formCreationSouscripteur?.value?.dateNaissance).format("YYYY-MM-DDT00:00:00.000"),
//         nif: this.formCreationSouscripteur?.value?.nif,
//         nin: this.formCreationSouscripteur?.value?.nin,
//         telephone: {
//           idContact: this.formCreationSouscripteur?.value?.idTelephone,
//           description: this.formCreationSouscripteur?.value?.telephone
//         },
//         email: {
//           idContact: this.formCreationSouscripteur?.value?.idEmail,
//           description: this.formCreationSouscripteur?.value?.email
//         },
//         adresse: {
//           idAdresse: this.formCreationSouscripteur?.value?.idAdresse,
//           description: this.formCreationSouscripteur?.value?.adresse,
//           wilaya: this.formCreationSouscripteur?.value?.wilaya,
//           commune: this.formCreationSouscripteur?.value?.commune
//         },
//         genre: this.formCreationSouscripteur?.value?.genre,
//         situation: this.formCreationSouscripteur?.value?.situation,
//         profession: {
//           id: this.formCreationSouscripteur?.value?.idProfession ?? 0,
//           idProfession: this.formCreationSouscripteur?.value?.profession,
//         },
//         rib: {},
//         commercialLineValues:{
//           ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

//           activite: this.formCreationAssure?.value?.secteurActivite,

//           occupation: this.formCreationAssure?.value?.occupation,

//           naceCode:null
      
//         },
//         permis: {}
//       };

//       this.contrat.personnes.push(personne)
//       typePersonne = this.formCreationAssure?.value?.raisonSocial == null ? "PH" : "PM"

//       let personne1: PersonneContrat = {
//         role: (this.roles.find((role: any) => role.code === 'CP235') || {}).idParam,
//         typeClient: typePersonne,
//         risqueList: [],
//         idClient: this.formCreationAssure?.value?.codeClient,
//         nom: this.formCreationAssure?.value?.nom,
//         prenom: this.formCreationAssure?.value?.prenom,
//         raisonSocial: this.formCreationAssure?.value?.raisonSocial,
//         dateNaissance: this.devis?.typeClient?.description == 'personne physique' ? moment(this.formCreationAssure?.value?.dateNaissance).format("YYYY-MM-DDT00:00:00.000") : '',
//         nif: this.formCreationAssure?.value?.nif,
//         nin: this.formCreationAssure?.value?.nin,
//         telephone: {
//           idContact: this.formCreationAssure?.value?.idTelephone,
//           description: this.formCreationAssure?.value?.telephone
//         },
//         email: {
//           idContact: this.formCreationAssure?.value?.idEmail,
//           description: this.formCreationAssure?.value?.email
//         },
//         adresse: {
//           idAdresse: this.formCreationAssure?.value?.idAdresse,
//           description: this.formCreationAssure?.value?.adresse,
//           wilaya: this.formCreationAssure?.value?.wilaya,
//           commune: this.formCreationAssure?.value?.commune
//         },
//         genre: this.formCreationAssure?.value?.genre,
//         situation: this.formCreationAssure?.value?.situation,
//         profession: {
//           id: this.formCreationAssure?.value?.idProfession ?? 0,
//           idProfession: this.formCreationAssure?.value?.profession,
//         },
//         rib: {
//           idRib: 0,
//           description: this.formCreationAssure?.value?.rib
//         },
//         commercialLineValues:{
//           ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

//           activite: this.formCreationAssure?.value?.secteurActivite,

//           occupation: this.formCreationAssure?.value?.occupation,

//           naceCode:null
      
//         },
//         permis: {}
//       };

//       this.contrat.personnes.push(personne1)
//       if (this.codeProduit == '45A') {
//         typePersonne = this.formCreationConducteur?.value?.raisonSocial == null ? "PH" : "PM"
//         let personne2: PersonneContrat = {
//           role: (this.roles.find((role: any) => role.code === 'CP233') || {}).idParam,
//           typeClient: typePersonne,
//           risqueList: [this.devis.groupes[0].risques[0].idRisque],
//           idClient: this.formCreationConducteur?.value?.codeClient,
//           nom: this.formCreationConducteur?.value?.nom,
//           prenom: this.formCreationConducteur?.value?.prenom,
//           raisonSocial: '',
//           dateNaissance: moment(this.formCreationConducteur?.value?.DateDeNaissance).format("YYYY-MM-DDT00:00:00.000"),
//           nif: null,
//           nin: '',
//           telephone: {
//             idContact: this.formCreationConducteur?.value?.idTelephone,
//             description: this.formCreationConducteur?.value?.telephone
//           },
//           email: {
//             idContact: this.formCreationConducteur?.value?.idEmail,
//             description: this.formCreationConducteur?.value?.email
//           },
//           adresse: {
//             idAdresse: this.formCreationConducteur?.value?.idAdresse,
//             description: this.formCreationConducteur?.value?.adresse,
//             wilaya: this.formCreationConducteur?.value?.wilaya,
//             commune: this.formCreationConducteur?.value?.commune
//           },
//           genre: 0,
//           situation: this.formCreationConducteur?.value?.situation,
//           profession: {
//             id: this.formCreationConducteur?.value?.idProfession ?? 0,
//             idProfession: this.formCreationConducteur?.value?.profession,
//           },
//           rib: {},
//           commercialLineValues:{
//             ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,
  
//             activite: this.formCreationAssure?.value?.secteurActivite,
  
//             occupation: this.formCreationAssure?.value?.occupation,
  
//             naceCode:null
        
//           },
//           permis: {
//             idDocument: 0,
//             description: this.formCreationConducteur?.value?.numeroPermis,
//             categorie: this.formCreationConducteur?.value?.categoriePermis,
//             dateDelivrance: '',
//             wilayaDelivrance: 0
//           }
//         };

//         this.paraRisqueProduit.map((param: any) => {
//           if (param.category == "Conducteur") {
//             switch (param.codeParam) {
//               case "P56":
//                 personne2.permis.wilayaDelivrance = +this.formCreationConducteur?.value[param.formName]
//                 break;
//               case "P54":
//                 personne2.permis.dateDelivrance = moment(this.formCreationConducteur?.value[param.formName]).format("YYYY-MM-DDT00:00:00.000")
//                 break;
//               case "P24":
//                 personne2.genre = this.formCreationConducteur?.value[param.formName]
//                 break;
//               case "P55":
//                 personne2.dateNaissance = moment(this.formCreationConducteur?.value[param.formName]).format("YYYY-MM-DDT00:00:00.000")
//                 break;

//               default:
//                 break;
//             }
//           }
//         })

//         this.contrat.personnes.push(personne2)
//       }

//     }

//     this.contrat.risqueList = [
//       {
//         risque: []
//       }
//     ];
//     let idparam
//     let idreponse = null
//     let description = ""
//     let paramElement: any
//     let paramElement2: any
//     let risque: any = {}
//     risque.paramList = []

//     let groupeList: any = []
//     //************* param risque
//     if (!this.multiRisque) {
//       this.paraRisqueProduit.map((param: any) => {
//         //FIX A REVOIR 

//         if (param.category != "Conducteur") {
//           Object.keys(this.formCreationRisque.value).map((paramFormName: any) => {
//             if (paramFormName == param.formName) {

//               idparam = param.idParamRisque
//               if (param.typeChamp?.description == 'Liste of values') {

//                 idreponse = this.formCreationRisque.get(paramFormName).value
//                 description = ''
//               } else {

//                 idreponse = null

//                 if (paramFormName == 'Marque' || paramFormName == 'Modèle') {
//                   idreponse = this.formCreationRisque.get(paramFormName).value
//                   description = ''
//                 }
//                 else {
//                   description = this.formCreationRisque.get(paramFormName).value
//                   idreponse = null
//                 }
//               }

//               paramElement = {
//                 "idParam": idparam,
//                 "reponse": {
//                   "idReponse": idreponse,
//                   "description": description
//                 }
//               }

//             }
//           })

//           risque.paramList.push(paramElement)




//           //ancient this.contrat.risqueList[0].risque.push(paramElement)
//         }
//         else {
//           Object.keys(this.formCreationConducteur.value).map((paramFormName: any) => {
//             if (paramFormName == param.formName) {

//               idparam = param.idParamRisque
//               if (param.typeChamp?.description == 'Liste of values') {

//                 idreponse = this.formCreationConducteur.get(paramFormName).value
//                 description = ''
//               } else {

//                 idreponse = null,
//                   description = this.formCreationConducteur.get(paramFormName).value
//               }
//               paramElement2 = {
//                 "idParam": idparam,
//                 "reponse": {
//                   "idReponse": idreponse,
//                   "description": description
//                 }
//               }

//             }
//           })
//           risque.paramList.push(paramElement2)



//           //ancient this.contrat.risqueList[0].risque.push(paramElement2)
//         }

//       })

//       index = index + 1
//       groupeList.push({
//         "idRisque": this.devis.groupes[0].risques[0].idRisque,
//         "paramList": risque.paramList
//       })


//       this.contratGroupe = [{ "groupe": { "description": this.devis.groupes[0].description, "idGroupe": this.devis.groupes[0].idGroupe }, "groupeList": groupeList, },

//       ]

//     } else {
//       this.contratGroupe = this.devis.groupes
//     }


//     this.contrat.groupes = this.contratGroupe

//     this.contrat.auditUser = sessionStorage.getItem("userId")
//     const hmac = await this.cryptoService.generateHmac("XVxtWzI6T1RITUFORScYPHxBDww6dA9EUg==", this.contrat);
   
//     const plainContrat = { ...this.contrat }; // Spread operato
//     const stringifiedContrat = JSON.stringify(plainContrat);
//     const dataContrat = {
//       stringJson:stringifiedContrat,
//       signature: hmac
//     }
    
//     // this.contratService.createContrat(dataContrat).subscribe({
//       this.contratService.createContrat(this.contrat).subscribe({

//       next: (data: any) => {
//         this.valider = false;
//         Swal.fire(
//           `La police N° ${data.idContrat} a été créer avec succés.`,
//           ``,
//           `success`
//         )
//         this.redirectConsultation()
//       },
//       error: (error) => {
//         this.valider = false;
//         let message = ""
//         let code
//         if (error.code == undefined)
//           code = error.status
//         else
//           code = error.code
//         switch (code) {
//           case 400: // actif
//             message = error.message
//             break;

//           case 402: // actif
//             message = "Erreur lors de la validation du contrat, veuillez contacter l'administrateur."
//             break;
//           case 404: // actif
//             message = error.message
//             break;
//           default:
//             message = "Erreur système, veuillez contacter l'administrateur."
//             break;
//         }
//         Swal.fire(
//           message,
//           ``,
//           `error`
//         )
//         //////////console.log(error);

//       }
//     });
//   }
async submitContrat() {
  const produitVoiture = ["45A","45F","45L"]

  let index = 0
  this.formCreationContrat.enable();
  this.formCreationSouscripteur.enable();

  this.formCreationAssure.enable();
  if (this.codeProduit == '45A')
    this.formCreationConducteur.enable();

  this.formCreationRisque.enable();

  let souscripteur = this.formCreationSouscripteur?.value
  let assure = this.formCreationAssure?.value
  let conducteur = this.formCreationConducteur?.value
  const originalDateEffet = this.formCreationContrat.get("dateEffet").value;
    const updatedDateEffet = moment.utc(originalDateEffet).add(1,"hour").toISOString();  

    console.log('jesuis le formCreationContrat ',this.formCreationContrat)
    console.log('jesuis le souscripteur ', souscripteur)

    this.valider = true;
    this.contrat.devis = +this.devis?.idDevis;
    this.contrat.agence = this.formCreationContrat?.get("agence")?.value;
    // this.formCreationContrat.get("dateEffet").setValue(moment(this.formCreationContrat.get("dateEffet").value).format("YYYY-MM-DDT00:00:00.000"))
    // this.contrat.dateEffet = this.formCreationContrat.value?.dateEffet;
    this.formCreationContrat.get("dateEffet").setValue(updatedDateEffet);
this.contrat.dateEffet = updatedDateEffet;
    this.contrat.dateExpiration = moment.utc(this.formCreationContrat.value?.dateExpiration).add(1,"hour").toISOString();
    let typePersonne
    this.contrat.personnes = [];
  //
  // this.contrat.dateExpiration = this.formCreationContrat.value?.dateExpiration;
  // let typePersonne
  // this.contrat.personnes = [];

  if(souscripteur.nom == assure.nom && souscripteur.prenom == assure.prenom && souscripteur.dateNaissance == assure.dateNaissance)
  {
    this.isAssure = true;
    if(souscripteur.nom == conducteur?.nom && souscripteur.prenom == conducteur?.prenom && souscripteur.dateNaissance == conducteur?.dateNaissance)
    {
      this.isConducteur = true
    } else if(assure.nom == conducteur?.nom && assure.prenom == conducteur?.prenom && assure.dateNaissance == conducteur?.dateNaissance)
    {
      this.isConducteurAssure = true
    }
  } else {
    if(souscripteur.nom == conducteur?.nom && souscripteur.prenom == conducteur?.prenom && souscripteur.dateNaissance == conducteur?.dateNaissance)
    {
      this.isConducteur = true
    } else if(assure.nom == conducteur?.nom && assure.prenom == conducteur?.prenom && assure.dateNaissance == conducteur?.dateNaissance)
    {
      this.isConducteurAssure = true
    }
  }
  if(!produitVoiture.includes(this.codeProduit)){
    this.isConducteur=false
    this.isConducteurAssure= false
  }

  if (this.isAssure && this.isConducteur) { //exp les trois
    typePersonne = this.formCreationSouscripteur?.value?.raisonSocial == null ? "PH" : "PM"
    let personne: PersonneContrat = {
      role: (this.roles.find((role: any) => role.code === 'CP238') || {}).idParam,
      typeClient: typePersonne,
      risqueList: this.devis.produit.codeProduit == "45L" && this.devis.groupes.length ==0 ?this.devis.groupes:  [this.devis.groupes[0].risques[0].idRisque] ,
      idClient: this.formCreationSouscripteur?.value?.codeClient,
      nom: this.formCreationSouscripteur?.value?.nom,
      prenom: this.formCreationSouscripteur?.value?.prenom,
      raisonSocial: this.formCreationSouscripteur?.value?.raisonSocial,
      dateNaissance: moment.utc(this.formCreationConducteur?.value?.DateDeNaissance).add(1,"hour").toISOString(),
      nif: this.formCreationSouscripteur?.value?.nif,
      nin: this.formCreationSouscripteur?.value?.nin,
      telephone: {
        idContact: this.formCreationSouscripteur?.value?.idTelephone,
        description: this.formCreationSouscripteur?.value?.telephone
      },
      email: {
        idContact: this.formCreationSouscripteur?.value?.idEmail,
        description: this.formCreationSouscripteur?.value?.email
      },
      adresse: {
        idAdresse: this.formCreationSouscripteur?.value?.idAdresse,
        description: this.formCreationSouscripteur?.value?.adresse,
        wilaya: this.formCreationSouscripteur?.value?.wilaya,
        commune: this.formCreationSouscripteur?.value?.commune
      },
      genre: this.formCreationSouscripteur?.value?.genre,
      situation: this.formCreationSouscripteur?.value?.situation,
      profession: {
        id: this.formCreationSouscripteur?.value?.idProfession,
        idProfession: this.formCreationSouscripteur?.value?.profession,
      },
      rib: {
        idRib: 0,
        description: this.formCreationAssure?.value?.rib
      },
      commercialLineValues:{
        ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

        activite: this.formCreationAssure?.value?.secteurActivite,

        occupation: this.formCreationAssure?.value?.occupation,

        naceCode:null
    
      },
      permis: {
        idDocument: 0,
        description: this.formCreationConducteur?.value?.numeroPermis,
        categorie: this.formCreationConducteur?.value?.categoriePermis,
        dateDelivrance: '',
        wilayaDelivrance: 0
      }
    };

    this.paraRisqueProduit.map((param: any) => {
      if (param.category == "Conducteur") {

        switch (param.codeParam) {
          case "P56":
            personne.permis.wilayaDelivrance = +this.formCreationConducteur?.value[param.formName]
            break;
          case "P54":
            personne.permis.dateDelivrance = moment.utc(this.formCreationConducteur?.value[param.formName]).add(1,"hour").toISOString()
            break;

          default:
            break;
        }
      }
    })

    this.contrat.personnes.push(personne)
  }
  else if (this.isAssure && this.isConducteurAssure) { //exp les trois
    typePersonne = this.formCreationSouscripteur?.value?.raisonSocial == null ? "PH" : "PM"
    let personne: PersonneContrat = {
      role: (this.roles.find((role: any) => role.code === 'CP238') || {}).idParam,
      typeClient: typePersonne,
      risqueList: [this.devis.groupes[0].risques[0].idRisque],
      idClient: this.formCreationSouscripteur?.value?.codeClient,
      nom: this.formCreationSouscripteur?.value?.nom,
      prenom: this.formCreationSouscripteur?.value?.prenom,
      raisonSocial: this.formCreationSouscripteur?.value?.raisonSocial,
      dateNaissance: moment.utc(this.formCreationConducteur?.value?.DateDeNaissance).add(1,"hour").toISOString(),
      nif: this.formCreationSouscripteur?.value?.nif,
      nin: this.formCreationSouscripteur?.value?.nin,
      telephone: {
        idContact: this.formCreationSouscripteur?.value?.idTelephone,
        description: this.formCreationSouscripteur?.value?.telephone
      },
      email: {
        idContact: this.formCreationSouscripteur?.value?.idEmail,
        description: this.formCreationSouscripteur?.value?.email
      },
      adresse: {
        idAdresse: this.formCreationSouscripteur?.value?.idAdresse,
        description: this.formCreationSouscripteur?.value?.adresse,
        wilaya: this.formCreationSouscripteur?.value?.wilaya,
        commune: this.formCreationSouscripteur?.value?.commune
      },
      genre: this.formCreationSouscripteur?.value?.genre,
      situation: this.formCreationSouscripteur?.value?.situation,
      profession: {
        id: this.formCreationSouscripteur?.value?.idProfession,
        idProfession: this.formCreationSouscripteur?.value?.profession,
      },
      rib: {
        idRib: 0,
        description: this.formCreationAssure?.value?.rib
      },
      commercialLineValues:{

        //ineine

        ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

        activite: this.formCreationAssure?.value?.secteurActivite,

        occupation: this.formCreationAssure?.value?.occupation
        ,naceCode:null








      },
      permis: {
        idDocument: 0,
        description: this.formCreationConducteur?.value?.numeroPermis,
        categorie: this.formCreationConducteur?.value?.categoriePermis,
        dateDelivrance: '',
        wilayaDelivrance: 0
      }
    };

    this.paraRisqueProduit.map((param: any) => {
      if (param.category == "Conducteur") {
        switch (param.codeParam) {
          case "P56":
            personne.permis.wilayaDelivrance = +this.formCreationConducteur?.value[param.formName]
            break;
          case "P54":
            personne.permis.dateDelivrance = moment.utc(this.formCreationConducteur?.value[param.formName]).add(1,"hour").toISOString()
            break;

          default:
            break;
        }
      }
    })

    this.contrat.personnes.push(personne)
  }
  else if (this.isAssure) { //exp assuré + souscripteur

    console.log('is assure')
    typePersonne = this.formCreationSouscripteur?.value?.raisonSocial == null ? "PH" : "PM"
    let personne: PersonneContrat = {
      role: (this.roles.find((role: any) => role.code === 'CP236') || {}).idParam,
      typeClient: typePersonne,
      risqueList: [],
      idClient: this.formCreationSouscripteur?.value?.codeClient,
      nom: this.formCreationSouscripteur?.value?.nom,
      prenom: this.formCreationSouscripteur?.value?.prenom,
      raisonSocial: this.formCreationSouscripteur?.value?.raisonSocial,
      dateNaissance: this.devis?.typeClient?.description == 'personne physique' ? moment.utc(this.formCreationAssure?.value?.dateNaissance).add(1,"hour").toISOString() : '',
      nif: this.formCreationSouscripteur?.value?.nif,
      nin: this.formCreationSouscripteur?.value?.nin,
      telephone: {
        idContact: this.formCreationSouscripteur?.value?.idTelephone,
        description: this.formCreationSouscripteur?.value?.telephone
      },
      email: {
        idContact: this.formCreationSouscripteur?.value?.idEmail,
        description: this.formCreationSouscripteur?.value?.email
      },
      adresse: {
        idAdresse: this.formCreationSouscripteur?.value?.idAdresse,
        description: this.formCreationSouscripteur?.value?.adresse,
        wilaya: this.formCreationSouscripteur?.value?.wilaya,
        commune: this.formCreationSouscripteur?.value?.commune
      },
      genre: this.formCreationSouscripteur?.value?.genre,
      situation: this.formCreationSouscripteur?.value?.situation,
      profession: {
        id: this.formCreationSouscripteur?.value?.idProfession,
        idProfession: this.formCreationSouscripteur?.value?.profession,
      },
      rib: {
        idRib: 0,
        description: this.formCreationAssure?.value?.rib
      },
      commercialLineValues:{

        //ineine

        ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

        activite: this.formCreationAssure?.value?.secteurActivite,

        occupation: this.formCreationAssure?.value?.occupation
        ,naceCode:null







      },
      permis: {}
    };

    this.contrat.personnes.push(personne)
    if (this.codeProduit == '45A') {
      typePersonne = this.formCreationConducteur?.value?.raisonSocial == null ? "PH" : "PM"
      let personne2: PersonneContrat = {
        role: (this.roles.find((role: any) => role.code === 'CP233') || {}).idParam,
        typeClient: typePersonne,
        risqueList: [this.devis.groupes[0].risques[0].idRisque],
        idClient: this.formCreationConducteur?.value?.codeClient,
        nom: this.formCreationConducteur?.value?.nom,
        prenom: this.formCreationConducteur?.value?.prenom,
        raisonSocial: '',
        dateNaissance: moment.utc(this.formCreationConducteur?.value?.DateDeNaissance).add(1,"hour").toISOString(),
        nif: null,
        nin: '',
        telephone: {
          idContact: this.formCreationConducteur?.value?.idTelephone,
          description: this.formCreationConducteur?.value?.telephone
        },
        email: {
          idContact: this.formCreationConducteur?.value?.idEmail,
          description: this.formCreationConducteur?.value?.email
        },
        adresse: {
          idAdresse: this.formCreationConducteur?.value?.idAdresse,
          description: this.formCreationConducteur?.value?.adresse,
          wilaya: this.formCreationConducteur?.value?.wilaya,
          commune: this.formCreationConducteur?.value?.commune
        },
        genre: 0,
        situation: this.formCreationConducteur?.value?.situation,
        profession: {
          id: this.formCreationConducteur?.value?.idProfession,
          idProfession: this.formCreationConducteur?.value?.profession,
        },
        rib: {},
        commercialLineValues:{
          //ineine
          idlineOfBusiness: this.formCreationAssure?.value?.lineOfBusiness,
          idsecteurActivite: this.formCreationAssure?.value?.secteurActivite,
          idoccupation: this.formCreationAssure?.value?.occupation
          ,naceCode:null
 
 
 
        },
        permis: {
          idDocument: 0,
          description: this.formCreationConducteur?.value?.numeroPermis,
          categorie: this.formCreationConducteur?.value?.categoriePermis,
          dateDelivrance: '',
          wilayaDelivrance: 0
        }
      };

      this.paraRisqueProduit.map((param: any) => {
        if (param.category == "Conducteur") {
          switch (param.codeParam) {
            case "P56":
              personne2.permis.wilayaDelivrance = +this.formCreationConducteur?.value[param.formName]
              break;
            case "P54":
              personne2.permis.dateDelivrance = moment.utc(this.formCreationConducteur?.value[param.formName]).add(1,"hour").toISOString()
              break;
            case "P24":
              personne2.genre = this.formCreationConducteur?.value[param.formName]
              break;
            case "P55":
              personne2.dateNaissance = moment.utc(this.formCreationConducteur?.value[param.formName]).add(1,"hour").toISOString()
              break;

            default:
              break;
          }
        }
      })

      this.contrat.personnes.push(personne2)
    }
  }
  else if (this.isConducteur) { //exp souscripteur conducteur
    typePersonne = this.formCreationSouscripteur?.value?.raisonSocial == null ? "PH" : "PM"
    let personne: PersonneContrat = {
      role: (this.roles.find((role: any) => role.code === 'CP237') || {}).idParam,
      typeClient: typePersonne,
      risqueList: [this.devis.groupes[0].risques[0].idRisque],
      idClient: this.formCreationSouscripteur?.value?.codeClient,
      nom: this.formCreationSouscripteur?.value?.nom,
      prenom: this.formCreationSouscripteur?.value?.prenom,
      raisonSocial: this.formCreationSouscripteur?.value?.raisonSocial,
      dateNaissance: moment.utc(this.formCreationConducteur?.value?.DateDeNaissance).add(1,"hour").toISOString(),
      nif: this.formCreationSouscripteur?.value?.nif,
      nin: this.formCreationSouscripteur?.value?.nin,
      telephone: {
        idContact: this.formCreationSouscripteur?.value?.idTelephone,
        description: this.formCreationSouscripteur?.value?.telephone
      },
      email: {
        idContact: this.formCreationSouscripteur?.value?.idEmail,
        description: this.formCreationSouscripteur?.value?.email
      },
      adresse: {
        idAdresse: this.formCreationSouscripteur?.value?.idAdresse,
        description: this.formCreationSouscripteur?.value?.adresse,
        wilaya: this.formCreationSouscripteur?.value?.wilaya,
        commune: this.formCreationSouscripteur?.value?.commune
      },
      genre: this.formCreationSouscripteur?.value?.genre,
      situation: this.formCreationSouscripteur?.value?.situation,
      profession: {
        id: this.formCreationSouscripteur?.value?.idProfession,
        idProfession: this.formCreationSouscripteur?.value?.profession,
      },
      rib: {},
      commercialLineValues:{

        //ineine

        ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

        activite: this.formCreationAssure?.value?.secteurActivite,

        occupation: this.formCreationAssure?.value?.occupation

        ,naceCode:null






      },
      permis: {
        idDocument: 0,
        description: this.formCreationConducteur?.value?.numeroPermis,
        categorie: this.formCreationConducteur?.value?.categoriePermis,
        dateDelivrance: '',
        wilayaDelivrance: 0
      }
    };

    this.paraRisqueProduit.map((param: any) => {
      if (param.category == "Conducteur") {
        switch (param.codeParam) {
          case "P56":
            personne.permis.wilayaDelivrance = +this.formCreationConducteur?.value[param.formName]
            break;
          case "P54":
            personne.permis.dateDelivrance = moment.utc(this.formCreationConducteur?.value[param.formName]).add(1,"hour").toISOString()
            break;

          default:
            break;
        }
      }
    })

    this.contrat.personnes.push(personne)
    typePersonne = this.formCreationAssure?.value?.raisonSocial == null ? "PH" : "PM"
    let personne1: PersonneContrat = {
      role: (this.roles.find((role: any) => role.code === 'CP235') || {}).idParam,
      risqueList: [],
      typeClient: typePersonne,
      idClient: this.formCreationAssure?.value?.codeClient,
      nom: this.formCreationAssure?.value?.nom,
      prenom: this.formCreationAssure?.value?.prenom,
      raisonSocial: this.formCreationAssure?.value?.raisonSocial,
      dateNaissance: this.devis?.typeClient?.description == 'personne physique' ? moment.utc(this.formCreationAssure?.value?.dateNaissance).add(1,"hour").toISOString() : '',
      nif: this.formCreationAssure?.value?.nif,
      nin: this.formCreationAssure?.value?.nin,
      telephone: {
        idContact: this.formCreationAssure?.value?.idTelephone,
        description: this.formCreationAssure?.value?.telephone
      },
      email: {
        idContact: this.formCreationAssure?.value?.idEmail,
        description: this.formCreationAssure?.value?.email
      },
      adresse: {
        idAdresse: this.formCreationAssure?.value?.idAdresse,
        description: this.formCreationAssure?.value?.adresse,
        wilaya: this.formCreationAssure?.value?.wilaya,
        commune: this.formCreationAssure?.value?.commune
      },
      genre: this.formCreationAssure?.value?.genre,
      situation: this.formCreationAssure?.value?.situation,
      profession: {
        id: this.formCreationAssure?.value?.idProfession,
        idProfession: this.formCreationAssure?.value?.profession,
      },
      rib: {
        idRib: 0,
        description: this.formCreationAssure?.value?.rib
      },
      commercialLineValues:{

        //ineine

        ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

        activite: this.formCreationAssure?.value?.secteurActivite,

        occupation: this.formCreationAssure?.value?.occupation

        ,naceCode:null






      },
      permis: {}
    };

    this.contrat.personnes.push(personne1)
  }
  else if (this.isConducteurAssure) { //exp conducteur assuré
    //////////console.log("condAssureé")
    typePersonne = this.formCreationSouscripteur?.value?.raisonSocial == null ? "PH" : "PM"
    let personne: PersonneContrat = {
      role: (this.roles.find((role: any) => role.code === 'CP234') || {}).idParam,
      typeClient: typePersonne,
      risqueList: [],
      idClient: this.formCreationSouscripteur?.value?.codeClient,
      nom: this.formCreationSouscripteur?.value?.nom,
      prenom: this.formCreationSouscripteur?.value?.prenom,
      raisonSocial: this.formCreationSouscripteur?.value?.raisonSocial,
      dateNaissance: moment.utc(this.formCreationSouscripteur?.value?.dateNaissance).add(1,"hour").toISOString(),
      nif: this.formCreationSouscripteur?.value?.nif,
      nin: this.formCreationSouscripteur?.value?.nin,
      telephone: {
        idContact: this.formCreationSouscripteur?.value?.idTelephone,
        description: this.formCreationSouscripteur?.value?.telephone
      },
      email: {
        idContact: this.formCreationSouscripteur?.value?.idEmail,
        description: this.formCreationSouscripteur?.value?.email
      },
      adresse: {
        idAdresse: this.formCreationSouscripteur?.value?.idAdresse,
        description: this.formCreationSouscripteur?.value?.adresse,
        wilaya: this.formCreationSouscripteur?.value?.wilaya,
        commune: this.formCreationSouscripteur?.value?.commune
      },
      genre: this.formCreationSouscripteur?.value?.genre,
      situation: this.formCreationSouscripteur?.value?.situation,
      profession: {
        id: this.formCreationSouscripteur?.value?.idProfession,
        idProfession: this.formCreationSouscripteur?.value?.profession,
      },
      rib: {},
      commercialLineValues:{

        //ineine

        ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

        activite: this.formCreationAssure?.value?.secteurActivite,

        occupation: this.formCreationAssure?.value?.occupation
        ,naceCode:null







      },
      permis: {}
    };

    this.contrat.personnes.push(personne)
    typePersonne = this.formCreationAssure?.value?.raisonSocial == null ? "PH" : "PM"
    let personne1: PersonneContrat = {
      role: (this.roles.find((role: any) => role.code === 'CP240') || {}).idParam,
      typeClient: typePersonne,
      idClient: this.formCreationAssure?.value?.codeClient,
      risqueList: [this.devis.groupes[0].risques[0].idRisque],
      nom: this.formCreationAssure?.value?.nom,
      prenom: this.formCreationAssure?.value?.prenom,
      raisonSocial: this.formCreationAssure?.value?.raisonSocial,
      dateNaissance: moment.utc(this.formCreationConducteur?.value?.DateDeNaissance).add(1,"hour").toISOString(),
      nif: this.formCreationAssure?.value?.nif,
      nin: this.formCreationAssure?.value?.nin,
      telephone: {
        idContact: this.formCreationAssure?.value?.idTelephone,
        description: this.formCreationAssure?.value?.telephone
      },
      email: {
        idContact: this.formCreationAssure?.value?.idEmail,
        description: this.formCreationAssure?.value?.email
      },
      adresse: {
        idAdresse: this.formCreationAssure?.value?.idAdresse,
        description: this.formCreationAssure?.value?.adresse,
        wilaya: this.formCreationAssure?.value?.wilaya,
        commune: this.formCreationAssure?.value?.commune
      },
      genre: this.formCreationAssure?.value?.genre,
      situation: this.formCreationAssure?.value?.situation,
      profession: {
        id: this.formCreationAssure?.value?.idProfession,
        idProfession: this.formCreationAssure?.value?.profession,
      },
      rib: {
        idRib: 0,
        description: this.formCreationAssure?.value?.rib
      },
      commercialLineValues:{

        //ineine

        ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

        activite: this.formCreationAssure?.value?.secteurActivite,

        occupation: this.formCreationAssure?.value?.occupation

        ,naceCode:null






      },
      permis: {
        idDocument: 0,
        description: this.formCreationConducteur?.value?.numeroPermis,
        categorie: this.formCreationConducteur?.value?.categoriePermis,
        dateDelivrance: '',
        wilayaDelivrance: 0
      }
    };

    this.paraRisqueProduit.map((param: any) => {
      if (param.category == "Conducteur") {
        switch (param.codeParam) {
          case "P56":
            personne1.permis.wilayaDelivrance = +this.formCreationConducteur?.value[param.formName]
            break;
          case "P54":
            personne1.permis.dateDelivrance = moment.utc(this.formCreationConducteur?.value[param.formName]).add(1,"hour").toISOString()
            break;
          case "P24":
            personne1.genre = this.formCreationConducteur?.value[param.formName]
            break;
          case "P55":
            personne1.dateNaissance = moment.utc(this.formCreationConducteur?.value[param.formName]).add(1,"hour").toISOString()
            break;

          default:
            break;
        }
      }
    })

    this.contrat.personnes.push(personne1)
  }
  else { //exp séparé
    console.log("on sait pas ",this.formCreationSouscripteur)
    typePersonne = this.formCreationSouscripteur?.value?.raisonSocial == null ? "PH" : "PM"
    let personne: PersonneContrat = {
      role: (this.roles.find((role: any) => role.code === 'CP234') || {}).idParam,
      typeClient: typePersonne,
      risqueList: [],
      idClient: this.formCreationSouscripteur?.value?.codeClient ,
      //this.formCreationSouscripteur?.value?.codeClient
      nom: this.formCreationSouscripteur?.value?.nom,
      prenom: this.formCreationSouscripteur?.value?.prenom,
      raisonSocial: this.formCreationSouscripteur?.value?.raisonSocial,
      dateNaissance: typePersonne == 'PH' ? moment.utc(this.formCreationSouscripteur?.value?.dateNaissance).add(1,"hour").toISOString() : '',
      nif: this.formCreationSouscripteur?.value?.nif,
      nin: this.formCreationSouscripteur?.value?.nin,
      telephone: {
        idContact: this.formCreationSouscripteur?.value?.idTelephone,
        description: this.formCreationSouscripteur?.value?.telephone
      },
      email: {
        idContact: this.formCreationSouscripteur?.value?.idEmail,
        description: this.formCreationSouscripteur?.value?.email
      },
      adresse: {
        idAdresse: this.formCreationSouscripteur?.value?.idAdresse,
        description: this.formCreationSouscripteur?.value?.adresse,
        wilaya: this.formCreationSouscripteur?.value?.wilaya,
        commune: this.formCreationSouscripteur?.value?.commune
      },
      genre: this.formCreationSouscripteur?.value?.genre,
      situation: this.formCreationSouscripteur?.value?.situation,
      profession: {
        id: this.formCreationSouscripteur?.value?.idProfession,
        idProfession: this.formCreationSouscripteur?.value?.profession,
      },
      rib: {},
      commercialLineValues:{

        //ineine

        ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

        activite: this.formCreationAssure?.value?.secteurActivite,

        occupation: this.formCreationAssure?.value?.occupation
        ,naceCode:null







      },

      permis: {}
    };

    this.contrat.personnes.push(personne)
    typePersonne = this.formCreationAssure?.value?.raisonSocial == null ? "PH" : "PM"

    let personne1: PersonneContrat = {
      role: (this.roles.find((role: any) => role.code === 'CP235') || {}).idParam,
      typeClient: typePersonne,
      risqueList: [],
      idClient: this.formCreationAssure?.value?.codeClient,
      nom: this.formCreationAssure?.value?.nom,
      prenom: this.formCreationAssure?.value?.prenom,
      raisonSocial: this.formCreationAssure?.value?.raisonSocial,
      dateNaissance: this.devis?.typeClient?.description == 'personne physique' ? moment.utc(this.formCreationAssure?.value?.dateNaissance).add(1,"hour").toISOString() : '',
      nif: this.formCreationAssure?.value?.nif,
      nin: this.formCreationAssure?.value?.nin,
      telephone: {
        idContact: this.formCreationAssure?.value?.idTelephone,
        description: this.formCreationAssure?.value?.telephone
      },
      email: {
        idContact: this.formCreationAssure?.value?.idEmail,
        description: this.formCreationAssure?.value?.email
      },
      adresse: {
        idAdresse: this.formCreationAssure?.value?.idAdresse,
        description: this.formCreationAssure?.value?.adresse,
        wilaya: this.formCreationAssure?.value?.wilaya,
        commune: this.formCreationAssure?.value?.commune
      },
      genre: this.formCreationAssure?.value?.genre,
      situation: this.formCreationAssure?.value?.situation,
      profession: {
        id: this.formCreationAssure?.value?.idProfession,
        idProfession: this.formCreationAssure?.value?.profession,
      },
      rib: {
        idRib: 0,
        description: this.formCreationAssure?.value?.rib
      },
      commercialLineValues:{

        //ineine

        ligneDeBusiness: this.formCreationAssure?.value?.lineOfBusiness,

        activite: this.formCreationAssure?.value?.secteurActivite,

        occupation: this.formCreationAssure?.value?.occupation
        ,naceCode:null







      },
      permis: {}
    };

    this.contrat.personnes.push(personne1)
    if (this.codeProduit == '45A') {
      typePersonne = this.formCreationConducteur?.value?.raisonSocial == null ? "PH" : "PM"
      let personne2: PersonneContrat = {
        role: (this.roles.find((role: any) => role.code === 'CP233') || {}).idParam,
        typeClient: typePersonne,
        risqueList: [this.devis.groupes[0].risques[0].idRisque],
        idClient: this.formCreationConducteur?.value?.codeClient,
        nom: this.formCreationConducteur?.value?.nom,
        prenom: this.formCreationConducteur?.value?.prenom,
        raisonSocial: '',
        dateNaissance: moment.utc(this.formCreationConducteur?.value?.DateDeNaissance).add(1,"hour").toISOString(),
        nif: null,
        nin: '',
        telephone: {
          idContact: this.formCreationConducteur?.value?.idTelephone,
          description: this.formCreationConducteur?.value?.telephone
        },
        email: {
          idContact: this.formCreationConducteur?.value?.idEmail,
          description: this.formCreationConducteur?.value?.email
        },
        adresse: {
          idAdresse: this.formCreationConducteur?.value?.idAdresse,
          description: this.formCreationConducteur?.value?.adresse,
          wilaya: this.formCreationConducteur?.value?.wilaya,
          commune: this.formCreationConducteur?.value?.commune
        },
        genre: 0,
        situation: this.formCreationConducteur?.value?.situation,
        profession: {
          id: this.formCreationConducteur?.value?.idProfession,
          idProfession: this.formCreationConducteur?.value?.profession,
        },
        rib: {},
        commercialLineValues:{
          //ineine
          idlineOfBusiness: this.formCreationAssure?.value?.lineOfBusiness,
          idsecteurActivite: this.formCreationAssure?.value?.secteurActivite,
          idoccupation: this.formCreationAssure?.value?.occupation
          ,naceCode:null
 
 
 
        },
        permis: {
          idDocument: 0,
          description: this.formCreationConducteur?.value?.numeroPermis,
          categorie: this.formCreationConducteur?.value?.categoriePermis,
          dateDelivrance: '',
          wilayaDelivrance: 0
        }
      };

      this.paraRisqueProduit.map((param: any) => {
        if (param.category == "Conducteur") {
          switch (param.codeParam) {
            case "P56":
              personne2.permis.wilayaDelivrance = +this.formCreationConducteur?.value[param.formName]
              break;
            case "P54":
              personne2.permis.dateDelivrance = moment.utc(this.formCreationConducteur?.value[param.formName]).add(1,"hour").toISOString()
              break;
            case "P24":
              personne2.genre = this.formCreationConducteur?.value[param.formName]
              break;
            case "P55":
              personne2.dateNaissance = moment.utc(this.formCreationConducteur?.value[param.formName]).add(1,"hour").toISOString()
              break;

            default:
              break;
          }
        }
      })

      this.contrat.personnes.push(personne2)
    }

  }

  this.contrat.risqueList = [
    {
      risque: []
    }
  ];
  let idparam
  let idreponse = null
  let description = ""
  let paramElement: any
  let paramElement2: any
  let risque: any = {}
  risque.paramList = []

  let groupeList: any = []
  //************* param risque
  if (!this.multiRisque) {
    this.paraRisqueProduit.map((param: any) => {
      //FIX A REVOIR

      if (param.category != "Conducteur") {
        Object.keys(this.formCreationRisque.value).map((paramFormName: any) => {
          if (paramFormName == param.formName) {

            idparam = param.idParamRisque
            if (param.typeChamp?.description == 'Liste of values') {

              idreponse = this.formCreationRisque.get(paramFormName).value
              description = ''
            } else {

              idreponse = null

              if (paramFormName == 'Marque' || paramFormName == 'Modèle') {
                idreponse = this.formCreationRisque.get(paramFormName).value
                description = ''
              }
              else {
                description = this.formCreationRisque.get(paramFormName).value
                idreponse = null
              }
            }

            paramElement = {
              "idParam": idparam,
              "reponse": {
                "idReponse": idreponse,
                "description": description
              }
            }

          }
        })

        risque.paramList.push(paramElement)




        //ancient this.contrat.risqueList[0].risque.push(paramElement)
      }
      else {
        Object.keys(this.formCreationConducteur.value).map((paramFormName: any) => {
          if (paramFormName == param.formName) {

            idparam = param.idParamRisque
            if (param.typeChamp?.description == 'Liste of values') {

              idreponse = this.formCreationConducteur.get(paramFormName).value
              description = ''
            } else {

              idreponse = null,
                description = this.formCreationConducteur.get(paramFormName).value
            }
            paramElement2 = {
              "idParam": idparam,
              "reponse": {
                "idReponse": idreponse,
                "description": description
              }
            }

          }
        })
        risque.paramList.push(paramElement2)



        //ancient this.contrat.risqueList[0].risque.push(paramElement2)
      }

    })

    index = index + 1
    groupeList.push({
      "idRisque": this.devis.groupes[0].risques[0].idRisque,
      "paramList": risque.paramList
    })


    this.contratGroupe = [{ "groupe": { "description": this.devis.groupes[0].description, "idGroupe": this.devis.groupes[0].idGroupe }, "groupeList": groupeList, },

    ]

  } else {
    this.contratGroupe = this.devis.groupes
  }


  this.contrat.groupes = this.contratGroupe

  this.contrat.auditUser = sessionStorage.getItem("userId")

  const hmac = await this.cryptoService.generateHmac(this.tkn, this.contrat);
  const stringifiedContrat = JSON.stringify(this.contrat);
  const dataContrat = {
    stringJson:stringifiedContrat,
    signature: hmac
  }

  this.contratService.createContrat(dataContrat).subscribe({
    next: (data: any) => {
      this.valider = false;
      Swal.fire(
        `La police N° ${data.idContrat} a été créer avec succés.`,
        ``,
        `success`
      )
      this.redirectConsultation()
    },
    error: (error) => {
      this.valider = false;
      let message = ""
      let code
      if (error.code == undefined)
        code = error.status
      else
        code = error.code
      switch (code) {
        case 400: // actif
          message = error.message
          break;

        case 402: // actif
          message = "Erreur lors de la validation du contrat, veuillez contacter l'administrateur."
          break;
        case 404: // actif
          message = error.message
          break;
        default:
          message = "Erreur système, veuillez contacter l'administrateur."
          break;
      }
      Swal.fire(
        message,
        ``,
        `error`
      )
      //////////console.log(error);

    }
  });
}

  changeAccess() {
    let devisAccess = {
      idDevisAccess: this.devisAccess?.idDevisAccess,
      devis: this.devis,
      accessContrat: 1,
      accessAvenant: 1
    }

    this.devisService.updateAccessDevis(devisAccess).subscribe({
      next: (data: any) => { },
      error: (error) => {

        //////////console.log(error);

      }
    });
  }

  redirectConsultation() {
    // this.changeAccess();

    this.router.navigate(['consultation-police/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + this.route.snapshot.paramMap.get('produit')]);
  }

  checkDateNaissance(stepper: MatStepper) {
    if (this.codeProduit == '45A') {
      if (this.isConducteur) {
        this.formCreationConducteur.get("DateDeNaissance").setValue(moment.utc(this.formCreationConducteur.get("DateDeNaissance").value).add(1,"hour").toISOString())
        this.formCreationSouscripteur.get("dateNaissance").setValue(moment.utc(this.formCreationSouscripteur.get("dateNaissance").value).add(1,"hour").toISOString())

        if (this.formCreationConducteur.get("DateDeNaissance").value == this.formCreationSouscripteur.get("dateNaissance").value) {
          if (this.formCreationConducteur.valid && this.formCreationRisque.valid && this.rechercheConducteur) {
            stepper.next();
          }
          else {
            this.formCreationConducteur.markAllAsTouched()
            this.formCreationRisque.markAllAsTouched()
          }
        }
        else {
          Swal.fire(
            `Ces informations sont pas identique à celle inséré dans le devis.`,
            `<center>Vous pouvez soit :\n</center> 
              • Décochez "Cette personne est-elle le souscripteur". </br>
              • Changez la date de naissance du souscripteur. </br>
              • Refaire un devis. </br>
            `,
            `warning`
          )
        }
      }
      else {
        if (this.formCreationConducteur.valid && this.formCreationRisque.valid && this.rechercheConducteur) {
          stepper.next();
        }
        else {
          this.formCreationConducteur.markAllAsTouched()
          this.formCreationRisque.markAllAsTouched()
        }
      }
    } else {
      if (this.formCreationRisque.valid) {
        stepper.next();
      }
      else
        this.formCreationRisque.markAllAsTouched()
    }
  }
  openDialog(idRisque: any, idGroupe: any) {
    this.devisService.getParamDevisByIdRisque(this.idDevis, idGroupe, idRisque).subscribe({
      next: (data: any) => {


        let risqueArray = data.reduce((acc: any, rs: any) => {
          acc[rs.libelle] = rs.reponse.idParamReponse?.description || rs.reponse.valeur;
          return acc;
        }, {});

        let dialogRef = this.dialog.open(DialogRisqueComponent, {
          width: '60%',
          data: {
            risque: risqueArray
          }
        });
        dialogRef.afterClosed().subscribe((result: any) => {

        });
      },
      error: (error) => {


      }
    });


  }
  openGroup(idGroupe: any) {

    this.devisService.getPackByGroupe(idGroupe, this.idDevis).subscribe({
      next: (data: any) => {
        // this.groupPack.find((group:any)=>group)
        this.groupPack.push({
          "garanties": data.garanties,
          "idGroupe": idGroupe,
          "pack": data.pack,
        })

      },
      error: (error) => {


      }
    });
  }
}
