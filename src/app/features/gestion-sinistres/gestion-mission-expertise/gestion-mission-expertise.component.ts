import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MissionExpertiseService } from 'src/app/core/services/mission-expertise.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ConfirmationMissionDialogComponent } from './confirmation-mission-dialog/confirmation-mission-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SinistresService } from 'src/app/core/services/sinistres.service';

@Component({
  selector: 'app-gestion-mission-expertise',
  templateUrl: './gestion-mission-expertise.component.html',
  styleUrls: ['./gestion-mission-expertise.component.scss']
})
export class GestionMissionExpertiseComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  displayedColumns: string[] = ['numMission', 'typeExpertise','modeExpertise', 'expert', 'dateMission', 'statut', 'action'];
  //FIXEME to remove 
  missions = [
    {
      "numMission": 1,
      "typeExpertise": "par acte",
      "expert": "test test",
      "dateMission": new Date(),
      "statut": "En cours",
    },
    {
      "numMission": 2,
      "typeExpertise": "par acte",
      "expert": "test test",
      "dateMission": new Date(),
      "statut": "Rejeté",
    }
  ]
  statutSinistre:any
  idSinistre: any
  dataSource = new MatTableDataSource()
  sinistre: any;
  hasRights: any;
  produit : any;
  codeProduit: any;
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["WEB_HELP","GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["WEB_HELP","GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["WEB_HELP","GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["WEB_HELP","GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["WEB_HELP","GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private missionExpertiseService: MissionExpertiseService, private sinistresService: SinistresService) { }
  ngOnInit(): void {
    this.idSinistre = this.route.snapshot.paramMap.get('idSinistre')
    this.produit = this.route.snapshot.paramMap.get('produit')
    this.hasRights = sessionStorage.getItem('roles')?.includes("WEB_HELP")

    this.getSinistreById()
    this.getAllMissionExpertise()

    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')

    let roleExist = false;
    this.roleUser.find((r: any) => {
      if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
        roleExist = true;
        return;
      }
    })

    if(!roleExist) this.router.navigate(['/dashboard'])
  }

  getSinistreById() {
    this.sinistresService.getSinistreByID(this.idSinistre).subscribe({
      next: (data: any) => {
        this.sinistre = data
        this.statutSinistre=this.sinistre.statut.code   
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  printMission(idMission: any) {
    this.missionExpertiseService.getMissionsExpertisesById(idMission).subscribe({
      next: (data: any) => {
        console.log(data)
        console.log(this.sinistre)
        this.missionExpertiseService.outputMission(data, this.sinistre);
      },
      error: (error) => {

        console.log(error);

      }
    })
  }

  getAllMissionExpertise() {
    this.missionExpertiseService.getAllMissionsExpertisesBySinistre(this.idSinistre).subscribe({
      next: (data: any) => {
        this.dataSource = new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  goTo(id: any) {

    this.router.navigateByUrl("gestion-missionsExpertise/gestion-mission-expertise/" + this.idSinistre + "/consultation-mission-expertise/" + id);

  }
  addMissionExpertise() {
    this.router.navigateByUrl("gestion-missionsExpertise/gestion-mission-expertise/" + this.idSinistre + '/'+this.produit+"/creation-mission-expertise");

  }

  openConfirmation(idMissionExpertise: any, type: string) {
   
    let dialogRef = this.dialog.open(ConfirmationMissionDialogComponent, {
      width: '40%',
      disableClose: true,
      data: {
        type: type
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
     
      if (result != false) {

        let body = {
          "idMissionExpertise": idMissionExpertise,
          "typeFonction": type,
          "motifRejet": result.data.data

        }
        this.missionExpertiseService.missionOpertion(body).subscribe({
          next: (data: any) => {
            if (data.statut) {
              this.getAllMissionExpertise()
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
