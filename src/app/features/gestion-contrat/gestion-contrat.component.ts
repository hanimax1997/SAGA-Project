import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgencesService } from 'src/app/core/services/agences.service';
import { GenericService } from 'src/app/core/services/generic.service';
import * as saveAs from 'file-saver';


import { ContratService } from 'src/app/core/services/contrat.service';
import { DevisService } from 'src/app/core/services/devis.service';
@Component({
  selector: 'app-gestion-contrat',
  templateUrl: './gestion-contrat.component.html',
  styleUrls: ['./gestion-contrat.component.scss']
})
export class GestionContratComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  contratTable: any;
  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.paginator._intl.itemsPerPageLabel = "Nombre d'éléments par page";
  // }
  displayedColumns: string[] = ['N°Police', 'dateEffet', 'agence', 'raisonSocialOuNom', 'status', 'action'];
  formFilterContrat: FormGroup | any;
  dataSource = new MatTableDataSource()
  errorHandler = {
    "error": false,
    "msg": ""
  }
  agences: any = []
  statuts: any = []
  nomProduit: any
  contrat: any
    excel: any

  filteredTable = false
  lengthElement: any;
  isCourtier :boolean = false;
  isBEA :boolean = false;

  agence= parseInt(sessionStorage.getItem("agence")||'0');
  storedRoles = sessionStorage.getItem("roles");
  codeProduit: string | null;


  constructor(private devisService: DevisService, private route: ActivatedRoute, private genericService: GenericService, private agencesService: AgencesService, private formBuilder: FormBuilder, private router: Router, private contratService: ContratService) { }


  ngOnInit(): void {
    this.nomProduit = this.route.snapshot.paramMap.get('nomProduit')
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')

    // this.getContratByProduit(0, 10);
    this.getAllAgences()
    this.getAllStatus()
   // this.initFormFilter()
    if(this.storedRoles?.includes("COURTIER") ||this.storedRoles?.includes("CDC_BEA") ){
      if(this.storedRoles?.includes("CDC_BEA")){
         this.isBEA=true
      }
        else{
            this.isCourtier = true  
        }
  
      this.initFormFilter();
      this.submitFilter(0,10);
    }else{
      this.initFormFilter();
      this.getContratByProduit(0, 10)
    }


  }
  initFormFilter() {
    this.formFilterContrat = this.formBuilder.group({
      idContrat: [],
      dateDebut: [],
      dateFin: [],
      // agence: [],
      agence: (this.isCourtier || this.isBEA)?[this.agence]:[],
      idClient: [],
      nom: [],
      prenom: [],
     
      // produit:this.route.snapshot.paramMap.get('codeProduit')
      produit:this.codeProduit,
      raisonSocial: [],
    });
    if(this.isCourtier || this.isBEA){

      this.formFilterContrat.get('agence')?.disable();
    }

  }
  getAllAgences() {
    this.agencesService.getAllAgence().subscribe({
      next: (data: any) => {
        this.agences = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getAllStatus() {

    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C34").idCategorie).subscribe({
      next: (data: any) => {
        this.statuts = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  onPageChange(value: any) {
    if (!this.filteredTable){
      this.getContratByProduit(value.pageIndex, value.pageSize)

    }else{
      this.submitFilter(value.pageIndex, value.pageSize)
    }
  }
  getContratByProduit(index: any, size: any) {
    this.contratService.getContratByProduit(this.route.snapshot.paramMap.get('codeProduit'), size, index).subscribe({
      next: (data: any) => {
        this.contratTable = data
        this.dataSource = new MatTableDataSource(data.content);
        this.lengthElement = this.contratTable.totalElements

        if (this.paginator)
          this.paginator.length = data.totalElements;
        this.dataSource.paginator = this.paginator
      },
      error: (error) => {
        console.log(error);
      }
    });
  }


  submitFilter(index:number,size:number) {

    if (this.formFilterContrat.valid) {
      if (this.isCourtier || this.isBEA) {
        console.log('mlmlmlml',this.agence)
        // If agence is disabled, manually include its value in the submission
        this.formFilterContrat.value.agence = this.agence;
        

      }

       const submitObject={...this.formFilterContrat.value,produit:this.codeProduit}
      // this.contratService.filtresContrat(this.formFilterContrat.value,index,size).subscribe({
      this.contratService.filtresContrat(submitObject,index,size).subscribe({

        next: (data: any) => {
          this.dataSource = new MatTableDataSource(data.content);
          if (this.paginator)
            this.paginator.length = data.totalElements;
          this.dataSource.paginator = this.paginator
          this.filteredTable = true
          this.lengthElement = data.totalElements
        },
        error: (error) => {

          console.log(error);

        }
      });
    }
  }

  avenant(idContrat: any) {
    this.router.navigate(['consultation-avenants/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + idContrat]);
  }

  resetTable(formDirective: any) {
    if(this.isCourtier ||this.isBEA){
      this.submitFilter(0,10)
      this.filteredTable = true
      }else{
      this.getContratByProduit(0, 10)
      this.filteredTable = false
      }
      this.initFormFilter();
      formDirective.resetForm();
  

  }


  consultRisque(idRisque: any, idGroupe: any) {

    switch (this.contrat.produit.codeProduit) {

      case "45F":

        //Get pack
        this.contratService.getParamContratFlotteByIdRisque(this.contrat.idContrat, idRisque).subscribe({

          next: async (dataParam: any) => {

            await this.contratService.outputContratFlotte(this.contrat, dataParam)
            await this.contratService.getQuittanceById(this.contrat.quittanceList[this.contrat.quittanceList.length - 1]).subscribe({
              next: (quittance: any) => {
                this.contratService.outputAttestationFlotte(this.contrat, quittance);
                this.contratService.outputQuittance(this.contrat, quittance, null);
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

        break;
      case "45L":
        //Get pack
        this.contratService.getParamContratFlotteByIdRisque(this.contrat.idContrat, idRisque).subscribe({
          next: async (dataParam: any) => {
            await this.contratService.getQuittanceById(this.contrat.quittanceList[this.contrat.quittanceList.length - 1]).subscribe({
              next: (quittance: any) => {

                this.contratService.outputLeasing(this.contrat, quittance, dataParam)

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

        break;
      default:
        //EXP call get param risque by devis, groupe & id risque
        this.contratService.getParamContratByIdRisque(this.contrat.idContrat, idGroupe, idRisque).subscribe({
          next: async (dataParam: any) => {
            this.contrat.risqueList = await Object.values(dataParam)

            //EXP call get pack/garanties risque by devis, groupe & id risque
            await this.contratService.getPackIdRisque(this.contrat.idContrat, idRisque).subscribe({
              next: async (dataPack: any) => {

                this.contrat.paramContratList = dataPack.garantieList
                this.contrat.pack = dataPack.pack
                await this.contratService.outputContrat(this.contrat)
                await this.contratService.getQuittanceById(this.contrat.quittanceList[this.contrat.quittanceList.length - 1]).subscribe({
                  next: (quittance: any) => {

                    if (this.contrat.produit.codeProduit == "45A") {
                      this.contratService.outputAttestation(this.contrat, quittance, null);
                    }
                    this.contratService.outputQuittance(this.contrat, quittance, null);
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
        break;

    }


  }

  printContrat(idContrat: number) {

    let risqueListVehicule: any = []
    let idRisques: any = []

    this.contratService.getContratById(idContrat).subscribe({
      next: (datas: any) => {
        this.contrat = datas;

        switch (this.contrat.produit.codeProduit) {

          case "45F":
            risqueListVehicule = this.contrat?.groupeList.filter((groupe: any) => groupe?.risques)
            risqueListVehicule?.forEach((groupe: any) => {
              if (groupe?.risques) {
                groupe.risques.map((risque: any) => {
                  idRisques.push(risque.idRisque);
                });

              }
            });
            this.consultRisque(idRisques, this.contrat.groupeList[0].idGroupe)
            break;
          case "45L":

            risqueListVehicule = this.contrat?.groupeList.filter((groupe: any) => groupe?.risques)
            risqueListVehicule?.forEach((groupe: any) => {
              if (groupe?.risques) {
                groupe.risques.map((risque: any) => {
                  idRisques.push(risque.idRisque);
                });

              }
            });


            this.consultRisque(idRisques, this.contrat.groupeList[0].idGroupe)

            break;
          default:
            this.consultRisque(this.contrat.groupeList[0].risques[0].idRisque, this.contrat.groupeList[0].idGroupe)
            break;


        }




      }, error: (error: any) => {
        this.handleError(error)

      }
    });

  }

  ExtraireFichierExcel(idContrat: number){
    this.contratService.getFichierExcel(idContrat , this.codeProduit).subscribe(
      (blob) => {
        const fileName = `Listes_Des_Risque_${idContrat}.xlsx`;
        saveAs(blob, fileName); 
      },
      (error) => {
        console.error('Erreur lors du téléchargement du fichier Excel', error);
      }
    );
  }


  consultContrat(idContrat: any) {
    this.router.navigate(['consultation-police/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + this.route.snapshot.paramMap.get('nomProduit') + '/' + idContrat]);
  }

  handleError(error: any) {

    switch (error.status) {
      case 500: // actif
        this.errorHandler.error = true
        this.errorHandler.msg = "Erreur systeme, veuillez contacter l'administrateur."
        break;
    }

  }
}
