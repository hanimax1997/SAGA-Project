

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgencesService } from 'src/app/core/services/agences.service';
import { GenericService } from 'src/app/core/services/generic.service';
//service
import { DevisService } from 'src/app/core/services/devis.service';
import { forkJoin, Subscription } from 'rxjs';
import { SpinnerOverlayService } from 'src/app/core/services/spinner-overlay.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { PackService } from 'src/app/core/services/pack.service';

@Component({
    selector: 'app-gestion-devis-vie',
    templateUrl: './gestion-devis-vie.component.html',
    styleUrls: ['./gestion-devis-vie.component.scss']
  })

  
export class GestionDevisVieComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  devisTable: any;
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.paginator.length = this.devisTable.totalElements;
  //     this.dataSource.paginator = this.paginator;
  //     this.paginator._intl.itemsPerPageLabel = "Nombre d'éléments par page";
  //   });

  // }
  displayedColumns: string[] = ['idDevis', 'dateDevis', 'agence', 'raisonSocialOuNom', 'status', 'action'];
  formFilterDevis: FormGroup | any;
  dataSource = new MatTableDataSource()
  errorHandler = {
    "error": false,
    "msg": ""
  }
  agences: any = []
  statuts: any = []
  nomProduit: any
  roleApproval = false
  lengthElement: any;
  filteredTable = false
  codeProduit: string | null;

  //spinnerSubscription: Subscription
  constructor(private packService:PackService,private dialog: MatDialog, private route: ActivatedRoute, private spinnerOverlayService: SpinnerOverlayService, private genericService: GenericService, private agencesService: AgencesService, private formBuilder: FormBuilder, private router: Router, private devisService: DevisService) { }
  storedRoles: string | null = sessionStorage.getItem("roles");
  devis: any
  isCourtier :boolean = false;
  isBEA :boolean = false;

  agence= parseInt(sessionStorage.getItem("agence")||'0');
  

  ngOnInit(): void {
    this.nomProduit = this.route.snapshot.paramMap.get('nomProduit')
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')

    if (this.storedRoles != null && this.storedRoles.includes("BO"))
      this.roleApproval = true
    //  this.spinnerSubscription = this.spinnerOverlayService.spinner$.subscribe();
    if(this.storedRoles?.includes("COURTIER") || this.storedRoles?.includes("CDC_BEA")){
      this.getAllAgences()
      this.getAllStatus()
      if(this.storedRoles?.includes("COURTIER")){

      this.isCourtier = true

      }else {
        this.isBEA = true
      }
      this.initFormFilter();
      this.submitFilter(0,10)
    }else{
      this.getDevisByProduit(0, 10);

    }


  }
  initFormFilter() {
    this.formFilterDevis = this.formBuilder.group({
      idDevis: [],
      dateDebut: [],
      dateFin: [],
      agence: this.isCourtier || this.isBEA ?[this.agence]:[],
      nom: [],
      prenom: [],
      raisonSocial: [],
      statut: [],
      produit:this.codeProduit

    });
    if(this.isCourtier || this.isBEA){
      this.formFilterDevis.get('agence')?.disable();

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

    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C25").idCategorie).subscribe({
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
      this.getDevisByProduit(value.pageIndex, value.pageSize)
    }else{
      this.submitFilter(value.pageIndex,value.pageSize)
    }
  }
  getDevisByProduit(index: any, size: any) {
    this.devisService.getDevisByCodeProduit(this.route.snapshot.paramMap.get('codeProduit'), size, index).subscribe({
      next: (data: any) => {
        this.devisTable = data
        this.dataSource = new MatTableDataSource(data.content);
        this.lengthElement = this.devisTable.totalElements
        if (this.paginator)
          this.paginator.length = data.totalElements;
        this.dataSource.paginator = this.paginator
        this.getAllAgences()
        this.getAllStatus()
        this.initFormFilter()


      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  redirectToCreation() {
    this.router.navigate(['creation-devis/vie/', this.route.snapshot.paramMap.get('codeProduit'), this.route.snapshot.paramMap.get('nomProduit')]);

  }
  submitFilter(index:number,size:number) {


    if (this.formFilterDevis.valid) {
      if (this.isCourtier || this.isBEA) {
        // If agence is disabled, manually include its value in the submission
        this.formFilterDevis.value.agence = this.agence;
      }
      const submitObject={...this.formFilterDevis.value,produit:this.codeProduit}
      this.devisService.filtresDevis1(submitObject,index,size).subscribe({
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
  navigateToContrat(idDevis: any) {
    this.router.navigateByUrl("creation-contrat/vie/" + this.route.snapshot.paramMap.get('codeProduit') + '/' + this.route.snapshot.paramMap.get('nomProduit') + '/' + idDevis);

  }
  resetTable(formDirective: any) {
    if(this.isCourtier){
      this.submitFilter(0,10)
    this.filteredTable = true
    }else{
      this.getDevisByProduit(0, 10)
    this.filteredTable = false
    }
    this.formFilterDevis.reset
    formDirective.resetForm();
  }
  printDevis(idDevis: number) {
    this.devisService.getDevisById(idDevis).subscribe({
      next: (datas: any) => {
        this.devis = datas;
        this.consultRisque(datas.groupes[0].risques[0].idRisque, datas.groupes[0].idGroupe)

      }, error: (error: any) => {
        this.handleError(error)

      }
    });

  }

  consultRisque(idRisque: any, idGroupe: any) {
    //EXP call get param risque by devis, groupe & id risque
    this.devisService.getParamDevisByIdRisque(this.devis.idDevis, idGroupe, idRisque).subscribe({
      next: async (dataParam: any) => {
        this.devis.risqueList = await Object.values(dataParam)

        if (this.devis.produit.codeProduit == "45F") {
          //Auto flotte
          //EXP call get pack/garanties risque by devis, groupe & id risque
          await this.devisService.getPackIdRisque(this.devis.idDevis, idRisque).subscribe({
            next: async (dataPack: any) => {
              this.devis.paramDevisList = dataPack.garantieList
              this.devis.pack = dataPack.pack

              await this.devisService.outputDevisFlotte(this.devis)
            },
            error: (error: any) => {
              console.log(error);
            }
          });
        } else {
          let primeListRisques: any[]=[];
          let garantiePlafond :any={};
          //the use of for here is because we are doing calls inside the loop if we use map or for each it will not wait for all promises
          for (const grp of this.devis?.groupes || []) {
            for (const risq of grp.risques || []) {
              try {
                  const dataPack: any = await this.devisService.getPackIdRisque(this.devis.idDevis, risq.idRisque).toPromise();
                  dataPack?.primeList?.forEach((element: any) => {
                      if (element?.typePrime?.code === "CP101") {
                          primeListRisques.push({prime:element.prime,id:risq.idRisque});
                      }
                  });
                  dataPack.garantieList.forEach((element:any)=>{
                    if(element?.idGarantie !== 95){
                      garantiePlafond[element?.description]=element?.categorieList?.[0]?.valeur;
                    }
                  })
              } catch (error) {
                  console.log(error);
              }
          }            
          }
          this.devis.primeListRisques = primeListRisques;
          this.devis.garantiePlafond = garantiePlafond;

          //EXP call get pack/garanties risque by devis, groupe & id risque

          await this.devisService.getPackIdRisque(this.devis.idDevis, idRisque).subscribe({
            next: async (dataPack: any) => {
              this.devis.paramDevisList = dataPack.garantieList
              this.devis.pack = dataPack.pack
              console.log(this.devis,"plafond",garantiePlafond)
              const apiCalls = this.devis?.groupes.map((group: any) => 
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
                // Generate all rows
              const gavGarantieTable = garantiesGAV.map(({ title, garantieIndex }) => this.devisService.gavRows(responses, garantieIndex, title));
              this.devis.gavGarantieTable=gavGarantieTable
              await this.devisService.generatePdf(this.devis)
            })
            },
            error: (error: any) => {
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

  handleError(error: any) {

    switch (error.status) {
      case 500: // actif
        this.errorHandler.error = true
        this.errorHandler.msg = "Erreur systeme, veuillez contacter l'administrateur."
        break;
    }

  }
  consultDevis(idDevis: any) {
    this.router.navigate(['consultation/vie/' + this.route.snapshot.paramMap.get('codeProduit') + '/' + this.route.snapshot.paramMap.get('nomProduit') + '/' + idDevis]);
  }
  ApproveDevisDialog(idDevis: any) {
    Swal.fire({
      title: "Voulez-vous approuver ce devis ? ",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: "Refuser",
      confirmButtonText: "Approuver",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
    }).then((result) => {

      this.devisService.approveDevis(idDevis, sessionStorage.getItem("userId"), result.isConfirmed).subscribe({
        next: (datas: any) => {
          this.getDevisByProduit(0, 10);
          Swal.fire(
            datas,
            '',
            'success'
          )
        }, error: (error: any) => {
          this.handleError(error)

        }
      });

    })
  }
}
