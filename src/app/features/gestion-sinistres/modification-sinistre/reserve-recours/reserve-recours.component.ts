import { Component, OnInit, ViewChild } from '@angular/core';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'
import { MatStepper } from '@angular/material/stepper';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { GenericService } from 'src/app/core/services/generic.service';
import { recours, recoursOR, recoursBenef } from 'src/app/core/models/recours';
import { Patterns } from 'src/app/core/validiators/patterns';
import { ContratService } from 'src/app/core/services/contrat.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export function DecimalValidator(control: FormControl) {
  const decimalPattern = /^\d+(\.\d{1,2})?$/; // Regular expression pattern

  if (control.value && !decimalPattern.test(control.value)) {
    return { invalidDecimal: true };
  }

  return null; // Return null if the value is valid
}
@Component({
  selector: 'app-reserve-recours',
  templateUrl: './reserve-recours.component.html',
  styleUrls: ['./reserve-recours.component.scss']
})
export class ReserveRecoursComponent implements OnInit {
  @ViewChild('stepperH') private stepperH: MatStepper;
  @ViewChild('stepperCompany') private stepperCompany: MatStepper;
  @ViewChild('stepperRestitution') private stepperRestitution: MatStepper;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  formMontantPrevu: FormGroup | any;
  today = new Date()
  formOR: FormGroup | any;
  formROR: FormGroup | any;
  formRestitutionPrevu: FormGroup | any;
  formRestitutionRecu: FormGroup | any;
  codeReserve: string
  typeSelected: string | null = null
  typeRecouvrementParent: string
  codeSinistre: any
  montantRecu: any
  montantPrevu: any
  idContrat: any
  selectedMode: any;
  codeGarantie: string
  dataSource: any = []
  assureInfo: any = []
  assureInfoNew: any = []
  typeBenefs: any = []
  adversaireTab: any = []
  modeRecouvrement: any = []
  modeRecouvrementNew: any = []
  typePieceJustif: any = []
  dataSourceOR = new MatTableDataSource()
  loaderRecoursTab = false
  dataSourceBenef = new MatTableDataSource()
  dataSourceROR = new MatTableDataSource()
  benefTab: any = []
  typesMontants: any = []
  blocOneValid = false
  codeCompanyAdverse: any
  //FIXME renitialiser
  partAssure = 0
  displayedColumns = [
    'garantie',
    'reserve',
    'reserveActuelle',
    'op',
    'reserveTotale',
    'action'
  ];
  displayedColumnsOR = [
    'numOR',
    'montantRecu',
    'partAssureur',
    'partAssure',
    'modeDePaiement',
    'referenceRecouvrement',
    'action'
  ];
  displayedColumnsORRest = [
    'montantRecu',
    'montantRestant',
    'modePaiement',
    'referenceRecouvrement',
  ];
  displayedColumnsBenef = [
    'typeBenef',
    'nom',
    'prenom',
    'montant',
    'modeDePaiementBenf',
    'rib',
    'pieceJustificatif',
  ];
  infoRecours: any = null
  loaderBenef = false
  codeFraude = ""
  benefRecours = new recoursBenef()
  recoursBody = new recours()
  recoursBodyRest = new recours()
  returnedData: boolean = false
  typeBenef: any;
  indexBenef: number = 0;
  assureExist: boolean = false;
  idReglement: any;
  statutSinistre: any;
  codeProduit: any;
  typePersonne: string;
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }
  constructor(private router: Router,private contratService: ContratService, private genericService: GenericService, private formBuilder: FormBuilder, private route: ActivatedRoute, private sinistresService: SinistresService) { }
  ngOnInit(): void {
    this.recoursBody.sinistreBeneficiaires = []
    this.statutSinistre = this.route.snapshot.paramMap.get('statutSinistre')

    if (this.codeSinistre !== null) {
      this.codeSinistre = this.route.snapshot.paramMap.get('codeSinistre');

    }
    this.getSinistreByCode(this.codeSinistre)
    this.getDictionnaire()

  }
  isVirementSelected(): boolean {
    return this.selectedMode === 'Virement';
  }
  getSinistreByCode(code: any) {

    this.sinistresService.getSinistreByCode(code).subscribe({
      next: (data: any) => {
    
        this.codeProduit=data.produit.codeProduit;
        this.adversaireTab = data.sinistrePersonnes.filter((personne: any) => personne.categoriePersonne.code == "C46")
        this.idContrat = data.contratHistorique.idContrat.idContrat
      //  this.codeFraude = data.sinistreFraudes[0].statutFraude.code

      let roleExist = false;
        this.roleUser.find((r: any) => {
          if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
            roleExist = true;
            return;
          }
        })

        if(!roleExist) this.router.navigate(['/dashboard'])

        if(data.sinistreFraudes.length > 0){
          this.codeFraude = data.sinistreFraudes[0].statutFraude.code
        }else{
          this.codeFraude = '' ;
        }

      },
      error: (error: any) => {

        console.log(error);

      }
    });
  }
  typeRecouvrement(type: any) {
    this.typeRecouvrementParent = type
    this.typeSelected = type
    this.returnedData = false
    this.dataSource = []
  }
  getDictionnaire() {
    //get modeRecouvrement
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C60").idCategorie).subscribe(data => {
      this.modeRecouvrement = data;
      this.modeRecouvrementNew = this.modeRecouvrement.filter((mode :any) => mode.description !== 'Chèque agence');
    })
    //get types MONTANT
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C61").idCategorie).subscribe(data => {
      this.typesMontants = data;
    })
    //piece justificatif sinistre
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C59").idCategorie).subscribe(data => {
      this.typePieceJustif = data;
    })
    //type benef
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C78").idCategorie).subscribe(data => {
      this.typeBenefs = data;
    })
  }
  submitRecouvrement() {

    this.loaderRecoursTab = true
    if (this.typeSelected != null)
      this.sinistresService.getRecoursTab(this.codeSinistre, this.typeSelected).subscribe({
        next: (data: any) => {
          this.dataSource = data
          this.returnedData = true
          this.loaderRecoursTab = false
        },
        error: (error) => {
          //  this.errorBody.status=true
          this.returnedData = false
          this.loaderRecoursTab = false
          console.log(error)
          if (error != '') {
            Swal.fire(
              error,
              '',
              'error'
            )
          } else {
            Swal.fire(
              "Erreur systeme, veuillez contacter l'administrateur",
              '',
              'error'
            )
          }

        }
      })
  }

  selectReserve(codeReserve: string, codeGarantie: string, typeRecouvrement: string) {

    this.codeReserve = codeReserve
    this.codeGarantie = codeGarantie
    this.stepperH.next()
    this.getInfoReserve(typeRecouvrement)
    if (typeRecouvrement == 'CP429') {
   
      //FIXME change place
      this.getContratInfo()
    } else if (typeRecouvrement == 'CP430') {
      this.initFormRestitution()

    }


  }
  getInfoReserve(typeRecouvrement: any) {
    this.sinistresService.getInfoRecours(this.typeSelected, this.codeReserve, this.codeSinistre,this.codeProduit).subscribe({
      next: (data: any) => {
        this.initFormMontantPrevu()
        this.infoRecours = data
      //  this.assureInfoNew = data.sinistreReserve.sinistre.contratHistorique.contratPersonneRoleList[0].personne.filter((personne: any) => personne.role.code == "CP235" || personne.role.code == "CP236" || personne.role.code == "CP238" || personne.role.code == "CP240")[0]?.personne
        // here i need to add it 


        this.initFormOR()


        if (data != null) {

          if (typeRecouvrement == 'CP429') {

            this.formMontantPrevu.get("companyAdverse").setValue(data.compagnyAdverse?.description)
            this.codeCompanyAdverse = data.compagnyAdverse?.idParam
            this.formMontantPrevu.get("montantPrevu").setValue(data.montantPrevu)
            this.formMontantPrevu.get("adversaireList").setValue(data.adversaire.idSinistrePersonne)

            this.stepperCompany.selectedIndex = 1

          } else {

            this.formRestitutionPrevu.get("montantPrevu").setValue(data.montantPrevu)
            this.formRestitutionPrevu.get("prenomDebiteur").setValue(data.prenomDebiteur)
            this.formRestitutionPrevu.get("nomDebiteur").setValue(data.nomDebiteur)
            this.stepperRestitution.selectedIndex = 1
          }
          this.recoursBody.idRecours = data.idSinistreRecours
          this.recoursBodyRest.idRecours = data.idSinistreRecours
          this.getAllOR()
        } else {

          if (typeRecouvrement == 'CP429')
            this.stepperCompany.selectedIndex = 0
          else
            this.stepperRestitution.selectedIndex = 0

        }

      },
      error: (error: any) => {



      }
    });
  }
  //EXP BLOC 1 
  initFormMontantPrevu() {
    this.formMontantPrevu = this.formBuilder.group({
      adversaireList: ['', [Validators.required]],
      companyAdverse: [{ value: '', disabled: true }, [Validators.required]],
      montantPrevu: ['', [Validators.required, DecimalValidator]],
    });
  }
  selectAdversaire(adversaireId: any) {

    let adversaire = this.adversaireTab.filter((adve: any) => adve.idSinistrePersonne == adversaireId)[0]

    if (adversaire.compagnyAdverse != null && adversaire.contact != null && adversaire.agenceAdvese != null) {
      let companyAdv = adversaire.compagnyAdverse
      this.formMontantPrevu.get("companyAdverse").setValue(companyAdv?.description)
      this.codeCompanyAdverse = companyAdv.idParam
      this.blocOneValid = false
    } else {
     /* Swal.fire(
        `les informations de cet adversaire ne sont pas complet`,
        '',
        'error'
      )*/
     /// this.formMontantPrevu.get("adversaireList").setValue("")
      this.blocOneValid = false
    }

    //  else {
    //   // Swal.fire(
    //   //   `le taux de responsabilité d'un tier ne peut pas etre égale à 0 `,
    //   //   '',
    //   //   'error'
    //   // )
    //   Swal.fire(
    //     `le taux de responsabilité d'un tier doit etre égale à 0 `,
    //     '',
    //     'error'
    //   )
    //   this.formMontantPrevu.get("adversaireList").setValue("")
    //   this.blocOneValid = true
    // }


  }
  submitMontantPrevu() {
    if (this.formMontantPrevu.valid) {
      this.recoursBody.codeSinistre = this.codeSinistre
      this.recoursBody.codeGarantie = this.codeGarantie
      this.recoursBody.codeReserve = this.codeReserve
      this.recoursBody.montantPrevu = this.formMontantPrevu.get("montantPrevu").value
      this.recoursBody.codeTypeRecours = this.typeSelected
      this.recoursBody.compagnyAdverse = this.codeCompanyAdverse? { "idParam": this.codeCompanyAdverse }: null
      if (this.codeCompanyAdverse === undefined) {
    this.recoursBody.compagnyAdverse = null;
}else{
  this.recoursBody.compagnyAdverse = { "idParam": this.codeCompanyAdverse }

}

      this.recoursBody.adversaire = this.formMontantPrevu.get("adversaireList").value
      this.recoursBody.auditUser = sessionStorage.getItem("userId")
      this.sinistresService.createRecours(this.recoursBody,this.codeProduit).subscribe({
        next: (data: any) => {
          this.montantPrevu = data.montantPrevu

          this.recoursBody = data
          this.submitRecouvrement()

          this.stepperCompany.next()
        },
        error: (error: any) => {

          this.handleError(error)

        }
      });
    }
  }

  //EXP BLOC 2 
  getContratInfo() {
    this.contratService.getContratById(this.idContrat).subscribe({
      next: (data: any) => {
        this.assureInfo = data.personnesList.filter((personne: any) => personne.role.code == "CP235" || personne.role.code == "CP236" || personne.role.code == "CP238" || personne.role.code == "CP240")[0]?.personne
        this.typePersonne = this.assureInfo?.raisonSocial == null ? "PH" : "PM"

  

      },
      error: (error) => {


      }
    })
  }


  initFormOR() {
    this.formOR = this.formBuilder.group({
      montantRecu: ['', [Validators.max(this.montantPrevu), Validators.required, DecimalValidator]],
      partAssureur: ['', [Validators.required]],
      modePaiement: ['', [Validators.required]],
      referenceDeRecouvrement: ['', [Validators.required]],
    });


    // this.formOR.get("modePaiement").setValue(this.recoursBody?.modePaiement.idParam)
    // this.formOR.get("referenceDeRecouvrement").setValue(this.recoursBody?.referenceDeRecouvrement)
  }
  selectModeRecouv(mode: any) {
    //cheque
    if (mode.code == "CP441") {
      this.formOR.get("referenceDeRecouvrement").setValidators([Validators.required])
      this.formOR.get("referenceDeRecouvrement").updateValueAndValidity()
    } else {
      this.formOR.get("referenceDeRecouvrement").setValidators([])
      this.formOR.get("referenceDeRecouvrement").updateValueAndValidity()

    }
  }
  submitFormOr(formDirective: any) {
    if (this.formOR.valid) {
      let orBody = new recoursOR()

      orBody.idRecours = this.recoursBody.idRecours
      orBody.montantRecu = this.formOR.get("montantRecu").value
      orBody.partAssureur = this.formOR.get("partAssureur").value
      orBody.modeRecouvrement = { "idParam": this.formOR.get("modePaiement").value.idParam }
      orBody.referenceRecouvrement = this.formOR.get("referenceDeRecouvrement").value
      orBody.auditUser = sessionStorage.getItem("userId")

      this.sinistresService.addOR(orBody).subscribe({
        next: (data: any) => {

          this.formOR.reset()
          this.getAllOR()
        },
        error: (error: any) => {
          Swal.fire(
            error,
            '',
            'error'
          )
          console.log(error);

        }
      });
    }
  }
  getAllOR() {
    // let idRecours = this.typeRecouvrementParent == 'CP429' ? this.recoursBodyRest.idRecours :this.recoursBodyRest.idRecours
    let idRecours = this.typeRecouvrementParent == 'CP429' ? this.recoursBody.idRecours : this.recoursBodyRest.idRecours

    this.sinistresService.getAllOrByIdRecours(idRecours).subscribe({
      next: (data: any) => {

        this.dataSourceOR.data = data
        this.dataSourceOR.paginator = this.paginator;
      },
      error: (error: any) => {
        Swal.fire(
          error,
          '',
          'error'
        )
        console.log(error);

      }
    });
  }
  //EXP BLOC 3 

  addROR(idReglement: any, partAssure: any) {
    this.stepperCompany.next()
    this.idReglement = idReglement
    this.partAssure = partAssure
    this.initformROR()
    this.getAllBenefByOR()
  }
  getAllBenefByOR() {
    this.loaderBenef = true
    this.sinistresService.getAllBenefByOR(this.idReglement).subscribe({
      next: (data: any) => {

        this.loaderBenef = false

        this.dataSourceBenef.data = data
        this.dataSourceBenef.paginator = this.paginator;
      },
      error: (error: any) => {
        this.loaderBenef = false
        Swal.fire(
          error,
          '',
          'error'
        )
        console.log(error);

      }
    });
  }
  initformROR() {
    this.formROR = this.formBuilder.group({
      typeBenef: ['', [Validators.required]],
      nomBenef: ['', [Validators.required]],
      prenomBenef: ['', [Validators.required]],
      raisonSociale: ['', [Validators.required]],
      pieceJustificatif: ['', [Validators.required]],
    //  montant: ['', [Validators.required, Validators.pattern(Patterns.number), Validators.max(this.partAssure), Validators.min(1), DecimalValidator]],
   //   montant: ['', [Validators.required, Validators.max(this.partAssure), Validators.min(1), DecimalValidator]],
      montant: ['', [Validators.required, DecimalValidator, Validators.max(this.partAssure), Validators.min(1)]],
      modeDePaiementBenf: ['', [Validators.required]],
      rib: ['', [Validators.required, Validators.pattern(Patterns.number)]],

    });
    if (this.typePersonne == "PM") {
      this.formROR.get("nomBenef").setValidators([])
      this.formROR.get("prenomBenef").setValidators([])
      this.formROR.get("rib").setValidators([Validators.required])
      this.formROR.get("raisonSociale").setValidators([Validators.required])
    } else {
      this.formROR.get("nomBenef").setValidators([Validators.required])
      this.formROR.get("prenomBenef").setValidators([Validators.required])
      this.formROR.get("rib").setValidators([Validators.required])

      this.formROR.get("raisonSociale").setValidators([])
    }
  }
  selectTypeBenef(typeBenef: any) {

    this.typeBenef = typeBenef.code
    //FIXME change tyope benef code
    if (this.typeBenef == "CP522") {
      //EXP set values form with assure infos
      const personne = this.infoRecours.sinistreReserve.sinistre.contratHistorique.contratPersonneRoleList.find((contrat: any) => contrat.role.code === "CP235" || contrat.role.code == "CP236" || contrat.role.code == "CP238" || contrat.role.code == "CP240")?.personne;
      this.formROR.get("nomBenef").setValue(personne.nom)
      this.formROR.get("nomBenef").disable()
      this.formROR.get("prenomBenef").setValue(personne.prenom1)
      this.formROR.get("prenomBenef").disable()

      this.formROR.get("raisonSociale").setValue(this.assureInfo?.raisonSocial)
      this.formROR.get("raisonSociale").disable()

      this.formROR.get("rib").setValue(this.assureInfo.payment[this.assureInfo.payment.length - 1]?.donneBancaire?.description)

      this.formROR.get("pieceJustificatif").setValidators([])
      this.formROR.get("pieceJustificatif").updateValueAndValidity()


      console.log("personne ",personne);


    } else {
      this.formROR.get("nomBenef").setValue("")
      this.formROR.get("nomBenef").enable()
      this.formROR.get("prenomBenef").setValue("")
      this.formROR.get("prenomBenef").enable()

      this.formROR.get("rib").setValue("")
      if (this.typeBenef == "CP523") {
        this.formROR.get("pieceJustificatif").setValidators([Validators.required])
        this.formROR.get("pieceJustificatif").updateValueAndValidity()
      }
      else {
        this.formROR.get("pieceJustificatif").setValidators([])
        this.formROR.get("pieceJustificatif").updateValueAndValidity()
      }


    }


  }
  selectModePaiement(mode: any) {
    //virement
    if (mode.code == "CP440") {
      this.formROR.get("rib").setValidators([Validators.required, Validators.pattern(Patterns.number)])
      this.formROR.get("rib").updateValueAndValidity()
    } else {
      this.formROR.get("rib").setValidators([Validators.pattern(Patterns.number)])
      this.formROR.get("rib").updateValueAndValidity()

    }
    this.selectedMode = mode.description;


  }
  submitFormROR(formDirective: any) {
    if(this.isVirementSelected()){
      this.formROR.get("rib").setValidators([Validators.required])
      console.log("this.formROR",this.formROR);
      this.formROR.get("rib").setValidators([Validators.required, Validators.minLength(20), Validators.maxLength(20)]);
    }  
    if (this.formROR.valid) {
   

      let benef = new recoursBenef()
      benef.idRegelement = this.idReglement
      benef.nom = (this.typePersonne == "PH" || this.typeBenef != 'CP522') ? this.formROR.get("nomBenef")?.value : this.formROR.get("raisonSociale")?.value
      benef.prenom = this.formROR.get("prenomBenef")?.value

      benef.typeBeneficiaire = { "idParam": this.formROR.get("typeBenef").value.idParam }
      if (this.typeBenef == 'CP523')
        benef.pieceJustificatif = { "idParam": this.formROR.get("pieceJustificatif").value.idParam }
      benef.modePaiement = { "idParam": this.formROR.get("modeDePaiementBenf").value.idParam }
      benef.montant = Number(this.formROR.get("montant").value)
      benef.reference = this.formROR.get("rib").value
      benef.auditUser = sessionStorage.getItem("userId")
      this.sinistresService.addBenef(benef).subscribe({
        next: (data: any) => {
          this.getAllBenefByOR()
          formDirective.resetForm();
          this.formROR.reset();
          this.formROR.get("nomBenef").enable()
          this.formROR.get("prenomBenef").enable()
          this.formROR.get("raisonSociale").enable()


          Swal.fire({
            title: "paiement executé avec succées",
            icon: 'success',
            allowOutsideClick: false,
            confirmButtonText: `Confirmer`,
            width: 400
          }).then((result) => {
            if (result.isConfirmed) {
              if(this.codeProduit=='96'){
                this.router.navigate(['/gestion-sinistre/dommage/96/mrh/gestionnaire-sinistre/dommage/'+this.codeSinistre]);
              }
              if(this.codeProduit=='95'){
                this.router.navigate(['/gestion-sinistre/dommage/95/mrp/gestionnaire-sinistre/dommage/'+this.codeSinistre]);
              } 
               if(this.codeProduit=='45A'){
              this.router.navigate(['/gestion-sinistre/dommage/45A/automobileMono/gestionnaire-sinistre/dommage/'+this.codeSinistre]);
            }else if(this.codeProduit=='45F'){
              this.router.navigate(['/gestion-sinistre/dommage/45F/automobilFlotte/gestionnaire-sinistre/dommage/'+this.codeSinistre]);
    
          }else if(this.codeProduit=='45L'){
            this.router.navigate(['/gestion-sinistre/dommage/45L/automobileLeasing/gestionnaire-sinistre/dommage/'+this.codeSinistre]);
  
        }
            //
    
            }
          })
        },
        error: (error: any) => {
          Swal.fire(
            error,
            '',
            'error'
          )
          console.log(error);

        }
      });

    }

  }
  deleteBenef(idBenef: any, typeBenef: any) {
    this.benefTab = this.benefTab.filter((benef: any) => benef.idBenef !== idBenef)
    this.dataSourceBenef.data = this.benefTab
    if (typeBenef == "C1")
      this.assureExist = false
  }


  handleError(error: any) {
    Swal.fire(
      error,
      '',
      'error'
    )
  }

  //********** cas restitution */
  initFormRestitution() {

    this.formRestitutionPrevu = this.formBuilder.group({
      nomDebiteur: ['', [Validators.required]],
      prenomDebiteur: ['', [Validators.required]],
      montantPrevu: ['', [DecimalValidator, Validators.required]],
      // montantRecu: ['', [Validators.required]],
      // modeDePaiement: ['', [Validators.required]],
      // referenceDePaiement: ['', [Validators.required]],
    });
    this.formRestitutionRecu = this.formBuilder.group({
      montantRecu: ['', [Validators.max(this.montantPrevu), DecimalValidator, Validators.required]],
      modeDePaiement: ['', [Validators.required]],
      referenceDePaiement: ['', [Validators.required]],
    });
  }
  submitMontantPrevuRest() {

    if (this.formRestitutionPrevu.valid) {

      this.recoursBodyRest.codeSinistre = this.codeSinistre
      this.recoursBodyRest.codeGarantie = this.codeGarantie
      this.recoursBodyRest.codeReserve = this.codeReserve
      this.recoursBodyRest.montantPrevu = this.formRestitutionPrevu.get("montantPrevu").value
      this.recoursBodyRest.codeTypeRecours = this.typeSelected
      this.recoursBodyRest.nomDebiteur = this.formRestitutionPrevu.get("nomDebiteur").value
      this.recoursBodyRest.prenomDebiteur = this.formRestitutionPrevu.get("prenomDebiteur").value
      this.recoursBodyRest.auditUser = sessionStorage.getItem("userId")
      this.sinistresService.createRecours(this.recoursBodyRest,this.codeProduit).subscribe({

        next: (data: any) => {
          this.montantPrevu = data.montantPrevu

          this.recoursBodyRest = data
          this.submitRecouvrement()

          this.stepperRestitution.next()
        },
        error: (error: any) => {

          this.handleError(error)

        }
      });

    }
  }
  addOrRestitution() {
    if (this.formRestitutionRecu.valid) {
      let orBody = new recoursOR()

      orBody.idRecours = this.recoursBodyRest.idRecours
      orBody.montantRecu = this.formRestitutionRecu.get("montantRecu").value
      orBody.modeRecouvrement = { "idParam": this.formRestitutionRecu.get("modeDePaiement").value }
      orBody.referenceRecouvrement = this.formRestitutionRecu.get("referenceDePaiement").value
      orBody.auditUser = sessionStorage.getItem("userId")

      this.sinistresService.addOR(orBody).subscribe({
        next: (data: any) => {

          this.formRestitutionRecu.reset()
          this.getAllOR()
        },
        error: (error: any) => {
          Swal.fire(
            error,
            '',
            'error'
          )
          console.log(error);

        }
      });
    }
  }
  cancelReserve(idReserve: string) {

    this.sinistresService.annulationReserve(idReserve).subscribe({
      next: (data: any) => {
        Swal.fire(
          data,
          '',
          'success'
        )
        this.submitRecouvrement()
      },
      error: (error) => {
        Swal.fire(
          error,
          '',
          'error'
        )
        console.log(error);

      }
    })

  }
}
