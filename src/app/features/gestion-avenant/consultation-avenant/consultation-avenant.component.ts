import { Component, ViewChild } from '@angular/core';
import { GenericService } from 'src/app/core/services/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AvenantService } from 'src/app/core/services/avenant.service';
import { ContratService } from 'src/app/core/services/contrat.service';
import { DialogRisquePackComponent } from '../../gestion-devis/dialog-risque-pack/dialog-risque-pack.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ValidationAvenantComponent } from '../validation-avenant/validation-avenant.component';

@Component({
  selector: 'app-consultation-avenant',
  templateUrl: './consultation-avenant.component.html',
  styleUrls: ['./consultation-avenant.component.scss']
})
export class ConsultationAvenantComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  attributsAvenant: any;
  informationsRisque: any;
  multiRisque = false
  idContratAvenant: any
  hisHistorique: any
  valeurVenale: any
  dataSourceGroupes = new MatTableDataSource()
  colonnesDynamiques: any = []
  displayColonnes: any = ['idRisque', 'idGroupe']
  codeProduit: any
  hasRights: any
  dataSourcePrime: any;
  dataSourceTaxe: any;
  hisReady = false
  informationsConducteur: { nom: any; prenom: any; dateNaissance: any; categoriePermis: any; dateDelivrance: any; email: any; tel: any; };
  informationsSouscripteur: { raisonSocial: any; nom: any; prenom: any; email: any; tel: any; };
  informationsAssure: { typeClient: string; raisonSocial: any; nom: any; prenom: any; email: any; tel: any; };
  constructor(private router: Router, private dialog: MatDialog, private contratService: ContratService, private avenantService: AvenantService, private route: ActivatedRoute, private genericService: GenericService) {

  }
  ngOnInit(): void {
    this.hasRights = sessionStorage.getItem('roles')?.includes("BO")

    this.getInfoProduit()
    this.idContratAvenant = this.route.snapshot.paramMap.get('idContratAvenant');
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit');

  }
  getInfoProduit() {
    let idProduit: any = JSON.parse(sessionStorage.getItem('products') || '{}').find((parametre: any) => parametre.codeProduit == this.route.snapshot.paramMap.get('codeProduit')).idProduit
    this.genericService.getPorduitById(idProduit).subscribe({
      next: (data: any) => {

        this.multiRisque = data.param_Produit_Reponses.filter((element: any) => element.idParamProduit.libelle == "multirisque")[0].reponse.description == "Oui" ? true : false
        this.getAvenantByContrat();

      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  getAvenantByContrat() {
    this.avenantService.getAttributsAvenant(this.idContratAvenant).subscribe({
      next: (data: any) => {
        this.attributsAvenant = data;
        //this.getParamAvenant();
        this.hisHistorique = data.idHisContrat

        this.getHistoriqueContrat(this.hisHistorique);
      },
      error: (error: any) => {
        console.log(error);
      }
    });

  }
  getHistoriqueContrat(idHisContrat: any) {
    this.contratService.getContratHistoriqueById(idHisContrat).subscribe({
      next: (histoContrat: any) => {
        this.hisReady = true
        this.attributsAvenant.risqueList.map((rsAvenant: any) => {

          histoContrat.groupesList.map((gr: any) => {

            gr.risques.map((rs: any) => {

              if (rs.idRisque == rsAvenant.idRisque) {
                Object.assign(rsAvenant, { idGroupe: gr.idGroupe });
              }
            })
          })
        })
        histoContrat?.personnesList?.forEach((element: any) => {
          // personne.role.code == "CP235" || personne.role.code == "CP236" || personne.role.code == "CP238" || personne.role.code == "CP240")[0]?.personne

          switch (element?.role?.code) {
            case 'CP233':
              this.informationsConducteur = {
                "nom": element.personne.nom,
                "prenom": element.personne.prenom1,
                "dateNaissance": element.personne.dateNaissance,
                "categoriePermis": element.personne.documentList?.find((d: any) => d.typeDocument?.idParam == 5)?.sousCategorie,
                "dateDelivrance": element.personne.documentList?.find((d: any) => d.typeDocument?.idParam == 5)?.dateDelivrance,
                "email": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description,
                "tel": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description,
              }
              break;

            case 'CP234':
              this.informationsSouscripteur = {
                "raisonSocial": element.personne.raisonSocial,
                "nom": element.personne.nom,
                "prenom": element.personne.prenom1,
                "email": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description,
                "tel": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description,
              }
              break;

            case 'CP235':

              this.informationsAssure = {
                "typeClient": 'raisonSocial' in element.personne ? 'personne morale' : 'personne physique',
                "raisonSocial": element.personne.raisonSocial,
                "nom": element.personne.nom,
                "prenom": element.personne.prenom1,
                "email": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description,
                "tel": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description,
              }
              break;

            case 'CP236':
              this.informationsAssure = {
                "typeClient": 'raisonSocial' in element.personne ? 'personne morale' : 'personne physique',
                "raisonSocial": element.personne.raisonSocial,
                "nom": element.personne.nom,
                "prenom": element.personne.prenom1,
                "email": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description,
                "tel": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description,
              }

              this.informationsSouscripteur = {
                "raisonSocial": element.personne.raisonSocial,
                "nom": element.personne.nom,
                "prenom": element.personne.prenom1,
                "email": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description,
                "tel": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description,
              }
              break;

            case 'CP237':
              this.informationsSouscripteur = {
                "raisonSocial": element.personne.raisonSocial,
                "nom": element.personne.nom,
                "prenom": element.personne.prenom1,
                "email": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description,
                "tel": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description,
              }

              this.informationsConducteur = {
                "nom": element.personne.nom,
                "prenom": element.personne.prenom1,
                "dateNaissance": element.personne.dateNaissance,
                "categoriePermis": element.personne.documentList?.find((d: any) => d.typeDocument?.idParam == 5)?.sousCategorie,
                "dateDelivrance": element.personne.documentList?.find((d: any) => d.typeDocument?.idParam == 5)?.dateDelivrance,
                "email": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description,
                "tel": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description,
              }
              break;

            case 'CP238':
              this.informationsAssure = {
                "typeClient": 'raisonSocial' in element.personne ? 'personne morale' : 'personne physique',
                "raisonSocial": element.personne.raisonSocial,
                "nom": element.personne.nom,
                "prenom": element.personne.prenom1,
                "email": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description,
                "tel": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description,
              }

              this.informationsSouscripteur = {
                "raisonSocial": element.personne.raisonSocial,
                "nom": element.personne.nom,
                "prenom": element.personne.prenom1,
                "email": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description,
                "tel": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description,
              }

              this.informationsConducteur = {
                "nom": element.personne.nom,
                "prenom": element.personne.prenom1,
                "dateNaissance": element.personne.dateNaissance,
                "categoriePermis": element.personne.documentList?.find((d: any) => d.typeDocument?.idParam == 5)?.sousCategorie,
                "dateDelivrance": element.personne.documentList?.find((d: any) => d.typeDocument?.idParam == 5)?.dateDelivrance,
                "email": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description,
                "tel": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description,
              }
              break;

            default:
              break;
          }
        });
        if (!this.multiRisque) {
          this.consultRisque(this.attributsAvenant.risqueList[0].idGroupe, this.attributsAvenant.risqueList[0].idRisque)
          this.contratService.getQuittanceById(histoContrat?.idQuittance).subscribe({
            next: (quittance: any) => {
              this.dataSourcePrime = quittance.primeList
              this.dataSourceTaxe = quittance.taxeList

            },
            error: (error) => {
              console.log(error);
            }
          });
        }
        //this.consultRisque(data.risqueList[0].idRisque, datas.groupesList[0].idGroupe)
        else {

          /*******************multirisque ************************/
          let elementsTransformes: any[] = [];

          this.attributsAvenant.risqueList.forEach((element: any) => {
            let elementTransforme: any = {
              idRisque: element.idRisque,
              idGroupe: element.idGroupe
            };

            element.risque.forEach((risque: any) => {
              elementTransforme[risque.colonne] = risque.valeur;
            });

            elementsTransformes.push(elementTransforme);
          });

          this.attributsAvenant.risqueList[0].risque.map((rs: any) => {
            this.colonnesDynamiques.push(rs.colonne)
            this.displayColonnes.push(rs.colonne)
          })
          this.displayColonnes.push('action')
          //this.colonnesDynamiques=this.colonnesDynamiques.push(Object.keys(this.attributsAvenant.risqueList[0].risque))

          this.dataSourceGroupes = new MatTableDataSource(elementsTransformes)

          this.dataSourceGroupes.paginator = this.paginator;
          this.contratService.getQuittanceById(histoContrat?.idQuittance).subscribe({
            next: (quittance: any) => {
              this.dataSourcePrime = quittance.primeList
              this.dataSourceTaxe = quittance.taxeList

            },
            error: (error) => {
              console.log(error);
            }
          });
        }

      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
  consultRisque(idGroupe: any, idRisque: any) {
    //EXP call get param risque by devis, groupe & id risque
    this.contratService.getParamContratByIdRisqueHisto(this.hisHistorique, idGroupe, idRisque).subscribe({
      next: (dataParam: any) => {

        if (!this.multiRisque) {

          this.informationsRisque = dataParam.reduce((x: any, y: any) => {
            y?.codeParam == "P40" ? this.valeurVenale = y.valeur : "";
            (x[y.categorieParamRisque] = x[y.categorieParamRisque] || []).push(y);

            return x;

          }, {});


          this.informationsRisque = Object.values(this.informationsRisque)

          // this.getWilaya()
        }
        if (this.multiRisque) {
          //EXP call get pack/garanties risque by devis, groupe & id risque
          this.contratService.getPackIdRisqueHistorique(this.hisHistorique, idRisque).subscribe({
            next: (dataPack: any) => {

              this.openDialog(dataParam, dataPack)


            },
            error: (error) => {
              console.log(error);
            }
          });
        }


      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  openDialog(param: any, pack: any) {
    let dialogRef = this.dialog.open(DialogRisquePackComponent, {
      width: '60%',
      data: {
        paramRisque: param,
        pack: pack,
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {

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
}
