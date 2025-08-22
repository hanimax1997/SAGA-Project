import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-list-op',
  templateUrl: './gestion-op.component.html',
  styleUrls: ['./gestion-op.component.scss']
})
export class GestionOpComponent {
  codeSinistre = this.route.snapshot.paramMap.get('codeSinistre');
  formFilterOp: FormGroup | any;
  displayedColumns: string[] = ['numOp', 'statut', 'type', 'dateCreation', 'modePaiement', 'montant', 'action'];
  dataSource: any;
  typeOpCode: any;
  idSinistre: any;
  statuN:any;
  codeProduit:any;
  rolesJs=JSON.parse(sessionStorage.getItem("roles")??"")
  // isCdcDa= sessionStorage.getItem("roles")?.includes("CDC") || sessionStorage.getItem("roles")?.includes("DA") || sessionStorage.getItem("roles")?.includes("CONSULTATION") 
  //||  sessionStorage.getItem("roles")?.includes("GESTIONNAIRE_SINISTRE") || sessionStorage.getItem("roles")?.includes("ROLE_SUPER_ADMIN")
  isCdcDa= this.rolesJs?.includes("CDC") || this.rolesJs?.includes("DA") || this.rolesJs?.includes("CONSULTATION") || this.rolesJs.includes("COURTIER")
  //||  sessionStorage.getItem("roles")?.includes("GESTIONNAIRE_SINISTRE") || sessionStorage.getItem("roles")?.includes("ROLE_SUPER_ADMIN")
  isConsult= sessionStorage.getItem("roles")?.includes("CONSULTATION")
  cdcDaImprim = sessionStorage.getItem("roles")?.includes("CDC") || sessionStorage.getItem("roles")?.includes("DA")
  roleExist: any = false;
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["WEB_HELP", "GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["WEB_HELP", "GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["WEB_HELP", "GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["WEB_HELP", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["WEB_HELP", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sinistresService: SinistresService) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  ngOnInit(): void {
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')

    this.roleUser.find((r: any) => {
      if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
        this.roleExist = true;
        return;
      }
    })
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')

    this.roleUser.find((r: any) => {
      if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
        this.roleExist = true;
        return;
      }
    })
    this.initFormFilter();
    this.getListOp(this.codeSinistre);
  }

  initFormFilter() {
    this.formFilterOp = this.formBuilder.group({
      numPolice: [null],
      numSinistre: [null],
      dateSurvenance: [null],
      numOp: [null],
      dateOp: [null],
    })
  }

  getOpById(idOp: any) {
    this.sinistresService.getReglement(idOp).subscribe({
      next: (data: any) => {
        console.log(data)
        let his = {
          contrat: data?.sinistreReserve?.sinistre?.contratHistorique?.idContrat?.idContrat,
          dateEffet: data?.sinistreReserve?.sinistre?.dateDeclaration,
          idRisque: data?.sinistreReserve?.sinistre?.codeRisque
        }

        data?.typeOp?.code == "OPA" ? this.sinistresService.outputIndemnisation(data) : '';

        this.sinistresService.historiqueAvenant(his).subscribe({
          next: (historique: any) => {
            if (data?.statut?.code == "CP421" || data?.statut?.code == "CP481") {
              this.sinistresService.getOpById(idOp).subscribe({
                next: (dataOP: any) => {
                  this.sinistresService.outputOp(data, historique,dataOP) 
                 },
                error: (error) => { console.log(error); }
              })
            }
          },
          error: (error) => { console.log(error); }
        })
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  getListOp(code: any) {

    this.sinistresService.getOpBySinistre(code).subscribe({
      next: (data: any) => {
        this.statuN=data[0].sinistre.statut.description;
        this.dataSource = new MatTableDataSource(data)

        this.dataSource.paginator = this.paginator;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }


  submitFilter() {

    let dateOp = null;

    if (this.formFilterOp.get("dateOp").value) {
      dateOp = moment(this.formFilterOp.get("dateOp").value).format('YYYY-MM-DD');
    }

    let bodyFilter = {
      "code": this.formFilterOp.get("numOp").value,
      "date": dateOp,
    }

    this.sinistresService.filterOp(bodyFilter, this.codeSinistre).subscribe({
      next: (data: any) => {

        this.dataSource = new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.log(error);
      }
    })

  }
  annulOp(idOp: any, AuditUser: any) {

    this.sinistresService.annulationOp(idOp, AuditUser).subscribe({
      next: (data: any) => {
        this.handleSuccess(data)

      },
      error: (error) => {
        console.log(error)
        this.handleError(error.text ? error.text : error);



      }
    })
  }
  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  goTo(value: any, idOp: any) {
    switch (value) {
      case 'consulter':
        this.router.navigate(['consult-op/' + idOp], { relativeTo: this.route });
        break;
      case 'approuv':

        let auditUser = sessionStorage.getItem('userId')
        //APi approuve op    
        Swal.fire({
          title: "Voulez vous approuver l'OP",
          icon: 'info',
          allowOutsideClick: false,
          showDenyButton: true,
          confirmButtonText: `Approuver`,
          denyButtonText: `rejeter`,
          denyButtonColor: "#4942E4",
          width: 600
        }).then((result) => {

          if (result.isConfirmed) {
            let statut = true
            this.sinistresService.approuvOp(idOp, auditUser, statut).subscribe({
              next: (data: any) => {
                Swal.fire(
                  data,
                  '',
                  'success'
                )

              },
              error: (error) => {
                console.log(error);
                Swal.fire(
                  error,
                  '',
                  'info'
                )
              }
            })

          } else if (result.isDenied) {
            let statut = false
            this.sinistresService.approuvOp(idOp, auditUser, statut).subscribe({
              next: (data: any) => {
                Swal.fire(
                  data,
                  '',
                  'info'
                )

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
        })

        break;
      case 'regler':
        let typeOpcode: any;
        let decompteOp: any;
        let idSinistre: any;

        this.sinistresService.getOpById(idOp).subscribe({
          next: (data: any) => {

            typeOpcode = data.typeOp.code
            decompteOp = data.decompteOp.idDecompteOp
            idSinistre = data.sinistre.idSinistre
console.log("data.sinistre");
console.log(data.sinistre);
            this.router.navigate(['/OP/' + typeOpcode + '/' + decompteOp + '/' + idSinistre + '/paiement'], { relativeTo: this.route });
          },
          error: (error) => {
            console.log(error);
          }
        })



        break;
      case 'annuler':
        let AuditUser: any;
        AuditUser = sessionStorage.getItem("userId")
        this.sinistresService.getOpById(idOp).subscribe({
          next: (data: any) => {
            this.annulOp(idOp, AuditUser)
          },
          error: (error) => {
            console.log(error);
          }
        })

        break;
    }
  }
  handleError(error: any) {

    Swal.fire({
      title: error,
      icon: 'info',
      confirmButtonText: `Ok`,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload()
      }
    })
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
