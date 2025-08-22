import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AvenantService } from 'src/app/core/services/avenant.service';
import { ContratService } from 'src/app/core/services/contrat.service';
import { ValidationAvenantComponent } from '../validation-avenant/validation-avenant.component';
import { MatTableDataSource } from '@angular/material/table';
import { PackService } from 'src/app/core/services/pack.service';

@Component({
  selector: 'app-consult-avenant',
  templateUrl: './consult-avenant.component.html',
  styleUrls: ['./consult-avenant.component.scss']
})
export class ConsultAvenantComponent {
  idContratAvenant: any;
  attributsAvenant: any;
  selectedMotif: any;
  avenant: any;
  informationsRisque: any;
  informationsPack: any = []

  hisContrat: any;
  dataSourcePack = new MatTableDataSource();
  PrimeTotale = 0;
  dataSourcePrime: any;
  dataSourceTaxe: any;
  displayedColumnsPack: string[] = ['description', 'plafond', 'franchise', 'formule', 'prime'];
  valeurVenale: number = 0
  hasRights: any
  codeProduit: any
  constructor(private contratService: ContratService, private route: ActivatedRoute, private avenantService: AvenantService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.hasRights = sessionStorage.getItem('roles')?.includes("BO")
    this.idContratAvenant = this.route.snapshot.paramMap.get('idContratAvenant');
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')


    this.avenantService.getAttributsAvenant(this.idContratAvenant).subscribe({
      next: (datas: any) => {
        this.attributsAvenant = datas;


      
        this.getParamAvenant();
        this.getHistoriqueContrat(this.attributsAvenant.idHisContrat)
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  getHistoriqueContrat(idHisContrat: any) {
    this.contratService.getContratHistoriqueById(idHisContrat).subscribe({
      next: (datas: any) => {
        this.hisContrat = datas
        // datas?.personnesList?.forEach((element: any) => {
        //   switch (element?.role?.idParam) {
        //       case 233:
        //         this.informationsConducteur = {
        //           "nom": element.personne.nom,
        //           "prenom": element.personne.prenom1,
        //           "dateNaissance": element.personne.dateNaissance,
        //           "categoriePermis": element.personne.documentList?.find((d:any) => d.typeDocument?.idParam == 5)?.sousCategorie,
        //           "dateDelivrance": element.personne.documentList?.find((d:any) => d.typeDocument?.idParam == 5)?.dateDelivrance,
        //           "email": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 8)?.description,
        //           "tel": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 7)?.description,
        //         }
        //         break;

        //       case 234:
        //         this.informationsSouscripteur = {
        //           "raisonSocial": element.personne.raisonSocial,
        //           "nom": element.personne.nom,
        //           "prenom": element.personne.prenom1,
        //           "email": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 8)?.description,
        //           "tel": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 7)?.description,
        //         }
        //         break;

        //       case 235:
        //         this.informationsAssure = {
        //           "typeClient": datas.typeClient.description,
        //           "raisonSocial": element.personne.raisonSocial,
        //           "nom": element.personne.nom,
        //           "prenom": element.personne.prenom1,
        //           "email": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 8)?.description,
        //           "tel": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 7)?.description,
        //         }
        //         break;

        //       case 236:
        //         this.informationsAssure = {
        //           "typeClient": datas.typeClient.description,
        //           "raisonSocial": element.personne.raisonSocial,
        //           "nom": element.personne.nom,
        //           "prenom": element.personne.prenom1,
        //           "email": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 8)?.description,
        //           "tel": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 7)?.description,
        //         }

        //         this.informationsSouscripteur = {
        //           "raisonSocial": element.personne.raisonSocial,
        //           "nom": element.personne.nom,
        //           "prenom": element.personne.prenom1,
        //           "email": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 8)?.description,
        //           "tel": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 7)?.description,
        //         }
        //         break;

        //       case 237:
        //         this.informationsSouscripteur = {
        //           "raisonSocial": element.personne.raisonSocial,
        //           "nom": element.personne.nom,
        //           "prenom": element.personne.prenom1,
        //           "email": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 8)?.description,
        //           "tel": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 7)?.description,
        //         }

        //         this.informationsConducteur = {
        //           "nom": element.personne.nom,
        //           "prenom": element.personne.prenom1,
        //           "dateNaissance": element.personne.dateNaissance,
        //           "categoriePermis": element.personne.documentList?.find((d:any) => d.typeDocument?.idParam == 5)?.sousCategorie,
        //           "dateDelivrance": element.personne.documentList?.find((d:any) => d.typeDocument?.idParam == 5)?.dateDelivrance,
        //           "email": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 8)?.description,
        //           "tel": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 7)?.description,
        //         }
        //         break;

        //       case 238:
        //         this.informationsAssure = {
        //           "typeClient": datas.typeClient.description,
        //           "raisonSocial": element.personne.raisonSocial,
        //           "nom": element.personne.nom,
        //           "prenom": element.personne.prenom1,
        //           "email": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 8)?.description,
        //           "tel": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 7)?.description,
        //         }

        //         this.informationsSouscripteur = {
        //           "raisonSocial": element.personne.raisonSocial,
        //           "nom": element.personne.nom,
        //           "prenom": element.personne.prenom1,
        //           "email": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 8)?.description,
        //           "tel": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 7)?.description,
        //         }

        //         this.informationsConducteur = {
        //           "nom": element.personne.nom,
        //           "prenom": element.personne.prenom1,
        //           "dateNaissance": element.personne.dateNaissance,
        //           "categoriePermis": element.personne.documentList?.find((d:any) => d.typeDocument?.idParam == 5)?.sousCategorie,
        //           "dateDelivrance": element.personne.documentList?.find((d:any) => d.typeDocument?.idParam == 5)?.dateDelivrance,
        //           "email": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 8)?.description,
        //           "tel": element.personne.contactList?.find((c:any) => c.typeContact?.idParam == 7)?.description,
        //         }
        //         break;

        //       default:
        //           break;
        //   }
        // });

        // type risque
        this.informationsRisque = datas.risqueList.reduce((x: any, y: any) => {
          y.paramRisque.codeParam == "P40" ? this.valeurVenale = y.valeur : "";
          (x[y.paramRisque.categorieParamRisque.description] = x[y.paramRisque.categorieParamRisque.description] || []).push(y);

          return x;

        }, {});


        this.informationsRisque = Object.values(this.informationsRisque)

        
        datas.paramContratList?.map((garantie: any) => {
          let plafond = "/"
          let formule = "/"
          let franchise = "/"
          garantie.categorieList.map((cateogrie: any) => {
            if (cateogrie.idCategorie == 18)
              franchise = cateogrie.valeur
            else if (cateogrie.idCategorie == 19) {
              formule = cateogrie.valeur
            }
            else if (cateogrie.idCategorie == 29 || cateogrie.idCategorie == 7) {
              if (cateogrie.valeur == '0') { cateogrie.valeur = this.valeurVenale }
              plafond = cateogrie.valeur
            }
          })
          this.informationsPack.push({
            "idGarantie": garantie.idGarantie,
            "description": garantie.description,
            "prime": Number(garantie.prime).toFixed(2),
            "plafond": plafond,
            "formule": formule,
            "franchise": franchise,
          })
        })
        this.dataSourcePack = new MatTableDataSource(this.informationsPack)

        this.dataSourcePack = new MatTableDataSource(this.informationsPack)

        this.contratService.getQuittanceById(this.hisContrat?.idQuittance).subscribe({
          next: (quittance: any) => {
            this.dataSourcePrime = quittance.primeList
            this.dataSourceTaxe = quittance.taxeList
          },
          error: (error) => {
            console.log(error);
          }
        });
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  getParamAvenant() {
    this.avenantService.getAvenantById(this.attributsAvenant.typeAvenant?.idCodeTypeAvenant).subscribe({
      next: (data: any) => {
        this.avenant = data

        this.selectedMotif = this.attributsAvenant?.motif?.motif?.idMotif
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  approuverAvenant() {


    const dialogRef = this.dialog.open(ValidationAvenantComponent, {
      width: '40%',
      data: {
        idContratAvenant: this.idContratAvenant
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/consultation-avenants/' + this.codeProduit + '/' + this.attributsAvenant?.idContrat]);
    });
  }

  consultContratAvenant(idContratAvenant: any) {
    this.router.navigate(['consultation-contrat-avenant/' + this.codeProduit + '/' + idContratAvenant]);
  }
}
