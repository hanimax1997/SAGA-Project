import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { GenericService } from 'src/app/core/services/generic.service';
import { MissionExpertiseService } from 'src/app/core/services/mission-expertise.service';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { Patterns } from 'src/app/core/validiators/patterns';
import { MissionExpertise } from 'src/app/core/models/expertise';
import Swal from 'sweetalert2'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-creation-mission-expertise',
  templateUrl: './creation-mission-expertise.component.html',
  styleUrls: ['./creation-mission-expertise.component.scss']
})
export class CreationMissionExpertiseComponent {
  formMissionExpertise: FormGroup | any;
  wilayasArray: any = []
  modeExpertise: any = []
  typeExpertise: any = []
  experts: any = []
  filteredExperts: any = []
  idSinistre: any
  produit: any
  causeSinistre: string
  displayCpitalBDG: boolean = false
  loaderInfoSinistre: boolean = true
  expertSelected: boolean = false
  canCirculate = false
  loaderCapitalBDG = false
  capitalBDGError=false
  bodyMissionExpertise = new MissionExpertise()
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
  successBody = {
    "statut": false,
    "msg": "",
  }
  errorHandler = {
    "error": false,
    "msg": ""
  }
  statutSinistre: any
  nomProduit: any
  // codeProduit: any
  // roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  // sinistreRoles: any = {
  //   "45A": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
  //   "45F": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
  //   "45L": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
  //   "95": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
  //   "96": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  // }
  
  constructor(private router: Router, private sinistresService: SinistresService, private missionExpertiseService: MissionExpertiseService, private route: ActivatedRoute, private genericService: GenericService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    //EXP get id sinistre from url 
    this.idSinistre = this.route.snapshot.paramMap.get('idSinistre')
    this.nomProduit = this.route.snapshot.paramMap.get('produit')

    // this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')

    // let roleExist = false;
    // this.roleUser.find((r: any) => {
    //   if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
    //     roleExist = true;
    //     return;
    //   }
    // })

    // if(!roleExist) this.router.navigate(['/dashboard'])

    this.getSinistreInfo()
    this.getAllExperts()

  }
  getSinistreInfo() {
    this.sinistresService.getSinistreByID(this.idSinistre).subscribe({
      next: (data: any) => {
        this.causeSinistre = data.causeSinistre.code
        this.produit = data.produit.codeProduit
        this.loaderInfoSinistre = false
        this.getDictionnaireList()
        this.getWilayas()
        this.statutSinistre = data.statut.code
        this.initFormMissionExpertise()

        this.canCirculate = data.canCirculate

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getWilayas() {
    let idPays
    //get id pays 
    this.genericService.getPays().subscribe({
      next: (data: any) => {

        idPays = data.find((pays: any) => pays.codePays == "DZA").idPays
        //get wilayas
        this.genericService.getAllWilayas(idPays).subscribe({
          next: (data: any) => {

            this.wilayasArray = data

          },
          error: (error) => {

            console.log(error);

          }
        });
      },
      error: (error) => {

        console.log(error);

      }
    });

  }
  getDictionnaireList() {
    //MODE EXEPERTISE
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C39").idCategorie).subscribe(data => {
      this.modeExpertise = data;
    })
    //TYPE EXEPERTISE
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C40").idCategorie).subscribe(data => {
      this.typeExpertise = data;
      if (!this.canCirculate)
        this.formMissionExpertise.get("typeExpertise").setValue((this.typeExpertise.filter((type: any) => type.code == "T01"))[0])

    })
  }
  initFormMissionExpertise() {
    this.formMissionExpertise = this.formBuilder.group({
      modeExpertise: ['', [Validators.required]],
      lieuVehicule: ["", (this.produit == '45A' || this.produit == '45F' || this.produit == '45L') ? [Validators.required] : []],
      typeExpertise: ["", (this.produit == '45A' || this.produit == '45F' || this.produit == '45L') ? [Validators.required] : []],
      commentaire: ["", []],
      capitalBDG: [{ value: '', disabled: true }],
      eligibiliteBDG: [{ value: '', disabled: true }],
      expert: ["", Validators.required],
      mainOeuvre: ["", (this.produit == '45A' || this.produit == '45F' || this.produit == '45L') ? [Validators.required, Validators.pattern(Patterns.number)]:[]],
      tel: [{ value: '', disabled: true }, [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.required]],

    });
    if (this.statutSinistre == 'CP355' || this.statutSinistre == 'CP415' )
      this.formMissionExpertise.disable()
    else
      {
        this.formMissionExpertise.enable()
      this.formMissionExpertise.get("capitalBDG").disable()
      this.formMissionExpertise.get("eligibiliteBDG").disable()
      this.formMissionExpertise.get("email").disable()
      this.formMissionExpertise.get("tel").disable()
      }
  }
  changeTypeExpertise(typeExpertiseCode: any) {
    if (typeExpertiseCode.code == "T04" && this.causeSinistre == "AUT011") {
      this.displayCpitalBDG = true
      this.getCapitalBDG()
      this.formMissionExpertise.get("capitalBDG").setValidators([Validators.required])
      this.formMissionExpertise.get("eligibiliteBDG").setValidators([Validators.required])
    }
    else {
      this.capitalBDGError=false
      this.displayCpitalBDG = false
      this.formMissionExpertise.get("capitalBDG").setValidators([])
      this.formMissionExpertise.get("eligibiliteBDG").setValidators([])
    }

  }
  getCapitalBDG() {
    this.loaderCapitalBDG = true
    this.missionExpertiseService.getCapitaleBDG(this.idSinistre).subscribe({
      next: (data: any) => {
        this.loaderCapitalBDG = false
        this.formMissionExpertise.get("capitalBDG").setValue(data.capitalBDG)
        this.formMissionExpertise.get("eligibiliteBDG").setValue(data.eligibileBDG)
        this.capitalBDGError=false
      },
      error: (error) => {
        this.loaderCapitalBDG = false
        this.capitalBDGError=true
        Swal.fire({
          title: "Garantie BDG indisponible ou capital insuffisant",
          icon: 'error',
        })
        console.log(error);

      }
    });
  }
  getAllExperts() {
    this.missionExpertiseService.getExpertsAll().subscribe({
      next: (data: any) => {
        this.experts = data
        this.filteredExperts = this.experts.slice()
      },
      error: (error) => {

        console.log(error);

      }
    });

  }
  changeExpertise(expert: any) {
    this.expertSelected = true
    this.formMissionExpertise.get("tel").setValue(expert.tel)
    this.formMissionExpertise.get("email").setValue(expert.email)

  }
  submitExpertise() {
    if (this.formMissionExpertise.valid) {
      this.bodyMissionExpertise.modeExpertise = {
        "idParam": this.formMissionExpertise.get("modeExpertise").value
      }
      this.bodyMissionExpertise.typeExpertise = {
        "idParam": this.formMissionExpertise.get("typeExpertise").value?.idParam
      }
      this.bodyMissionExpertise.lieuVehicule = this.formMissionExpertise.get("lieuVehicule").value
      if (this.displayCpitalBDG)
        this.bodyMissionExpertise.bdg = {
          "CapitalBDG": this.formMissionExpertise.get("capitalBDG")?.value,
          "EligibileBDG": this.formMissionExpertise.get("eligibiliteBDG")?.value
        }
      else
        this.bodyMissionExpertise.bdg = {}


      this.bodyMissionExpertise.idexpert = {
        "idExpert": this.formMissionExpertise.get("expert").value.idExpert,
      }

      this.bodyMissionExpertise.mntMaindOeuvre = this.formMissionExpertise.get("mainOeuvre").value

      this.bodyMissionExpertise.idsinistre = {
        "idSinistre": this.idSinistre
      }
      this.bodyMissionExpertise.commentaire =this.formMissionExpertise.get("commentaire").value
      this.missionExpertiseService.addMissionExpertise(this.bodyMissionExpertise).subscribe({
        next: (data: any) => {
          if (data.statut) {
            Swal.fire({
              title: data.messageStatut,
              icon: 'success',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(["gestion-missionsExpertise/gestion-mission-expertise/" + this.idSinistre + "/" + this.nomProduit])
              }
            })
            this.successBody.statut = data.statut
          } else {
            Swal.fire({
              title: data.messageStatut,
              icon: 'error',
            })
          }



        },
        error: (error) => {
          this.handleError(error)

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
}
