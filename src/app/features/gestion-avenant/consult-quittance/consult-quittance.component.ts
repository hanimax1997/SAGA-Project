import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratService } from 'src/app/core/services/contrat.service';
import { GenericService } from 'src/app/core/services/generic.service';
@Component({
  selector: 'app-consult-quittance',
  templateUrl: './consult-quittance.component.html',
  styleUrls: ['./consult-quittance.component.scss']
})
export class ConsultQuittanceComponent {
  idQuittance: any;
  quittance: any;
  dataSourcePack = new MatTableDataSource();
  dataSourcePrime: any;
  dataSourceTaxe: any;
  displayedColumnsPack: string[] = ['description', 'plafond', 'franchise', 'formule', 'prime'];
  displayedColumnsPrime: string[] = ['description', 'prime'];
  informationsPack: any = []
  tabRisquesPack: any = []
  codeProduit: any = []
  multiRisque = false
  constructor(private genericService: GenericService, private route: ActivatedRoute, private contratService: ContratService, private router: Router) { }

  ngOnInit(): void {
    this.getInfoProduit()
    this.idQuittance = this.route.snapshot.paramMap.get('idQuittance');
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit');
    this.getQuittance();
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
  getQuittance() {
    this.contratService.getQuittanceById(this.idQuittance).subscribe({
      next: (data: any) => {
        this.quittance = data

        if (!this.multiRisque) {
          data.risqueList[0]?.garantieList.map((garantie: any) => {
            let plafond = "/"
            let formule = "/"
            let franchise = "/"
            garantie.categorieList.map((cateogrie: any) => {
              if (cateogrie.code == "C15")
                franchise = cateogrie.valeur
              else if (cateogrie.code == "C16") {
                formule = cateogrie.valeur
              }
              else if (cateogrie.code == "C7") {
                plafond = cateogrie.valeur
              }
            })
            this.informationsPack.push({
              "idGarantie": garantie.idGarantie,
              "description": garantie.description,
              "prime": Number(garantie.primeProrata).toFixed(2),
              "plafond": plafond,
              "formule": formule,
              "franchise": franchise,
            })
          })
        //  this.dataSourcePack = new MatTableDataSource(this.informationsPack)
          this.tabRisquesPack.push({"idRisque":data?.risqueList[0]?.risque,"garanties":new MatTableDataSource(this.informationsPack)})

        }else{
          data.risqueList.map((rs:any)=>{
            rs.garantieList.map((garantie: any) => {
              let plafond = "/"
              let formule = "/"
              let franchise = "/"
              garantie.categorieList.map((cateogrie: any) => {
                if (cateogrie.code == "C15")
                  franchise = cateogrie.valeur
                else if (cateogrie.code == "C16") {
                  formule = cateogrie.valeur
                }
                else if (cateogrie.code == "C7") {
                  plafond = cateogrie.valeur
                }
              })
              this.informationsPack.push({
                "idGarantie": garantie.idGarantie,
                "description": garantie.description,
                "prime": Number(garantie.primeProrata).toFixed(2),
                "plafond": plafond,
                "formule": formule,
                "franchise": franchise,
              })
            })
            this.tabRisquesPack.push({"idRisque":rs.risque,"garanties":new MatTableDataSource(this.informationsPack)})

          })

        }
        this.dataSourcePrime = data.primeList
        this.dataSourceTaxe = data.taxeList
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
