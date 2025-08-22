import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
//services 
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { GenericService } from 'src/app/core/services/generic.service';
import { ParamRisqueService } from '../../../core/services/param-risque.service'
import { AgencesService } from 'src/app/core/services/agences.service';
import { VehiculeService } from 'src/app/core/services/vehicule.service';

import { MatStepper } from '@angular/material/stepper';
import { Patterns } from 'src/app/core/validiators/patterns';

import * as moment from 'moment';
import Swal from 'sweetalert2'
import { MatTableDataSource } from '@angular/material/table';
import { ContratService } from 'src/app/core/services/contrat.service';
import { Dictionnaire } from 'src/app/core/models/dictionnaire';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { SinistrePostJson } from 'src/app/core/models/sinistre';
import { PersonneSinistre } from 'src/app/core/models/sinistre';
@Component({
  selector: 'app-create-sinistre',
  templateUrl: './create-sinistre.component.html',
  styleUrls: ['./create-sinistre.component.scss']
})

export class CreateSinistreComponent implements OnInit {
  @ViewChild('stepper') private stepper: MatStepper;
  @ViewChild('stepperH') private stepperH: MatStepper;
  @ViewChild('stepperInfoVehicule') private stepperInfoVehicule: MatStepper;
  today = new Date()
  formPolice: FormGroup | any;
  formInfoSinistre: FormGroup | any;
  formInfoVehicule: FormGroup | any;
  formInfoConducteur: FormGroup | any;
  formInfoAdversaire: FormGroup | any;
  formInfoBlesses: FormGroup | any;
  maxDate = new Date()
  wilayasDelivrance: any
  natureSinistre = ''
  codeSinistre = ""
  imatriculations: any = []
  pays: any = []
  loaderNature = false
  wilayas: any = []
  communes: any = []
  marques: any = []
  models: any = []
  vehiculesteps = {
    "step1": false,
    "step2": false,
    "step3": false,
  }
  submitedInfoSinistre = false
  submitedInfoVehicule = false
  companiesAdverse: any = []
  typeConducteur: any
  zonesAffectees: any = []
  filteredZonesAffectees: any = []
  blessesTab: any = []
  garantieList: any = []
  resumeObject: any
  dataSourceBlesses = new MatTableDataSource()
  displayedColumnsBlesses: any;
  sinistreBody = new SinistrePostJson()
  dateSurevance = new Date()
  numPolice: string = ''
  errorBody = {
    "error": false,
    "msg": ''
  }
  loaderSinistre = false
  indexTier = 0
  sinistreNotAllowed = false
  formVehiculeReady = false
  matriculeExist = false
  resumeReadu = false
  codeRisque = ""
  labelAssure = {
    "label": "conducteur",
    "type": "physique"
  }
  typesinistree: any = []
  loaderZone = false
  originExist = false
  sumitedTier = false
  indexBlesse = 0
  tierExist = false
  formConducteurReady = false
  autoriteExist = false
  futurAssisteurExist = false
  policyExist = false
  listAssisteurExist = false
  blesseExist = false
  tiersClicked = {
    "blesse": false,
    "adversaire": false,
    "assistance": false,
  }
  causeSinistre: any
  idProduit = 0
  defaultChoice: any
  conducteurPersonne = new PersonneSinistre()
  adversairePersonne = new PersonneSinistre()
  blessePersonne = new PersonneSinistre()
  selectedIndex: number = 0;
  mindDateDeclaration = new Date()
  infoSinistreStep = { "step1": true, "step2": false }
  tierTab: any = []
  dataSourceTier = new MatTableDataSource()
  displayedColumns: any
  dateSurvenance = { "exist": false, "date": new Date() }
  timeSurvenance = { "exist": false, "time": "" }
  causesSinistreArray: any = []
  agenceAdversesArray: any = []
  filteredAgenceAdversesArray: any = []
  filteredcausesSinistre: any
  originesSinistreArray: any = []
  paramRisqueAll: any = []
  agencesList: any = []
  successSinistre = false
  disableZone = false
  infoPolice: any = {}
  filterlistMatricules: any = []

  tempArray = [
    {
      "id": 1,
      "description": "exemple 1"
    },
    {
      "id": 2,
      "description": "exemple 2"
    },
    {
      "id": 3,
      "description": "exemple 3"
    },
  ]
  tierRadioControl: FormControl = new FormControl();

  typeConducteursArray: any = []
  assisteurs: any = []
  typeAdversaireArray: any = []
  typeBlessesArray: any = []
  idRisque: any;
  idGroupe: any;
  // statutInterdit=["resiliation",'annulation','suspension']
  autorites = [
    {
      "id": 1,
      "value": "Oui",
    },
    {
      "id": 2,
      "value": "Non",
    }
  ]
  doublonsZone = false
  disabledZone = false
  defaultChoiceBlesse: any
  disabledTime = true
  typeAdversaireSelected: any;
  dateTimeSurevance: any = null;
  conducteurError: boolean;
  dataEffetContrat: any;
  tiersLength = 0;
  blessesLength = 0
  codeProduit: any
  produit: any
  multiRisque = false
  listMatricules: any;
  idHisContrat: any;
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["WEB_HELP", "GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["WEB_HELP", "GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["WEB_HELP", "GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["WEB_HELP", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["WEB_HELP", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }

  constructor(private route: ActivatedRoute, private router: Router, private vehiculeService: VehiculeService, private agencesService: AgencesService, private paramRisqueService: ParamRisqueService, private contratService: ContratService, private genericService: GenericService, private sinistresService: SinistresService, private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')
    this.produit = this.route.snapshot.paramMap.get('nameProduit')
    this.sinistreBody.personnes = []
    this.sinistreBody.auditUser = sessionStorage.getItem("userId")
    this.displayedColumns = this.codeProduit != '95' && this.codeProduit != '96' ? ['typeAdversaire', "name", "action"] : ["name", "action"]

    this.displayedColumnsBlesses = this.codeProduit != '95' && this.codeProduit != '96' ? ['etatSinistree', "name", "dateNaissance", "typeBlesse", "action"] : ['etatSinistree', "name", "dateNaissance", "action"]

    let roleExist = false;
    this.roleUser.find((r: any) => {
      if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
        roleExist = true;
        return;
      }
    })

    if(!roleExist) this.router.navigate(['/dashboard'])
      
    this.getProductId()
    this.getAllParamRisque()
    this.getAllAgences()
    this.initFormPolice()
    this.initFormInfoSinistre()
    //get lieu de survenance 
    this.getPays()
    this.initFormVehicule()

    this.getDictionnaireList()
  }

  getProductId() {
    this.idProduit = JSON.parse(sessionStorage.getItem('products') || '{}')?.find((parametre: any) => parametre.codeProduit == this.codeProduit)?.idProduit
    this.getInfoProduit()
  }
  getInfoProduit() {
    this.genericService.getPorduitById(this.idProduit).subscribe({
      next: (data: any) => {


        this.multiRisque = data?.param_Produit_Reponses?.filter((element: any) => element?.idParamProduit?.libelle == "multirisque")[0]?.reponse?.description == "Oui" ? true : false

        //    this.multiRisque = data.param_Produit_Reponses.filter((element: any) => element.idParamProduit.libelle == "multirisque")[0].reponse.description == "Oui" ? true : false
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getAllParamRisque() {
    this.paramRisqueService.getParamByProduit(this.idProduit).subscribe({
      next: (data: any) => {
        this.paramRisqueAll = data
      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  getAllAgences() {
    this.agencesService.getAllAgence().subscribe({
      next: (data: any) => {
        this.agencesList = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  getDictionnaireList() {
    // get causes sinistres 


    this.genericService.getCause(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}')?.find((parametre: any) => parametre.code == "C43")?.idCategorie, this.codeProduit).subscribe(data => {
      this.causesSinistreArray = data;
      this.filteredcausesSinistre = this.causesSinistreArray.slice()
    })
    // get origines Sinistre
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}')?.find((parametre: any) => parametre.code == "C44")?.idCategorie).subscribe(data => {
      this.originesSinistreArray = data;
    })

    //get type conducteur 
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}')?.find((parametre: any) => parametre.code == "C45")?.idCategorie).subscribe(data => {
      this.typeConducteursArray = data;
    })


    //get type adversaires 
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}')?.find((parametre: any) => parametre.code == "C46")?.idCategorie).subscribe(data => {
      this.typeAdversaireArray = data;
      if (this.codeProduit == '45F'|| this.codeProduit == '45A' || this.codeProduit == '45L'){
        this.typeAdversaireArray = this.typeAdversaireArray.filter((parametre: any)=> parametre.code !== 'dv96');
        }

    })

    //get type typeBlesses 
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}')?.find((parametre: any) => parametre.code == "C47")?.idCategorie).subscribe(data => {
      this.typeBlessesArray = data;
    })

    //get entreprise adverse
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}')?.find((parametre: any) => parametre.code == "C51")?.idCategorie).subscribe(data => {
      this.companiesAdverse = data;
    })
    //etat sinistre 
    //get entreprise adverse
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}')?.find((parametre: any) => parametre.code == "C54")?.idCategorie).subscribe(data => {
      this.typesinistree = data;
    })
    //ASSISTEURS
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}')?.find((parametre: any) => parametre.code == "C55")?.idCategorie).subscribe(data => {
      this.assisteurs = data;
    })

  }
  initFormPolice() {
    this.formPolice = this.formBuilder.group({
      numPolice: ['', [Validators.required]],
      dateSurvenance: [{ value: '', disabled: true }, Validators.required],
      timeSurvenance: [{ value: '', disabled: true }, Validators.required],
      //FIX ,Validators.maxLength(13),Validators.minLength(13)
      immatriculation: [{ value: '', disabled: true }, (this.codeProduit != '95' && this.codeProduit != '96') ? [Validators.required] : []],
    });

  }
  getPays() {
    this.genericService.getPays().subscribe({
      next: (data: any) => {

        this.pays = data
        this.formInfoSinistre.get("pays").setValue((this.pays.filter((pays: any) => pays.codePays == 'DZA')[0]?.idPays))
        this.getWilayas(this.pays.filter((pays: any) => pays.codePays == 'DZA')[0]?.idPays)
        this.getWilayasDelivrance()
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getWilayas(idPays: any) {
    this.formInfoSinistre.get("wilayas").setValue('')
    this.wilayas = []
    this.genericService.getAllWilayas(idPays).subscribe({
      next: (data: any) => {

        this.wilayas = data
        this.formInfoSinistre.get("commune").setValue('')
        this.communes = []
      },
      error: (error) => {

        console.log(error);

      }
    });
    if (this.pays.filter((pays: any) => pays.idPays == idPays)[0]?.codePays == 'DZA' && (this.codeProduit != '95' && this.codeProduit != '96')) {

      this.formInfoSinistre.get("wilayas").enable()
      this.formInfoSinistre.get("commune").enable()
      this.formInfoSinistre.get("wilayas").setValidators([Validators.required])
      this.formInfoSinistre.get("wilayas").updateValueAndValidity()
    } else {
      this.formInfoSinistre.get("wilayas").disable()
      this.formInfoSinistre.get("commune").disable()
      this.formInfoSinistre.get("wilayas").setValidators([])
      this.formInfoSinistre.get("wilayas").updateValueAndValidity()
    }



  }
  getWilayasDelivrance() {
    this.genericService.getAllWilayas((this.pays.filter((pays: any) => pays.codePays == 'DZA')[0]?.idPays)).subscribe({
      next: (data: any) => {

        this.wilayasDelivrance = data

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getCommunes(idWilaya: any) {
    this.genericService.getAllCommuneByWilaya(idWilaya).subscribe({
      next: (data: any) => {

        this.communes = data

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  onPoliceInput(event: any) {
    // TODO call function vérification si police exist 
    if (this.numPolice.length > 11 && this.numPolice.length <= 16) {
      this.contratService.getPolicyExist(this.numPolice).subscribe({
        next: (data: any) => {
          if (data.exist) {
            this.formPolice.get("dateSurvenance").enable()
            this.formPolice.get("timeSurvenance").enable()
            this.disabledTime = false
            this.errorBody.error = false
            this.errorBody.msg = ""
            this.dataEffetContrat = data.dateEffet
          }
          else {
            this.formPolice.controls['numPolice'].setErrors({ 'incorrect': true });
            this.formPolice.get("dateSurvenance").setValue("");
            this.formPolice.get("timeSurvenance").setValue("");
            this.formPolice.get("dateSurvenance").disable()
            this.formPolice.get("timeSurvenance").disable()
            this.errorBody.error = true
            this.errorBody.msg = "Police inexistante."
            Swal.fire(
              this.errorBody.msg,
              '',
              'error'
            )
          }

        },
        error: (error) => {

          console.log(error);

        }
      });
    }
  }
  dateSurvenanceChange(dateSurevance: any) {

    if (dateSurevance != "") {
      this.dateSurvenance.exist = true
      if (this.timeSurvenance.exist) {
        this.mindDateDeclaration = this.formPolice.get("dateSurvenance").value
        var dateTime = moment(this.formPolice.get("dateSurvenance").value, 'ddd MMM D YYYY HH:mm:ss ZZ');
        let hours = this.formPolice.get("timeSurvenance").value.split(":")[0]
        let minutes = this.formPolice.get("timeSurvenance").value.split(":")[1]
        dateTime.set({ h: hours, m: minutes });
        this.dateTimeSurevance = dateTime
        if (this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L')
          this.getMatricule(dateTime.format())
        else{
          this.matriculeExist = true
        }
         
        let bodyRequested = {
          "idContrat": this.numPolice,
          "date": dateTime
        }
        this.contratService.getHistoriqueStatus(bodyRequested).subscribe({
          next: (data: any) => {
            this.matriculeExist = data.status
            if(!data.status){
              Swal.fire('Cette police est résiliée avant la survenance du sinistre', '', 'error');
            }
          },
          error: (error) => {

            console.log(error);
    
          }
        });

      }
    }
    else
      this.dateSurvenance.exist = false
    this.dateSurvenance.date = dateSurevance

  }
  timeSurvenanceChange(time: any) {
    if (time != "") {
      this.timeSurvenance.exist = true
      if (this.dateSurvenance.exist) {
        // let dateString = moment(this.formPolice.get("dateSurvenance").value).format("DD/MM/YYYY")
        var dateTime = moment(this.formPolice.get("dateSurvenance").value, 'ddd MMM D YYYY HH:mm:ss ZZ');
        let hours = this.formPolice.get("timeSurvenance").value.split(":")[0]
        let minutes = this.formPolice.get("timeSurvenance").value.split(":")[1]
        dateTime.set({ h: hours, m: minutes });
        this.dateTimeSurevance = dateTime
        if (this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L')
          this.getMatricule(dateTime.format())
        else {
          this.matriculeExist = true

        }
        
        let bodyRequested = {
          "idContrat": this.numPolice,
          "date": dateTime
        }
        this.contratService.getHistoriqueStatus(bodyRequested).subscribe({
          next: (data: any) => {
            this.matriculeExist = data.status
            if(!data.status){
              Swal.fire('Cette police est résiliée avant la survenance du sinistre', '', 'error');
            }

          },
          error: (error) => {

            console.log(error);
    
          }
        });

      }
    }
    else
      this.timeSurvenance.exist = false

    this.timeSurvenance.time = time


  }
  getMatricule(dateTime: any) {
    let bodyRequested = {
      "idContrat": this.numPolice,
      "date": dateTime
    }
    this.contratService.getMatricule(bodyRequested).subscribe({
      next: (data: any) => {

        // data[0] for mono
        if (data.length != 0) {
          this.matriculeExist = true
          this.idHisContrat = data.idHistorique

          if (!this.multiRisque) {
            this.formPolice.get("immatriculation").disable()
            this.formPolice.get("immatriculation").setValue(data?.immatriculationList[data.immatriculationList.length - 1]?.nimmatriculation)
            this.idRisque = data?.immatriculationList[data.immatriculationList.length - 1]?.idRisque
            this.idGroupe = data?.immatriculationList[data.immatriculationList.length - 1]?.idGroupe
          }
          else {
            this.formPolice.get("immatriculation").enable()
            this.listMatricules = data.immatriculationList
            this.filterlistMatricules =  this.listMatricules.slice()


          }
        }
        else {
          this.formPolice.get("immatriculation").setValue(null)
          this.matriculeExist = false
          Swal.fire(
            `Aucune immatriculation n'est liée au mouvement`,
            '',
            'error'
          )
        }
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  submitInfoPolice() {
    // let dateString = moment(this.formPolice.get("dateSurvenance").value).format("DD/MM/YYYY")
    // let dateTime = moment(dateString + ' ' + this.formPolice.get("timeSurvenance").value)
    this.dateSurevance = this.formPolice.get("dateSurvenance").value
    this.formPolice.get("immatriculation").enable()
    this.infoSinistreStep.step1 = false
    this.codeProduit == '95' || this.codeProduit == '96' ? this.idHisContrat = 0 : ""
    if (this.formPolice.valid) {
      this.formPolice.get("immatriculation").disable()

      this.sinistreBody.numPolice = this.formPolice.get("numPolice").value
      this.sinistreBody.dateSurvenance = this.dateTimeSurevance

      //EXP get policy info 
      let risque = this.multiRisque ? this.formPolice.get("immatriculation").value?.idRisque : this.idRisque
      let groupe = this.multiRisque ? this.formPolice.get("immatriculation").value?.idGroupe : this.idGroupe
      let bodyGetInfoPolice = {
        "idContrat": this.sinistreBody?.numPolice,
        "date": this.sinistreBody?.dateSurvenance,
        "risque": risque,
        "groupe": groupe,
      }

      this.sinistresService.getPolicyInformationsByRisque(bodyGetInfoPolice, this.idHisContrat).subscribe({
        next: (data: any) => {

          if (data.length != 0) {

            this.sinistreBody.agenceContrat = data.agence?.codeAgence
            this.sinistreBody.idHistorique = data.idHistorique
            this.sinistreBody.produit = data.produit
            this.infoPolice = data
            this.infoPolice.assure = data.personnesList?.filter((personne: any) => personne?.role?.code == "CP235" || personne?.role?.code == "CP236" || personne?.role?.code == "CP238" || personne?.role?.code == "CP240")[0]?.personne

            if ('raisonSocial' in this.infoPolice.assure) {
              Object.assign(this.infoPolice.assure, { typePersonne: "personneMorale" });
            } else {
              Object.assign(this.infoPolice.assure, { typePersonne: "personnePhysique" });
            }

            //EXP extract garanties
            this.garantieList = this.infoPolice?.paramContratList
            //EXP extract code risque
            this.codeRisque = this.multiRisque ? this.formPolice.get("immatriculation").value?.idRisque : this.infoPolice?.groupesList[0]?.risques[0]?.idRisque
            this.sinistreBody.codeRisque = this.codeRisque

            if (this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L') {
              //EXP get idParam de l'immatriculation 
              this.sinistreBody.immatriculation = {

                "idParam": this.paramRisqueAll?.filter((risque: any) => risque?.paramRisque?.codeParam == "P38")[0]?.paramRisque?.idParamRisque,
                "valeur": this.multiRisque ? this.formPolice.get("immatriculation").value?.nimmatriculation : this.formPolice.get("immatriculation").value,

              }

              this.setValeurVehicule()
            }
            else {
              this.sinistreBody.adresse = this.infoPolice?.risqueList?.find((r: any) => r.codeRisque == "P245" || r.codeRisque == "P106" || r.codeRisque == "P141")?.reponse?.valeur
              this.sinistreBody.wilaya = this.infoPolice?.risqueList?.find((r: any) => r.codeRisque == "P246" || r.codeRisque == "P125")?.reponse
              this.sinistreBody.commune = this.infoPolice?.risqueList?.find((r: any) => r.codeRisque == "P247" || r.codeRisque == "P126")?.reponse

              this.setValeurBien()
            }

            this.policyExist = true

            this.controlDoublons()
            this.sinistreBody.paramContratList = data.paramContratList

          } else {
            this.policyExist = false
            Swal.fire(
              `Cette police n'existe pas`,
              '',
              'error'
            )
          }
          this.initFormConducteur()
        },
        error: (error) => {
          this.infoSinistreStep.step1 = true
          console.log(error);
          Swal.fire(
            error,
            '',
            'error'
          )
        }
      })

      // if doublons 
      // Swal.fire(
      //   `Attention , un sinistre existe déjà pour ce véhicule avec la même date de survenance`,
      //   '',
      //   'warning'
      // )
    } else {



      if (this.formPolice.get("immatriculation").value == null) {
        Swal.fire(
          `Aucune immatriculation n'est liée au mouvement`,
          '',
          'error'
        )
      }
      this.formPolice.get("immatriculation").disable()
      // this.formPolice.markAllAsTouched()
    }

  }
  initFormInfoSinistre() {
    this.formInfoSinistre = this.formBuilder.group({
      dateDeclaration: ['', [Validators.required]],
      wilayas: ['', (this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L') ? [Validators.required] : []],
      commune: ['', []],
      pays: ['', (this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L') ? [Validators.required] : []],
      causeSinistre: ['', [Validators.required]],
      originSinistre: [null, [Validators.required]],
      contactOrigine: ['', []],
      autorite: ['', [Validators.required]],
      nomAutorite: ['', []],
      descriptionSinistre: ['', [Validators.required]],
      agence: ['', [Validators.required]],
      tauxResponsabilite: ['', [Validators.required, Validators.pattern(Patterns.number)]],

      //TODO auditUser: ['',[ Validators.required]],

    });
  }

  submitInfoSinistre() {
    this.submitedInfoSinistre = true

    if (this.formInfoSinistre.valid) {
      this.sinistreBody.dateDeclaration = moment(this.formInfoSinistre.get("dateDeclaration").value).format('YYYY-MM-DD')
      this.sinistreBody.communeSurvenance = this.formInfoSinistre.get("commune").value
      this.sinistreBody.wilayaSurvenance = this.formInfoSinistre.get("wilayas").value

      this.sinistreBody.paysSurvenance = this.formInfoSinistre.get("pays").value
      this.sinistreBody.causeSinistre = { "idParam": this.formInfoSinistre.get("causeSinistre").value?.idParam }
      this.sinistreBody.origineSinistre = { "idParam": this.formInfoSinistre.get("originSinistre").value?.idParam }

      this.sinistreBody.contactOrigine = this.formInfoSinistre.get("contactOrigine").value

      if (this.sinistreBody.origineSinistre)
        this.sinistreBody.descriptionSinistre = this.formInfoSinistre.get("descriptionSinistre").value
      this.sinistreBody.autorite = this.formInfoSinistre.get("nomAutorite").value
      this.sinistreBody.agence = this.formInfoSinistre.get("agence").value
      this.sinistreBody.tauxResponsabilite = this.formInfoSinistre.get("tauxResponsabilite").value
      this.infoSinistreStep.step2 = true
      this.causeSinistre = this.formInfoSinistre.get("causeSinistre").value?.code
      this.defaultChoice = null

      switch (this.causeSinistre) {
        case 'AUT004':
          this.tierTab = []
          this.sinistreBody.personnes = this.sinistreBody?.personnes?.filter((personne: any) => personne?.typePersonne?.code != 'CP309' && personne?.typePersonne?.code != 'CP310' && personne?.typePersonne?.code != 'CP594')
          this.vehiculesteps.step3 = true
          break;
        case 'AUT016':
          this.defaultChoiceBlesse = 0
          this.withBlesses(this.defaultChoiceBlesse)
          break;
        case 'AUT014':
          this.defaultChoiceBlesse = 0
          this.withBlesses(this.defaultChoiceBlesse)
          break;
        default:
          this.defaultChoiceBlesse = 1
          this.withBlesses(this.defaultChoiceBlesse)
          this.vehiculesteps.step3 = false
          break;
      }


      if (this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L') {
        this.formInfoVehicule.get("zoneAffectee").setValue("")
        this.vehiculesteps.step1 = false
        this.getZoneByProduit(this.formInfoSinistre.get("causeSinistre").value?.idParam, null)
      }
      else if (this.codeProduit == '95' || this.codeProduit == '96')
        this.getZoneByProduit(this.formInfoSinistre.get("causeSinistre").value?.idParam, this.codeProduit)
    }
  }
  getZoneByProduit(cause: any, codeProduit: any) {
    this.genericService.getParamMrp(cause, this.codeProduit).subscribe(data => {
      this.stepper.next()
      this.zonesAffectees = data
      this.filteredZonesAffectees = this.zonesAffectees.slice()
    })
  }
  chooseOrigin(origin: any) {

    //EXP cas appel contact devient obligatoireF
    if (origin.code == "CP304") {
      this.formInfoSinistre.get("contactOrigine").setValidators([Validators.required])
      this.formInfoSinistre.get("contactOrigine").updateValueAndValidity()
    }

    else {
      this.formInfoSinistre.get("contactOrigine").setValidators([])
      this.formInfoSinistre.get("contactOrigine").updateValueAndValidity()
    }
    this.originExist = true


  }
  withAutorite(idReponse: any) {

    if (idReponse == 0) { // oui vec autorité
      this.formInfoSinistre.get("nomAutorite").setValidators([Validators.required])
      this.formInfoSinistre.get("nomAutorite").updateValueAndValidity()
      this.autoriteExist = true
    } else { // non 
      this.formInfoSinistre.get("nomAutorite").setValidators([])
      this.formInfoSinistre.get("nomAutorite").updateValueAndValidity()
      this.autoriteExist = false

    }
  }
  withAssisteur(idReponse: any, time: number) {
    this.tiersClicked.assistance = true
    if (idReponse == "false") { // non je n'ai pas fait appel a un assiteur && time == 1

      this.formInfoVehicule.get("futurAssisteur").setValidators([Validators.required])
      this.formInfoVehicule.get("futurAssisteur").updateValueAndValidity()
      this.futurAssisteurExist = true

      this.listAssisteurExist = false
    } else if (idReponse == "true") { // oui 
      this.formInfoVehicule.get("listAssisteur").setValidators([Validators.required])
      this.formInfoVehicule.get("listAssisteur").updateValueAndValidity()
      if (time == 1) {
        this.formInfoVehicule.get("futurAssisteur").setValidators([])
        this.formInfoVehicule.get("futurAssisteur").updateValueAndValidity()
        this.sinistreBody.appelAssisteur = false
        this.futurAssisteurExist = false
      } else {
        this.sinistreBody.appelAssisteur = true
      }
      this.listAssisteurExist = true

    }
  }
  controlDoublonsWithZone(zoneAffecte: any) {
    let bodyDoublons = {
      "idContrat": this.sinistreBody?.numPolice,

      "codeRisque": this.sinistreBody?.codeRisque,

      "dateSurvenance": this.sinistreBody?.dateSurvenance,

      "zoneAffecte": {
        "idParam": zoneAffecte?.idParam
      }


    }
    this.doublonsZone = true
    this.disabledZone = true
    this.loaderZone = false
    this.sinistresService.getIfExisteDoublonWithZone(bodyDoublons).subscribe({
      next: (data: any) => {
        this.disabledZone = false
        this.loaderZone = true
        if (data.statut) {

          this.doublonsZone = false
          Swal.fire(
            `Attention , un sinistre existe déjà sous le N°` + data.messageStatut + `
          Ça sera un message bloquant 
          `,
            '',
            'error'
          )
        } else {
          this.vehiculesteps.step1 = true
          // can continue the process

        }
      },
      error: (error) => {
        this.loaderZone = true
        console.log(error);

      }
    })
  }
  controlDoublons() {
    let bodyDoublons = {
      "idContrat": this.sinistreBody?.numPolice,

      "codeRisque": this.sinistreBody?.codeRisque,

      "dateSurvenance": this.sinistreBody?.dateSurvenance,

      "zoneAffecte": null


    }
    this.sinistresService.getIfExisteDoublon(bodyDoublons).subscribe({
      next: (data: any) => {
        this.stepper.next();
        this.infoSinistreStep.step1 = true
        if (data.statut) {
          Swal.fire(
            `Attention , un sinistre existe déjà pour ce véhicule avec la même date de survenance `,
            '',
            'warning'
          )
        }
      },
      error: (error) => {
        this.infoSinistreStep.step1 = true
        console.log(error);
        Swal.fire(
          error,
          '',
          'error'
        )
      }
    })
  }
  setValeurBien() {
    this.formInfoVehicule.get("codeRisque").setValue(this.sinistreBody?.codeRisque)
    //nom
    this.formInfoVehicule.get("nom").setValue(this.infoPolice?.assure?.nom)
    //prenom
    this.formInfoVehicule.get("prenom").setValue(this.infoPolice?.assure?.prenom1)
    //adresse
    this.formInfoVehicule.get("adresse").setValue(this.sinistreBody?.adresse)
    //wilaya
    this.formInfoVehicule.get("wilaya").setValue(+this.sinistreBody?.wilaya?.valeur)
    this.getCommunes(this.sinistreBody?.wilaya?.valeur)
    //commune
    this.formInfoVehicule.get("commune").setValue(+this.sinistreBody?.commune?.valeur)
    this.formVehiculeReady = true
  }
  setValeurVehicule() {

    this.formInfoVehicule.get("codeRisque").setValue(this.sinistreBody?.codeRisque)
    //EXP create personne conducteur 
    //marque    
    let param = this.infoPolice?.risqueList?.filter((risque: any) => risque?.codeRisque == "P25")[0]

    this.formInfoVehicule.get("marque").setValue(param?.reponse?.idParamReponse?.description)
    // //modele
    param = this.infoPolice?.risqueList?.filter((risque: any) => risque?.codeRisque == "P26")[0]


    this.formInfoVehicule.get("modele").setValue(param?.reponse?.idParamReponse?.description)
    //immatriculation 
    this.formInfoVehicule.get("immatriculation").setValue(this.sinistreBody?.immatriculation?.valeur)
    //num chassis 
    param = this.infoPolice?.risqueList?.filter((risque: any) => risque?.codeRisque == "P30")[0]

    this.formInfoVehicule.get("numChassis").setValue(param?.valeur)
    this.formVehiculeReady = true
  }
  initFormVehicule() {


    this.formInfoVehicule = this.formBuilder.group({
      codeRisque: [{ value: '', disabled: true }, [Validators.required]],
      marque: [{ value: '', disabled: true }, (this.codeProduit == "45A" || this.codeProduit == "45F" || this.codeProduit == '45L') ? [Validators.required] : []],
      modele: [{ value: '', disabled: true }, (this.codeProduit == "45A" || this.codeProduit == "45F" || this.codeProduit == '45L') ? [Validators.required] : []],
      //FIX ,Validators.maxLength(13),Validators.minLength(13)
      immatriculation: [{ value: '', disabled: true }, (this.codeProduit == "45A" || this.codeProduit == "45F" || this.codeProduit == '45L') ? [Validators.required] : []],
      numChassis: [{ value: '', disabled: true }, (this.codeProduit == "45A" || this.codeProduit == "45F" || this.codeProduit == '45L') ? [Validators.required] : []],
      zoneAffectee: ['', [Validators.required]],
      canCirculate: ['', (this.codeProduit == "45A" || this.codeProduit == "45F" || this.codeProduit == '45L') ? [Validators.required] : []],
      assisteur: ['', [Validators.required]],
      futurAssisteur: ['', []],
      listAssisteur: [null, []],
      nom: [{ value: '', disabled: true }, [Validators.required]],
      prenom: [{ value: '', disabled: true }, [Validators.required]],
      adresse: [{ value: '', disabled: true }, [Validators.required]],
      wilaya: [{ value: '', disabled: true }, [Validators.required]],
      commune: [{ value: '', disabled: true }, [Validators.required]],
    });
  }
  submitInfoVehicule() {
    this.submitedInfoVehicule = true

    if (this.formInfoVehicule.valid) {
      this.sinistreBody.zoneAffecte = { "idParam": this.formInfoVehicule.get("zoneAffectee").value?.idParam }
      this.sinistreBody.canCirculate = this.formInfoVehicule.get("canCirculate").value
      if (this.formInfoVehicule.get("assisteur")) {
        this.sinistreBody.assisteurExist = this.formInfoVehicule.get("assisteur").value
        //  this.sinistreBody.idAssisteur=this.formInfoVehicule.get("listAssisteur").value
        this.sinistreBody.idAssisteur = {
          "idParam": this.formInfoVehicule.get("listAssisteur").value
        }
      }
      else {
        if (this.formInfoVehicule.get("futurAssisteur")) {
          this.sinistreBody.assisteurExist = this.formInfoVehicule.get("futurAssisteur").value
          //   this.sinistreBody.idAssisteur=this.formInfoVehicule.get("listAssisteur").value
          this.sinistreBody.idAssisteur = {
            "idParam": this.formInfoVehicule.get("listAssisteur").value
          }
        }
        else {
          this.sinistreBody.assisteurExist = false
          this.sinistreBody.idAssisteur = null

        }
      }

      this.stepperInfoVehicule.next()
      if (this.codeProduit != "45A")
        this.vehiculesteps.step2 = true
    }
  }
  getZonesByCause(causeId: any) {
    this.formInfoVehicule.get("zoneAffectee").setValue("")
    this.vehiculesteps.step1 = false
    this.sinistresService.getByLien(causeId).subscribe({
      next: (data: any) => {
        this.stepper.next()
        this.zonesAffectees = data
        this.filteredZonesAffectees = this.zonesAffectees.slice()

      },
      error: (error) => {

        console.log(error);

      }
    })


  }
  getAgenceAdverse(agenceid: any) {
    this.sinistresService.getByLien(agenceid).subscribe({
      next: (data: any) => {
        this.agenceAdversesArray = data
        this.filteredAgenceAdversesArray = this.agenceAdversesArray.slice()

      },
      error: (error) => {

        console.log(error);

      }
    })


  }
  // informations conducteur 
  initFormConducteur() {

    this.formConducteurReady = true
    this.formInfoConducteur = this.formBuilder.group({
      typeConducteur: ["", [Validators.required]],
      nomConducteur: ["", Validators.required],
      prenomConducteur: ["", Validators.required],
      numPermis: ["", Validators.required],
      dateDelivrance: ["", Validators.required],
      lieuDelivrance: ["", Validators.required],
      adresse: ["", []],
      contact: ["", []],

    });

    if (this.codeProduit == '45F') {
      this.formInfoConducteur.setControl("typeConducteur", new FormControl({ value: this.typeConducteursArray?.find((type: any) => type?.code == "CP308"), disabled: true }))
      this.changeTypeConducteur(this.typeConducteursArray?.find((type: any) => type?.code == "CP308"))
    }
  }
  changeTypeConducteur(typeConducteur: any) {
    this.conducteurPersonne = new PersonneSinistre()
    this.typeConducteur = typeConducteur

    if (typeConducteur.code == "CP306" || typeConducteur.code == "CP307") {

      let personne
      //EXP get personne conducteur habituel
      if (typeConducteur.code == "CP307") {
        ///  this.conducteurPersonne.typePersonne.idParam=typeConducteur.idParam
        this.labelAssure.label = "conducteur habituel"
        this.labelAssure.type = "physique"
        //CP233 CONDUCTEUR 
        personne = this.infoPolice?.personnesList?.filter((personne: any) => personne?.role?.code == "CP233" || personne?.role?.code == "CP237" || personne?.role?.code == "CP238" || personne?.role?.code == "CP240")[0]?.personne

        if (personne.hasOwnProperty("nom") || personne?.personne?.nom != '') {
          this.formInfoConducteur.get("nomConducteur").setValue(personne?.nom)
          this.formInfoConducteur.get("prenomConducteur").setValue(personne?.prenom1)
          this.conducteurError = false
        } else {
          this.conducteurError = true
        }

      }
      else { //EXP get personne assuré
        // this.conducteurPersonne.typePersonne.idParam=typeConducteur.idParam
        personne = this.infoPolice?.assure
        this.labelAssure.label = "assure"

        this.labelAssure.type = "physique"

        this.formInfoConducteur.get("nomConducteur").setValue(personne?.nom)
        this.formInfoConducteur.get("prenomConducteur").setValue(personne?.prenom1)

        // else {

        //   Swal.fire(
        //     `Personne morale ne peut pas etre le conducteur.`,
        //     '',
        //     'error'
        //   )
        //    this.labelAssure.type = "morale"
        // this.formInfoConducteur.get("raisonSociale").setValue(personne.raisonSocial)
        // this.formInfoConducteur.get("raisonSociale").setValidators([Validators.required])
        // this.formInfoConducteur.get("nomConducteur").setValidators([])
        // this.formInfoConducteur.get("prenomConducteur").setValidators([])
        // }
      }

      this.formInfoConducteur.get("numPermis").setValue(personne?.documentList?.filter((doc: any) => doc?.typeDocument?.code == 'D02')[0]?.description)


      //   this.formInfoConducteur.get("dateDelivrance").setValue(this.infoPolice.risqueList.filter((risque: any) => risque.paramRisque.codeParam == "P54")[0].valeur)
      this.formInfoConducteur.get("lieuDelivrance").setValue(Number(this.infoPolice?.risqueList?.filter((risque: any) => risque?.codeParam == "P56")[0]?.valeur))

      this.formInfoConducteur.get("adresse").setValue(personne?.adressesList[0]?.description)
      this.formInfoConducteur.get("contact").setValue(personne?.contactList[0]?.description)
      this.formInfoConducteur.disable()
      if (this.codeProduit != '45F') this.formInfoConducteur.get("typeConducteur").enable()
      this.formInfoConducteur.get("dateDelivrance").enable()
      this.formInfoConducteur.get("numPermis").enable()
      this.formInfoConducteur.get("lieuDelivrance").enable()
    } else {
      this.formInfoConducteur.get("nomConducteur").setValue("")
      this.formInfoConducteur.get("prenomConducteur").setValue("")
      this.formInfoConducteur.get("numPermis").setValue("")
      this.formInfoConducteur.get("dateDelivrance").setValue("")
      this.formInfoConducteur.get("lieuDelivrance").setValue("")
      this.formInfoConducteur.get("adresse").setValue("")
      this.formInfoConducteur.get("contact").setValue("")
      this.formInfoConducteur.enable()
    }
  }
  submitInfoConducteur() {
    if (this.formInfoConducteur.valid) {
      //FIX cas personne morale 

      this.vehiculesteps.step2 = true
      //EXP on envoie objet personne conducteur seulement quand c'est pas conducteur habituel || assuré
      this.conducteurPersonne.nomConducteur = this.formInfoConducteur.get("nomConducteur").value
      this.conducteurPersonne.prenomConducteur = this.formInfoConducteur.get("prenomConducteur").value

      // if (this.labelAssure.type == "personnePhysique") {

      //   this.conducteurPersonne.raisonSociale = ""
      // } else {
      //   this.conducteurPersonne.nomConducteur = ""
      //   this.conducteurPersonne.prenomConducteur = ""
      //   this.conducteurPersonne.raisonSociale = this.formInfoConducteur.get("raisonSociale").value
      // }
      this.conducteurPersonne.typePersonne = {
        "idParam": this.typeConducteur.idParam,
        "code": this.typeConducteur.code,
      };
      this.conducteurPersonne.paramRisque = []
      // lieu delivrance 
      let param = this.paramRisqueAll?.filter((risque: any) => risque?.paramRisque?.codeParam == "P56")[0]
      // let param = this.infoPolice.risqueList.filter((risque: any) => risque.codeParam == "P56")[0]
      this.conducteurPersonne.paramRisque.push({

        "idParam": param?.paramRisque?.idParamRisque,
        "valeur": this.formInfoConducteur.get("lieuDelivrance").value,
        "idReponse": this.wilayasDelivrance?.filter((wilaya: any) => wilaya?.idWilaya == this.formInfoConducteur.get("lieuDelivrance").value)[0]?.idWilaya

      })

      // // date delivrance permis
      // param = this.infoPolice.risqueList.filter((risque: any) => risque.paramRisque.codeParam == "P54")[0]
      // this.conducteurPersonne.paramRisque.push({

      //   "idParam": param.paramRisque.idParamRisque,
      //   "valeur": this.formInfoConducteur.get("dateDelivrance").value

      // })

      this.conducteurPersonne.adresse = this.formInfoConducteur.get("adresse").value
      this.conducteurPersonne.contact = this.formInfoConducteur.get("contact").value
      this.conducteurPersonne.numeroPermis = this.formInfoConducteur.get("numPermis").value
      this.conducteurPersonne.dateDelivrance = this.formInfoConducteur.get("dateDelivrance").value

      let index = this.sinistreBody?.personnes?.findIndex((personne: any) => personne?.typePersonne?.code == 'CP308' || personne?.typePersonne?.code == 'CP307' || personne?.typePersonne?.code == 'CP306')
      if (index !== -1) {
        this.sinistreBody.personnes[index] = this.conducteurPersonne
      } else
        this.sinistreBody.personnes.push(this.conducteurPersonne)
      this.conducteurPersonne = new PersonneSinistre()

      this.stepperInfoVehicule.next()

    }
  }
  // tier 
  withTier(idReponse: any) {
    // choc AUT004
    this.tiersClicked.adversaire = true
    if (idReponse == 'true' && this.causeSinistre != "AUT004") { // oui tier exist 
      this.initFormAdversaire()
      this.getMarque()
    } else if (this.causeSinistre == "AUT004" && idReponse == 'true') {
      this.tierExist = false

      Swal.fire(
        `cause « choc fortuit » ne doit pas avoir un tiers, veuillez modifier la cause `,
        '',
        'error'
      )
    } else if (idReponse == 'false' && this.causeSinistre == "AUT005") { //collision AUT005
      Swal.fire(
        `Tiers obligatoire  si cause « collision », veuillez modifier la cause`,
        '',
        'error'
      )
    } else if (idReponse == 'false') {
      this.vehiculesteps.step3 = true
      this.tierExist = false
      this.tierTab = []
      this.dataSourceTier.data = []
    }

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
  getModel(marque: any) {
    this.vehiculeService.getModelByMarque(marque).subscribe({
      next: (data: any) => {
        this.models = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  initFormAdversaire() {
    this.tierExist = true
    this.formInfoAdversaire = this.formBuilder.group({
      typeAdversaire: ["", (this.codeProduit == '95' || this.codeProduit == '96') ? [] : [Validators.required]],
      isFamily: ["", (this.codeProduit == '95' || this.codeProduit == '96') ? [] : [Validators.required]],
      nomAdversaire: ["", Validators.required],
      prenomAdversaire: ["", Validators.required],
      companyAdverse: [null, [Validators.required]],
      agenceAdverse: [null, []],
      numPolice: [null, []],
      contact: [null, []],
      // conducteur adverse
      nomConducteurAdverse: [null, []],
      prenomConducteurAdverse: [null, []],
      numPermisConducteurAdverse: [null, []],
      dateDelivranceAdverse: [null, []],
      lieuDelivranceAdverse: [null, []],
      //vehicule adverse
      marqueVehiculeAdverse: [null, []],
      modeleVehiculeAdverse: [null, []],
      // FIX Validators.maxLength(13),Validators.minLength(13)
      immatriculationVehiculeAdverse: [null, []],
      assure: [{ value: true, disabled: (this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L') ? true : false }],

    });
  }

  tiersAssure(reponse: any) {
    if (reponse) {
      this.formInfoAdversaire.get("companyAdverse").setValidators([Validators.required])
      this.formInfoAdversaire.get("companyAdverse").updateValueAndValidity([Validators.required])
    }
    else {
      this.formInfoAdversaire.get("companyAdverse").setValidators([])
      this.formInfoAdversaire.get("companyAdverse").updateValueAndValidity([])
    }
  }

  changeTypeAdversaire(typeAdversaire: any) {

    this.typeAdversaireSelected = typeAdversaire
    if (typeAdversaire.code == "CP309") { //  typeAdversaire == vehicule

      this.formInfoAdversaire.get("agenceAdverse").setValidators([Validators.required])
      this.formInfoAdversaire.get("isFamily").setValidators([Validators.required])
      this.formInfoAdversaire.get("agenceAdverse").updateValueAndValidity([Validators.required])
      this.formInfoAdversaire.get("numPolice").setValidators([Validators.required])
      this.formInfoAdversaire.get("numPolice").updateValueAndValidity([Validators.required])

      this.formInfoAdversaire.get("nomConducteurAdverse").setValidators([Validators.required])
      this.formInfoAdversaire.get("nomConducteurAdverse").updateValueAndValidity([Validators.required])
      this.formInfoAdversaire.get("prenomConducteurAdverse").setValidators([Validators.required])
      this.formInfoAdversaire.get("prenomConducteurAdverse").updateValueAndValidity([Validators.required])
      this.formInfoAdversaire.get("numPermisConducteurAdverse").setValidators([Validators.required])
      this.formInfoAdversaire.get("numPermisConducteurAdverse").updateValueAndValidity([Validators.required])
      this.formInfoAdversaire.get("dateDelivranceAdverse").setValidators([Validators.required])
      this.formInfoAdversaire.get("dateDelivranceAdverse").updateValueAndValidity([Validators.required])
      this.formInfoAdversaire.get("lieuDelivranceAdverse").setValidators([Validators.required])
      this.formInfoAdversaire.get("lieuDelivranceAdverse").updateValueAndValidity([Validators.required])
      this.formInfoAdversaire.get("marqueVehiculeAdverse").setValidators([Validators.required])
      this.formInfoAdversaire.get("marqueVehiculeAdverse").updateValueAndValidity([Validators.required])
      this.formInfoAdversaire.get("modeleVehiculeAdverse").setValidators([Validators.required])
      this.formInfoAdversaire.get("modeleVehiculeAdverse").updateValueAndValidity([Validators.required])
      this.formInfoAdversaire.get("immatriculationVehiculeAdverse").setValidators([Validators.required])
      this.formInfoAdversaire.get("immatriculationVehiculeAdverse").updateValueAndValidity([Validators.required])
    } else { // type objet  310
      this.formInfoAdversaire.get("isFamily").setValidators([])
      this.formInfoAdversaire.get("isFamily").updateValueAndValidity([])

      this.formInfoAdversaire.get("agenceAdverse").setValidators([])
      this.formInfoAdversaire.get("agenceAdverse").updateValueAndValidity([])
      this.formInfoAdversaire.get("numPolice").setValidators([])
      this.formInfoAdversaire.get("numPolice").updateValueAndValidity()
      this.formInfoAdversaire.get("nomConducteurAdverse").setValidators([])
      this.formInfoAdversaire.get("nomConducteurAdverse").updateValueAndValidity([])
      this.formInfoAdversaire.get("prenomConducteurAdverse").setValidators([])
      this.formInfoAdversaire.get("prenomConducteurAdverse").updateValueAndValidity([])
      this.formInfoAdversaire.get("numPermisConducteurAdverse").setValidators([])
      this.formInfoAdversaire.get("numPermisConducteurAdverse").updateValueAndValidity([])
      this.formInfoAdversaire.get("dateDelivranceAdverse").setValidators([])
      this.formInfoAdversaire.get("dateDelivranceAdverse").updateValueAndValidity([])
      this.formInfoAdversaire.get("lieuDelivranceAdverse").setValidators([])
      this.formInfoAdversaire.get("lieuDelivranceAdverse").updateValueAndValidity([])
      this.formInfoAdversaire.get("marqueVehiculeAdverse").setValidators([])
      this.formInfoAdversaire.get("marqueVehiculeAdverse").updateValueAndValidity([])
      this.formInfoAdversaire.get("modeleVehiculeAdverse").setValidators([])
      this.formInfoAdversaire.get("modeleVehiculeAdverse").updateValueAndValidity([])
      this.formInfoAdversaire.get("immatriculationVehiculeAdverse").setValidators([])
      this.formInfoAdversaire.get("immatriculationVehiculeAdverse").updateValueAndValidity([])
    }
  }
  submitTier(formDirective: any) {
    this.sumitedTier = true

    if (this.formInfoAdversaire.valid) {
      this.vehiculesteps.step3 = true
      // let tempTabTier = this.formInfoAdversaire.value
      // this.typeAdversaire.map((type: any) => {
      //   this.typeAdversaire.map((type: any) => {
      //     if (type.idTypeAdversaire == this.typeAdversaireSelected)
      //       tempTabTier.typeAdversaire = type.description
      //   })
      // })



      this.adversairePersonne.nom = this.formInfoAdversaire.get("nomAdversaire").value
      this.adversairePersonne.prenom = this.formInfoAdversaire.get("prenomAdversaire").value
      this.adversairePersonne.companyAdverse = { "idParam": this.formInfoAdversaire.get("companyAdverse").value }
      if (this.formInfoAdversaire.get("agenceAdverse").value == '')
        this.adversairePersonne.agenceAdverse = null
      else
        this.adversairePersonne.agenceAdverse = { "idParam": this.formInfoAdversaire.get("agenceAdverse").value }

      this.adversairePersonne.numPoliceAdverse = this.formInfoAdversaire.get("numPolice").value
      if (this.codeProduit != '95' && this.codeProduit != '96') {
        this.adversairePersonne.typePersonne = {
          idParam: this.typeAdversaireSelected?.idParam,
          code: this.typeAdversaireSelected?.code,
        }

        this.adversairePersonne.nomConducteur = this.formInfoAdversaire.get("nomConducteurAdverse").value
        this.adversairePersonne.prenomConducteur = this.formInfoAdversaire.get("prenomConducteurAdverse").value
        this.adversairePersonne.numeroPermis = this.formInfoAdversaire.get("numPermisConducteurAdverse").value
        this.adversairePersonne.dateDelivrance = this.formInfoAdversaire.get("dateDelivranceAdverse").value
        this.adversairePersonne.isFamilly = this.formInfoAdversaire.get("isFamily").value

        if (this.typeAdversaireSelected.code == "CP309") {
          let codeRisqueTableForm = [
            // {
            //   "value": this.formInfoAdversaire.get("dateDelivranceAdverse").value,
            //   "code": "P54",
            // },
            {
              "value": this.formInfoAdversaire.get("lieuDelivranceAdverse").value?.idWilaya,
              "description": this.formInfoAdversaire.get("lieuDelivranceAdverse").value?.description,
              "code": "P56",
            },
            {
              "value": this.formInfoAdversaire.get("marqueVehiculeAdverse").value?.idParam,
              "description": this.formInfoAdversaire.get("marqueVehiculeAdverse").value?.marque,
              "code": "P25",
            },
            {
              "value": this.formInfoAdversaire.get("modeleVehiculeAdverse").value?.idParam,
              "description": this.formInfoAdversaire.get("modeleVehiculeAdverse").value?.modele,
              "code": "P26",
            }
            ,
            {
              "value": this.formInfoAdversaire.get("immatriculationVehiculeAdverse").value,
              "code": "P38",
            }
          ]
          this.adversairePersonne.paramRisque = []

          codeRisqueTableForm?.forEach((codeValue: any) => this.setParam(codeValue))
        }
      }
      else {
        this.adversairePersonne.typePersonne = {
          idParam: this.typeAdversaireArray?.find((type: any) => type?.code == "CP309")?.idParam,
          code: "CP309",
        }
      }






      Object.assign(this.formInfoAdversaire.value, { idTier: this.indexTier });
      this.adversairePersonne.idPersonne = this.indexTier
      //add tier to post personne
      this.sinistreBody.personnes.push(this.adversairePersonne)

      this.adversairePersonne = new PersonneSinistre()
      this.tierTab.push(this.formInfoAdversaire.value)
      this.tiersLength = this.tierTab.length
      this.defaultChoice = true

      this.dataSourceTier.data = this.tierTab
      //reset form 
      formDirective.resetForm();
      this.formInfoAdversaire.reset();
      this.formInfoAdversaire.get("assure").setValue(true)


      // Object.keys(this.formInfoAdversaire.controls).forEach(key => {
      //   this.formInfoAdversaire.controls[key].setErrors(null)
      // });
    }

    this.indexTier = this.indexTier + 1

  }
  setParam(codeValue: any) {

    let param = this.paramRisqueAll?.filter((risque: any) => risque?.paramRisque?.codeParam == codeValue?.code)[0]
    //  this.adversairePersonne.paramRisque.push({

    //   "idParam": this.paramRisqueAll.filter((risque: any) => risque.paramRisque.codeParam == codeValue.code)[0].paramRisque.idParamRisque,
    //   "valeur": codeValue.value,

    // })

    if (param.typeChamp?.code == 'L01') {
      this.adversairePersonne.paramRisque.push({

        "idParam": this.paramRisqueAll?.filter((risque: any) => risque?.paramRisque?.codeParam == codeValue?.code)[0]?.paramRisque?.idParamRisque,
        "valeur": "",
        "idReponse": codeValue.value,

      })
    } else {
      if (param?.paramRisque?.codeParam == "P56" || param?.paramRisque?.codeParam == "P26" || param?.paramRisque?.codeParam == "P25") {
        this.adversairePersonne.paramRisque.push({

          "idParam": this.paramRisqueAll?.filter((risque: any) => risque?.paramRisque?.codeParam == codeValue?.code)[0]?.paramRisque?.idParamRisque,
          "valeur": codeValue.description,
          "idReponse": codeValue.value,

        })
      } else {
        this.adversairePersonne.paramRisque.push({

          "idParam": this.paramRisqueAll?.filter((risque: any) => risque?.paramRisque?.codeParam == codeValue?.code)[0]?.paramRisque?.idParamRisque,
          "valeur": codeValue.value,
          "idReponse": null,

        })
      }
    }
  }
  deleteTier(idTiedSelected: any) {
    this.tierTab = this.tierTab?.filter(function (tier: any) {
      return tier.idTier !== idTiedSelected;
    });
    this.tiersLength = this.tierTab.length
    if (this.tiersLength == 0) { this.defaultChoice = null }
    //delete from objet principale tier 
    this.sinistreBody?.personnes?.filter(function (personne: any) {
      return personne?.idpersonne !== idTiedSelected;
    });
    this.dataSourceTier.data = this.tierTab
  }
  //TODO partie 3 blesses / décès 

  withBlesses(idReponse: any) {
    this.tiersClicked.blesse = true
    // AUT014 pieton | cycliste AUT016 && this.causeSinistre.code != "AUT014" && this.causeSinistre != "AUT016"
    if (idReponse == 0) { // blessés exist
      this.blesseExist = true
      this.initFormBlesses()
    } else {
      this.blesseExist = false
      this.blessesTab = []
      this.dataSourceBlesses.data = []
      if (this.formInfoBlesses != undefined) {
        this.formInfoBlesses.get('typeBlesses').setValidators([]);
        this.formInfoBlesses.get('typeBlesses').updateValueAndValidity();
        // this.formInfoBlesses.get('nomBlesse').setValidators([]); 
        // this.formInfoBlesses.get('nomBlesse').updateValueAndValidity();
        // this.formInfoBlesses.get('prenomBlesse').setValidators([]); 
        // this.formInfoBlesses.get('prenomBlesse').updateValueAndValidity();
        // this.formInfoBlesses.get('dateNaissanceBlesse').setValidators([]); 
        // this.formInfoBlesses.get('dateNaissanceBlesse').updateValueAndValidity();
        this.formInfoBlesses.get('etatBlesse').setValidators([]);
        this.formInfoBlesses.get('etatBlesse').updateValueAndValidity();
      }

    }
  }
  initFormBlesses() {
    this.formInfoBlesses = this.formBuilder.group({
      typeBlesses: ["", (this.codeProduit == '95' || this.codeProduit == '96') ? [] : [Validators.required]],
      nomBlesse: [""],
      prenomBlesse: [""],
      dateNaissanceBlesse: [""],
      etatBlesse: ["", [Validators.required]],
      contact: [""],

    });
  }
  submitBlesse(formDirective: any) {

    if (this.formInfoBlesses.valid) {
      if (this.codeProduit != '95' && this.codeProduit != '96') {
        this.blessePersonne.typePersonne = {
          "idParam": this.formInfoBlesses.get("typeBlesses").value?.idParam
        }
      }
      else {
        this.blessePersonne.typePersonne = {
          "idParam": this.typeBlessesArray?.find((blesse: any) => blesse.code == "TP98")?.idParam
        }
      }

      this.blessePersonne.nom = this.formInfoBlesses.get("nomBlesse").value
      this.blessePersonne.prenom = this.formInfoBlesses.get("prenomBlesse").value
      this.blessePersonne.dateNaissance = this.formInfoBlesses.get("dateNaissanceBlesse").value
      this.blessePersonne.etatSinistre = { "idParam": this.formInfoBlesses.get("etatBlesse").value?.idParam }
      this.blessePersonne.contact = this.formInfoBlesses.get("contact").value


      this.blessesTab.push({
        "idBlesse": this.indexBlesse,
        "typeBlesses": this.codeProduit != '95' && this.codeProduit != '96' ? this.formInfoBlesses.get("typeBlesses").value?.description : '',
        "nomBlesse": this.formInfoBlesses.get("nomBlesse").value,
        "prenomBlesse": this.formInfoBlesses.get("prenomBlesse").value,
        "etatBlesse": this.formInfoBlesses.get("etatBlesse").value?.description,
        "dateNaissance": this.formInfoBlesses.get("dateNaissanceBlesse").value
      })
      this.blessesLength = this.blessesTab.length
      this.defaultChoiceBlesse = true

      this.blessePersonne.idPersonne = this.indexBlesse
      //add tier to post personne
      this.sinistreBody.personnes.push(this.blessePersonne)
      this.blessePersonne = new PersonneSinistre()

      this.dataSourceBlesses.data = this.blessesTab

      //reset form 
      formDirective.resetForm();
      this.formInfoBlesses.reset();



      // Object.keys(this.formInfoBlesses.controls).forEach(key => {
      //   this.formInfoBlesses.controls[key].setErrors(null)
      // });

      this.indexBlesse = this.indexBlesse + 1
    }
  }
  deleteBlesses(idBlesseSelected: any) {


    this.blessesTab = this.blessesTab?.filter((blesse: any) => blesse?.idBlesse !== idBlesseSelected);
    //delete from objet principale blesse 
    this.blessesLength = this.blessesTab.length
    if (this.blessesLength == 0)
      this.defaultChoiceBlesse = null
    this.sinistreBody.personnes = this.sinistreBody?.personnes?.filter((personne: any) => personne?.idPersonne != idBlesseSelected)


    this.dataSourceBlesses.data = this.blessesTab
  }

  goToStep(idStep: any) {

    if (idStep == 3) {

      if (this.vehiculesteps.step1 && this.vehiculesteps.step2 && this.vehiculesteps.step3 && (this.defaultChoice != null || this.causeSinistre == "AUT004")) {
        this.stepperH.next()
      }

    } else {

      this.stepperH.next()
      this.stepperInfoVehicule.selectedIndex = 0
    }

  }
  getNature() {

    if ((this.blesseExist && this.blessesTab.length != 0) || !this.blesseExist && this.tiersClicked?.blesse) {
      this.loaderNature = true
      let bodyNature = {
        "codeProduit": this.sinistreBody?.produit?.codeProduit,
        "idZoneAffecte": this.sinistreBody?.zoneAffecte?.idParam,
        "existTier": this.tierTab.length === 0 ? 0 : 1,
        "existBlesse": this.blessesTab.length === 0 ? 0 : 1,
      }
      this.sinistresService.getNatureSinistre(bodyNature).subscribe({
        next: (data: any) => {
          this.loaderNature = false
          this.natureSinistre = data
          this.sinistreBody.natureDommage = data
          this.stepperH.next()
          this.goToResume()
        },
        error: (error) => {
          this.loaderNature = false

        }
      })
    }
  }
  goToResume() {


    this.resumeObject = {
      "numPolice": this.sinistreBody?.numPolice,
      "dateDeclaration": moment(this.sinistreBody?.dateDeclaration).format('YYYY-MM-DD'),
      "dateSurvenance": moment(this.sinistreBody?.dateSurvenance).format('YYYY-MM-DD'),
      // "Agence":this.sinistreBody.this.sinistreBody..,
      "CodeRisque": this.sinistreBody?.codeRisque,
      "natureDommage": this.natureSinistre,
      "adversaire": {
        "nom": this.sinistreBody?.personnes?.filter((personne: any) => personne?.typePersonne?.code == 'CP309' || personne?.typePersonne?.code == 'CP310')[0]?.nom,
        "prenom": this.sinistreBody?.personnes?.filter((personne: any) => personne?.typePersonne?.code == 'CP309' || personne?.typePersonne?.code == 'CP309')[0]?.prenom,
        "typeAdversaire": this.sinistreBody?.personnes?.filter((personne: any) => {
          if (personne?.typePersonne?.code == 'CP309') return "Véhicule"
          else if (personne?.typePersonne?.code == 'CP310') return "Objet"
        })
      },
      // "assure": {
      //   "nom": this.sinistreBody.personnes.filter((personne: any) => personne.typePersonne.idParam == 306)[0]?.nom,
      //   "prenom": this.sinistreBody.personnes.filter((personne: any) => personne.typePersonne.idParam == 306)[0]?.prenom,
      // },
      "origineDeclaration": this.originesSinistreArray?.filter((origine: any) => origine?.idParam == this.sinistreBody?.origineSinistre?.idParam)[0]?.description,
      "cause": this.causesSinistreArray?.filter((cause: any) => cause?.idParam == this.sinistreBody?.causeSinistre?.idParam)[0]?.description,
      "immatriculation": (this.codeProduit == "45A" || this.codeProduit == "45F" || this.codeProduit == '45L') ? this.sinistreBody?.immatriculation?.valeur : "",
      "zoneAffecte": this.zonesAffectees?.filter((zone: any) => zone?.idParam == this.sinistreBody?.zoneAffecte?.idParam)[0]?.description,
      "adresse": this.sinistreBody?.adresse,
      "wilaya": this.sinistreBody?.wilaya,
      "commune": this.sinistreBody?.commune
    }

    this.resumeReadu = true



  }
  submitSinitre() {
    this.loaderSinistre = true
    this.sinistresService.addSinistre(this.sinistreBody).subscribe({
      next: async (data: any) => {
        this.successSinistre = true
        this.loaderSinistre = false
        this.codeSinistre = data?.codeSinistre

        // const navigationExtras: NavigationExtras = { state: { data: "Le sinistre " + this.codeSinistre + " a été crée avec succées.", "idSinistre": data.idSinistre, "codeSinistre": data.codeSinistre } };

        // this.router.navigate(['/gestion-sinistre/' + '45A' + '/automobileMono'], { state: { codeSinistre: this.codeSinistre, "idSinistre": data.idSinistre } });
        Swal.fire({
          title: "Voulez-vous crée une mission d'expertise pour le  sinistre N° " + this.codeSinistre,
          icon: 'info',
          showCancelButton: true,
          cancelButtonText: "non",
          confirmButtonText: "oui",
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(["gestion-missionsExpertise/gestion-mission-expertise/" + data?.idSinistre + "/creation-mission-expertise"])
          } else {
            this.router.navigate(['/gestion-sinistre/' + this.codeProduit + '/automobileMono']);

          }
        })
        //  await this.router.navigate(['/gestion-sinistre/45A/automobileMono'], navigationExtras);




      },
      error: (error) => {
        this.successSinistre = false
        this.handleError(error)
        this.loaderSinistre = false
        console.log(error);

      }
    })
  }
  handleError(error: any) {

    switch (error.status) {

      case 500: // 
        this.errorBody.error = true
        this.errorBody.msg = "Erreur système, veuillez contacter l'administrateur."
        break;
      case 402: // actif
        this.errorBody.error = true
        this.errorBody.msg = "Erreur lors de la validation du devis, veuillez contacter l'administrateur."
        break;
      case 404: // actif
        this.errorBody.error = true
        this.errorBody.msg = error.message
        break;
    }

  }
  show() {

  }
  goback(idStep: any) {
    if (idStep == "vehiculeInfo")
      this.stepperInfoVehicule.previous()
    else if (idStep == "h") {
      this.stepperH.previous()
    } else
      this.stepper.previous()
  }
}
