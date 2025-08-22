import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { GenericService } from 'src/app/core/services/generic.service';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-completez-infos',
  templateUrl: './completez-infos.component.html',
  styleUrls: ['./completez-infos.component.scss']
})
export class CompletezInfosComponent implements OnInit {
  formEditInfoSinistre: FormGroup | any;
  causesSinistreArray: any = []
  filteredcausesSinistre: any = []
  zonesAffectees: any = []
  filteredZonesAffectees: any = []
  codeSinistre: any
  infoSinistre: any = []
  disabledZone = false
  sinistreBlocked = false
  loadUpdate = false
  msgApi = {
    "error": false,
    "msg": ""
  }
  codeCauseSinistre: any
  successUpdate = false
  previousCause: any;
  statusSinistre: any;
  codeProduit: any;
  TauxGestion: any;
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }

  constructor(private router: Router, private route: ActivatedRoute, private sinistresService: SinistresService, private genericService: GenericService, private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.codeSinistre = this.route.snapshot.paramMap.get('codeSinistre')
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')

    let roleExist = false;
    this.roleUser.find((r: any) => {
      if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
        roleExist = true;
        return;
      }
    })

    if(!roleExist) this.router.navigate(['/dashboard'])

    this.getSinistreInfo()

  }
  initFormEditInfosSinistre() {
    this.formEditInfoSinistre = this.formBuilder.group({
      causeSinistre: [this.infoSinistre.causeSinistre.idParam, [Validators.required]],
      zoneAffecte: [this.infoSinistre.zoneAffecte.idParam, Validators.required],
      tauxResponsabiliteGestion: ["", Validators.required],

    });
    if (this.statusSinistre == 'CP355'|| this.statusSinistre == 'CP415' ||this.statusSinistre == 'CP524'  ||this.statusSinistre == 'CP525'||this.statusSinistre == 'CP526') { this.formEditInfoSinistre.disable() }
    else
      this.formEditInfoSinistre.enable()
    this.formEditInfoSinistre.get("zoneAffecte").setValue(this.infoSinistre.zoneAffecte.idParam)

  }
  getSinistreInfo() {
    this.sinistresService.getSinistreByCode(this.codeSinistre).subscribe({
      next: (data: any) => {
        this.infoSinistre = data
        this.statusSinistre = this.infoSinistre.statut.code
        this.TauxGestion=JSON.parse(this.infoSinistre?.tauxResponsabiliteGestion ?? 'null')


        this.codeCauseSinistre = this.infoSinistre.causeSinistre.code
        this.getDictionnaireList()

        this.initFormEditInfosSinistre()

      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  getDictionnaireList() {
    // get causes sinistres
    this.genericService.getCause(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C43").idCategorie, this.codeProduit).subscribe(data => {
      this.causesSinistreArray = data;
      this.filteredcausesSinistre = this.causesSinistreArray.slice()
      if(this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L')
        this.getZoneByProduit(this.infoSinistre.causeSinistre.idParam, this.codeProduit, 1)
      else if(this.codeProduit == '95' || this.codeProduit == '96')
        this.getZoneByProduit(this.infoSinistre.causeSinistre.idParam, this.codeProduit, -1)
    })
  }
  getZoneByProduit(cause: any, codeProduit: any, time: number) {
    if (time != 1)
      this.formEditInfoSinistre.get("zoneAffecte").setValue("")

    this.genericService.getParamMrp(cause, codeProduit).subscribe(data => {
      this.zonesAffectees = data
      this.filteredZonesAffectees = this.zonesAffectees.slice()
    })
  }
  getZonesByCause(causeId: any, time: number) {
    if (time != 1)
      this.formEditInfoSinistre.get("zoneAffecte").setValue("")
    let nbrAdversaire = this.infoSinistre.sinistrePersonnes.filter((personne: any) => personne.categoriePersonne.code == "C46")?.length

    this.codeCauseSinistre = this.causesSinistreArray.filter((cause: any) => cause.idParam == causeId)[0].code

    // IF CAUSE COLLISION ET 0 TIER => error
    if (nbrAdversaire == 0 && this.codeCauseSinistre == "AUT005") {
      this.handleError("La modification de la cause vers collision est interdite en l'absence d'adversaire.")
      this.formEditInfoSinistre.get("causeSinistre").setValue(this.previousCause)
    } else {
      this.previousCause = causeId

    }

    this.sinistresService.getByLien(causeId).subscribe({
      next: (data: any) => {
        this.zonesAffectees = data

        this.filteredZonesAffectees = this.zonesAffectees.slice()
      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  controlDoublonsWithZone(zoneAffecte: any) {
    this.disabledZone = true
    let bodyDoublons = {
      "idContrat": this.infoSinistre.contratHistorique.idContrat.idContrat,
      "codeRisque": this.infoSinistre.codeRisque,
      "dateSurvenance": this.infoSinistre.dateSurvenance,
      "zoneAffecte": {
        "idParam": zoneAffecte
      }


    }

    this.sinistresService.getIfExisteDoublonWithZone(bodyDoublons).subscribe({
      next: (data: any) => {
        this.disabledZone = false
        if (data.statut) {
          this.sinistreBlocked = true
          // Swal.fire(
          //   `Attention , un sinistre existe déjà sous le N°` + data.messageStatut + `
          // Ça sera un message bloquant 
          // `,
          //   '',
          //   'error'
          // )

          this.handleError(data.messageStatut)
        } else {

        }
      },
      error: (error) => {
        this.disabledZone = false
        this.handleError(error)
        console.log(error);

      }
    })
  }
  submitInfosEdit() {


    if (this.formEditInfoSinistre.valid) {
      let bodyUpdate:any = {
        "causeSinistre": { "idParam": this.formEditInfoSinistre.get("causeSinistre").value },
        "tauxResponsabiliteGestion": this.formEditInfoSinistre.get("tauxResponsabiliteGestion").value,
        "zoneAffecte": { "idParam": this.formEditInfoSinistre.get("zoneAffecte").value },
        "auditUser": sessionStorage.getItem("userId"),
      }
      let bodyGetInfoPolice = {
        "idContrat": this.infoSinistre?.contratHistorique?.idContrat?.idContrat,
        "date": this.infoSinistre?.dateSurvenance,
        "risque": this.infoSinistre?.codeRisque,
        //backend does not need the group so send random group ¯\_(ツ)_/¯
        "groupe": 999,
      }
      this.sinistresService.getPolicyInformationsByRisque(bodyGetInfoPolice, this.infoSinistre?.contratHistorique?.idHistoriqueContrat).subscribe({
        next: (data: any) => {

          if (data.length != 0) {
            bodyUpdate.paramContratList = data.paramContratList
            this.loadUpdate = true
      this.sinistresService.updateInfosSinistre(bodyUpdate, this.infoSinistre.idSinistre,this.codeProduit).subscribe({
        next: (data: any) => {
          this.loadUpdate = false
          this.msgApi.error = false
          // this.goBack();
          Swal.fire(
            {title: "Modification informations sinistre avec succée",
            icon: "success",
            showConfirmButton: true
          }
          ).then((result=>{
            this.goBack();

          }))
        },
        error: (error) => {
          this.loadUpdate = false
          Swal.fire(
            {title: error.messageStatut,
            icon: "error",
            showConfirmButton: true
          }
          )
          // this.msgApi.msg = "Erreur systeme, veuillez contacter l'administrateur."
          // this.handleError(this.msgApi.msg)

          console.log(error);

        }
      })
          } else {         
            Swal.fire(
              `Cette police n'existe pas`,
              '',
              'error'
            )
          }        
        },
        error: (error) => {
          console.log(error);
          Swal.fire(
            error,
            '',
            'error'
          )
        }
      })
      
    }
  }
  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  handleError(error: any) {
    let message=""
    if (error.status == 500)
      message = "Erreur système, veuillez contacter l'administrateur."
      else message =error
      Swal.fire(
        message,
        '',
        'error'
      )
    }
  }
