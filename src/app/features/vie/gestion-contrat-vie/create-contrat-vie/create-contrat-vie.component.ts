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

import { Patterns } from '../../../../core/validiators/patterns'
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { ConventionService } from 'src/app/core/services/convention.service';
import { ReductionFiltreJson } from 'src/app/core/models/reduction';
import { MatPaginator } from '@angular/material/paginator';
import { SearchPersonneComponent } from 'src/app/features/gestion-contrat/search-personne/search-personne.component';
import { DialogRisqueComponent } from 'src/app/features/gestion-devis/dialog-risque/dialog-risque.component';
import { DialogEditRisqueComponent } from '../dialog-edit-risque/dialog-edit-risque.component';
import { CryptoService } from 'src/app/core/services/crypto.service';
//import { devis } from 'src/app/core/models/devis-mock'; 

const todayDate: Date = new Date;
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

@Component({
  selector: 'app-create-contrat-vie',
  templateUrl: './create-contrat-vie.component.html',
  styleUrls: ['./create-contrat-vie.component.scss']
})

export class CreateContratVieComponent implements OnInit {
  @ViewChild('stepper') private myStepper: MatStepper;


  idDevis: any;
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
  formCreationSouscripteurDommage: FormGroup | any;
  formCreationSouscripteur: FormGroup | any;
  formCreationConducteur: FormGroup | any;
  formCreationRisque: FormGroup | any;
  formSearchAssure: FormGroup | any;
  formEditRisque: FormGroup | any;
  personneFirstForm : any;

  paraRisqueProduit: any = [];
  paraRisqueAssure: any = [];
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
  groupes : any[];
  groupeRisque: any[];
  idAssure: any = [];
  idRisqueSouscripteur : Number;
  tkn:string = JSON.parse(sessionStorage.getItem("access_token")||'')?.access_token
  

  constructor(private cryptoService: CryptoService, private conventionService: ConventionService, private reductionService: ReductionService, private router: Router, private contratService: ContratService, private packService: PackService, public dialog: MatDialog, private paramRisqueService: ParamRisqueService, private genericService: GenericService, private dureeService: DureeService, private produitService: ProduitService, private agencesService: AgencesService, private vehiculeService: VehiculeService, private personneService: PersonneService, private devisService: DevisService, private route: ActivatedRoute, private formBuilder: FormBuilder) {

    // window.onbeforeunload = (e) => {
    //   this.changeAccess();
    // };
    // router.events.subscribe((val) => {
    //   this.changeAccess();
    // });
  }
  sousGarantieTab: any = []
  sousGarantieExist = false
  expandedElement: any
  codeProduit: any
  filterReduction = ReductionFiltreJson
  infoVoyage : any 
  infoEditRisque : any = []
  paraRisqueProduitAssure : any = []
  groupeList: any = []
  nbrRisque : any
  varEditRisque : any =false
  COURTIER:boolean =false
  isBEA:boolean =false

 
  indexRecheche : any =0

  ngOnInit(): void {


    this.COURTIER=sessionStorage.getItem("roles")?.includes("COURTIER")|| false 
    this.isBEA=sessionStorage.getItem("roles")?.includes("CDC_BEA")|| false 

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

  getReductionByConvention(idConvention: any) {

    if (idConvention != 'aucuneConvention') {

      this.reductionService.getReductionByConvention(idConvention).subscribe({
        next: (data: any) => {
          if (data.length != 0)
            this.reductions = data.filter((reduc: any) => reduc.produit == JSON.parse(sessionStorage.getItem('products') || '{}').find((parametre: any) => parametre.codeProduit == this.route.snapshot.paramMap.get('codeProduit')).description)
        },
        error: (error) => {

          console.log(error);

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

        console.log(error);

      }
    });
  }

  getDevisInfo() {
    this.devisService.getDevisById(this.idDevis).subscribe((devis: any) => {
    this.groupeRisque=[]
     
      if (devis.produit.codeProduit != this.route.snapshot.paramMap.get('codeProduit')) {
        this.router.navigate(['consultation/vie/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + this.route.snapshot.paramMap.get('nomProduit')]);

      } 
      this.devis = devis

      this.groupes = [{        
        "description": this.devis.groupes[0].description,
        "garantieList" :this.devis.groupes[0].garantieList,        
        "pack":this.devis.groupes[0].pack,
        "primeList":this.devis.groupes[0].primeList,
        "taxeList":this.devis.groupes[0].taxeList,
        "risques": this.devis.groupes[0].risques,      
      
      }] 


      this.devis.groupes.map((grp:any)=>{
        grp.risques.map((rsq:any)=>{
          rsq["idGroupe"]=grp.idGroupe
          rsq["description"]=grp.description
          this.groupeRisque.push(rsq)
        }
      )
      })

      this.devis.groupes.map((elt:any)=>{
        elt.risques.map((risque:any)=>{          
          risque.checkEdit = false
        })
      })
    
    
       
        this.devisService.getParamDevisByIdRisque(this.idDevis, this.devis?.groupes[0]?.idGroupe, this.devis?.groupes[0]?.risques[0]?.idRisque).subscribe({
          next: async (data: any) => {
         
            this.infoVoyage = data.filter((elt:any) => elt.categorieParamRisque === "Voyage");          
         
            this.devisReady = true
            this.paramRisqueDevis = data

            await this.initForm();
          },
          error: (error) => {

            console.log(error);

          }
        });

     // }
      if (this.devis.reduction != null)
        this.getReduction(this.devis.reduction.idReduction)
      if (this.devis.statue.code != 'S03') {
      //  this.router.navigate(['consultation-police/vie/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + this.route.snapshot.paramMap.get('nomProduit')]);
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

              console.log(error);

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

        console.log(error);

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

        console.log(error);

      }
    });
  }
  getReduction(idReduction: any) {

    this.reductionService.getReductionById(idReduction).subscribe({
      next: (data: any) => {
        this.marqueReduction = (data.paramList.filter((risque: any) => risque.idParam.codeParam == 'P25'))[0].idParam.reponseList

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

  getProduit() {
    this.produitService.getAllProduits().subscribe({
      next: (data: any) => {
        this.produits = data
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
        this.communes = data     
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

  getTypeVehicule() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C18").idCategorie).subscribe({
      next: (data: any) => {
        this.typesVehicule = data
      },
      error: (error) => {
        console.log(error);
      }
    });
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
  getUsage() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C19").idCategorie).subscribe({
      next: (data: any) => {
        this.usages = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getEnergie() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C31").idCategorie).subscribe({
      next: (data: any) => {
        this.energies = data
      },
      error: (error) => {
        console.log(error);
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


    if (this.marqueReduction.length !== 0) {
      if (this.marqueReduction.some((marqueDevis: any) => marqueDevis.idParam === Number(marque))) {
        this.vehiculeService.getModelByMarque(marque).subscribe({
          next: (data: any) => {
            this.modeles = data
          },
          error: (error) => {
            console.log(error);
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
          console.log(error);
        }
      });
    }

  }

  initForm() {
 if (!this.COURTIER && !this.isBEA){
  console.log('activer agece ',this.COURTIER==false || this.isBEA ==false)
   this.formCreationContrat = this.formBuilder.group({
      agence: [{ value: this.devis?.agence?.idAgence, disabled: false }, [Validators.required]],
      

      produit: [{ value: this.devis?.produit?.idCodeProduit, disabled: true }, [Validators.required]],
      duree: [{ value: this.devis?.duree?.id_duree, disabled: true }, [Validators.required]],
      dateEffet: [{ value: this.codeProduit=="20G"? this.paramRisqueDevis?.find((elt:any)=> elt.codeRisque == "P258")?.reponse?.valeur :this.infoVoyage?.find((elt:any)=> elt.codeRisque == "P211")?.reponse?.valeur, disabled: true }, [Validators.required]],
      dateExpiration: [{ value: this.codeProduit=="20G"? this.paramRisqueDevis?.find((elt:any)=> elt.codeRisque == "P259")?.reponse?.valeur : this.infoVoyage?.find((elt:any)=> elt.codeRisque == "P212")?.reponse?.valeur, disabled: true }, [Validators.required]],
    });
 }else {
 
if(this.COURTIER || this.isBEA)
  console.log ('jai descativer')
  this.formCreationContrat = this.formBuilder.group({
    agence: [{ value: this.devis?.agence?.idAgence, disabled: true }],
    

    produit: [{ value: this.devis?.produit?.idCodeProduit, disabled: true }, [Validators.required]],
    duree: [{ value: this.devis?.duree?.id_duree, disabled: true }, [Validators.required]],
    dateEffet: [{ value: this.codeProduit=="20G"? this.paramRisqueDevis?.find((elt:any)=> elt.codeRisque == "P258")?.reponse?.valeur :this.infoVoyage?.find((elt:any)=> elt.codeRisque == "P211")?.reponse?.valeur, disabled: true }, [Validators.required]],
    dateExpiration: [{ value: this.codeProduit=="20G"? this.paramRisqueDevis?.find((elt:any)=> elt.codeRisque == "P259")?.reponse?.valeur : this.infoVoyage?.find((elt:any)=> elt.codeRisque == "P212")?.reponse?.valeur, disabled: true }, [Validators.required]],
  });
 }
   
    
    this.formCreationSouscripteurDommage = this.formBuilder.group({
      codeClient: [null],
      raisonSocial:  this.devis?.typeClient?.description == 'personne morale' ? [this.devis?.raisonSocial, [Validators.required, Validators.maxLength(40)]] : [null, []],
      nom: [this.devis?.typeClient?.description == "personne physique" ? this.devis?.nom : null, this.devis?.typeClient?.description == "personne physique" ? [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)] : []],
      prenom: [this.devis?.typeClient?.description == "personne physique" ? this.devis?.prenom : null, this.devis?.typeClient?.description == "personne physique" ? [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)] : []],
      dateOuverture: [null],
      dateNaissance: [this.devis?.typeClient?.description == "personne physique" ? this.devis?.dateAssure : null, this.devis?.typeClient?.description == "personne physique" ? [Validators.required, ageValidator] : []],
      nin: [{ value: null, disabled: true }, [Validators.pattern(Patterns.NIN)]],
      nif: [{ value: null, disabled: true }, [Validators.pattern(Patterns.NIF)]],
      telephone: [{ value: null, disabled: true }, [Validators.required, Validators.pattern(Patterns.mobile)]],
      email: [{ value: null, disabled: true }, [Validators.pattern(Patterns.email)]],
      adresse: [{ value: null, disabled: true }, [Validators.required, Validators.maxLength(60)]],
      wilaya: [{ value: null, disabled: true }, [Validators.required]],
      commune: [{ value: null, disabled: true }, [Validators.required]],
      genre: [{ value: null, disabled: true }, [Validators.required]],
      situation: [{ value: null, disabled: true }],
      profession: [{ value: null, disabled: true }]
    });

    this.formCreationSouscripteur = this.formBuilder.group({
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
      rib: [{ value: null, disabled: true }, [Validators.pattern(Patterns.RIB)]]
    });

    
  
    this.formCreationRisque = this.formBuilder.group({
      idRisque: [''],
    });

    this.formReduction = this.formBuilder.group({

      reduction: [{ value: this.devis?.reduction?.nomReduction, disabled: true }],
      convention: [{ value: this.devis?.convention?.idConvention, disabled: true }],
    });

    if (this.devis?.convention) {
      this.getReductionByConvention(this.devis?.convention?.nomConvention);
    }
    

    this.getAllParamRisque(this.devis?.produit?.idCodeProduit);

    
  }

  nextStep() {

    this.formSearchAssure = this.formBuilder.group({ 
      nom: [{ value: this.groupeRisque[0].risque.find((param:any)=>param.code == "P164").valeur , disabled: true }, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)] ],
      prenom: [{ value: this.groupeRisque[0].risque.find((param:any)=>param.code == "P165").valeur , disabled: true }, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)] ],
      dateNaissance: [{ value: this.groupeRisque[0].risque.find((param:any)=>param.code == "P166").valeur , disabled: true },[Validators.required] ],
     
    });

    //this.InitFormEditRisque()


    if (this.multiRisque) {     
      this.getCommune(this.formCreationSouscripteur.value.wilaya, 'Souscripteur')
    }
    console.log(this.rechercheSouscripteur,this.multiRisque , this.formCreationContrat , this.formCreationSouscripteur.valid)
    if ((this.formCreationContrat.valid ||this.COURTIER==true || this.isBEA )&& this.formCreationSouscripteur.valid ) {
      if (this.rechercheSouscripteur)    {
        this.personneFirstForm = this.formCreationSouscripteur.value;
        this.myStepper.next();
      }
      else{
        Swal.fire(
          `Vous devez cliquer sur le button Rechercher pour le souscripteur`,
          '',
          'error'
        )
      }
    }
    else {
      this.formCreationContrat.markAllAsTouched();     
      this.formCreationSouscripteur.markAllAsTouched();
    }
  }
  InitFormEditRisque(){
  
    this.formEditRisque = this.formBuilder.group({}); 

    this.paraRisqueAssure.map((param: any) => {   
   //  if(param.codeParam !="P166")  {
      if (param.sizeChamp != 0 && param.sizeChamp != undefined)      
        this.formEditRisque.addControl(param.formName, new FormControl({ value: param.defaultValue, disabled: true }, [Validators.required, Validators.minLength(param.sizeChamp), Validators.maxLength(param.sizeChamp)]));
      else
      if (param.obligatoire){     
        this.formEditRisque.addControl(param.formName, new FormControl({ value: param.defaultValue, disabled: true }, [Validators.required]));
      
      }  else{
        this.formEditRisque.addControl(param.formName, new FormControl({ value: param.defaultValue, disabled: true }));
      //  this.formEditRisque.addControl(param.formName, new FormControl(param.defaultValue));
      }       
      if (param.parent != null && this.infoEditRisque.length == 0) {          
        this.formEditRisque.get(param.formName).disable(); 
      }
     
           // if(param.codeParam =="P182" || param.codeParam =="P179" ||  param.codeParam =="P183"|| param.codeParam =="P211"|| param.codeParam =="P212" && this.infoEditRisque.length == 0){
             
              //   this.formEditRisque.get(param.formName).disable();
              // }

            // //parent
            // let valeur =  this.risqueInfo?.find((risque: any) => risque.codeRisque == param.codeParam)
            // let valeurEdit =  this.infoEditRisque?.find((risque: any) => risque.paramList[0].codeRisque == param.codeParam)
         
         
            // if (param.typeChamp.code == "L08" && param?.paramRisqueParent == null) {


            //   //EXP EN ATTENTE NOM TABLE EN RETOUR               

            //   this.paramRisqueService.getTableParamParent(param?.idParamRisque).subscribe({
            //     next: (data: any) => {

              
            //       if (valeur != undefined) {
            //         this.getChild(param?.idParamRisque, valeur?.reponse?.valeur)
            //       }
            //       else if(this.infoEditRisque.length != 0 && valeurEdit != undefined)
            //       {
                   
            //         this.getChild(param?.idParamRisque, valeurEdit?.paramList.reponse?.description)
            //       }

            //     },
            //     error: (error) => {
            //       console.log(error);
            //     } 
            //   })
            // }

            
            this.paraRisqueProduitAssure.push(param)
          
       
     })
  
  }

  initFormSearchAssure(){  
   
    this.formEditRisque.disable();   

    this.formSearchAssure.get('nom').setValue(this.groupeRisque[this.indexRecheche].risque.find((param:any)=>param.code == "P164").valeur)
    this.formSearchAssure.get('prenom').setValue(this.groupeRisque[this.indexRecheche].risque.find((param:any)=>param.code == "P165").valeur)
    this.formSearchAssure.get('dateNaissance').setValue(this.groupeRisque[this.indexRecheche].risque.find((param:any)=>param.code == "P166").valeur)

    this.formSearchAssure.disable();  

  }
  getRelation(typeChamp: any, isParent: boolean, idParamRisque: number, idReponse: number, formName: any) {

     
    if (isParent == true)
      if (typeChamp == 'L01') {

        this.paramRisqueService.getParamRelation(idParamRisque, idReponse).subscribe({
          next: (data: any) => {

            this.paraRisqueProduit.filter((param: any) => {
              if (param.idParamRisque == data[0].idParamRisque) {

                param.reponses = data[0].categorie.paramDictionnaires
                 this.formEditRisque.controls[param.formName].enable()
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
                   this.formEditRisque.controls[param.formName].enable()
                }
              })            

            },
            error: (error) => {

              console.log(error);

            }
          })
      }
   
  }

  removeSpaces(input: string): string {
    return  input
    .toLowerCase()                      // Convert the whole string to lowercase
    .replace(/\s+(.)/g, (_, char) => char.toUpperCase())  // Capitalize the first letter after spaces
    .replace(/\s+/g, '')
    .replace(/^./, char => char.toUpperCase());
  }

  recherchePersonne(type: any) {
 
    console.log("type rech",type)
    let filtre: any;
    switch (type) {
      case 'Souscripteur':     
        this.rechercheSouscripteur = true
        if (this.devis?.typeClient?.description == "personne physique") {
          this.formCreationSouscripteur.get("dateNaissance").setValue(moment(this.formCreationSouscripteur.get("dateNaissance").value).format("YYYY-MM-DDT00:00:00.000"))
        }
     
        filtre = this.formCreationSouscripteur.value
        break;
      case 'Assure':
        this.rechercheAssure = true      
        if (this.devis?.typeClient?.description == "personne physique") {
          this.formSearchAssure.get("dateNaissance").setValue(moment(this.formSearchAssure.get("dateNaissance").value).format("YYYY-MM-DDT00:00:00.000"))
        } 
       // this.InitFormEditRisque()
        filtre = this.formSearchAssure.value
        filtre.raisonSocial = null
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
          case 'Souscripteur':          
            this.formCreationSouscripteur.enable();
            break;
          case 'Assure':
            this.formEditRisque.enable();
            this.formEditRisque.get('DateDeNaissance').disable();  

        
            //get info risque assure

            this.devisService.getParamDevisByIdRisque(this.idDevis, this.groupeRisque[this.indexRecheche].idGroupe, this.groupeRisque[this.indexRecheche].idRisque).subscribe({

              next: (riqueData: any) => {

                riqueData.forEach((param:any) => {
                    this.paraRisqueAssure.forEach((elt:any) => {
                    if(elt.codeParam == param.codeRisque){
                      switch(param.typeChamp.code){
                        case 'L01':
                         
                         this.formEditRisque.get(param.descriptionChamp)?.setValue(param.reponse.idParamReponse.idParam ?? param.reponse.valeur);
                         this.formEditRisque.get(param.descriptionChamp)?.disable();
                        break;

                        case 'L08':
                      
                          this.formEditRisque.get(param.descriptionChamp)?.setValue(parseInt(param.reponse.valeur));
                          this.formEditRisque.get(param.descriptionChamp)?.disable();
                          break;

                        default:
                         
                          this.formEditRisque.get(param.descriptionChamp)?.setValue(param.reponse?.valeur);
                          this.formEditRisque.get(param.descriptionChamp)?.disable();
                          break;
                      }
                    }
                  });
                });
              }
            })

            if(this.personneFirstForm.nom.toLowerCase()==filtre.nom.toLowerCase() &&
              this.personneFirstForm.prenom.toLowerCase()==filtre.prenom.toLowerCase() && 
              this.personneFirstForm.DateDeNaissance==filtre.DateDeNaissance ){
              this.formEditRisque.get("Adresse")?.setValue(this.personneFirstForm.adresse)
              this.formEditRisque.get("NuméroDeTéléphone")?.setValue(this.personneFirstForm.telephone)
              this.formEditRisque.get("Email")?.setValue(this.personneFirstForm.email)
              this.formEditRisque.get("Wilaya")?.setValue(parseInt(this.personneFirstForm.wilaya));
              this.getRelation('L08', true, parseInt('177'), this.personneFirstForm.wilaya, 'Wilaya');
              this.getCommune(this.personneFirstForm.wilaya, 'assure')
              this.formEditRisque.get("Commune")?.setValue(parseInt(this.personneFirstForm.commune));
              this.getCommune(this.personneFirstForm.wilaya, 'assure')
              this.formEditRisque.get("NIN")?.setValue(parseInt(this.personneFirstForm.nin))
              this.formEditRisque.get("Genre")?.setValue(parseInt(this.personneFirstForm.genre))
              this.formEditRisque.get("SituationFamiliale")?.setValue(parseInt(this.personneFirstForm.situation))
              
            }

            this.formEditRisque.get('DateDeNaissance').setValue(moment(this.formSearchAssure.get("dateNaissance").value).format("YYYY-MM-DDT00:00:00.000"));
            this.formEditRisque.get('DateDeNaissance').disable();
            this.formEditRisque.get('Nom').setValue(this.formSearchAssure.get("nom").value);
            this.formEditRisque.get('Nom').disable();
            this.formEditRisque.get('Prénom').setValue(this.formSearchAssure.get("prenom").value);
            this.formEditRisque.get('Prénom').disable();
            this.formEditRisque.updateValueAndValidity()

            // this.paraRisqueProduitAssure.forEach((param:any) => {
            //   this.groupeRisque[this.indexRecheche].risque.forEach((elt:any) => {     
            //     if(elt.code == param.codeParam){
            //       this.formEditRisque.get(param.formName).setValue(elt.valeur);
            //     }
            // this.formEditRisque.get('DateDeNaissance').disable();   

            // this.paraRisqueProduitAssure.forEach((param:any) => {
            //   this.groupeRisque[this.indexRecheche].risque.forEach((elt:any) => {  
    
            //     if(elt.code == param.codeParam){
            //       this.formEditRisque.get(param.formName).setValue(elt.valeur);
            //     }
              
            //   });
            // });
           
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
        switch (type) {
          case 'Souscripteur':  
            this.personne = result
            this.initFormPersonne(type);
          break;  
          case 'Assure' :
            this.personne = result
            this.initFormPersonne(type);
            this.idAssure.push({
              "idRisque": this.groupeRisque[this.indexRecheche].idRisque,
              "idAssure": this.personne.idClient,          
            });

            this.devisService.getParamDevisByIdRisque(this.idDevis, this.devis?.groupes[0]?.idGroupe, this.groupeRisque[this.indexRecheche].idRisque).subscribe({
              next: (riqueData: any) => {  

                if(this.personneFirstForm.nom.toLowerCase() ==filtre.nom.toLowerCase() &&
                this.personneFirstForm.prenom.toLowerCase()==filtre.prenom.toLowerCase() && 
                this.personneFirstForm.DateDeNaissance==filtre.DateDeNaissance ){
                  this.formEditRisque.get("Adresse")?.setValue(this.personneFirstForm.adresse)
                  this.formEditRisque.get("NuméroDeTéléphone")?.setValue(this.personneFirstForm.telephone)
                  this.formEditRisque.get("Email")?.setValue(this.personneFirstForm.email)
                  this.formEditRisque.get("Wilaya")?.setValue(parseInt(this.personneFirstForm.wilaya));
                  this.getRelation('L08', true, parseInt('177'), this.personneFirstForm.wilaya, 'Wilaya');
                  this.getCommune(this.personneFirstForm.wilaya, 'assure')
                  this.formEditRisque.get("Commune")?.setValue(parseInt(this.personneFirstForm.commune));
                  this.getCommune(this.personneFirstForm.wilaya, 'assure')
                  this.formEditRisque.get("NIN")?.setValue(parseInt(this.personneFirstForm.nin))
                  this.formEditRisque.get("Genre")?.setValue(parseInt(this.personneFirstForm.genre))
                  this.formEditRisque.get("SituationFamiliale")?.setValue(parseInt(this.personneFirstForm.situation))
                }
           
                riqueData.forEach((param:any) => {

                  this.paraRisqueAssure.forEach((elt:any) => {

                  if(elt.codeParam == param.codeRisque){
                    switch(param.typeChamp.code){
                      case 'L01':
                       this.formEditRisque.get(param.descriptionChamp)?.setValue(param.reponse.idParamReponse.idParam);
                       this.formEditRisque.get(param.descriptionChamp)?.disable();
                      break;

                      case 'L08':
                        this.formEditRisque.get(param.descriptionChamp)?.setValue(parseInt(param.reponse.valeur));
                       this.formEditRisque.get(param.descriptionChamp)?.disable();

                      break;

                      default:
                      this.formEditRisque.get(param.descriptionChamp)?.setValue(param.reponse?.valeur);
                       this.formEditRisque.get(param.descriptionChamp)?.disable();

                      break;
                    }
                  }
                });
              });
            }
          })
          this.formEditRisque.enable();
          this.formEditRisque.get('DateDeNaissance').disable();
          break;
          default:
            break;
         

       
          }

        });
      }
    })

    
  }
  
  submitEditRisque(){


    if(this.formEditRisque.valid){

      let retourList : any =[]
      let retour : any ={}
      let codeParam : any;
      let idparam : any;
      let idreponse : any 
      let description : any
     
      this.paraRisqueProduit.map((parmRisque:any)=>{
        codeParam = parmRisque.codeParam
        idparam =parmRisque.idParamRisque
        const specificParams= this.codeProduit=="20G"?["P257","P258","P259"]:["P179","P182","P211","P212"]

        if (specificParams.includes(codeParam)){
         if(this.codeProduit=="20G"){
          this.paramRisqueDevis.map((parmRisque:any)=>{



            if(parmRisque.codeRisque == codeParam){

              switch (parmRisque.typeChamp.code){
                case 'L01':

                  idreponse = parmRisque.reponse?.idParamReponse.idParam
                  description = parmRisque.reponse?.idParamReponse.description

                break;

                case 'L08':

                  idreponse = null
                  description =parmRisque.reponse?.valeur

                break;
                default:

                  idreponse = null
                  description =parmRisque.reponse?.valeur
                break;
              }
            }
        });
         }else{
          this.infoVoyage.map((parmRisque:any)=>{
            if(parmRisque.codeRisque == codeParam){
              switch (parmRisque.typeChamp.code){
                case 'L01':
                  idreponse = parmRisque.reponse?.idParamReponse.idParam
                  description = parmRisque.reponse?.idParamReponse.description

                break;
                case 'L08':
                  idreponse = null
                  description =parmRisque.reponse?.valeur
                break;
                default:
                  idreponse = null
                  description =parmRisque.reponse?.valeur
                break;
              }
            }
        });
         }
        }else{
          if (parmRisque.typeChamp?.description == 'Liste of values') {

            idreponse = this.formEditRisque.get(parmRisque.formName)?.value
            description = ''
          } else {
  
            idreponse = null,
              description = this.formEditRisque.get(parmRisque.formName)?.value
          }
        }


        retour = {
          "idParam": idparam,
          "codeRisque": codeParam,
          "codeParam": codeParam,
          "reponse": {
            "idReponse": idreponse,
            "description": description
          }
        }  
        
        retourList.push(retour)  
      });

    
// Pour afficher le bouton suivant 
      this.devis.groupes.map((elt:any)=>{
        elt.risques.map((risque:any)=>{
          if(risque.idRisque == this.groupeRisque[this.indexRecheche].idRisque)
          risque.checkEdit = true
        })
      })

      this.devis.groupes.map((elt:any)=>{              
          this.varEditRisque =  !elt.risques.some((elt:any)=> elt.checkEdit == false) 
      })
//******************* */




   if(!this.groupeList.find((el:any)=>el.idRisque===this.groupeRisque[this.indexRecheche].idRisque)){
  if(this.idAssure.length !=0 ) {
   
    this.idAssure.forEach((person: any)=>{
      if(person.idRisque ==this.groupeRisque[this.indexRecheche].idRisque){
       
        this.groupeList.push({
          "idRisque": this.groupeRisque[this.indexRecheche].idRisque,
          "idAssure": person.idAssure,
          "paramList": retourList
        });       
      }  else {
        this.groupeList.push({
          "idRisque": this.groupeRisque[this.indexRecheche].idRisque,            
          "paramList": retourList
        });    
      }      
      this.idAssure =[]
    })
   }else {
    this.groupeList.push({
      "idRisque": this.groupeRisque[this.indexRecheche].idRisque,            
      "paramList": retourList
    });    
   }
 
}
 
    
  
   

      if(!this.varEditRisque){
        Swal.fire(
          `Veuillez compléter les informations de tous les risques.`,
          ``,
          `info`
        )
        this.formEditRisque.reset()
        this.indexRecheche++;
        this.initFormSearchAssure()

      }
    
    }
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
      case 'Souscripteur':
        this.getCommune(this.formCreation.value.wilaya, 'Souscripteur')
     
        this.formCreationSouscripteur = this.formCreation
        if(this.devis.typeClient?.code== "PH"){
          this.formCreationSouscripteur.get("dateNaissance").setValue(moment(this.formCreationSouscripteur.get("dateNaissance").value).format("YYYY-MM-DDT00:00:00.000"))
          this.formCreationSouscripteur.get("dateNaissance")?.setValidators(this.devis.typeClient?.code== "PH"? [Validators.required]:[])
          this.formCreationSouscripteur.get("genre")?.setValidators([Validators.required])        
          this.formCreationSouscripteur.addControl("idProfession", new FormControl(this.personne?.professionSecteurList[0] ? this.personne?.professionSecteurList[0].id : ''));
          this.formCreationSouscripteur.addControl("profession", new FormControl(this.personne?.professionSecteurList[0] ? this.personne?.professionSecteurList[0].profession?.idProfession : ''));
          this.formCreationSouscripteur.get('dateNaissance').updateValueAndValidity();
          this.formCreationSouscripteur.get('genre').updateValueAndValidity();
        }  else {
          this.formCreationSouscripteur.addControl("nif", new FormControl(this.personne?.nif, Validators.pattern(Patterns.NIF)));
        }     
        
        break;
      case 'assure':
        // this.getCommune(this.formCreation.value.wilaya, 'Assure')
        // if (this.devis?.typeClient?.description == "personne physique") this.formCreation.get("dateNaissance").setValue(moment(this.formCreation.get("dateNaissance").value).format("YYYY-MM-DDT00:00:00.000"))

        // this.formCreationSouscripteur = this.formCreation
        // this.formCreationSouscripteur.addControl("nif", new FormControl(this.personne?.nif, Validators.pattern(Patterns.NIF)));
        // if (this.devis?.typeClient?.description == "personne physique") {
        //   this.formCreationSouscripteur.addControl("idProfession", new FormControl(this.personne?.professionSecteurList[0] ? this.personne?.professionSecteurList[0].id : ''));
        //   this.formCreationSouscripteur.addControl("profession", new FormControl(this.personne?.professionSecteurList[0] ? this.personne?.professionSecteurList[0].profession?.idProfession : ''));
        //   this.formCreationSouscripteur.get("dateNaissance")?.setValidators([Validators.required])
        //   this.formCreationSouscripteur.get('dateNaissance').updateValueAndValidity();
        //   this.formCreationSouscripteur.get("genre")?.setValidators([Validators.required])
        //   this.formCreationSouscripteur.get('genre').updateValueAndValidity();
        // }
        // break;
      case 'Conducteur':
        this.getCommune(this.formCreation.value.wilaya, 'Conducteur')
        this.formCreation.get("dateNaissance").setValue(moment(this.formCreation.get("dateNaissance").value).format("YYYY-MM-DDT00:00:00.000"))
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
              paramRisque.readonly = this.paramRisqueDevis?.find((risque: any) => risque.libelle == paramRisque.libelle && risque.categorieParamRisque == paramRisque.category) != undefined

              if (param?.iddictionnaire?.description == 'valeur minimum') {

              }
              if (this.paraRisqueProduit.find((o: any) => param.paramRisque?.idParamRisque === o.idParamRisque) == undefined && existInBoth) {

                //ancient
                // let valeur = this.devis?.risqueList?.find((risque: any) => risque.libelle == paramRisque.libelle && risque.categorieParamRisque == paramRisque.category)



                let valeur = this.paramRisqueDevis?.find((risque: any) => risque.libelle == paramRisque.libelle && risque.categorieParamRisque == paramRisque.category)

                //parent
                if (param?.paramRisque?.typeChamp.code == "L08" && param?.paramRisque?.paramRisqueParent == null) {

                  //EXP EN ATTENTE NOM TABLE EN RETOUR               

                  this.paramRisqueService.getTableParamParent(paramRisque?.idParamRisque).subscribe({
                    next: (data: any) => {
                      paramRisque.reponses = data


                      if (valeur != undefined) {
                        this.getChild(paramRisque.idParamRisque, valeur?.reponse?.valeur)
                      }


                    },
                    error: (error) => {
                      console.log(error);
                    } 
                  })
                }
                // if (valeur != undefined) {


                
 
                //   // console.log("paramRisque workFlow")
                //   // console.log(paramRisque)

                //   switch (paramRisque.category) {

                //     case "Conducteur":

                //       this.formCreationConducteur.addControl(paramRisque.formName, new FormControl({ value: valeur.reponse.valeur != null ? valeur.reponse.valeur : valeur.reponse.idParamReponse?.idParam, disabled: paramRisque.readonly }, [Validators.required]));
                //       break;
                //     default:
                //       this.formCreationRisque.addControl(paramRisque.formName, new FormControl({ value: valeur.reponse.valeur != null ? valeur.reponse.valeur : valeur.reponse.idParamReponse?.idParam, disabled: paramRisque.readonly }, [Validators.required]));

                //       break;
                //   }
                // }
                // else {
                //   switch (paramRisque.category) {
                //     case "Conducteur":
                //       this.formCreationConducteur.addControl(paramRisque.formName, new FormControl({ value: paramRisque.defaultValue, disabled: paramRisque.readonly }, [Validators.required]));
                //       break;
                //     default:
  
                //       if (paramRisque.sizeChamp != 0 && paramRisque.sizeChamp != undefined && paramRisque.typeChamp?.code != 'L01' && paramRisque.typeChamp?.code != 'L08') {
                //         this.formCreationRisque.addControl(paramRisque.formName, new FormControl({ value: paramRisque.defaultValue, disabled: paramRisque.readonly }, [Validators.required, Validators.minLength(paramRisque.sizeChamp), Validators.maxLength(paramRisque.sizeChamp)]));

       
                //       } else
                //         this.formCreationRisque.addControl(paramRisque.formName, new FormControl({ value: paramRisque.defaultValue, disabled: paramRisque.readonly }, [Validators.required]));
                //       break;
                //   }
                // }

             

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
              existInBoth = false
              validators = []
            })

            this.paraRisqueProduit.filter((element:any)=>{             
              if (element.category == "Assuré") {              
                this.paraRisqueAssure.push(element)             
              }
            })
           
            this.InitFormEditRisque()

         

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

            console.log(error);

          }
        })


      },
      error: (error) => {

        console.log(error);

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

        console.log(error);

      }
    })
  }

  changeRoleClient(val: any, role: string) {

    if (val) {
      switch (role) {
        case 'Souscripteur':
          this.rechercheSouscripteur = true
          this.isAssure = true;
          this.formCreationSouscripteur = this.formCreationSouscripteur
          this.getCommune(this.formCreationSouscripteur.value.wilaya, 'Souscripteur')
          break;
        case 'Conducteur':
          this.rechercheConducteur = true
          this.isConducteur = true;
          this.isConducteurAssure = false;
          this.formCreationConducteur = this.formBuilder.group({
            codeClient: [this.formCreationSouscripteurDommage?.value?.codeClient == '' ? null : this.formCreationSouscripteurDommage?.value?.codeClient],
            nom: [this.formCreationSouscripteurDommage?.value?.nom == '' ? null : this.formCreationSouscripteurDommage?.value?.nom, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
            prenom: [this.formCreationSouscripteurDommage?.value?.prenom == '' ? null : this.formCreationSouscripteurDommage?.value?.prenom, [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.nom)]],
            dateNaissance: [this.formCreationSouscripteurDommage?.value?.dateNaissance == '' ? null : this.formCreationSouscripteurDommage?.value?.dateNaissance],
            telephone: [this.formCreationSouscripteurDommage?.value?.telephone, [Validators.required, Validators.minLength(this.formCreationSouscripteurDommage?.value?.telephone.length), Validators.maxLength(this.formCreationSouscripteurDommage?.value?.telephone.length)]],
            email: [this.formCreationSouscripteurDommage?.value?.email, [Validators.pattern(Patterns.email)]],
            adresse: [this.formCreationSouscripteurDommage?.value?.adresse, [Validators.required, Validators.maxLength(60)]],
            wilaya: [this.formCreationSouscripteurDommage?.value?.wilaya, [Validators.required]],
            commune: [this.formCreationSouscripteurDommage?.value?.commune, [Validators.required]],
            situation: [this.formCreationSouscripteurDommage?.value?.situation],
            profession: [this.formCreationSouscripteurDommage?.value?.profession, [Validators.required]],
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

  async submitContrat() {

    let index = 0
    this.formCreationContrat.enable();
    this.formCreationSouscripteurDommage.enable();

    this.formCreationSouscripteur.enable();
  

    this.formCreationRisque.enable();

    let souscripteur = this.formCreationSouscripteurDommage?.value
    let assure = this.formCreationSouscripteur?.value
    let conducteur = this.formCreationConducteur?.value

    this.valider = true;
    this.contrat.devis = +this.devis?.idDevis;
    this.contrat.agence = this.formCreationContrat?.get("agence")?.value;
    
    this.formCreationContrat.get("dateEffet").setValue(moment(this.formCreationContrat.get("dateEffet").value).format("YYYY-MM-DDT00:00:00.000"))
    this.contrat.dateEffet = this.formCreationContrat.value?.dateEffet;

    this.contrat.dateExpiration = this.formCreationContrat.value?.dateExpiration;
    const initialDateEffet = new Date( this.contrat.dateEffet);

    // Ajout d'une seconde (1000 millisecondes)*60*24)
      this.contrat.dateEffet = new Date(initialDateEffet.getTime()+1000*60*60*2);
     
      this.contrat.dateEffet =this.contrat.dateEffet.toISOString();
 
    const initialDate = new Date( this.contrat.dateExpiration);

    // Ajout d'une seconde (1000 millisecondes)*60*24)
      this.contrat.dateExpiration = new Date(initialDate.getTime()+1000*60*60*2);
     
      this.contrat.dateExpiration =this.contrat.dateExpiration.toISOString();
    
      this.contrat.personnes = [];
    //Personne souscripteur et Assuré 
    let typePersonne = this.formCreationSouscripteur?.value?.raisonSocial == null ? "PH" : "PM"
    let personne: PersonneContrat = {
      role: (this.roles.find((role: any) => role.code === 'CP236') || {}).idParam,
      typeClient: typePersonne,
      risqueList: this.devis.produit.codeProduit == "45L" && this.devis.groupes.length ==0 ?this.devis.groupes:  [this.devis.groupes[0].risques[0].idRisque] ,
      idClient: this.formCreationSouscripteur?.value?.codeClient,
      nom: this.formCreationSouscripteur?.value?.nom,
      prenom: this.formCreationSouscripteur?.value?.prenom,
      raisonSocial: this.formCreationSouscripteur?.value?.raisonSocial,
      dateNaissance: this.formCreationSouscripteur?.value?.dateNaissance,
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
        description: this.formCreationSouscripteur?.value?.rib
      },
      permis: {
        idDocument: 0,
        description: this.formCreationSouscripteur?.value?.numeroPermis,
        categorie: this.formCreationSouscripteur?.value?.categoriePermis,
        dateDelivrance: '',
        wilayaDelivrance: 0
      }
    };
    this.contrat.personnes.push(personne)

    //List Personne assuré
    this.groupeList.forEach((assure:any)=>{  
      if(this.contrat.personnes[0].nom != assure.paramList.find((paramAssure: any) => paramAssure.codeRisque == "P164").reponse.description
        && this.contrat.personnes[0].prenom !=assure.paramList.find((paramAssure: any) => paramAssure.codeRisque == "P165").reponse.description
        && this.contrat.personnes[0].dateNaissance !=assure.paramList.find((paramAssure: any) => paramAssure.codeRisque == "P166").reponse.description
        && this.formCreationSouscripteur?.value?.codeClient!= assure.idAssure){
            this.personneService.getPersonneById(assure.idAssure).subscribe({
            next: (data: any) => {
              let personneAssure : PersonneContrat = {
                role: (this.roles.find((role: any) => role.code === 'CP241') || {}).idParam,
                typeClient: "PH",
                risqueList: this.devis.produit.codeProduit == "45L" && this.devis.groupes.length ==0 ?this.devis.groupes:  [this.devis.groupes[0].risques[0].idRisque] ,
                idClient: assure.idAssure ? assure.idAssure : null, 
                nom: assure.paramList.find((paramAssure: any) => paramAssure.codeRisque == "P164").reponse.description,
                prenom: assure.paramList.find((paramAssure: any) => paramAssure.codeRisque == "P165").reponse.description,
                raisonSocial: null,
                dateNaissance: assure.paramList.find((paramAssure: any) => paramAssure.codeRisque == "P166").reponse.description,
                nif: null,
                nin: (assure.paramList.find((paramAssure: any) => paramAssure.codeRisque == "P167").reponse.description)?.toString(),
                
                telephone: {
                  idContact: data?.contactList?.find((cnt:any)=>cnt?.typeContact?.code==="CNT1")?.idContact,
                  description: (assure.paramList.find((paramAssure: any) => paramAssure.codeRisque == "P169").reponse.description)?.toString()
                },
                email: {
                  idContact: data?.contactList?.find((cnt:any)=>cnt?.typeContact?.code==="CNT2")?.idContact,
                  description: assure.paramList.find((paramAssure: any) => paramAssure.codeRisque == "P168").reponse.description
                },
                adresse: {
                  idAdresse: data.adressesList?.[0]?.idAdresse,          
                  description: assure.paramList.find((paramAssure: any) => paramAssure.codeRisque == "P170").reponse.description,
                  wilaya: assure.paramList.find((paramAssure: any) => paramAssure.codeRisque ==  "P177").reponse.description,
                  commune: assure.paramList.find((paramAssure: any) => paramAssure.codeRisque ==  "P171").reponse.description
                },
                genre:assure.paramList.find((paramAssure: any) => paramAssure.codeRisque ==  "P172").reponse.idReponse,
                situation: this.formCreationSouscripteur?.value?.situation,
                profession: {
                  id: null,
                  idProfession: null,
                },
                rib: {
                  idRib: 0,
                  description: null
                },
                permis: {
                  idDocument: 0,
                  description:null,
                  categorie: null ,
                  dateDelivrance: '',
                  wilayaDelivrance: 0
                }
        
              
              }
              this.contrat.personnes.push(personneAssure)

            },
            error: (error) => {console.log(error);}
          });  
        }  
     
     
 
  
    })
    


    // this.contrat.risqueList = [
    //   {
    //     risque: []
    //   }
    // ];
    // let idparam
    // let idreponse = null
    // let description = ""
    // let paramElement: any
    // let paramElement2: any
    // let risque: any = {}
    // risque.paramList = []

    // let groupeList: any = []
    //************* param risque

    this.contratGroupe = [];



this.groupeRisque.forEach((el: any) => {
    // Find if a group with the same idGroupe already exists
    const existingGroup = this.contratGroupe.find((group: any) => group.groupe.idGroupe === el.idGroupe);
    if (existingGroup) {
        // If the group exists, push the current risque into groupeList
        existingGroup.groupeList.push(this.groupeList.find((rsq:any)=>rsq.idRisque==el.idRisque));
    } else {
        // If the group doesn't exist, create a new one and add the current risque to groupeList
        this.contratGroupe.push({
            groupe: {
                description: el?.description,
                idGroupe: el?.idGroupe
            },
            groupeList: [this.groupeList.find((rsq:any)=>rsq.idRisque==el.idRisque)]  // Initialize groupeList with the current element
        });

    }

});
    this.contrat.groupes = this.contratGroupe
    const uniqueParamList = (paramList: any[]) => {
      const seen = new Set();
      return paramList.filter((param) => {
        const uniqueKey = param['idParam']; // Use the key to determine uniqueness
        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          return true;
        }
        return false;
      });
    };
    
    this.groupes?.forEach((groupe:any) => {
      groupe?.groupeList?.forEach((risque:any) => {
        risque.paramList = uniqueParamList(risque.paramList);
      });
    });
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
        console.log(error);

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

        console.log(error);

      }
    });
  }

  redirectConsultation() {
    this.changeAccess();

   this.router.navigate(['consultation-police/vie/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + this.route.snapshot.paramMap.get('nomProduit')]);
  }

  checkDateNaissance(stepper: MatStepper) {
    if (this.codeProduit == '45A') {
      if (this.isConducteur) {
        this.formCreationConducteur.get("DateDeNaissance").setValue(moment(this.formCreationConducteur.get("DateDeNaissance").value).format("YYYY-MM-DDT00:00:00.000"))
        this.formCreationSouscripteurDommage.get("dateNaissance").setValue(moment(this.formCreationSouscripteurDommage.get("dateNaissance").value).format("YYYY-MM-DDT00:00:00.000"))

        if (moment(this.formCreationConducteur.get("DateDeNaissance").value).format("YYYY-MM-DDT00:00:00.000") == this.formCreationSouscripteurDommage.get("dateNaissance").value) {
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

  // openDialogEdit(idRisque: any,idGroupe : any){

  //   this.devisService.getParamDevisByIdRisque(this.idDevis, idGroupe, idRisque).subscribe({
  //     next: (riqueData: any) => {
  //       // console.log("data get paramByRisque")
  //       // console.log(riqueData)
        

  //       let dialogRef = this.dialog.open(DialogEditRisqueComponent, {
  //         width: '60%',
  //         data: {
  //           idRisque:idRisque,
  //           risque: riqueData,
  //           paramRisqueAssure: this.paraRisqueAssure,
  //          // infoEditRisque: this.infoEditRisque
  //           infoEditRisque: this.groupeList
  //         }
  //       });
  //       dialogRef.afterClosed().subscribe((result: any) => {
  //           if(result)
  //           {
  //               this.devis.groupes.map((elt:any)=>{
  //                 elt.risques.map((risque:any)=>{
  //                   if(risque.idRisque == idRisque)
  //                   risque.checkEdit = true
  //                 })
  //               })
      
  //               this.devis.groupes.map((elt:any)=>{
                        
  //                   this.varEditRisque =  !elt.risques.some((elt:any)=> elt.checkEdit == false)            
                 
  //               })
      
  //               this.infoEditRisque = result
  //               this.groupeList.push({
  //                 "idRisque": idRisque,
  //                 "paramList": result
  //             });
  //               // this.groupeList = [{
  //               //   "idRisque": idRisque,
  //               //   "paramList": result
  //               // }]                
  //           }
  //       });
  //     },
  //     error: (error) => {


  //     }
  //   });

  
  // }
 
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
