import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { Router, ActivatedRoute } from '@angular/router';
import { MissionExpertiseService } from 'src/app/core/services/mission-expertise.service';
import { ConfirmationMissionDialogComponent } from '../confirmation-mission-dialog/confirmation-mission-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultation-mission-expertise',
  templateUrl: './consultation-mission-expertise.component.html',
  styleUrls: ['./consultation-mission-expertise.component.scss']
})
export class ConsultationMissionExpertiseComponent implements OnInit {
  informationsMissionExpertise: any = []
  idMissionExpertise: any
  getInfoReady: boolean=false;
  codeProduit: any
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["WEB_HELP", "GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["WEB_HELP", "GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["WEB_HELP", "GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["WEB_HELP", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["WEB_HELP", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }

  constructor(private router: Router, private dialog: MatDialog, private route: ActivatedRoute, private missionExpertiseService: MissionExpertiseService) { }

  ngOnInit(): void {
    this.idMissionExpertise= this.route.snapshot.paramMap.get('idMissionExpertise')

    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')



    let roleExist = false;
    this.roleUser.find((r: any) => {
      if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
        roleExist = true;
        return;
      }
    })

    if(!roleExist) this.router.navigate(['/dashboard'])
    
    this.getMissionExpertiseById()
  }
  getMissionExpertiseById() {
    this.missionExpertiseService.getMissionsExpertisesById(this.idMissionExpertise).subscribe({
      next: (data: any) => {
        this.informationsMissionExpertise = data
        this.idMissionExpertise = data.numMission
        this.getInfoReady=true
       
      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  openConfirmation(type: string) {
    let dialogRef = this.dialog.open(ConfirmationMissionDialogComponent, {
      width: '40%',
      data: {
        type: type
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
    
      if (result != false) {
        
        let body = {
          "idMissionExpertise": this.idMissionExpertise,
          "typeFonction": type,
          "motifRejet": result.data.data

        }
        this.missionExpertiseService.missionOpertion(body).subscribe({
          next: (data: any) => {
            if (data.statut) {
              Swal.fire(
                data.messageStatut,
                '',
                'success'
              )
            } else {
              Swal.fire(
                data.messageStatut,
                '',
                'error'
              )
            }

          },
          error: (error) => {

            console.log(error);

          }
        })

      }



    });

  }
}
