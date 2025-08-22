import { ChangeDetectorRef, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GenericService } from 'src/app/core/services/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AvenantService } from 'src/app/core/services/avenant.service';
import { ContratService } from 'src/app/core/services/contrat.service';
import { DialogRisquePackComponent } from 'src/app/features/gestion-devis/dialog-risque-pack/dialog-risque-pack.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ValidationAvenantVieComponent } from '../validation-avenant-vie/validation-avenant-vie.component';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-consultation-avenant-vie',
  templateUrl: './consultation-avenant-vie.component.html',
  styleUrls: ['./consultation-avenant-vie.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ConsultationAvenantVieComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<any>>;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
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
  displayedColumnsRs = ['description', 'more']
  displayedColumnsRsInner: any = []
  displayedColumnsCol: any = []
  expandedElement: any
  idGroupe: any

  constructor(private router: Router, private cd: ChangeDetectorRef, private dialog: MatDialog, private contratService: ContratService, private avenantService: AvenantService, private route: ActivatedRoute, private genericService: GenericService) {

  }
  ngOnInit(): void {
    this.hasRights = sessionStorage.getItem('roles')?.includes("BO")

    this.getInfoProduit()
    this.idContratAvenant = this.route.snapshot.paramMap.get('idContratAvenant');
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit');

  }
  toggleRow(element: any) {


    this.dataSourceGroupes.data.indexOf(element)

    this.idGroupe = element.idGroupe
    element.risques && (element.risques as MatTableDataSource<any>).data.length
      ? (this.expandedElement = this.expandedElement === element ? null : element) : null;

    this.cd.detectChanges();
    this.innerTables.forEach(
      (table, index) =>
      ((table.dataSource as MatTableDataSource<any>).sort =
        this.innerSort.toArray()[index])
    );
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

        console.log( "hisHistorique ==============> ")
        console.log( this.attributsAvenant )

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
        const isBeforeDateEffet = new Date() < new Date(histoContrat.dateEffet);
        // code avenant pour resiliastion(sans et avec ristourne) et annulation administrative
        const approvedAvenantsForDa=["A04","A03","A01"]
        this.hasRights = this.hasRights || 
        (sessionStorage.getItem('roles')?.includes("DA") && isBeforeDateEffet && approvedAvenantsForDa.includes(this.attributsAvenant.typeAvenant.code))
        console.log("new Has RIGHT", this.hasRights)
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
              console.log("quitance1",this.dataSourcePrime)

            },
            error: (error) => {
              console.log(error);
            }
          });
        }
        //this.consultRisque(data.risqueList[0].idRisque, datas.groupesList[0].idGroupe)
        else {
          console.log(histoContrat)
          /*******************multirisque ************************/
          let rsTab: any = []
          const RisqueObject = histoContrat.groupesList
          RisqueObject.forEach((groupe: any) => {
            groupe.risques.forEach((risque: any) => {
              risque.risque.forEach((column: any) => {
                // Transformer la clé "colonne"
                column.colonne = column.colonne.split(' ').map((word: any) => word.charAt(0).toUpperCase() + word.substring(1)).join('').replace(/[°']/g, '');
                this.displayedColumnsRsInner = this.displayedColumnsRsInner.includes(column.colonne) ? this.displayedColumnsRsInner : [...this.displayedColumnsRsInner, column.colonne];
                this.displayedColumnsCol = this.displayedColumnsCol.includes(column.colonne) ? this.displayedColumnsCol : [...this.displayedColumnsCol, column.colonne];

                // Trouver l'objet correspondant dans risque.risque et mettre à jour sa propriété
                const targetObject = risque.risque.find((rs: any) => rs.colonne === column.colonne);
                if (targetObject) {
                  targetObject[column.colonne] = column.valeur;
                  // Vous pouvez également supprimer la clé "colonne" si nécessaire
                  delete targetObject.colonne;
                  delete targetObject.valeur;
                }
              });
            });
          });

          this.displayedColumnsRsInner.push('action')
          RisqueObject.forEach((groupe: any) => {

            if (
              groupe.risques &&
              Array.isArray(groupe.risques) &&
              groupe.risques.length
            ) {
              groupe.risques.idGroupe =
                groupe.idGroupe;
              rsTab = [
                ...rsTab,
                {
                  ...groupe,
                  // risques: new MatTableDataSource(
                  //   groupe.risques
                  // ),
                  risques: new MatTableDataSource(groupe.risques)
                },
              ];

            } else {
              rsTab = [...rsTab, groupe];
            }
          });
          this.dataSourceGroupes = new MatTableDataSource(rsTab)
          this.dataSourceGroupes.paginator = this.paginator;
          
          this.contratService.getQuittanceById(histoContrat?.idQuittance).subscribe({
            next: (quittance: any) => {

              this.dataSourcePrime = quittance.primeList
              this.dataSourceTaxe = quittance.taxeList
console.log("quitance1",this.dataSourcePrime)
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
  consultRisque( idRisque: any,idGroupe: any) {
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


    const dialogRef = this.dialog.open(ValidationAvenantVieComponent, {
      width: '40%',
      data: {
        idContratAvenant: this.idContratAvenant
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/consultation-avenants/vie/' + this.codeProduit + '/' + this.attributsAvenant?.idContrat]);
    });
  }
}
