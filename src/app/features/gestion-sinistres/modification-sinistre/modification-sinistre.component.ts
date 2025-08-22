import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { WithdrawalSinistreDialogComponent } from './withdrawal-sinistre-dialog/withdrawal-sinistre-dialog.component';
import { FraudeSinistreDialogComponent } from './fraude-sinistre-dialog/fraude-sinistre-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { EditAssistanceDialogComponent } from './edit-assistance-dialog/edit-assistance-dialog.component';
import { DeletePersonneDialogComponent } from './delete-personne-dialog/delete-personne-dialog.component';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-modification-sinistre',
  templateUrl: './modification-sinistre.component.html',
  styleUrls: ['./modification-sinistre.component.scss']
})
export class ModificationSinistreComponent {
  constructor(private sinistresService: SinistresService, private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) { }
  formReserve: FormGroup | any;
  // isCdcDa= sessionStorage.getItem("roles")?.includes("CDC") || sessionStorage.getItem("roles")?.includes("DA")
  rolesJs=JSON.parse(sessionStorage.getItem("roles")??"")

  isCdcDa= this.rolesJs?.includes("CDC") || this.rolesJs?.includes("DA") || this.rolesJs.includes("COURTIER")

  codeProduit = this.route.snapshot.paramMap.get('codeProduit')
  nomProduit = this.route.snapshot.paramMap.get('nameProduit')
  codeSinistre = this.route.snapshot.paramMap.get('codeSinistre')
  infoSinistre: any = []
  tabReserve: any
  infoSinistreReady = {
    "statut": 'false',
    "msg": "",
  }
  roleExist: any = false;
    roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
    sinistreRoles: any = {
      "45A": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
      "45F": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
      "45L": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
      "95": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
      "96": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
    }
  infoReserveReady = false
  ngOnInit(): void {
    this.getSinistreInfo()
    this.getModifInfo()
    this.roleUser.find((r: any) => {
        if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
          this.roleExist = true;
          return;
        }
      })
  }
  getSinistreInfo() {
    this.sinistresService.getSinistreByCode(this.codeSinistre).subscribe({
      next: (data: any) => {
        this.infoSinistre = data
        if(this.codeProduit == "45A") this.infoSinistre.immatriculation = this.infoSinistre.contratHistorique.risqueList.filter((risque: any) => risque.paramRisque.codeParam == "P38")[0].valeur
        this.infoSinistreReady.statut = "true"
      },
      error: (error) => {
        this.infoSinistreReady.statut = "error"
        this.infoSinistreReady.msg = "Erreur systéme, veuillez contacter l'administrateur."
        console.log(error);

      }
    })
  }

  transferRecour(){
    this.sinistresService.transferRecour(this.infoSinistre.idSinistre).subscribe({
      next:(data: any)=>{
         let response = data
        Swal.fire(
          {title: response.message,
          icon: "success",
          showConfirmButton: true
        } ).then((result) => {
          if (result.isConfirmed) {
        window.location.reload();
          }
        })
      },error:(error)=>{
        Swal.fire(
          {title: error.message,
          icon: "error",
          showConfirmButton: true
        })
      }
    });
    
  }

  
  getModifInfo() {
    this.sinistresService.getInfosModif(this.codeSinistre).subscribe({
      next: (data: any) => {
        this.tabReserve = data
        this.infoReserveReady = true

      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  goTo(where: any) {
    if((!this.roleExist || this.isCdcDa) && (where !=="gestionOp")){
      return
    }
    switch (where) {
      case 'infos':

      this.router.navigate(['completez-informations-sinistre'], { relativeTo: this.route });

        break;
        case 'tiers':
          this.router.navigate(['tiers'], { relativeTo: this.route });
          break;
      case 'withdrawal':
        this.withdrawalDialog()
        break;
      case 'fraude':
        this.fraudeDialog()
        break;
      case 'assistance':
        this.assistanceDialog()
        break;
      case 'blesse':
        this.router.navigate(['blesses'], { relativeTo: this.route });
        break;
      case 'reservePaiement':
        this.router.navigate([this.infoSinistre.statut.code + '/reserve-paiement'], { relativeTo: this.route });
        break;
      case 'reserveRecours':
        this.router.navigate([this.infoSinistre.statut.code + '/reserve-recours'], { relativeTo: this.route });
        break;
      default:
        break;
      case 'gestionOp':
        this.router.navigate(['gestion-op'], { relativeTo: this.route });
        break;
    }
  }
  withdrawalDialog() {
    if (this.infoSinistre.statut.code != 'CP355' && this.infoSinistre.statut.code != 'CP415' && this.infoSinistre.statut.code != 'CP524') {
      const dialogRef = this.dialog.open(WithdrawalSinistreDialogComponent, {
        width: '40%',
      });

      dialogRef.afterClosed().subscribe(result => {

        if (result)

          this.sinistresService.desistementSinistre(this.infoSinistre.idSinistre).subscribe({
            next: (data: any) => {
              this.handleSuccess("désistement sinistre avec succée.")
              this.getSinistreInfo()
            },
            error: (error) => {

              this.handleError(error)
            }
          })

      });
    }

  }
  fraudeDialog() {

    const dialogRef = this.dialog.open(FraudeSinistreDialogComponent, {
      width: '40%',
      data: { 'fraude': this.infoSinistre.sinistreFraudes[0], "statutSinistre": this.infoSinistre.statut.code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.data)
        if (result.data.data) {

          let bodyFraude =
          {
            "statutFraude": { "idParam": result.data.fraude },
            "statutContentieux": { "idParam": result.data.contentieux },
            "sinistre": { "idSinistre": this.infoSinistre.idSinistre },
            "auditUser": sessionStorage.getItem("userId")
          }
          if (this.infoSinistre.sinistreFraudes.length == 0) {
            this.sinistresService.AddFraude(bodyFraude, this.infoSinistre.idSinistre).subscribe({
              next: (data: any) => {

                this.getSinistreInfo()
                this.handleSuccess("Fraude déclarée avec succée.")

              },
              error: (error) => {
                this.handleError(error)

              }
            })
          } else {
            this.sinistresService.updateFraude(bodyFraude, this.infoSinistre.sinistreFraudes[0]?.idFraude).subscribe({
              next: (data: any) => {
                this.getSinistreInfo()

                this.handleSuccess("Fraude modifiée avec succée.")

              },
              error: (error) => {
                this.handleError(error)

              }
            })
          }


        }
    });
  }
  assistanceDialog() {
    const dialogRef = this.dialog.open(EditAssistanceDialogComponent, {
      width: '40%',
      data: {
        "assistanceInfo": this.infoSinistre.sinistreAssistances,
        "statutSinistre": this.infoSinistre.statut.code,
      }
    });
    let sinistreAssistances = this.infoSinistre.sinistreAssistances[0]
    dialogRef.afterClosed().subscribe(result => {
      if (result) {


        if (this.infoSinistre.sinistreAssistances.length != 0) {
          if (result.data.bodyAssistance != null) {
            sinistreAssistances.existeAssistance = result.data.bodyAssistance.existeAssistance
            sinistreAssistances.appelAssistance = result.data.bodyAssistance.appelAssistance
            sinistreAssistances.assisteur = { 'idParam': result.data.bodyAssistance.assisteur.idParam }

          } else {
            sinistreAssistances.existeAssistance = null
            sinistreAssistances.appelAssistance = null
            sinistreAssistances.assisteur = null
          }
          sinistreAssistances.auditUser = sessionStorage.getItem("userId")
          this.sinistresService.editAssisteur(sinistreAssistances, sinistreAssistances.idAssistance).subscribe({
            next: (data: any) => {
              this.getSinistreInfo()
              this.handleSuccess("Assistance modifiée avec succée.")
            },
            error: (error) => {


            }
          })
        } else {

          sinistreAssistances = {}
          if (result.data.bodyAssistance != null) {

            sinistreAssistances.existeAssistance = result.data.bodyAssistance.existeAssistance
            sinistreAssistances.appelAssistance = result.data.bodyAssistance.appelAssistance
            sinistreAssistances.assisteur = { 'idParam': result.data.bodyAssistance.assisteur.idParam }

          } else {
            sinistreAssistances.existeAssistance = null
            sinistreAssistances.appelAssistance = null
            sinistreAssistances.assisteur = null
          }
          sinistreAssistances.auditUser = sessionStorage.getItem("userId")
          this.sinistresService.addAssisteur(sinistreAssistances, this.infoSinistre.idSinistre).subscribe({
            next: (data: any) => {
              this.getSinistreInfo()
              this.handleSuccess("Assistance ajoutée avec succée.")
            },
            error: (error) => {


            }
          })
        }

      }

    });
  }
  confirmationDialog(type: string) {
    const dialogRef = this.dialog.open(DeletePersonneDialogComponent, {
      width: '40%',
      data: { "typeContent": type }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        if (result.data.content == null) {
          switch (type) {
            case 'annuler':
              this.sinistresService.annulerSinistre(this.infoSinistre.idSinistre).subscribe({
                next: (data: any) => {
                  //  this.getSinistreInfo()
                  this.handleSuccess(data)
                  //gestion-sinistre/:codeProduit/:nameProduit/gestionnaire-sinistre/:codeSinistre
               //   this.router.navigate(['../../'], { relativeTo: this.route });
                  this.router.navigate(['gestion-sinistre/' + this.route.snapshot.paramMap.get('codeProduit') +'/' + this.route.snapshot.paramMap.get('nameProduit') + '/gestionnaire-sinistre/' + this.codeSinistre ]);

                },
                error: (error) => {
                  this.handleError(error)
                }
              })
              break;
            case 'reouvrir':
              this.sinistresService.reouvrirSinistre(this.infoSinistre.idSinistre).subscribe({
                next: (data: any) => {
                  this.getSinistreInfo()
                  this.handleSuccess(data)
                },
                error: (error: any) => {

                  this.handleError(error)
                }
              })
              break;
            default:
              break;
          }
        } else {
          let body = {
            "motif": { "idParam": result.data.content.motif.idParam, "code": result.data.content.motif.code },
            "description": result.data.content.description,
            "sousMotif": null || {}
          }
          if (result.data.content.motifCloture == 'CP526')
            body.sousMotif = { "idParam": result.data.content.sousMotif.idParam, "code": result.data.content.sousMotif.code }

          this.sinistresService.cloturerSinistre(this.infoSinistre.idSinistre, body).subscribe({
            next: (data: any) => {
              this.getSinistreInfo()
              this.handleSuccess(data)
              body.motif.code == "CP526" ? this.sinistresService.outputClassement(this.infoSinistre, body) : ''
            },
            error: (error: any) => {

              this.handleError(error)
            }
          })

        }
    });
  }
  handleError(error: any) {
    // let msg =error
    // if(error.status==400)
    //   msg="Erreur systéme veuillez contacter l'administrateur"
    Swal.fire(
      error,
      '',
      'error'
    )
  }


  
  handleSuccess(successMsg: any) {

    Swal.fire({
      title: successMsg,
      icon: 'info',
      confirmButtonText: `Ok`,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload()
      }
    })
  }
}
