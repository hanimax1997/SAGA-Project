import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AvenantService } from 'src/app/core/services/avenant.service';
import { ContratService } from 'src/app/core/services/contrat.service';
import { SoumettreAvenantVieComponent } from './soumettre-avenant-vie/soumettre-avenant-vie.component';
import { PackService } from 'src/app/core/services/pack.service';
import { DevisService } from 'src/app/core/services/devis.service';

import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-gestion-avenant-vie',
  templateUrl: './gestion-avenant-vie.component.html',
  styleUrls: ['./gestion-avenant-vie.component.scss']
})
export class GestionAvenantVieComponent {
  displayedColumns: string[] = ['id', 'typeAvenant', 'dateAvenant', 'statut', 'action'];
  dataSource: MatTableDataSource<any>;
  idContrat: any;
  contrat: any;
  avenant: any;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private route: ActivatedRoute, private packService: PackService, private devisService: DevisService, public dialog: MatDialog, private avenantService: AvenantService, private contratService: ContratService, private router: Router) {

  }

  ngOnInit(): void {
    this.idContrat = this.route.snapshot.paramMap.get('idContrat');

    this.getContratById();
    this.getAvenantByContrat();
  }

  getContratById() {
    this.contratService.getContratById(this.idContrat).subscribe({
      next: (datas: any) => {
        this.contrat = datas
      },
      error: (error: any) => {

        console.log(error);

      }
    });
  }

  getAvenantByContrat() {
    this.avenantService.getAvenantByContrat(this.idContrat).subscribe({
      next: (data: any) => {

        this.dataSource = new MatTableDataSource(data)
     
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  consulterAvenant(idContratAvenant: any) {
  
    this.router.navigate(['consultation-avenant/vie/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + idContratAvenant]);
  }

  consultContratAvenant(idContratAvenant: any) {
    this.router.navigate(['consultation-contrat-avenant/vie/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + idContratAvenant]);
  }

  consultQuittance(idQuittance: any) {
    this.router.navigate(['consultation-quittance/vie/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + idQuittance]);
  }

  outputAvenant(avenant: any,index:number) {

    let codeProduit : any;
    codeProduit = this.route.snapshot.paramMap.get('codeProduit')
    let risqueListVehicule : any=[];
    let idRisques : any=[];
    let dataParam : any=[];

    switch (codeProduit) {
      default:
        this.avenantService.getAttributsAvenant(avenant.idContratAvenant).subscribe({
          next: (typeAvenant: any) => {
            this.contratService.getContratHistoriqueById(avenant.hisContrat).subscribe({
              next: (hisContrat: any) => { 
                console.log("hisContrat 10", hisContrat);
                this.contratService.getParamContratByIdRisqueHisto(hisContrat.idHistorique,  hisContrat.groupesList?.[0]?.idGroupe, hisContrat?.groupesList?.[0]?.risques?.[0]?.idRisque).subscribe({
                  next: async (dataParam: any) => {
                      hisContrat.risqueList =  Object.values(dataParam)
                      let primeListRisques: any[]=[];
                     
                      for (const risq of hisContrat?.groupesList?.[0]?.risques || []) {
                        try {
                            const dataPack: any = await this.contratService.getPackIdRisqueHistorique(hisContrat?.idHistorique, risq.idRisque).toPromise();
                    
                            dataPack?.primeList?.forEach((element: any) => {
                              
                                if (element?.typePrime?.code === "CP101") {
                                    primeListRisques.push({prime:element?.primeProrata,id:risq?.idRisque});
                                }
                            });
            
                    
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    this.contratService.getPaysList().subscribe({
                      next: async (pays: any) => {
                        console.log("payy",hisContrat)
                        hisContrat.isShengen= pays.find((pay:any)=>pay.idPays==hisContrat?.risqueList?.find((el:any)=>el?.codeRisque==="P182")?.reponse?.valeur)?.isShengen
                      },
                      error: (error) => {
                        console.log(error);
                      }
                    })
                      hisContrat.primeListRisques = primeListRisques;
                       //EXP call get pack/garanties risque by devis, groupe & id risque
                       await this.contratService.getPackIdRisqueHistorique(hisContrat.idHistorique, hisContrat.groupesList[0].risques[0].idRisque).subscribe({
                        next: async (dataPack: any) => {   
                  
                        hisContrat.paramContratList = dataPack.garantieList
                        hisContrat.pack = dataPack.pack
                        this.contratService.getQuittanceById(avenant.idQuittance).subscribe({
                           next: (quittance: any) => {                             
                            if(index==0){
                              this.outputAffaireNouvelle()
                            }else{
                              avenant.cp ?   this.avenantService.outputAvenant(hisContrat, typeAvenant, quittance,index) : ''
                            }
                              avenant.quittance ?  this.contratService.outputQuittance(hisContrat, quittance, typeAvenant) : '' 
                              avenant.attestation ? this.contratService.outputAttestation(hisContrat, quittance, typeAvenant) : ''  
                           
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
                    
                },
                error: (error: any) => {
                  console.log(error);
                }
              });
              
              
              },
              error: (error: any) => {
                console.log(error);
              }
            });
          },
          error: (error: any) => {
            console.log(error);
          }
        });
      break;

    }
    
  }

  outputAffaireNouvelle(){
    this.contratService.getParamContratByIdRisque(this.contrat.idContrat, this?.contrat?.groupeList?.[0]?.idGroupe, this.contrat?.groupeList?.[0]?.risques?.[0]?.idRisque).subscribe({
      next: async (dataParam: any) => {
        this.contrat.risqueList = await Object.values(dataParam)
        let primeListRisques: any[]=[];
      let garantiePlafond :any={};
      for (const risq of this.contrat?.groupeList?.[0]?.risques || []) {
        try {
            const dataPack: any = await this.contratService.getPackIdRisque(this.contrat.idContrat, risq.idRisque).toPromise();
    
            dataPack?.primeList?.forEach((element: any) => {
                if (element?.typePrime?.code === "CP101") {
                    primeListRisques.push({prime:element?.prime,id:risq?.idRisque});
                }
            });
            dataPack.garantieList.forEach((element:any)=>{
              if(element?.codeGarantie !== "G44"){
                garantiePlafond[element?.description]=element?.categorieList?.[0]?.valeur;
              }
            })
    
        } catch (error) {
            console.log(error);
        }
    }
    this.contratService.getPaysList().subscribe({
      next: async (pays: any) => {
        console.log("pays",pays.find((pay:any)=>pay.idPays==this.contrat?.risqueList?.find((el:any)=>el?.codeRisque==="P182")?.reponse?.valeur))
        this.contrat.isShengen= pays.find((pay:any)=>pay.idPays==this.contrat?.risqueList?.find((el:any)=>el?.codeRisque==="P182")?.reponse?.valeur)?.isShengen
      },
      error: (error) => {
        console.log(error);
      }
    })
      this.contrat.primeListRisques = primeListRisques;
      this.contrat.garantiePlafond = garantiePlafond;
        //EXP call get pack/garanties risque by devis, groupe & id risque
        await this.contratService.getPackIdRisque(this.contrat.idContrat, this.contrat?.groupeList?.[0]?.risques?.[0]?.idRisque).subscribe({
          next: async (dataPack: any) => {

            this.contrat.paramContratList = dataPack.garantieList
            this.contrat.pack = dataPack.pack

            const apiCalls = this.contrat?.groupeList.map((group: any) => 
            
                              this.packService.getPackById(group.pack.idPack0)
            
                          );
            
                          
            
                          forkJoin(apiCalls).subscribe(async(responses:any) => {
            
                            let garantiesGAV = [
                              { title: "Décès accidentel (*)", garantieIndex: 0 },
                              { title: "Incapacité Permanente Totale / Partielle (*)", garantieIndex: 1 },
                              { title: "Frais d’hospitalisation, médicaux et pharmaceutiques", garantieIndex: 2 },
                              { title: "Bris de lunettes en cas d’accident", garantieIndex: 3 },
                              { title: "Prothèse dentaire en cas d’accident", garantieIndex: 4 },
                              { title: "Assistance", garantieIndex: 4 },
                          ]
                            const gavGarantieTable = garantiesGAV.map(({ title, garantieIndex }) => this.devisService.gavRows(responses, garantieIndex, title));
                            this.contrat.gavGarantieTable=gavGarantieTable
                            
            console.log("contract: ",this.contrat)
            await this.contratService.outputContrat(this.contrat)
          })
            
          },
          error: (error: any) => {
            console.log(error);
          }
        });

      },
      error: (error: any) => {
        console.log(error);
      }
    });
  
  }

  openDialogAdd() {
    let getTypeAvenant = {
      idProduit: this.dataSource.data[0].idProduit,
      idAvenantPrecedent: this.dataSource.data[this.dataSource.data.length - 1].idTypeAvenant,
      statut: this.dataSource.data[this.dataSource.data.length - 1].statut.idParam
    }
    this.avenantService.getTypeAvenantbyAvenantPrecedent(getTypeAvenant).subscribe({
      next: (data: any) => {
        const dialogRef = this.dialog.open(SoumettreAvenantVieComponent, {
          width: '40%',
          data: {
            types_avenant: data,
            idContrat: this.idContrat,
            dateExpiration: this.contrat.dateExpiration,
            codeProduit: this.route.snapshot.paramMap.get('codeProduit')
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.getAvenantByContrat();
        });
      },
      error: (error) => {
        console.log(error);
      }
    });

  }

  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
