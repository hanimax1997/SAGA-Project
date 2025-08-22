import { ChangeDetectorRef, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AvenantService } from 'src/app/core/services/avenant.service';
import { ContratService } from 'src/app/core/services/contrat.service';
import { MatPaginator } from '@angular/material/paginator';
import { GenericService } from 'src/app/core/services/generic.service';
import { DevisService } from 'src/app/core/services/devis.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DialogRisquePackComponent } from '../../gestion-devis/dialog-risque-pack/dialog-risque-pack.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-consult-avenant',
  templateUrl: './consult-contrat-avenant.component.html',
  styleUrls: ['./consult-contrat-avenant.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ConsultContratAvenantComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<any>>;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;

  idContratAvenant: any;
  idHisContrat: any;
  dataSourcePack = new MatTableDataSource();
  dataSourcePrime: any;
  dataSourceTaxe: any;
  displayedColumnsPack: string[] = ['description', 'plafond', 'franchise', 'formule', 'prime'];
  displayedColumnsPrime: string[] = ['description', 'prime'];
  informationsAssure: any = []
  informationsSouscripteur: any = []
  informationsConducteur: any = []
  informationsContrat: any;
  informationsRisque: any;
  informationsPack: any = []
  informationsPrime: any = []
  categoriesRisque: any = []
  valeurVenale: number = 0
  multiRisque = false
  displayedColumnsRsInner: any = []
  displayedColumnsRs = ['description', 'more']
  packDescription:string= ""
  displayedColumnsCol: any = []
  dataSourceGroupes = new MatTableDataSource()
  idContrat = 0
  sousGarantieTab: any = []
  idGroupe: any
  expandedElement: any
  expandedElementPack: any
  idDevis: any
  datasParam: any;
  hisHistorique: any
  codeProduit:any
  constructor(private dialog: MatDialog, private devisService: DevisService, private genericService: GenericService, private cd: ChangeDetectorRef, private route: ActivatedRoute, private contratService: ContratService, private avenantService: AvenantService) { }

  ngOnInit(): void {
    this.getInfoProduit()
    this.idContratAvenant = this.route.snapshot.paramMap.get('idContratAvenant');
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit');

    this.getAvenantByContrat();
  }

  getAvenantByContrat() {
    this.avenantService.getAttributsAvenant(this.idContratAvenant).subscribe({
      next: (data: any) => {
        this.hisHistorique = data.idHisContrat
        this.getHistoriqueContrat(this.hisHistorique);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getHistoriqueContrat(idHisContrat: any) {
    this.contratService.getContratHistoriqueById(idHisContrat).subscribe({
      next: (datas: any) => {
        datas?.personnesList?.forEach((element: any) => {
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

              case 'CP240':
                if( datas.produit.codeProduit == "95" ||datas.produit.codeProduit == "96"){
                  this.informationsAssure = {
                    "typeClient": 'raisonSocial' in element.personne ? 'personne morale' : 'personne physique',
                    "raisonSocial": element.personne.raisonSocial,
                    "nom": element.personne.nom,
                    "prenom": element.personne.prenom1,
                    "email": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description,
                    "tel": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description,
                  }
                }
             
              break;

            default:
              break;
          }
        });

        this.informationsContrat = {
          "idContrat": datas.idContrat,
          "duree": datas.duree.description,
          "agence": datas.agence?.raisonSocial,
          "dateEffet": datas.dateEffet,
          "quittance": datas.quittanceList,
          "convention": datas.convention,
          "reduction": datas.reduction,
        }
        if (!this.multiRisque)
          this.consultRisque(datas.groupesList[0].risques[0].idRisque, datas.groupesList[0].idGroupe)
        if (this.multiRisque) {
          /*******************multirisque ************************/

          let rsTab: any = []
      
          const RisqueObject = datas.groupesList
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

          /*******************multirisque ************************/

        } else {
          this.contratService.getPackIdRisqueHistorique(this.hisHistorique, datas.groupesList[0].risques[0].idRisque).subscribe({
            next: async (dataPack: any) => {
              this.packDescription= dataPack?.pack?.description
              dataPack.garantieList?.map((garantie: any) => {
                
                let plafond = "-"
                let formule = "-"
                let franchise = "-"
                if ((garantie.prime && garantie.prime != "0.0") || datas?.produit?.codeProduit != "95") {
                  //exp categorie sous garantie 
                  garantie.sousGarantieList?.filter((sousGarantie: any) => {
                    let sousPlafond = "-"
                    let sousFormule = "-"
                    let sousFranchise = "-"
                    sousGarantie.categorieList.map((cateogrie: any) => {
                      if (cateogrie.code == "C15")
                        sousFranchise = cateogrie.valeur
                      else if (cateogrie.code == "C16") {
                        sousFormule = cateogrie.valeur
                      }
                      else if (cateogrie.code == "C7" ) {
                        if (cateogrie.valeur == '0') { cateogrie.valeur = this.valeurVenale }
                        sousPlafond = cateogrie.valeur
                      }
                    })
                    this.sousGarantieTab.push({
                      "idGarantie": sousGarantie.idGarantie,
                      "description": sousGarantie.description,
                      "prime": sousGarantie.prime,
                      "plafond": sousPlafond,
                      "formule": sousFormule,
                      "franchise": sousFranchise,

                    })
                  })

                  //exp categorie garantie 

                  garantie.categorieList.map((cateogrie: any) => {
                    if (cateogrie.code == "C15")
                      franchise = cateogrie.valeur
                    else if (cateogrie.code == "C16") {
                      formule = cateogrie.valeur
                    }
                    else if (cateogrie.code == "C7" ) {
                      if (cateogrie.valeur == '0') { cateogrie.valeur = this.valeurVenale }
                      plafond = cateogrie.valeur
                    }
                  })
                  this.informationsPack.push({
                    "idGarantie": garantie.idGarantie,
                    "description": garantie.description,
                    "prime": garantie.prime,
                    "plafond": plafond,
                    "formule": formule,
                    "franchise": franchise,
                    "sousGarantieList": new MatTableDataSource(this.sousGarantieTab)

                  })
   
                }
                this.sousGarantieTab = []
              })
              this.dataSourcePack = new MatTableDataSource(this.informationsPack)
              this.dataSourcePack = new MatTableDataSource(this.informationsPack)
            },
            error: (error: any) => {
              console.log(error);
            }
          });
        }



        // type risque
        // this.informationsRisque = datas.risqueList.reduce((x: any, y: any) => {
        //   y.paramRisque.codeParam == "P40" ? this.valeurVenale = y.valeur : "";
        //   (x[y.paramRisque.categorieParamRisque.description] = x[y.paramRisque.categorieParamRisque.description] || []).push(y);

        //   return x;

        // }, {});


        // this.informationsRisque = Object.values(this.informationsRisque)
        // datas.paramContratList?.map((garantie: any) => {
        //   let plafond = "/"
        //   let formule = "/"
        //   let franchise = "/"
        //   garantie.categorieList.map((cateogrie: any) => {
        //     if (cateogrie.idCategorie == 18)
        //       franchise = cateogrie.valeur
        //     else if (cateogrie.idCategorie == 19) {
        //       formule = cateogrie.valeur
        //     }
        //     else if (cateogrie.idCategorie == 29 || cateogrie.idCategorie == 7) {
        //       if (cateogrie.valeur == '0') { cateogrie.valeur = this.valeurVenale }
        //       plafond = cateogrie.valeur
        //     }
        //   })
        //   this.informationsPack.push({
        //     "idGarantie": garantie.idGarantie,
        //     "description": garantie.description,
        //     "prime": Number(garantie.primeProrata).toFixed(2),
        //     "plafond": plafond,
        //     "formule": formule,
        //     "franchise": franchise,
        //   })
        // })
        // this.dataSourcePack = new MatTableDataSource(this.informationsPack)

        // this.dataSourcePack = new MatTableDataSource(this.informationsPack)

        this.dataSourcePrime = datas.primeList
        this.dataSourceTaxe = datas.taxeList
      },
      error: (error: any) => {
        console.log(error);
      }
    });
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

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  consultRisque(idRisque: any, idGroupe: any) {
    //EXP call get param risque by devis, groupe & id risque
    this.contratService.getParamContratByIdRisqueHisto(this.hisHistorique, idGroupe, idRisque).subscribe({
      next: (dataParam: any) => {
        this.datasParam = dataParam
        if (!this.multiRisque) {


          this.informationsRisque = this.datasParam.reduce((x: any, y: any) => {
            y?.codeParam == "P40" ? this.valeurVenale = y.valeur : "";
            (x[y.categorieParamRisque] = x[y.categorieParamRisque] || []).push(y);

            return x;

          }, {});


          this.informationsRisque = Object.values(this.informationsRisque)

          // this.getWilaya()
        }

        //EXP call get pack/garanties risque by devis, groupe & id risque
        this.contratService.getPackIdRisqueHistorique(this.hisHistorique, idRisque).subscribe({
          next: (dataPack: any) => {
            if (this.multiRisque) {
              this.openDialog(dataParam, dataPack)
            }

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
}
