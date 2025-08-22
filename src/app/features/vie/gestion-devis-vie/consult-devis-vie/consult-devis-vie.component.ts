import { Component, OnInit, QueryList, ViewChildren, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DevisService } from 'src/app/core/services/devis.service';
import { ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/core/services/generic.service';
import { MatSort } from '@angular/material/sort';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { DialogRisquePackComponent } from 'src/app/features/gestion-devis/dialog-risque-pack/dialog-risque-pack.component';

@Component({
  selector: 'app-consult-devis-vie',
  templateUrl: './consult-devis-vie.component.html',
  styleUrls: ['./consult-devis-vie.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class ConsultDevisVieComponent implements OnInit {
  wilayas: any;
  risqueWilayaId: any;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<any>>;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  idGroupe: any;
  datasParam: any;


  constructor(private authentificationService: AuthentificationService ,private dialog: MatDialog, private cd: ChangeDetectorRef, private genericService: GenericService, private router: Router, private route: ActivatedRoute, private devisService: DevisService) { }
  dataSourcePack = new MatTableDataSource();
  dataSourcePrime = new MatTableDataSource()
  dataSourceGroupes = new MatTableDataSource()
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  displayedColumnsPack: string[] = ['description', 'plafond', 'franchise', 'formule', 'prime', 'sousGarantie'];
  displayedColumnsPackSousGarantie: string[] = ['description', 'plafond', 'franchise', 'formule', "prime", "empty1", "empty2"];
  displayedColumnsPrime: string[] = ['description', 'prime'];
  informationsAssure: any = []
  informationsContrat: any = []
  informationsRisque: any;
  informationsPack: any = []
  informationsPrime: any = []
  categoriesRisque: any = []
  sousGarantieTab: any = []
  primeListe: any = []
  taxeListe: any = []
  displayedColumnsRs = ['description','pack',  'more']
  displayedColumnsRsInner: any = []
  displayedColumnsCol: any = []
  expandedElement: any
  expandedElementPack: any
  res: any = []
  idDevis: any
  auditUser: any
  packName: string
  valeurVenale: number = 0
  multiRisque = false

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

  ngOnInit(): void {
    this.idDevis = this.route.snapshot.paramMap.get('idDevis');
    this.getInfoProduit()
    this.devisService.getDevisById(this.idDevis).subscribe({
      next: (datas: any) => {
        console.log("datas ___ devis")
        console.log(datas)
        this.getUserById(datas.auditUser)
        if(!this.multiRisque)
        this.consultRisque(datas.groupes[0].risques[0].idRisque, datas.groupes[0].idGroupe)
        this.informationsAssure = {
          "typeClient": datas.typeClient.description,
          "raisonSocial": datas.raisonSocial,
          "nom": datas.nom,
          "prenom": datas.prenom,
          "email": datas.email,
          "tel": datas.telephone,
        }
        this.informationsContrat = {
          "dateDebut": datas.datedebut ? datas.datedebut : null,
          "dateFin": datas.dateExpiration,
          "agence": datas.agence?.raisonSocial,
          "reduction": datas.reduction?.nomReduction,
          "convention": datas.reduction?.codeConvention?.nomConvention,
        }
        this.packName=datas?.groupes[0]?.pack.description
        if (this.multiRisque) {
          /*******************multirisque ************************/

          let rsTab: any = []
          const RisqueObject = datas.groupes
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
          //  this.packName = datas.pack.description

          this.devisService.getPackIdRisque(this.idDevis, datas.groupes[0].risques[0].idRisque).subscribe({
            next: async (dataPack: any) => {
              dataPack.garantieList.map((garantie: any) => {
                let plafond = "-"
                let formule = "-"
                let franchise = "-"
                if((garantie.prime && garantie.prime != "0") || datas?.produit?.codeProduit != "95")
                {
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
                      "plafond": sousPlafond != "-" ? Number(sousPlafond).toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }):sousPlafond,
                      "formule": sousFormule != "-" ? Number(sousFormule).toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }):sousFormule,
                      "franchise": sousFranchise != "-" ? Number(sousFranchise).toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }):sousFranchise,
      
                    })
                  })
      
                  //exp categorie garantie 
      
                  garantie.categorieList.map((cateogrie: any) => {
                    if (cateogrie.code == "C15")
                      franchise = cateogrie.valeur
                    else if (cateogrie.code == "C16") {
                      formule = cateogrie.valeur
                    }
                    else if (cateogrie.code == 'C7' ) {
                      if (cateogrie.valeur == '0') { cateogrie.valeur = this.valeurVenale }
                      plafond = cateogrie.valeur
                    }
                  })
                  this.informationsPack.push({
                    "idGarantie": garantie.idGarantie,
                    "description": garantie.description,
                    "prime": garantie.prime,
                    "plafond": plafond != "-" ? Number(plafond).toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }):plafond,
                    "formule": formule != "-" ? Number(formule).toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }):formule,
                    "franchise": franchise != "-" ? Number(franchise).toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }):franchise,
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


        this.primeListe = datas.primeList
        this.taxeListe = datas.taxeList
      }

      ,
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
  goBack() {

    this.router.navigate(['consultation/vie/', this.route.snapshot.paramMap.get('codeProduit'), this.route.snapshot.paramMap.get('nomProduit')]);

  }
  getWilaya() {
    this.genericService.getAllWilayas(1).subscribe({
      next: (data: any) => {
        this.wilayas = data
       
        this.informationsRisque.map((risque: any) => {
          risque.map((rs: any) => {

            if (rs.codeRisque == "P125" || rs.codeRisque == 'P56') {
              this.risqueWilayaId = rs.reponse.valeur
              rs.reponse.valeur = this.wilayas.filter(((wilaya: any) => wilaya.idWilaya == rs.reponse.valeur))[0].description
            } else if (rs.codeRisque == "P126") {
              this.genericService.getAllCommuneByWilaya(this.risqueWilayaId).subscribe({
                next: (data: any) => {
                  rs.reponse.valeur = data.filter(((commune: any) => commune.idCommune == rs.reponse.valeur))[0].description
                 
                },
                error: (error) => {
                  console.log(error);
                }
              });

            }
          })
          
        

        })
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  consultRisque(idRisque: any, idGroupe: any) {

  
    //EXP call get param risque by devis, groupe & id risque
    this.devisService.getParamDevisByIdRisque(this.idDevis, idGroupe, idRisque).subscribe({
      next: (dataParam: any) => {
        this.datasParam = dataParam

        if (!this.multiRisque) {
       
          this.informationsRisque = this.datasParam.reduce((x: any, y: any) => {
            y?.codeParam == "P40" ? this.valeurVenale = y.valeur : "";
            (x[y.categorieParamRisque] = x[y.categorieParamRisque] || []).push(y);

            return x;

          }, {});


          this.informationsRisque = Object.values(this.informationsRisque)
          this.getWilaya()
        }
        if (this.multiRisque) {
        
          //EXP call get pack/garanties risque by devis, groupe & id risque
          this.devisService.getPackIdRisque(this.idDevis, idRisque).subscribe({
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


