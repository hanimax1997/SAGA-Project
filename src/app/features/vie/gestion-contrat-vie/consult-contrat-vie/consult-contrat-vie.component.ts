import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DevisService } from 'src/app/core/services/devis.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratService } from 'src/app/core/services/contrat.service';
import { GenericService } from 'src/app/core/services/generic.service';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';

import { MatDialog } from '@angular/material/dialog';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import Swal from 'sweetalert2';
import { DialogRisquePackComponent } from 'src/app/features/gestion-devis/dialog-risque-pack/dialog-risque-pack.component';

@Component({
  selector: 'app-consult-contrat-vie',
  templateUrl: './consult-contrat-vie.component.html',
  styleUrls: ['./consult-contrat-vie.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ConsultContratVieComponent {
  constructor(private router: Router, private authentificationService: AuthentificationService, private dialog: MatDialog, private cd: ChangeDetectorRef, private genericService: GenericService, private route: ActivatedRoute, private devisService: DevisService, private contratService: ContratService) { }
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<any>>;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  datasParam: any;
  dataSourcePack = new MatTableDataSource();
  dataSourcePrime: any;
  dataSourceTaxe: any;
  displayedColumnsPack: string[] = ['description', 'plafond', 'franchise', 'formule', 'prime', 'sousGarantie'];
  displayedColumnsPackSousGarantie: string[] = ['description', 'plafond', 'franchise', 'formule', "prime", "empty1", "empty2"];
  displayedColumnsPrime: string[] = ['description', 'prime'];
  informationsAssure: any = []
  informationsSouscripteur: any = []
  informationsConducteur: any = []
  informationsContrat: any = []
  informationsRisque: any;
  informationsPack: any = []
  informationsPrime: any = []
  categoriesRisque: any = []
  displayedColumnsRs = ['description', 'more']
  displayedColumnsRsInner: any = []
  displayedColumnsCol: any = []
  dataSourceGroupes = new MatTableDataSource()
  res: any = []
  expandedElement: any
  expandedElementPack: any
  idContrat: any
  valeurVenale: number = 0
  idGroupe: any
  multiRisque = false
  idDevis: any
  auditUser: any
  sousGarantieTab: any = []
  contrat: any
  produit: any

  ngOnInit(): void {
    this.idContrat = this.route.snapshot.paramMap.get('idContrat');
    this.produit = this.route.snapshot.paramMap.get('nomProduit');
    this.getInfoProduit()
    this.contratService.getContratById(this.idContrat).subscribe({
      next: (datas: any) => {
        this.contrat = datas
        
        this.getUserById(datas.auditUser)
        datas?.personnesList.forEach((element: any) => {
          
          //switch (element?.personne?.role?.code) {
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
                "typeClient": datas?.typeClient?.description,
                "raisonSocial": element.personne.raisonSocial,
                "nom": element.personne.nom,
                "prenom": element.personne.prenom1,
                "email": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description,
                "tel": element.personne.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description,
              }
              break;

            case 'CP236':
              console.log("here")
              this.informationsAssure = {
                "typeClient": datas?.typeClient.description,
                "raisonSocial": element?.personne.raisonSocial,
                "nom": element?.personne.nom,
                "prenom": element?.personne.prenom1,
                "email": element?.personne.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description,
                "tel": element?.personne.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description,
              }

              this.informationsSouscripteur = {
                "raisonSocial": element.personne?.raisonSocial,
                "nom": element.personne?.nom,
                "prenom": element.personne.prenom1,
                "email": element.personne?.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description,
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
                "typeClient": datas.typeClient.description,
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

        if(datas?.canal?.code == "DV") {
          this.informationsSouscripteur = {
            "raisonSocial": "",
            "nom": datas.userResponse?.nom,
            "prenom": datas.userResponse?.prenom,
            "email": datas.userResponse?.email,
            "tel": datas.userResponse?.telephone,
          }
        }

        

        this.idDevis = datas.idDevis
        this.informationsContrat = {
          "duree": datas.duree.description,
          "agence": datas.agence?.raisonSocial,
          "dateEffet": datas.dateEffet,
          "dateExpiration": datas.dateExpiration,
          "statut": datas.statue.description,
          "quittance": datas.quittanceList,
          "pack": datas.groupeList[0]?.pack?.description,
          "reduction": datas.descriptionReduction,
          "convention": datas.descriptionConvention,
        }
        if (datas.groupeList.length != 0) {


          if (!this.multiRisque)
            this.consultRisque(datas.groupeList[0].risques[0].idRisque, datas.groupeList[0].idGroupe)
          if (this.multiRisque) {
            /*******************multirisque ************************/

            let rsTab: any = []
            const RisqueObject = datas.groupeList
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
          }
          else {
            this.contratService.getPackIdRisque(this.idContrat, datas.groupeList[0].risques[0].idRisque).subscribe({
              next: async (dataPack: any) => {
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
                        else if (cateogrie.code == "C7") {
                          if (cateogrie.valeur == '0') { cateogrie.valeur = this.valeurVenale }
                          sousPlafond = cateogrie.valeur
                        }
                      })
                      this.sousGarantieTab.push({
                        "idGarantie": sousGarantie.idGarantie,
                        "description": sousGarantie.description,
                        "prime": sousGarantie.prime,
                        "plafond": sousPlafond != "-" ? Number(sousPlafond).toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : sousPlafond,
                        "formule": sousFormule != "-" ? Number(sousFormule).toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : sousFormule,
                        "franchise": sousFranchise != "-" ? Number(sousFranchise).toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : sousFranchise,

                      })
                    })

                    //exp categorie garantie 

                    garantie.categorieList.map((cateogrie: any) => {
                      if (cateogrie.code == "C15")
                        franchise = cateogrie.valeur
                      else if (cateogrie.code == "C16") {
                        formule = cateogrie.valeur
                      }
                      else if (cateogrie.code == "C7") {
                        if (cateogrie.valeur == '0') { cateogrie.valeur = this.valeurVenale }
                        plafond = cateogrie.valeur
                      }
                    })
                    this.informationsPack.push({
                      "idGarantie": garantie.idGarantie,
                      "description": garantie.description,
                      "prime": garantie.prime,
                      "plafond": plafond != "-" ? Number(plafond).toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : plafond,
                      "formule": formule != "-" ? Number(formule).toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : formule,
                      "franchise": franchise != "-" ? Number(franchise).toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : franchise,
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
        } else {
          Swal.fire({
            title: "Erreur lors de la lecture du contrat",
            icon: 'info',
            allowOutsideClick: false,
            confirmButtonText: `Ok`,
            width: 600
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/']);
            }
          })
        }
        this.dataSourcePrime = datas.primeList
        this.dataSourceTaxe = datas.taxeList

      }

      ,
      error: (error: any) => {
        console.log(error);
      }
    });

  }

  getUserById(userId: any) {
    this.authentificationService.getByUserId(userId).subscribe({
      next: (data: any) => {
        this.auditUser = data.nom + " " + data.prenom
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
    this.contratService.getParamContratByIdRisque(this.idContrat, idGroupe, idRisque).subscribe({
      next: (dataParam: any) => {
        this.datasParam = dataParam
        if (!this.multiRisque) {


          this.informationsRisque = this.datasParam.reduce((x: any, y: any) => {
            y?.codeParam == "P40" ? this.valeurVenale = y.valeur : "";
            (x[y.categorieParamRisque] = x[y.categorieParamRisque] || []).push(y);

            return x;

          }, {});


          this.informationsRisque = Object.values(this.informationsRisque)
          console.log(this.informationsRisque)
          // this.getWilaya()
        }
        if (this.multiRisque) {
          //EXP call get pack/garanties risque by devis, groupe & id risque
          this.contratService.getPackIdRisque(this.idContrat, idRisque).subscribe({
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
}
