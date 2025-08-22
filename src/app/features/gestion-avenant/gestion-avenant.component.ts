import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AvenantService } from 'src/app/core/services/avenant.service';
import { ContratService } from 'src/app/core/services/contrat.service';
import { SoumettreAvenantComponent } from './soumettre-avenant/soumettre-avenant.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-gestion-avenant',
  templateUrl: './gestion-avenant.component.html',
  styleUrls: ['./gestion-avenant.component.scss']
})
export class GestionAvenantComponent {
  displayedColumns: string[] = ['id', 'typeAvenant', 'dateAvenant', 'statut', 'action'];
  dataSource: MatTableDataSource<any>;
  idContrat: any;
  contrat: any;
  avenant: any;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private avenantService: AvenantService, private contratService: ContratService, private router: Router) {

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
  
    this.router.navigate(['consultation-avenant/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + idContratAvenant]);
  }

  consultContratAvenant(idContratAvenant: any) {
    this.router.navigate(['consultation-contrat-avenant/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + idContratAvenant]);
  }

  consultQuittance(idQuittance: any) {
    this.router.navigate(['consultation-quittance/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + idQuittance]);
  }

  outputAvenant(avenant: any) {

    let codeProduit : any;
    codeProduit = this.route.snapshot.paramMap.get('codeProduit')
    let risqueListVehicule : any=[];
    let idRisques : any=[];
    let dataParam : any=[];

    switch (codeProduit) {

      case "45F": 
      
      
        this.avenantService.getAttributsAvenant(avenant.idContratAvenant).subscribe({
          next: (typeAvenant: any) => {
            this.contratService.getContratHistoriqueById(avenant.hisContrat).subscribe({
              next: (hisContrat: any) => {
                
                let numMouv : any;                
                hisContrat.nmouvement>1 ? numMouv =hisContrat.nmouvement-1 :numMouv =hisContrat.nmouvement

                this.avenantService.getContratPrev(hisContrat?.idContrat,numMouv).subscribe({
                  next: (hisContratPrev: any) => {

                    if(typeAvenant?.typeAvenant?.code == "A12"  ) {
                    
                     risqueListVehicule = hisContratPrev?.groupesList?.filter((groupe:any) => groupe?.risques)               
                     risqueListVehicule?.forEach((groupe: any) => {          
                         if (groupe?.risques) {   
                           groupe?.risques?.map((risque: any) => {                 
                             idRisques.push(risque?.idRisque);
                         }); 
                         }                      
                     });   
                    }else{
                     typeAvenant?.risqueList?.filter((risque:any) => {                  
                       idRisques.push(risque?.idRisque);
                     })
                    }
                    this.contratService.getQuittanceById(avenant?.idQuittance).subscribe({
                      next: (quittance: any) => {
                         //Get pack                          
                         this.contratService.getParamContratFlotteByIdRisque(hisContrat?.idContrat, idRisques).subscribe({              
                          next: async (dataParam: any) => {  
                            typeAvenant.dateExpirationAvenant = avenant.dateExpirationAvenant  
                             switch (typeAvenant.typeAvenant.code) {
                              case  "A12" :
                                this.contratService.outputContratFlotte(hisContratPrev, dataParam) 
                                this.contratService.outputQuittance(hisContratPrev, quittance, typeAvenant) 
                                this.contratService.outputAttestationFlotte(hisContratPrev,typeAvenant)
                              break;   
                              case  "A20" :
                                this.avenantService.outputAvenantFlotte(hisContrat, typeAvenant, quittance, dataParam, hisContratPrev)
                                this.contratService.outputAttestationFlotte(hisContrat,typeAvenant)
                                this.contratService.outputQuittance(hisContrat, quittance, typeAvenant)
                              break;   
                              case  "A11" :
                                typeAvenant.typeAvenant.attestation ?this.contratService.outputAttestationFlotte(hisContrat,typeAvenant) :''
                                typeAvenant.typeAvenant.quittance ?this.contratService.outputQuittance(hisContrat, quittance, typeAvenant) :''
                              break;   
                              default:
                                typeAvenant.typeAvenant.cp ?  this.avenantService.outputAvenantFlotte(hisContrat, typeAvenant, quittance, dataParam ,hisContratPrev) : ''
                                typeAvenant.typeAvenant.attestation ?this.contratService.outputAttestationFlotte(hisContrat,typeAvenant) :''
                                typeAvenant.typeAvenant.quittance ?this.contratService.outputQuittance(hisContrat, quittance, typeAvenant) :''
                              break; 
                              }

                              
                            
                            },
                            error: (error: any) => {
                              console.log(error);                    
                            
                            }  
                          }); 
                     
                      
                      }, error: (error) => {
                        console.log(error);
                      }
                    });

                
            /*        if(typeAvenant.typeAvenant.code == "A19" )
                    this.contratService.getPackIdRisqueHistorique(hisContratPrev.idHistorique, idRisques).subscribe({              
                      next: async (data: any) => {  
                        dataParam = data
                        //////////console.log("dataParam Avenant retrait-----")
                        console.log(dataParam)
                      },
                      error: (error: any) => {
                        console.log(error);                    
                      
                      }  
                    });
                    else{                    

                      this.contratService.getParamContratFlotteByIdRisque(hisContrat.idContrat, idRisques).subscribe({              
                        next: async (data: any) => {  
                          dataParam = data

                          //////////console.log("dataParam All Avenant-----")
                          console.log(dataParam)
                        },
                        error: (error: any) => {
                          console.log(error);                    
                        
                        }  
                      });
                    }  
*/
                   
                  
                   
                 }, error: (error) => {
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

      // case "45L":       

      //   risqueListVehicule = this.contrat?.groupeList.filter((groupe: any) => groupe?.risques)
      //   risqueListVehicule?.forEach((groupe: any) => {
      //     if (groupe?.risques) {
      //       groupe.risques.map((risque: any) => {
      //         idRisques.push(risque.idRisque);
      //       });

      //     }
      //   });

      //   this.avenantService.getAttributsAvenant(avenant.idContratAvenant).subscribe({
      //     next: (typeAvenant: any) => {
      //       //console.loghe suis typeav',typeAvenant,avenant)
      //       this.contratService.getContratHistoriqueById(avenant.hisContrat).subscribe({
      //         // next: (hisContrat: any) => {
          
      //         //   this.contratService.getQuittanceById(avenant.idQuittance).subscribe({
      //         //     next: (quittance: any) => {
      //         //        //Get pack
      //         //       this.contratService.getParamContratFlotteByIdRisque(hisContrat.idContrat, idRisques).subscribe({              
      //         //         next: async (dataParam: any) => {
                   
      //         //           if(hisContrat.groupesList.length == 0){
      //         //             Swal.fire(
      //         //               `Ce contrat ne comporte pas de risques `,
      //         //               '',
      //         //               'info'
      //         //             )
                          
      //         //           }else{
      //         //             //|| typeAvenant.typeAvenant.code == "A11"  || typeAvenant.typeAvenant.code == "A18"
      //         //             if(typeAvenant.typeAvenant.code == "A12" || typeAvenant.typeAvenant.code == "A20" || typeAvenant.typeAvenant.code == "A11" || typeAvenant.typeAvenant.code=='A27'){
      //         //               // this.avenantService.outputAvenantLeasing(hisContrat,quittance, dataParam) 
      //         //               this.avenantService.outputAvenantLeasing(hisContrat,quittance, dataParam,typeAvenant) 
      //         //               this.contratService.outputAttestationFlotte(hisContrat,typeAvenant) 
      //         //             }else{
      //         //             //  this.avenantService.outputAvenantLeasing(hisContrat,quittance, dataParam) 
      //         //             if(typeAvenant.typeAvenant.code =="A22" && this.contrat.produit.codeProduit=="45L"){
      //         //               typeAvenant.dateExpirationAvenant=avenant.dateExpirationAvenant
      //         //               //console.logje rentre la ')
      //         //               this.avenantService.outputAvenantFlotte(hisContrat, typeAvenant, quittance, dataParam, {})

      //         //             }else{

      //         //             this.avenantService.outputAvenantLeasing(hisContrat,quittance, dataParam,typeAvenant) 

      //         //             }
      //         //             // this.contratService.outputAttestationFlotte(hisContrat,typeAvenant)
      //         //             }
      //         //           }

                       

      //         //         },
      //         //         error: (error: any) => {
      //         //           console.log(error);                    
                      
      //         //         }
      //         //     });
      //         //    }, error: (error) => {
      //         //       console.log(error);
      //         //     }
      //         //   });
      //         // },
             
             
      //         next: (hisContrat: any) => {

      //           let numMouv : any;                
      //                           hisContrat.nmouvement>1 ? numMouv =hisContrat.nmouvement-1 :numMouv =hisContrat.nmouvement
                
      //                           this.avenantService.getContratPrev(hisContrat.idContrat,numMouv).subscribe({
      //                             next: (hisContratPrev: any) => {
                
                
                
                
                        
      //                         this.contratService.getQuittanceById(avenant.idQuittance).subscribe({
      //                           next: (quittance: any) => {
      //                              //Get pack
      //                             this.contratService.getParamContratFlotteByIdRisque(hisContrat.idContrat, idRisques).subscribe({              
      //                               next: async (dataParam: any) => {
      //                            //////////console.log("dataparam response",dataParam , Response)
      //                                 if(hisContrat.groupesList.length == 0){
      //                                   Swal.fire(
      //                                     `Ce contrat ne comporte pas de risques `,
      //                                     '',
      //                                     'info'
      //                                   )
                                        
      //                                 }else{
                                       
      //                                   if(typeAvenant.typeAvenant.code == "A12" || typeAvenant.typeAvenant.code == "A20" || typeAvenant.typeAvenant.code == "A11"  || typeAvenant.typeAvenant.code == "A18"){
      //                                     this.avenantService.outputAvenantLeasing(hisContrat,quittance, dataParam,typeAvenant) 
      //                                     this.contratService.outputAttestationFlotte(hisContrat,typeAvenant) 
      //                                   }else{
      //                                     if(typeAvenant.typeAvenant.code =="A22" && this.contrat.produit.codeProduit=="45L"){
      //                                       //console.logje rentre la ')
      //                                       typeAvenant.dateExpirationAvenant = avenant.dateExpirationAvenant  
      //                                       this.avenantService.outputAvenantFlotte(hisContrat, typeAvenant, quittance, dataParam,hisContratPrev)
                
      //                                     }
      //                                    this.avenantService.outputAvenantLeasing(hisContrat,quittance, dataParam,typeAvenant) 
      //                                    this.contratService.outputAttestationFlotte(hisContrat,typeAvenant) 
                
      //                                   }
      //                                 }
                
                                      
                
      //                               },
      //                               error: (error: any) => {
      //                                 console.log(error);                    
                                    
      //                               }
      //                           });
      //                          }, error: (error) => {
      //                             console.log(error);
      //                           }
      //                         });
      //                       },
      //                       error: (error: any) => {
      //                         console.log(error);
      //                       }
      //                     });
      //                   },
      //         error: (error: any) => {
      //           console.log(error);
      //         }
      //       });
      //     },
      //     error: (error: any) => {
      //       console.log(error);
      //     }
      //   });
      // break;
    
      case "45L":       

      risqueListVehicule = this.contrat?.groupeList.filter((groupe: any) => groupe?.risques)
      risqueListVehicule?.forEach((groupe: any) => {
        if (groupe?.risques) {
          groupe.risques.map((risque: any) => {
            idRisques.push(risque.idRisque);
          });

        }
      });

      this.avenantService.getAttributsAvenant(avenant.idContratAvenant).subscribe({
        next: (typeAvenant: any) => {
          this.contratService.getContratHistoriqueById(avenant.hisContrat).subscribe({
            next: (hisContrat: any) => {

let numMouv : any;                
                hisContrat.nmouvement>1 ? numMouv =hisContrat.nmouvement-1 :numMouv =hisContrat.nmouvement

                this.avenantService.getContratPrev(hisContrat.idContrat,numMouv).subscribe({
                  next: (hisContratPrev: any) => {




        
              this.contratService.getQuittanceById(avenant.idQuittance).subscribe({
                next: (quittance: any) => {
                   //Get pack
                  this.contratService.getParamContratFlotteByIdRisque(hisContrat.idContrat, idRisques).subscribe({              
                    next: async (dataParam: any) => {
                 //////////console.log("dataparam response",dataParam , Response)
                      if(hisContrat.groupesList.length == 0){
                        Swal.fire(
                          `Ce contrat ne comporte pas de risques `,
                          '',
                          'info'
                        )
                        
                      }else{
                       
                        if(typeAvenant.typeAvenant.code == "A12" || typeAvenant.typeAvenant.code == "A20" || typeAvenant.typeAvenant.code == "A11" 
                           || typeAvenant.typeAvenant.code == "A18"){
                          this.avenantService.outputAvenantLeasing(hisContrat,quittance, dataParam,typeAvenant) 
                          this.contratService.outputAttestationFlotte(hisContrat,typeAvenant) 
                        }else{
                          if(typeAvenant.typeAvenant.code =="A22" && this.contrat.produit.codeProduit=="45L"){
                            ////console.logje rentre la  vouci avenant',avenant)
                            typeAvenant.dateExpirationAvenant = avenant.dateExpirationAvenant  
                            this.avenantService.outputAvenantFlotte(hisContrat, typeAvenant, quittance, dataParam,hisContratPrev)

                          }else{
                            this.avenantService.outputAvenantLeasing(hisContrat,quittance, dataParam,typeAvenant) 
                         this.contratService.outputAttestationFlotte(hisContrat,typeAvenant) 
                          }
                         

                        }
                      }

                      

                    },
                    error: (error: any) => {
                      console.log(error);                    
                    
                    }
                });
               }, error: (error) => {
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
        }, 
       
      });
    },
      });
    break;
      default:
        this.avenantService.getAttributsAvenant(avenant.idContratAvenant).subscribe({
          next: (typeAvenant: any) => {
            this.contratService.getContratHistoriqueById(avenant.hisContrat).subscribe({
              next: (hisContrat: any) => { 
              
                this.contratService.getParamHistoByIdRisque(hisContrat.idHistorique,  hisContrat.groupesList[0].idGroupe, hisContrat.groupesList[0].risques[0].idRisque).subscribe({
                  next: async (dataParam: any) => {
                      hisContrat.risqueList =  Object.values(dataParam)
                     
                       //EXP call get pack/garanties risque by devis, groupe & id risque
                        //  await this.contratService.getPackIdRisque(hisContrat.idContrat, hisContrat.groupesList[0].risques[0].idRisque).subscribe({
                     
                       await this.contratService.getPackIdRisqueHistorique(hisContrat.idHistorique, hisContrat.groupesList[0].risques[0].idRisque).subscribe({
                        next: async (dataPack: any) => {   
                          // //console.logje suis data pack',dataPack)
                  
                        hisContrat.paramContratList = dataPack.garantieList
                        hisContrat.pack = dataPack.pack

                        // //console.loghisContrat.paramContratList',hisContrat.paramContratList)
                        this.contratService.getQuittanceById(avenant.idQuittance).subscribe({
                          
                          next: (quittance: any) => {    
                             typeAvenant.dateExpirationAvenant = avenant.dateExpirationAvenant  
                             if(hisContrat.produit.codeProduit=="95" && (typeAvenant.typeAvenant.code == "A07" || typeAvenant.typeAvenant.code == "A18" ||typeAvenant.typeAvenant.code == "A12"|| typeAvenant.typeAvenant.code=="A168" )) {
                               hisContrat.primeList=quittance.primeList
                               hisContrat.taxeList=quittance.taxeList
                              //  hisContrat.paramContratList= quittance.risqueList?.[0]?.garantieList
                               hisContrat.isAvenant=true;
                               hisContrat.avenantName= typeAvenant?.typeAvenant?.libelle
                               hisContrat.dateEffet=typeAvenant.dateAvenant
                               hisContrat.auditDate=typeAvenant.auditDate

                             }    
                            //  //console.logje suis hiscontrat',hisContrat)

                             avenant.cp ? hisContrat.produit.codeProduit=="95" && (typeAvenant.typeAvenant.code == "A07" || typeAvenant.typeAvenant.code == "A18"||typeAvenant.typeAvenant.code == "A12" || typeAvenant.typeAvenant.code=="A168")?  this.contratService.outputContrat(hisContrat):this.avenantService.outputAvenant(hisContrat, typeAvenant, quittance) : '';
                             avenant.quittance ?  this.contratService.outputQuittance(hisContrat, quittance, typeAvenant) : ''; 
                             (avenant.attestation && typeAvenant.typeAvenant.code != "A22" && hisContrat.produit.codeProduit!="95" && hisContrat.produit.codeProduit!="97") ? this.contratService.outputAttestation(hisContrat, quittance, typeAvenant) : ''; 
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

  openDialogAdd() {
    let getTypeAvenant = {
      idProduit: this.dataSource.data[0].idProduit,
      idAvenantPrecedent: this.dataSource.data[this.dataSource.data.length - 1].idTypeAvenant,
      statut: this.dataSource.data[this.dataSource.data.length - 1].statut.idParam
    }
    this.avenantService.getTypeAvenantbyAvenantPrecedent(getTypeAvenant).subscribe({
      next: (data: any) => {
        const dialogRef = this.dialog.open(SoumettreAvenantComponent, {
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
