import { Component } from '@angular/core';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { EditReserveDialogComponent } from '../edit-reserve-dialog/edit-reserve-dialog.component';

@Component({
  selector: 'app-reserve-paiement',
  templateUrl: './reserve-paiement.component.html',
  styleUrls: ['./reserve-paiement.component.scss']
})
export class ReservePaiementComponent {

  displayedColumns = [
    'garantie',
    'reserve',
    'reserveActuelle',
    'op',
    'reserveTotale',
    'action'
  ];
  codeSinistre: any


  dataSource: any = []
  spanningColumns = ['garantie'];
  idSinistre: any;

  spans: any = [];
  statutSinistre: any
  reservation : Number;
  roles:any;
  privilage:boolean=false;
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }

  constructor(private route: ActivatedRoute, private router: Router, private sinistresService: SinistresService, public dialog: MatDialog) {
  }
  ngOnInit(): void {
    this.codeSinistre = this.route.snapshot.paramMap.get('codeSinistre')
    this.idSinistre = this.route.snapshot.paramMap.get('codeSinistre')
    this.statutSinistre = this.route.snapshot.paramMap.get('statutSinistre')
    this.getReserves()
    this.roles=sessionStorage.getItem('roles')
    this.privilage=this.roles.includes('GESTIONNAIRE_JUNIOR')
    const codeProduit = this.route.snapshot.paramMap.get('codeProduit');
    let roleExist = false;
    this.roleUser.find((r: any) => {
      if(this.sinistreRoles[codeProduit+""].includes(r)) {
        roleExist = true;
        return;
      }
    })

    if(!roleExist) this.router.navigate(['/dashboard'])


  }
  getReserves() {
    this.sinistresService.getReserveByCodeSinistre(this.codeSinistre).subscribe({
      next: (data: any) => {
        this.dataSource = data
      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  goTo(type: string, codeReserve: any, codeGarantie: any) {
    
    this.sinistresService.getSinistreByCode(this.codeSinistre).subscribe({
      next: (data: any) => {
        this.dataSource = data

          switch (type) {
            case 'create-op':
      
            this.router.navigate(['calculateur/' + codeGarantie + "/" + codeReserve + "/" + "OP"], { relativeTo: this.route });
      
              break;
      
          }
        
      
      },
      error: (error) => {

        Swal.fire(
          `une erreur est survenue contacter l'administratuer`,
          '',
          'error'
        )
        console.log(error);

      }
    })


  }
  cancelReserve(idReserve: string) {

    this.sinistresService.annulationReserve(idReserve).subscribe({
      next: (data: any) => {
        Swal.fire(
          data,
          '',
          'success'
        )
        this.getReserves()
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

  modifierReserve(idReserve: any,codeGarantie: string,codeReserve: string) {

    
    const dialogRef=this.dialog.open(EditReserveDialogComponent, {
    width: '300px',
    data: { reservation: this.dataSource.find((gar:any)=>gar.codeGarantie==codeGarantie)?.reserves?.find((res:any)=>res.codeReserve==codeReserve)?.reserveActuelle ?? 0 } // Passer la réservation actuelle
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.reservation = result.reservation;
    }

    let modifierReserveBody={
      "idReserve":idReserve,
      "codeGarantie":codeGarantie,
      "codeReserve":codeReserve,
      "valeur":this.reservation
    } 
      this.sinistresService.getModifierReserveByCodeGarantieAndCodeReserve(this.codeSinistre,modifierReserveBody).subscribe({
        next: (data: any) => {
          this.dataSource = data;
          Swal.fire({
            icon: "success",
            title: "Reserve modifier avec succes",
            timer:5000
          });
          window.location.reload();

        },
        error: (error) => {
          Swal.fire({
            showConfirmButton: true
          });
          console.log(error);
  
        }
      })
    
  });
}

  goBack() {

    this.router.navigate(['../../'], { relativeTo: this.route });

  }
  calculateur(codeReserve: any, codeGarantie: any) {

    this.sinistresService.getSinistreByCode(this.codeSinistre).subscribe({
      next: (data: any) => {
        this.dataSource = data

            this.router.navigate(['calculateur/' + codeGarantie + "/" + codeReserve + "/" + "PV"], { relativeTo: this.route });
          
      
  
        },
        error: (error) => {

          Swal.fire(
            `une erreur est survenue contacter l'administratuer`,
            '',
            'error'
          )
          console.log(error);

        }


    })}

}


