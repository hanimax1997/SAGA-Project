
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { GenericService } from 'src/app/core/services/generic.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'
export function DecimalValidator(control: FormControl) {
  const decimalPattern = /^\d+(\.\d{1,2})?$/; // Regular expression pattern

  if (control.value && !decimalPattern.test(control.value)) {
   // return { invalidDecimal: "message" };
   console.log("control")
   console.log(control.value)
    return { 'invalidDecimal': { message: 'Décimal invalid' } }; 
  }
}
//services 
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { Calculateur } from 'src/app/core/models/sinistre';

@Component({
  selector: 'app-create-op-assure',
  templateUrl: './create-op-assure.component.html',
  styleUrls: ['./create-op-assure.component.scss'],
})
export class CreateOpAssureComponent implements OnInit {

  @Input() calculateur: Calculateur;
  formOp: FormGroup | any;
  formOpAssure: FormGroup | any;
  formOpTier: FormGroup | any;
  formOpPrestataire: FormGroup | any;
  jsonOp: any = {};
  tvaList: any = [];
  createOp: Boolean;
  codeSinistre: any;
  codeReserve: any;
  codeProduit: any;
  codeGarantie: any;
  adversaireTab: any = [];
  adversaireId: any ;
  expertList: any = [];  
  codeTypeOp: any = {}
  typeOpList: any = [];
  idDecompte: any;
  idSinistre: any;
  statutSinistre: any;
  companyAdv: any;   
  typeBenificiaire :any = null;  
  typeAssureList :any;  
  typeTiersList :any;
  typePrestataire :any;
  selectedBeneficiaire :any  =null;
  blessesList :any;
  tiersList :any; 
  assure: any  
  codeProduitN:any
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }
  @Output() newItemEvent = new EventEmitter<any>();

  constructor(

    private formBuilder: FormBuilder,
    private genericService: GenericService,
    private route: ActivatedRoute,
    private router: Router,
    private sinistresService: SinistresService,


  ) { }

  ngOnInit(): void {
    this.createOp = false;
    this.getDictionnaireList();

    this.initFormOpAssure();
    this.initFormOpTier();
    this.initFormOpPrestataire();

    if (this.codeSinistre !== null) {
      this.codeSinistre = this.route.snapshot.paramMap.get('codeSinistre');
    }
    this.getCodeProduitA();

    if (this.codeReserve !== null) {
      this.codeReserve = this.route.snapshot.paramMap.get('codeReserve');
    }
    if (this.statutSinistre !== null) {
      this.statutSinistre = this.route.snapshot.paramMap.get('codeStatut');
    }

    if (this.codeGarantie !== null) {
      this.codeGarantie = this.route.snapshot.paramMap.get('codeGarantie');
    }

    this.getListExpert(this.codeSinistre);
    this.getListAdversaire(this.codeSinistre);
   
  }

  getDictionnaireList() {

    //Get type OP
    this.genericService
      .getParam(
        JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find(
          (parametre: any) => parametre.code == 'C52'
        ).idCategorie
      )
      .subscribe((data) => {
        
          this.typeOpList = data.filter((element: any) => this.calculateur?.referencePV ? element.code == 'OPA' || element.code == 'OPT' : element.code == 'OPA' || element.code == 'OPP' || element.code == 'OPT')
        

      });
    // get causes sinistres
    this.genericService
      .getParam(
        JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find(
          (parametre: any) => parametre.code == 'C69'
        ).idCategorie
      )
      .subscribe((data) => {
        this.tvaList = data;
      });
    //get type bénificiaire 
      this.genericService
      .getParam(
        JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find(
          (parametre: any) => parametre.code == 'C99'
        ).idCategorie
      )
      .subscribe((data) => {
        this.typeBenificiaire = data;    
        if(this.codeProduit=='96'){
          this.typeBenificiaire =   this.typeBenificiaire.filter((item:any)=> item.description != "divers");
          console.log(" this.typeBenificiaire", this.typeBenificiaire)  
        }
          
      });
      

  }

  
  getCodeProduitA(){

    this.sinistresService.getSinistreByCode(this.codeSinistre).subscribe({
      next: (data: any) => { 
  
        this.codeProduit= data.produit.codeProduit;
    
        let roleExist = false;
        this.roleUser.find((r: any) => {
          if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
            roleExist = true;
            return;
          }
        })

        if(!roleExist) this.router.navigate(['/dashboard'])
         
        if(this.codeProduit=='96'){
          this.typeBenificiaire =   this.typeBenificiaire.filter((item:any)=> item.description != "divers");
        }
  
        },
         
      error: (error: any) => {
        console.log(error);
      }
    });
  }
   
  

  getListExpert(code: any) {
    this.sinistresService.getListExpert(code).subscribe({
      next: (data: any) => {
        this.expertList = data;
        
       const expected = new Set();
       this.expertList = this.expertList.filter((element: any)  => !expected.has(JSON.stringify(element)) ? expected.add(JSON.stringify(element)) : false);
            

      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getListAdversaire(code: any) {

    this.sinistresService.getSinistreByCode(code).subscribe({
      next: (data: any) => {
        this.adversaireTab = data.sinistrePersonnes.filter((personne: any) => personne.categoriePersonne.code == "C46")

      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  selectTypeTier(typeTier:any){
   
    if(typeTier.code=="CD09"){
      this.getListAdv(this.codeSinistre);
    }else{
      this.getListBlesses(this.codeSinistre);
    }
  }
  getListAdv(code: any) {

    this.sinistresService.getTiers(code).subscribe({
      next: (data: any) => {     
       this.tiersList= data;     
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
  getListBlesses(code: any) {

    this.sinistresService.getBlesses(code).subscribe({
      next: (data: any) => {    
       this.blessesList= data;     
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
  selectTypeOp(typeOp: any) {
    this.codeTypeOp=typeOp;  
    
    if(typeOp.code=="OPA"){      
        this.sinistresService.getByLien(typeOp.idParam).subscribe({
            next: (data: any) => {             
              this.typeAssureList =data ;  
            },
            error: (error) => {
              console.log(error);
            }
      });    
      this.sinistresService.getSinistreByCode(this.codeSinistre).subscribe({
        next: (data: any) => {
          
          this.assure = data.sinistrePersonnes.filter((personne: any) => personne.categoriePersonne.code == "C45")[0]
   
        },
       
        error: (error: any) => {
          console.log(error);
        }
      });

    }else if(typeOp.code=="OPP"){      
      this.sinistresService.getByLien(typeOp.idParam).subscribe({
          next: (data: any) => {             
            this.typePrestataire =data ;  
          },
          error: (error) => {
            console.log(error);
          }
    });    
  }else if(typeOp.code=="OPT"){
     
      this.sinistresService.getByLien(typeOp.idParam).subscribe({
            next: (data: any) => {             
              this.typeTiersList = data ;   
            },
            error: (error) => {
              console.log(error);
            }
      });    
    }
    
}
  selectAdversaire(adversaireId: any) {
    let adversaire = this.adversaireTab.filter((adve: any) => adve.idSinistrePersonne == adversaireId)[0];
    this.companyAdv = {}   
    this.companyAdv.idParam = adversaire?.compagnyAdverse?.idParam
    this.companyAdv.description = adversaire?.compagnyAdverse?.description
    this.companyAdv.code = adversaire.compagnyAdverse?.code
    this.adversaireId=adversaire?.idSinistrePersonne
    
    this.formOpTier.get('companyAdverse').setValue(this.companyAdv?.description)   
    this.formOpTier.get('beneficiaireBless').setValue(adversaire.nom +' '+adversaire.prenom)
    
    if(this.companyAdv.code=='CP405'){
      this.formOpTier.get('beneficiaire').setValue(adversaire.nom +' '+adversaire.prenom)
    }else {
      this.formOpTier.get('beneficiaire').setValue(this.companyAdv.description)
    }    

  }
 
  selectBlesse(blesseId: any) {
 
    let blesse = this.blessesList.filter((bless: any) => bless.idSinistrePersonne == blesseId)[0];
    this.adversaireId =blesse.idSinistrePersonne    
    this.formOpTier.get('beneficiaireBless').setValue(blesse.nom +' '+blesse.prenom)

  }


  initFormOpAssure() {
    this.formOpAssure = this.formBuilder.group({
      refOpAssure: [this.calculateur?.referencePV, [Validators.required, Validators.maxLength(15)]],     
      typeAssureList: ['', [Validators.required]],
      typeBenificiaire: [''],
      nomBenificiaire: [''],
      prenomBenificiaire: [''],
      opHtcAssure: [{ value: this.calculateur?.totalRegle, disabled: this.calculateur?.totalRegle ? true : false}, [Validators.required, DecimalValidator]],
    });
  }
  initFormOpPrestataire() { 
    this.formOpPrestataire = this.formBuilder.group({
      opPrestataireList: ['', [Validators.required,]],
      refOpPrestataire: ['', [Validators.required, Validators.maxLength(15)]],
      opTvaPrestataire: ['', [Validators.required]],
      opBaseTva: ['', [Validators.required, DecimalValidator]],
      typePrestataire: [''],
      nomPrestataire: [''],
      pernomPrestataire: [''],
      totalHt: ['', [Validators.required, DecimalValidator]]
    });
  }
  initFormOpTier() {    
    this.formOpTier = this.formBuilder.group({
      typeTier: ['', [Validators.required]], 
      adversaire: [''],
      typeBeneficiairetier: [''],      
      nomBenificiaire: [''],      
      blesse: [''],      
      prenomBenificiaire: [''],      
      beneficiaire: [{value: '', disabled: true}],      
      beneficiaireBless: [{value: '', disabled: true}],      
      companyAdverse: [{value: '', disabled: true}],      
      montantIndmnt: [{ value: this.calculateur?.totalRegle, disabled: this.calculateur?.totalRegle ? true : false}, [Validators.required, DecimalValidator]],
    });
  }



  submitOp() {
    this.jsonOp = {};
    
    if (this.formOpAssure.valid) {
      this.createOp = true;
      this.jsonOp = {};
      this.jsonOp.typeOp = {}
      this.jsonOp.typeOp.idParam = this.codeTypeOp.idParam; 
      this.jsonOp.typeOp.code = this.codeTypeOp.code; 
      this.jsonOp.sinistrePersonne={}  
      this.jsonOp.sinistrePersonne.idSinistrePersonne = this.assure?.idSinistrePersonne   
      this.jsonOp.typeBenificiaire = {}      
      this.jsonOp.typeBenificiaire.idParam = this.formOpAssure.get("typeAssureList").value.idParam;    
      this.jsonOp.typeBenificiaire.code = this.formOpAssure.get("typeAssureList").value.code; 
   
      if(this.formOpAssure.get("typeAssureList").value.code == 'CP522' ){        
          this.jsonOp.benificiaire = null;
      }else{
          this.jsonOp.benificiaire = {}
          this.jsonOp.benificiaire.idParam = this.formOpAssure.get("typeBenificiaire").value.idParam;
          this.jsonOp.benificiaire.code = this.formOpAssure.get("typeBenificiaire").value.code;
    
      }      
      this.jsonOp.nom = this.formOpAssure.get("nomBenificiaire").value;
      this.jsonOp.prenom = this.formOpAssure.get("prenomBenificiaire").value;
      this.jsonOp.referenceDocument = this.formOpAssure.get("refOpAssure").value;
      this.jsonOp.montantTTC = this.formOpAssure.get("opHtcAssure").value;


    }else if(this.formOpPrestataire.valid){      
     
        this.createOp = true;
        this.jsonOp = {};       
        this.jsonOp.typeOp = {}
        this.jsonOp.typeOp.idParam = this.codeTypeOp.idParam;
        this.jsonOp.typeOp.code = this.codeTypeOp.code;
        this.jsonOp.referenceDocument = this.formOpPrestataire.get("refOpPrestataire").value;
        this.jsonOp.montantHTC = this.formOpPrestataire.get("opBaseTva").value;
        this.jsonOp.tva = {}
        this.jsonOp.tva.idParam = this.formOpPrestataire.get("opTvaPrestataire").value.idParam;
        this.jsonOp.tva.code = this.formOpPrestataire.get("opTvaPrestataire").value.code;
        this.jsonOp.totalHt = this.formOpPrestataire.get("totalHt").value;
  
        if (this.formOpPrestataire.get('opPrestataireList').value == '0') {
          this.jsonOp.nom = this.formOpPrestataire.get("nomPrestataire").value;
          this.jsonOp.prenom = this.formOpPrestataire.get("pernomPrestataire").value;
          this.jsonOp.benificiaire = {}
          this.jsonOp.benificiaire.idParam = this.formOpPrestataire.get("typePrestataire").value.idParam;
          this.jsonOp.benificiaire.code = this.formOpPrestataire.get("typePrestataire").value.code;
          
        } else {
          this.jsonOp.expert = {}
          this.jsonOp.expert.idExpert = this.formOpPrestataire.get("opPrestataireList").value;
          
        }
      }else if(this.formOpTier.valid){  
       
        this.createOp = true;
        this.jsonOp = {};        
        this.jsonOp.typeOp = {}
        this.jsonOp.typeOp.idParam = this.codeTypeOp.idParam;  
        this.jsonOp.typeOp.code = this.codeTypeOp.code; 
        this.jsonOp.montantTTC = this.formOpTier.get("montantIndmnt").value; 
        if(this.formOpTier.get("typeTier").value.code == 'CD09'){
          //----------Tier-------------//
        this.jsonOp.typeBenificiaire = {}
        this.jsonOp.typeBenificiaire.idParam =this.formOpTier.get("typeTier").value.idParam    
        this.jsonOp.typeBenificiaire.code =this.formOpTier.get("typeTier").value.code    
       
        if (this.selectedBeneficiaire=="01"){
          this.jsonOp.sinistrePersonne={}      
          this.jsonOp.sinistrePersonne.idSinistrePersonne  =this.formOpTier.get("adversaire").value; 
          let adversaire = this.adversaireTab.find((adve: any) => adve.idSinistrePersonne == this.jsonOp.sinistrePersonne.idSinistrePersonne)

          this.jsonOp.nom = adversaire.nom
          this.jsonOp.prenom = adversaire.prenom
         }else{
          this.jsonOp.sinistrePersonne={}      
          this.jsonOp.sinistrePersonne.idSinistrePersonne  =this.formOpTier.get("adversaire").value; 
          this.jsonOp.benificiaire = {}
          this.jsonOp.benificiaire.idParam = this.formOpTier.get("typeBeneficiairetier").value.idParam
          this.jsonOp.benificiaire.code = this.formOpTier.get("typeBeneficiairetier").value.code
          this.jsonOp.nom = this.formOpTier.get("nomBenificiaire").value
          this.jsonOp.prenom = this.formOpTier.get("prenomBenificiaire").value
         }     

        }else{         
          //--------Bléssé/décé-------//
            this.jsonOp.typeBenificiaire = {}
            this.jsonOp.typeBenificiaire.idParam =this.formOpTier.get("typeTier").value.idParam 
            this.jsonOp.typeBenificiaire.code =this.formOpTier.get("typeTier").value.code 
          if (this.selectedBeneficiaire=="01"){    
            this.jsonOp.sinistrePersonne={}           
            this.jsonOp.sinistrePersonne.idSinistrePersonne = this.formOpTier.get("blesse").value;
           }else{
            this.jsonOp.benificiaire = {}
            this.jsonOp.benificiaire.idParam = this.formOpTier.get("typeBeneficiairetier").value.idParam
            this.jsonOp.benificiaire.code = this.formOpTier.get("typeBeneficiairetier").value.code
            this.jsonOp.sinistrePersonne={}           
            this.jsonOp.sinistrePersonne.idSinistrePersonne = this.formOpTier.get("blesse").value;
            this.jsonOp.nom = this.formOpTier.get("nomBenificiaire").value
            this.jsonOp.prenom= this.formOpTier.get("prenomBenificiaire").value
           }
        }

      }
      this.jsonOp.calculateur = this.calculateur
    
      this.newItemEvent.emit(this.jsonOp);

      // this.sinistresService.addOp(this.codeSinistre, this.codeReserve, this.codeGarantie, this.jsonOp).subscribe({
      //   next: (data: any) => {
      //     this.createOp = false;
      //     this.idSinistre = data.sinistreReserve.sinistre.idSinistre
      //     this.idDecompte = data.idDecompteOp
      //     this.jsonOp.montantTTCPrestataire = data.montantTTC;

      //     Swal.fire({
      //       title: "Décompte enregistré avec succès",
      //       icon: 'success',
      //       allowOutsideClick: false,
      //       showDenyButton: true,
      //       confirmButtonText: `Passer au paiement`,
      //       denyButtonText: `Passer en instance`,
      //       denyButtonColor: "#4942E4",
      //       width: 600
      //     }).then((result) => {
    
      //      // gestion-sinistre/45A/automobileMono/gestionnaire-sinistre/5160145A2300002/OP/OPA/505/null/710/paiement
      //      //gestion-sinistre/:codeProduit/:nameProduit/gestionnaire-sinistre/:codeSinistre/:typeDecompte/:codeTypeDecompte/:idDecompte/:idSinistre/paiement
      //       if (result.isConfirmed) {
      //         this.router.navigate(['../../../../../' + '/OP/' + this.codeTypeOp.code + '/' + this.idDecompte + '/null/' + this.idSinistre + '/paiement'], { relativeTo: this.route });

      //       } else if (result.isDenied) {
      //         this.router.navigate(['../../../../../' + '/OP/' + this.idDecompte + '/creation-instance'], { relativeTo: this.route });
      //       }
      //     })
      //   },
      //   error: (error) => {
      //     this.createOp = false;
      //     console.log("erreur " + error);

      //   }
      // });
  } 
 

  goTo(where: string) {
    switch (where) {
      case "instance":
        this.router.navigate(['../../../../../' + '/OP/' + this.idDecompte + '/creation-instance'], { relativeTo: this.route });

        break;
      default:
        break;
    }
  }
  goBack() {

    this.router.navigate(['../../../../'], { relativeTo: this.route });
    //  this.router.navigateByUrl("gestion-sinistre-automobileMono/" + this.codeSinistre + "/gestionnaire-sinistre/" + this.statutSinistre + "/reserve-paiement");
  }
}
