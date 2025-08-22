import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ProduitService } from 'src/app/core/services/produit.service';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PersonneService } from 'src/app/core/services/personne.service';
import { ReductionService } from 'src/app/core/services/reduction.service';
import { ReductionFiltreJson } from 'src/app/core/models/reduction';
import { SelectionModel } from '@angular/cdk/collections';
import { MatStepper } from '@angular/material/stepper';
import { ConventionService } from 'src/app/core/services/convention.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { MatMenuPanel } from '@angular/material/menu';

// Define interfaces for form groups
interface FormInfoGenerale {
    nomConvention: FormControl<string | null>;
    dateDebut: FormControl<Date | null>;
    dateFin: FormControl<Date | null>;
}

interface FormReductionGroup {
    idProduit: FormControl<number | null>;
    reduction: FormControl<number[] | null>; // Multiple selection
}

interface FormFiltreGroup {
    raisonSociale: FormControl<string | null>;
}

@Component({
    selector: 'app-consult-convention',
    templateUrl: './consult-convention.component.html',
    styleUrls: ['./consult-convention.component.scss']
})
export class ConsultConventionComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('stepper') private stepper: MatStepper;

    // Form Groups
    formReduction: FormGroup<FormReductionGroup>;
    formInfoGenerale: FormGroup<FormInfoGenerale>;
    formFiltre: FormGroup<FormFiltreGroup>;

    // Data Sources and Displayed Columns
    idConvention: any;
    convention: any = [];
    dataSourceReduction: MatTableDataSource<any>;
    dataSourcesReductions = new MatTableDataSource<any>();
    dataSourceClients: MatTableDataSource<any>;
    displayedColumnsReduc: string[] = ['codeReduction', 'nomReduction', 'produitReduction', 'action'];
    displayedColumns: string[] = ['idReduction', 'nomReduction', 'produit', 'action'];
    displayedColumnsClient: string[] = ['action', 'numClient', 'RaisonSociale'];

    // Other Properties
    conventionReady = false;
    typeProduits: any = [];
    reductions: any = [];
    personneMorales: any = [];
    minDate = new Date();
    ReducTab: any = [];
    reducEmpty = true;
    erreurDateDebut = false;
    dateDebut = new Date();
    selectedReductions: number[] = [];
    typeReduction = 261;
    filterReduction = ReductionFiltreJson;
    idProduit: number;
    produitReady: boolean = false;
    conventionSuccess: boolean = false;
    dateFinEntry: boolean = false;
    errorHandler = {
        "error": false,
        "msg": ""
    };
    codeConvention: any;
    bodyConvention: any = {};
    showFormReduction: boolean = false;
    selectedReductionId: number;
menu: MatMenuPanel<any>|null;
    conventionreduction: any;
    temp: any[] | null;
    temp2: any[] | null;
    combinedReductions :any[] | null;
    constructor(
        private produitService: ProduitService,
        private personneService: PersonneService,
        private conventionService: ConventionService,
        private reductionService: ReductionService,
        private router: Router,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.idConvention = this.route.snapshot.paramMap.get('idConvention');
        this.loadConventionData();
        this.getAllProduits();
        this.getAllPersonneMorale();
    }

    // Initialize all form groups
    initForm() {
        // Initialize formInfoGenerale with all required controls
        this.formInfoGenerale = this.formBuilder.group<FormInfoGenerale>({
            nomConvention: new FormControl<string | null>('', Validators.required),
            dateDebut: new FormControl<Date | null>(null, Validators.required),
            dateFin: new FormControl<Date | null>({ value: null, disabled: true }, Validators.required),
        });
      

        // Initialize formReduction with idProduit and reduction as an array
        this.formReduction = this.formBuilder.group<FormReductionGroup>({
            idProduit: new FormControl<number | null>(null, Validators.required),
            reduction: new FormControl<number[] | null>([], Validators.required),
        });

        // Initialize formFiltre with raisonSociale
        this.formFiltre = this.formBuilder.group<FormFiltreGroup>({
            raisonSociale: new FormControl<string | null>('', Validators.required),
        });
console.log("helooo ", this.formInfoGenerale , this.bodyConvention , this.formReduction);

    }
    // Load convention data based on idConvention
    loadConventionData() {
        this.conventionService.getOneConvention(this.idConvention).subscribe({
            next: (datas: any) => {
              console.log ('da00ta',datas)
                this.conventionReady = true;
                this.convention = datas;

                this.dataSourceReduction = new MatTableDataSource(datas.reduction);
                this.dataSourceReduction.data = this.dataSourceReduction.data.map((obj: any) => ({
                    ...obj,
                    produit: { description: this.convention.produit.description }
                }));
                this.dataSourceReduction.paginator = this.paginator;
                this.dataSourceReduction.sort = this.sort;
            },
            error: (error: any) => {
                console.log(error);
                this.handleError(error);
            }
        });
    }

    // Fetch all products
    getAllProduits() {
        this.produitService.getAllProduits().subscribe({
            next: (data: any) => {
                this.typeProduits = data;
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    // Fetch all clients (Personne Morale)
    getAllPersonneMorale() {
        this.personneService.getAllPersonneMorale().subscribe({
            next: (data: any) => {
                this.personneMorales = data;
                this.dataSourceClients = new MatTableDataSource(data);
                this.dataSourceClients.paginator = this.paginator;
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    // Handle reduction selection changes
    onSelectionChange(event: MatSelectChange) {
        const selectedIds = event.value as number[]; // Ensure it's an array
        this.ReducTab = this.reductions.filter((reduc: { idReduction: number; }) => selectedIds.includes(reduc.idReduction));
        this.dataSourcesReductions.data = this.ReducTab;
        this.reducEmpty = this.ReducTab.length === 0;

        
    }

    navigateToCreation() {
        this.router.navigate(['gestion-reduction/creation-reduction']);
    }

    // Refresh reduction list based on selected product type
    refreshListReduction() {
        this.filterReduction.typeReduction = this.typeReduction;
        this.filterReduction.produit = this.idProduit;

        this.reductionService.reductionFiltre(this.filterReduction).subscribe({
            next: (data: any) => {
                this.reductions = data;
                this.formReduction.get("reduction")?.setValue(this.selectedReductions);
                console.log('the real data this reduction puis this selectedre  et this.formred.get reduction', this.reductions ,this.selectedReductions  , this.formReduction.get("reduction") )

            },
            
            error: (error) => {
                console.log(error);
            }
        });
    }

    // Handle product type change
    changeTypeProduit(value: any) {
      console.log('datefinetry',this.dateFinEntry)
        if (this.dateFinEntry)
            this.formReduction.get("reduction")?.enable();
        this.idProduit = value;
        this.refreshListReduction();
        this.produitReady = true;
    }

    // Show the reduction form
    showFormReductionMethod() {
        this.showFormReduction = true;
        this.cdr.detectChanges(); // Ensure the view updates
    }

    // Hide the reduction form
    hideFormReduction() {
        this.showFormReduction = false;
        this.cdr.detectChanges(); // Ensure the view updates
    }

    // Submit the reduction form
    submitReduction() {
if(  (this.formReduction && this.showFormReduction )){
console.log('nenene', this.convention ,this.formReduction ,this.showFormReduction )
const idConvention= this.convention.idConvention
 this.temp =this.convention?.reduction?.map((reduction: { idReduction: any; }) => reduction?.idReduction) || [];// reduction dej existante
 this.temp2 =this.formReduction?.controls?.reduction?.value || [] ;// reduction appliqer
// Concaténation avec this.formReduction.reduction pour garder les reduction deja existante et ajoteer celle ci
this.combinedReductions = this.temp2.concat(this.temp) ;


    
const bodyConventAddRed = {
    nomConvention: this.convention.nomConvention,
    dateDebut: this.convention.dateDebut,
    dateFin: this.convention.dateFin,
    auditUser: this.convention.auditUser,
    reduction: this.combinedReductions // Initialisation de la liste des réductions
};



// Ajout des réductions de this.formReduction.value.reduction à la liste
if (this.formReduction && this.formReduction.value.reduction) {
    this.conventionService.modifConvention(bodyConventAddRed,idConvention).subscribe(data => {
       


        Swal.fire({
            title: "Réduction " + this.combinedReductions + " a été ajouter avec succès",
            icon: 'success',
            allowOutsideClick: false,
            showCancelButton: true,
            // confirmButtonText: `Créer une nouvelle convention`,
            cancelButtonText: `Retour `,
            confirmButtonColor: "#00008F",
            width: 600
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            } else {
                this.router.navigate(['gestion-convention']);
            }
        });
    

      }
    )


}

console.log(bodyConventAddRed);


}
    


      console.log('010101',  this.formReduction , this.formInfoGenerale , this.bodyConvention)
        if ((this.formReduction.valid && this.formInfoGenerale.valid && this.bodyConvention.idClient) ) {
            // Combine form data with convention data
            this.bodyConvention.reduction = this.formReduction.get('reduction')?.value ?? [];
            this.bodyConvention.idProduit = this.formReduction.get("idProduit")?.value;

            // Include convention details not in the form
            this.bodyConvention.nomConvention = this.convention.nomConvention;
            this.bodyConvention.dateDebut = this.convention.dateDebut;
            this.bodyConvention.dateFin = this.convention.dateFin;

            // Submit the combined data
            this.conventionService.addConventions(this.bodyConvention).subscribe({
                next: (data: any) => {
                    Swal.fire({
                        title: "Convention " + data.codeConvention + " a été créée avec succès",
                        icon: 'success',
                        allowOutsideClick: false,
                        showCancelButton: true,
                        confirmButtonText: `Créer une nouvelle convention`,
                        cancelButtonText: `Retour à la liste des conventions`,
                        confirmButtonColor: "#00008F",
                        width: 600
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        } else {
                            this.router.navigate(['gestion-convention']);
                        }
                    });
                },
                error: (error) => {
                    this.handleError(error);
                    this.conventionSuccess = false;
                    console.log(error);
                    Swal.fire({
                        title: "Erreur lors de la création de la convention",
                        text: this.errorHandler.msg,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            });
        }
    }

    // Handle form filter submission
    submitFilter() {
        if (this.formFiltre.valid) {
            const raisonSocialeControl = this.formFiltre.get('raisonSociale');
            if (raisonSocialeControl) { // TypeScript check
                const recherche = (raisonSocialeControl.value ?? '').toLowerCase();
                const resultatsFiltres = this.personneMorales.filter((client: any) =>
                    client.raisonSocial.toLowerCase().includes(recherche)
                );
                this.dataSourceClients.data = resultatsFiltres;
            } else {
                console.error("Form control 'raisonSociale' not found.");
            }
        }
    }

    // Handle navigation to reduction details
    consultReduction(idReduction: any) {
        this.router.navigate(['gestion-reduction/consultation-reduction/' + idReduction]);
    }

    // Handle adding a client
    addClient(value: any, event: any) {
        console.log(value);
        this.bodyConvention.idClient = value.idClient;
    }

    // Handle form submission for general info (if needed)
    submitInfoGenerale(formDirective: any) {
        if (this.formInfoGenerale.valid) {
            // Update bodyConvention with form data
            this.bodyConvention.nomConvention = this.formInfoGenerale.get("nomConvention")?.value ?? '';
            this.bodyConvention.dateDebut = this.formInfoGenerale.get("dateDebut")?.value
                ? moment(this.formInfoGenerale.get("dateDebut")?.value).format('YYYY-MM-DD[T]HH:mm:ss.000Z')
                : '';
            this.bodyConvention.dateFin = this.formInfoGenerale.get("dateFin")?.value
                ? moment(this.formInfoGenerale.get("dateFin")?.value).format('YYYY-MM-DD[T]HH:mm:ss.000Z')
                : '';
            // Proceed to next step if using a stepper
            // this.stepper.next();
        }
    }

    // Delete a selected reduction
    deleteReduction(idReduction: number) {
        this.ReducTab = this.ReducTab.filter((item: any) => item.idReduction !== idReduction);
        this.dataSourcesReductions.data = this.ReducTab;
        this.selectedReductions = this.selectedReductions.filter((id: number) => id !== idReduction);
        this.formReduction.get('reduction')?.setValue(this.selectedReductions);
        this.reducEmpty = this.ReducTab.length === 0;
    }

    // Handle date fin changes
    changeDateFin(dateFin: any) {
        this.ReducTab = [];
        this.dataSourcesReductions.data = [];
        if (dateFin != null) {
            this.dateFinEntry = true;
        }
        if (this.produitReady && dateFin != null) {
            this.formReduction.get("reduction")?.enable();
        }
    }

    // Navigate to creation of reduction in a new tab
    // navigateToReduction() {
    //     console.log(this.formInfoGenerale);
    //     console.log('blabla', this.convention.dateDebut);

    //     const dateDebutControl = this.formInfoGenerale.get("dateDebut");
    //     const dateFinControl = this.formInfoGenerale.get("dateFin");

    //     if ((this.convention.dateDebut != '')) {
    //         const dateDebut = dateDebutControl?.value ? moment(dateDebutControl.value).format('YYYY-MM-DD[T]HH:mm:ss.000Z') : '';
    //         const dateFin = dateFinControl?.value ? moment(dateFinControl.value).format('YYYY-MM-DD[T]HH:mm:ss.000Z') : '';

    //         const url = this.router.serializeUrl(this.router.createUrlTree(['creation-convention/creation-reduction'], {
    //             queryParams: { dateDebut, dateFin }
    //         }));
    //         window.open(url, '_blank');
    //         this.erreurDateDebut = false;
    //     } else {
    //         this.erreurDateDebut = true;
    //     }
    // }

    navigateToReduction() {
        //   this.formConvention.get("dateDebut").setValue(moment(this.formConvention.get("dateDebut").value).format('YYYY-MM-DD'))
        console.log('blabla',this.codeConvention)
    console.log("je suis le this convention",this.convention)
        if (this.convention.dateDebut!= "") {
          const url = this.router.serializeUrl(this.router.createUrlTree(['creation-convention/creation-reduction'], { queryParams: { dateDebut: this.convention.dateDebut, dateFin: this.convention.dateFin} }));
          // open link in new tab
          window.open(url, '_blank');
          this.erreurDateDebut = false
        } else {
          this.erreurDateDebut = true
        }
    
    
      }

    // Handle errors
    handleError(error: any) {
        switch (error.status) {
            case 500:
                this.errorHandler.error = true;
                this.errorHandler.msg = "Erreur système, veuillez contacter l'administrateur.";
                break;
            // Handle other status codes as needed
            default:
                this.errorHandler.error = true;
                this.errorHandler.msg = "Une erreur est survenue.";
        }
    }
}
function combinedList() {
    throw new Error('Function not implemented.');
}

