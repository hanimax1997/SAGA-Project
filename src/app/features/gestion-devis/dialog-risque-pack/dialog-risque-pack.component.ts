
import { Component } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dialog-risque-pack',
  templateUrl: './dialog-risque-pack.component.html',
  styleUrls: ['./dialog-risque-pack.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DialogRisquePackComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  risqueInfo = this.data.paramRisque
  expandedElement: any
  dataSourcePack: any
  displayedColumnsPack: string[] = ['description', 'plafond', 'franchise', 'formule', 'prime'];
  informationsGaranties: any = []
  namePack:string=this.data.pack.pack.description
  ngOnInit(): void {
    this.risqueInfo = this.divideObject(this.risqueInfo)  
    console.log("this.risqueInfo", this.risqueInfo);
    console.log("this.data", this.data);
    this.data.pack.garantieList.map((garantie: any) => {
      let plafond = "-"
      let formule = "-"
      let franchise = "-"
      // //exp categorie sous garantie 
      // garantie.sousGarantieList?.filter((sousGarantie: any) => {
      //   let sousPlafond = "-"
      //   let sousFormule = "-"
      //   let sousFranchise = "-"
      //   sousGarantie.categorieList.map((cateogrie: any) => {
      //     if (cateogrie.idCategorie == 18)
      //       sousFranchise = cateogrie.valeur
      //     else if (cateogrie.idCategorie == 19) {
      //       sousFormule = cateogrie.valeur
      //     }
      //     else if (cateogrie.idCategorie == 29 || cateogrie.idCategorie == 7) {
      //       if (cateogrie.valeur == '0') { cateogrie.valeur = this.valeurVenale }
      //       sousPlafond = cateogrie.valeur
      //     }
      //   })
      //   this.sousGarantieTab.push({
      //     "idGarantie": sousGarantie.idGarantie,
      //     "description": sousGarantie.description,
      //     "prime": sousGarantie.prime,
      //     "plafond": sousPlafond,
      //     "formule": sousFormule,
      //     "franchise": sousFranchise,

      //   })
      // })

      //exp categorie garantie 
      //
      garantie.categorieList.map((cateogrie: any) => {
        if (cateogrie.code == "C15")
          franchise = cateogrie.valeur
        else if (cateogrie.code == "C16") {
          formule = garantie.codeGarantie == "G11" ? this.risqueInfo[1].find((risque: any) => risque.codeRisque == "P320")?.reponse?.idParamReponse?.description : cateogrie.valeur
        }
        else if (cateogrie.code == "C7" ) {

          plafond = cateogrie.valeur
        }
      })
      this.informationsGaranties.push({
        "idGarantie": garantie.idGarantie,
        "description": garantie.description,
        "prime": garantie.prime,
        "plafond": plafond,
        "formule": formule,
        "franchise": franchise

      })

    })
    this.dataSourcePack = new MatTableDataSource(this.informationsGaranties)
  }
  divideObject(obj: any) {
    const midpoint = Math.floor(obj.length / 2);
    const RisqueInfo1 = obj.slice(0, midpoint);
    const RisqueInfo2 = obj.slice(midpoint);
  
    return [RisqueInfo1, RisqueInfo2];
  }
}
